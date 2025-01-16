package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RequestRepository extends JpaRepository<Request, Long> {
    Optional<Request> findRequestByUsername(String username);
}
