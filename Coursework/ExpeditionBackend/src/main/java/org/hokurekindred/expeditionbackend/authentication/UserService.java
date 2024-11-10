package org.hokurekindred.expeditionbackend.authentication;

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
        if (loginInfo.getEmailUsername().contains("@")) {
            user = userRepository.findByEmail(loginInfo.getEmailUsername());
        } else {
            user = userRepository.findByUsername(loginInfo.getEmailUsername());
        }
        if (user != null && passwordEncoder.matches(loginInfo.getPassword(), user.getPassword())){
            return user;
        }
        return null;
    }

}