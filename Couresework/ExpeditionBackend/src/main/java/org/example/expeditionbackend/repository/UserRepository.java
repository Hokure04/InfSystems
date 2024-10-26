package org.example.expeditionbackend.repository;

import org.example.expeditionbackend.model.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserInfo, Long> {
}
