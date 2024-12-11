import {Hazard} from "../hazard/Hazard.ts";

export interface Location {
    locationId: number;
    locationName: string;
    coordinates: string;
    permitType: string;
    hardLevel: number;
    overallRating: number;
    hazards: Hazard[];
}