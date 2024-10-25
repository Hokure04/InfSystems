package org.example.expeditionbackend.model;

import jakarta.persistence.*;
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
    private String category;

    @Column(nullable = false)
    private Integer quantity;

    @Column
    private String description;

    @ManyToMany
    @JoinTable(name = "expedition_supplies", joinColumns = @JoinColumn(name = "supply_id"), inverseJoinColumns = @JoinColumn(name = "expedition_id"))
    private List<Expedition> expeditionList;
}
