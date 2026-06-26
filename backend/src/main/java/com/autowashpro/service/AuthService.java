package com.autowashpro.service;

import com.autowashpro.dto.AuthResponse;
import com.autowashpro.dto.LoginRequest;
import com.autowashpro.dto.RegisterRequest;
import com.autowashpro.entity.Customer;
import com.autowashpro.entity.Role;
import com.autowashpro.entity.User;
import com.autowashpro.repository.CustomerRepository;
import com.autowashpro.repository.UserRepository;
import com.autowashpro.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       CustomerRepository customerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByUsername(req.getPhone())) {
            throw new IllegalArgumentException("Số điện thoại đã được đăng ký");
        }

        User user = new User();
        user.setUsername(req.getPhone());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        user.setRole(Role.CUSTOMER);
        user.setEnabled(true);
        user = userRepository.save(user);

        Customer customer = new Customer();
        customer.setUser(user);
        customer.setFullName(req.getFullName());
        customer.setPhone(req.getPhone());
        customer.setEmail(req.getEmail());
        customerRepository.save(customer);

        String token = jwtService.generateToken(user.getUsername());
        return new AuthResponse(token, customer.getFullName(), customer.getPhone(), user.getRole().name());
    }

    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getPhone(), req.getPassword()));

        User user = userRepository.findByUsername(req.getPhone())
                .orElseThrow(() -> new BadCredentialsException("Sai số điện thoại hoặc mật khẩu"));
        Customer customer = customerRepository.findByUserUsername(user.getUsername()).orElse(null);

        String token = jwtService.generateToken(user.getUsername());
        String fullName = (customer != null) ? customer.getFullName() : user.getUsername();
        return new AuthResponse(token, fullName, user.getUsername(), user.getRole().name());
    }
}
