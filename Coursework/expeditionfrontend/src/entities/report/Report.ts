// Интерфейс для Report
import {Supplies} from "../supplies/Supplies.ts";

export interface Report {
    reportId: number;
    nomination: string;
    description: string | null;
    suppliesList: Supplies[];
}


