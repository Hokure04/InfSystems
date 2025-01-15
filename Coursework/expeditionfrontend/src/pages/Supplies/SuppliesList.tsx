import React from "react";
import { Box, List, ListItem, ListItemText, Button } from "@mui/material";

interface SuppliesListProps {
    supplies: any[];
    onAddSupply: () => void;
}

const SuppliesList: React.FC<SuppliesListProps> = ({ supplies, onAddSupply }) => {
    return (
        <Box sx={{ marginTop: 4 }}>
            <h3>Список снабжения:</h3>
            <List>
                {supplies.map((supply, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`Category: ${supply.category}`}
                            secondary={`Quantity: ${supply.quantity}, Description: ${supply.description}`}
                        />
                    </ListItem>
                ))}
            </List>

            {/* Кнопка добавления Supply */}
            <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                <Button variant="contained" color="secondary" onClick={onAddSupply}>
                    Добавить снабжение
                </Button>
            </Box>
        </Box>
    );
};

export default SuppliesList;

