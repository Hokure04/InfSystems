import React, { useState } from "react";
import { YMaps, Map, Polyline } from "@pbe/react-yandex-maps";
import { Button } from "@mui/material";

interface Route {
    coordinates: number[][];
}

const YandexMapComponent: React.FC = () => {
    const [route, setRoute] = useState<Route>({ coordinates: [] });
    const [isDrawing, setIsDrawing] = useState(false);

    const handleMapClick = (e: any) => {
        if (!isDrawing) return;

        const coords = e.get("coords");
        setRoute((prevRoute) => ({
            coordinates: [...prevRoute.coordinates, coords],
        }));
    };

    const saveGeoJSON = () => {
        const geoJson = {
            type: "Feature",
            geometry: {
                type: "LineString",
                coordinates: route.coordinates,
            },
        };
        const blob = new Blob([JSON.stringify(geoJson, null, 2)], {
            type: "application/json",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "route.geojson";
        link.click();
    };

    const loadGeoJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const geoJson = JSON.parse(e.target?.result as string);
            if (geoJson.geometry?.type === "LineString") {
                setRoute({ coordinates: geoJson.geometry.coordinates });
            }
        };
        reader.readAsText(file);
    };

    return (
        <div style={{ position: "relative", height: "100vh" }}>
            <YMaps>
                <Map
                    defaultState={{ center: [55.751574, 37.573856], zoom: 9 }}
                    width="100%"
                    height="90%"
                    onClick={handleMapClick}
                >
                    <Polyline
                        geometry={route.coordinates}
                        options={{
                            strokeColor: "#0000FF",
                            strokeWidth: 4,
                            strokeOpacity: 0.5,
                        }}
                    />
                </Map>
            </YMaps>
            <div style={{ position: "absolute", top: 10, left: 10 }}>
                <Button
                    variant="contained"
                    color={isDrawing ? "secondary" : "primary"}
                    onClick={() => setIsDrawing(!isDrawing)}
                >
                    {isDrawing ? "Завершить Рисование" : "Рисовать Маршрут"}
                </Button>
                <Button variant="contained" onClick={saveGeoJSON}>
                    Сохранить GeoJSON
                </Button>
                <Button variant="contained" component="label">
                    Загрузить GeoJSON
                    <input
                        type="file"
                        accept=".geojson"
                        hidden
                        onChange={loadGeoJSON}
                    />
                </Button>
            </div>
        </div>
    );
};

export default YandexMapComponent;