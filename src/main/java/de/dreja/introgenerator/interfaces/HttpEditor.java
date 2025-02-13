package de.dreja.introgenerator.interfaces;

import de.dreja.introgenerator.model.entity.Presentation;
import de.dreja.introgenerator.model.form.PresentationForm;
import de.dreja.introgenerator.service.EntityCache;
import jakarta.annotation.Nonnull;
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
        addBootstrap(model);
        return new ModelAndView("index", model);
    }

    @PostMapping("/presentation/create-new")
    public ResponseEntity<Boolean> createPresentation(@ModelAttribute @Nonnull PresentationForm presentationForm) {
        LOG.info("Create {}", presentationForm);
        final Presentation presentation = entityCache.newPresentation(presentationForm);
        LOG.info("Presentation created {}", presentation);
        return seePresentation(presentation.id(), true);
    }


    private void addBootstrap(@Nonnull Map<String, Object> model) {
        try {
            model.put("bootstrapCss", bootStrapResource.getContentAsString(StandardCharsets.UTF_8));
        } catch (IOException e) {
            model.put("bootstrapCss", "");
        }
    }

    @Nonnull
    private <V> ResponseEntity<V> seePresentation(int presentationId, @Nonnull V body) {
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header("Location", "/presentation/"+presentationId)
                .body(body);
    }

}
