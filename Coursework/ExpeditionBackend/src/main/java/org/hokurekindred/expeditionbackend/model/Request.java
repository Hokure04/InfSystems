package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
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

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 20, message = "Username should be between 3 and 20 characters")
    @Column(nullable = false)
    private String username;

    @Size(max = 500, message = "Description should be at most 500 characters")
    @Column
    private String description;

    @Size(max = 20, message = "Status should be at most 20 characters")
    @Column
    private String status;

    @Size(max = 500, message = "Reason for refusal should be at most 500 characters")
    @Column(name = "reason_for_refusal")
    private String reasonForRefusal;

    @ManyToOne
    @JoinColumn(name = "expedition_id", nullable = false)
    @NotNull(message = "Expedition cannot be null")
    private Expedition expedition;
}
