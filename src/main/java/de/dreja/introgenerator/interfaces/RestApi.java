package de.dreja.introgenerator.interfaces;

import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.RestController;

@RestController("api")
@Profile("open-api")
public class RestApi {
}
