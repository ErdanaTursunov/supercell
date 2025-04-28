const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Нет авторизации" });
        }

        const token = authHeader.split(' ')[1]; // "Bearer token"
        if (!token) {
            return res.status(401).json({ message: "Нет авторизации" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Сохраняем пользователя в req.user для дальнейшего использования

        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ message: "Нет авторизации" });
    }
};
