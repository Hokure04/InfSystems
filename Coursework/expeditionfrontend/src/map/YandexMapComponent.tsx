import React, {useEffect, useState} from "react";
import {YMaps, Map, Polyline} from "@pbe/react-yandex-maps";
import {Box, IconButton, Tooltip} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DrawIcon from "@mui/icons-material/Brush";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/CloudUpload";
import {useNavigate} from "react-router-dom";

interface Route {
    coordinates: number[][];
}
interface YandexMapProps {
    width: string;
    height: string;
}

const YandexMapComponent: React.FC<YandexMapProps> = ({ width, height }) => {
    const navigate = useNavigate();
    const [route, setRoute] = useState<Route>({coordinates: []});
    const [isDrawing, setIsDrawing] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | undefined>(undefined);

    // Получение текущего местоположения пользователя
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    setUserLocation([latitude, longitude]);
                },
                () => {
                    // Устанавливаем координаты по умолчанию, если доступ запрещен
                    setUserLocation([55.751574, 37.573856]); // Москва
                }
            );
        } else {
            setUserLocation([55.751574, 37.573856]); // Москва
        }
    }, []);

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
                setRoute({coordinates: geoJson.geometry.coordinates});
            }
        };
        reader.readAsText(file);
    };
    const handleOpenSettings = () => {
        navigate('/map-settings');
    };

    if (!userLocation) {
        return <div>Загрузка карты...</div>;
    }

    return (
        userLocation && (

            <div style={{
                position: "relative", height: height, width: width,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}>
                <Box position={"relative"} height={"100%"} width={"100%"} display={"flex"} flexDirection={"column"}
                     alignItems={"center"}>


                    <YMaps query={{
                        apikey: "2bfb7c04-be84-48bc-a467-c68c888de2aa",
                        lang: "ru_RU",
                    }}>

                        <Map
                            defaultState={{
                                center: userLocation,
                                zoom: 9,
                                type: (localStorage.getItem("mapType") as "yandex#map" | "yandex#satellite" | "yandex#hybrid") || "yandex#hybrid"
                            }}
                            width="100%"
                            height="100%"
                            onClick={handleMapClick}
                        >
                            <Box
                                position={"absolute"}
                                right={0}
                                zIndex={1}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",

                                }}
                            >
                                <Tooltip title="Настройки" placement="left">
                                    <IconButton color="primary" onClick={handleOpenSettings}>
                                        <SettingsIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title={isDrawing ? "Завершить рисование" : "Рисовать маршрут"}
                                         placement="left">
                                    <IconButton
                                        color={isDrawing ? "secondary" : "primary"}
                                        onClick={() => setIsDrawing(!isDrawing)}
                                    >
                                        <DrawIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Сохранить GeoJSON" placement="left">
                                    <IconButton color="primary" onClick={saveGeoJSON}>
                                        <SaveIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Загрузить GeoJSON" placement="left">
                                    <IconButton color="primary" component="label">
                                        <UploadIcon/>
                                        <input
                                            type="file"
                                            accept=".geojson"
                                            hidden
                                            onChange={loadGeoJSON}
                                        />
                                    </IconButton>
                                </Tooltip>
                            </Box>

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
                </Box>

            </div>
        )
    );
};

export default YandexMapComponent;