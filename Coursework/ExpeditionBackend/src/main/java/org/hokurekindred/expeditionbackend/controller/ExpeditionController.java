package org.hokurekindred.expeditionbackend.controller;

import jakarta.validation.Valid;
import org.hokurekindred.expeditionbackend.model.*;
import org.hokurekindred.expeditionbackend.repository.UserRepository;
import org.hokurekindred.expeditionbackend.service.ExpeditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/*TODO ✔
Требования пользователя сайта:
✔    3.1.1 Предоставлять возможность составления поста о поиске команды для экспедиции
✔    3.1.2 Предоставлять возможность просмотра отчетов по экспедициям
✔    3.1.3 Предоставлять возможность просмотра профилей других пользователей с информацией о навыках и образовании - метод: getUserProfile
✔    3.1.4 Предоставлять возможность авторизоваться пользователю
✔    3.1.5 Предоставлять возможность оформления всех необходимых разрешений для проведения экспедиции - методы: issueMissingPermits, createPermit
✔    3.1.6 Предоставлять возможность просмотра маршрута на интерактивной карте: getRouteWithLocations
✔    3.1.7 Предоставлять возможность ставить рейтинг сложности для локации - метод: addHardLevel в Expedition Service и Controller
✔    3.1.8 Предоставлять возможность указывать свои навыки, образование в профиле сайта: updateSkills, updateUserInfo в UserService and UserController
✔    3.1.9 Предоставлять возможность ставить общий рейтинг для локации - метод: addOverallRating в Expedition Service и Controller
✔    3.1.10 Предоставлять возможность проверки полноты соответствия имеющегося набора разрешений для экспедиции - метод: checkNecessaryPermits
    3.1.11 Предоставлять возможность автоматически проверять наличии у хотя бы одного члена экспедиции права на управление транспортом, участвующем в экспедиции
✔    3.1.12 Предоставлять возможность запрещать проведение экспедиции при отсутствии полного набора необходимых ролей для проведения экспедиции методы: updateExpeditionStatus, canStartExpedition
✔    3.1.13 Предоставлять возможность в отчете ссылаться на список запасов, которые использовались в экспедиции - методы: linkSupplyToReport, unlinkingSupplyFromReport, getSuppliesReport
✔    3.1.14 Предоставлять возможность в отчете  ссылаться на маршрут экспедиции - методы: linkReportToRoute, getRouteByReport

Требования администратора группы:
✔    3.1.15 Предоставлять возможность указать необходимые роли для проведения экспедиции: метод: addRequiredRole, getRequiredRoles, removeRequiredRole
✔    3.1.16 Предоставлять возможность назначить участника команды администратором группы: метод: assignAdmin
✔    3.1.17 Предоставлять возможность принимать заявки пользователей к участию в экспедиции - методы: addUser, applyUser, rejectUser
✔    3.1.18 Предоставлять возможность составления маршрута проведения экспедиции - методы: crateRoute
✔    3.1.19 Предоставлять возможность указать опасные участки маршрута, с указанием информации в чём заключается опасности - метод: saveHazard в Expedition Service и Controller
✔    3.1.20 Предоставлять возможность расчета цены аренды транспорта и оборудования для экспедиции - метод: getRentalCost
✔    3.1.21 Предоставлять возможность добавить оборудование и транспорт, как используемые в экспедиции - методы: assignEquipment, removeEquipment, assignVehicle, removeVehicle
✔    3.1.22 Предоставлять возможность рассчитывать необходимое количество топлива для транспортных средств с резервом 10% - метод: calculateFuelRequirement

Требования модератора:
✔    3.1.23 Предоставлять возможность добавлять/редактировать/удалять маршрутов - методы: crateRoute, updateRoute, deleteRoute
✔    3.1.24 Предоставлять возможность редактировать/удалять несоответствующих действительности постов
✔    3.1.25 Предоставлять возможность загружать/редактировать/удалять сертификаты на оборудование - методы: saveCertificate, updateCertificate, deleteCertificate в Equipment Service и Controller
✔    3.1.26 Предоставлять возможность загружать/редактировать/удалять информацию об оборудовании и транспорте - методы: createVehicle, createEquipment, deleteVehicle, deleteEquipment, updateEquipment, updateVehicle
*/


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/expeditions")
public class ExpeditionController {
    @Autowired
    ExpeditionService expeditionService;
    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllExpeditions() {
        Map<String, Object> response = new HashMap<>();
        response.put("expedition_list", expeditionService.findAllExpeditions());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getExpeditionById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.findById(id).isPresent()) {
            response.put("expedition", expeditionService.findById(id));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Expedition not found");
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createExpedition(@Valid @RequestBody Expedition expedition) {
        Map<String, Object> response = new HashMap<>();

        if (expedition.getRoute() != null && expedition.getRoute().getRouteId() == 0) {
            Route newRoute = expeditionService.createRouteFromExpedition(expedition.getRoute());
            expedition.setRoute(newRoute);
        }

        expeditionService.saveExpedition(expedition);
        response.put("expedition", expedition);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteExpedition(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();

        expeditionService.deleteExpedition(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{expeditionId}/add-user/{userId}")
    public ResponseEntity<Map<String, Object>> addUserToExpedition(@PathVariable Long expeditionId, @PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.addUserToExpedition(expeditionId, userId)) {
            response.put("expedition", expeditionService.findById(expeditionId));
            response.put("user", userRepository.findById(userId));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Can not add user to expedition");
    }

    @PostMapping("/{expeditionId}/assign-admin")
    public ResponseEntity<Map<String, Object>> assignAdmin(@PathVariable Long expeditionId, @RequestParam Long userId, @RequestParam Long adminId) {
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.assignAdmin(expeditionId, userId, adminId)) {
            response.put("message", "User successfully assigned as admin");
            response.put("expedition", expeditionService.findById(expeditionId));
            response.put("user", userRepository.findById(userId));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Error assigning admin to expedition");
    }

    /*@GetMapping("/{expeditionId}/check-roles")
    public ResponseEntity<Map<String, Object>> checkRequiredRoles(@PathVariable Long expeditionId){
        Map<String, Object> response = new HashMap<>();
        response.put("hasRequiredRoles", expeditionService.findById(expeditionId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }*/

    @PostMapping("/{expeditionId}/apply/{userId}")
    public ResponseEntity<Map<String, Object>> applyForExpedition(
            @PathVariable Long expeditionId,
            @PathVariable Long userId,
            @RequestBody Map<String, String> requestBody) {

        Map<String, Object> response = new HashMap<>();
        String description = requestBody.get("description");

        boolean result = expeditionService.addPendingUser(expeditionId, userId, description);

        if (result) {
            response.put("message", "Application submitted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("message", "Application failed");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }


    @PostMapping("/{expeditionId}/reject/{userId}")
    public ResponseEntity<Map<String, Object>> rejectUserApplication(@PathVariable Long expeditionId, @PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        boolean result = expeditionService.rejectUserApplication(expeditionId, userId);

        if (result) {
            response.put("message", "User application rejected.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Failed to reject user application.");
    }

    @PostMapping("/{expeditionId}/route")
    public ResponseEntity<Map<String, Object>> crateRoute(@PathVariable Long expeditionId, @RequestBody Route route) {
        Map<String, Object> response = new HashMap<>();
        Route createdRoute = expeditionService.createRoute(expeditionId, route);
        response.put("route", createdRoute);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{expeditionId}/route")
    public ResponseEntity<Map<String, Object>> getRouteByExpId(@PathVariable Long expeditionId) {
        Map<String, Object> response = new HashMap<>();
        Route route = expeditionService.getRouteByExpId(expeditionId);
        response.put("route", route);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{expeditionId}/route")
    public ResponseEntity<Map<String, Object>> updateRoute(@PathVariable Long expeditionId, @RequestBody Route changedRoute) {
        Map<String, Object> response = new HashMap<>();
        Route route = expeditionService.updateRouteExpedition(expeditionId, changedRoute);
        response.put("route", route);
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @DeleteMapping("/{expeditionId}/route")
    public ResponseEntity<Map<String, Object>> deleteRoute(@PathVariable Long expeditionId) {
        Map<String, Object> response = new HashMap<>();
        boolean deletedRoute = expeditionService.deleteRoute(expeditionId);
        if (deletedRoute) {
            response.put("message", "Route deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("error", "Route not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/rental-cost")
    public ResponseEntity<Map<String, Object>> getRentalCost(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        Double rentalCost = expeditionService.calculateRentalCost(id);
        response.put("rentalCost", rentalCost);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/locations/{id}/hazards")
    public ResponseEntity<Map<String, Object>> getAllHazards(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        List<Hazard> hazards = expeditionService.getAllHazards(id);
        response.put("hazards", hazards);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/locations/{id}/hazards")
    public ResponseEntity<Map<String, Object>> saveHazard(@PathVariable Long id, @RequestBody Hazard hazard) {
        Map<String, Object> response = new HashMap<>();
        Hazard createdHazard = expeditionService.saveHazard(id, hazard);
        response.put("hazard", createdHazard);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/locations/{locationId}/hazards/{hazardId}")
    public ResponseEntity<Map<String, Object>> deleteHazard(@PathVariable Long locationId, @PathVariable Long hazardId) {
        Map<String, Object> response = new HashMap<>();
        boolean deletedHazard = expeditionService.deleteHazard(locationId, hazardId);
        if (deletedHazard) {
            response.put("message", "Hazard deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("error", "Hazard not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/locations/{id}/hard-level")
    public ResponseEntity<Map<String, Object>> addHardLevel(@PathVariable Long id, @RequestParam("hardLevel") Integer hardlevel) {
        Map<String, Object> response = new HashMap<>();
        Location locationWithHardLevel = expeditionService.addHardLevel(id, hardlevel);
        response.put("location", locationWithHardLevel);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/locations/{id}/overall-rating")
    public ResponseEntity<Map<String, Object>> addOverallRating(@PathVariable Long id, @RequestParam("overallRating") Double overallRating) {
        Map<String, Object> response = new HashMap<>();
        Location locationWithOverallRating = expeditionService.addOverallRating(id, overallRating);
        response.put("location", locationWithOverallRating);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/reports/{reportId}/supplies/{supplyId}")
    public ResponseEntity<Map<String, Object>> linkSupplyToReport(@PathVariable Long reportId, @PathVariable Long supplyId) {
        Map<String, Object> response = new HashMap<>();

        Report newReport = expeditionService.linkSupplyToReport(reportId, supplyId);
        response.put("message", "Supply linked successfully");
        response.put("supply", newReport);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/reports/{reportId}/supplies/{supplyId}")
    public ResponseEntity<Map<String, Object>> unlinkingSupplyFromReport(@PathVariable Long reportId, @PathVariable Long supplyId) {
        Map<String, Object> response = new HashMap<>();
        expeditionService.unlinkSupplyFromReport(reportId, supplyId);
        response.put("message", "Supply unlinked successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/reports/{reportId}/supplies")
    public ResponseEntity<Map<String, Object>> getSuppliesReport(@PathVariable Long reportId) {
        Map<String, Object> response = new HashMap<>();

        List<Supplies> supplies = expeditionService.getSuppliesForReport(reportId);
        response.put("message", "Supplies got successfully");
        response.put("supplies", supplies);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/reports/{reportId}/route/{routeId}")
    public ResponseEntity<Map<String, Object>> linkReportToRoute(@PathVariable Long reportId, @PathVariable Long routeId) {
        Map<String, Object> response = new HashMap<>();
        Report newReport = expeditionService.linkReportToRoute(reportId, routeId);
        response.put("message", "Route linked successfully");
        response.put("report", newReport);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("reports/{reportId}/route")
    public ResponseEntity<Map<String, Object>> getRouteByReport(@PathVariable Long reportId) {
        Map<String, Object> response = new HashMap<>();

        Route route = expeditionService.getRouteByReport(reportId);
        response.put("message", "Route got successfully");
        response.put("route", route);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{expeditionId}/check-permits")
    public ResponseEntity<Map<String, Object>> checkNecessaryPermits(@PathVariable Long expeditionId, @RequestBody List<String> requiredPermit) {
        Map<String, Object> response = new HashMap<>();
        boolean hasPermits = expeditionService.hasAllNecessaryPermits(expeditionId, requiredPermit);
        if (!hasPermits) {
            response.put("message", "Haven't some necessary permits");
        } else {
            response.put("message", "All necessary permits issued");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{expeditionId}/permits")
    public ResponseEntity<Map<String, Object>> createPermit(@PathVariable Long expeditionId, @RequestBody Permit permit) {
        Map<String, Object> response = new HashMap<>();
        Permit newPermit = expeditionService.createPermit(expeditionId, permit);
        response.put("permit", newPermit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{expeditionId}/permits")
    public ResponseEntity<Map<String, Object>> getPermitsByExpedition(@PathVariable Long expeditionId) {
        Map<String, Object> response = new HashMap<>();
        List<Permit> permits = expeditionService.getPermitsByExpeditionId(expeditionId);
        response.put("permit", permits);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/permits/{permitId}")
    public ResponseEntity<Map<String, Object>> deletePermit(@PathVariable Long permitId) {
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.deletePermit(permitId)) {
            response.put("message", "Permit deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("error", "Permit not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/{expeditionId}/issue-missing-permits")
    public ResponseEntity<Map<String, Object>> issueMissingPermits(@PathVariable Long expeditionId, @RequestBody Map<String, List<String>> request) {
        Map<String, Object> response = new HashMap<>();
        List<String> requiredPermits = request.get("requiredPermitTypes");
        expeditionService.issueMissingPermits(expeditionId, requiredPermits);
        response.put("message", "Missing permits issued");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // не уверен насколько метод поможет в взаимодействии с интерактивной картой, это скорее дело фронта
    @GetMapping("/{expeditionId}/route-with-locations")
    public ResponseEntity<Map<String, Object>> getRouteWithLocations(@PathVariable Long expeditionId) {
        Map<String, Object> response = new HashMap<>();
        Route route = expeditionService.getRouteWithLocations(expeditionId);
        response.put("route", route);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{id}/add-role")
    public ResponseEntity<Map<String, Object>> addRequiredRole(@PathVariable Long id, @RequestBody String roleName) {
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.addRequiredRole(id, roleName)) {
            response.put("message", "Role added successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to add required role");
    }

    @GetMapping("/{id}/check-roles")
    public ResponseEntity<Map<String, Object>> checkAllNecessaryRoles(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        boolean allRoles = expeditionService.checkAllNecessaryRoles(id);
        response.put("allRoles", allRoles);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}/required-roles")
    public ResponseEntity<Map<String, Object>> getRequiredRoles(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        List<String> requiredRoles = expeditionService.getRequiredRolesForExpedition(id);
        response.put("requiredRoles", requiredRoles);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}/remove-role")
    public ResponseEntity<Map<String, Object>> removeRequiredRole(@PathVariable Long id, @RequestBody String roleName) {
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.removeRequiredRole(id, roleName)) {
            response.put("message", "Role removed successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("error", "Fail while removing role");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/{id}/can-start")
    public ResponseEntity<Map<String, Object>> canStartExpedition(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        boolean canStart = expeditionService.canStartExpedition(id);
        response.put("canStart", canStart);
        if (canStart) {
            response.put("message", "Expedition can be started");
        } else {
            response.put("message", "Expedition can't be started");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{id}/update-status")
    public ResponseEntity<Map<String, Object>> updateExpeditionStatus(@PathVariable Long id, @RequestBody String newStatus) {
        Map<String, Object> response = new HashMap<>();
        boolean changedStatus = expeditionService.updateExpeditionStatus(id, newStatus);
        if (changedStatus) {
            response.put("message", "Expedition status updated successfully");
            response.put("newStatus", newStatus);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("error", "Fail while updating status");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }

    }

}
