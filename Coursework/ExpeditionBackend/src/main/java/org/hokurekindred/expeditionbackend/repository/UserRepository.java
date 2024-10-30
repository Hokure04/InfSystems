package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserInfo, Long> {
}
