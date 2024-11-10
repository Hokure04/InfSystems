package org.hokurekindred.expeditionbackend.authentication;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class LoginRequest {
    @NotBlank(message = "Поле emailUsername не может быть пустым")
    private String emailUsername;

    @NotBlank(message = "Пароль не может быть пустым")
    @Size(min = 8, message = "Пароль должен содержать не менее 8 символов")
    private String password;
}
