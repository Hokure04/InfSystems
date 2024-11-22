package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LocationRepository extends JpaRepository<Location, Long> {
    List<Location> findByRouteRouteId(Long routeId);
}
