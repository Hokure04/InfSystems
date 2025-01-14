import React from 'react';
import {Card, CardContent, Typography, Divider, Box} from '@mui/material';
import CertificateCard from '../certificate/CertificateCard.tsx';
import {Equipment} from './Equipment.ts';

interface EquipmentProps {
    equipment: Equipment;
}

const EquipmentCard: React.FC<EquipmentProps> = ({equipment}) => {
    return (
        <Card  sx={{margin: 2, padding: 2}}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    {equipment.name}
                </Typography>
                <Divider/>
                <Box sx={{marginTop: 2}}>
                    {equipment.description && (
                        <Typography variant="body2">
                            <strong>Description:</strong> {equipment.description}
                        </Typography>
                    )}
                    <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: 1}}>
                        <Typography variant="body2">
                            <strong>Price:</strong> ${equipment.price.toFixed(2)}
                        </Typography>
                        {equipment.status && (
                            <Typography variant="body2">
                                <strong>Status:</strong> {equipment.status}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: 1}}>
                        <Typography variant="body2">
                            <strong>Reservation:</strong> {equipment.reservation ? 'Reserved' : 'Available'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Type:</strong> {equipment.type}
                        </Typography>
                    </Box>
                </Box>

                {equipment.certificates.length > 0 && (
                    <Box sx={{marginTop: 2}}>
                        <Typography variant="h6">Certificates:</Typography>
                        <Box sx={{marginTop: 1}}>
                            {equipment.certificates.map((certificate) => (
                                <CertificateCard key={certificate.certificateId} certificate={certificate}/>
                            ))}
                        </Box>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

};

export default EquipmentCard;