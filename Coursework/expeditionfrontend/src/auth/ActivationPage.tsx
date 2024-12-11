import React, {useEffect, useState} from 'react';
import {useSearchParams, useNavigate} from 'react-router-dom';
import {Box, Typography, Button, Alert, CircularProgress, TextField} from '@mui/material';
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
            await api.get(`/activate`, {params: {token}});
            setSuccess(true);
            setTimeout(() => navigate('/auth'), 2000);
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
            await api.get('/send-activation', {params: {email}});
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
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',

                overflow: 'auto',

                p: 2,
                boxSizing: 'border-box',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    display: 'flex',

                    p: 3,
                    borderRadius: 2,
                    flexDirection: 'column',

                    boxShadow: 3,
                    mx: 'auto',
                    mt: 4,
                    gap: 2,
                    alignItems: 'center',



                }}
            >
                <Typography variant="h4" align="center" gutterBottom>
                    Активация аккаунта
                </Typography>
                {loading ? (
                    <Box sx={{textAlign: 'center'}}>
                        <CircularProgress/>
                        <Typography variant="body1" sx={{mt: 2}}>
                            Пожалуйста, подождите...
                        </Typography>
                    </Box>
                ) : success ? (
                    <Alert severity="success">
                        Аккаунт успешно активирован! Переход на главную страницу...
                    </Alert>
                ) : (
                    <>
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                        <Typography variant="body1" gutterBottom>
                            Укажите email для повторной отправки письма активации:
                        </Typography>
                        <TextField
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Введите ваш email"
                            required
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleResendActivationEmail}
                            disabled={!email || loading}

                        >
                            Повторно отправить письмо
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default ActivationPage;
