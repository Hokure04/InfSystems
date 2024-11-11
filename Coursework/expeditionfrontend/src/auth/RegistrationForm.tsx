import React, { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';
import axios from '../api';

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        name: '',
        surname: '',
        phoneNumber: '',
        vehicleType: '',
        expeditionRole: '',
        skill: '',
        aboutUser: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/register', formData);
            setSuccessMessage(`Регистрация успешна! Письмо отправлено на ${formData.email}.`);
        } catch (error) {
            console.error('Ошибка регистрации:', error);
        }
    };

    const handleSendActivationAgain = async () => {
        setIsButtonDisabled(true);
        await axios.get(`/send-activation?email=${formData.email}`);
        setTimeout(() => setIsButtonDisabled(false), 60000);
    };

    return (
        <Box
            component="form"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
                mt: 4,
            }}
            onSubmit={handleSubmit}
        >
            <Typography variant="h5" component="h2" textAlign="center">
                Регистрация
            </Typography>
            <TextField label="Username" name="username" onChange={handleChange} required />
            <TextField label="Email" name="email" type="email" onChange={handleChange} required />
            <TextField label="Password" name="password" type="password" onChange={handleChange} required />
            <TextField label="Имя" name="name" onChange={handleChange} required />
            <TextField label="Фамилия" name="surname" onChange={handleChange} required />
            <TextField label="Номер телефона" name="phoneNumber" onChange={handleChange} />
            <TextField label="Тип транспортного средства" name="vehicleType" onChange={handleChange} />
            <TextField label="Роль в экспедиции" name="expeditionRole" onChange={handleChange} />
            <TextField label="Навык" name="skill" onChange={handleChange} />
            <TextField label="Информация о пользователе" name="aboutUser" onChange={handleChange} multiline rows={3} />

            <Button type="submit" variant="contained" color="primary">
                Зарегистрироваться
            </Button>

            {successMessage && (
                <Box mt={2} textAlign="center">
                    <Typography>{successMessage}</Typography>
                    <Button onClick={handleSendActivationAgain} disabled={isButtonDisabled} variant="outlined">
                        Отправить письмо повторно
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default RegistrationForm;
