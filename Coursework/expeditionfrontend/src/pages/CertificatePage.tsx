import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, CircularProgress, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import api from '../api'; // Assuming you have your API setup for making requests.

const CertificatePage: React.FC = () => {
    const [equipmentList, setEquipmentList] = useState<any[]>([]);
    const [certificateName, setCertificateName] = useState('');
    const [certificateDescription, setCertificateDescription] = useState('');
    const [certificateStatus, setCertificateStatus] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [selectedEquipment, setSelectedEquipment] = useState<number | string>('');
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch all equipment for dropdown
    useEffect(() => {
        const fetchEquipmentList = async () => {
            try {
                const response = await api.get('/equipment');
                setEquipmentList(response.data.equipment_list);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setErrorMessage('Error fetching equipment list');
            }
        };
        fetchEquipmentList();
    }, []);

    const handleCreateCertificate = async () => {
        setSuccessMessage('');
        setErrorMessage('');

        if (!selectedEquipment || !certificateName || !certificateDescription || !serialNumber) {
            setErrorMessage('All fields are required!');
            return;
        }

        try {
            const response = await api.post(`/equipment/${selectedEquipment}/certificates`, {
                name: certificateName,
                description: certificateDescription,
                status: certificateStatus,
                serialNumber: serialNumber,
            });
            console.log(response);
            setSuccessMessage('Certificate created successfully!');
        } catch (error) {
            setErrorMessage('Failed to create certificate');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box padding={3}>
            <Typography variant="h4" gutterBottom>Create Certificate for Equipment</Typography>

            {/* Display error/success messages */}
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            {successMessage && <Typography color="success">{successMessage}</Typography>}

            <Box display="flex" flexDirection="column" gap={2}>
                <FormControl fullWidth>
                    <InputLabel>Equipment</InputLabel>
                    <Select
                        value={selectedEquipment}
                        onChange={(e) => setSelectedEquipment(e.target.value)}
                        label="Equipment"
                    >
                        {equipmentList.map((equipment) => (
                            <MenuItem key={equipment.equipmentId} value={equipment.equipmentId}>
                                {equipment.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Certificate Name"
                    variant="outlined"
                    fullWidth
                    value={certificateName}
                    onChange={(e) => setCertificateName(e.target.value)}
                />
                <TextField
                    label="Certificate Description"
                    variant="outlined"
                    fullWidth
                    value={certificateDescription}
                    onChange={(e) => setCertificateDescription(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={certificateStatus}
                        onChange={(e) => setCertificateStatus(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Expired">Expired</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Serial Number"
                    variant="outlined"
                    fullWidth
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                />
            </Box>

            <Box marginTop={2} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handleCreateCertificate}>
                    Create Certificate
                </Button>
            </Box>
        </Box>
    );
};

export default CertificatePage;
