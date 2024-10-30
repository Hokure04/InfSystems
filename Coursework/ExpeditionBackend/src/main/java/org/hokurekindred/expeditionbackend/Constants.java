package org.hokurekindred.expeditionbackend;

public class Constants {
    public static final String API_KEY_HEADER = "X-Kontur-Apikey";
    public static final String API_KEY = "8759e5bf-ecbc-1a25-381d-6b94fecc09e5";

    public static final String GET_TENDER_INFO_URL = "https://api-zakupki.kontur.ru/external/v1/purchases/";

    public static final String FIND_TENDERS_URL = "https://api-zakupki.kontur.ru/external/v1/search?";

    public static final String EMAIL_DOMAIN = "gmail.com";
    public static final String ACTIVATION_LINK = "http://localhost:4200/activate?token=";
    public static final String ACTIVATION_KEY = "egdfvhfbnqergjgkwoerigjsnfsoflkvnslfg"; // must be more than 32 symbols!!!
    public static final long EXPIRATION_ACTIVATION_TOKEN = 360000 * 24;
    public static final String HOST_EMAIL = "assistantpro.service@mail.ru";
    //public static final int MAX_PAGE_COUNT = 10;
    public static final int ITEMS_ON_PAGE = 50;
    public static final String SCHEDULE_TIME = "10 07 13 * * ?";
    public static final String DATE_TIME_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
}
