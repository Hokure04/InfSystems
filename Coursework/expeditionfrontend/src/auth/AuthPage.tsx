import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import LoginForm from '../auth/LoginForm';
import RegistrationForm from '../auth/RegistrationForm';

const AuthPage: React.FC = () => {
    const [showLogin, setShowLogin] = useState(true);

    const handleToggle = () => {
        setShowLogin(!showLogin);
    };

    return (
        <Box
            sx={{
                mt: 5,
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'auto',
                p: 2,
                boxSizing: 'border-box',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 500,
                    p: 3,
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                {showLogin ? (
                    <>
                        <LoginForm />
                        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                            Нет аккаунта?{' '}
                            <Button variant="text" onClick={handleToggle}>
                                Зарегистрироваться
                            </Button>
                        </Typography>
                    </>
                ) : (
                    <>
                        <RegistrationForm />
                        <Typography variant="body2" align="center">
                            Уже есть аккаунт?{' '}
                            <Button variant="text" onClick={handleToggle}>
                                Войти
                            </Button>
                        </Typography>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default AuthPage;
