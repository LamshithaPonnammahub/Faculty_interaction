const jwt = require('jsonwebtoken');

module.exports = function(role) {
    return function(req, res, next) {
        // Get token from header
        const token = req.header('x-auth-token');

        // Check if not token
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

            req.user = decoded; // Contains id and role

            // Role based access control mapping
            if (role && role !== 'any') {
                if (Array.isArray(role)) {
                   if(!role.includes(req.user.role)) {
                       return res.status(403).json({ message: 'Access denied, insufficient permissions' });
                   }
                } else if (req.user.role !== role) {
                    return res.status(403).json({ message: 'Access denied, insufficient permissions' });
                }
            }

            next();
        } catch (err) {
            res.status(401).json({ message: 'Token is not valid' });
        }
    }
};
