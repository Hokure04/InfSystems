import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Divider, Button } from '@mui/material';
/*import EquipmentCard from '../entities/equipment/EquipmentCard.tsx';
import { Equipment } from '../entities/equipment/Equipment.ts';*/
import VehicleCard from '../entities/vehicle/VehicleCard.tsx';
import { Vehicle } from '../entities/vehicle/Vehicle.ts';
import api from '../api.ts';


const RentPage: React.FC = () =>{
    const[vehicles, setVehicles] = useState<Vehicle[]>([])
    const [loading, setLoading] = useState(true);

    const fetchVehicles = async() => {
        try{
            const response = await api.get('/vehicles')
            console.log('API Response:', response.data);
            const vehicleList = Array.isArray(response.data?.vehicle_list)
                ? response.data.vehicle_list
                : [];
            setVehicles(vehicleList)
        }catch(error){
            console.error('Error fetching vehicles:', error);
            setVehicles([]);
        } finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchVehicles();
    }, []);

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

            {/* Правая часть: Карточки транспорта */}
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
                {vehicles.length === 0 ? (
                    <p>No vehicles found.</p>
                ) : (
                    vehicles.map((vehicle) => (
                        <Box
                            key={vehicle.vehicleId}
                            width="85%"
                            maxWidth="1000px"
                        >
                            <VehicleCard vehicle={vehicle} />
                        </Box>
                    ))
                )}
            </Box>
        </Box>
    );
};
export default RentPage;
