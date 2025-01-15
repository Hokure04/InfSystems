import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Divider, Button, Typography } from '@mui/material';
import ExpeditionCard from '../entities/expedition/ExpeditionCard';
import { Expedition } from '../entities/expedition/Expedition';
import api from '../api';

const ExpeditionPage: React.FC = () => {
    const [expeditions, setExpeditions] = useState<Expedition[]>([]);
    const [loading, setLoading] = useState(true);
    const [userExpeditions, setUserExpeditions] = useState<Expedition[]>([]);
    const [showUserExpeditions, setShowUserExpeditions] = useState(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [buttonText, setButtonText] = useState('Показать мои экспедиции');
    const [noExpeditionsMessage, setNoExpeditionsMessage] = useState<string | null>(null);

    const fetchExpeditions = async () => {
        try {
            const response = await api.get('/expeditions');
            console.log('API Response:', response.data);
            const expeditionList = Array.isArray(response.data?.expedition_list)
                ? response.data.expedition_list
                : [];
            setExpeditions(expeditionList);
        } catch (error) {
            console.error('Error fetching expeditions:', error);
            setExpeditions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser?.id) {
                    setUserId(parsedUser.id);
                } else {
                    console.error('User id not found in storage');
                }
            } catch (error) {
                console.error('Failed to parse user');
            }
        } else {
            console.error('User not found');
        }
    }, []);

    const fetchUserExpeditions = async () => {
        try {
            const response = await api.get(`/users/${userId}/expeditions`);
            if (response.data?.expeditions) {
                setUserExpeditions(response.data.expeditions);
            }
        } catch (error) {
            console.error('Error fetching user expeditions:', error);
        }
    };

    useEffect(() => {
        fetchExpeditions();
    }, []);

    const handleShowUserExpeditions = () => {
        if (!showUserExpeditions) {
            setShowUserExpeditions(true);
            fetchUserExpeditions();
            setButtonText('Показать все экспедиции');
        } else {
            setShowUserExpeditions(false);
            setButtonText('Показать мои экспедиции');
        }
    };

    useEffect(() => {
        if (showUserExpeditions && userExpeditions.length === 0) {
            setNoExpeditionsMessage('Вы не участвуете в экспедициях.');
        } else {
            setNoExpeditionsMessage(null);
        }
    }, [showUserExpeditions, userExpeditions]);

    const handleUpdateExpedition = (updatedExpedition: Expedition) => {
        setExpeditions((prevExpeditions) =>
            prevExpeditions.map((expedition) =>
                expedition.expeditionId === updatedExpedition.expeditionId
                    ? updatedExpedition
                    : expedition
            )
        );
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box display="flex" padding={3}>
            {/* Левая часть: Кнопки */}
            <Box
                flex="0 0 300px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
                sx={{
                    padding: 2,
                    borderRadius: 1,
                    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    sx={{
                        position: 'sticky',
                        top: 0,
                        width: '100%',
                        paddingBottom: 2,
                        zIndex: 1,
                    }}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mb: 2 }}
                        onClick={handleShowUserExpeditions}
                    >
                        {buttonText}
                    </Button>
                    <Button variant="contained" color="primary" sx={{ mb: 2 }}>
                        Button 2
                    </Button>
                    <Button variant="contained" color="primary" sx={{ mb: 2 }}>
                        Button 3
                    </Button>
                </Box>
            </Box>

            {/* Разделительная линия */}
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

            {/* Правая часть: Карточки */}
            <Box
                flex="1"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={3}
                sx={{
                    paddingX: 2,
                }}
            >
                {noExpeditionsMessage && (
                    <Typography color="error" variant="body1" sx={{ mb: 2 }}>
                        {noExpeditionsMessage}
                    </Typography>
                )}

                {showUserExpeditions ? (
                    userExpeditions.length === 0 ? (
                        <p>No expeditions found for this user.</p>
                    ) : (
                        userExpeditions.map((expedition) => (
                            <Box
                                key={expedition.expeditionId}
                                width="85%"
                                maxWidth="1000px"
                            >
                                <ExpeditionCard
                                    expedition={expedition}
                                    onUpdateExpedition={handleUpdateExpedition}
                                />
                            </Box>
                        ))
                    )
                ) : expeditions.length === 0 ? (
                    <p>No expeditions found.</p>
                ) : (
                    expeditions.map((expedition) => (
                        <Box
                            key={expedition.expeditionId}
                            width="85%"
                            maxWidth="1000px"
                        >
                            <ExpeditionCard
                                expedition={expedition}
                                onUpdateExpedition={handleUpdateExpedition}
                            />
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};

export default ExpeditionPage;



