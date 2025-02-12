package de.dreja.introgenerator.interfaces;

import de.dreja.introgenerator.model.form.CreatePresentation;
import de.dreja.introgenerator.service.EntityCache;
import jakarta.annotation.Nonnull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.Map;

@Controller
public class HttpEditor {

    private static final Logger LOG = LoggerFactory.getLogger(HttpEditor.class);

    private final EntityCache entityCache;

    @Autowired
    HttpEditor(EntityCache entityCache) {
        this.entityCache = entityCache;
    }

    @GetMapping({"/", "/presentation"})
    public ModelAndView getStartPage(Map<String, Object> model) {
        model.put("now", "Hello!");
        return new ModelAndView("index", model);
    }

    @PostMapping("/presentation/create-new")
    public ResponseEntity<String> createPresentation(@ModelAttribute @Nonnull CreatePresentation create) {
        LOG.info("Create {}", create);
        return ResponseEntity.ok("Create");
    }

}
