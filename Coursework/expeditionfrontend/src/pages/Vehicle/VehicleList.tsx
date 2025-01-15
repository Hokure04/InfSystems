import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { Vehicle } from "../../entities/vehicle/Vehicle.ts";

interface VehicleListProps {
    vehicles: Vehicle[];
    onAddVehicle: () => void;
}

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onAddVehicle }) => {
    return (
        <Box>
            <Typography variant="h6">Транспорт:</Typography>
            <List>
                {vehicles.map((vehicle, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`${vehicle.type} - ${vehicle.model}`}
                            secondary={`Capacity: ${vehicle.capacity}, Fuel: ${vehicle.fuelType}, Price: $${vehicle.price}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" color="secondary" onClick={onAddVehicle}>
                Добавить транспорт
            </Button>
        </Box>
    );
};

export default VehicleList;
