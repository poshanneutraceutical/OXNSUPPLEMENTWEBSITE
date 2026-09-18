package OXNsupplements.entity;



import jakarta.persistence.*;

@Entity
@Table(name = "product_auth")
public class ProductAuth {
    @Id
    private String qrId;
    private String secretCode;
    private boolean isVerified = false;

    // Getters and Setters
    public String getQrId() { return qrId; }
    public void setQrId(String qrId) { this.qrId = qrId; }

    public String getSecretCode() { return secretCode; }
    public void setSecretCode(String secretCode) { this.secretCode = secretCode; }

    public boolean isVerified() { return isVerified; }
    public void setVerified(boolean verified) { isVerified = verified; }
}