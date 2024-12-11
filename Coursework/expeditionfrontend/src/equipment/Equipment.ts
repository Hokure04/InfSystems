import { Certificate } from '../certificate/Certificate.ts';

export interface Equipment {
    equipmentId: number;
    name: string;
    description?: string;
    price: number;
    status?: string;
    reservation: boolean;
    type: string;
    certificates: Certificate[];
}