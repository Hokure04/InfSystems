package org.hokurekindred.expeditionbackend.service;

import org.hokurekindred.expeditionbackend.model.Expedition;
import org.hokurekindred.expeditionbackend.model.Vehicle;
import org.hokurekindred.expeditionbackend.repository.ExpeditionRepository;
import org.hokurekindred.expeditionbackend.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private ExpeditionRepository expeditionRepository;

    public List<Vehicle> findAllVehicles(){
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> findVehicleById(Long vehicleId){
        return vehicleRepository.findById(vehicleId);
    }

    public Vehicle saveVehicle(Vehicle vehicle){
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long vehicleId, Vehicle changedVehicle) {
        return vehicleRepository.findById(vehicleId)
                .map(vehicle -> {
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
                })
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

    }

    public void deleteVehicle(Long vehicleId){
        vehicleRepository.deleteById(vehicleId);
    }

    public boolean assignVehicle(Long vehicleId, Long expeditionId){
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new RuntimeException("Expedition not found"));

        if(!vehicle.getExpeditionList().contains(expedition)){
            vehicle.getExpeditionList().add(expedition);
            vehicleRepository.save(vehicle);
            return true;
        }
        return false;
    }

    public boolean removeVehicle(Long vehicleId, Long expeditionId){
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new RuntimeException("Expedition not found"));

        if(vehicle.getExpeditionList().remove(expedition)){
            vehicleRepository.save(vehicle);
            return true;
        }
        return false;
    }
}
