package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<Certificate, Long> {
}
