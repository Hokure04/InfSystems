import React from "react";
import { Box, Typography, Button, List, ListItem, ListItemText } from "@mui/material";
import { Equipment } from "../../entities/equipment/Equipment.ts";

interface EquipmentListProps {
    equipment: Equipment[];
    onAddEquipment: () => void;
}

const EquipmentList: React.FC<EquipmentListProps> = ({ equipment, onAddEquipment }) => {
    return (
        <Box>
            <Typography variant="h6">Оборудование:</Typography>
            <List>
                {equipment.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={item.name}
                            secondary={`Type: ${item.type}, Price: $${item.price}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" color="secondary" onClick={onAddEquipment}>
                Добавить оборудование
            </Button>
        </Box>
    );
};

export default EquipmentList;
