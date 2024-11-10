package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

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

    private Set<User> users;
}
