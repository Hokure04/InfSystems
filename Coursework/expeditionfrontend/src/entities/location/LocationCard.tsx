import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import HazardCard from '../hazard/HazardCard.tsx'; // Импорт HazardCard
import {Location} from './Location.ts';

interface LocationCardProps {
    location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
    return (
        <Card variant="outlined" style={{ marginBottom: 16 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Location ID: {location.locationId}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Name: {location.locationName}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Coordinates: {location.coordinates}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Permit Type: {location.permitType}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Hard Level: {location.hardLevel}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Overall Rating: {location.overallRating.toFixed(2)}
                </Typography>
                <Typography variant="h6" style={{ marginTop: 16 }}>
                    Hazards:
                </Typography>
                <Box ml={2}>
                    <Grid container spacing={2}>
                        {location.hazards.map((hazard) => (
                            <Grid item xs={12} md={6} key={hazard.hazardId}>
                                <HazardCard hazard={hazard} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default LocationCard;