package org.hokurekindred.expeditionbackend.service;

import org.hokurekindred.expeditionbackend.authentication.Roles;
import org.hokurekindred.expeditionbackend.model.Role;
import org.hokurekindred.expeditionbackend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleService {
    @Autowired
    private RoleRepository roleRepository;

    @Transactional
    public Role ensureRoleExists(Roles roleName) {
        return roleRepository.findByName(roleName).orElseGet(() -> {
            Role newRole = new Role(roleName);
            return roleRepository.save(newRole);
        });
    }
}
