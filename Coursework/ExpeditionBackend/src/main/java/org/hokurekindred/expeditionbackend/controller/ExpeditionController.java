package org.hokurekindred.expeditionbackend.controller;

import jakarta.validation.Valid;
import org.hokurekindred.expeditionbackend.model.Expedition;
import org.hokurekindred.expeditionbackend.model.Route;
import org.hokurekindred.expeditionbackend.repository.UserRepository;
import org.hokurekindred.expeditionbackend.service.ExpeditionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/*TODO ✔
Требования пользователя сайта:
✔    3.1.1 Предоставлять возможность составления поста о поиске команды для экспедиции
✔    3.1.2 Предоставлять возможность просмотра отчетов по экспедициям
    3.1.3 Предоставлять возможность просмотра профилей других пользователей с информацией о навыках и образовании
✔    3.1.4 Предоставлять возможность авторизоваться пользователю
    3.1.5 Предоставлять возможность оформления всех необходимых разрешений для проведения экспедиции
    3.1.6 Предоставлять возможность просмотра маршрута на интерактивной карте
    3.1.7 Предоставлять возможность ставить рейтинг сложности для локации
    3.1.8 Предоставлять возможность указывать свои навыки, образование в профиле сайта
    3.1.9 Предоставлять возможность ставить общий рейтинг для локации
    3.1.10 Предоставлять возможность проверки полноты соответствия имеющегося набора разрешений для экспедиции
    3.1.11 Предоставлять возможность автоматически проверять наличии у хотя бы одного члена экспедиции права на управление транспортом, участвующем в экспедиции
    3.1.12 Предоставлять возможность запрещать проведение экспедиции при отсутствии полного набора необходимых ролей для проведения экспедиции
    3.1.13 Предоставлять возможность в отчете ссылаться на список запасов, которые использовались в экспедиции
    3.1.14 Предоставлять возможность в отчете  ссылаться на маршрут экспедиции

Требования администратора группы:
    3.1.15 Предоставлять возможность указать необходимые роли для проведения экспедиции
    3.1.16 Предоставлять возможность назначить участника команды администратором группы
✔    3.1.17 Предоставлять возможность принимать заявки пользователей к участию в экспедиции - методы: addUser, applyUser, rejectUser
✔    3.1.18 Предоставлять возможность составления маршрута проведения экспедиции - методы: crateRoute
    3.1.19 Предоставлять возможность указать опасные участки маршрута, с указанием информации в чём заключается опасности
    3.1.20 Предоставлять возможность расчета цены аренды транспорта и оборудования для экспедиции
✔    3.1.21 Предоставлять возможность добавить оборудование и транспорт, как используемые в экспедиции - методы: assignEquipment, removeEquipment, assignVehicle, removeVehicle
✔    3.1.22 Предоставлять возможность рассчитывать необходимое количество топлива для транспортных средств с резервом 10% - метод: calculateFuelRequirement

Требования модератора:
✔    3.1.23 Предоставлять возможность добавлять/редактировать/удалять маршрутов - методы: crateRoute, updateRoute, deleteRoute
    3.1.24 Предоставлять возможность редактировать/удалять несоответствующих действительности постов
    3.1.25 Предоставлять возможность загружать/редактировать/удалять сертификаты на оборудование
    3.1.26 Предоставлять возможность загружать/редактировать/удалять информацию об оборудовании и транспорте
 */


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/expeditions")
public class ExpeditionController {
    @Autowired
    ExpeditionService expeditionService;
    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllExpeditions(){
        Map<String, Object> response = new HashMap<>();
        response.put("expedition_list", expeditionService.findAllExpeditions());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getExpeditionById(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.findById(id).isPresent()) {
            response.put("expedition", expeditionService.findById(id));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("error", String.format("Expedition with id %d not found", id));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createExpedition(@Valid @RequestBody Expedition expedition){
        Map<String, Object> response = new HashMap<>();
        try {
            expeditionService.saveExpedition(expedition);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("error", "Error creating expedition");
        }
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteExpedition(@PathVariable Long id){
        Map<String, Object> response = new HashMap<>();
        try {
            expeditionService.deleteExpedition(id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.put("error", "Error deleting expedition");
        }
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/{expeditionId}/add-user/{userId}")
    public ResponseEntity<Map<String, Object>> addUserToExpedition(@PathVariable Long expeditionId, @PathVariable Long userId){
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.addUserToExpedition(expeditionId, userId)) {
            response.put("expedition", expeditionService.findById(expeditionId));
            response.put("user", userRepository.findById(userId));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("error", "Error adding user to expedition");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @PostMapping("/{expeditionId}/assign-admin/{userId}")
    public ResponseEntity<Map<String, Object>> assignAdmin(@PathVariable Long expeditionId, @PathVariable Long userId){
        Map<String, Object> response = new HashMap<>();
        if (expeditionService.assignAdmin(expeditionId, userId)) {
            response.put("expedition", expeditionService.findById(expeditionId));
            response.put("user", userRepository.findById(userId));
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        response.put("error", "Error assigning admin to expedition");
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @GetMapping("/{expeditionId}/check-roles")
    public ResponseEntity<Map<String, Object>> checkRequiredRoles(@PathVariable Long expeditionId){
        Map<String, Object> response = new HashMap<>();
        response.put("hasRequiredRoles", expeditionService.findById(expeditionId));
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{expeditionId}/apply/{userId}")
    public ResponseEntity<Map<String, Object>> applyForExpedition(@PathVariable Long expeditionId, @PathVariable Long userId){
        Map<String, Object> response = new HashMap<>();
        boolean result = expeditionService.addPendingUser(expeditionId, userId);
        if(result){
            response.put("message","Application submitted successfully");
        }else{
            response.put("message","Application failed");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/{expeditionId}/reject/{userId}")
    public ResponseEntity<Map<String, Object>> rejectUserApplication(@PathVariable Long expeditionId, @PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        boolean result = expeditionService.rejectUserApplication(expeditionId, userId);

        if (result) {
            response.put("message", "User application rejected.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            response.put("error", "Failed to reject user application.");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/{expeditionId}/route")
    public ResponseEntity<Map<String, Object>> crateRoute(@PathVariable Long expeditionId, @RequestBody Route route){
        Map<String, Object> response = new HashMap<>();
        try{
            Route createdRoute = expeditionService.createRoute(expeditionId, route);
            response.put("route", createdRoute);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.put("error", "Fail while creating");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{expeditionId}/route")
    public ResponseEntity<Map<String, Object>> getRouteByExpId(@PathVariable Long expeditionId){
        Map<String, Object> response = new HashMap<>();
        try{
            Route route = expeditionService.getRouteByExpId(expeditionId);
            response.put("route", route);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.put("error", "Route not found");
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{expeditionId}/route")
    public ResponseEntity<Map<String, Object>> updateRoute(@PathVariable Long expeditionId, @RequestBody Route changedRoute){
        Map<String, Object> response = new HashMap<>();
        try{
            Route route = expeditionService.updateRouteExpedition(expeditionId, changedRoute);
            response.put("route", route);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.put("error", "Fail while updating");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{expeditionId}/route")
    public ResponseEntity<Map<String, Object>> deleteRoute(@PathVariable Long expeditionId) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean deletedRoute = expeditionService.deleteRoute(expeditionId);
            if (deletedRoute) {
                response.put("message", "Route deleted successfully");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("error", "Route not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            response.put("error", "Fail while deleting");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
