package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Permit;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermitRepository extends JpaRepository<Permit, Long> {
}
