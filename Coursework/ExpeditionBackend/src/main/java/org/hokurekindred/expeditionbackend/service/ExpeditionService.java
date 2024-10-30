package org.hokurekindred.expeditionbackend.service;

import org.hokurekindred.expeditionbackend.model.Expedition;
import org.hokurekindred.expeditionbackend.model.User;
import org.hokurekindred.expeditionbackend.repository.ExpeditionRepository;
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

    public List<Expedition> findAllExpeditions(){
        return expeditionRepository.findAll();
    }

    public Optional<Expedition> findById(Long id){
        return expeditionRepository.findById(id);
    }

    public Expedition saveExpedition(Expedition expedition){
        return expeditionRepository.save(expedition);
    }

    public void deleteExpedition(Long id){
        expeditionRepository.deleteById(id);
    }

    public boolean addUserToExpedition(Long expeditionId, Long userId){
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);
        Optional<User> userInfoOptional = userRepository.findById(userId);

        if(expeditionOptional.isPresent() && userInfoOptional.isPresent()){
            Expedition expedition = expeditionOptional.get();
            expedition.getUsers().add(userInfoOptional.get());
            return true;
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

}
