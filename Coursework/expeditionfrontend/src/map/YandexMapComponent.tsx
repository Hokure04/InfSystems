import React, { useEffect, useState } from "react";
import { YMaps, Map, Polyline, Placemark } from "@pbe/react-yandex-maps";
import {Box, IconButton, Snackbar, SnackbarContent, Tooltip} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DrawIcon from "@mui/icons-material/Brush";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from '@mui/icons-material/Check';
import ExploreIcon from '@mui/icons-material/Explore';

import { useNavigate } from "react-router-dom";

interface Route {
    coordinates: number[][];
}

interface YandexMapProps {
    width: string;
    height: string;
    onRouteExport: (geoJson: any) => void; // Callback для передачи GeoJSON
    onDistanceExport: (number: any) => void; // Callback
    initialRoute?: any; // Начальный маршрут в формате GeoJSON
}

const YandexMapComponent: React.FC<YandexMapProps> = ({ width, height, onRouteExport, onDistanceExport, initialRoute }) => {
    const navigate = useNavigate();
    const [route, setRoute] = useState<Route>({ coordinates: [] });
    const [isDrawing, setIsDrawing] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | undefined>(undefined);
    const mapRef = React.useRef<any>(null);
    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Состояние для ошибки


    useEffect(() => {
        if (initialRoute && initialRoute.geometry?.type === "LineString") {
            setRoute({ coordinates: initialRoute.geometry.coordinates });

            // Рассчитываем центр маршрута и зум
            zoomToRoute(initialRoute.geometry.coordinates);
        } else {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
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
        }
    }, [initialRoute]);

    const zoomToRoute = (coordinates: number[][]) => {
        if (mapRef.current) {
            // Рассчитываем минимальные и максимальные значения широты и долготы
            let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;

            coordinates.forEach((point) => {
                const [lat, lng] = point;
                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);
                minLng = Math.min(minLng, lng);
                maxLng = Math.max(maxLng, lng);
            });

            // Вычисляем центр маршрута
            const centerLat = (minLat + maxLat) / 2;
            const centerLng = (minLng + maxLng) / 2;

            // Вычисляем зум, основываясь на размерах маршрута
            const latDiff = maxLat - minLat;
            const lngDiff = maxLng - minLng;
            const zoomLevel = Math.log2(360 / Math.max(latDiff, lngDiff)); // Корректировка зума

            // Устанавливаем центр и зум карты
            mapRef.current.setCenter([centerLat, centerLng]);
            mapRef.current.setZoom(zoomLevel);
        }
    };


    useEffect(() => {
        if (initialRoute && initialRoute.geometry?.type === "LineString") {
            setRoute({ coordinates: initialRoute.geometry.coordinates });
        }
    }, [initialRoute]);

    useEffect(() => {
        setTotalDistance(calculateDistance(route.coordinates));
    }, [route.coordinates]);


    const handleMapClick = (e: any) => {
        if (!isDrawing) return;

        const coords = e.get("coords");
        setRoute((prevRoute) => ({
            coordinates: [...prevRoute.coordinates, coords],
        }));
    };

    const calculateDistance = (coordinates: number[][]): number => {
        if (coordinates.length < 2) return 0;

        const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

        const earthRadiusKm = 6371; // Радиус Земли в километрах

        let total = 0;

        for (let i = 1; i < coordinates.length; i++) {
            const [lat1, lon1] = coordinates[i - 1];
            const [lat2, lon2] = coordinates[i];

            const dLat = toRadians(lat2 - lat1);
            const dLon = toRadians(lon2 - lon1);

            const a =
                Math.sin(dLat / 2) ** 2 +
                Math.cos(toRadians(lat1)) *
                Math.cos(toRadians(lat2)) *
                Math.sin(dLon / 2) ** 2;

            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            total += earthRadiusKm * c; // Добавляем расстояние в километрах
        }

        return total * 1000; // Возвращаем расстояние в метрах
    };

    const handleMapRightClick = (e: any) => {
        const clickCoords = e.get("coords");
        const zoom = mapRef.current?.getZoom() || 9; // Получить текущий зум карты, fallback — 9
        const threshold = 0.05 / Math.pow(2, zoom - 9);

        setRoute((prevRoute) => ({
            coordinates: prevRoute.coordinates.filter(
                (point) =>
                    Math.abs(point[0] - clickCoords[0]) > threshold ||
                    Math.abs(point[1] - clickCoords[1]) > threshold
            ),
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
            try {
                const geoJson = JSON.parse(e.target?.result as string);

                // Проверяем, что GeoJSON содержит корректный маршрут
                if (geoJson.geometry?.type === "LineString") {
                    setRoute({ coordinates: geoJson.geometry.coordinates });
                    zoomToRoute(geoJson.geometry.coordinates);

                } else {
                    setErrorMessage("Ошибка при загрузке маршрута");
                }

            } catch (error) {
                // Ошибка при чтении или парсинге
                setErrorMessage("Ошибка при загрузке маршрута");
            }
        };

        reader.onerror = () => {
            // Обработка ошибок при чтении файла
            alert("Ошибка при чтении файла. Пожалуйста, убедитесь, что файл в формате GeoJSON.");
        };

        reader.readAsText(file);
    };

    const clearRoute = () => {
        setRoute({ coordinates: [] });
    };

    const handleOpenSettings = () => {
        navigate('/map-settings');
    };

    if (!userLocation) {
        return <div>Загрузка карты...</div>;
    }

    return (
        userLocation && (
            <div
                style={{
                    position: "relative",
                    height: height,
                    width: width,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Box
                    position={"relative"}
                    height={"100%"}
                    width={"100%"}
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                >
                    <YMaps
                        query={{
                            apikey: "2bfb7c04-be84-48bc-a467-c68c888de2aa",
                            lang: "ru_RU",
                        }}
                    >
                        <Map
                            defaultState={{
                                center: userLocation,
                                zoom: 9,
                                type:
                                    (localStorage.getItem("mapType") as
                                        | "yandex#map"
                                        | "yandex#satellite"
                                        | "yandex#hybrid") || "yandex#hybrid",
                            }}
                            width="100%"
                            height="100%"
                            onClick={handleMapClick}
                            onContextMenu={handleMapRightClick}
                            instanceRef={(ref) => (mapRef.current = ref)}

                        >
                            {totalDistance > 0 && (
                            <Box
                                position="absolute"
                                top={0}

                                zIndex={2}
                                sx={{
                                    backgroundColor: "rgb(60, 60, 60)",
                                    padding: "5px 10px",
                                    borderBottomRightRadius: "10px",
                                    fontWeight: "bold",
                                }}
                            >
                                Дистанция маршрута: {totalDistance >= 1000
                                    ? `${(totalDistance / 1000).toFixed(2)} км`
                                    : `${Math.round(totalDistance)} м`}
                            </Box>
                                )}
                            <Box
                                position={"absolute"}
                                right={0}
                                top={0}
                                zIndex={1}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    backgroundColor: "rgb(60, 60, 60)",
                                    borderBottomLeftRadius: 10,
                                }}

                            >
                                <Tooltip title="Настройки" placement="left" >

                                    <IconButton color="primary" onClick={handleOpenSettings}>
                                        <SettingsIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Сохранить GeoJSON" placement="left">
                                    <IconButton color="primary" onClick={saveGeoJSON}>
                                        <SaveIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Загрузить GeoJSON" placement="left">
                                    <IconButton color="primary" component="label">
                                        <UploadIcon />
                                        <input
                                            type="file"
                                            accept=".geojson"
                                            hidden
                                            onChange={loadGeoJSON}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip
                                    title={"Центр маршрута"}
                                    placement="left"
                                >
                                    <IconButton
                                        color={"primary"}
                                        onClick={() => zoomToRoute(route.coordinates)}
                                        disabled={route.coordinates.length == null || route.coordinates.length === 0}
                                    >
                                        <ExploreIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip
                                    title={isDrawing ? "Завершить рисование" : "Рисовать маршрут"}
                                    placement="left"
                                >
                                    <IconButton
                                        color={isDrawing ? "success" : "primary"}
                                        onClick={() => setIsDrawing(!isDrawing)}
                                    >
                                        <DrawIcon />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Подтвердить маршрут" placement="left">
                                    <IconButton

                                        color={"primary"}
                                        onClick={() => {
                                            const geoJson = {
                                                type: "Feature",
                                                geometry: {
                                                    type: "LineString",
                                                    coordinates: route.coordinates,
                                                },
                                            };
                                            onDistanceExport(totalDistance);
                                            onRouteExport(geoJson); // Передаем GeoJSON в родительский компонент
                                        }}
                                        disabled={route.coordinates.length === 1 || route.coordinates.length === 0}
                                    >
                                        <CheckIcon />
                                    </IconButton>
                                </Tooltip>


                                <Tooltip title="Очистить маршрут" placement="left">
                                    <IconButton color="error" onClick={clearRoute}>
                                        <DeleteIcon />
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
                            {route.coordinates.map((point, index) => {
                                let iconPreset = "islands#blueDotIcon";
                                if (index === 0) iconPreset = "islands#redDotIcon";
                                if (index === route.coordinates.length - 1) iconPreset = "islands#blueIcon";

                                return (
                                    <Placemark
                                        key={index}
                                        geometry={point}
                                        options={{
                                            preset: iconPreset,
                                        }}
                                    />
                                );
                            })}
                        </Map>
                    </YMaps>
                </Box>
                {/* Snackbar для отображения ошибки */}
                <Snackbar
                    open={!!errorMessage} // Показываем Snackbar, если ошибка есть
                    message={errorMessage}
                    autoHideDuration={4000} // Закрыть через 4 секунды
                    onClose={() => setErrorMessage(null)} // Закрытие сообщения
                    anchorOrigin={{
                        vertical: "bottom", // Позиция снизу
                        horizontal: "left",
                    }}
                >
                    <SnackbarContent

                        style={{
                            backgroundColor: "transparent",
                            color: "red",
                            border: "solid 2px red",
                        }}
                        message={errorMessage}
                    />
                </Snackbar>
            </div>
        )
    );
};

export default YandexMapComponent;