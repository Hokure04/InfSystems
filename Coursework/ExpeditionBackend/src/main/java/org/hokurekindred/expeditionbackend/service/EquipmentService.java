package org.hokurekindred.expeditionbackend.service;

import org.hokurekindred.expeditionbackend.model.Certificate;
import org.hokurekindred.expeditionbackend.model.Equipment;
import org.hokurekindred.expeditionbackend.model.Expedition;
import org.hokurekindred.expeditionbackend.repository.CertificateRepository;
import org.hokurekindred.expeditionbackend.repository.EquipmentRepository;
import org.hokurekindred.expeditionbackend.repository.ExpeditionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {
    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private ExpeditionRepository expeditionRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    public List<Equipment> findAllEquipments() {
        return equipmentRepository.findAll();
    }

    public Optional<Equipment> findEquipmentById(Long id) {
        return equipmentRepository.findById(id);
    }

    public void saveEquipment(Equipment equipment) {
        equipmentRepository.save(equipment);
    }

    public void updateEquipment(Long equipmentId, Equipment changedVehicle) {
        equipmentRepository.findById(equipmentId).map(equipment -> {
            equipment.setName(changedVehicle.getName());
            equipment.setType(changedVehicle.getType());
            equipment.setDescription(changedVehicle.getDescription());
            equipment.setStatus(changedVehicle.getStatus());
            equipment.setReservation(changedVehicle.getReservation());
            equipment.setPrice(changedVehicle.getPrice());
            return equipmentRepository.save(equipment);
        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found"));

    }

    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }

    public boolean assignEquipment(Long equipmentId, Long expeditionId) {
        Equipment equipment = equipmentRepository.findById(equipmentId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found"));
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        if (equipment.getReservation()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Equipment is already reserved");
        }

        if (!equipment.getExpeditionList().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Equipment is already assigned to another expedition");
        }

        equipment.getExpeditionList().add(expedition);
        equipmentRepository.save(equipment);
        return true;
    }

    public boolean removeEquipment(Long equipmentId, Long expeditionId) {
        Equipment equipment = equipmentRepository.findById(equipmentId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found"));
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        if (equipment.getExpeditionList().remove(expedition)) {
            equipmentRepository.save(equipment);
            return true;
        }
        return false;
    }

    public Certificate saveCertificate(Long equipmentId, Certificate certificate) {
        Equipment equipment = equipmentRepository.findById(equipmentId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found"));
        certificate.setEquipment(equipment);
        return certificateRepository.save(certificate);
    }

    public Certificate updateCertificate(Long equipmentId, Long certificateId, Certificate changedCertificate) {
        Certificate certificate = certificateRepository.findById(certificateId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certificate not found"));

        if (!certificate.getEquipment().getEquipmentId().equals(equipmentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Certificate doesn't belong equipment");
        }

        certificate.setName(changedCertificate.getName());
        certificate.setDescription(changedCertificate.getDescription());
        certificate.setStatus(changedCertificate.getStatus());
        certificate.setSerialNumber(changedCertificate.getSerialNumber());
        return certificateRepository.save(certificate);
    }

    public void deleteCertificate(Long equipmentId, Long certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certificate not found"));
        if (!certificate.getEquipment().getEquipmentId().equals(equipmentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Certificate doesn't belong equipment");
        }
        certificateRepository.delete(certificate);
    }

    public Certificate getCertificateById(Long equipmentId, Long certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Certificate not found"));
        if (!certificate.getEquipment().getEquipmentId().equals(equipmentId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Certificate doesn't belong equipment");
        }
        return certificate;
    }

    public List<Certificate> getAllCertificates(Long id) {
        Equipment equipment = equipmentRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Equipment not found"));
        return equipment.getCertificates();
    }
}
