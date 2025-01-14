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

@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "vehicleId"
)
@Entity
@Table(name = "vehicle")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vehicle_id")
    private Long vehicleId;

    @Column(nullable = false)
    @NotBlank(message = "Type cannot be blank")
    @Size(max = 50, message = "Type must be less than 50 characters")
    private String type;

    @Column(nullable = false)
    @NotBlank(message = "Model cannot be blank")
    @Size(max = 100, message = "Model must be less than 100 characters")
    private String model;

    @Column(nullable = false)
    @NotNull(message = "Capacity cannot be null")
    @Min(value = 1, message = "Capacity must be at least 1")
    private Integer capacity;

    @Column
    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @Column
    @Size(max = 50, message = "Status must be less than 50 characters")
    private String status;

    @Column(name = "fuel_consumption", nullable = false)
    @NotNull(message = "Fuel consumption cannot be null")
    @Positive(message = "Fuel consumption must be a positive number")
    private Double fuelConsumption;

    @Column(name = "fuel_tank_capacity", nullable = false)
    @NotNull(message = "Fuel tank capacity cannot be null")
    @Positive(message = "Fuel tank capacity must be a positive number")
    private Double fuelTankCapacity;

    @Column(name = "fuel_type", nullable = false)
    @NotBlank(message = "Fuel type cannot be blank")
    @Size(max = 50, message = "Fuel type must be less than 50 characters")
    private String fuelType;

    @Column(nullable = false)
    @NotNull(message = "Reservation status cannot be null")
    private Boolean reservation;

    @Column(nullable = false)
    @NotNull(message = "Price cannot be null")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be a positive number")
    private Double price;

    @ManyToMany
    @JoinTable(name = "expedition_vehicle", joinColumns = @JoinColumn(name = "vehicle_id"),
            inverseJoinColumns = @JoinColumn(name = "expedition_id"))
    private List<Expedition> expeditionList;
}
