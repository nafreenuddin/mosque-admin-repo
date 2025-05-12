import { hashPin, verifyPin } from '../src/utils/pinUtil.js';
test('hash/verify PIN', async () => {
  const h = await hashPin('1234');
  expect(await verifyPin('1234', h)).toBe(true);
  expect(await verifyPin('0000', h)).toBe(false);
});
