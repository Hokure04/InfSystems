package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}
