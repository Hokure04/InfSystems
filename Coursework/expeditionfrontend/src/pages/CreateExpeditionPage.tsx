import React, {useEffect, useState} from "react";
import { TextField, Button, Box } from "@mui/material";
import api from "../api";
import { Expedition } from "../entities/expedition/Expedition.ts";
import { Route } from "../entities/route/Route.ts";
import { Location } from "../entities/location/Location";
import { Equipment } from "../entities/equipment/Equipment.ts";
import { Vehicle } from "../entities/vehicle/Vehicle.ts";
import SuppliesForm from "./Supplies/SuppliesForm.tsx";
import SuppliesList from "./Supplies/SuppliesList.tsx";
import LocationForm from "./Locations/LocationForm.tsx";
import LocationList from "./Locations/LocationList.tsx";
import EquipmentForm from "./Equipment/EquipmentForm.tsx";
import EquipmentList from "./Equipment/EquipmentList.tsx";
import VehicleForm from "./Vehicle/VehicleForm.tsx";
import VehicleList from "./Vehicle/VehicleList.tsx";
import {Role} from "../entities/role/Role.ts";

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
    password: string;
}

const CreateExpeditionPage: React.FC = () => {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [route] = useState<Route | null>(null);
    const [totalDistance] = useState<number>(0);
    const [suppliesList, setSuppliesList] = useState<any[]>([]);
    const [locationsList, setLocationsList] = useState<Location[]>([]);
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
    const [isSuppliesModalOpen, setIsSuppliesModalOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const handleAddSupply = (newSupply: { category: string; quantity: number; description: string }) => {
        setSuppliesList([...suppliesList, newSupply]);
    };

    const handleAddLocation = (newLocation: Location) => {
        setLocationsList([...locationsList, newLocation]);
    };

    const handleAddEquipment = (newEquipment: Equipment) => {
        setEquipmentList([...equipmentList, newEquipment]);
    };

    const handleAddVehicle = (newVehicle: Vehicle) => {
        setVehicleList([...vehicleList, newVehicle]);
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        const password = localStorage.getItem("password");
        if (userData && password) {
            const parsedUser = JSON.parse(userData);
            setCurrentUser({ ...parsedUser, password }); // Добавляем пароль в данные пользователя
        }
    }, []);

    const handleSubmit = async () => {
        if (!name || !startDate || !endDate || !description || !currentUser) {
            alert("Please fill in all required fields!");
            return;
        }

        try {
            const expedition: Expedition = {
                expeditionId: 0,
                name,
                startDate,
                endDate,
                description: description || null,
                status: "start",
                route: route
                    ? {
                        ...route,
                        distance: totalDistance,
                    }
                    : null,
                reports: [],
                requests: [],
                permits: [],
                supplyList: suppliesList,
                equipmentList,
                vehicleList,
                userList: [currentUser],
                userApplications: {},
                requiredRoles: [],
            };

            console.log("Expedition object before submission:", expedition);

            await api.post("/expeditions", expedition);
            alert("Expedition created successfully and user added!");

        } catch (error) {
            console.error("Failed to create expedition:", error);
            alert("Error creating expedition. Please try again.");
        }
    };


    return (
        <Box sx={{ padding: 4 }}>
            <h2>Создать экспедицию</h2>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, maxWidth: "600px", marginBottom: 4 }}>
                <TextField
                    label="Название"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Дата начала"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Дата конца"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Описание"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                />
            </Box>

            {/* Supplies and Locations in parallel */}
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4, marginBottom: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <SuppliesList
                        supplies={suppliesList}
                        onAddSupply={() => setIsSuppliesModalOpen(true)}
                    />
                    <SuppliesForm
                        open={isSuppliesModalOpen}
                        onClose={() => setIsSuppliesModalOpen(false)}
                        onAdd={handleAddSupply}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <LocationList
                        locations={locationsList}
                        onAddLocation={() => setIsLocationModalOpen(true)}
                    />
                    <LocationForm
                        open={isLocationModalOpen}
                        onClose={() => setIsLocationModalOpen(false)}
                        onAdd={handleAddLocation}
                    />
                </Box>
            </Box>

            {/* Equipment and Vehicles in parallel */}
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 4, marginBottom: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <EquipmentList
                        equipment={equipmentList}
                        onAddEquipment={() => setIsEquipmentModalOpen(true)}
                    />
                    <EquipmentForm
                        open={isEquipmentModalOpen}
                        onClose={() => setIsEquipmentModalOpen(false)}
                        onAdd={handleAddEquipment}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <VehicleList
                        vehicles={vehicleList}
                        onAddVehicle={() => setIsVehicleModalOpen(true)}
                    />
                    <VehicleForm
                        open={isVehicleModalOpen}
                        onClose={() => setIsVehicleModalOpen(false)}
                        onAdd={handleAddVehicle}
                    />
                </Box>
            </Box>

            {/* Submit Button */}
            <Box sx={{ textAlign: "center", marginTop: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!name || !startDate || !endDate || !description}
                >
                    Create Expedition
                </Button>
            </Box>
        </Box>
    );
};

export default CreateExpeditionPage;

