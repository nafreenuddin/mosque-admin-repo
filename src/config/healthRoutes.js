import express from "express";
import os from "os";

const router = express.Router();

// Mock function to check endpoint health
const checkEndpointHealth = (endpoint) => {
    // Simulate health check logic (e.g., pinging the endpoint)
    // For now, assume all endpoints are healthy
    return { endpoint, status: "healthy" };
};

// List of endpoints to check
const endpoints = [
 // Add more endpoints as needed
    { name: "Auth Service", url: "/api/v1/auth" },
    { name: "Admin Mosque Service", url: "/api/v1/admin/mosque" },
    { name: "Lookup Service", url: "/api/v1/lookup" },
    { name: "Mosque Service", url: "/api/v1/mosques" },
    { name: "Prayer Times Service", url: "/api/v1/mosques/:mosqueId/prayer-times" },
];

// Health check route
router.get("/health", (_req, res) => {
    const endpointStatuses = endpoints.map((ep) =>
        checkEndpointHealth(ep)
    );

    const healthStatus = {
        status: "ok",
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage(),
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        timestamp: new Date(),
        endpoints: endpointStatuses,
    };

    res.json(healthStatus);
});

export default router;