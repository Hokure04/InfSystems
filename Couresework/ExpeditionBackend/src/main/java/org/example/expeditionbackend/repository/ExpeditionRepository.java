package org.example.expeditionbackend.repository;

import org.example.expeditionbackend.model.Expedition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpeditionRepository extends JpaRepository<Expedition, Long> {
}
