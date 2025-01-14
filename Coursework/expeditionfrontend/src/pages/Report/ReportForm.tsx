import React, { useState } from 'react';
import {
    Box,
    Button,
    Modal,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import api from '../../api';
import { Supplies } from '../../entities/supplies/Supplies';

interface ReportFormProps {
    open: boolean;
    onClose: () => void;
    expeditionId: string;
    supplyList: Supplies[];
    onReportCreated: () => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ open, onClose, expeditionId, supplyList, onReportCreated }) => {
    const [nomination, setNomination] = useState('');
    const [description, setDescription] = useState('');
    const [selectedSupplies, setSelectedSupplies] = useState<number[]>([]);

    const fetchLastReportId = async (): Promise<number | null> => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`expeditions/${expeditionId}/reports`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response);
            const reports = response.data;
            console.log(reports);
            const lastReport = reports[reports.length - 1];
            console.log(lastReport);
            return lastReport.reportId;
        } catch (error) {
            console.error('Error fetching reports:', error);
            return null;
        }
    };


    const createReport = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.post(
                `/expeditions/${expeditionId}/reports`,
                {
                    nomination,
                    description,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log('Report created:', response.data);

            const lastReportId = await fetchLastReportId();
            if (lastReportId) {
                for (const supplyId of selectedSupplies) {
                    await linkSupplyToReport(lastReportId, supplyId);
                }
            }

            onReportCreated();
            onClose();
        } catch (error) {
            console.error('Error creating report or linking supplies:', error);
        }
    };



    const handleSupplyToggle = (supplyId: number) => {
        setSelectedSupplies((prev) =>
            prev.includes(supplyId) ? prev.filter((id) => id !== supplyId) : [...prev, supplyId]
        );
    };

    const linkSupplyToReport = async (reportId: number, supplyId: number) => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.put(
                `/expeditions/reports/${reportId}/supplies/${supplyId}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            console.log('Supply linked successfully:', response.data);
        } catch (error) {
            console.error('Error linking supply to report:', error);
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
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Create Report
                </Typography>
                <TextField
                    fullWidth
                    label="Nomination"
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={nomination}
                    onChange={(e) => setNomination(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Description"
                    variant="outlined"
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Typography variant="body1" sx={{ mb: 2 }}>
                    Link Supplies:
                </Typography>
                <Box sx={{ maxHeight: '200px', overflowY: 'auto', mb: 2 }}>
                    {supplyList.map((supply) => (
                        <FormControlLabel
                            key={supply.supplyId}
                            control={
                                <Checkbox
                                    checked={selectedSupplies.includes(supply.supplyId)}
                                    onChange={() => handleSupplyToggle(supply.supplyId)}
                                />
                            }
                            label={supply.category}
                        />
                    ))}
                </Box>

                <Button variant="contained" color="primary" onClick={createReport}>
                    Save Report
                </Button>
            </Box>
        </Modal>
    );
};

export default ReportForm;
