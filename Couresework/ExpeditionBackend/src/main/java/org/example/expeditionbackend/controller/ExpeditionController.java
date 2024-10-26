package org.example.expeditionbackend.controller;

import org.example.expeditionbackend.model.Expedition;
import org.example.expeditionbackend.service.ExpeditionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expeditions")
public class ExpeditionController {
    private final ExpeditionService expeditionService;

    public ExpeditionController(ExpeditionService expeditionService){
        this.expeditionService = expeditionService;
    }

    @GetMapping
    public List<Expedition> getAllExpeditions(){
        return expeditionService.findAllExpeditions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expedition> getExpeditionById(@PathVariable Long id){
        return expeditionService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Expedition createExpedition(@RequestBody Expedition expedition){
        return expeditionService.saveExpedition(expedition);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpedition(@PathVariable Long id){
        expeditionService.deleteExpedition(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{expeditionId}/add-user/{userId}")
    public ResponseEntity<Void> addUserToExpedition(@PathVariable Long expeditionId, @PathVariable Long userId){
        boolean added = expeditionService.addUserToExpedition(expeditionId, userId);
        return added ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @PostMapping("/{expeditionId}/assign-admin/{userId}")
    public ResponseEntity<Void> assignAdmin(@PathVariable Long expeditionId, @PathVariable Long userId){
        boolean isAdminAssigned = expeditionService.assignAdmin(expeditionId, userId);
        return isAdminAssigned ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    @GetMapping("/{expeditionId}/check-roles")
    public ResponseEntity<Boolean> checkRequiredRoles(@PathVariable Long expeditionId){
        boolean hasAllRoles = expeditionService.checkRequiredRoles(expeditionId);
        return ResponseEntity.ok(hasAllRoles);
    }
}
