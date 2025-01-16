package org.hokurekindred.expeditionbackend.service;

import org.hokurekindred.expeditionbackend.model.*;
import org.hokurekindred.expeditionbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

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
    @Autowired
    private PermitRepository permitRepository;
    @Autowired
    private RequestRepository requestRepository;

    public List<Expedition> findAllExpeditions() {
        return expeditionRepository.findAll();
    }

    public Optional<Expedition> findById(Long id) {
        return expeditionRepository.findById(id);
    }

    public void saveExpedition(Expedition expedition) {
        if (expedition.getRoute() != null && expedition.getRoute().getRouteId() == 0) {
            Route savedRoute = routeRepository.save(expedition.getRoute());
            expedition.setRoute(savedRoute);
        }
        expeditionRepository.save(expedition);
    }


    public void deleteExpedition(Long id) {
        expeditionRepository.deleteById(id);
    }

    public boolean addUserToExpedition(Long expeditionId, Long userId) {
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);
        Optional<User> userInfoOptional = userRepository.findById(userId);

        if (expeditionOptional.isPresent() && userInfoOptional.isPresent()) {
            Expedition expedition = expeditionOptional.get();
            User user = userInfoOptional.get();

            if (!expedition.getUserList().contains(user)) {
                expedition.getUserList().add(user);
                user.getExpeditionList().add(expedition);

                expedition.getUserApplications().put(userId, "approved");
                Request request = requestRepository.findRequestByUsername(user.getUsername()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
                request.setStatus("approved");
                requestRepository.save(request);
                expeditionRepository.save(expedition);
                userRepository.save(user);

                return true;
            }
        }

        return false;
    }


    public boolean assignAdmin(Long expeditionId, Long userId, Long adminId) {
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);
        Optional<User> userOptional = userRepository.findById(userId);
        Optional<User> adminOptional = userRepository.findById(adminId);

        if (expeditionOptional.isPresent() && userOptional.isPresent() && adminOptional.isPresent()) {
            Expedition expedition = expeditionOptional.get();
            User admin = adminOptional.get();
            User user = userOptional.get();

            if (!"Admin".equals(admin.getExpeditionRole()) || !expedition.getUserList().contains(admin)) {
                return false;
            }

            if (!expedition.getUserList().contains(user)) {
                return false;
            }

            user.setExpeditionRole("Admin");
            userRepository.save(user);
            return true;
        }
        return false;
    }

    /*public boolean checkRequiredRoles(Long expeditionId){
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);

        if(expeditionOptional.isPresent()){
            Expedition expedition = expeditionOptional.get();
            return expedition.hasAllRoles();
        }
        return false;
    }*/

    // Метод для подачи заявки на участие в экспедиции
    public boolean addPendingUser(Long expeditionId, Long userId, String description) {
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);
        Optional<User> userOptional = userRepository.findById(userId);

        if (expeditionOptional.isPresent() && userOptional.isPresent()) {
            Expedition expedition = expeditionOptional.get();
            User user = userOptional.get();

            if (expedition.getUserList().contains(user)) {
                return false;
            }

            if (expedition.getUserApplications().containsKey(userId)) {
                return false;
            }

            Request newRequest = Request.builder()
                    .username(user.getUsername())
                    .description(description)
                    .status("pending")
                    .expedition(expedition)
                    .build();

            requestRepository.save(newRequest);

            expedition.getUserApplications().put(userId, "pending");
            expeditionRepository.save(expedition);

            return true;
        }

        return false;
    }

    public boolean rejectUserApplication(Long expeditionId, Long userId) {
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);
        Optional<User> userOptional = userRepository.findById(userId);
        if (expeditionOptional.isPresent() && userOptional.isPresent()) {
            Expedition expedition = expeditionOptional.get();
            String status = "pending";
            if (status.equals(expedition.getUserApplications().get(userId))) {
                expedition.getUserApplications().put(userId, "rejected");
                expeditionRepository.save(expedition);
                Request request = requestRepository.findRequestByUsername(userOptional.orElseThrow(RuntimeException::new).getUsername()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User Not Found"));
                request.setStatus("rejected");
                requestRepository.save(request);
                return true;
            }
        }
        return false;
    }

    public Route createRoute(Long expeditionId, Route route) {
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));
        route = routeRepository.save(route);
        expedition.setRoute(route);
        expeditionRepository.save(expedition);

        return route;
    }

    public Route createRouteFromExpedition(Route route) {
        if (route.getRouteId() == 0) {
            return routeRepository.save(route);
        }
        throw new IllegalArgumentException("Route already exists with ID: " + route.getRouteId());
    }


    public Route updateRouteExpedition(Long expeditionId, Route routeChanged) {
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        Route route = expedition.getRoute();
        if (route != null) {
            route.setStartPoint(routeChanged.getStartPoint());
            route.setEndPoint(routeChanged.getEndPoint());
            route.setDistance(routeChanged.getDistance());
            route.setLocations(routeChanged.getLocations());

            routeRepository.save(route);
            return route;
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found");
        }
    }

    public Route getRouteByExpId(Long expeditionId) {
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));
        return expedition.getRoute();
    }

    public boolean deleteRoute(Long expeditionId) {
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        Route route = expedition.getRoute();
        if (route != null) {
            expedition.setRoute(null);
            expeditionRepository.save(expedition);
            routeRepository.delete(route);
            return true;
        }
        return false;
    }

    public Report createReport(Long expeditionId, String nomination, String description, List<Long> suppliesList) {
        Expedition expedition = expeditionRepository.findById(expeditionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        Report report = new Report();
        report.setNomination(nomination);
        report.setDescription(description);
        report.setExpedition(expedition);

        if (suppliesList != null && !suppliesList.isEmpty()) {
            List<Supplies> supplies = suppliesRepository.findAllById(suppliesList);
            if (supplies.size() != suppliesList.size()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Some supplies not found");
            }
            report.setSuppliesList(supplies);
        }

        return reportRepository.save(report);
    }


    public Double calculateRentalCost(Long id) {
        Expedition expedition = expeditionRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        Double vehicleCost = expedition.getVehicleList().stream().mapToDouble(Vehicle::getPrice).sum();

        Double equipmentCost = expedition.getEquipmentList().stream().mapToDouble(Equipment::getPrice).sum();

        return vehicleCost + equipmentCost;
    }

    // добавление опасности к локации
    public Hazard saveHazard(Long id, Hazard hazard) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));
        hazard.setLocation(location);
        return hazardRepository.save(hazard);
    }

    // удаление опасности из локации
    public boolean deleteHazard(Long locationId, Long hazardId) {
        locationRepository.findById(locationId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));
        Optional<Hazard> hazard = hazardRepository.findById(hazardId);
        if (hazard.isPresent() && hazard.get().getLocation().getLocationId().equals(locationId)) {
            hazardRepository.delete(hazard.get());
            return true;
        }
        return false;
    }

    public List<Hazard> getAllHazards(Long id) {
        Location location = locationRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));
        return location.getHazards();
    }

    public Location addHardLevel(Long id, Integer hardLevel) {
        if (hardLevel < 1 || hardLevel > 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Illegal hard level");
        }
        Location location = locationRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));
        location.setHardLevel(hardLevel);
        return locationRepository.save(location);
    }

    public Location addOverallRating(Long id, Double overallRating) {
        if (overallRating < 0.0 || overallRating > 5.0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Illegal overall rating");
        }
        Location location = locationRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Location not found"));

        location.setOverallRating(overallRating);
        return locationRepository.save(location);
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report linkSupplyToReport(Long reportId, Long supplyId) {
        Report report = reportRepository.findById(reportId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
        Supplies supply = suppliesRepository.findById(supplyId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supply not found"));
        supply.setReport(report);
        suppliesRepository.save(supply);
        return report;
    }

    public void unlinkSupplyFromReport(Long reportId, Long supplyId) {
        reportRepository.findById(reportId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));

        Supplies supply = suppliesRepository.findById(supplyId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Supply not found"));

        if (!supply.getReport().getReportId().equals(reportId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Supplies doesn't belong report");
        }
        supply.setReport(null);
        suppliesRepository.save(supply);
    }

    public List<Supplies> getSuppliesForReport(Long reportId) {
        Report report = reportRepository.findById(reportId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));
        return suppliesRepository.findByReport(report);
    }

    public Report linkReportToRoute(Long reportId, Long routeId) {
        Report report = reportRepository.findById(reportId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));

        Route route = routeRepository.findById(routeId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Route not found"));

        Expedition expedition = report.getExpedition();
        if (expedition == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Report isn't link to expedition");
        }
        expedition.setRoute(route);
        expeditionRepository.save(expedition);
        return report;
    }

    public Route getRouteByReport(Long reportId) {
        Report report = reportRepository.findById(reportId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found"));

        Expedition expedition = report.getExpedition();
        if (expedition == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Report isn't linked to expedition");
        }

        return expedition.getRoute();
    }

    public boolean hasAllNecessaryPermits(Long expeditionId, List<String> requiredPermits) {
        List<Permit> permits = permitRepository.findByExpedition_ExpeditionId(expeditionId);
        Set<String> existingPermit = permits.stream().map(Permit::getPermitType).collect(Collectors.toSet());
        return existingPermit.containsAll(requiredPermits);
    }

    public Permit createPermit(Long expeditionId, Permit permit) {
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));
        permit.setExpedition(expedition);
        return permitRepository.save(permit);
    }

    public List<Permit> getPermitsByExpeditionId(Long expeditionId) {
        return permitRepository.findByExpedition_ExpeditionId(expeditionId);
    }

    public boolean deletePermit(Long permitId) {
        if (permitRepository.existsById(permitId)) {
            permitRepository.deleteById(permitId);
            return true;
        }
        return false;
    }

    public void issueMissingPermits(Long expeditionId, List<String> requiredPermits) {
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "expedition not found"));

        List<Permit> permits = permitRepository.findByExpedition_ExpeditionId(expeditionId);
        Set<String> existingPermits = permits.stream().map(Permit::getPermitType).collect(Collectors.toSet());
        for (String permitType : requiredPermits) {
            if (!existingPermits.contains(permitType)) {
                Permit newPermit = Permit.builder().permitType(permitType).expedition(expedition).issueDate(LocalDate.now()).authorityName("Kindred-Hokure Authority").build();
                permitRepository.save(newPermit);
            }
        }
    }

    public Route getRouteWithLocations(Long expeditionId) {
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        Route route = expedition.getRoute();
        if (route != null) {
            route.setLocations(locationRepository.findByRouteRouteId(route.getRouteId()));
        }
        return route;
    }

    /*public List<Location> getLocationsForRoute(Long routeId){
        return locationRepository.findByRouteRouteId(routeId);
    }*/

    public boolean addRequiredRole(Long id, String roleName) {
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(id);
        if (expeditionOptional.isPresent()) {
            Expedition expedition = expeditionOptional.get();
            if (!expedition.getRequiredRoles().contains(roleName)) {
                expedition.getRequiredRoles().add(roleName);
                expeditionRepository.save(expedition);
                return true;
            }
        }
        return false;
    }

    public boolean checkAllNecessaryRoles(Long id) {
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(id);
        if (expeditionOptional.isPresent()) {
            Expedition expedition = expeditionOptional.get();
            return expedition.hasRequiredRolesAssigned();
        }
        return false;
    }

    public List<String> getRequiredRolesForExpedition(Long id) {
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(id);
        return expeditionOptional.map(Expedition::getRequiredRoles).orElse(Collections.emptyList());
    }

    public boolean removeRequiredRole(Long id, String roleName) {
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(id);
        if (expeditionOptional.isPresent()) {
            Expedition expedition = expeditionOptional.get();
            if (expedition.getRequiredRoles().contains(roleName)) {
                expedition.getRequiredRoles().remove(roleName);
                expeditionRepository.save(expedition);
                return true;
            }
        }
        return false;
    }

    public boolean canStartExpedition(Long id) {
        Expedition expedition = expeditionRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));
        return expedition.hasRequiredRolesAssigned();
    }

    public boolean updateExpeditionStatus(Long id, String newStatus) {
        Expedition expedition = expeditionRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        if ("In Progress".equalsIgnoreCase(newStatus) && !expedition.hasRequiredRolesAssigned()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Can't update status because not all roles assigned");
        }
        expedition.setStatus(newStatus);
        expeditionRepository.save(expedition);
        return true;
    }

    public boolean hasValidParticipant(Long expeditionId) {
        Expedition expedition = expeditionRepository.findById(expeditionId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found"));

        List<String> vehicleTypes = expedition.getVehicleList().stream().map(Vehicle::getType).distinct().toList();

        boolean hasValidParticipants = vehicleTypes.stream().allMatch(vehicleType -> expedition.getUserList().stream().anyMatch(user -> user.getVehicleType().contains(vehicleType)));

        if (!hasValidParticipants) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No valid participants for expedition vehicles");
        }

        return true;
    }
}