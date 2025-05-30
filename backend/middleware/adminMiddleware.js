module.exports = function (req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Нет авторизации" });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Доступ только для админов" });
    }

    next();
}
