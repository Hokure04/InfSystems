package org.example.expeditionbackend.service;

import org.example.expeditionbackend.model.Expedition;
import org.example.expeditionbackend.model.UserInfo;
import org.example.expeditionbackend.repository.ExpeditionRepository;
import org.example.expeditionbackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ExpeditionService {
    private final ExpeditionRepository expeditionRepository;
    private final UserRepository userRepository;

    public ExpeditionService(ExpeditionRepository expeditionRepository, UserRepository userRepository){
        this.expeditionRepository = expeditionRepository;
        this.userRepository = userRepository;
    }

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
        Optional<UserInfo> userInfoOptional = userRepository.findById(userId);

        if(expeditionOptional.isPresent() && userInfoOptional.isPresent()){
            Expedition expedition = expeditionOptional.get();
            expedition.getUsers().add(userInfoOptional.get());
            return true;
        }
        return false;
    }

    public boolean assignAdmin(Long expeditionId, Long userId){
        Optional<Expedition> expeditionOptional = expeditionRepository.findById(expeditionId);
        Optional<UserInfo> userInfoOptional = userRepository.findById(userId);

        if(expeditionOptional.isPresent() && userInfoOptional.isPresent()){
            UserInfo user = userInfoOptional.get();
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
