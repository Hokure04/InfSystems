package org.hokurekindred.expeditionbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hokurekindred.expeditionbackend.authentication.Roles;

import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "role")
@Data
@NoArgsConstructor
public class Role {

    public Role(Roles role) {
        this.name = role;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long id;

    @Column(unique = true)
    @Enumerated(EnumType.STRING)
    private Roles name;

    @ManyToMany(mappedBy = "role", fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<User> users;

    @Override
    public String toString() {
        return String.format("Role{id=%d, name='%s'}", id, name);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}
