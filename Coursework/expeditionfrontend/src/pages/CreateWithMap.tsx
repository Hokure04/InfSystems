import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import api from "../api";
import { Expedition } from "../entities/expedition/Expedition.ts";
import {Route} from "../entities/route/Route.ts";

const CreateExpeditionPage: React.FC = () => {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [route] = useState<Route | null>(null);
    const [totalDistance] = useState<number>(0);

    const handleSubmit = async () => {
        if (!name || !startDate || !endDate || !description) {
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
                status: status || null,
                route: route
                    ? {
                        ...route,
                        distance: totalDistance,
                    }
                    : null,
                reports: [],
                requests: [],
                permits: [],
                supplyList: [],
                equipmentList: [],
                vehicleList: [],
                userList: [],
                userApplications: {},
                requiredRoles: [],
            };

            console.log("Expedition object before submission:", expedition);
            await api.post("/expeditions", expedition);

            alert("Expedition created successfully!");
        } catch (error) {
            console.error("Failed to create expedition:", error);
            alert("Error creating expedition. Please try again.");
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <h2>Create Expedition</h2>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, maxWidth: "600px", marginBottom: 4 }}>
                {/* Expedition form fields */}
                <TextField
                    label="Name"
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
                <TextField
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    margin="normal"
                />
            </Box>

            {/* Optional Map Component */}
            {/* You can remove this if you don't want to use the map */}
            {/* <Box sx={{ marginTop: 4 }}>
                <h3>Map</h3>
                <YandexMapComponent
                    width="100%"
                    height="500px"
                    onRouteExport={handleRouteExport}
                    onDistanceExport={handleDistanceExport}
                    options={true}
                />
            </Box> */}

            {/* Submit Button */}
            <Box sx={{ textAlign: "center", marginTop: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!name || !startDate || !endDate || !description}  // Check if required fields are filled
                >
                    Create Expedition
                </Button>
            </Box>
        </Box>
    );
};

export default CreateExpeditionPage;