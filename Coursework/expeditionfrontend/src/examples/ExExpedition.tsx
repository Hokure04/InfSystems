import React from 'react';
import ExpeditionCard from '../entities/expedition/ExpeditionCard';
import { Expedition } from '../entities/expedition/Expedition';

const exampleExpedition: Expedition = {
    expeditionId: 1,
    name: 'Arctic Exploration',
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    description: 'An exciting journey to the Arctic.',
    status: 'Planned',
    route: null,
    reports: [ /* Пример отчётов */ ],
    requests: [ /* Пример запросов */ ],
    permits: [ /* Пример разрешений */ ],
    supplyList: [ /* Пример снабжения */ ],
    equipmentList: [ /* Пример оборудования */ ],
    vehicleList: [ /* Пример транспорта */ ],
    userList: [ /* Пример участников */ ],
    userApplications: { 1: 'Approved', 2: 'Pending' },
    requiredRoles: ['Driver', 'Navigator'],
};

const ExExpedition: React.FC = () => {
    return (
        <div>
            <h1>Expedition Details</h1>
            <ExpeditionCard expedition={exampleExpedition} />
        </div>
    );
};

export default ExExpedition;