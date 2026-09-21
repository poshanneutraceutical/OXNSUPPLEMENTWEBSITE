package OXNsupplements.controller;


import OXNsupplements.dto.ContactMessageDTO;

import OXNsupplements.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactMessageDTO> submitMessage(@Valid @RequestBody ContactMessageDTO dto) {
        ContactMessageDTO saved = contactService.submitMessage(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
