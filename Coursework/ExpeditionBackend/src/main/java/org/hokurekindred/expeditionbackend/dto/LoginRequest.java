package org.hokurekindred.expeditionbackend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class LoginRequest {
    @NotBlank(message = "Поле login не может быть пустым")
    @NotNull(message = "Поле login не может быть пустым")
    private String login;

    @NotBlank(message = "Пароль не может быть пустым")
    @NotNull(message = "Поле login не может быть пустым")
    @Size(min = 8, message = "Пароль должен содержать не менее 8 символов")
    private String password;
}
