const db = require("../models");

class UsersController {
    // Получить всех пользователей
    async get(req, res) {
        try {
            const users = await db.Users.findAll({
                attributes: { exclude: ["password"] } // Скрываем пароль при выводе
            });
            return res.status(200).json({ users });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка в get => UsersController" });
        }
    }

    async getAll(req, res) {
        try {
            const { id } = req.params;

            // Находим пользователя
            const user = await db.Users.findByPk(id);
            if (!user) {
                return res.status(404).json({ message: "Пользователь не существует" });
            }

            // Находим все товары в корзине пользователя
            const cartItems = await db.CartItems.findAll({ where: { userId: id } });

            // Извлекаем все gameItemId из корзины
            const gameItemIds = cartItems.map(item => item.gameItemId);

            // Находим все игровые товары + детали к ним
            const gameItems = await db.GameItems.findAll({
                where: { id: gameItemIds },
                include: [{ model: db.GameItemDetails }]
            });

            // Формируем финальный ответ
            return res.status(200).json({
                user: {
                    id: user.id,
                    firstName: user.Name,
                    lastName: user.LastName,
                    email: user.email,
                    // добавь еще поля если надо
                },
                cart: gameItems,
                cartItems: cartItems

            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка в getAll => UsersController" });
        }
    }


    // Обновить пользователя
    async put(req, res) {
        try {
            const { id } = req.params;
            const { Name, LastName, email, password, role } = req.body;

            const user = await db.Users.findByPk(id);
            if (!user) return res.status(404).json({ message: "Пользователь не найден" });

            const updateData = { Name, LastName, email, role };

            // Если новый пароль передан, хешируем его
            if (password) {
                const bcrypt = require("bcrypt");
                updateData.password = await bcrypt.hash(password, 5);
            }

            await user.update(updateData);

            return res.status(200).json({ message: "Пользователь обновлён", user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка в put => UsersController" });
        }
    }

    // Удалить пользователя
    async delete(req, res) {
        try {
            const { id } = req.params;

            const user = await db.Users.findByPk(id);
            if (!user) return res.status(404).json({ message: "Пользователь не найден" });

            await user.destroy();
            return res.status(200).json({ message: "Пользователь удалён" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Ошибка в delete => UsersController" });
        }
    }
}

module.exports = new UsersController();
