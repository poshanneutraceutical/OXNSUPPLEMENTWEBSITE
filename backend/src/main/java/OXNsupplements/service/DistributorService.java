package OXNsupplements.service;

import OXNsupplements.dto.DistributorInquiryDTO;
import OXNsupplements.entity.DistributorInquiry;
import OXNsupplements.repository.DistributorInquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DistributorService {

    private final DistributorInquiryRepository repository;
    private final EmailService emailService;

    public DistributorInquiryDTO submitInquiry(DistributorInquiryDTO dto) {

        DistributorInquiry inquiry = DistributorInquiry.builder()
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .phone(dto.getPhone())
                .businessName(dto.getBusinessName())
                .city(dto.getCity())
                .state(dto.getState())
                .message(dto.getMessage())
                .build();

        // Save in MySQL
        DistributorInquiry saved = repository.save(inquiry);

        // Send email to company
        emailService.sendDistributorInquiryEmail(
                dto.getFullName(),
                dto.getEmail(),
                dto.getPhone(),
                dto.getBusinessName(),
                dto.getCity(),
                dto.getState(),
                dto.getMessage()
        );

        return toDTO(saved);
    }

    private DistributorInquiryDTO toDTO(DistributorInquiry e) {
        return DistributorInquiryDTO.builder()
                .fullName(e.getFullName())
                .email(e.getEmail())
                .phone(e.getPhone())
                .businessName(e.getBusinessName())
                .city(e.getCity())
                .state(e.getState())
                .message(e.getMessage())
                .build();
    }
}