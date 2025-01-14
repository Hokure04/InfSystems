import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import api from "../api";
import YandexMapComponent from "../map/YandexMapComponent";

const CreateExpeditionPage: React.FC = () => {
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [routeGeoJson, setRouteGeoJson] = useState<any>(null); // Храним маршрут
    const [distance, setDistance] = useState<number | null>(null); // Храним расстояние

    const handleSubmit = async () => {
        try {
            await api.post("/expeditions", {
                name,
                startDate,
                endDate,
                description,
                status,
                route: routeGeoJson,
                distance,
            });
            alert("Expedition created successfully!");
        } catch (error) {
            console.error("Failed to create expedition:", error);
            alert("Error creating expedition. Please try again.");
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <h2>Create Expedition</h2>
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    maxWidth: "600px",
                    marginBottom: 4,
                }}
            >
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

            <Box sx={{ marginTop: 4 }}>
                <h3>Map</h3>
                <YandexMapComponent
                    width="100%"
                    height="500px"
                    onRouteExport={(geoJson: any) => setRouteGeoJson(geoJson)}
                    onDistanceExport={(value: number) => setDistance(value)}
                />
            </Box>

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


