package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "supplies")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplies {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "supply_id")
    private Long supplyId;

    @Column
    @Size(max = 100, message = "Category must be less than 100 characters")
    private String category;

    @Column(nullable = false)
    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Quantity must be a positive number")
    private Integer quantity;

    @Column
    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    @ManyToMany
    @JoinTable(name = "expedition_supplies", joinColumns = @JoinColumn(name = "supply_id"), inverseJoinColumns = @JoinColumn(name = "expedition_id"))
    private List<Expedition> expeditionList;

    @ManyToOne
    @JoinColumn(name = "report_id")
    private Report report;
}
