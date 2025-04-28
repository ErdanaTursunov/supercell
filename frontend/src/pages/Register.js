import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    Name: '',
    LastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        Name: formData.Name,
        LastName: formData.LastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      const response = await axios.post('http://localhost:4000/api/auth/register', registrationData);

      if (response.data && response.data.token && response.data.user) {
        // Важно, чтобы данные user и token были в ответе
        login({ token: response.data.token, user: response.data.user });
        navigate('/');
      } else {
        setError('Не удалось получить правильный ответ от сервера');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации. Пожалуйста, попробуйте снова.');
      console.error('Ошибка регистрации:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        <div className="register-header">
          <h2>Присоединяйтесь к Brawl Stars</h2>
          <div className="brawl-stars-logo"></div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="Name">Имя</label>
              <input
                type="text"
                id="Name"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Введите ваше имя"
              />
            </div>

            <div className="form-group">
              <label htmlFor="LastName">Фамилия</label>
              <input
                type="text"
                id="LastName"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Введите вашу фамилию"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Электронная почта</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Введите вашу почту"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Придумайте пароль"
              minLength="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Подтвердите пароль"
            />
          </div>

          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className="register-footer">
          <p>Уже есть аккаунт? <Link to="/login" className="login-link">Войти</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
