import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import LocationCard from '../location/LocationCard.tsx';
import {Route} from "./Route.ts"; // Импорт LocationCard

interface RouteCardProps {
    route: Route;
}

const RouteCard: React.FC<RouteCardProps> = ({ route }) => {
    return (
        <Card variant="elevation" style={{ marginBottom: 16 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Route ID: {route.routeId}
                </Typography>
                {/*<Typography variant="body1" style={{ marginTop: 8 }}>*/}
                {/*    Start Point: {route.startPoint}*/}
                {/*</Typography>*/}
                {/*<Typography variant="body1" style={{ marginTop: 8 }}>*/}
                {/*    End Point: {route.endPoint}*/}
                {/*</Typography>*/}
                {/*<Typography variant="body1" style={{ marginTop: 8 }}>*/}
                {/*    Distance: {route.distance.toFixed(2)} km*/}
                {/*</Typography>*/}
                <Typography variant="h6" style={{ marginTop: 16 }}>
                    Locations:
                </Typography>
                <Box ml={2}>
                    <Grid container spacing={2}>
                        {route.locations.map((location) => (
                            <Grid item xs={12} md={6} key={location.locationId}>
                                <LocationCard location={location} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RouteCard;