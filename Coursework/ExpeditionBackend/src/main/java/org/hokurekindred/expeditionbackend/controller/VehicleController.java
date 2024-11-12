package org.hokurekindred.expeditionbackend.controller;

import jakarta.validation.Valid;
import org.hokurekindred.expeditionbackend.model.Vehicle;
import org.hokurekindred.expeditionbackend.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/vehicles")
public class VehicleController {
    @Autowired
    private VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllVehicles(){
        Map<String, Object> response = new HashMap<>();
        response.put("vehicle_list", vehicleService.findAllVehicles());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getVehicleById(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        if (vehicleService.findVehicleById(id).isPresent()) {
            response.put("vehicle", vehicleService.findVehicleById(id));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("error", String.format("Vehicle with id %d not found", id));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createVehicle(@Valid @RequestBody Vehicle vehicle){
        Map<String, Object> response = new HashMap<>();
        try {
            vehicleService.saveVehicle(vehicle);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("error", "Error creating vehicle");
        }
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteVehicle(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        try {
            vehicleService.deleteVehicle(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("error", "Error deleting vehicle");
        }
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Метод добавляет транспорт в экспедицию
    @PostMapping("/{vehicleId}/expeditions/{expeditionId}")
    public ResponseEntity<Map<String, Object>> assignVehicle(@PathVariable Long vehicleId, @PathVariable Long expeditionId){
        Map<String, Object> response = new HashMap<>();
        if(vehicleService.assignVehicle(vehicleId, expeditionId)){
            response.put("message", "Vehicle assigned");
            response.put("status", HttpStatus.OK);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("Message", "Vehicle already assigned");
            response.put("status", HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    // Метод удаляет транспорт из экспедиции
    @DeleteMapping("/{vehicleId}/expeditions/{expeditionId}")
    public ResponseEntity<Map<String, Object>> removeVehicle(@PathVariable Long vehicleId, @PathVariable Long expeditionId){
        Map<String, Object> response = new HashMap<>();
        if(vehicleService.removeVehicle(vehicleId, expeditionId)){
            response.put("message", "Vehicle removed successfully");
            response.put("status", HttpStatus.OK);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("message", "Vehicle not found");
            response.put("status", HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

}
