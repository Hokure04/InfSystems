import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Box, CircularProgress, Typography, Grid, Button, TextField} from '@mui/material';
import YandexMapComponent from '../map/YandexMapComponent';
import SuppliesCard from '../entities/supplies/SuppliesCard';
import EquipmentCardOld from '../entities/equipment/EquipmentCardOld';
import VehicleCardOld from '../entities/vehicle/VehicleCardOld';
import UserCard from '../entities/user/UserCard';
import RequestCard from '../entities/request/RequestCard.tsx';
import api from '../api';
import { Expedition } from '../entities/expedition/Expedition';
import ReportForm from "./Report/ReportForm.tsx";
import ReportCard from '../entities/report/ReportCard.tsx';
import LocationCard from '../entities/location/LocationCard';
import { Location } from '../entities/location/Location';

const ExpeditionInfoPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [expedition, setExpedition] = useState<Expedition | null>(null);
    const [loading, setLoading] = useState(true);
    const [openReportForm, setOpenReportForm] = useState(false);
    const [newRole, setNewRole] = useState('');
    const [hardLevel, setHardLevel] = useState<number | ''>('');
    const [overallRating, setOverallRating] = useState<number | ''>('');
    const [rolesChecked, setRolesChecked] = useState<boolean | null>(null);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

    useEffect(() => {
        const fetchExpeditionDetails = async () => {
            try {
                const response = await api.get(`/expeditions/${id}`);
                console.log(response)
                setExpedition(response.data.expedition);
            } catch (error) {
                console.error('Error fetching expedition details:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchLocations = async () => {
            try {
                const response = await api.get(`/expeditions/${id}/route-with-locations`);
                setLocations(response.data.route.locations || []);
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExpeditionDetails();
        fetchLocations();
    }, [id]);

    const fetchUserIdByUsername = async (username: string): Promise<number | null> => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/users/profile/${username}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.user.id;
        } catch (error) {
            console.error('Failed to fetch user ID:', error);
            return null;
        }
    };

    const handleAcceptRequest = async (username: string) => {
        try {
            const userId = await fetchUserIdByUsername(username);
            if (!userId) {
                console.error('User ID not found for username:', username);
                return;
            }

            const token = localStorage.getItem('token');
            const response = await api.post(
                `/expeditions/${id}/add-user/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data.message);
            const updatedExpedition = await api.get(`/expeditions/${id}`);
            setExpedition(updatedExpedition.data.expedition);
        } catch (error) {
            console.error('Failed to accept request:', error);
        }
    };

    const handleRejectRequest = async (username: string) => {
        try {
            const userId = await fetchUserIdByUsername(username);
            if (!userId) {
                console.error('User ID not found for username:', username);
                return;
            }

            const token = localStorage.getItem('token');
            const response = await api.post(
                `/expeditions/${id}/reject/${userId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log(response.data.message);
            const updatedExpedition = await api.get(`/expeditions/${id}`);
            setExpedition(updatedExpedition.data.expedition);
        } catch (error) {
            console.error('Failed to reject request:', error);
        }
    };

    const refreshExpeditionData = async () => {
        try {
            const response = await api.get(`/expeditions/${id}`);
            setExpedition(response.data.expedition);
        } catch (error) {
            console.error('Error refreshing expedition data:', error);
        }
    };

    const handleAddRole = async () => {
        try {
            if (!newRole.trim()) return;
            const response = await api.post(`/expeditions/${id}/add-role`, newRole, {
                headers: { 'Content-Type': 'application/json' },
            });
            console.log(response.data.message);

            setExpedition((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    requiredRoles: [...(prev.requiredRoles || []), newRole],
                };
            });

            setNewRole('');
        } catch (error) {
            console.error('Error adding role:', error);
        }
    };


    const handleCheckRoles = async () => {
        try {
            const response = await api.get(`/expeditions/${id}/check-roles`);
            setRolesChecked(response.data.allRoles);
        } catch (error) {
            console.error('Error checking roles:', error);
        }
    };

    const handleUpdateHardLevel = async () => {
        try {
            if (hardLevel === '' || !selectedLocationId) return;
            const response = await api.put(`/expeditions/locations/${selectedLocationId}/hard-level`, null, {
                params: { hardLevel },
            });
            console.log('Hard level updated:', response.data.location.hardLevel);
            setHardLevel('');
            refreshLocations();
        } catch (error) {
            console.error('Error updating hard level:', error);
        }
    };

    const handleUpdateOverallRating = async () => {
        try {
            if (overallRating === '' || overallRating < 0 || overallRating > 5 || !selectedLocationId) return;
            const response = await api.put(`/expeditions/locations/${selectedLocationId}/overall-rating`, null, {
                params: { overallRating },
            });
            console.log('Overall rating updated:', response.data.location.overallRating);
            setOverallRating('');
            refreshLocations();
        } catch (error) {
            console.error('Error updating overall rating:', error);
        }
    };

    const refreshLocations = async () => {
        try {
            const response = await api.get(`/expeditions/${id}/route-with-locations`);
            setLocations(response.data.route.locations || []);
        } catch (error) {
            console.error('Error refreshing locations:', error);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!expedition) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6">Expedition not found.</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 3 }}>
            {/* Название экспедиции */}
            <Box
                sx={{
                    textAlign: 'center',
                    marginBottom: 4,
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 2,
                    }}
                >
                    {expedition.name}
                </Typography>
            </Box>

            <Grid container spacing={5}>
                {/* Левая часть: карточки */}
                <Grid item xs={4}>
                    {/* Информация об экспедиции */}
                    <Box sx={{ marginBottom: 2, padding: 1 }}>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            <strong>Description:</strong> {expedition.description || 'N/A'}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            <strong>Status:</strong> {expedition.status || 'N/A'}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            <strong>Start Date:</strong> {new Date(expedition.startDate).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body1" sx={{ marginBottom: 2 }}>
                            <strong>End Date:</strong> {new Date(expedition.endDate).toLocaleDateString()}
                        </Typography>

                        <Typography variant="h6" gutterBottom>
                            Locations on the route:
                        </Typography>
                    </Box>

                    {locations?.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Locations:
                            </Typography>
                            {locations.map((location) => (
                                <Grid item xs={12} key={location.locationId}>
                                    <LocationCard location={location} />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ marginTop: 2 }}
                                        onClick={() => setSelectedLocationId(location.locationId)}
                                    >
                                        Select Location
                                    </Button>
                                </Grid>
                            ))}
                        </>
                    )}

                    {/* Supplies */}
                    {expedition.supplyList?.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Supplies:
                            </Typography>
                            {expedition.supplyList.map((supply) => (
                                <Box key={supply.supplyId} sx={{ marginBottom: 1, transform: 'scale(0.9)', width: '100%' }}>
                                    <SuppliesCard supplies={supply} />
                                </Box>
                            ))}
                        </>
                    )}

                    {/* Equipment */}
                    {expedition.equipmentList?.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Equipment:
                            </Typography>
                            {expedition.equipmentList.map((equipment) => (
                                <Box key={equipment.equipmentId} sx={{ marginBottom: 1, transform: 'scale(0.9)', width: '100%' }}>
                                    <EquipmentCardOld equipment={equipment} />
                                </Box>
                            ))}
                        </>
                    )}

                    {/* Vehicles */}
                    {expedition.vehicleList?.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Vehicles:
                            </Typography>
                            {expedition.vehicleList.map((vehicle) => (
                                <Box key={vehicle.vehicleId} sx={{ marginBottom: 1, transform: 'scale(0.9)', width: '100%' }}>
                                    <VehicleCardOld vehicle={vehicle} />
                                </Box>
                            ))}
                        </>
                    )}

                    {/* Users */}
                    {expedition.userList?.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Participants:
                            </Typography>
                            {expedition.userList.map((user) => (
                                <Box key={user.id} sx={{ marginBottom: 1, transform: 'scale(0.9)', width: '100%' }}>
                                    <UserCard user={user} />
                                </Box>
                            ))}
                        </>
                    )}


                    {/* Required Roles */}
                    {expedition.requiredRoles?.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                                Required Roles:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {expedition.requiredRoles.map((role, index) => (
                                    <Typography
                                        key={index}
                                        variant="body2"
                                        sx={{
                                            padding: 1,
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: 1,
                                        }}
                                    >
                                        {role}
                                    </Typography>
                                ))}
                            </Box>
                        </>
                    )}

                    {/* Reports */}
                    {expedition.reports?.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 2 }}>
                                Reports:
                            </Typography>
                            {expedition.reports.map((report) => (
                                <Box key={report.reportId} sx={{ marginBottom: 1, transform: 'scale(0.9)', width: '100%' }}>
                                    <ReportCard report={report} />
                                </Box>
                            ))}
                        </>
                    )}

                    <Box sx={{ padding: 3 }}>
                        {/* Кнопка для открытия модального окна */}
                        <Button variant="contained" color="primary" onClick={() => setOpenReportForm(true)}>
                            Add Report
                        </Button>

                        {/* Модальное окно */}
                        <ReportForm
                            open={openReportForm}
                            onClose={() => setOpenReportForm(false)}
                            expeditionId={id!}
                            supplyList={expedition?.supplyList || []}
                            onReportCreated={refreshExpeditionData}
                        />
                    </Box>
                </Grid>

                {/* Правая часть: карта */}
                <Grid item xs={8}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>
                        Route Map:
                    </Typography>
                    <Box
                        sx={{
                            height: '500px',
                            width: '100%',
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: 3,
                        }}
                    >
                        <YandexMapComponent width="100%" height="100%" initialRoute={expedition.route?.startPoint || ''} />
                    </Box>

                    {/* Заявки */}
                    {expedition.requests?.length > 0 && (
                        <>
                            <Typography variant="h6" sx={{ marginY: 2 }}>
                                Requests:
                            </Typography>
                            {expedition.requests.map((request) => (
                                <RequestCard
                                    key={request.requestId}
                                    request={request}
                                    onAccept={() => handleAcceptRequest(request.username)}
                                    onReject={() => handleRejectRequest(request.username)}
                                />
                            ))}
                        </>
                    )}

                    {/* Кнопки и поля для новых функций */}
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="h6">Manage Roles</Typography>
                        <TextField
                            label="New Role"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            sx={{ marginBottom: 2, marginRight: 2 }}
                        />
                        <Button variant="contained" color="primary" onClick={handleAddRole}>
                            Add Role
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCheckRoles}
                            sx={{ marginLeft: 2 }}
                        >
                            Check All Roles
                        </Button>
                        {rolesChecked !== null && (
                            <Typography variant="body1" sx={{ marginTop: 1 }}>
                                All Roles Assigned: {rolesChecked ? 'Yes' : 'No'}
                            </Typography>
                        )}
                    </Box>

                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="h6">Update Location</Typography>
                        <TextField
                            label="Hard Level (1-10)"
                            type="number"
                            value={hardLevel}
                            onChange={(e) => setHardLevel(Number(e.target.value))}
                            sx={{ marginBottom: 2, marginRight: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateHardLevel}
                            sx={{ marginBottom: 2 }}
                        >
                            Update Hard Level
                        </Button>
                        <TextField
                            label="Overall Rating (0-5)"
                            type="number"
                            value={overallRating}
                            onChange={(e) => setOverallRating(Number(e.target.value))}
                            sx={{ marginTop: 2, marginBottom: 2, marginRight: 2 }}
                        />
                        <Button variant="contained" onClick={handleUpdateOverallRating}>
                            Update Rating
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default ExpeditionInfoPage;
