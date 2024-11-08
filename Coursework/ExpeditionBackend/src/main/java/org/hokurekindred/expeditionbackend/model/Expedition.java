package org.hokurekindred.expeditionbackend.model;

import jakarta.persistence.*;
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

    @Column(nullable = false)
    private String name;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column
    private String description;

    @Column
    private String status;

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

    public List<User> getUsers(){
        return userList;
    }

    //Map, который будет хранить пользователь желающих присоединиться к экспедиции и их статусы
    @ElementCollection
    private Map<Long, String> userApplications = new HashMap<>();

    public boolean hasAllRoles(){
        for(User user : userList){
            if(!user.getExpeditionRole().equals("Адмимнистратор")){
                return false;
            }
        }
        return true;
    }

}
