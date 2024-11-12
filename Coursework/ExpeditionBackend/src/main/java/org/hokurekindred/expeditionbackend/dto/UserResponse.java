package org.hokurekindred.expeditionbackend.dto;

import lombok.Data;
import org.hokurekindred.expeditionbackend.model.Role;

import java.util.Set;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String name;
    private String surname;
    private String vehicleType;
    private String expeditionRole;
    private String skill;
    private String aboutUser;
    private Set<Role> role;
}
