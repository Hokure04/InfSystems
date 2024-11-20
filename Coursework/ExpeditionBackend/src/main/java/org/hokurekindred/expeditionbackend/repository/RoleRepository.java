package org.hokurekindred.expeditionbackend.repository;

import org.hokurekindred.expeditionbackend.authentication.Roles;
import org.hokurekindred.expeditionbackend.model.Role;
import org.hokurekindred.expeditionbackend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(Roles name);
    Set<Role> findByUsers(Set<User> users);
}
