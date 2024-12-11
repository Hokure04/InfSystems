import React, { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {Equipment} from "../equipment/Equipment.ts";
import EquipmentCard from "../equipment/EquipmentCard.tsx";

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



    const sampleEquipment: Equipment = {
        equipmentId: 1,
        name: "Excavator X200",
        description: "A high-performance excavator suitable for heavy-duty operations.",
        price: 125000.0,
        status: "Operational",
        reservation: false,
        type: "Heavy Machinery",
        certificates: [
            {
                certificateId: 1,
                name: "Safety Certificate",
                description: "Certifies that the equipment meets all safety standards.",
                status: "Valid",
                serialNumber: "SN-EX200-001",
                equipment: { equipmentId: 1, name: "Excavator X200" },
            },
            {
                certificateId: 2,
                name: "Environmental Certificate",
                description: "Proves the equipment is environmentally friendly.",
                status: "Expired",
                serialNumber: "SN-EX200-002",
                equipment: { equipmentId: 1, name: "Excavator X200" },
            },
        ],
    };






    return (
        <Box sx={{p: 4, textAlign: 'center'}}>
            <Typography variant="h4" gutterBottom>
                Добро пожаловать, {user?.name} {user?.surname}!
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                Здесь вы можете просмотреть свои данные и настройки профиля.
            </Typography>

            {user && (
                <Box sx={{mt: 4, textAlign: 'left', maxWidth: 500, mx: 'auto'}}>
                    <Typography variant="h6">Информация о пользователе</Typography>
                    <Typography><strong>Имя пользователя:</strong> {user.username}</Typography>
                    <Typography><strong>Email:</strong> {user.email}</Typography>
                    {user.phoneNumber && <Typography><strong>Телефон:</strong> {user.phoneNumber}</Typography>}
                    {user.vehicleType && <Typography><strong>Тип транспорта:</strong> {user.vehicleType}</Typography>}
                    {user.expeditionRole &&
                        <Typography><strong>Роль в экспедиции:</strong> {user.expeditionRole}</Typography>}
                    {user.skill && <Typography><strong>Навыки:</strong> {user.skill}</Typography>}
                    {user.aboutUser && <Typography><strong>О себе:</strong> {user.aboutUser}</Typography>}
                </Box>
            )}

            <Button
                onClick={handleLogout}
                variant="contained"
                color="secondary"
                sx={{mt: 4}}
            >
                Выйти
            </Button>

            <Box width={600}>
                <EquipmentCard equipment={sampleEquipment}/>
            </Box>
        </Box>
    );
};

export default HomePage;
