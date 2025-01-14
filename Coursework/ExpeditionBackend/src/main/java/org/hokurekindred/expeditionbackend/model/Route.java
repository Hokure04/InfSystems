package org.hokurekindred.expeditionbackend.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Entity
@Table(name = "route")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "route_id")
    private Long routeId;

    @Column(nullable = false)
    @NotNull(message = "Start point cannot be null")
    @NotEmpty(message = "Start point cannot be empty")
    @Size(min = 3, max = 100, message = "Start point must be between 3 and 100 characters")
    private String startPoint;

    @Column(nullable = false)
    @NotNull(message = "End point cannot be null")
    @NotEmpty(message = "End point cannot be empty")
    @Size(min = 3, max = 100, message = "End point must be between 3 and 100 characters")
    private String endPoint;

    @Column(nullable = false)
    @NotNull(message = "Distance cannot be null")
    private Double distance;

    @OneToMany(mappedBy = "route", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Location> locations;
}
