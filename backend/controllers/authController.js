const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

class AuthController {
    async register(req, res) {
        try {
            const { Name, LastName, email, password, role } = req.body;
    
            if (!Name || !LastName || !email || !password) {
                return res.status(400).json({ message: "Заполните все поля" });
            }
    
            const existingUser = await db.Users.findOne({ where: { email } });
            if (existingUser) return res.status(400).json({ message: "Такой пользователь уже существует" });
    
            const hashPassword = await bcrypt.hash(password, 5);
    
            const user = await db.Users.create({
                Name,
                LastName,
                email,
                password: hashPassword,
                role: role || "user" // По умолчанию user
            });
    
            // Генерация JWT токена
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: "24h" }
            );
    
            // Отправка токена и данных пользователя
            return res.status(201).json({
                message: "Пользователь зарегистрирован",
                token, // Добавление токена в ответ
                user
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка в register => AuthController" });
        }
    }
    
    

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await db.Users.findOne({ where: { email } });
            if (!user) return res.status(404).json({ message: "Пользователь не найден" });

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Неверный пароль" });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                JWT_SECRET,
                { expiresIn: "24h" }
            );

            return res.status(200).json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    Name: user.Name,
                    LastName: user.LastName
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка в login => AuthController" });
        }
    }

}

module.exports = new AuthController();
