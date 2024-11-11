package org.hokurekindred.expeditionbackend.service;

import org.hokurekindred.expeditionbackend.model.Expedition;
import org.hokurekindred.expeditionbackend.model.Route;
import org.hokurekindred.expeditionbackend.model.User;
import org.hokurekindred.expeditionbackend.repository.ExpeditionRepository;
import org.hokurekindred.expeditionbackend.repository.RouteRepository;
import org.hokurekindred.expeditionbackend.repository.UserRepository;
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
            route.setDuration(routeChanged.getDuration());
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
}