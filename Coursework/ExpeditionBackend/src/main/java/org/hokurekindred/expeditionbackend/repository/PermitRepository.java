package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Permit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PermitRepository extends JpaRepository<Permit, Long> {
    List<Permit> findByExpedition_ExpeditionId(Long expeditionId);
}
