import {Hazard} from "../hazard/Hazard.ts";

export interface Location {
    locationId: number;
    locationName: string;
    latitude: number;
    longitude: number;
    permitType: string;
    hardLevel: number;
    overallRating: number;
    hazards: Hazard[];
}