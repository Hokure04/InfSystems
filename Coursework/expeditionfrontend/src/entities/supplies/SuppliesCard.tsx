import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {Supplies} from "./Supplies.ts";

interface SuppliesCardProps {
    supplies: Supplies;
}

const SuppliesCard: React.FC<SuppliesCardProps> = ({ supplies }) => {
    return (
        <Card variant="elevation" style={{ marginBottom: 16 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Supply ID: {supplies.supplyId}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Category: {supplies.category || 'N/A'}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Quantity: {supplies.quantity}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Description: {supplies.description || 'N/A'}
                </Typography>
                <Typography variant="h6" style={{ marginTop: 16 }}>
                    Expeditions:
                </Typography>
            </CardContent>
        </Card>
    );
};

export default SuppliesCard;