package org.example.expeditionbackend.model;

import jakarta.persistence.*;
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

    @Column
    private String description;

    @Column(name = "risk_level", nullable = false)
    private Integer riskLevel;

    @ManyToOne
    @JoinColumn(name = "location_id", nullable = false)
    private Location location;
}
