package OXNsupplements.controller;



import OXNsupplements.dto.VerifyRequest;
import OXNsupplements.dto.VerifyResponse;
import OXNsupplements.service.AuthService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/verify")
    public ResponseEntity<VerifyResponse> verify(@RequestBody VerifyRequest request) {
        return ResponseEntity.ok(authService.checkCode(request));
    }
}

