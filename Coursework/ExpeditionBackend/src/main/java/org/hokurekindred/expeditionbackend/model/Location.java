package org.hokurekindred.expeditionbackend.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "location")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long locationId;

    @Column(name = "location_name", nullable = false)
    @NotNull(message = "Location name cannot be null")
    @Size(min = 3, max = 100, message = "Location name must be between 3 and 100 characters")
    private String locationName;

    @Column(nullable = false, unique = true)
    @NotNull(message = "Coordinates cannot be null")
    @Pattern(regexp = "^-?\\d{1,2}(\\.\\d{1,6})?,\\s?-?\\d{1,3}(\\.\\d{1,6})?$",
            message = "Invalid coordinates format. Expected format: latitude, longitude")
    private String coordinates;

    @Column(name = "permit_type", nullable = false)
    @NotNull(message = "Permit type cannot be null")
    @Size(min = 3, max = 50, message = "Permit type must be between 3 and 50 characters")
    private String permitType;

    @Column(name = "hard_level")
    @Min(value = 1, message = "Hard level must be greater than or equal to 1")
    @Max(value = 10, message = "Hard level must be less than or equal to 10")
    private Integer hardLevel;

    @Column(name = "overall_rating")
    @DecimalMin(value = "0.0", inclusive = false, message = "Overall rating must be greater than 0")
    @DecimalMax(value = "5.0", message = "Overall rating must be less than or equal to 5")
    private Double overallRating;

    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    @NotNull(message = "Route cannot be null")
    private Route route;

    @OneToMany(mappedBy = "location", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Hazard> hazards;
}
