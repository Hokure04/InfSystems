import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { Vehicle } from "../../entities/vehicle/Vehicle.ts";

interface VehicleFormProps {
    open: boolean;
    onClose: () => void;
    onAdd: (vehicle: Vehicle) => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ open, onClose, onAdd }) => {
    const [type, setType] = useState("");
    const [model, setModel] = useState("");
    const [capacity, setCapacity] = useState<number>(0);
    const [description, setDescription] = useState("");
    const [fuelConsumption, setFuelConsumption] = useState<number>(0);
    const [fuelType, setFuelType] = useState("");
    const [price, setPrice] = useState<number>(0);

    const handleSubmit = () => {
        const newVehicle: Vehicle = {
            vehicleId: 0,
            type,
            model,
            capacity,
            description,
            status: "available",
            fuelConsumption,
            fuelTankCapacity: 0,
            fuelType,
            reservation: false,
            price,
        };
        onAdd(newVehicle);
        onClose();
        setType("");
        setModel("");
        setCapacity(0);
        setDescription("");
        setFuelConsumption(0);
        setFuelType("");
        setPrice(0);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Добавить новый транспорт</DialogTitle>
            <DialogContent>
                <TextField
                    label="Тип"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Модель"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Вместимость"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                />
                <TextField
                    label="Расход топлива"
                    type="number"
                    value={fuelConsumption}
                    onChange={(e) => setFuelConsumption(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Тип топлива"
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Цена"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSubmit} color="primary">
                    Добавить транспорт
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default VehicleForm;
