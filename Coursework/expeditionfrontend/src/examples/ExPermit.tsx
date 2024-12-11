import React from 'react';
import { Grid, Container } from '@mui/material';
import {Permit} from "../entities/permit/Permit.ts";
import PermitCard from "../entities/permit/PermitCard.tsx";

// Пример данных для Permit
const examplePermits: Permit[] = [
    {
        permitId: 1,
        permitType: 'Exploration Permit',
        issueDate: '2023-12-01',
        authorityName: 'Ministry of Natural Resources',
    },
    {
        permitId: 2,
        permitType: 'Research Permit',
        issueDate: null,
        authorityName: 'Global Research Council',
    },
];

const ExPermit: React.FC = () => {
    return (
        <div>
            <h1>Permits</h1>
            <Container>
                <Grid container spacing={2}>
                    {examplePermits.map((permit) => (
                        <Grid item xs={12} md={6} key={permit.permitId}>
                            <PermitCard permit={permit} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
};

export default ExPermit;