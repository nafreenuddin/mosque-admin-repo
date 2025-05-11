
import AdminModel   from '../models/adminModel.js';
import adminService from '../services/adminService.js';
import mosqueService from '../services/mosqueService.js';


/** POST /api/admin/register */
export async function registerAdmin(req, res, next) {
  try {
    const { mobile, name, email } = req.body;
    if (!mobile || !name || !email) {
      return res.status(400).json({ error: 'mobile, name & email are required' });
    }
    if (await AdminModel.findByMobile(mobile)) {
      return res.status(409).json({ error: 'Mobile already registered' });
    }
    if (await AdminModel.findByEmail(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const otp = adminService.requestOtp(mobile);
    res.json({ success: true, otp });
  } catch (err) {
    next(err);
  }
}

/** POST /api/admin/verify-register */
export async function verifyRegister(req, res) {
  const { mobile, code, name, email } = req.body;
  if (!mobile || !code || !name || !email) {
    return res.status(400).json({ error: 'mobile, code, name & email are required' });
  }
  try {
    adminService.validateOtp(mobile, code);
    // Only now create the full admin record
    const admin = await AdminModel.create({ mobile, name, email });
    res.json({ success: true, message: 'Registration complete; please log in.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

/** POST /api/admin/login */
export async function loginAdmin(req, res, next) {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({ error: 'mobile is required' });
    }
    const admin = await AdminModel.findByMobile(mobile);
    if (!admin) {
      return res.status(404).json({ error: 'No account for this mobile' });
    }
    const otp = adminService.requestOtp(mobile);
    res.json({ success: true, otp });
  } catch (err) {
    next(err);
  }
}

/** POST /api/admin/verify-login */
export async function verifyLogin(req, res) {
  const { mobile, code } = req.body;
  if (!mobile || !code) {
    return res.status(400).json({ error: 'mobile and code are required' });
  }
  try {
    adminService.validateOtp(mobile, code);
    const admin = await AdminModel.findByMobile(mobile);
    const token = adminService.issueJwt(admin.id);
    res.json({ success: true, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function getMyMosque(req, res, next) {
  try {
    const adminId = req.adminId;         // set by authMiddleware
    const mosque = await mosqueService.findByAdminId(adminId);
    if (!mosque) {
      return res.status(404).json({ error: 'Mosque not found' });
    }
    res.json({ mosque });
  } catch (err) {
    next(err);
  }
}

export async function getMyMosqueStatus(req, res, next) {
  try {
    const adminId = req.adminId;
    const m = await mosqueService.findByAdminId(adminId);
    if (!m) return res.status(404).json({ error: 'No mosque found' });
    return res.json({
      status: m.status,                             // under_review|approved|rejected
      isMosqueApproved: m.is_mosque_approved,       // false until profile done
      review_notes: m.review_notes || null
    });
  } catch (err) {
    next(err);
  }
}
