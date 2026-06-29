<!--
  GỢI Ý SỬ DỤNG
  - File này là bản thảo báo cáo (Markdown). Có thể mở bằng Word, hoặc xuất PDF bằng:
        pandoc BAOCAO.md -o BAOCAO.docx          (ra Word)
        pandoc BAOCAO.md -o BAOCAO.pdf           (ra PDF, cần cài LaTeX/wkhtmltopdf)
  - Các chỗ [ ... ] màu vàng là phần cần ĐIỀN: tên thành viên, MSSV, GVHD, tên môn.
  - Các dòng "(Hình x.x: ...)" là chú thích cho ảnh chụp màn hình / sơ đồ — chèn ảnh thật vào đúng vị trí.
-->

<div align="center">

TRƯỜNG ĐẠI HỌC GIAO THÔNG VẬN TẢI TP. HỒ CHÍ MINH

KHOA CÔNG NGHỆ THÔNG TIN

———

# BÁO CÁO ĐỒ ÁN MÔN HỌC

## TÊN ĐỀ TÀI: AUTOWASH PRO – HỆ THỐNG QUẢN LÝ BÃI RỬA XE THÔNG MINH

<br/>

**NGÀNH:** CÔNG NGHỆ THÔNG TIN
**CHUYÊN NGÀNH:** CÔNG NGHỆ THÔNG TIN

<br/>

| SV thực hiện | MSSV |
|---|---|
| [Họ và tên 1] | [MSSV] |
| [Họ và tên 2] | [MSSV] |
| [Họ và tên 3] | [MSSV] |

**Giảng viên hướng dẫn:** [Thầy/Cô …]

<br/>

Hồ Chí Minh, tháng [ ] năm 2026

</div>

---

# LỜI CẢM ƠN

Trong quá trình thực hiện đề tài *"AutoWash Pro – Hệ thống quản lý bãi rửa xe thông minh"*, nhóm em đã nhận được rất nhiều sự quan tâm, giúp đỡ và chỉ dẫn tận tình từ quý Thầy, Cô, bạn bè và gia đình. Nhờ đó, nhóm đã có thể hoàn thành tốt báo cáo này.

Trước hết, nhóm em xin bày tỏ lòng biết ơn sâu sắc đến **[Thầy/Cô …]**, người đã tận tình hướng dẫn, định hướng, góp ý chi tiết và luôn hỗ trợ nhóm trong suốt quá trình phân tích, thiết kế và xây dựng hệ thống.

Bên cạnh đó, nhóm em xin gửi lời cảm ơn đến các anh/chị và bạn bè đã đồng hành, chia sẻ tài liệu, đóng góp ý kiến và hỗ trợ kỹ thuật trong quá trình thử nghiệm chương trình và hoàn thiện báo cáo.

Mặc dù đã cố gắng hết sức, nhưng do thời gian và kinh nghiệm còn hạn chế, báo cáo không tránh khỏi những thiếu sót. Nhóm em rất mong nhận được những ý kiến đóng góp quý báu của Quý Thầy, Cô để đề tài được hoàn thiện hơn.

---

# MỤC LỤC

- **LỜI MỞ ĐẦU**
- **CHƯƠNG 1: TỔNG QUAN**
  - 1.1. Đặt vấn đề
  - 1.2. Mục tiêu của đề tài
  - 1.3. Đối tượng và phạm vi nghiên cứu
  - 1.4. Phương pháp thực hiện
  - 1.5. Cấu trúc báo cáo
- **CHƯƠNG 2: CƠ SỞ LÝ THUYẾT**
  - 2.1. Kiến trúc ứng dụng web hiện đại
  - 2.2. Công nghệ Backend – Java Spring Boot
  - 2.3. Bảo mật ứng dụng – JWT, BCrypt và phân quyền
  - 2.4. Công nghệ Frontend – Next.js / React
  - 2.5. Cơ sở dữ liệu quan hệ – MySQL
  - 2.6. Các khái niệm nghiệp vụ
- **CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG**
  - 3.1. Phân tích yêu cầu
  - 3.2. Tác nhân và biểu đồ Use Case
  - 3.3. Thiết kế kiến trúc hệ thống
  - 3.4. Thiết kế cơ sở dữ liệu
  - 3.5. Thiết kế API (REST)
  - 3.6. Thiết kế một số luồng nghiệp vụ chính
- **CHƯƠNG 4: TRIỂN KHAI VÀ KẾT QUẢ**
  - 4.1. Môi trường và công cụ
  - 4.2. Tổ chức mã nguồn
  - 4.3. Kết quả triển khai các chức năng
  - 4.4. Kiểm thử hệ thống
  - 4.5. Đánh giá
- **CHƯƠNG 5: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN**
- **TÀI LIỆU THAM KHẢO**

---

# DANH MỤC HÌNH

| Số hiệu | Tên hình |
|---|---|
| Hình 3.1 | Biểu đồ Use Case tổng quát của hệ thống |
| Hình 3.2 | Sơ đồ kiến trúc 3 tầng (Client – Server – Database) |
| Hình 3.3 | Sơ đồ quan hệ thực thể (ERD) |
| Hình 3.4 | Lưu đồ nghiệp vụ đặt lịch & áp dụng khuyến mãi |
| Hình 4.1 | Giao diện trang chủ |
| Hình 4.2 | Giao diện đăng nhập / đăng ký |
| Hình 4.3 | Dashboard khách hàng |
| Hình 4.4 | Giao diện đặt lịch rửa xe (chọn nhiều dịch vụ + mã KM) |
| Hình 4.5 | Dashboard quản trị – Tổng quan |
| Hình 4.6 | Màn hình Quản lý bãi rửa (10 bãi, order tại quầy) |
| Hình 4.7 | Màn hình Quản lý lịch đặt & Tạo lịch cho khách |
| Hình 4.8 | Màn hình Quản lý khuyến mãi (đối tượng & giới hạn lượt) |

# DANH MỤC BẢNG

| Số hiệu | Tên bảng |
|---|---|
| Bảng 2.1 | So sánh kiến trúc Monolithic và phân tách Frontend/Backend |
| Bảng 3.1 | Danh sách yêu cầu chức năng |
| Bảng 3.2 | Mô tả các tác nhân của hệ thống |
| Bảng 3.3 | Mô tả các bảng dữ liệu chính |
| Bảng 3.4 | Danh sách các API tiêu biểu |

# DANH MỤC TỪ VIẾT TẮT

| Viết tắt | Tiếng Anh | Tiếng Việt |
|---|---|---|
| API | Application Programming Interface | Giao diện lập trình ứng dụng |
| BCrypt | Blowfish-based hashing | Thuật toán băm mật khẩu |
| CRUD | Create – Read – Update – Delete | Thêm – Xem – Sửa – Xoá |
| CSDL | — | Cơ sở dữ liệu |
| DTO | Data Transfer Object | Đối tượng truyền dữ liệu |
| ERD | Entity Relationship Diagram | Sơ đồ quan hệ thực thể |
| JPA | Jakarta Persistence API | Chuẩn ánh xạ đối tượng – quan hệ |
| JWT | JSON Web Token | Mã thông báo xác thực dạng JSON |
| ORM | Object Relational Mapping | Ánh xạ đối tượng – quan hệ |
| POS | Point of Sale | Bán hàng tại quầy |
| RBAC | Role-Based Access Control | Phân quyền theo vai trò |
| REST | Representational State Transfer | Kiến trúc dịch vụ web |
| SPA | Single Page Application | Ứng dụng một trang |
| UI/UX | User Interface / User Experience | Giao diện / Trải nghiệm người dùng |

---

# LỜI MỞ ĐẦU

Trong những năm gần đây, nhu cầu sử dụng dịch vụ rửa và chăm sóc xe (ô tô, xe máy) tại Việt Nam tăng nhanh cùng với sự gia tăng của phương tiện cá nhân. Tuy nhiên, phần lớn các cơ sở rửa xe vẫn vận hành theo phương thức thủ công: ghi chép lịch đặt bằng sổ tay, sắp xếp xe vào các bãi (khoang) rửa dựa trên kinh nghiệm, tính tiền bằng máy tính cầm tay và hầu như không lưu lại lịch sử giao dịch hay dữ liệu khách hàng. Cách làm này dẫn đến nhiều bất cập: dễ nhầm lẫn khi đông khách, khó biết bãi nào đang trống để xếp xe, không thống kê được doanh thu, và không có công cụ để chăm sóc, giữ chân khách hàng thân thiết.

Xuất phát từ thực tế đó, nhóm em lựa chọn đề tài **"AutoWash Pro – Hệ thống quản lý bãi rửa xe thông minh"**. Đây là một ứng dụng web quản lý toàn diện hoạt động của một cơ sở rửa xe, bao gồm: quản lý **bãi rửa** (theo dõi bãi trống/đang rửa), tiếp nhận **lịch đặt** từ khách hàng, **order nhanh tại quầy** cho khách vãng lai, **tính tiền** theo nhiều dịch vụ, quản lý **khuyến mãi**, **tích điểm – hạng thành viên**, và thống kê **doanh thu**.

Hệ thống được xây dựng theo mô hình tách biệt Frontend – Backend hiện đại: **Backend** dùng Java Spring Boot cung cấp REST API, **Frontend** dùng Next.js/React cho giao diện người dùng, dữ liệu lưu trên **MySQL**. Mục tiêu là tạo ra một sản phẩm chạy được, có giao diện trực quan và thể hiện đầy đủ các kỹ thuật cốt lõi của phát triển ứng dụng web: xác thực – phân quyền, thiết kế CSDL quan hệ, thiết kế API và xử lý nghiệp vụ.

Báo cáo được trình bày gồm 5 chương, đi từ tổng quan, cơ sở lý thuyết, phân tích – thiết kế, triển khai – kết quả, đến kết luận và hướng phát triển.

---

# CHƯƠNG 1: TỔNG QUAN

## 1.1. Đặt vấn đề

Một cơ sở rửa xe thông thường có nhiều **bãi rửa** (khoang rửa) hoạt động song song. Bài toán quản lý đặt ra hằng ngày là:

- **Theo dõi trạng thái bãi:** bãi nào đang có xe, bãi nào trống để còn xếp xe tiếp theo.
- **Tiếp nhận khách:** khách có thể **đặt lịch trước** (qua ứng dụng) hoặc **ghé trực tiếp** (khách vãng lai). Cần một quy trình nhanh để ghi nhận thông tin và bắt đầu rửa.
- **Tính tiền:** một lần rửa có thể gồm **nhiều dịch vụ** (rửa cơ bản, đánh bóng, vệ sinh nội thất…); cần cộng tổng và áp dụng **mã khuyến mãi** nếu có.
- **Chăm sóc khách hàng:** lưu lịch sử, **tích điểm**, phân **hạng thành viên** và đưa ra **ưu đãi** phù hợp để giữ chân khách.
- **Báo cáo:** thống kê số lượt rửa, doanh thu để chủ cơ sở nắm tình hình kinh doanh.

Việc thực hiện thủ công các công việc trên vừa tốn nhân lực, vừa thiếu chính xác và không tận dụng được dữ liệu. Do đó, cần một hệ thống phần mềm giúp **số hoá** và **tự động hoá** quy trình vận hành.

## 1.2. Mục tiêu của đề tài

Đề tài hướng tới các mục tiêu cụ thể:

1. Xây dựng hệ thống quản lý bãi rửa xe theo mô hình web, gồm hai phía: **Khách hàng** và **Quản trị/Nhân viên**.
2. Cho phép khách hàng **đăng ký – đăng nhập**, quản lý **hồ sơ**, **xe**, **đặt lịch rửa** (chọn nhiều dịch vụ, áp mã khuyến mãi) và xem **lịch sử**, **điểm thưởng**.
3. Cho phép quản trị **quản lý bãi rửa** (trống/đang rửa, thêm/sửa/xoá bãi), **order nhanh tại quầy** cho khách vãng lai, **tính tiền & hoàn tất**, **tạo lịch cho khách**, **quản lý dịch vụ – khuyến mãi**, xem **lịch sử đơn hàng** và **doanh thu**.
4. Áp dụng đúng các kỹ thuật nền tảng: xác thực **JWT**, phân quyền **RBAC**, thiết kế **CSDL quan hệ** và **REST API**.
5. Sản phẩm chạy được, giao diện trực quan, có thể **demo** trực tiếp.

## 1.3. Đối tượng và phạm vi nghiên cứu

- **Đối tượng:** quy trình vận hành của một cơ sở rửa xe và cách số hoá quy trình đó bằng ứng dụng web.
- **Phạm vi:**
  - Tập trung vào nghiệp vụ cốt lõi: quản lý bãi rửa, lịch đặt, order tại quầy, dịch vụ, khuyến mãi, tích điểm, doanh thu.
  - Triển khai trên một máy chủ cục bộ (localhost / VPS) phục vụ mục đích học tập, demo.
  - **Không** đi sâu vào: cổng thanh toán trực tuyến thật, ứng dụng di động gốc, hay hệ thống phân tán quy mô lớn (đây là hướng phát triển ở Chương 5).

## 1.4. Phương pháp thực hiện

- **Khảo sát – phân tích:** tìm hiểu quy trình rửa xe thực tế, xác định yêu cầu chức năng và phi chức năng.
- **Thiết kế:** xây dựng biểu đồ Use Case, kiến trúc hệ thống, mô hình dữ liệu (ERD) và đặc tả API.
- **Lập trình:** phát triển theo từng tính năng (incremental), sử dụng Git để quản lý mã nguồn.
- **Kiểm thử:** kiểm thử từng API bằng công cụ dòng lệnh, kiểm thử luồng nghiệp vụ end-to-end trên cơ sở dữ liệu thử nghiệm tách biệt; đối chiếu kết quả với yêu cầu.

## 1.5. Cấu trúc báo cáo

- **Chương 1 – Tổng quan:** giới thiệu bối cảnh, mục tiêu, phạm vi.
- **Chương 2 – Cơ sở lý thuyết:** các công nghệ và khái niệm nền tảng.
- **Chương 3 – Phân tích & Thiết kế:** yêu cầu, use case, kiến trúc, CSDL, API.
- **Chương 4 – Triển khai & Kết quả:** môi trường, mã nguồn, các chức năng và kiểm thử.
- **Chương 5 – Kết luận & Hướng phát triển.**

---

# CHƯƠNG 2: CƠ SỞ LÝ THUYẾT

## 2.1. Kiến trúc ứng dụng web hiện đại

Hệ thống được xây dựng theo mô hình **client – server** với sự **tách biệt rõ ràng giữa Frontend và Backend**:

- **Frontend (client)** là một ứng dụng một trang (**SPA**) chạy trên trình duyệt, chịu trách nhiệm hiển thị giao diện và tương tác với người dùng.
- **Backend (server)** cung cấp các **REST API** trả về dữ liệu dạng **JSON**, xử lý nghiệp vụ và truy xuất cơ sở dữ liệu.
- Hai phía giao tiếp qua giao thức **HTTP/HTTPS**.

So với kiến trúc nguyên khối (monolithic) truyền thống – nơi máy chủ vừa xử lý logic vừa kết xuất giao diện (HTML) – mô hình tách biệt có nhiều ưu điểm:

**Bảng 2.1: So sánh kiến trúc Monolithic và tách Frontend/Backend**

| Tiêu chí | Monolithic (server render HTML) | Tách Frontend/Backend (SPA + REST API) |
|---|---|---|
| Trải nghiệm | Tải lại cả trang | Mượt, chỉ cập nhật phần thay đổi |
| Tái sử dụng | Khó | Cùng một API dùng cho web, mobile… |
| Phân công | Lẫn lộn | Tách biệt đội FE và BE |
| Mở rộng | Khó | Dễ scale từng phần |

## 2.2. Công nghệ Backend – Java Spring Boot

**Spring Boot** là nền tảng phát triển ứng dụng Java phổ biến, giúp khởi tạo nhanh ứng dụng với cấu hình tối thiểu. Các thành phần được sử dụng:

- **Spring Web (Spring MVC):** xây dựng REST API thông qua các `@RestController`. Mỗi controller ánh xạ một nhóm endpoint (ví dụ `/api/bookings`, `/api/admin/bays`).
- **Spring Data JPA + Hibernate (ORM):** ánh xạ các lớp Java (**Entity**) sang bảng trong CSDL. Lập trình viên thao tác trên đối tượng thay vì viết SQL thủ công; Hibernate sinh câu lệnh SQL tương ứng.
- **Spring Security:** xử lý xác thực (authentication) và phân quyền (authorization) cho các endpoint.
- **Bean Validation:** kiểm tra ràng buộc dữ liệu đầu vào (ví dụ `@NotBlank`, `@NotNull`, `@Email`) trước khi xử lý.

Mô hình phân tầng ở Backend:

```
Controller (nhận request)  →  Service (xử lý nghiệp vụ)  →  Repository (truy xuất CSDL)  →  Entity ↔ Bảng
        ↑ DTO (Request/Response)
```

- **Entity:** đại diện cho một bảng (User, Customer, Booking…).
- **Repository:** giao diện kế thừa `JpaRepository`, cung cấp sẵn các thao tác CRUD và truy vấn.
- **Service:** chứa logic nghiệp vụ (kiểm tra hợp lệ, tính tiền, áp khuyến mãi…).
- **DTO (Data Transfer Object):** đối tượng truyền dữ liệu giữa client và server, giúp tách biệt cấu trúc bên trong (Entity) khỏi dữ liệu công khai.

## 2.3. Bảo mật ứng dụng – JWT, BCrypt và phân quyền

- **Băm mật khẩu (BCrypt):** mật khẩu người dùng **không bao giờ lưu ở dạng văn bản thường**. Hệ thống dùng thuật toán băm một chiều **BCrypt** (có "muối" – salt ngẫu nhiên) để lưu chuỗi băm. Khi đăng nhập, mật khẩu nhập vào được băm và so sánh với chuỗi đã lưu.
- **Xác thực bằng JWT:** sau khi đăng nhập thành công, server cấp một **JSON Web Token** chứa thông tin định danh và vai trò người dùng, được **ký số** bằng khoá bí mật. Token được lưu ở phía client và đính kèm trong tiêu đề `Authorization: Bearer <token>` ở mỗi request. Server xác minh chữ ký để biết người gọi là ai mà **không cần lưu phiên (stateless)**.
- **Phân quyền theo vai trò (RBAC):** mỗi tài khoản có một vai trò: `CUSTOMER` (khách hàng), `STAFF` (nhân viên), `ADMIN` (quản trị). Spring Security cấu hình: nhóm `/api/auth/**` cho phép truy cập tự do; nhóm `/api/admin/**` chỉ dành cho `ADMIN`/`STAFF`; các endpoint còn lại yêu cầu đã đăng nhập.

## 2.4. Công nghệ Frontend – Next.js / React

- **React:** thư viện xây dựng giao diện theo **component** (thành phần) – mỗi phần giao diện là một khối tái sử dụng được, có trạng thái (state) riêng.
- **Next.js (App Router):** framework dựa trên React, hỗ trợ định tuyến theo thư mục, tối ưu hiệu năng và tổ chức dự án rõ ràng.
- **TypeScript:** bổ sung kiểu tĩnh cho JavaScript, giúp phát hiện lỗi sớm khi biên dịch.
- **Tailwind CSS:** framework CSS theo tiện ích (utility-first), giúp dựng giao diện nhanh và nhất quán. Giao diện hệ thống theo tông **tối (dark theme)** sang trọng.
- **Axios:** thư viện gọi HTTP để giao tiếp với REST API; được cấu hình tự động đính kèm JWT.

## 2.5. Cơ sở dữ liệu quan hệ – MySQL

**MySQL** là hệ quản trị CSDL quan hệ mã nguồn mở phổ biến. Dữ liệu được tổ chức thành các **bảng** có **khoá chính** và liên kết với nhau qua **khoá ngoại**, đảm bảo **toàn vẹn tham chiếu**. Hệ thống sử dụng bộ ký tự `utf8mb4` để lưu tốt tiếng Việt có dấu. Hibernate đảm nhiệm việc ánh xạ Entity ↔ bảng; sơ đồ quan hệ chi tiết được trình bày ở Chương 3.

## 2.6. Các khái niệm nghiệp vụ

- **Bãi rửa (Wash Bay):** một khoang vật lý để rửa xe; có hai trạng thái: **Trống (FREE)** hoặc **Đang rửa (OCCUPIED)**. Khi đang rửa, bãi gắn với một đơn hàng cụ thể.
- **Lịch đặt / Đơn hàng (Booking):** một yêu cầu rửa xe, có thể đến từ khách đăng ký (đặt trước) hoặc khách vãng lai (tạo trực tiếp tại bãi). Vòng đời trạng thái: **Chờ xác nhận → Đã xác nhận → Đang rửa → Hoàn tất** (hoặc **Đã huỷ**).
- **Khách vãng lai (Walk-in) & POS:** khách ghé trực tiếp, nhân viên nhập nhanh thông tin (tên, biển số) và bắt đầu rửa ngay tại một bãi trống – tương tự thao tác **bán hàng tại quầy (POS)**.
- **Dịch vụ (Service):** gói rửa hoặc dịch vụ thêm, có giá và thời lượng. Một đơn có thể gồm **nhiều dịch vụ**, tổng tiền là tổng giá các dịch vụ.
- **Khuyến mãi (Promotion):** mã giảm giá theo phần trăm, có thời hạn, **giới hạn lượt dùng** và **đối tượng áp dụng** (mọi khách / theo hạng / theo khách hàng cụ thể).
- **Tích điểm & Hạng thành viên (Loyalty):** mỗi lần rửa hoàn tất, khách tích luỹ điểm và chi tiêu; dựa trên tổng chi tiêu, khách được xếp **hạng** (Member, Silver, Gold, Platinum) với ưu đãi tăng dần.

---

# CHƯƠNG 3: PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG

## 3.1. Phân tích yêu cầu

### 3.1.1. Yêu cầu chức năng

**Bảng 3.1: Danh sách yêu cầu chức năng**

| Nhóm | Mã | Chức năng |
|---|---|---|
| Khách hàng | CF-01 | Đăng ký, đăng nhập, đăng xuất |
| | CF-02 | Quản lý hồ sơ cá nhân (họ tên, SĐT, email, ngày sinh, giới tính, địa chỉ) |
| | CF-03 | Quản lý xe (thêm/sửa/xoá; chọn loại ô tô/xe máy, hãng, dòng) |
| | CF-04 | Đặt lịch rửa (chọn xe, **nhiều dịch vụ**, thời gian, mã khuyến mãi) |
| | CF-05 | Xem danh sách lịch đang chờ; huỷ; xác nhận đã rửa xong |
| | CF-06 | Xem **lịch sử** rửa xe và **chi tiết** từng đơn |
| | CF-07 | Xem **điểm thưởng, hạng thành viên**; danh sách **khuyến mãi** phù hợp |
| Quản trị | AF-01 | Đăng nhập quản trị |
| | AF-02 | Xem **tổng quan**: số khách, số đơn, đơn hoàn tất, đơn chờ, doanh thu |
| | AF-03 | **Quản lý bãi rửa**: xem trạng thái 10 bãi; thêm/đổi tên/xoá bãi |
| | AF-04 | **Order tại quầy** cho khách vãng lai (tìm khách đã đăng ký hoặc nhập tay; nhiều dịch vụ; mã KM) |
| | AF-05 | Xem **chi tiết bãi** và **tính tiền & hoàn tất** đơn đang rửa |
| | AF-06 | **Quản lý lịch đặt**: xác nhận/huỷ; xem chi tiết; **tạo lịch cho khách** |
| | AF-07 | **Lịch sử đơn hàng** (hoàn tất/huỷ) + thống kê doanh thu |
| | AF-08 | **Quản lý dịch vụ** (CRUD) |
| | AF-09 | **Quản lý khuyến mãi** (CRUD; đối tượng ALL/Hạng/Khách; giới hạn lượt) |

### 3.1.2. Yêu cầu phi chức năng

- **Bảo mật:** mật khẩu băm BCrypt; xác thực JWT; phân quyền theo vai trò; secrets (khoá JWT, mật khẩu CSDL) tách ra biến môi trường.
- **Hiệu năng & trải nghiệm:** giao diện SPA phản hồi nhanh; thông báo lỗi rõ ràng (toast) thay cho hộp thoại mặc định.
- **Tính đúng đắn dữ liệu:** ràng buộc khoá ngoại; kiểm tra hợp lệ đầu vào; thao tác cập nhật lượt khuyến mãi an toàn khi truy cập đồng thời.
- **Khả năng bảo trì:** mã nguồn phân tầng rõ ràng; hỗ trợ tiếng Việt (utf8mb4).

## 3.2. Tác nhân và biểu đồ Use Case

**Bảng 3.2: Mô tả các tác nhân**

| Tác nhân | Mô tả |
|---|---|
| Khách hàng (Customer) | Người sử dụng dịch vụ rửa xe: đăng ký, đặt lịch, theo dõi điểm thưởng. |
| Nhân viên/Quản trị (Staff/Admin) | Người vận hành cơ sở: quản lý bãi, tiếp nhận khách, tính tiền, quản lý dịch vụ – khuyến mãi, xem báo cáo. |

*(Hình 3.1: Biểu đồ Use Case tổng quát – Khách hàng với các use case CF-01…CF-07; Quản trị với AF-01…AF-09.)*

## 3.3. Thiết kế kiến trúc hệ thống

Hệ thống theo **kiến trúc 3 tầng**:

```
[ Trình duyệt – Next.js/React (SPA) ]
                 │  HTTP/JSON (kèm JWT)
                 ▼
[ Spring Boot REST API ]
   Controller → Service → Repository (Spring Data JPA)
                 │  JDBC
                 ▼
[ Cơ sở dữ liệu MySQL ]
```

*(Hình 3.2: Sơ đồ kiến trúc 3 tầng.)*

- **Tầng trình bày (Presentation):** ứng dụng Next.js; lưu JWT và thông tin người dùng ở `localStorage`.
- **Tầng nghiệp vụ (Application):** Spring Boot; xử lý xác thực, phân quyền, các quy tắc nghiệp vụ.
- **Tầng dữ liệu (Data):** MySQL lưu trữ lâu dài.

## 3.4. Thiết kế cơ sở dữ liệu

### 3.4.1. Sơ đồ quan hệ thực thể (ERD)

Các thực thể chính và quan hệ:

- `users` 1–1 `customers` (mỗi khách hàng gắn với một tài khoản).
- `customers` 1–n `vehicles`, 1–n `bookings`, 1–1 `loyalty_accounts`.
- `loyalty_accounts` 1–n `point_transactions`.
- `bookings` n–1 `services` (dịch vụ chính), n–n `services` qua `booking_extra_services` (dịch vụ thêm), n–1 `promotions` (mã đã áp dụng, nếu có).
- `wash_bays` n–1 `bookings` (đơn đang rửa tại bãi).
- `promotions` n–n `customers` qua `promotion_customers` (khi áp dụng theo khách hàng cụ thể).

*(Hình 3.3: Sơ đồ ERD đầy đủ.)*

### 3.4.2. Mô tả các bảng

**Bảng 3.3: Mô tả các bảng dữ liệu chính**

**Bảng `users` – tài khoản đăng nhập**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT (PK) | Khoá chính |
| username | VARCHAR(100), unique | Tên đăng nhập (SĐT) |
| password_hash | VARCHAR(255) | Mật khẩu đã băm BCrypt |
| role | ENUM(ADMIN, CUSTOMER, STAFF) | Vai trò |
| enabled | BIT(1) | Trạng thái kích hoạt |
| created_at | DATETIME | Thời điểm tạo |

**Bảng `customers` – hồ sơ khách hàng**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT (PK) | Khoá chính |
| user_id | BIGINT (FK→users) | Tài khoản tương ứng |
| full_name | VARCHAR(120) | Họ tên |
| phone | VARCHAR(20), unique | Số điện thoại |
| email | VARCHAR(120) | Email |
| date_of_birth | DATE | Ngày sinh |
| gender | VARCHAR(10) | Giới tính |
| address | VARCHAR(255) | Địa chỉ |

**Bảng `vehicles` – xe của khách**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT (PK) | Khoá chính |
| customer_id | BIGINT (FK→customers) | Chủ xe |
| license_plate | VARCHAR(20) | Biển số |
| category | VARCHAR(20) | Loại: Ô tô / Xe máy |
| brand | VARCHAR(50) | Hãng xe |
| type | VARCHAR(50) | Dòng xe |

**Bảng `services` – danh mục dịch vụ**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT (PK) | Khoá chính |
| name | VARCHAR(120) | Tên dịch vụ |
| category | VARCHAR(20) | Nhóm (gói rửa / dịch vụ thêm) |
| price | BIGINT | Giá (VND) |
| duration_min | INT | Thời lượng (phút) |
| active | BIT(1) | Đang kinh doanh hay không |

**Bảng `bookings` – lịch đặt / đơn hàng**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT (PK) | Khoá chính |
| customer_id | BIGINT (FK, null) | Khách có tài khoản (null nếu vãng lai) |
| vehicle_id | BIGINT (FK, null) | Xe đã đăng ký (null nếu vãng lai) |
| service_id | BIGINT (FK→services) | Dịch vụ chính |
| scheduled_time | DATETIME | Thời gian hẹn / bắt đầu |
| status | ENUM | PENDING/CONFIRMED/IN_PROGRESS/DONE/CANCELLED |
| price | BIGINT | Tổng tiền sau giảm |
| original_price | BIGINT (null) | Tổng tiền trước giảm |
| promotion_id | BIGINT (FK, null) | Mã KM đã áp dụng |
| note | VARCHAR(255) | Ghi chú |
| walkin_name / walkin_phone / walkin_plate | VARCHAR | Thông tin khách vãng lai |
| created_at | DATETIME | Thời điểm tạo |

**Bảng `booking_extra_services` – dịch vụ thêm của một đơn** (booking_id, service_id) – khoá ngoại tới `bookings` và `services`.

**Bảng `wash_bays` – bãi rửa**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT (PK) | Khoá chính |
| name | VARCHAR(50) | Tên bãi (Bãi 1…Bãi 10) |
| status | ENUM(FREE, OCCUPIED) | Trạng thái |
| current_booking_id | BIGINT (FK, null) | Đơn đang rửa tại bãi |

**Bảng `promotions` – khuyến mãi**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT (PK) | Khoá chính |
| code | VARCHAR(40), unique | Mã khuyến mãi |
| name / description | VARCHAR | Tên / mô tả |
| discount_percent | INT | Phần trăm giảm (1–100) |
| target_type | ENUM(ALL, TIER, USER) | Đối tượng áp dụng |
| min_tier | ENUM (null) | Hạng tối thiểu (khi TIER) |
| usage_limit | INT (null) | Giới hạn lượt dùng (null = không giới hạn) |
| usage_count | INT | Số lượt đã dùng |
| start_date / end_date | DATE | Thời gian hiệu lực |
| active | BIT(1) | Đang chạy hay không |

**Bảng `promotion_customers`** (promotion_id, customer_id) – danh sách khách được áp dụng (khi `target_type = USER`).

**Bảng `loyalty_accounts` – tài khoản điểm thưởng**

| Cột | Kiểu | Mô tả |
|---|---|---|
| id | BIGINT (PK) | Khoá chính |
| customer_id | BIGINT (FK, unique) | Khách hàng |
| tier | ENUM(MEMBER, SILVER, GOLD, PLATINUM) | Hạng |
| points_balance | INT | Điểm hiện có |
| lifetime_spend | BIGINT | Tổng chi tiêu tích luỹ |
| visit_count | INT | Số lần rửa |

**Bảng `point_transactions` – sổ điểm** (id, loyalty_account_id, type, points, description, created_at).

## 3.5. Thiết kế API (REST)

API tuân theo phong cách REST: dùng phương thức HTTP (GET/POST/PUT/PATCH/DELETE), dữ liệu JSON, mã trạng thái chuẩn (200, 204, 400, 401, 403…).

**Bảng 3.4: Một số API tiêu biểu**

| Phương thức | Đường dẫn | Chức năng | Quyền |
|---|---|---|---|
| POST | /api/auth/register | Đăng ký | Công khai |
| POST | /api/auth/login | Đăng nhập, cấp JWT | Công khai |
| GET/POST/PUT/DELETE | /api/vehicles | Quản lý xe | Khách |
| GET | /api/services | Danh sách dịch vụ | Đã đăng nhập |
| GET/POST | /api/bookings | Xem / tạo lịch đặt | Khách |
| PUT | /api/bookings/{id}/complete · /cancel | Hoàn tất / huỷ | Khách |
| GET | /api/promotions | KM phù hợp với khách | Khách |
| POST | /api/promotions/apply | Xem trước giảm giá theo mã | Khách |
| GET | /api/admin/overview | Số liệu tổng quan | Admin |
| GET/POST/PATCH/DELETE | /api/admin/bays | Quản lý bãi | Admin |
| POST | /api/admin/bays/{id}/order | Order khách vãng lai | Admin |
| POST | /api/admin/bays/{id}/assign · /complete | Xếp xe / tính tiền | Admin |
| GET | /api/admin/bookings · /history | Lịch đặt / lịch sử | Admin |
| POST | /api/admin/bookings | Tạo lịch cho khách | Admin |
| GET/POST/PUT/DELETE | /api/admin/services | Quản lý dịch vụ | Admin |
| GET/POST/PUT/DELETE | /api/admin/promotions | Quản lý khuyến mãi | Admin |

## 3.6. Thiết kế một số luồng nghiệp vụ chính

### 3.6.1. Luồng đặt lịch & áp dụng khuyến mãi (khách hàng)

1. Khách chọn xe, **chọn một hoặc nhiều dịch vụ**, thời gian.
2. (Tuỳ chọn) nhập **mã khuyến mãi** → hệ thống kiểm tra (còn hạn, còn lượt, đúng đối tượng theo **hạng** hoặc **danh sách khách**) và trả về **xem trước** số tiền giảm.
3. Khi xác nhận, Backend tính **tổng = tổng giá các dịch vụ**, áp giảm giá, **tăng lượt dùng mã một cách nguyên tử** (chống tranh chấp khi nhiều người dùng cùng lúc), lưu đơn ở trạng thái **Chờ xác nhận**.

*(Hình 3.4: Lưu đồ nghiệp vụ đặt lịch & áp dụng khuyến mãi.)*

### 3.6.2. Luồng order tại quầy & tính tiền (quản trị)

1. Nhân viên chọn một **bãi trống** → "Bắt đầu".
2. Chọn nguồn khách: **xe đặt online đang chờ** (xếp vào bãi) hoặc **khách vãng lai** (tìm khách đã đăng ký theo SĐT/biển số/email để điền sẵn, hoặc nhập tay tên + biển số).
3. Chọn **nhiều dịch vụ**, (tuỳ chọn) áp **mã KM** dành cho khách vãng lai → hiển thị **tổng tiền**.
4. Xác nhận → đơn chuyển **Đang rửa**, bãi chuyển **Đang rửa**.
5. Khi xong, bấm vào bãi để xem **chi tiết** và **"Tính tiền & hoàn tất"** → đơn **Hoàn tất**, bãi **trống** trở lại, ghi nhận **doanh thu** và **tích điểm** (nếu là khách có tài khoản).

---

# CHƯƠNG 4: TRIỂN KHAI VÀ KẾT QUẢ

## 4.1. Môi trường và công cụ

| Thành phần | Công nghệ |
|---|---|
| Ngôn ngữ Backend | Java 17 |
| Framework Backend | Spring Boot 3.x (Spring Web, Spring Data JPA, Spring Security) |
| Xác thực | JWT (thư viện jjwt), BCrypt |
| Cơ sở dữ liệu | MySQL/MariaDB (XAMPP) |
| Ngôn ngữ Frontend | TypeScript |
| Framework Frontend | Next.js 14 (App Router), React, Tailwind CSS, Axios, lucide-react |
| Quản lý mã nguồn | Git / GitHub |
| Build | Maven (backend), npm/Next (frontend) |

## 4.2. Tổ chức mã nguồn

**Backend** (`com.autowashpro`):

```
controller/   – các REST Controller (Auth, Booking, Vehicle, AdminBay, AdminBooking, AdminPromotion…)
service/      – nghiệp vụ (BookingService, OperationsService, PromotionService, LoyaltyService…)
repository/   – giao diện JpaRepository
entity/       – các thực thể (User, Customer, Vehicle, Booking, WashBay, Promotion…)
dto/          – đối tượng Request/Response
config/       – SecurityConfig, DataInitializer (seed dữ liệu mẫu)
```

**Frontend** (`frontend/src`):

```
app/            – các trang (App Router): trang chủ, login, register,
                  dashboard/* (khách), admin/* (quản trị)
components/     – thành phần dùng chung (AdminShell, Topbar, Toast, ConfirmDialog…)
services/       – lớp gọi API (auth, booking, vehicle, promotion, adminOps…)
```

**Cơ sở dữ liệu:** tệp `database/schema.sql` mô tả đầy đủ các bảng + dữ liệu mẫu; ứng dụng cũng tự sinh/cập nhật bảng nhờ Hibernate.

## 4.3. Kết quả triển khai các chức năng

> Mỗi mục dưới đây tương ứng với một màn hình thực tế của sản phẩm; chèn ảnh chụp màn hình vào đúng vị trí chú thích.

### 4.3.1. Phía khách hàng

- **Trang chủ:** giới thiệu dịch vụ, thiết kế tông tối sang trọng. *(Hình 4.1)*
- **Đăng ký / Đăng nhập:** xác thực bằng SĐT + mật khẩu; sau khi đăng nhập nhận JWT. *(Hình 4.2)*
- **Dashboard khách hàng:** truy cập nhanh hồ sơ, xe, đặt lịch, lịch sử, điểm thưởng, khuyến mãi. *(Hình 4.3)*
- **Quản lý xe:** thêm/sửa/xoá; chọn loại (ô tô/xe máy), hãng, dòng dạng combobox.
- **Đặt lịch rửa xe:** chọn xe, **tích chọn nhiều dịch vụ**, thời gian, nhập **mã khuyến mãi** và xem **tổng tiền (tạm tính – giảm – thành tiền)**. *(Hình 4.4)*
- **Lịch sử rửa xe:** danh sách đơn đã hoàn tất/huỷ, thống kê số lần & tổng chi tiêu, **xem chi tiết** từng đơn (các dịch vụ, giá gốc/giảm, mã KM).
- **Điểm thưởng & Khuyến mãi:** xem hạng, điểm, và danh sách mã phù hợp với khách.

### 4.3.2. Phía quản trị

- **Đăng nhập quản trị** (mặc định `admin` / `admin123`).
- **Tổng quan:** số khách hàng, số đơn, đơn hoàn tất, đơn chờ, **doanh thu**. *(Hình 4.5)*
- **Quản lý bãi rửa:** lưới **10 bãi** hiển thị trống/đang rửa; **order tại quầy** (vãng lai, nhiều dịch vụ, mã KM); danh sách **lịch đặt sắp tới**; bấm vào bãi để xem **chi tiết & tính tiền**; **quản lý bãi** (thêm/đổi tên/xoá). *(Hình 4.6)*
- **Quản lý lịch đặt:** lọc theo trạng thái; xác nhận/huỷ; xem chi tiết; **"Tạo lịch"** cho khách đã đăng ký (tìm khách → chọn xe → nhiều dịch vụ → thời gian → mã KM). *(Hình 4.7)*
- **Lịch sử đơn hàng:** đơn hoàn tất/huỷ + thẻ thống kê (đơn hoàn tất, đơn huỷ, doanh thu).
- **Quản lý dịch vụ:** CRUD gói rửa/dịch vụ thêm.
- **Quản lý khuyến mãi:** CRUD; chọn **đối tượng** (Tất cả / Theo hạng / Theo khách cụ thể – tìm theo SĐT/biển số/email); đặt **giới hạn lượt dùng**; theo dõi số lượt đã dùng. *(Hình 4.8)*

## 4.4. Kiểm thử hệ thống

Nhóm tiến hành kiểm thử trên **cơ sở dữ liệu thử nghiệm tách biệt** (không ảnh hưởng dữ liệu demo) và kiểm tra tính khớp giữa lược đồ CSDL với mô hình thực thể.

| # | Kịch bản kiểm thử | Kết quả mong đợi | Kết quả |
|---|---|---|---|
| 1 | Đăng ký + đăng nhập khách hàng | Cấp JWT, vào được dashboard | Đạt |
| 2 | Đặt lịch với 2 dịch vụ | Tổng tiền = tổng giá; lưu đủ dịch vụ | Đạt |
| 3 | Đặt lịch + mã KM hợp lệ (ALL) | Giảm đúng %, lưu giá gốc & mã | Đạt |
| 4 | Áp mã theo hạng cho khách hạng thấp | Bị từ chối, thông báo rõ ràng | Đạt |
| 5 | Mã hết hạn / sai / hết lượt | Bị từ chối với đúng lý do | Đạt |
| 6 | Giới hạn lượt dùng khi đặt đồng thời | Không vượt quá giới hạn (cập nhật nguyên tử) | Đạt |
| 7 | Order vãng lai tại bãi + nhiều dịch vụ | Bãi chuyển "Đang rửa", tổng đúng | Đạt |
| 8 | Tính tiền & hoàn tất | Đơn "Hoàn tất", bãi trống, cộng doanh thu, tích điểm | Đạt |
| 9 | Admin tạo lịch cho khách | Đơn "Đã xác nhận" gắn đúng khách/xe | Đạt |
| 10 | Xoá bãi đang có xe | Bị chặn (HTTP 400) | Đạt |
| 11 | Phân quyền: khách gọi API admin | Bị từ chối (401/403) | Đạt |

## 4.5. Đánh giá

- **Ưu điểm:** đáp ứng đầy đủ các yêu cầu chức năng đề ra; kiến trúc tách biệt rõ ràng, dễ mở rộng; bảo mật theo chuẩn (JWT, BCrypt, RBAC); giao diện trực quan, hỗ trợ tiếng Việt; xử lý đúng các tình huống nghiệp vụ phức tạp (nhiều dịch vụ, khuyến mãi có điều kiện, order vãng lai).
- **Hạn chế:** chưa tích hợp thanh toán trực tuyến thật; thống kê/báo cáo còn ở mức cơ bản; chưa có thông báo thời gian thực; chưa có ứng dụng di động.

---

# CHƯƠNG 5: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

## 5.1. Kết luận

Qua quá trình thực hiện đề tài *"AutoWash Pro – Hệ thống quản lý bãi rửa xe thông minh"*, nhóm em đã đạt được những kết quả sau:

- **Về lý thuyết:** nắm vững mô hình ứng dụng web tách Frontend/Backend, kiến trúc phân tầng của Spring Boot, cơ chế xác thực JWT – phân quyền RBAC, ORM với JPA/Hibernate và thiết kế CSDL quan hệ.
- **Về thực nghiệm:** xây dựng thành công một hệ thống **chạy được**, gồm hai phía Khách hàng và Quản trị, bao phủ toàn bộ quy trình vận hành một cơ sở rửa xe: quản lý bãi, đặt lịch, order tại quầy, tính tiền theo nhiều dịch vụ, khuyến mãi có điều kiện, tích điểm – hạng thành viên và thống kê doanh thu.
- Hệ thống đã được **kiểm thử** trên nhiều kịch bản nghiệp vụ và cho kết quả đúng như thiết kế.

Đề tài giúp nhóm em rèn luyện kỹ năng phân tích – thiết kế – lập trình một ứng dụng web hoàn chỉnh, làm việc nhóm và quản lý mã nguồn bằng Git.

## 5.2. Hạn chế

1. Chưa tích hợp **cổng thanh toán trực tuyến** (VNPay, MoMo…); việc thanh toán hiện được ghi nhận thủ công.
2. **Báo cáo – thống kê** mới ở mức cơ bản, chưa có biểu đồ doanh thu theo thời gian, theo dịch vụ.
3. Chưa có **thông báo thời gian thực** (đẩy thông báo khi xe rửa xong, khi có lịch mới).
4. Mới có **giao diện web**, chưa có ứng dụng di động gốc cho khách hàng/nhân viên.

## 5.3. Hướng phát triển

1. **Tích hợp thanh toán trực tuyến** và xuất hoá đơn điện tử.
2. **Báo cáo nâng cao:** biểu đồ doanh thu theo ngày/tháng, dịch vụ bán chạy, hiệu suất từng bãi.
3. **Thông báo thời gian thực** qua WebSocket/Push Notification; nhắc lịch qua SMS/Email/Zalo.
4. **Ứng dụng di động** (React Native/Flutter) dùng chung REST API hiện có.
5. **Tối ưu vận hành:** gợi ý xếp bãi tự động, ước tính thời gian chờ; phân quyền chi tiết hơn giữa STAFF và ADMIN.

---

# TÀI LIỆU THAM KHẢO

1. VMware/Broadcom. *Spring Boot Reference Documentation.* https://docs.spring.io/spring-boot/
2. VMware/Broadcom. *Spring Security Reference.* https://docs.spring.io/spring-security/
3. Red Hat. *Hibernate ORM User Guide.* https://hibernate.org/orm/documentation/
4. Vercel. *Next.js Documentation.* https://nextjs.org/docs
5. Meta. *React Documentation.* https://react.dev/
6. Tailwind Labs. *Tailwind CSS Documentation.* https://tailwindcss.com/docs
7. Oracle. *MySQL 8.0 Reference Manual.* https://dev.mysql.com/doc/
8. Internet Engineering Task Force (IETF). *RFC 7519 – JSON Web Token (JWT).*
9. Nguyễn Quang Thịnh và cộng sự. *Mã nguồn dự án AutoWash Pro* (GitHub), 2026.
