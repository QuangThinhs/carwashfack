# 🚗 AutoWash Pro

> Hệ thống quản lý bãi rửa xe thông minh — vận hành bãi rửa, tiếp nhận lịch đặt, order tại quầy, tính tiền, khuyến mãi & tích điểm.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-green)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![MySQL](https://img.shields.io/badge/MySQL%2FMariaDB-blue)

---

## 📌 Mục lục
1. [Giới thiệu](#-giới-thiệu)
2. [Tính năng chính](#-tính-năng-chính)
3. [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
4. [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
5. [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
6. [Cơ sở dữ liệu](#-cơ-sở-dữ-liệu)
7. [Cài đặt & chạy](#-cài-đặt--chạy)
8. [Tài khoản & demo](#-tài-khoản--demo)
9. [Thành viên nhóm](#-thành-viên-nhóm)

---

## 🎯 Giới thiệu

**AutoWash Pro** là ứng dụng web giúp một cơ sở rửa xe (ô tô & xe máy) **số hoá toàn bộ quy trình vận hành**:
theo dõi các **bãi rửa** (trống / đang rửa), tiếp nhận **lịch đặt** của khách, **order nhanh tại quầy** cho khách
vãng lai, **tính tiền** theo nhiều dịch vụ, chạy **khuyến mãi**, **tích điểm – hạng thành viên** và thống kê **doanh thu**.

Hệ thống gồm hai phía:

- **Khách hàng:** đăng ký, quản lý xe, đặt lịch rửa, theo dõi điểm thưởng & ưu đãi.
- **Quản trị / Nhân viên:** quản lý bãi rửa, order tại quầy, tính tiền, quản lý dịch vụ – khuyến mãi – khách hàng, xem báo cáo.

---

## ✨ Tính năng chính

### 👤 Khách hàng (Customer)
- Đăng ký / đăng nhập bằng **số điện thoại + mật khẩu** (xác thực **JWT**).
- Quản lý **hồ sơ** (họ tên, SĐT, email, ngày sinh, giới tính, địa chỉ).
- Quản lý **xe** (ô tô / xe máy, hãng, dòng, biển số).
- **Đặt lịch rửa:** chọn xe, **chọn nhiều dịch vụ**, thời gian, nhập **mã khuyến mãi** → xem tổng tiền (tạm tính – giảm – thành tiền).
- Theo dõi lịch **đang chờ**, huỷ lịch, xác nhận đã rửa xong.
- Xem **lịch sử** rửa xe và **chi tiết** từng đơn.
- Xem **điểm thưởng, hạng thành viên** và danh sách **khuyến mãi** phù hợp.

### ⭐ Tích điểm & Hạng thành viên (Loyalty)
- Mỗi lần rửa **hoàn tất** sẽ tích điểm theo tỉ lệ của hạng và cộng dồn tổng chi tiêu.
- **Tự động nâng hạng** theo tổng chi tiêu tích luỹ:

  | Hạng | Ngưỡng chi tiêu | Ưu đãi |
  | :--- | :---: | :---: |
  | Member | 0đ | 0% |
  | Silver | 2.000.000đ | 5% |
  | Gold | 5.000.000đ | 10% |
  | Platinum | 10.000.000đ | 15% |

### 🛠️ Quản trị / Nhân viên (Admin / Staff)
- **Tổng quan:** số khách hàng, số đơn, đơn hoàn tất, đơn đang chờ, **doanh thu**.
- **Quản lý bãi rửa** (mặc định 10 bãi): xem trạng thái **trống / đang rửa**; thêm / đổi tên / xoá bãi.
- **Order tại quầy (POS)** cho khách vãng lai: tìm khách đã đăng ký theo **SĐT / biển số / email** để điền sẵn, hoặc nhập tay; chọn **nhiều dịch vụ**; áp **mã khuyến mãi**.
- Xếp **xe đặt online** đang chờ vào bãi trống.
- Bấm vào bãi → xem **chi tiết hoá đơn** → **Tính tiền & hoàn tất** (ghi doanh thu, tích điểm cho khách có tài khoản).
- **Quản lý lịch đặt:** xác nhận / huỷ; xem chi tiết; **tạo lịch cho khách** đã đăng ký.
- **Lịch sử đơn hàng** (hoàn tất / huỷ) kèm thống kê.
- **Quản lý dịch vụ** (thêm / sửa / xoá gói rửa & dịch vụ thêm).
- **Quản lý khuyến mãi:** mã giảm %, **đối tượng áp dụng** (Tất cả / Theo hạng / Theo khách cụ thể), **giới hạn lượt dùng**, thời hạn.
- **Quản lý khách hàng:** xem chi tiết (xe, điểm, hạng, lịch sử gần đây), sửa hồ sơ, **khoá / mở khoá** tài khoản.

---

## 🧰 Công nghệ sử dụng

| Lớp | Công nghệ | Phiên bản |
| :--- | :--- | :--- |
| **Backend** | Java | 17 |
| | Spring Boot (Web, Data JPA, Security, Validation) | 3.3.4 |
| | JWT (`jjwt`) | 0.12.6 |
| | Maven | 3.9+ |
| **Database** | MySQL / MariaDB (XAMPP) | 8.x |
| **Frontend** | Next.js (React 18) | 14.2.5 |
| | TypeScript | 5 |
| | Tailwind CSS | 3.4 |
| | Axios · lucide-react | 1.7 · — |
| **Công cụ** | Node.js / npm · Git | 18+ |

---

## 🏗️ Kiến trúc hệ thống

Ứng dụng web tách **Frontend** và **Backend**, giao tiếp qua REST API (JSON), xác thực bằng JWT.

```
┌──────────────┐     REST API (JSON)     ┌──────────────────┐      JPA      ┌─────────────┐
│  Next.js     │  ────────────────────►  │   Spring Boot    │  ──────────►  │   MySQL /   │
│  (React)     │  ◄────────────────────  │   REST API       │  ◄──────────  │   MariaDB   │
│  :3000       │       JWT (Bearer)      │   :8080          │               │   :3306     │
└──────────────┘                         └──────────────────┘               └─────────────┘
```

Backend theo mô hình **phân lớp (layered)**:
`Controller → Service → Repository → Entity (JPA) → Database`.

---

## 📂 Cấu trúc thư mục

```text
carwashAuto/
├── README.md                       # Tài liệu này
├── BAOCAO.md                       # Báo cáo đồ án
├── PLAN.md                         # Kế hoạch làm việc nhóm
├── .gitignore
│
├── backend/                        # ☕ Spring Boot REST API (Java 17)
│   ├── pom.xml
│   ├── .env.example                # Mẫu biến môi trường (DB_PASSWORD, JWT_SECRET)
│   └── src/main/
│       ├── java/com/autowashpro/
│       │   ├── AutoWashProApplication.java     # Điểm khởi chạy
│       │   ├── config/             # SecurityConfig, CorsConfig, DataInitializer, GlobalExceptionHandler
│       │   ├── security/           # JwtService, JwtAuthenticationFilter, CustomUserDetailsService
│       │   ├── controller/         # REST endpoints (Auth, Booking, Vehicle, Admin*)
│       │   ├── service/            # Nghiệp vụ (Booking, Operations, Promotion, Loyalty...)
│       │   ├── repository/         # Spring Data JPA
│       │   ├── entity/             # JPA entities (User, Customer, Vehicle, Booking, WashBay, Promotion...)
│       │   └── dto/                # Request/Response objects
│       └── resources/
│           └── application.properties          # Cấu hình DB, JWT, CORS, port
│
├── frontend/                       # ⚛️ Next.js (React) web app
│   ├── package.json
│   ├── .env.local.example          # Mẫu NEXT_PUBLIC_API_BASE_URL
│   └── src/
│       ├── app/
│       │   ├── (trang chủ, login, register)
│       │   ├── dashboard/          # Trang khách: profile, vehicles, bookings, history, loyalty, promotions
│       │   └── admin/              # Trang quản trị: overview, bays, bookings, history, services, promotions, customers
│       ├── components/             # AdminShell, Toast, ConfirmDialog, Topbar...
│       ├── services/               # Gọi API (auth, booking, vehicle, promotion, adminOps...)
│       └── lib/                    # Tiện ích (auth helper, format...)
│
└── database/
    └── schema.sql                  # Script tạo bảng + dữ liệu mẫu
```

---

## 🗄️ Cơ sở dữ liệu

Các bảng (MySQL / MariaDB):

| Bảng | Mô tả |
| :--- | :--- |
| `users` | Tài khoản đăng nhập + vai trò (CUSTOMER / STAFF / ADMIN) + trạng thái `enabled` |
| `customers` | Hồ sơ khách (1–1 với `users`) |
| `vehicles` | Xe của khách (ô tô / xe máy, biển số, hãng, dòng) |
| `services` | Dịch vụ (gói rửa & dịch vụ thêm: tên, giá, thời lượng) |
| `bookings` | Lịch đặt / đơn hàng (khách đăng ký hoặc vãng lai; dịch vụ chính; trạng thái; giá; mã KM đã áp) |
| `booking_extra_services` | Dịch vụ **thêm** của mỗi đơn (n–n giữa `bookings` ↔ `services`) |
| `wash_bays` | Bãi rửa (trống / đang rửa; đơn đang rửa tại bãi) |
| `promotions` | Khuyến mãi (mã, % giảm, đối tượng ALL/TIER/USER, giới hạn lượt, thời hạn) |
| `promotion_customers` | Khách được áp dụng (khi đối tượng = USER) |
| `loyalty_accounts` | Điểm, tổng chi tiêu, số lần rửa, hạng của khách |
| `point_transactions` | Sổ điểm: tích / đổi / điều chỉnh |

> **Quan hệ tóm tắt:** `users 1–1 customers`; `customers 1–n vehicles / bookings`, `1–1 loyalty_accounts 1–n point_transactions`;
> `bookings n–1 services` (dịch vụ chính) **và** `n–n services` (dịch vụ thêm) **và** `n–1 promotions`;
> `wash_bays n–1 bookings` (đơn đang rửa); `promotions n–n customers`.
>
> **Vòng đời trạng thái đơn:** `PENDING → CONFIRMED → IN_PROGRESS → DONE` (hoặc `CANCELLED`).

---

## ⚙️ Cài đặt & chạy

### 0. Yêu cầu môi trường

| Công cụ | Phiên bản | Ghi chú |
| :--- | :--- | :--- |
| **JDK** | 17 trở lên | Khuyến nghị LTS (17/21). Vẫn chạy được trên JDK mới hơn (đã có sẵn cờ tương thích trong `pom.xml`). |
| **Maven** | 3.9+ | Hoặc chạy bằng IDE (IntelliJ / Eclipse / VS Code). |
| **Node.js** | 18+ | Đi kèm `npm`. |
| **MySQL** | 8.x | Dễ nhất: cài **XAMPP** rồi bật MySQL (cổng `3306`). XAMPP dùng MariaDB — tương thích. |

### 1. Lấy mã nguồn

```bash
git clone <URL-repo-cua-ban>
cd carwashAuto
```

### 2. Chuẩn bị Database (MySQL)

1. **Bật MySQL.** Nếu dùng **XAMPP**: mở *XAMPP Control Panel* → bấm **Start** ở dòng **MySQL** (đèn xanh, cổng `3306`).
2. **Mật khẩu.** XAMPP mặc định user `root` **không có mật khẩu** → để trống là đúng.

> 💡 **Không cần tự tạo database** — chuỗi kết nối có `createDatabaseIfNotExist=true` nên MySQL tự tạo
> database `autowash`, và Hibernate (`ddl-auto=update`) tự tạo các bảng từ entity.
> *(Tuỳ chọn: muốn có sẵn đầy đủ bảng + dữ liệu mẫu thì import `database/schema.sql`.)*

### 3. Cấu hình & chạy Backend (cổng `8080`)

> ✅ **Dùng XAMPP mặc định (root không mật khẩu)?** Không cần cấu hình gì — nhảy thẳng tới mục **Chạy backend** bên dưới.

**Cấu hình (chỉ khi cần):** nếu MySQL của bạn **có mật khẩu**, hoặc muốn đổi **JWT secret**, hãy tạo file
`backend/.env` (copy từ `backend/.env.example`) rồi điền:

```properties
# backend/.env  — định dạng KEY=value (KHÔNG dùng "export", KHÔNG dấu nháy "")
DB_PASSWORD=mat-khau-mysql-cua-ban
JWT_SECRET=chuoi-ngau-nhien-dai-toi-thieu-256-bit
```

> 🔒 File `.env` đã được `.gitignore` bỏ qua → **không bị đẩy lên GitHub**. Backend tự đọc `.env` nhờ
> `spring.config.import` khai báo sẵn trong `application.properties`.

**Chạy backend:**

```bash
cd backend
mvn spring-boot:run
```

Thành công khi log hiện:
```
Tomcat started on port 8080 (http)
Started AutoWashProApplication in X.XXX seconds
```
- REST API: `http://localhost:8080`
- Thứ tự ưu tiên đọc cấu hình: **biến môi trường HĐH** → **`backend/.env`** → `application.properties` → giá trị mặc định.

### 4. Chạy Frontend (cổng `3000`)

```bash
cd frontend
cp .env.local.example .env.local   # Windows PowerShell: copy .env.local.example .env.local
npm install
npm run dev
```
- Web app: `http://localhost:3000`
- `.env.local` trỏ tới backend qua biến `NEXT_PUBLIC_API_BASE_URL` (mặc định `http://localhost:8080`).

### 5. Triển khai lên VPS / server (tuỳ chọn)

- **Backend** — thêm origin của frontend vào `app.cors.allowed-origins` (cách nhau bằng dấu phẩy) trong `application.properties`:
  ```properties
  app.cors.allowed-origins=http://localhost:3000,http://<IP-hoac-domain>:3000
  ```
- **Frontend** — đặt URL backend trong `.env.local` rồi build lại (`npm run build`):
  ```properties
  NEXT_PUBLIC_API_BASE_URL=http://<IP-hoac-domain>:8080
  ```
- **Bảo mật:** đặt `JWT_SECRET` / `DB_PASSWORD` thật qua `backend/.env` hoặc biến môi trường, **không commit lên GitHub**.
- Mở cổng `3000` và `8080` trên firewall của VPS.

### 6. Xử lý lỗi thường gặp

| Lỗi | Nguyên nhân & cách khắc phục |
| :--- | :--- |
| `Unable to determine Dialect` / `Communications link failure` | **MySQL chưa bật** → bật MySQL (XAMPP: Start) rồi chạy lại. |
| `Access denied for user 'root'@'localhost'` | Sai mật khẩu MySQL → đặt `DB_PASSWORD` (XAMPP để trống). |
| `Port 8080 was already in use` | Cổng bị chiếm → tắt app đang dùng cổng, hoặc đổi `server.port`. |
| Frontend báo `Network Error` | Backend chưa chạy, hoặc sai `NEXT_PUBLIC_API_BASE_URL` trong `.env.local`. |
| Lỗi **CORS** (`No 'Access-Control-Allow-Origin'`) | Origin frontend chưa được khai báo → thêm vào `app.cors.allowed-origins` rồi **khởi động lại backend**. |

---

## 🔑 Tài khoản & demo

**Tài khoản quản trị mặc định** (tạo sẵn khi khởi động):

| Vai trò | Đăng nhập tại | Tài khoản | Mật khẩu |
| :--- | :--- | :--- | :--- |
| Admin | `http://localhost:3000/admin/login` | `admin` | `admin123` |

**Trải nghiệm phía khách:**
1. Mở `http://localhost:3000` → **Đăng ký** (SĐT 10 số bắt đầu bằng `0`, mật khẩu ≥ 6 ký tự).
2. Thêm **xe**, vào **Đặt lịch rửa** → chọn nhiều dịch vụ + (tuỳ chọn) mã khuyến mãi → đặt lịch.
3. Xem **điểm thưởng / hạng** và **lịch sử** sau khi đơn hoàn tất.

**Trải nghiệm phía quản trị:** đăng nhập admin → vào **Bãi rửa** để order tại quầy / tính tiền, **Lịch đặt** để xác nhận hoặc tạo lịch cho khách, và **Khuyến mãi / Khách hàng / Dịch vụ** để quản lý.

> Mã khuyến mãi mẫu (seed): `WELCOME10`, `WEEKEND12` (mọi khách), `SILVER15`, `GOLD20`, `PLATINUM25` (theo hạng).

---

> Kế hoạch & phân công chi tiết: xem [PLAN.md](PLAN.md).
