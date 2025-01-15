import React from 'react';
import {Card, CardContent, Typography, Divider, Box} from '@mui/material';
import {Certificate} from "./Certificate.ts";

interface CertificateProps {
    certificate: Certificate;
}

const CertificateCard: React.FC<CertificateProps> = ({ certificate }) => {
    return (
        <Card sx={{ margin: 2, padding: 2 }} variant="elevation">
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    {certificate.name}
                </Typography>
                <Divider />
                <Box sx={{ marginTop: 2 }}>
                    <Typography variant="body1">
                        <strong>Serial Number:</strong> {certificate.serialNumber}
                    </Typography>
                    {certificate.description && (
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                            <strong>Description:</strong> {certificate.description}
                        </Typography>
                    )}
                    {certificate.status && (
                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                            <strong>Status:</strong> {certificate.status}
                        </Typography>
                    )}
                    <Typography variant="body2" sx={{ marginTop: 1 }}>
                        <strong>Equipment:</strong> {certificate.equipment.name} (ID: {certificate.equipment.equipmentId})
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};


export default CertificateCard;