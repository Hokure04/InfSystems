export interface Certificate {
    certificateId: number;
    name: string;
    description?: string;
    status?: string;
    serialNumber: string;
    equipment: {
        equipmentId: number;
        name: string;
    };
}