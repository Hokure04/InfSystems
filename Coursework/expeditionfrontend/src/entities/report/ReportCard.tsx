import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';
import {Report} from './Report.ts'

interface ReportCardProps {
    report: Report;
}

const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
    return (
        <Card variant="outlined" style={{ marginBottom: 16 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    Report ID: {report.reportId}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Nomination: {report.nomination}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Description: {report.description || 'N/A'}
                </Typography>
                <Typography variant="h6" style={{ marginTop: 16 }}>
                    Supplies:
                </Typography>
                <Box ml={2}>
                    <List>
                        {report.suppliesList.length > 0 ? (
                            report.suppliesList.map((supply) => (
                                <ListItem key={supply.supplyId}>
                                    <ListItemText
                                        primary={supply.category}
                                        secondary={`Quantity: ${supply.quantity}`}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="body2">No supplies available</Typography>
                        )}
                    </List>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ReportCard;