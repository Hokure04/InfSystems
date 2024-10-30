package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
}
