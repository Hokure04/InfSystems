package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "equipment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_id")
    private Long equipmentId;

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 255, message = "Name cannot exceed 255 characters")
    @Column(nullable = false)
    private String name;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column
    private String description;

    @NotNull(message = "Price cannot be null")
    @Positive(message = "Price must be positive")
    @Column(nullable = false)
    private Double price;

    @Size(max = 50, message = "Status cannot exceed 50 characters")
    @Column
    private String status;

    @NotNull(message = "Reservation status cannot be null")
    @Column(nullable = false)
    private Boolean reservation;

    @NotBlank(message = "Type cannot be blank")
    @Size(max = 100, message = "Type cannot exceed 100 characters")
    @Column(nullable = false)
    private String type;

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certificate> certificates;

    @ManyToMany
    @JoinTable(name = "expedition_equipment", joinColumns = @JoinColumn(name ="equipment_id"),
            inverseJoinColumns = @JoinColumn(name = "expedition_id"))
    private List<Expedition> expeditionList;
}
