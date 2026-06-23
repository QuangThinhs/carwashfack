-- =====================================================================
--  AutoWash Pro - MySQL schema + du lieu mau
--  Chay: mysql -u root -p autowash < database/schema.sql
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS point_transactions;
DROP TABLE IF EXISTS wash_transactions;
DROP TABLE IF EXISTS booking_details;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS loyalty_accounts;
DROP TABLE IF EXISTS vehicles;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS tiers;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------
-- 1. users : tai khoan dang nhap + vai tro
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('CUSTOMER','STAFF','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
    enabled       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 2. tiers : 4 hang + quy tac (co the chinh boi admin)
-- ---------------------------------------------------------------------
CREATE TABLE tiers (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(20) NOT NULL UNIQUE,        -- MEMBER, SILVER, GOLD, PLATINUM
    rank_order          INT NOT NULL,                       -- 1..4 (cao hon = hang cao hon)
    booking_window_days INT NOT NULL,                       -- so ngay duoc dat truoc (7/10/12/14)
    priority_weight     INT NOT NULL,                       -- cao = uu tien hang doi
    point_rate          DECIMAL(5,2) NOT NULL,              -- diem nhan tren moi 1000 VND chi tieu
    min_spend           DECIMAL(12,2) NOT NULL DEFAULT 0,   -- nguong chi tieu de len hang
    perks               VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 3. customers : ho so khach (1-1 voi users)
-- ---------------------------------------------------------------------
CREATE TABLE customers (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id    BIGINT NOT NULL UNIQUE,
    full_name  VARCHAR(120) NOT NULL,
    phone      VARCHAR(20) NOT NULL UNIQUE,
    email      VARCHAR(120),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 4. vehicles : xe may cua khach
-- ---------------------------------------------------------------------
CREATE TABLE vehicles (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id   BIGINT NOT NULL,
    license_plate VARCHAR(20) NOT NULL,
    type          VARCHAR(50),    -- loai / phan khuc xe
    brand         VARCHAR(50),
    CONSTRAINT fk_vehicle_customer FOREIGN KEY (customer_id) REFERENCES customers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 5. services : goi rua + dich vu them
-- ---------------------------------------------------------------------
CREATE TABLE services (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(120) NOT NULL,
    category     ENUM('WASH_PACKAGE','ADD_ON') NOT NULL DEFAULT 'WASH_PACKAGE',
    price        DECIMAL(12,2) NOT NULL,
    duration_min INT NOT NULL DEFAULT 30,
    active       BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 6. loyalty_accounts : trang thai diem cua moi khach (1-1 customers)
-- ---------------------------------------------------------------------
CREATE TABLE loyalty_accounts (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id    BIGINT NOT NULL UNIQUE,
    tier_id        BIGINT NOT NULL,
    points_balance INT NOT NULL DEFAULT 0,
    lifetime_spend DECIMAL(14,2) NOT NULL DEFAULT 0,
    visit_count    INT NOT NULL DEFAULT 0,
    updated_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_loyalty_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_loyalty_tier     FOREIGN KEY (tier_id)     REFERENCES tiers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 7. bookings : lich dat
-- ---------------------------------------------------------------------
CREATE TABLE bookings (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id     BIGINT NOT NULL,
    vehicle_id      BIGINT NOT NULL,
    scheduled_time  DATETIME NOT NULL,
    status          ENUM('PENDING','CONFIRMED','IN_PROGRESS','DONE','CANCELLED') NOT NULL DEFAULT 'PENDING',
    priority_weight INT NOT NULL DEFAULT 0,   -- snapshot uu tien theo hang luc dat
    note            VARCHAR(255),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES customers(id),
    CONSTRAINT fk_booking_vehicle  FOREIGN KEY (vehicle_id)  REFERENCES vehicles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 8. booking_details : cac dich vu trong moi lich dat
-- ---------------------------------------------------------------------
CREATE TABLE booking_details (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    quantity   INT NOT NULL DEFAULT 1,
    price      DECIMAL(12,2) NOT NULL,   -- snapshot gia luc dat
    CONSTRAINT fk_bd_booking FOREIGN KEY (booking_id) REFERENCES bookings(id),
    CONSTRAINT fk_bd_service FOREIGN KEY (service_id) REFERENCES services(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 9. promotions : khuyen mai nham nhom
-- ---------------------------------------------------------------------
CREATE TABLE promotions (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    code             VARCHAR(40) NOT NULL UNIQUE,
    name             VARCHAR(120) NOT NULL,
    discount_percent INT NOT NULL DEFAULT 0,
    min_tier_id      BIGINT,                 -- chi ap dung tu hang nay tro len (NULL = tat ca)
    start_date       DATE NOT NULL,
    end_date         DATE NOT NULL,
    active           BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_promo_tier FOREIGN KEY (min_tier_id) REFERENCES tiers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 10. wash_transactions : lan rua hoan tat
-- ---------------------------------------------------------------------
CREATE TABLE wash_transactions (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_id      BIGINT UNIQUE,            -- co the NULL neu khach vang lai
    customer_id     BIGINT NOT NULL,
    promotion_id    BIGINT,
    total_amount    DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    points_earned   INT NOT NULL DEFAULT 0,
    points_redeemed INT NOT NULL DEFAULT 0,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wash_booking  FOREIGN KEY (booking_id)   REFERENCES bookings(id),
    CONSTRAINT fk_wash_customer FOREIGN KEY (customer_id)  REFERENCES customers(id),
    CONSTRAINT fk_wash_promo    FOREIGN KEY (promotion_id) REFERENCES promotions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- 11. point_transactions : so diem (tich / doi / het han)
-- ---------------------------------------------------------------------
CREATE TABLE point_transactions (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,
    loyalty_account_id  BIGINT NOT NULL,
    wash_transaction_id BIGINT,
    type                ENUM('EARN','REDEEM','EXPIRE','ADJUST') NOT NULL,
    points              INT NOT NULL,        -- duong = cong diem, am = tru diem
    expires_at          DATETIME,            -- chi dung cho EARN: earned_at + 12 thang
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pt_loyalty FOREIGN KEY (loyalty_account_id)  REFERENCES loyalty_accounts(id),
    CONSTRAINT fk_pt_wash    FOREIGN KEY (wash_transaction_id) REFERENCES wash_transactions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
--  DU LIEU MAU (seed)
-- =====================================================================

-- 4 hang thanh vien
INSERT INTO tiers (name, rank_order, booking_window_days, priority_weight, point_rate, min_spend, perks) VALUES
('MEMBER',   1, 7,  1, 1.00, 0,        'Tich diem co ban'),
('SILVER',   2, 10, 2, 1.20, 2000000,  'Giam 5% dich vu them'),
('GOLD',     3, 12, 3, 1.50, 5000000,  'Giam 10%, uu tien hang doi'),
('PLATINUM', 4, 14, 4, 2.00, 10000000, 'Giam 15%, 1 lan rua mien phi moi thang');

-- Dich vu mau
INSERT INTO services (name, category, price, duration_min) VALUES
('Rua xe co ban',   'WASH_PACKAGE', 30000, 20),
('Rua xe cao cap',  'WASH_PACKAGE', 50000, 35),
('Ve sinh dong co', 'ADD_ON',       40000, 25),
('Danh bong xe',    'ADD_ON',       60000, 30);

-- Tai khoan admin mau (LUU Y: thay password_hash bang bcrypt that khi chay backend)
-- Vi du mat khau "admin123" -> hash bang BCrypt truoc khi dung.
-- INSERT INTO users (username, password_hash, role) VALUES ('admin', '<bcrypt-hash>', 'ADMIN');
