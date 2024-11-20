package org.hokurekindred.expeditionbackend.controller;

import jakarta.validation.Valid;
import org.hokurekindred.expeditionbackend.model.Certificate;
import org.hokurekindred.expeditionbackend.model.Equipment;
import org.hokurekindred.expeditionbackend.service.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateEquipment(@PathVariable Long id, @RequestBody Equipment equipment){
        Map<String, Object> response = new HashMap<>();
        try{
            Equipment changedEquipment = equipmentService.updateEquipment(id, equipment);
            response.put("message", "Equipment updated successfully");
            response.put("equipment", equipment);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch(Exception e){
            response.put("error", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
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

    @PostMapping("/{id}/certificates")
    public ResponseEntity<Map<String, Object>> saveCertificate(@PathVariable Long id, @RequestBody Certificate certificate){
        Map<String, Object> response = new HashMap<>();
        try{
            Certificate savedCertificate = equipmentService.saveCertificate(id, certificate);
            response.put("message", "Certificate added successfully");
            response.put("certificate", savedCertificate);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.put("error", "Error while creating certificate " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{equipmentId}/certificates/{certificateId}")
    public ResponseEntity<Map<String, Object>> updateCertificate(@PathVariable Long equipmentId, @PathVariable Long certificateId, @RequestBody Certificate changedCertificate){
        Map<String, Object> response = new HashMap<>();
        try{
            Certificate certificate = equipmentService.updateCertificate(equipmentId, certificateId, changedCertificate);
            response.put("message", "Certificate updated successfully");
            response.put("certificate", certificate);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.put("error", "Error while updating certificate " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @DeleteMapping("/{equipmentId}/certificates/{certificateId}")
    public ResponseEntity<Map<String, Object>> deleteCertificate(@PathVariable Long equipmentId,@PathVariable Long certificateId){
        Map<String, Object> response = new HashMap<>();
        try {
            equipmentService.deleteCertificate(equipmentId, certificateId);
            response.put("message", "Certificate deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.put("error", "Error while deleting certificate "+ e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{equipmentId}/certificates/{certificateId}")
    public ResponseEntity<Map<String, Object>> getCertificateById(@PathVariable Long equipmentId, @PathVariable Long certificateId){
        Map<String, Object> response = new HashMap<>();
        try{
            Certificate certificate = equipmentService.getCertificateById(equipmentId, certificateId);
            response.put("certificate", certificate);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.put("error", "Certificate not found");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @GetMapping("/{id}/certificates")
    public ResponseEntity<Map<String, Object>> getAllCertificates(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        try{
            List<Certificate> certificates = equipmentService.getAllCertificates(id);
            response.put("certificates", certificates);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.put("error", "Certificates not found");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
