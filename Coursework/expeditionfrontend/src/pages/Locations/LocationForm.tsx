import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

interface LocationFormProps {
    open: boolean;
    onClose: () => void;
    onAdd: (newLocation: {
        locationId: number;
        locationName: string;
        coordinates: string;
        permitType: string;
        hardLevel: number;
        overallRating: number;
        hazards: [];
    }) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ open, onClose, onAdd }) => {
    const [locationName, setLocationName] = useState("");
    const [coordinates, setCoordinates] = useState("");
    const [permitType, setPermitType] = useState("");
    const [hardLevel, setHardLevel] = useState(0);
    const [overallRating, setOverallRating] = useState(0);

    const handleAdd = () => {
        onAdd({
            locationId: 0,
            locationName,
            coordinates,
            permitType,
            hardLevel,
            overallRating,
            hazards: [],
        });
        setLocationName("");
        setCoordinates("");
        setPermitType("");
        setHardLevel(0);
        setOverallRating(0);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Добавить локацию</DialogTitle>
            <DialogContent>
                <TextField
                    label="Название локации"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Координаты"
                    value={coordinates}
                    onChange={(e) => setCoordinates(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Тип разрешения"
                    value={permitType}
                    onChange={(e) => setPermitType(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Уровень сложности"
                    type="number"
                    value={hardLevel}
                    onChange={(e) => setHardLevel(Number(e.target.value))}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Общий рейтинг"
                    type="number"
                    value={overallRating}
                    onChange={(e) => setOverallRating(Number(e.target.value))}
                    fullWidth
                    margin="normal"
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

export default LocationForm;
