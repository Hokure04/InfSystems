package org.hokurekindred.expeditionbackend.authentication;


import lombok.Getter;

@Getter
public enum Roles {
    USER("USER"),
    MODERATOR("MODERATOR"),
    ADMIN("ADMIN"),
    OWNER("OWNER");

    private final String role;

    Roles(String role) {
        this.role = role;
    }

}
