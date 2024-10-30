package org.hokurekindred.expeditionbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Objects;
import java.util.Set;

//TODO Add email and other validations

@Entity
@Table(name = "user_info")
@Data
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(name = "phone_number", unique = true)
    private String phoneNumber;

    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "exp_role")
    private String expeditionRole;

    @Column
    private String skill;

    @Column(name = "about_user")
    private String aboutUser;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @JsonIgnore
    private Set<Role> role;


    @Override
    public int hashCode() {
        return Objects.hash(id, username, email, password);
    }
    @Override
    public String toString() {
        return String.format(
                "User{id=%d, username='%s', email='%s', password='%s', name='%s', surname='%s', phoneNumber='%s', vehicleType='%s', expeditionRole='%s', skill='%s', aboutUser='%s', role=%s, expeditionList=%s}",
                id, username, email, password, name, surname, phoneNumber, vehicleType, expeditionRole, skill, aboutUser, role, expeditionList
        );
    }

    public void addRoles(Role role) {
        this.role.add(role);
    }
    public void removeRoles(Role role) {
        this.role.remove(role);
    }

    @ManyToMany
    @JoinTable(name = "expedition_participant", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "expedition_id"))
    private List<Expedition> expeditionList;

}
