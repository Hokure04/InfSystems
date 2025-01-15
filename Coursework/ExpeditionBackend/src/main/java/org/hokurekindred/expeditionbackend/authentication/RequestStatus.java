package org.hokurekindred.expeditionbackend.authentication;

import lombok.Getter;

@Getter
public enum RequestStatus {
    SEND,
    UNDER_CONSIDERATION,
    APPROVED,
    DENIED
}