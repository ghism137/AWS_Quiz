# ☁️ AWS & Điện Toán Đám Mây (DTDM) Quiz App

Chào mừng bạn đến với dự án **AWS & DTDM Quiz App**! Đây là một ứng dụng web tương tác, mượt mà được thiết kế để giúp bạn ôn tập và luyện thi chứng chỉ **AWS Cloud Practitioner** cũng như các kiến thức **Điện Toán Đám Mây (DTDM)** cơ bản.

## ✨ Tính Năng Nổi Bật

- **Không cần cài đặt:** Chạy hoàn toàn trên trình duyệt (chạy trực tiếp qua giao thức `file://`), không cần cài đặt server.
- **Nhiều Chế Độ Luyện Tập:**
  - 🎲 **Ngẫu Nhiên (Random):** Luyện tập trộn lẫn các câu hỏi từ mọi chủ đề.
  - 📂 **Theo Chủ Đề (By Topic):** Ôn tập tập trung vào từng mảng kiến thức cụ thể.
  - ❌ **Xem Lại Câu Sai (Review Wrong):** Chỉ luyện lại những câu bạn đã chọn sai trước đó.
  - 🎯 **Trắc Nghiệm Thi Thật (Exam Sim):** Thi trắc nghiệm mô phỏng giới hạn thời gian (65 câu).
- **Study Notes & Knowledge Map:** Giao diện thẻ học tập và sơ đồ tư duy, giúp nắm bắt sự liên kết giữa các dịch vụ và khái niệm.
- **Giao diện hiện đại (Modern UI):** Giao diện thân thiện, responsive (thích ng ứng trên nhiều thiết bị), theo dõi tiến độ (progress bar) và streak.

## 🚀 Hướng Dẫn Sử Dụng (Dành cho người ôn tập)

Bạn không cần cài đặt bất cứ công cụ nào để sử dụng.
1. Khởi động bằng cách mở thư mục dự án này trên máy tính của bạn.
2. Click đúp vào file **`index.html`** để mở ứng dụng web.
3. Ở màn hình chính, tại mục **Chọn Bộ Câu Hỏi**, hãy chọn kho dữ liệu bạn muốn luyện (Điện toán Đám mây hoặc AWS Cloud Practitioner).
4. Ứng dụng sẽ mở ngay lập tức trên trình duyệt web (Chrome, Edge, Safari...) với dữ liệu tương ứng.

> 🛠️ **Cập nhật Gần Đây:**  
> - Đã sửa lỗi không xuất hiện "Theo chủ đề", "Theo độ khó" ở các bộ giải đề.
> - Đã sửa lỗi kẹt ngân hàng câu hỏi, nay có thể nhấn chuyển qua lại giữa AWS/DTDM mà không bị kẹt 669 câu của AWS nữa.
> - Bấm vào logo góc trái phía trên (`AWS`) bất cứ khi nào để Back về trang Home (Chọn chức năng ban đầu).

> ⚠️ **Lỗi Đang Ghi Nhận (Known Issues):**  
> Việc parse logic `Multi-answer` (Câu hỏi có nhiều lựa chọn đúng) đối với bộ đề AWS Cloud Practitioner hiện đang bị khuyết phần chấm điểm chính xác/phân tích vì cấu trúc `options` của AWS khác biệt. Sẽ được xử lý trong các đợt refactor logic chấm điểm tiếp theo.

<hr />

## 🛠 Hướng Dẫn Dành Cho Maintainer (Dành cho nhà phát triển/Quản trị viên)

Nếu bạn có một bộ đề PDF mới và muốn đưa nó vào phần mềm:
1. Lưu đề thi (dạng PDF/Text) vào thư mục `data/`.
2. Chạy quá trình trích xuất tự động qua PowerShell/Python Scripts:
   - Bạn có thể chạy `extract_data.ps1`.
   - Hoặc chạy `python parse_dtdm.py` để phân tích file text và tự động chuyển đổi thành dĩ liệu chuẩn của app (`js/json`).
3. File dữ liệu (`.js`) sau khi render mới thành công sẽ tự động cập nhật ngân hàng câu hỏi. Bạn chỉ cần tải lại trang (F5) để thấy dữ liệu mới!

> ℹ️ **Lưu ý dành cho Lập trình viên:** Nếu bạn dự định phát triển thêm tính năng học cập nhật UI, vui lòng đọc file **`project_struct.md`** để hiểu rõ về cấu trúc nền tảng của dự án tránh gây lỗi tương thích.
