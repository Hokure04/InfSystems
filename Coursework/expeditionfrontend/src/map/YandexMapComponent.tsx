import React, {useEffect, useState} from "react";
import {YMaps, Map, Polyline, Placemark} from "@pbe/react-yandex-maps";
import {
    Box, Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Snackbar,
    SnackbarContent, TextField,
    Tooltip,
    Typography
} from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DrawIcon from "@mui/icons-material/Brush";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from '@mui/icons-material/Check';
import ExploreIcon from '@mui/icons-material/Explore';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {Location} from "../entities/location/Location.ts";

import {useNavigate} from "react-router-dom";
import {Hazard} from "../entities/hazard/Hazard.ts";

interface Route {
    coordinates: number[][];
}

export interface LocalLocation {
    locationName: string;
    coordinates: number[];
    permitType: string;
    hardLevel: number;
    overallRating: number;
}

interface expRoute {
    geoJson: any;
    distance: number;
    location: Location[];
}

interface YandexMapProps {
    width: string;
    height: string;
    onRouteExport?: (expRoute: expRoute) => void; // Callback для передачи GeoJSON
    //onDistanceExport?: (number: any) => void; // Callback
    initialRoute?: any; // Начальный маршрут в формате GeoJSON
    options?: boolean;
    initialLocation?: any;
    //locationsExport?: (Location: any) => void;
}

const YandexMapComponent: React.FC<YandexMapProps> = ({
                                                          width,
                                                          height,
                                                          onRouteExport,
                                                          //onDistanceExport,
                                                          initialRoute,
                                                          options,
                                                          initialLocation,
    //locationsExport,
                                                      }) => {
    const navigate = useNavigate();
    const [route, setRoute] = useState<Route>({coordinates: []});
    const [isDrawing, setIsDrawing] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | undefined>([55.751574, 37.573856]);
    const mapRef = React.useRef<any>(null);
    const [totalDistance, setTotalDistance] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Состояние для ошибки
    const [errorInitMessage, setErrorInitMessage] = useState<string | null>(null); // Состояние для ошибки
    const [locations, setLocations] = useState<LocalLocation[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newLocation, setNewLocation] = useState<LocalLocation | null>(null);


    const handlePlacemarkClick = (coords: number[]) => {
        if (!isDrawing) {
            return;
        }
        const defaultLocation: LocalLocation = {
            locationName: "",
            coordinates: coords,
            permitType: "",
            hardLevel: 0,
            overallRating: 0,
        };
        setNewLocation(defaultLocation);
        setDialogOpen(true);
    };

    function convertLocalLocationsToLocations(
        localLocations: LocalLocation[],
        hazards: Hazard[] = []
    ): Location[] {
        return localLocations.map((localLocation) => {
            let [latitude, longitude] = localLocation.coordinates;
            latitude = parseFloat(latitude.toFixed(9));
            longitude = parseFloat(longitude.toFixed(9));

            return {
                locationId: 0, // Пустой ID
                locationName: localLocation.locationName,
                latitude,
                longitude,
                permitType: localLocation.permitType,
                hardLevel: localLocation.hardLevel,
                overallRating: localLocation.overallRating,
                hazards, // Один и тот же массив hazards
            };
        });
    }


    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewLocation(null);
    };

    const handleDialogSave = () => {
        if (newLocation) {
            setLocations((prevLocations) => [...prevLocations, newLocation]);
            handleDialogClose();
        }
    };

    const handleInputChange = (field: keyof LocalLocation, value: string | number) => {
        if (newLocation) {
            setNewLocation({...newLocation, [field]: value});
        }
    };



    useEffect(() => {
        if (initialRoute) {
            try {
                const geoJson = JSON.parse(initialRoute as string);
                // Проверяем, что GeoJSON является массивом объектов с типом "Feature"
                if (Array.isArray(geoJson) && geoJson[0].geometry?.type === "MultiLineString") {
                    // Извлекаем координаты из всех MultiLineString
                    const allCoordinates = geoJson.flatMap(feature => feature.geometry.coordinates.flat());
                    setRoute({coordinates: allCoordinates});
                    zoomToRoute(allCoordinates);
                }
                // Проверка для типа "LineString"
                else if (geoJson.geometry?.type === "LineString") {
                    setRoute({coordinates: geoJson.geometry.coordinates});
                    zoomToRoute(geoJson.geometry.coordinates);
                } else {
                    setErrorInitMessage("Неверный тип геометрии в GeoJSON");
                }
            } catch (error) {
                // Ошибка при чтении или парсинге
                setErrorInitMessage("Ошибка при загрузке маршрута: " + error);
            }
        }

        // Рассчитываем центр маршрута и зум
        else {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const {latitude, longitude} = position.coords;
                        if (latitude != null && longitude != null) {
                            setUserLocation([latitude, longitude]);

                        }
                    },
                    () => {
                    }
                );

            }
        }
        if (initialLocation) {
            setLocations(initialLocation);
        }
    }, [initialRoute]);

    const zoomToRoute = (coordinates: number[][]) => {
        if (coordinates.length > 300) {
            // Устанавливаем центр и зум карты
            try {
                mapRef.current.setCenter([coordinates[0][0], coordinates[0][1]]);

            } catch (e) {

            }
        } else if (mapRef.current) {
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

                // Проверяем, что GeoJSON является массивом объектов с типом "Feature"
                if (Array.isArray(geoJson) && geoJson[0].geometry?.type === "MultiLineString") {
                    // Извлекаем координаты из всех MultiLineString
                    const allCoordinates = geoJson.flatMap(feature => feature.geometry.coordinates.flat());
                    setRoute({coordinates: allCoordinates});
                    zoomToRoute(allCoordinates);
                }
                // Проверка для типа "LineString"
                else if (geoJson.geometry?.type === "LineString") {
                    setRoute({coordinates: geoJson.geometry.coordinates});
                    zoomToRoute(geoJson.geometry.coordinates);
                } else {
                    setErrorMessage("Неверный тип геометрии в GeoJSON");
                }
            } catch (error) {
                // Ошибка при чтении или парсинге
                setErrorMessage("Ошибка при загрузке маршрута");
            }
        };

        reader.onerror = () => {
            // Обработка ошибок при чтении файла
            setErrorMessage("Ошибка при чтении файла. Пожалуйста, убедитесь, что файл в формате GeoJSON.");
        };

        reader.readAsText(file);
    };

    const clearRoute = () => {
        setRoute({coordinates: []});
    };

    const handleOpenSettings = () => {
        navigate('/map-settings');
    };

    if (!userLocation) {
        return <div>Загрузка карты...</div>;
    }

    if (errorInitMessage) {
        return <Box
            sx={{
                width: width, // Задайте ширину
                height: height, // Задайте высоту
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgb(60, 60, 60)", // Светло-красный фон

                padding: "16px",
                textAlign: "center",
            }}
        >
            <WarningAmberIcon sx={{color: "red", mb: 1, scale: 5, marginBottom: 10}}/>

            <Typography variant="h6" sx={{mb: 1}}>
                Не удалось отрисовать маршрут
            </Typography>
            <Typography variant="body2">
                {errorInitMessage}
            </Typography>
        </Box>;
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
                                <Tooltip title="Настройки" placement="left">

                                    <IconButton color="primary" onClick={handleOpenSettings}>
                                        <SettingsIcon/>
                                    </IconButton>
                                </Tooltip>

                                {options && (
                                    <Tooltip title="Сохранить GeoJSON" placement="left">
                                        <IconButton color="primary" onClick={saveGeoJSON}>
                                            <SaveIcon/>
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {options && (

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
                                )}
                                <Tooltip
                                    title={"Центр маршрута"}
                                    placement="left"
                                >
                                    <IconButton
                                        color={"primary"}
                                        onClick={() => zoomToRoute(route.coordinates)}
                                        disabled={route.coordinates.length == null || route.coordinates.length === 0}
                                    >
                                        <ExploreIcon/>
                                    </IconButton>
                                </Tooltip>
                                {options && (

                                    <Tooltip
                                        title={isDrawing ? "Завершить рисование" : "Рисовать маршрут"}
                                        placement="left"
                                    >
                                        <IconButton
                                            color={isDrawing ? "success" : "primary"}
                                            onClick={() => setIsDrawing(!isDrawing)}
                                        >
                                            <DrawIcon/>
                                        </IconButton>
                                    </Tooltip>
                                )}


                                {(onRouteExport) && options && (
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
                                                // if (onDistanceExport) {
                                                //
                                                //     onDistanceExport(totalDistance);
                                                // }
                                                if (onRouteExport) {
                                                    const exp: expRoute = {geoJson: geoJson, distance: totalDistance, location: convertLocalLocationsToLocations(locations)}
                                                    onRouteExport(exp); // Передаем GeoJSON в родительский компонент
                                                }
                                                // if (locationsExport) {
                                                //     convertLocalLocationsToLocations(locations)
                                                // }
                                            }}
                                            disabled={route.coordinates.length === 1 || route.coordinates.length === 0}
                                        >
                                            <CheckIcon/>
                                        </IconButton>
                                    </Tooltip>
                                )}


                                {options && (

                                    <Tooltip title="Очистить маршрут" placement="left">
                                        <IconButton color="error" onClick={clearRoute}>
                                            <DeleteIcon/>
                                        </IconButton>
                                    </Tooltip>
                                )}
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
                                        onClick={() => handlePlacemarkClick(point)}
                                    />
                                );
                            })}
                            {locations.map((location, index) => (
                                <Placemark
                                    key={`location-${index}`}
                                    geometry={location.coordinates}
                                    options={{
                                        preset: "islands#greenDotIcon", // Зелёный флаг для локаций
                                    }}
                                    properties={{
                                        balloonContent: `<b>${location.locationName}</b><br>
                                Permit Type: ${location.permitType}<br>
                                Hard Level: ${location.hardLevel}<br>
                                Overall Rating: ${location.overallRating}`,
                                    }}
                                    modules={["geoObject.addon.balloon"]} // Включение отображения балуна
                                />
                            ))}
                        </Map>
                    </YMaps>
                </Box>
                {/* Диалоговое окно */}
                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>Заполните информацию о локации</DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <TextField
                                label="Название локации"
                                value={newLocation?.locationName || ""}
                                onChange={(e) =>
                                    handleInputChange("locationName", e.target.value)
                                }
                                fullWidth
                            />
                            <TextField
                                label="Тип доступа"
                                value={newLocation?.permitType || ""}
                                onChange={(e) => handleInputChange("permitType", e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Уровень сложности"
                                type="number"
                                value={newLocation?.hardLevel || 0}
                                onChange={(e) =>
                                    handleInputChange("hardLevel", Number(e.target.value))
                                }
                                fullWidth
                            />
                            <TextField
                                label="Общая оценка"
                                type="number"
                                value={newLocation?.overallRating || 0}
                                onChange={(e) =>
                                    handleInputChange("overallRating", Number(e.target.value))
                                }
                                fullWidth
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose}>Отмена</Button>
                        <Button onClick={handleDialogSave} variant="contained">
                            Сохранить
                        </Button>
                    </DialogActions>
                </Dialog>

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