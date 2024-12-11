import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    surname: string;
    phoneNumber?: string;
    vehicleType?: string;
    expeditionRole?: string;
    skill?: string;
    aboutUser?: string;
}

const HomePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            // Если пользователь не авторизован, перенаправляем на страницу входа
            navigate('/auth');
        }
    }, [navigate]);

    const handleLogout = () => {
        // Удаляем данные из localStorage при выходе
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth');
    };

    return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Добро пожаловать, {user?.name} {user?.surname}!
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Здесь вы можете просмотреть свои данные и настройки профиля.
            </Typography>

            {user && (
                <Box sx={{ mt: 4, textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
                    <Typography variant="h6">Информация о пользователе</Typography>
                    <Typography><strong>Имя пользователя:</strong> {user.username}</Typography>
                    <Typography><strong>Email:</strong> {user.email}</Typography>
                    {user.phoneNumber && <Typography><strong>Телефон:</strong> {user.phoneNumber}</Typography>}
                    {user.vehicleType && <Typography><strong>Тип транспорта:</strong> {user.vehicleType}</Typography>}
                    {user.expeditionRole && <Typography><strong>Роль в экспедиции:</strong> {user.expeditionRole}</Typography>}
                    {user.skill && <Typography><strong>Навыки:</strong> {user.skill}</Typography>}
                    {user.aboutUser && <Typography><strong>О себе:</strong> {user.aboutUser}</Typography>}
                </Box>
            )}

            <Button
                onClick={handleLogout}
                variant="contained"
                color="secondary"
                sx={{ mt: 4 }}
            >
                Выйти
            </Button>
        </Box>
    );
};

export default HomePage;
