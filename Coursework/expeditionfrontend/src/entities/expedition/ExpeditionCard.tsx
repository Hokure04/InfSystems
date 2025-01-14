import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Chip, Button, Box } from '@mui/material';
import { Expedition } from './Expedition.ts';
import RouteCard from '../route/RouteCard';
import ReportCard from '../report/ReportCard';
import RequestCard from '../request/RequestCard';
import PermitCard from '../permit/PermitCard';
import SuppliesCard from '../supplies/SuppliesCard';
import EquipmentCardOld from '../equipment/EquipmentCardOld';
import VehicleCardOld from '../vehicle/VehicleCardOld';
import UserCard from '../user/UserCard';
import YandexMapComponent from '../../map/YandexMapComponent';
import api from '../../api.ts';

interface ExpeditionCardProps {
    expedition: Expedition;
    onUpdateExpedition: (updatedExpedition: Expedition) => void;
}

const ExpeditionCard: React.FC<ExpeditionCardProps> = ({ expedition, onUpdateExpedition }) => {
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleApply = async () => {
        setLoading(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const storedUser = localStorage.getItem('user');
            const user = storedUser ? JSON.parse(storedUser) : null;
            const userId = user?.id;

            if (!userId) {
                throw new Error('User ID not found in localStorage');
            }

            const response = await api.post(`/expeditions/${expedition.expeditionId}/apply/${userId}`);
            setSuccessMessage(response.data.message || 'Application submitted successfully!');

            const updatedExpeditionResponse = await api.get(`/expeditions/${expedition.expeditionId}`);
            const updatedExpedition = updatedExpeditionResponse.data;

            onUpdateExpedition(updatedExpedition);
        } catch (error: any) {
            console.error('Error applying for expedition:', error);
            setErrorMessage(
                error.response?.data?.message || 'Failed to apply for the expedition. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card variant="outlined" style={{ marginBottom: 16 }}>
            <CardContent>
                <Grid container spacing={2}>
                    {/* Основная информация о экспедиции */}
                    <Grid item xs={7}>
                        <Typography variant="h6">{expedition.name}</Typography>
                        <Typography variant="body1">
                            Start Date: {new Date(expedition.startDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1">
                            End Date: {new Date(expedition.endDate).toLocaleDateString()}
                        </Typography>
                        {expedition.description && (
                            <Typography variant="body2" style={{ marginTop: 8 }}>
                                Description: {expedition.description}
                            </Typography>
                        )}
                        {expedition.status && (
                            <Typography variant="body2" style={{ marginTop: 8 }}>
                                Status: {expedition.status}
                            </Typography>
                        )}

                        {/* Информация о маршруте */}
                        {expedition.route && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                    Route:
                                </Typography>
                                <RouteCard route={expedition.route} />
                            </>
                        )}

                        {/* Список отчетов */}
                        {expedition.reports.length > 0 && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                    Reports:
                                </Typography>
                                {expedition.reports.map((report) => (
                                    <ReportCard key={report.reportId} report={report} />
                                ))}
                            </>
                        )}

                        {/* Запросы */}
                        {expedition.requests.length > 0 && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                    Requests:
                                </Typography>
                                {expedition.requests.map((request) => (
                                    <RequestCard key={request.requestId} request={request} />
                                ))}
                            </>
                        )}

                        {/* Разрешения */}
                        {expedition.permits.length > 0 && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                    Permits:
                                </Typography>
                                {expedition.permits.map((permit) => (
                                    <PermitCard key={permit.permitId} permit={permit} />
                                ))}
                            </>
                        )}

                        {/* Список снабжения */}
                        {expedition.supplyList.length > 0 && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                    Supplies:
                                </Typography>
                                {expedition.supplyList.map((supply) => (
                                    <SuppliesCard key={supply.supplyId} supplies={supply} />
                                ))}
                            </>
                        )}

                        {/* Оборудование */}
                        {expedition.equipmentList.length > 0 && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                    Equipment:
                                </Typography>
                                {expedition.equipmentList.map((equipment) => (
                                    <EquipmentCardOld key={equipment.equipmentId} equipment={equipment} />
                                ))}
                            </>
                        )}

                        {/* Транспорт */}
                        {expedition.vehicleList.length > 0 && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                    Vehicles:
                                </Typography>
                                {expedition.vehicleList.map((vehicle) => (
                                    <VehicleCardOld key={vehicle.vehicleId} vehicle={vehicle} />
                                ))}
                            </>
                        )}

                        {/* Пользователи с уменьшенным размером текста */}
                        {expedition.userList.length > 0 && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                    Participants:
                                </Typography>
                                {expedition.userList.map((user) => (
                                    // Уменьшаем размер текста для участников
                                    <UserCard key={user.id} user={user} />
                                ))}
                            </>
                        )}

                        {/* Необходимые роли */}
                        {expedition.requiredRoles.length > 0 && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                    Required Roles:
                                </Typography>
                                <Grid container spacing={1}>
                                    {expedition.requiredRoles.map((role, index) => (
                                        <Grid item key={index}>
                                            <Chip label={role} color="secondary" />
                                        </Grid>
                                    ))}
                                </Grid>
                            </>
                        )}

                        {/* Заявки пользователей */}
                        {Object.keys(expedition.userApplications).length > 0 && (
                            <>
                                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                    User Applications:
                                </Typography>
                                <ul>
                                    {Object.entries(expedition.userApplications).map(([userId, status]) => (
                                        <li key={userId}>
                                            User ID: {userId}, Status: {status}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/* Кнопка "Хочу участвовать" */}
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ marginTop: 16 }}
                            onClick={handleApply}
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Хочу участвовать'}
                        </Button>

                        {successMessage && (
                            <Typography variant="body2" color="success" style={{ marginTop: 8 }}>
                                {successMessage}
                            </Typography>
                        )}

                        {errorMessage && (
                            <Typography variant="body2" color="error" style={{ marginTop: 8 }}>
                                {errorMessage}
                            </Typography>
                        )}
                    </Grid>

                    {/* Карта в правом верхнем углу */}
                    <Grid item xs={5}>
                        <Box
                            width="100%"
                            height="300px"
                            zIndex={1}
                            boxShadow={3}
                            borderRadius={2}
                            overflow="hidden"
                        >
                            <YandexMapComponent width="100%" height="100%" initialRoute={expedition.route?.startPoint || undefined} />
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ExpeditionCard;

