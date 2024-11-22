package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Expedition;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExpeditionRepository extends JpaRepository<Expedition, Long> {
    @Override
    Optional<Expedition> findById(Long id);
}
