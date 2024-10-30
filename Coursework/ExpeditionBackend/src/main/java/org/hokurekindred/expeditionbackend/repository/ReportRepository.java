package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<Report, Long> {
}
