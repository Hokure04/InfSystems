package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository extends JpaRepository<Request, Long> {
}
