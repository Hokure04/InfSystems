import React from 'react';
import { Card, CardContent, Typography} from '@mui/material';
import {Vehicle} from "./Vehicle.ts";

interface VehicleCardProps {
    vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
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
                    Expeditions:
                </Typography>

            </CardContent>
        </Card>
    );
};

export default VehicleCard;