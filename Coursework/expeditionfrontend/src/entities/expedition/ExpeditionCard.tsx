import React, { useState} from 'react';
import {Card, CardContent, Typography, Grid, Button, Box} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import RouteCard from '../route/RouteCard';
import ReportCard from '../report/ReportCard';
import RequestCardOld from '../request/RequestCardOld.tsx';
import PermitCard from '../permit/PermitCard';
import SuppliesCard from '../supplies/SuppliesCard';
import EquipmentCardOld from '../equipment/EquipmentCardOld';
import VehicleCardOld from '../vehicle/VehicleCardOld';
import UserCard from '../user/UserCard';
import YandexMapComponent from '../../map/YandexMapComponent';
import RequestForm from '../../pages/Request/RequestForm.tsx';
import { Expedition } from './Expedition';

interface ExpeditionCardProps {
    expedition: Expedition;
    onUpdateExpedition: (updatedExpedition: Expedition) => void;
    onApplySuccess: () => void;
    owner: boolean;
}

const ExpeditionCard: React.FC<ExpeditionCardProps> = ({expedition, onApplySuccess, owner,
                                                       }) => {
    const [showMore, setShowMore] = useState(false);
    const [openRequestModal, setOpenRequestModal] = useState(false);

    const navigate = useNavigate();



    return (
        <Card variant="elevation" style={{ marginBottom: 16 }}>
            <CardContent>
                <Grid container spacing={2}>
                    {/* Основная информация о экспедиции */}
                    <Grid item xs={7}>
                        <Typography variant="h6" style={{ cursor: 'pointer' }}>
                            <Link
                                to={`/expedition/${expedition.expeditionId}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                {expedition.name}
                            </Link>
                        </Typography>

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

                        {/* Кнопка для показа дополнительной информации */}
                        <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            style={{ marginTop: 1 }}
                            onClick={() => setShowMore(!showMore)}
                        >
                            {showMore ? 'Показать меньше' : 'Показать больше'}
                        </Button>

                        {/* Дополнительная информация */}
                        {showMore && (
                            <>
                                {/* Route */}
                                {expedition.route && (
                                    <>
                                        <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                            Route:
                                        </Typography>
                                        <RouteCard route={expedition.route} />
                                    </>
                                )}

                                {/* Reports */}
                                {Array.isArray(expedition.reports) && expedition.reports.length > 0 && (
                                    <>
                                        <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                                            Reports:
                                        </Typography>
                                        {expedition.reports.map((report) => (
                                            <ReportCard key={report.reportId} report={report} />
                                        ))}
                                    </>
                                )}

                                {/* Requests */}
                                {Array.isArray(expedition.requests) &&
                                    expedition.requests.length > 0 && (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                style={{ marginTop: 16 }}
                                            >
                                                Requests:
                                            </Typography>
                                            {expedition.requests.map((request) => (
                                                <RequestCardOld key={request.requestId} request={request} />
                                            ))}
                                        </>
                                    )}

                                {/* Permits */}
                                {Array.isArray(expedition.permits) &&
                                    expedition.permits.length > 0 && (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                style={{ marginTop: 16 }}
                                            >
                                                Permits:
                                            </Typography>
                                            {expedition.permits.map((permit) => (
                                                <PermitCard key={permit.permitId} permit={permit} />
                                            ))}
                                        </>
                                    )}

                                {/* Supplies */}
                                {Array.isArray(expedition.supplyList) &&
                                    expedition.supplyList.length > 0 && (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                style={{ marginTop: 16 }}
                                            >
                                                Supplies:
                                            </Typography>
                                            {expedition.supplyList.map((supply) => (
                                                <SuppliesCard key={supply.supplyId} supplies={supply} />
                                            ))}
                                        </>
                                    )}

                                {/* Equipment */}
                                {Array.isArray(expedition.equipmentList) &&
                                    expedition.equipmentList.length > 0 && (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                style={{ marginTop: 16 }}
                                            >
                                                Equipment:
                                            </Typography>
                                            {expedition.equipmentList.map((equipment) => (
                                                <EquipmentCardOld
                                                    key={equipment.equipmentId}
                                                    equipment={equipment}
                                                />
                                            ))}
                                        </>
                                    )}

                                {/* Vehicles */}
                                {Array.isArray(expedition.vehicleList) &&
                                    expedition.vehicleList.length > 0 && (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                style={{ marginTop: 16 }}
                                            >
                                                Vehicles:
                                            </Typography>
                                            {expedition.vehicleList.map((vehicle) => (
                                                <VehicleCardOld key={vehicle.vehicleId} vehicle={vehicle} />
                                            ))}
                                        </>
                                    )}

                                {/* Users */}
                                {Array.isArray(expedition.userList) &&
                                    expedition.userList.length > 0 && (
                                        <>
                                            <Typography
                                                variant="subtitle1"
                                                style={{ marginTop: 16 }}
                                            >
                                                Participants:
                                            </Typography>
                                            {expedition.userList.map((user) => (
                                                <UserCard key={user.id} user={user} />
                                            ))}
                                        </>
                                    )}
                            </>
                        )}

                        {/* Кнопка действия */}
                        <Grid>

                            {owner ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: 25 }}
                                    onClick={() => navigate(`/expedition/${expedition.expeditionId}`)}
                                >
                                    Перейти
                                </Button>
                            ) : (

                                <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ marginTop: 25 }}
                                    onClick={() => setOpenRequestModal(true)}
                                >
                                    Хочу участвовать
                                </Button>
                            )}
                        </Grid>
                    </Grid>

                    {/* Карта */}
                    <Grid item xs={5}>
                        <Box
                            width="100%"
                            height="300px"
                            zIndex={1}
                            boxShadow={3}
                            borderRadius={2}
                            overflow="hidden"
                        >
                            <YandexMapComponent
                                width="100%"
                                height="100%"
                                initialRoute={expedition.route?.startPoint || undefined}
                            />
                        </Box>
                    </Grid>
                </Grid>

                {/* Модальное окно */}
                <RequestForm
                    expeditionId={expedition.expeditionId}
                    open={openRequestModal}
                    onClose={() => setOpenRequestModal(false)}
                    onSuccess={onApplySuccess}
                />
            </CardContent>
        </Card>
    );
};

export default ExpeditionCard;

