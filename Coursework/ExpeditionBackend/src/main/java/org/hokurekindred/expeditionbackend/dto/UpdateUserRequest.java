package org.hokurekindred.expeditionbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hokurekindred.expeditionbackend.model.Role;

import java.util.Set;

@Data
public class UpdateUserRequest {
    private Long id;

    @NotBlank(message = "Username не может быть пустым")
    @Size(min = 3, max = 20, message = "Username должен быть от 3 до 20 символов")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username может содержать только буквы, цифры и символ подчеркивания")
    private String username;

    @NotBlank(message = "Email не может быть пустым")
    @Email(message = "Некорректный формат email")
    private String email;

    @NotBlank(message = "Имя не может быть пустым")
    @Size(max = 50, message = "Имя не может быть длиннее 50 символов")
    private String name;

    @NotBlank(message = "Фамилия не может быть пустой")
    @Size(max = 50, message = "Фамилия не может быть длиннее 50 символов")
    private String surname;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Номер телефона должен содержать от 10 до 15 цифр и может начинаться с +")
    private String phoneNumber;

    @Size(max = 250, message = "Информация о пользователе не может быть длиннее 250 символов")
    private String aboutUser;

    private Set<Role> role;
}
