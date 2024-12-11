import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {Permit} from "./Permit.ts";

interface PermitCardProps {
    permit: Permit;
}

const PermitCard: React.FC<PermitCardProps> = ({ permit }) => {
    return (
        <Card variant="outlined" style={{ marginBottom: 16 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Permit ID: {permit.permitId}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Type: {permit.permitType}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Issue Date: {permit.issueDate ? permit.issueDate : 'N/A'}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Issued By: {permit.authorityName}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default PermitCard;