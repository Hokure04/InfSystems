import React, { useState } from 'react';
import {Box, Button, CircularProgress, Modal, TextField, Typography,} from '@mui/material';
import api from '../../api';

interface RequestModalProps {
    expeditionId: number;
    onClose: () => void;
    onSuccess: () => void;
    open: boolean;
}

const RequestModal: React.FC<RequestModalProps> = ({expeditionId, onClose, onSuccess, open,}) => {
    const [requestDescription, setRequestDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const storedUser = localStorage.getItem('user');
            const user = storedUser ? JSON.parse(storedUser) : null;
            const userId = user?.id;

            if (!userId) {
                throw new Error('User ID not found in localStorage');
            }

            const requestData = { description: requestDescription };
            await api.post(`/expeditions/${expeditionId}/apply/${userId}`, requestData);

            onSuccess();
            onClose();
        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message || 'Failed to submit the request.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Подать заявку
                </Typography>
                <TextField
                    label="Описание"
                    multiline
                    rows={4}
                    fullWidth
                    variant="outlined"
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    sx={{ marginBottom: 2 }}
                />
                {errorMessage && (
                    <Typography variant="body2" color="error" sx={{ marginBottom: 2 }}>
                        {errorMessage}
                    </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Button variant="outlined" onClick={onClose} disabled={loading}>
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Отправить'}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RequestModal;
