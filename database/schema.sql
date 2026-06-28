-- =====================================================================
--  AutoWash Pro — Hệ thống quản lý bãi rửa xe
--  MySQL / MariaDB schema (khớp với entity JPA hiện tại)
--
--  Cách chạy:
--     mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS autowash CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
--     mysql -u root -p autowash < database/schema.sql
--
--  Lưu ý: Ứng dụng dùng Hibernate ddl-auto=update nên có thể tự tạo bảng.
--  File này để tham khảo / dựng DB thủ công, đã đồng bộ với code.
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- Xoá bảng cũ (kể cả các bảng thừa từ thiết kế cũ) để dựng lại sạch
DROP TABLE IF EXISTS wash_bays;
DROP TABLE IF EXISTS point_transactions;
DROP TABLE IF EXISTS loyalty_accounts;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;
-- bảng thừa từ schema cũ (nếu tồn tại)
DROP TABLE IF EXISTS booking_details;
DROP TABLE IF EXISTS wash_transactions;
DROP TABLE IF EXISTS tiers;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. users — tài khoản đăng nhập + vai trò
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    username      VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('ADMIN','CUSTOMER','STAFF') NOT NULL,
    enabled       BIT(1)       NOT NULL DEFAULT b'1',
    created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- 2. customers — hồ sơ khách hàng (1-1 với users)
-- ---------------------------------------------------------------------
CREATE TABLE customers (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    user_id       BIGINT       NOT NULL,
    full_name     VARCHAR(120) NOT NULL,
    phone         VARCHAR(20)  NOT NULL,
    email         VARCHAR(120) DEFAULT NULL,
    date_of_birth DATE         DEFAULT NULL,
    gender        VARCHAR(10)  DEFAULT NULL,
    address       VARCHAR(255) DEFAULT NULL,
    created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_customers_user (user_id),
    UNIQUE KEY uq_customers_phone (phone),
    CONSTRAINT fk_customer_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- 3. vehicles — xe của khách (ô tô / xe máy)
-- ---------------------------------------------------------------------
CREATE TABLE vehicles (
    id            BIGINT      NOT NULL AUTO_INCREMENT,
    customer_id   BIGINT      NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    category      VARCHAR(20) DEFAULT NULL,   -- "Xe máy" | "Ô tô"
    type          VARCHAR(50) DEFAULT NULL,   -- dòng xe: Wave, Vios...
    brand         VARCHAR(50) DEFAULT NULL,   -- hãng: Honda, Toyota...
    PRIMARY KEY (id),
    CONSTRAINT fk_vehicle_customer FOREIGN KEY (customer_id) REFERENCES customers (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- 4. services — danh mục dịch vụ (gói rửa + dịch vụ thêm)
-- ---------------------------------------------------------------------
CREATE TABLE services (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    name         VARCHAR(120) NOT NULL,
    category     VARCHAR(20)  DEFAULT NULL,   -- WASH_PACKAGE | ADD_ON
    price        BIGINT       NOT NULL,       -- VND
    duration_min INT          NOT NULL,
    active       BIT(1)       NOT NULL DEFAULT b'1',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- 5. loyalty_accounts — tài khoản điểm thưởng (1-1 với customers)
-- ---------------------------------------------------------------------
CREATE TABLE loyalty_accounts (
    id             BIGINT      NOT NULL AUTO_INCREMENT,
    customer_id    BIGINT      NOT NULL,
    tier           ENUM('GOLD','MEMBER','PLATINUM','SILVER') NOT NULL,
    points_balance INT         NOT NULL,
    lifetime_spend BIGINT      NOT NULL,
    visit_count    INT         NOT NULL,
    updated_at     DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    UNIQUE KEY uq_loyalty_customer (customer_id),
    CONSTRAINT fk_loyalty_customer FOREIGN KEY (customer_id) REFERENCES customers (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- 6. point_transactions — sổ điểm (tích / đổi / hết hạn)
-- ---------------------------------------------------------------------
CREATE TABLE point_transactions (
    id                 BIGINT       NOT NULL AUTO_INCREMENT,
    loyalty_account_id BIGINT       NOT NULL,
    type               ENUM('ADJUST','EARN','EXPIRE','REDEEM') NOT NULL,
    points             INT          NOT NULL,   -- dương = cộng, âm = trừ
    description        VARCHAR(255) DEFAULT NULL,
    created_at         DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_point_loyalty FOREIGN KEY (loyalty_account_id) REFERENCES loyalty_accounts (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- 7. promotions — khuyến mãi nhắm theo hạng
-- ---------------------------------------------------------------------
CREATE TABLE promotions (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    code             VARCHAR(40)  NOT NULL,
    name             VARCHAR(120) NOT NULL,
    description      VARCHAR(255) DEFAULT NULL,
    discount_percent INT          NOT NULL,
    min_tier         ENUM('GOLD','MEMBER','PLATINUM','SILVER') DEFAULT NULL, -- NULL = mọi hạng
    start_date       DATE         NOT NULL,
    end_date         DATE         NOT NULL,
    active           BIT(1)       NOT NULL DEFAULT b'1',
    PRIMARY KEY (id),
    UNIQUE KEY uq_promotions_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- 8. bookings — lịch đặt rửa xe
-- ---------------------------------------------------------------------
CREATE TABLE bookings (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    customer_id    BIGINT       DEFAULT NULL,   -- NULL nếu khách vãng lai
    vehicle_id     BIGINT       DEFAULT NULL,   -- NULL nếu khách vãng lai
    service_id     BIGINT       NOT NULL,
    scheduled_time DATETIME(6)  NOT NULL,
    status         ENUM('CANCELLED','CONFIRMED','DONE','IN_PROGRESS','PENDING') NOT NULL,
    note           VARCHAR(255) DEFAULT NULL,
    price          BIGINT       NOT NULL,       -- snapshot giá lúc đặt
    created_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    walkin_name    VARCHAR(120) DEFAULT NULL,   -- thông tin khách vãng lai (order tại quầy)
    walkin_phone   VARCHAR(20)  DEFAULT NULL,
    walkin_plate   VARCHAR(20)  DEFAULT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES customers (id),
    CONSTRAINT fk_booking_vehicle  FOREIGN KEY (vehicle_id)  REFERENCES vehicles (id),
    CONSTRAINT fk_booking_service  FOREIGN KEY (service_id)  REFERENCES services (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ---------------------------------------------------------------------
-- 9. wash_bays — BÃI RỬA (lõi vận hành: trống / đang rửa)
-- ---------------------------------------------------------------------
CREATE TABLE wash_bays (
    id                 BIGINT      NOT NULL AUTO_INCREMENT,
    name               VARCHAR(50) NOT NULL,
    status             ENUM('FREE','OCCUPIED') NOT NULL,
    current_booking_id BIGINT      DEFAULT NULL,   -- lịch đang rửa tại bãi (NULL = trống)
    PRIMARY KEY (id),
    CONSTRAINT fk_bay_booking FOREIGN KEY (current_booking_id) REFERENCES bookings (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- =====================================================================
--  DỮ LIỆU MẪU (seed)
-- =====================================================================

-- Tài khoản quản trị — đăng nhập: admin / admin123
INSERT INTO users (username, password_hash, role, enabled) VALUES
('admin', '$2a$10$V6CyJ9SYm9nUZq7SXltY/OoXhetW6mUPKdFT23..NjpIOZWfb6sX.', 'ADMIN', b'1');

-- 10 bãi rửa (đều trống lúc khởi tạo)
INSERT INTO wash_bays (name, status) VALUES
('Bãi 1','FREE'),('Bãi 2','FREE'),('Bãi 3','FREE'),('Bãi 4','FREE'),('Bãi 5','FREE'),
('Bãi 6','FREE'),('Bãi 7','FREE'),('Bãi 8','FREE'),('Bãi 9','FREE'),('Bãi 10','FREE');

-- Danh mục dịch vụ
INSERT INTO services (name, category, price, duration_min, active) VALUES
('Rửa xe cơ bản',   'WASH_PACKAGE', 30000, 20, b'1'),
('Rửa xe cao cấp',  'WASH_PACKAGE', 50000, 35, b'1'),
('Vệ sinh động cơ', 'ADD_ON',       40000, 25, b'1'),
('Đánh bóng xe',    'ADD_ON',       60000, 30, b'1');

-- Khuyến mãi
INSERT INTO promotions (code, name, description, discount_percent, min_tier, start_date, end_date, active) VALUES
('WELCOME10',  'Chào mừng thành viên mới', 'Giảm 10% cho lần rửa đầu tiên của bạn.',          10, NULL,       CURDATE() - INTERVAL 1 DAY, CURDATE() + INTERVAL 6 MONTH, b'1'),
('WEEKEND12',  'Cuối tuần rạng rỡ',        'Giảm 12% cho mọi dịch vụ vào cuối tuần.',          12, NULL,       CURDATE() - INTERVAL 1 DAY, CURDATE() + INTERVAL 6 MONTH, b'1'),
('SILVER15',   'Ưu đãi hạng Silver+',      'Giảm 15% dành riêng cho hạng Silver trở lên.',     15, 'SILVER',   CURDATE() - INTERVAL 1 DAY, CURDATE() + INTERVAL 6 MONTH, b'1'),
('GOLD20',     'Đặc quyền hạng Gold+',     'Giảm 20% dành riêng cho hạng Gold trở lên.',       20, 'GOLD',     CURDATE() - INTERVAL 1 DAY, CURDATE() + INTERVAL 6 MONTH, b'1'),
('PLATINUM25', 'Tri ân hạng Platinum',     'Giảm 25% cùng nhiều quà tặng cho hạng Platinum.',  25, 'PLATINUM', CURDATE() - INTERVAL 1 DAY, CURDATE() + INTERVAL 6 MONTH, b'1');
