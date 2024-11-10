package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hazard")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hazard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "hazard_id")
    private Long hazardId;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column
    private String description;

    @NotNull(message = "Risk level cannot be null")
    @Min(value = 1, message = "Risk level must be at least 1")
    @Max(value = 5, message = "Risk level cannot exceed 5")
    @Column(name = "risk_level", nullable = false)
    private Integer riskLevel;

    @NotNull(message = "Location cannot be null")
    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;
}
