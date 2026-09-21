package OXNsupplements.repository;


import OXNsupplements.entity.DistributorInquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DistributorInquiryRepository extends JpaRepository<DistributorInquiry, Long> {
}