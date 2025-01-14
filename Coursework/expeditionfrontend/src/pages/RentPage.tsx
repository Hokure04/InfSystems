import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Divider, Tabs, Tab, Button } from '@mui/material';
import VehicleCard from '../entities/vehicle/VehicleCard.tsx';
import EquipmentCard from '../entities/equipment/EquipmentCard.tsx';
import { Vehicle } from '../entities/vehicle/Vehicle.ts';
import { Equipment } from '../entities/equipment/Equipment.ts';
import api from '../api.ts';

const RentPage: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<number>(0); // 0: Transport, 1: Equipment

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 0) {
                    const response = await api.get('/vehicles');
                    const vehicleList = Array.isArray(response.data?.vehicle_list)
                        ? response.data.vehicle_list
                        : [];
                    setVehicles(vehicleList);
                } else {
                    const response = await api.get('/equipment');
                    const equipmentList = Array.isArray(response.data?.equipment_list)
                        ? response.data.equipment_list
                        : [];
                    console.log('Loaded Equipment:', equipmentList);
                    setEquipment(equipmentList);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                if (activeTab === 0) setVehicles([]);
                else setEquipment([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [activeTab]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
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

            {/* Правая часть: Вкладки и контент */}
            <Box flex="1" display="flex" flexDirection="column">
                {/* Вкладки для переключения */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    centered
                    sx={{ marginBottom: 2 }}
                >
                    <Tab label="Transport" />
                    <Tab label="Equipment" />
                </Tabs>

                <Divider />

                {/* Контент в зависимости от выбранной вкладки */}
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={3}
                    sx={{ marginTop: 3 }}
                >
                    {activeTab === 0 ? (
                        vehicles.length === 0 ? (
                            <p>No vehicles found.</p>
                        ) : (
                            vehicles.map((vehicle) => (
                                <Box key={vehicle.vehicleId} width="85%" maxWidth="1000px">
                                    <VehicleCard vehicle={vehicle} />
                                </Box>
                            ))
                        )
                    ) : equipment.length === 0 ? (
                        <p>No equipment found.</p>
                    ) : (
                        equipment.map((item) => (
                            <Box key={item.equipmentId} width="85%" maxWidth="1000px">
                                <EquipmentCard equipment={item} />
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default RentPage;

