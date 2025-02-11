package de.dreja.introgenerator.interfaces;

import de.dreja.introgenerator.service.PresentationCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class HttpEditor {

    private final PresentationCache presentationCache;

    @Autowired
    HttpEditor(PresentationCache presentationCache) {
        this.presentationCache = presentationCache;
    }

}
