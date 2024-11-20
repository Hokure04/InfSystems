package org.hokurekindred.expeditionbackend.authentication;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;

import java.util.Date;

import static org.hokurekindred.expeditionbackend.Constants.ACTIVATION_KEY;
import static org.hokurekindred.expeditionbackend.Constants.EXPIRATION_ACTIVATION_TOKEN;

@Component
public class JwtTokenProvider {

    @Value("${security.jwt.token.secret-key:secret}")
    private String secretKey;

    @Value("${security.jwt.token.expire-length:3600000}")
    private long validityInMilliseconds;

    private static SecretKey key;

    private static SecretKey activationKey;


    @PostConstruct
    protected void init() {
        if (secretKey.length() < 32) {
            throw new IllegalArgumentException("The secret key must be at least 32 characters long");
        }
        key = Keys.hmacShaKeyFor(secretKey.getBytes());
        activationKey = Keys.hmacShaKeyFor(ACTIVATION_KEY.getBytes());
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .claim("sub", username)
                .claim("iat", new Date())  // Issued at
                .claim("exp", new Date(System.currentTimeMillis() + validityInMilliseconds))  // Expiration
                .signWith(key)// Sign with the SecretKey
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean validateToken(String token) {

        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String generateActivateToken(String email) {
        return Jwts.builder()
                .claim("sub", email)
                .claim("iat", new Date())  // Issued at
                .claim("exp", new Date(System.currentTimeMillis() + EXPIRATION_ACTIVATION_TOKEN))  // Expiration
                .signWith(activationKey)  // Sign with the SecretKey
                .compact();
    }

    public void validateActivationToken(String token) {
        Jwts.parser().verifyWith(activationKey).build().parseSignedClaims(token);
    }

    public String getEmailFromActivationToken(String token) {
        return Jwts.parser().verifyWith(activationKey).build().parseSignedClaims(token).getPayload().getSubject();
    }
}