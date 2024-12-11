// Интерфейс для Vehicle
export interface Vehicle {
    vehicleId: number;
    type: string;
    model: string;
    capacity: number;
    description: string | null;
    status: string | null;
    fuelConsumption: number;
    fuelTankCapacity: number;
    fuelType: string;
    reservation: boolean;
    price: number;
}