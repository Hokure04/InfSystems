package org.hokurekindred.expeditionbackend.service;

import org.hokurekindred.expeditionbackend.model.Equipment;
import org.hokurekindred.expeditionbackend.model.Expedition;
import org.hokurekindred.expeditionbackend.repository.EquipmentRepository;
import org.hokurekindred.expeditionbackend.repository.ExpeditionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private ExpeditionRepository expeditionRepository;

    public List<Equipment> findAllEquipments(){
        return equipmentRepository.findAll();
    }

    public Optional<Equipment> findEquipmentById(Long id){
        return equipmentRepository.findById(id);
    }

    public Equipment saveEquipment(Equipment equipment){
        return equipmentRepository.save(equipment);
    }

    public Equipment updateVehicle(Long equipmentId, Equipment changedVehicle) {
        return equipmentRepository.findById(equipmentId)
                .map(equipment -> {
                    equipment.setName(changedVehicle.getName());
                    equipment.setType(changedVehicle.getType());
                    equipment.setDescription(changedVehicle.getDescription());
                    equipment.setStatus(changedVehicle.getStatus());
                    equipment.setReservation(changedVehicle.getReservation());
                    equipment.setPrice(changedVehicle.getPrice());
                    return equipmentRepository.save(equipment);
                })
                .orElseThrow(() -> new RuntimeException("Equipment not found"));

    }

    public void deleteEquipment(Long id){
        equipmentRepository.deleteById(id);
    }

    public boolean assignEquipment(Long equipmentId, Long expeditionId){
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new RuntimeException("Expedition not found"));

        if(!equipment.getExpeditionList().contains(expedition)){
            equipment.getExpeditionList().add(expedition);
            equipmentRepository.save(equipment);
            return true;
        }
        return false;
    }

    public boolean removeEquipment(Long equipmentId, Long expeditionId){
        Equipment equipment = equipmentRepository.findById(equipmentId)
                .orElseThrow(() -> new RuntimeException("Equipment not found"));
        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new RuntimeException("Expedition not found"));

        if(equipment.getExpeditionList().remove(expedition)){
            equipmentRepository.save(equipment);
            return true;
        }
        return false;
    }
}
