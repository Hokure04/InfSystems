package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name="expedition")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expedition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "expedition_id")
    private Long expeditionId;

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 255, message = "Name cannot exceed 255 characters")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Start date cannot be null")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "End date cannot be null")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Size(max = 1000, message = "Description cannot exceed 1000 characters")
    @Column
    private String description;

    @Size(max = 50, message = "Status cannot exceed 50 characters")
    @Column
    private String status;

    @NotNull(message = "Route cannot be null")
    @ManyToOne
    @JoinColumn(name = "route_id", nullable = false)
    private Route route;

    @OneToMany(mappedBy = "expedition", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Report> reports;

    @OneToMany(mappedBy = "expedition", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Request> requests;

    @OneToMany(mappedBy = "expedition", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Permit> permits;

    @ManyToMany(mappedBy = "expeditionList")
    private List<Supplies> supplyList;

    @ManyToMany(mappedBy = "expeditionList")
    private List<Equipment> equipmentList;

    @ManyToMany(mappedBy = "expeditionList")
    private List<Vehicle> vehicleList;

    @ManyToMany(mappedBy = "expeditionList")
    private List<User> userList;

    //Map, который будет хранить пользователь желающих присоединиться к экспедиции и их статусы
    @ElementCollection
    private Map<Long, String> userApplications = new HashMap<>();

    public boolean isValidDates() {
        return startDate != null && endDate != null && !endDate.isBefore(startDate);
    }

    public boolean hasAllRoles(){
        for(User user : userList){
            if(!user.getExpeditionRole().equals("Адмимнистратор")){
                return false;
            }
        }
        return true;
    }

}
