package org.hokurekindred.expeditionbackend.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@JsonIdentityInfo(
        generator = ObjectIdGenerators.PropertyGenerator.class,
        property = "reportId"
)
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

    @NotBlank(message = "Nomination cannot be empty")
    @Size(min = 3, max = 100, message = "Nomination should be between 3 and 100 characters")
    @Column(nullable = false)
    private String nomination;

    @Size(max = 500, message = "Description should be at most 500 characters")
    @Column
    private String description;

    @ManyToOne
    @JoinColumn(name = "expedition_id", nullable = false)
    @NotNull(message = "Expedition cannot be null")
    private Expedition expedition;

    @OneToMany(mappedBy = "report", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Supplies> suppliesList = new ArrayList<>();
}
