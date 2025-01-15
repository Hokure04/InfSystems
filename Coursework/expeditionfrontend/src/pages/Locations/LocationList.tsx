import React from "react";
import { Box, List, ListItem, ListItemText, Button } from "@mui/material";
import { Location } from "../../entities/location/Location";

interface LocationsListProps {
    locations: Location[];
    onAddLocation: () => void;
}

const LocationsList: React.FC<LocationsListProps> = ({ locations, onAddLocation }) => {
    return (
        <Box sx={{ marginTop: 4 }}>
            <h3>Список локаций:</h3>
            <List>
                {locations.map((location, index) => (
                    <ListItem key={index}>
                        <ListItemText
                            primary={`Location: ${location.locationName}`}
                            secondary={`Coordinates: ${location.coordinates}, Permit Type: ${location.permitType}, Hard Level: ${location.hardLevel}, Rating: ${location.overallRating}`}
                        />
                    </ListItem>
                ))}
            </List>
            <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: 2 }}>
                <Button variant="contained" color="secondary" onClick={onAddLocation}>
                    Добавить локации
                </Button>
            </Box>
        </Box>
    );
};

export default LocationsList;
