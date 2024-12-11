import React from 'react';
import { Grid, Container } from '@mui/material';
import RouteCard from '../route/RouteCard';
import {Route} from "../route/Route.ts";

// Примерные данные маршрутов
const exampleRoutes: Route[] = [
    {
        routeId: 1,
        startPoint: 'Main Street',
        endPoint: 'Downtown',
        distance: 15.5,
        locations: [
            {
                locationId: 1,
                locationName: 'Downtown',
                coordinates: '40.7128, -74.0060',
                permitType: 'Building Permit',
                hardLevel: 5,
                overallRating: 4.7,
                hazards: [
                    { hazardId: 1, description: 'Flooding risk', riskLevel: 3 },
                    { hazardId: 2, description: 'Traffic congestion', riskLevel: 4 },
                ],
            },
        ],
    },
    {
        routeId: 2,
        startPoint: 'Route 66',
        endPoint: 'Suburb',
        distance: 20.0,
        locations: [
            {
                locationId: 2,
                locationName: 'Suburb',
                coordinates: '34.0522, -118.2437',
                permitType: 'Construction Permit',
                hardLevel: 8,
                overallRating: 3.5,
                hazards: [
                    { hazardId: 3, description: 'Earthquake-prone zone', riskLevel: 4 },
                ],
            },
        ],
    },
];

const ExRoute: React.FC = () => {
    return (
        <div>
            <h1>Routes</h1>
            <Container>
                <Grid container spacing={2}>
                    {exampleRoutes.map((route) => (
                        <Grid item xs={12} md={6} key={route.routeId}>
                            <RouteCard route={route} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
};

export default ExRoute;