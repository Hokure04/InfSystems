import React, { useState } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const mapTypes = [
    { value: 'yandex#map', label: 'Карта' },
    { value: 'yandex#satellite', label: 'Спутник' },
    { value: 'yandex#hybrid', label: 'Гибрид' },
];

const MapSettings: React.FC = () => {
    const [mapType, setMapType] = useState<string | undefined>(localStorage.getItem('mapType') || undefined);
    const navigate = useNavigate();

    const handleMapTypeChange = (_: any, newMapType: string | null) => {
        if (newMapType) {
            setMapType(newMapType);
            localStorage.setItem('mapType', newMapType);
        }
    };

    return (
        <Box p={3}>
            <Typography variant="h4" mb={2}>
                Настройки карты
            </Typography>

            <ToggleButtonGroup
                value={mapType}
                exclusive
                onChange={handleMapTypeChange}
                aria-label="map type selection"

            >
                {mapTypes.map((type) => (
                    <ToggleButton key={type.value} value={type.value} aria-label={type.label}>
                        {type.label}
                    </ToggleButton>
                ))}
            </ToggleButtonGroup>
            <Button variant="contained" color="primary" onClick={() => navigate('/map')}>
                Вернуться к карте
            </Button>

        </Box>
    );
};

export default MapSettings;