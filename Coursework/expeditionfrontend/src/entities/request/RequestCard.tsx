import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import {Request} from "./Request.ts"

interface RequestCardProps {
    request: Request;
}

const RequestCard: React.FC<RequestCardProps> = ({ request }) => {
    return (
        <Card variant="elevation" style={{ marginBottom: 16 }}>
            <CardContent>
                <Typography variant="h6">Request #{request.requestId}</Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Username: {request.username}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Description: {request.description || 'N/A'}
                </Typography>
                <Typography variant="body1" style={{ marginTop: 8 }}>
                    Status: {request.status || 'N/A'}
                </Typography>
                {request.reasonForRefusal && (
                    <Typography variant="body1" style={{ marginTop: 8 }}>
                        Reason for Refusal: {request.reasonForRefusal}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default RequestCard;