package org.hokurekindred.expeditionbackend.controller;

import org.hokurekindred.expeditionbackend.model.Expedition;
import org.hokurekindred.expeditionbackend.repository.UserRepository;
import org.hokurekindred.expeditionbackend.service.ExpeditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/expeditions")
@PreAuthorize("hasRole('USER')")
public class ExpeditionController {
    @Autowired
    ExpeditionService expeditionService;
    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllExpeditions(){
        Map<String, Object> response = new HashMap<>();
        response.put("expedition_list", expeditionService.findAllExpeditions());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getExpeditionById(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.findById(id).isPresent()) {
            response.put("expedition", expeditionService.findById(id));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("error", String.format("Expedition with id %d not found", id));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createExpedition(@RequestBody Expedition expedition){
        Map<String, Object> response = new HashMap<>();
        try {
            expeditionService.saveExpedition(expedition);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("error", "Error creating expedition");
        }
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteExpedition(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        try {
            expeditionService.deleteExpedition(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("error", "Error deleting expedition");
        }
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/{expeditionId}/add-user/{userId}")
    public ResponseEntity<Map<String, Object>> addUserToExpedition(@PathVariable Long expeditionId, @PathVariable Long userId){
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.addUserToExpedition(expeditionId, userId)) {
            response.put("expedition", expeditionService.findById(expeditionId));
            response.put("user", userRepository.findById(userId));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("error", "Error adding user to expedition");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/{expeditionId}/assign-admin/{userId}")
    public ResponseEntity<Map<String, Object>> assignAdmin(@PathVariable Long expeditionId, @PathVariable Long userId){
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.assignAdmin(expeditionId, userId)) {
            response.put("expedition", expeditionService.findById(expeditionId));
            response.put("user", userRepository.findById(userId));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("error", "Error assigning admin to expedition");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/{expeditionId}/check-roles")
    public ResponseEntity<Map<String, Object>> checkRequiredRoles(@PathVariable Long expeditionId){
        Map<String, Object> response = new HashMap<>();
        response.put("hasRequiredRoles", expeditionService.findById(expeditionId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
