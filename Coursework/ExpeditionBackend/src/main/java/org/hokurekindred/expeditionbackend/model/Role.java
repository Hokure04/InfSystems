package org.hokurekindred.expeditionbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "role")
@Data
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long id;

    @Column(unique = true)
    private String name;

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
