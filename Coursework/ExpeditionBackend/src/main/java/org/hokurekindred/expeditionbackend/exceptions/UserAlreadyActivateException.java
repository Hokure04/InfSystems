package org.hokurekindred.expeditionbackend.exceptions;

public class UserAlreadyActivateException extends RuntimeException {
    public UserAlreadyActivateException() {
        super("User is already activated");
    }
}
