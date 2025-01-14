package org.hokurekindred.expeditionbackend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.Set;

@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "id"
)
@Entity
@Table(name = "user_info")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @NotBlank(message = "Username не может быть пустым")
    @Size(min = 3, max = 20, message = "Username должен быть от 3 до 20 символов")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username может содержать только буквы, цифры и символ подчеркивания")
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank(message = "Email не может быть пустым")
    @Email(message = "Некорректный формат email")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Пароль не может быть пустым")
    @Size(min = 8, message = "Пароль должен содержать не менее 8 символов")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "Имя не может быть пустым")
    @Size(max = 50, message = "Имя не может быть длиннее 50 символов")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Фамилия не может быть пустой")
    @Size(max = 50, message = "Фамилия не может быть длиннее 50 символов")
    @Column(nullable = false)
    private String surname;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Номер телефона должен содержать от 10 до 15 цифр и может начинаться с +")
    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    @Size(max = 30, message = "Тип транспортного средства не может быть длиннее 30 символов")
    @Column(name = "vehicle_type")
    private String vehicleType;

    @Size(max = 30, message = "Роль в экспедиции не может быть длиннее 30 символов")
    @Column(name = "exp_role")
    private String expeditionRole;

    @Size(max = 50, message = "Навык не может быть длиннее 50 символов")
    @Column
    private String skill;

    @Size(max = 250, message = "Информация о пользователе не может быть длиннее 250 символов")
    @Column(name = "about_user")
    private String aboutUser;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.REFRESH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.DETACH})
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )

    private Set<Role> role;

    @ManyToMany
    @JsonBackReference
    @JoinTable(name = "expedition_participant", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "expedition_id"))
    private List<Expedition> expeditionList;

    public void addRoles(Role role) {
        this.role.add(role);
    }

    public void removeRoles(Role role) {
        this.role.remove(role);
    }
}