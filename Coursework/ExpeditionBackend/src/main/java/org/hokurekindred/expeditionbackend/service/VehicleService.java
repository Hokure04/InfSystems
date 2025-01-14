package org.hokurekindred.expeditionbackend.service;

import org.hokurekindred.expeditionbackend.model.Expedition;
import org.hokurekindred.expeditionbackend.model.Route;
import org.hokurekindred.expeditionbackend.model.Vehicle;
import org.hokurekindred.expeditionbackend.repository.ExpeditionRepository;
import org.hokurekindred.expeditionbackend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ExpeditionRepository expeditionRepository;

    public List<Vehicle> findAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> findVehicleById(Long vehicleId) {
        return vehicleRepository.findById(vehicleId);
    }

    public void saveVehicle(Vehicle vehicle) {
        vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long vehicleId, Vehicle changedVehicle) {
        return vehicleRepository.findById(vehicleId).map(vehicle -> {
            vehicle.setType(changedVehicle.getType());
            vehicle.setModel(changedVehicle.getModel());
            vehicle.setCapacity(changedVehicle.getCapacity());
            vehicle.setDescription(changedVehicle.getDescription());
            vehicle.setStatus(changedVehicle.getStatus());
            vehicle.setFuelConsumption(changedVehicle.getFuelConsumption());
            vehicle.setFuelTankCapacity(changedVehicle.getFuelTankCapacity());
            vehicle.setFuelType(changedVehicle.getFuelType());
            vehicle.setReservation(changedVehicle.getReservation());
            vehicle.setPrice(changedVehicle.getPrice());
            return vehicleRepository.save(vehicle);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
    }

    public void deleteVehicle(Long vehicleId) {
        vehicleRepository.deleteById(vehicleId);
    }

    public boolean assignVehicle(Long vehicleId, Long expeditionId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));

        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        if (!vehicle.getExpeditionList().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vehicle already assigned to another expedition");
        }

        vehicle.getExpeditionList().add(expedition);
        vehicleRepository.save(vehicle);
        return true;
    }

    public boolean removeVehicle(Long vehicleId, Long expeditionId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        if (vehicle.getExpeditionList().remove(expedition)) {
            vehicleRepository.save(vehicle);
            return true;
        }
        return false;
    }

    public Double calculateFuelRequirement(Long id, Long expeditionId) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vehicle not found"));
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));
        Route route = expedition.getRoute();
        if (route == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Route not assigned");
        }
        Double distance = route.getDistance();
        if (distance == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem with Route distance");
        }
        double fuelRequired = (distance / 100) * vehicle.getFuelConsumption();
        fuelRequired += fuelRequired * 0.1;
        if (fuelRequired > vehicle.getFuelTankCapacity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Fuel requirement exceeds tank capacity");
        }
        return fuelRequired;
    }
}
