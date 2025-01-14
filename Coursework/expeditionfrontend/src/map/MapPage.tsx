import React from 'react';
import { Box, Typography } from '@mui/material';
import YandexMapComponent from "./YandexMapComponent.tsx";

const MapPage: React.FC = () => {

    return (
        <Box width={"100%"} height={"100%"} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Typography variant="h4" mb={2}>
                Карта
            </Typography>
            <YandexMapComponent height={"60%"} width={"90%"} options={true} initialRoute={""}>
            </YandexMapComponent>
        </Box>
    );
};

export default MapPage;