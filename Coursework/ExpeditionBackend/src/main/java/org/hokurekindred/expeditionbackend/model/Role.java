package org.hokurekindred.expeditionbackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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
    @NotNull(message = "Name cannot be null")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    @Pattern(regexp = "^[A-Z_]+$", message = "Name must contain only uppercase English letters and underscores")
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
