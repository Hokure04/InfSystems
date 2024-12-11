import React from 'react';
import { Grid, Container } from '@mui/material';
import ReportCard from '../entities/report/ReportCard';
import {Report} from '../entities/report/Report.ts'

// Примерные данные для Report
const exampleReports: Report[] = [
    {
        reportId: 1,
        nomination: 'Safety Measures',
        description: 'Detailed analysis of safety measures during the expedition.',
        suppliesList: [
            {
                supplyId: 1, category: 'Tent', quantity: 10,
                description: null
            },
            {
                supplyId: 2, category: 'Sleeping Bags', quantity: 20,
                description: null
            },
        ],
    },
    {
        reportId: 2,
        nomination: 'Resource Allocation',
        description: null, // Отсутствует описание
        suppliesList: [],
    },
];

const ExReport: React.FC = () => {
    return (
        <div>
            <h1>Reports</h1>
            <Container>
                <Grid container spacing={2}>
                    {exampleReports.map((report) => (
                        <Grid item xs={12} md={6} key={report.reportId}>
                            <ReportCard report={report} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
};

export default ExReport;