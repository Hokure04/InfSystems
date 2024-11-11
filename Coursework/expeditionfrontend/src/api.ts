import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Укажите здесь базовый URL для вашего API, например 'http://localhost:8080/api' в dev режиме
    headers: {
        'Content-Type': 'application/json',
    },
});

// Добавляем интерцептор для автоматической подстановки токена авторизации
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error: any) => {
    return Promise.reject(error);
});

export default api;
