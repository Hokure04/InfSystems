package org.hokurekindred.expeditionbackend.controller;

import jakarta.validation.Valid;
import org.hokurekindred.expeditionbackend.model.Equipment;
import org.hokurekindred.expeditionbackend.service.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/equipment")
public class EquipmentController {
    @Autowired
    private EquipmentService equipmentService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllEquipment(){
        Map<String, Object> response = new HashMap<>();
        response.put("equipment_list", equipmentService.findAllEquipments());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getEquipmentById(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        if (equipmentService.findEquipmentById(id).isPresent()) {
            response.put("equipment", equipmentService.findEquipmentById(id));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("error", String.format("Equipment with id %d not found", id));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createEquipment(@Valid @RequestBody Equipment equipment){
        Map<String, Object> response = new HashMap<>();
        try {
            equipmentService.saveEquipment(equipment);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("error", "Error creating equipment");
        }
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEquipment(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        try {
            equipmentService.deleteEquipment(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("error", "Error deleting equipment");
        }
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Метод добавляет борудование в экспедицию
    @PostMapping("/{equipmentId}/expeditions/{expeditionId}")
    public ResponseEntity<Map<String, Object>> assignEquipment(@PathVariable Long equipmentId, @PathVariable Long expeditionId){
        Map<String, Object> response = new HashMap<>();
        if(equipmentService.assignEquipment(equipmentId, expeditionId)){
            response.put("message", "Equipment assigned successfully");
            response.put("status", HttpStatus.OK);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("Message", "Equipment already assigned");
            response.put("status", HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    // Метод удаляет оборудование из экспедиции
    @DeleteMapping("/{equipmentId}/expeditions/{expeditionId}")
    public ResponseEntity<Map<String, Object>> removeEquipment(@PathVariable Long equipmentId, @PathVariable Long expeditionId){
        Map<String, Object> response = new HashMap<>();
        if(equipmentService.removeEquipment(equipmentId, expeditionId)){
            response.put("message", "Equipment removed successfully");
            response.put("status", HttpStatus.OK);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            response.put("message", "Equipment not found");
            response.put("status", HttpStatus.BAD_REQUEST);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

}
