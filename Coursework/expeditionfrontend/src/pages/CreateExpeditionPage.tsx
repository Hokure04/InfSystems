import React, { useEffect, useState } from "react";
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
import { Role } from "../entities/role/Role.ts";
import YandexMapComponent from "../map/YandexMapComponent.tsx";

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
    const [route, setRoute] = useState<Route | null>(null);
    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [suppliesList, setSuppliesList] = useState<any[]>([]);
    const [locationsList, setLocationsList] = useState<Location[]>([]);
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [vehicleList, setVehicleList] = useState<Vehicle[]>([]);
    const [isSuppliesModalOpen, setIsSuppliesModalOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isEquipmentModalOpen, setIsEquipmentModalOpen] = useState(false);
    const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setCurrentUser(parsedUser);
        }
    }, []);

    const handleAddSupply = (newSupply: { category: string; quantity: number; description: string }) => {
        setSuppliesList((prev) => [...prev, newSupply]);
    };

    const handleAddLocation = (newLocation: Location) => {
        setLocationsList((prev) => [...prev, newLocation]);
    };

    const handleAddEquipment = (newEquipment: Equipment) => {
        setEquipmentList((prev) => [...prev, newEquipment]);
    };

    const handleAddVehicle = (newVehicle: Vehicle) => {
        setVehicleList((prev) => [...prev, newVehicle]);
    };

    const handleRouteExport = (geoJson: any) => {
        const coordinates = geoJson.geometry.coordinates;
        const routeData: Route = {
            routeId: 0,
            startPoint: JSON.stringify(coordinates),
            endPoint: "SaintPetersburg",
            distance: totalDistance,
            locations: locationsList,
        };
        setRoute(routeData);
    };

    const handleDistanceExport = (distance: number) => {
        setTotalDistance(distance);
    };

    const handleSubmit = async () => {
        if (!name || !startDate || !endDate || !description || !currentUser || !route || totalDistance <= 0) {
            alert("Please fill in all required fields correctly!");
            return;
        }

        const expedition: Expedition = {
            expeditionId: 0,
            name,
            startDate,
            endDate,
            description,
            status: "start",
            route,
            reports: [],
            requests: [],
            permits: [],
            supplyList: suppliesList,
            equipmentList,
            vehicleList,
            userList: [],
            userApplications: {},
            requiredRoles: [],
        };

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Authorization token is missing. Please log in again.");
                return;
            }

            const response = await api.post("/expeditions", expedition, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response)

            const expeditionsResponse = await api.get("/expeditions", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const expeditions = expeditionsResponse.data.expedition_list;
            const lastExpedition = expeditions[expeditions.length - 1];

            if (lastExpedition && currentUser) {
                await api.post(`/expeditions/${lastExpedition.expeditionId}/add-user/${currentUser.id}`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            }

            alert("Expedition created successfully and user added!");
        } catch (error) {
            console.error("Failed to create expedition or add user:", error);
            alert("Error creating expedition or adding user. Please try again.");
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <h2>Create Expedition</h2>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, maxWidth: "600px", marginBottom: 4 }}>
                <TextField
                    label="Expedition Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    multiline
                />
            </Box>

            <Box sx={{ display: "flex", gap: 4, marginBottom: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <SuppliesList supplies={suppliesList} onAddSupply={() => setIsSuppliesModalOpen(true)} />
                    <SuppliesForm open={isSuppliesModalOpen} onClose={() => setIsSuppliesModalOpen(false)} onAdd={handleAddSupply} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <LocationList locations={locationsList} onAddLocation={() => setIsLocationModalOpen(true)} />
                    <LocationForm open={isLocationModalOpen} onClose={() => setIsLocationModalOpen(false)} onAdd={handleAddLocation} />
                </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 4, marginBottom: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <EquipmentList equipment={equipmentList} onAddEquipment={() => setIsEquipmentModalOpen(true)} />
                    <EquipmentForm open={isEquipmentModalOpen} onClose={() => setIsEquipmentModalOpen(false)} onAdd={handleAddEquipment} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <VehicleList vehicles={vehicleList} onAddVehicle={() => setIsVehicleModalOpen(true)} />
                    <VehicleForm open={isVehicleModalOpen} onClose={() => setIsVehicleModalOpen(false)} onAdd={handleAddVehicle} />
                </Box>
            </Box>

            <Box sx={{ marginTop: 4 }}>
                <h3>Map</h3>
                <YandexMapComponent
                    width="100%"
                    height="500px"
                    onRouteExport={handleRouteExport}
                    onDistanceExport={handleDistanceExport}
                    options={true}
                />
            </Box>

            <Box sx={{ textAlign: "center", marginTop: 4 }}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Create Expedition
                </Button>
            </Box>
        </Box>
    );
};

export default CreateExpeditionPage;

