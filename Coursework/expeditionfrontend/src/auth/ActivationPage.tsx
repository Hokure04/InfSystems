import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Alert, CircularProgress } from '@mui/material';
import api from '../api.ts';

const ActivationPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const token = searchParams.get('token');
    const [email, setEmail] = useState('');

    const handleActivate = async () => {
        setLoading(true);
        setError('');
        try {
            await api.get(`/activate`, { params: { token } });
            setSuccess(true);
            setTimeout(() => navigate('/home'), 2000); // Перенаправление на главную через 2 секунды
        } catch (err: any) {
            setError(err.response?.data?.error || 'Не удалось активировать аккаунт.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendActivationEmail = async () => {
        if (!email) return;

        setLoading(true);
        setError('');
        try {
            await api.get('/send-activation', { params: { email } });
            setError('Письмо для активации повторно отправлено на ваш email.');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Не удалось отправить письмо повторно.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            handleActivate();
        } else {
            setError('Токен не найден в URL.');
            setLoading(false);
        }
    }, [token]);

    return (
        <Box
            sx={{
                maxWidth: 500,
                mx: 'auto',
                mt: 4,
                p: 3,
                borderRadius: 2,
                boxShadow: 3,
                //backgroundColor: '#fff',
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Активация аккаунта
            </Typography>
            {loading ? (
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Пожалуйста, подождите...
                    </Typography>
                </Box>
            ) : success ? (
                <Alert severity="success">
                    Аккаунт успешно активирован! Переход на главную страницу...
                </Alert>
            ) : (
                <>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                    <Typography variant="body1" gutterBottom>
                        Укажите email для повторной отправки письма активации:
                    </Typography>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Введите ваш email"
                        style={{
                            width: '100%',
                            padding: '10px',
                            marginBottom: '10px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleResendActivationEmail}
                        disabled={!email || loading}
                        fullWidth
                    >
                        Повторно отправить письмо
                    </Button>
                </>
            )}
        </Box>
    );
};

export default ActivationPage;
