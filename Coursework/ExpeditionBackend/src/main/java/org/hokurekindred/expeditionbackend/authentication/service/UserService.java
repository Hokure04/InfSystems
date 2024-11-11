package org.hokurekindred.expeditionbackend.authentication.service;

import org.hokurekindred.expeditionbackend.dto.LoginRequest;
import org.hokurekindred.expeditionbackend.model.User;
import org.hokurekindred.expeditionbackend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public void encodePasswordAndSaveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public User validateUser(LoginRequest loginInfo) {
        User user;
        if (loginInfo.getLogin().contains("@")) {
            user = userRepository.findByEmail(loginInfo.getLogin());
        } else {
            user = userRepository.findByUsername(loginInfo.getLogin());
        }
        if (user != null && passwordEncoder.matches(loginInfo.getPassword(), user.getPassword())){
            return user;
        }
        return null;
    }

}