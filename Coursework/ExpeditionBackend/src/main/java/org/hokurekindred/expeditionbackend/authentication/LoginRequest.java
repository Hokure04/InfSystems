package org.hokurekindred.expeditionbackend.authentication;

import lombok.Data;

@Data
public class LoginRequest {
    private String data;
    private String password;
}
