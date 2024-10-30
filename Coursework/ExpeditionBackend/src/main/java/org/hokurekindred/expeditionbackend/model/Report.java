package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "report")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @Column(nullable = false)
    private String nomination;

    @Column
    private String description;

    @ManyToOne
    @JoinColumn(name = "expedition_id", nullable = false)
    private Expedition expedition;
}
