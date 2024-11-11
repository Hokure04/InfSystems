import React, { useState, useEffect } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, Typography, Box } from '@mui/material';
import axios from '../api';

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        rememberMe: false,
    });
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const savedLogin = localStorage.getItem('login');
        const savedPassword = localStorage.getItem('password');
        if (savedLogin && savedPassword) {
            setFormData({ login: savedLogin, password: savedPassword, rememberMe: true });
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/login', { login: formData.login, password: formData.password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            if (formData.rememberMe) {
                localStorage.setItem('login', formData.login);
                localStorage.setItem('password', formData.password);
            }
            window.location.href = '/home';
        } catch (error : any) {
            if (error.response?.status === 401) {
                setErrorMessage('Неверный логин или пароль');
            }
        }
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
                Авторизация
            </Typography>
            <TextField label="Username или Email" name="login" value={formData.login} onChange={handleChange} required />
            <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <FormControlLabel
                control={<Checkbox checked={formData.rememberMe} onChange={handleChange} name="rememberMe" />}
                label="Запомнить меня"
            />
            {errorMessage && (
                <Typography color="error" variant="body2" textAlign="center">
                    {errorMessage}
                </Typography>
            )}
            <Button type="submit" variant="contained" color="primary">
                Войти
            </Button>
        </Box>
    );
};

export default LoginForm;
