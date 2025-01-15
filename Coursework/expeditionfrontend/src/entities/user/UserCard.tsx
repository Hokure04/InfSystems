import React from 'react';
import { Card, CardContent, Typography, Chip, Grid } from '@mui/material';
import {User} from "./User.ts";

interface UserCardProps {
    user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    return (
        <Card variant="elevation" style={{ marginBottom: 16 }}>
            <CardContent>
                <Typography variant="h4">
                    {user.username}
                </Typography>
                <Typography variant="body1">
                    {user.name} {user.surname}
                </Typography>
                <Typography variant="body1">Email: {user.email}</Typography>
                {user.phoneNumber && (
                    <Typography variant="body1">Phone: {user.phoneNumber}</Typography>
                )}
                {user.vehicleType && (
                    <Typography variant="body1">Vehicle Type: {user.vehicleType}</Typography>
                )}
                {user.expeditionRole && (
                    <Typography variant="body1">Expedition Role: {user.expeditionRole}</Typography>
                )}
                {user.skill && (
                    <Typography variant="body1">Skill: {user.skill}</Typography>
                )}
                {user.aboutUser && (
                    <Typography variant="body2" style={{ marginTop: 8 }}>
                        About: {user.aboutUser}
                    </Typography>
                )}

                <Typography variant="subtitle1" style={{ marginTop: 16 }}>
                    Roles:
                </Typography>
                <Grid container spacing={1}>
                    {user.role && Array.isArray(user.role) && user.role.length > 0 ? (
                        user.role.map((role) => (
                            <Grid item key={role.id}>
                                <Chip label={role.name} color="primary" />
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            No roles assigned.
                        </Typography>
                    )}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default UserCard;