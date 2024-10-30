package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "request")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id")
    private Long requestId;

    @Column(nullable = false)
    private String username;

    @Column
    private String description;

    @Column
    private String status;

    @Column(name = "reason_for_refusal")
    private String reasonForRefusal;

    @ManyToOne
    @JoinColumn(name = "expedition_id", nullable = false)
    private Expedition expedition;
}
