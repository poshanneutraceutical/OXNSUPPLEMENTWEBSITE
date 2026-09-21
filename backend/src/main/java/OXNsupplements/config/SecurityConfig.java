package OXNsupplements.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                // We are currently using the backend as an API.
                .csrf(csrf -> csrf.disable())

                // Allow CORS requests from the frontend.
                .cors(cors -> {})

                // Allow browser preflight requests.
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()

                        // Allow the existing OXN API endpoints.
                        .requestMatchers(
                                "/api/**"
                        ).permitAll()

                        // Allow everything else for now.
                        .anyRequest().permitAll()
                );

        return http.build();
    }
}