const jwt = require("jsonwebtoken");
const Provider = require("../Models/providerModel");

/**
 * Unified authentication middleware
 * Checks token from Authorization header and verifies role
 *
 * @param {string|string[]} allowedRoles - Role(s) allowed to access the route
 * @returns {Function} Express middleware function
 */
const authenticate = (allowedRoles = ["user", "admin"]) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "JWT not found. Please provide a valid token." });
      }

      const token = authHeader.split(" ")[1];

      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);

      if (!verifiedToken || !verifiedToken.id) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      if (!roles.includes(verifiedToken.role)) {
        return res.status(403).json({
          error: `Access denied. Required role: ${roles.join(" or ")}`
        });
      }

      // Attach user info to request
      req.user = {
        _id: verifiedToken.id,
        id: verifiedToken.id,
        role: verifiedToken.role
      };
      req.userRole = verifiedToken.role;
      req.token = verifiedToken;

      next();
    } catch (error) {
      console.error("Auth error:", error.message);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired. Please login again." });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
      }

      return res.status(401).json({ error: "Authorization failed" });
    }
  };
};

// Convenience middleware
const authUser = authenticate(["user", "provider", "admin"]);
const authAdmin = authenticate("admin");
const authUserOrAdmin = authenticate(["user", "admin"]);
const authProvider = authenticate(["user", "provider"]);

/**
 * Middleware for routes that require verified provider profile
 */
const authVerifiedProvider = (req, res, next) => {
  authenticate(["user", "provider"])(req, res, async () => {
    try {
      const userId = req.user && (req.user._id || req.user.id);
      if (!userId) return res.status(401).json({ error: "Unauthorized" });

      const provider = await Provider.findOne({ user: userId });
      if (!provider) return res.status(403).json({ error: "Provider profile not found" });

      if (provider.verificationStatus !== "verified") {
        return res.status(403).json({ error: "Provider not verified by admin" });
      }

      req.provider = provider;
      next();
    } catch (error) {
      console.error("authVerifiedProvider error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
};

// Export everything in one object
module.exports = {
  authenticate,
  authUser,
  authAdmin,
  authUserOrAdmin,
  authProvider,
  authVerifiedProvider
};
