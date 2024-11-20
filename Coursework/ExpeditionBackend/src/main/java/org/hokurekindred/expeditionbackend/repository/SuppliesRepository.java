package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Report;
import org.hokurekindred.expeditionbackend.model.Supplies;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuppliesRepository extends JpaRepository<Supplies, Long> {
    List<Supplies> findByReport(Report report);
}
