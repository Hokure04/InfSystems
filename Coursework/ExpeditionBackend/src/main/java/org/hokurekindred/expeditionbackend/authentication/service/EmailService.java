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
        helper.setSubject("Активация аккаунта");

        String htmlContent = "<html>" +
                "<body>" +
                "<h2>Добро пожаловать!</h2>" +
                "<p>Спасибо за регистрацию. Пожалуйста, активируйте свой аккаунт, нажав на кнопку ниже:</p>" +
                "<a href='" + activationLink + "' style='display: inline-block; padding: 10px 20px; font-size: 16px; color: white; background-color: #1a81f0; text-decoration: none; border-radius: 5px;'>Активировать аккаунт</a>" +
                "<p>Если вы не регистрировались, просто проигнорируйте это письмо.</p>" +
                "</body>" +
                "</html>";

        helper.setText(htmlContent, true);
        mailSender.send(message);
    }
}
