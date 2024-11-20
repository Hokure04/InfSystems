package org.hokurekindred.expeditionbackend.service;

import org.hokurekindred.expeditionbackend.model.*;
import org.hokurekindred.expeditionbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpeditionService {
    @Autowired
    ExpeditionRepository expeditionRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private RouteRepository routeRepository;
    @Autowired
    private LocationRepository locationRepository;
    @Autowired
    private HazardRepository hazardRepository;
    @Autowired
    public ReportRepository reportRepository;
    @Autowired
    public SuppliesRepository suppliesRepository;

    public List<Expedition> findAllExpeditions(){
        return expeditionRepository.findAll();
    }

    public Optional<Expedition> findById(Long id){
        return expeditionRepository.findById(id);
    }

    public void saveExpedition(Expedition expedition){
        expeditionRepository.save(expedition);
    }

    public void deleteExpedition(Long id){
        expeditionRepository.deleteById(id);
    }

    public boolean addUserToExpedition(Long expeditionId, Long userId){
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);
        Optional<User> userInfoOptional = userRepository.findById(userId);

        if(expeditionOptional.isPresent() && userInfoOptional.isPresent()){
            Expedition expedition = expeditionOptional.get();
            User user = userInfoOptional.get();
            String status = "pending";
            if(status.equals(expedition.getUserApplications().get(userId))){
                expedition.getUserList().add(user);
                expedition.getUserApplications().put(userId, "approved");
                expeditionRepository.save(expedition);
                return true;
            }else if(!expedition.getUserApplications().containsKey(userId)){
                expedition.getUserApplications().put(userId, "pending");
                expeditionRepository.save(expedition);
                return true;
            }
        }
        return false;
    }

    public boolean assignAdmin(Long expeditionId, Long userId){
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);
        Optional<User> userInfoOptional = userRepository.findById(userId);

        if(expeditionOptional.isPresent() && userInfoOptional.isPresent()){
            User user = userInfoOptional.get();
            user.setExpeditionRole("Администратор");
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public boolean checkRequiredRoles(Long expeditionId){
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);

        if(expeditionOptional.isPresent()){
            Expedition expedition = expeditionOptional.get();
            return expedition.hasAllRoles();
        }
        return false;
    }

    // Метод для подачи заявки на участие в экспедиции
    public boolean addPendingUser(Long expeditionId, Long userId){
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);
        Optional<User> userOptional = userRepository.findById(userId);
        if(expeditionOptional.isPresent() && userOptional.isPresent()){
            Expedition expedition = expeditionOptional.get();
            User user = userOptional.get();

            if(!expedition.getUserList().contains(user) && !expedition.getUserApplications().containsKey(userId)){
                expedition.getUserApplications().put(userId, "pending");
                expeditionRepository.save(expedition);
                return true;
            }
        }
        return false;
    }

    public boolean rejectUserApplication(Long expeditionId, Long userId){
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);
        Optional<User> userOptional = userRepository.findById(userId);
        if(expeditionOptional.isPresent() && userOptional.isPresent()){
            Expedition expedition = expeditionOptional.get();
            String status = "pending";
            if(status.equals(expedition.getUserApplications().get(userId))){
                expedition.getUserApplications().put(userId, "rejected");
                expeditionRepository.save(expedition);
                return true;
            }
        }
        return false;
    }

    public Route createRoute(Long expeditionId, Route route){
        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new RuntimeException("Expedition not found"));
        route = routeRepository.save(route);
        expedition.setRoute(route);
        expeditionRepository.save(expedition);

        return route;
    }

    public Route updateRouteExpedition(Long expeditionId, Route routeChanged){
        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new RuntimeException("Expedition not found"));

        Route route = expedition.getRoute();
        if (route != null) {
            route.setStartPoint(routeChanged.getStartPoint());
            route.setEndPoint(routeChanged.getEndPoint());
            route.setDistance(routeChanged.getDistance());
            route.setLocations(routeChanged.getLocations());

            routeRepository.save(route);
            return route;
        } else {
            throw new RuntimeException("Route not found");
        }
    }

    public Route getRouteByExpId(Long expeditionId){
        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new RuntimeException("Expedition not found"));
        return expedition.getRoute();
    }

    public boolean deleteRoute(Long expeditionId){
        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new RuntimeException("Expedition not found"));

        Route route = expedition.getRoute();
        if (route != null) {
           expedition.setRoute(null);
            expeditionRepository.save(expedition);
            routeRepository.delete(route);
            return true;
        }
        return false;
    }

    public Double calculateRentalCost(Long id){
        Expedition expedition = expeditionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expedition not found"));

        Double vehicleCost = expedition.getVehicleList().stream()
                .mapToDouble(Vehicle::getPrice).sum();

        Double equipmentCost = expedition.getEquipmentList().stream()
                .mapToDouble(Equipment::getPrice).sum();

        return vehicleCost + equipmentCost;
    }

    // добавление опасности к локации
    public Hazard saveHazard(Long id, Hazard hazard){
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        hazard.setLocation(location);
        return hazardRepository.save(hazard);
    }

    // удаление опасности из локации
    public boolean deleteHazard(Long locationId, Long hazardId){
        Location location = locationRepository.findById(locationId)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        Optional<Hazard> hazard = hazardRepository.findById(hazardId);
        if(hazard.isPresent() && hazard.get().getLocation().getLocationId().equals(locationId)){
            hazardRepository.delete(hazard.get());
            return true;
        }
        return false;
    }

    public List<Hazard> getAllHazards(Long id){
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        return location.getHazards();
    }

    public Location addHardLevel(Long id, Integer hardLevel){
        if(hardLevel < 1 || hardLevel > 10){
            throw new IllegalArgumentException("Illegal hard level");
        }
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));
        location.setHardLevel(hardLevel);
        return locationRepository.save(location);
    }

    public Location addOverallRating(Long id, Double overallRating){
        if(overallRating < 0.0 || overallRating > 5.0){
            throw new IllegalArgumentException("Illegal overall rating");
        }
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        location.setOverallRating(overallRating);
        return locationRepository.save(location);
    }

    public Report linkSupplyToReport(Long reportId, Long supplyId){
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        Supplies supply = suppliesRepository.findById(supplyId)
                        .orElseThrow(() -> new RuntimeException("Supply not found"));
        supply.setReport(report);
       suppliesRepository.save(supply);
        return report;
    }

    public void unlinkSupplyFromReport(Long reportId, Long supplyId){
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        Supplies supply = suppliesRepository.findById(supplyId)
                .orElseThrow(() -> new RuntimeException("Supply not found"));

        if(!supply.getReport().getReportId().equals(reportId)){
            throw new IllegalArgumentException("Supplies doesn't belong report");
        }

        supply.setReport(null);
        suppliesRepository.save(supply);
    }

    public List<Supplies> getSuppliesForReport(Long reportId){
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        return suppliesRepository.findByReport(report);
    }

    public Report linkReportToRoute(Long reportId, Long routeId){
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        Route route = routeRepository.findById(routeId)
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Expedition expedition = report.getExpedition();
        if(expedition == null){
            throw new RuntimeException("Report isn't link to expedition");
        }
        expedition.setRoute(route);
        expeditionRepository.save(expedition);
        return report;
    }

    public Route getRouteByReport(Long reportId){
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        Expedition expedition = report.getExpedition();
        if(expedition == null){
            throw new RuntimeException("Report isn't linked to expedition");
        }

        return expedition.getRoute();
    }
}