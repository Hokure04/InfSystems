import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Divider, Button } from '@mui/material';
import ExpeditionCard from '../entities/expedition/ExpeditionCard.tsx';
import { Expedition } from '../entities/expedition/Expedition.ts';
import api from '../api.ts';

const ExpeditionPage: React.FC = () => {
    const [expeditions, setExpeditions] = useState<Expedition[]>([]);
    const [loading, setLoading] = useState(true);

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
        fetchExpeditions();
    }, []);

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
                    <Button variant="contained" color="primary" sx={{ mb: 2 }}>
                        Button 1
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
                {expeditions.length === 0 ? (
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
