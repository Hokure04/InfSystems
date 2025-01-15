import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { Equipment } from "../../entities/equipment/Equipment.ts";

interface EquipmentFormProps {
    open: boolean;
    onClose: () => void;
    onAdd: (equipment: Equipment) => void;
}

const EquipmentForm: React.FC<EquipmentFormProps> = ({ open, onClose, onAdd }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [type, setType] = useState("");

    const handleSubmit = () => {
        const newEquipment: Equipment = {
            equipmentId: 0,
            name,
            description,
            price,
            status: "available",
            reservation: false,
            type,
            certificates: [],
        };
        onAdd(newEquipment);
        onClose();
        setName("");
        setDescription("");
        setPrice(0);
        setType("");
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Добавить новое оборудование</DialogTitle>
            <DialogContent>
                <TextField
                    label="Название"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    label="Цена"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Тип"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Добавить оборудование
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EquipmentForm;
