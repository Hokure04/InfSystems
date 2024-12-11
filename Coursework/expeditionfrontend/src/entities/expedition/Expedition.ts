// Интерфейс для Expedition
import {Route} from "../route/Route.ts";
import {Permit} from "../permit/Permit.ts";
import {Supplies} from "../supplies/Supplies.ts";
import {Equipment} from "../equipment/Equipment.ts";
import {Vehicle} from "../vehicle/Vehicle.ts";
import {Report} from  "../report/Report.ts"
import {Request} from "../request/Request.ts";
import {User} from "../user/User.ts";

export interface Expedition {
    expeditionId: number;
    name: string;
    startDate: string; // Используем строку формата ISO
    endDate: string;
    description: string | null;
    status: string | null;
    route: Route | null;
    reports: Report[];
    requests: Request[];
    permits: Permit[];
    supplyList: Supplies[];
    equipmentList: Equipment[];
    vehicleList: Vehicle[];
    userList: User[];
    userApplications: { [userId: number]: string };
    requiredRoles: string[];
}