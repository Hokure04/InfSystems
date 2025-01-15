import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {Hazard} from "./Hazard.ts";


interface HazardCardProps {
    hazard: Hazard;
}

const HazardCard: React.FC<HazardCardProps> = ({ hazard }) => {
    return (
        <Card style={{ marginBottom: 16 }} variant="elevation">
            <CardContent>
                <Typography variant="h6" component="div">
                    Hazard ID: {hazard.hazardId}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Description: {hazard.description}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Risk Level: {hazard.riskLevel}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default HazardCard;