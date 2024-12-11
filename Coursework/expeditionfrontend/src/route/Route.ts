import {Location} from "../location/Location.ts";

export interface Route {
    routeId: number;
    startPoint: string;
    endPoint: string;
    distance: number;
    locations: Location[];
}