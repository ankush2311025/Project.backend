
import jwt from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);

        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

export default verifyAdmin;
