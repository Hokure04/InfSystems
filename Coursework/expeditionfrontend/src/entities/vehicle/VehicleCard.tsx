import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { Vehicle } from "./Vehicle.ts";
import api from '../../api.ts';

interface Expedition {
    id: number;
    name: string;
}

interface VehicleCardProps {
    vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
    const [expeditions, setExpeditions] = useState<Expedition[]>([]);
    const [selectedExpedition, setSelectedExpedition] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<number | null>(null);

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

    useEffect(() => {
        const fetchExpeditions = async () => {
            if (!userId) return;
            try {
                const response = await api.get(`/users/${userId}/expeditions`);
                const expeditionsData = response.data.expeditions || [];
                console.log("Полученные экспедиции:", expeditionsData);
                setExpeditions(expeditionsData);
                setSelectedExpedition(expeditionsData.length > 0 ? String(expeditionsData[0].id) : null);
            } catch (error) {
                console.error('Ошибка загрузки экспедиций:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpeditions();
    }, [userId]);

    const handleRentVehicle = async () => {
        if (!selectedExpedition) {
            console.error('Экспедиция не выбрана.');
            return;
        }

        try {
            const expeditionId = parseInt(selectedExpedition, 10);
            const response = await api.post(`/vehicles/${vehicle.vehicleId}/expeditions/${expeditionId}`);
            console.log('Транспортное средство добавлено в экспедицию:', response.data.message);
        } catch (error: any) {
            const message = error.response?.data?.Message || "Ошибка при добавлении транспортного средства в экспедицию.";
            console.error(message);
        }
    };


    return (
        <Card variant="outlined" style={{ marginBottom: 16 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Vehicle ID: {vehicle.vehicleId}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Type: {vehicle.type}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Model: {vehicle.model}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Capacity: {vehicle.capacity} passengers
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Description: {vehicle.description || 'N/A'}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Status: {vehicle.status || 'N/A'}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Fuel Consumption: {vehicle.fuelConsumption} L/100km
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Fuel Tank Capacity: {vehicle.fuelTankCapacity} L
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Fuel Type: {vehicle.fuelType}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Reservation: {vehicle.reservation ? 'Reserved' : 'Available'}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Price: ${vehicle.price.toFixed(2)}
                </Typography>
                <Typography variant="h6" style={{ marginTop: 16 }}>
                    Экспедиции:
                </Typography>
                {loading ? (
                    <Typography variant="body2" style={{ marginTop: 8 }}>
                        Загрузка экспедиций...
                    </Typography>
                ) : expeditions.length > 0 ? (
                    <FormControl fullWidth style={{ marginTop: 8 }}>
                        <InputLabel id="expedition-select-label">Экспедиция</InputLabel>
                        <Select
                            labelId="expedition-select-label"
                            value={selectedExpedition ?? ''}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                console.log('Выбрана новая экспедиция:', newValue);
                                setSelectedExpedition(newValue);
                            }}
                        >
                            {expeditions.map((expedition, index) => (
                                <MenuItem
                                    key={`expedition-${expedition.id ?? index}`}
                                    value={String(expedition.id ?? index+1)}
                                >
                                    {expedition.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <Typography variant="body2" style={{ marginTop: 8, fontStyle: 'italic' }}>
                        Экспедиций нет.
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 16 }}
                    onClick={handleRentVehicle}
                    disabled={loading || expeditions.length === 0}
                >
                    Арендовать транспорт для экспедиции
                </Button>
            </CardContent>
        </Card>
    );
};
export default VehicleCard;

