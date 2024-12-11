import React from 'react';
import { Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { Expedition } from './Expedition.ts';
import RouteCard from '../route/RouteCard';
import ReportCard from '../report/ReportCard';
import RequestCard from '../request/RequestCard';
import PermitCard from '../permit/PermitCard';
import SuppliesCard from '../supplies/SuppliesCard';
import EquipmentCard from '../equipment/EquipmentCard';
import VehicleCard from '../vehicle/VehicleCard';
import UserCard from '../user/UserCard';

interface ExpeditionCardProps {
    expedition: Expedition;
}

const ExpeditionCard: React.FC<ExpeditionCardProps> = ({ expedition }) => {
    return (
        <Card variant="outlined" style={{ marginBottom: 16 }}>
            <CardContent>
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

                {/* Requests */}
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

                {/* Permits */}
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

                {/* Supplies */}
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

                {/* Equipment */}
                {expedition.equipmentList.length > 0 && (
                    <>
                        <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                            Equipment:
                        </Typography>
                        {expedition.equipmentList.map((equipment) => (
                            <EquipmentCard key={equipment.equipmentId} equipment={equipment} />
                        ))}
                    </>
                )}

                {/* Vehicles */}
                {expedition.vehicleList.length > 0 && (
                    <>
                        <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                            Vehicles:
                        </Typography>
                        {expedition.vehicleList.map((vehicle) => (
                            <VehicleCard key={vehicle.vehicleId} vehicle={vehicle} />
                        ))}
                    </>
                )}

                {/* Users */}
                {expedition.userList.length > 0 && (
                    <>
                        <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                            Participants:
                        </Typography>
                        {expedition.userList.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </>
                )}

                {/* Required Roles */}
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

                {/* User Applications */}
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
            </CardContent>
        </Card>
    );
};

export default ExpeditionCard;