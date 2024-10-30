package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
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

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(nullable = false)
    private Double price;

    @Column
    private String status;

    @Column(nullable = false)
    private Boolean reservation;

    @Column(nullable = false)
    private String type;

    @OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Certificate> certificates;

    @ManyToMany
    @JoinTable(name = "expedition_equipment", joinColumns = @JoinColumn(name ="equipment_id"),
            inverseJoinColumns = @JoinColumn(name = "expedition_id"))
    private List<Expedition> expeditionList;
}
