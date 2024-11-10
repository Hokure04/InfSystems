package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "certificate")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Certificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "certificate_id")
    private Long certificateId;

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 255, message = "Name cannot exceed 255 characters")
    @Column(nullable = false)
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column
    private String description;

    @Size(max = 50, message = "Status cannot exceed 50 characters")
    @Column
    private String status;

    @NotBlank(message = "Serial number cannot be blank")
    @Size(max = 50, message = "Serial number cannot exceed 50 characters")
    @Column(name = "serial_number", unique = true, nullable = false)
    private String serialNumber;

    @NotNull(message = "Equipment cannot be null")
    @ManyToOne
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;
}
