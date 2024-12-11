import {Role} from "../role/Role.ts";

export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    surname: string;
    phoneNumber?: string;
    vehicleType?: string;
    expeditionRole?: string;
    skill?: string;
    aboutUser?: string;
    role: Role[];
}