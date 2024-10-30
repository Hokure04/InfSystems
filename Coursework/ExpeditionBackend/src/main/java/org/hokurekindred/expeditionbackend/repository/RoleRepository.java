package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.model.Role;
import org.hokurekindred.expeditionbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
    Set<Role> findByUsers(Set<User> users);
}
