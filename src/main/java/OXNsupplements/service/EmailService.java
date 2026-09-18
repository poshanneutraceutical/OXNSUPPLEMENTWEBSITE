package OXNsupplements.service;

import OXNsupplements.entity.Order;
import OXNsupplements.entity.OrderItem;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${company.email}")
    private String companyEmail;

    /**
     * Contact Form Email
     */
    public void sendContactEmail(
            String name,
            String email,
            String phone,
            String message) {

        try {

            SimpleMailMessage mail = new SimpleMailMessage();

            mail.setFrom(companyEmail);
            mail.setTo(companyEmail);
            mail.setSubject("New Contact Inquiry");

            mail.setText(
                    "Name : " + name + "\n\n" +
                            "Email : " + email + "\n\n" +
                            "Phone : " + phone + "\n\n" +
                            "Message :\n" + message
            );

            mailSender.send(mail);

            log.info("Contact inquiry email sent successfully.");

        } catch (Exception e) {

            log.error("Failed to send contact email.", e);

        }
    }

    /**
     * Distributor Inquiry Email
     */
    public void sendDistributorInquiryEmail(
            String fullName,
            String email,
            String phone,
            String businessName,
            String city,
            String state,
            String message) {

        try {

            SimpleMailMessage mail = new SimpleMailMessage();

            mail.setFrom(companyEmail);
            mail.setTo(companyEmail);
            mail.setSubject("New Distributor Inquiry");

            mail.setText(
                    "Full Name : " + fullName + "\n\n" +
                            "Email : " + email + "\n\n" +
                            "Phone : " + phone + "\n\n" +
                            "Business Name : " + businessName + "\n\n" +
                            "City : " + city + "\n\n" +
                            "State : " + state + "\n\n" +
                            "Message :\n" + message
            );

            mailSender.send(mail);

            log.info("Distributor inquiry email sent successfully.");

        } catch (Exception e) {

            log.error("Failed to send distributor inquiry email.", e);

        }
    }

    /**
     * Order Confirmation Email
     */
    @Async
    public void sendOrderConfirmation(Order order) {

        try {

            StringBuilder products = new StringBuilder();

            for (OrderItem item : order.getItems()) {

                products.append("• ")
                        .append(item.getProductName())
                        .append(" x ")
                        .append(item.getQuantity())
                        .append("  -  ₹")
                        .append(item.getSubtotal())
                        .append("\n");

            }

            // =========================================
            // Customer Email
            // =========================================

            SimpleMailMessage customerMail = new SimpleMailMessage();

            customerMail.setFrom(companyEmail);
            customerMail.setTo(order.getEmail());

            customerMail.setSubject(
                    "Ghost Strength - Order Confirmation #" + order.getId()
            );

            customerMail.setText(

                    "Hello " + order.getCustomerName() + ",\n\n" +

                            "Thank you for shopping with Ghost Strength.\n\n" +

                            "Your order has been placed successfully.\n\n" +

                            "=====================================\n" +
                            "ORDER DETAILS\n" +
                            "=====================================\n\n" +

                            "Order ID : " + order.getId() + "\n" +
                            "Order Status : " + order.getOrderStatus() + "\n" +
                            "Payment Status : " + order.getPaymentStatus() + "\n\n" +

                            "Products:\n\n" +

                            products +

                            "\n-------------------------------------\n" +

                            "Total Amount : ₹" + order.getTotalAmount() +

                            "\n-------------------------------------\n\n" +

                            "Shipping Address:\n\n" +

                            order.getAddress() + "\n" +
                            order.getCity() + "\n" +
                            order.getState() + " - " + order.getPincode() +

                            "\n\nWe will notify you once your order has been shipped.\n\n" +

                            "Thank you for choosing Ghost Strength.\n\n" +

                            "Team Ghost Strength"

            );

            mailSender.send(customerMail);

            // =========================================
            // Company Email
            // =========================================

            SimpleMailMessage companyMail = new SimpleMailMessage();

            companyMail.setFrom(companyEmail);
            companyMail.setTo(companyEmail);

            companyMail.setSubject(
                    "New Order Received #" + order.getId()
            );

            companyMail.setText(

                    "A new order has been placed.\n\n" +

                            "=====================================\n" +

                            "Customer Details\n" +

                            "=====================================\n\n" +

                            "Customer : " + order.getCustomerName() +

                            "\nEmail : " + order.getEmail() +

                            "\nPhone : " + order.getPhone() +

                            "\n\nShipping Address:\n\n" +

                            order.getAddress() + "\n" +

                            order.getCity() + "\n" +

                            order.getState() + " - " +

                            order.getPincode() +

                            "\n\n=====================================\n" +

                            "Products\n" +

                            "=====================================\n\n" +

                            products +

                            "\n-------------------------------------\n" +

                            "Total Amount : ₹" + order.getTotalAmount()

            );

            mailSender.send(companyMail);

            log.info(
                    "Order confirmation emails sent successfully for Order ID {}",
                    order.getId()
            );

        } catch (Exception e) {

            log.error(
                    "Failed to send order confirmation email for Order ID {}",
                    order.getId(),
                    e
            );

        }
    }
}