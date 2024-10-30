package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {
}
