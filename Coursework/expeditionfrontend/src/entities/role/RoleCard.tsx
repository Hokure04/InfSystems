import React from 'react';
import {Card, CardContent, Typography} from '@mui/material';
import {Role} from "./Role.ts";

interface RoleCardProps {
    role: Role;
}

const RoleCard: React.FC<RoleCardProps> = ({role}) => {
    return (
        <Card variant="elevation" style={{marginBottom: 16}}>
            <CardContent>
                <Typography variant="h6">Role #{role.id}</Typography>
                <Typography variant="body1" style={{marginTop: 8}}>
                    Name: {role.name}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RoleCard;