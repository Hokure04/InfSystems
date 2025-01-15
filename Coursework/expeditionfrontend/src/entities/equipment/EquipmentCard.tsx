import React, {useEffect, useState} from 'react';
import {
    Card,
    CardContent,
    Typography,
    Divider,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button
} from '@mui/material';
import CertificateCard from '../certificate/CertificateCard.tsx';
import {Equipment} from './Equipment.ts';
import api from '../../api.ts'

interface Expedition{
    id: number;
    name: string;
}

interface EquipmentProps {
    equipment: Equipment;
}

const EquipmentCard: React.FC<EquipmentProps> = ({equipment}) => {
    const [expeditions, setExpeditions] = useState<Expedition[]>([]);
    const [selectedExpedition, setSelectedExpedition] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const[userId, setUserId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if(storedUser){
            try{
                const parsedUser = JSON.parse(storedUser);
                if(parsedUser?.id){
                    setUserId(parsedUser.id)
                }else{
                    console.error('User id not found in storage');
                }
            }catch (error){
                console.error('Failed to parse user');
            }
        }else{
            console.error('User not found');
        }
    }, []);

    useEffect(() => {
        const fetchExpeditions = async () =>{
            if(!userId) return;
            try{
                const response = await api.get(`/users/${userId}/expeditions`);
                const expeditionsData = response.data.expeditions || [];
                console.log("Полученные экспедиции:", expeditionsData);
                setExpeditions(expeditionsData);
                setSelectedExpedition(expeditionsData.length > 0 ? String(expeditionsData[0].id) : null);
            }catch (error){
                console.error('Ошибка загрузки экспедиций: ', error);
            }finally {
                setLoading(false);
            }
        };

        fetchExpeditions();
    }, [userId]);

    const handleRentEquipment = async () =>{
        if(!selectedExpedition){
            console.error('Экспедиция не выбрана');
            return;
        }

        try{
            const expeditionId = parseInt(selectedExpedition, 10);
            const response = await api.post(`/equipment/${equipment.equipmentId}/expeditions/${expeditionId}`);
            console.log('Оборудование добавлено в экспедицию:', response.data.message);
            setErrorMessage(null);
        }catch (error: any){
            const message = error.response?.data?.Message || "Оборудование уже добавлено в экспедицию";
            console.error(message);
            setErrorMessage(message);
        }
    };


    return (
        <Card  sx={{margin: 2, padding: 2}}>
            <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                    {equipment.name}
                </Typography>
                <Divider/>
                <Box sx={{marginTop: 2}}>
                    {equipment.description && (
                        <Typography variant="body2">
                            <strong>Description:</strong> {equipment.description}
                        </Typography>
                    )}
                    <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: 1}}>
                        <Typography variant="body2">
                            <strong>Price:</strong> ${equipment.price.toFixed(2)}
                        </Typography>
                        {equipment.status && (
                            <Typography variant="body2">
                                <strong>Status:</strong> {equipment.status}
                            </Typography>
                        )}
                    </Box>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', marginTop: 1}}>
                        <Typography variant="body2">
                            <strong>Reservation:</strong> {equipment.reservation ? 'Reserved' : 'Available'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Type:</strong> {equipment.type}
                        </Typography>
                    </Box>
                </Box>

                {equipment.certificates.length > 0 && (
                    <Box sx={{marginTop: 2}}>
                        <Typography variant="h6">Certificates:</Typography>
                        <Box sx={{marginTop: 1}}>
                            {equipment.certificates.map((certificate) => (
                                <CertificateCard key={certificate.certificateId} certificate={certificate}/>
                            ))}
                        </Box>
                    </Box>
                )}

                <Typography variant="h6" style={{ marginTop: 16 }}>
                    Экспедиции:
                </Typography>
                {loading ? (
                    <Typography variant="body2" style={{ marginTop: 8 }}>
                        Загрузка экспедиций...
                    </Typography>
                ) : expeditions.length > 0 ? (
                    <FormControl fullWidth style={{ marginTop: 8 }}>
                        <InputLabel id="expedition-select-label">Экспедиция</InputLabel>
                        <Select
                            labelId="expedition-select-label"
                            value={selectedExpedition ?? ''}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                console.log('Выбрана новая экспедиция:', newValue);
                                setSelectedExpedition(newValue);
                            }}
                        >
                            {expeditions.map((expedition, index) => (
                                <MenuItem
                                    key={`expedition-${expedition.id ?? index}`}
                                    value={String(expedition.id ?? index+1)}
                                >
                                    {expedition.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <Typography variant="body2" style={{ marginTop: 8, fontStyle: 'italic' }}>
                        Экспедиций нет.
                    </Typography>
                )}
                {/* Отображение ошибки, если она есть */}
                {errorMessage && (
                    <Typography variant="body2" color="error" style={{ marginTop: 16 }}>
                        {errorMessage}
                    </Typography>
                )}
                <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: 16 }}
                    onClick={handleRentEquipment}
                    disabled={loading || expeditions.length === 0}
                >
                    Арендовать оборудование для экспедиции
                </Button>
            </CardContent>
        </Card>
    );

};

export default EquipmentCard;