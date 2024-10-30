package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Hazard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HazardRepository extends JpaRepository<Hazard, Long> {
}
