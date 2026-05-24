export const authorize = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });

  const role = req.user.role;
  if (!allowedRoles || allowedRoles.length === 0) return next();

  if (allowedRoles.includes(role)) return next();

  return res.status(403).json({ message: "Forbidden" });
};

export default authorize;
