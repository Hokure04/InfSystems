package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Expedition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpeditionRepository extends JpaRepository<Expedition, Long> {
}
