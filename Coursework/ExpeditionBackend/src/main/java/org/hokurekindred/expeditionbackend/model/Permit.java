package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "permit")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Permit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permit_id")
    private Long permitId;

    @NotBlank(message = "Permit type cannot be empty")
    @Size(min = 3, max = 50, message = "Permit type should be between 3 and 50 characters")
    @Column(name = "permit_type", nullable = false)
    private String permitType;

    @Column(name = "issue_date")
    private LocalDate issueDate;

    @NotBlank(message = "Authority name cannot be empty")
    @Size(min = 3, max = 100, message = "Authority name should be between 3 and 100 characters")
    @Column(name = "authority_name", nullable = false)
    private String authorityName;

    @ManyToOne
    @JoinColumn(name = "expedition_id", nullable = false)
    @NotNull(message = "Expedition cannot be null")
    private Expedition expedition;
}
