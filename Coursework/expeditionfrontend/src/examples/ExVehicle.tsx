import React from 'react';
import { Grid, Container } from '@mui/material';
import VehicleCard from '../entities/vehicle/VehicleCard';
import {Vehicle} from "../entities/vehicle/Vehicle.ts";

// Примерные данные для Vehicle
const exampleVehicles: Vehicle[] = [
    {
        vehicleId: 1,
        type: 'SUV',
        model: 'Toyota Land Cruiser',
        capacity: 5,
        description: 'A robust vehicle for off-road expeditions.',
        status: 'Operational',
        fuelConsumption: 15.5,
        fuelTankCapacity: 93,
        fuelType: 'Diesel',
        reservation: false,
        price: 85000,
    },
    {
        vehicleId: 2,
        type: 'Truck',
        model: 'Ford F-150',
        capacity: 2,
        description: null, // Отсутствует описание
        status: null, // Отсутствует статус
        fuelConsumption: 12.0,
        fuelTankCapacity: 136,
        fuelType: 'Gasoline',
        reservation: true,
        price: 60000,
    },
];

const ExVehicle: React.FC = () => {
    return (
        <div>
            <h1>Vehicles</h1>
            <Container>
                <Grid container spacing={2}>
                    {exampleVehicles.map((vehicle) => (
                        <Grid item xs={12} md={6} key={vehicle.vehicleId}>
                            <VehicleCard vehicle={vehicle} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
};

export default ExVehicle;