package OXNsupplements.service;

import OXNsupplements.dto.VerifyRequest;
import OXNsupplements.dto.VerifyResponse;
import OXNsupplements.entity.ProductAuth;

import OXNsupplements.repository.ProductAuthRepository;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final ProductAuthRepository repository;

    public AuthService(ProductAuthRepository repository) {
        this.repository = repository;
    }

    public VerifyResponse checkCode(VerifyRequest request) {
        ProductAuth product = repository.findBySecretCode(request.getCode()).orElse(null);

        if (product == null) {
            return new VerifyResponse("invalid", "Sorry, the code you entered is invalid.");
        }

        return new VerifyResponse("valid", "Success!\n" +
                "Congratulations! Your Ghost Strength product has been successfully verified and confirmed as 100% genuine. Thank you for choosing Ghost Strength. Train Hard. Stay Authentic.");
    }
}
