import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

interface SuppliesFormProps {
    open: boolean;
    onClose: () => void;
    onAdd: (newSupply: { category: string, quantity: number, description: string }) => void;
}

const SuppliesForm: React.FC<SuppliesFormProps> = ({ open, onClose, onAdd }) => {
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [description, setDescription] = useState("");

    const handleAdd = () => {
        onAdd({ category, quantity, description });
        setCategory("");
        setQuantity(0);
        setDescription("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Добавить снабжение</DialogTitle>
            <DialogContent>
                <TextField
                    label="Категория"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Количество"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
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
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button onClick={handleAdd} color="primary">
                    Добавить
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default SuppliesForm;