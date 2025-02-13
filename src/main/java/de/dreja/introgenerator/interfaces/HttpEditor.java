package de.dreja.introgenerator.interfaces;

import de.dreja.introgenerator.model.entity.Presentation;
import de.dreja.introgenerator.model.form.PresentationForm;
import de.dreja.introgenerator.service.EntityCache;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Controller
public class HttpEditor {

    private static final Logger LOG = LoggerFactory.getLogger(HttpEditor.class);

    private final EntityCache entityCache;
    private final Resource bootStrapResource = new ClassPathResource("static/bootstrap.css");

    @Autowired
    HttpEditor(EntityCache entityCache) {
        this.entityCache = entityCache;
    }

    @GetMapping({"/", "/presentation"})
    public ModelAndView getStartPage(Map<String, Object> model) {
        model.put("presentation", PresentationForm.emptyForm());
        model.put("presentationUrl", "/presentation/0");
        addBootstrap(model);
        return new ModelAndView("index", model);
    }

    @GetMapping("/presentation/{presentationId}")
    public ModelAndView getPresentation(@PathVariable("presentationId") int presentationId,
                                        Map<String, Object> model) {
        final PresentationForm form = entityCache.findPresentation(presentationId)
                .map(Presentation::toForm)
                .orElseGet(PresentationForm::emptyForm);
        model.put("presentation", form);
        model.put("presentationUrl", "/presentation/" + presentationId);
        addBootstrap(model);
        return new ModelAndView("index", model);
    }

    @PostMapping("presentation/{presentationId}")
    public ResponseEntity<Void> createPresentation(@PathVariable(value = "presentationId", required = false)
                                                   @Nullable
                                                   Integer presentationId,
                                                   @ModelAttribute
                                                   @Nonnull
                                                   PresentationForm presentationForm) {
        if (presentationId == null || presentationId == 0) {
            LOG.info("Create {}", presentationForm);
            return seePresentation(entityCache.newPresentation(presentationForm).id());
        } else {
            LOG.info("Update {}: {}", presentationId, presentationForm);
            return seePresentation(entityCache.update(presentationId, presentationForm).id());
        }
    }

    private void addBootstrap(@Nonnull Map<String, Object> model) {
        try {
            model.put("bootstrapCss", bootStrapResource.getContentAsString(StandardCharsets.UTF_8));
        } catch (IOException e) {
            model.put("bootstrapCss", "");
        }
    }

    @Nonnull
    private ResponseEntity<Void> seePresentation(int presentationId) {
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header("Location", "/presentation/" + presentationId)
                .build();
    }

}
