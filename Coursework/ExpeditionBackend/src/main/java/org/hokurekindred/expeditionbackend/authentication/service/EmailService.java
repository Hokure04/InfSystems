package org.hokurekindred.expeditionbackend.authentication.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import static org.hokurekindred.expeditionbackend.Constants.HOST_EMAIL;


@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendActivationEmail(String to, String activationLink) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(HOST_EMAIL);
        helper.setTo(to);
        helper.setSubject("Account Activation");
        helper.setText(String.format("To activate your account, please click the following link: %s", activationLink), true);
        mailSender.send(message);
    }
}
