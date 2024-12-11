import React from 'react';
import {Grid, Container} from '@mui/material';
import SuppliesCard from '../entities/supplies/SuppliesCard';
import {Supplies} from "../entities/supplies/Supplies.ts";

// Примерные данные для Supplies
const exampleSupplies: Supplies[] = [
    {
        supplyId: 1,
        category: 'Food',
        quantity: 50,
        description: 'Canned food for the expedition',

    },
    {
        supplyId: 2,
        category: null, // Отсутствует категория
        quantity: 100,
        description: null, // Отсутствует описание
    },
];

const ExSupplies: React.FC = () => {
    return (
        <div>
            <h1>Supplies</h1>
            <Container>
                <Grid container spacing={2}>
                    {exampleSupplies.map((supplies) => (
                        <Grid item xs={12} md={6} key={supplies.supplyId}>
                            <SuppliesCard supplies={supplies}/>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
};

export default ExSupplies;