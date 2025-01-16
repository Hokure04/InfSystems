import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Request } from './Request';

interface RequestCardProps {
    request: Request;
    onAccept: (requestId: number) => void;
    onReject: (requestId: number) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onAccept, onReject }) => {
    return (
        <Box sx={{ padding: 2, marginBottom: 2, border: '1px solid #ccc', borderRadius: 2 }}>
            <Typography variant="h6">{request.username}</Typography>
            <Typography variant="body2">Description: {request.description || 'N/A'}</Typography>
            <Typography variant="body2">Status: {request.status || 'Pending'}</Typography>
            <Box sx={{ marginTop: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="primary" onClick={() => onAccept(request.requestId)}>
                    Принять
                </Button>
                <Button variant="contained" color="error" onClick={() => onReject(request.requestId)}>
                    Отклонить
                </Button>
            </Box>
        </Box>
    );
};

export default RequestCard;
