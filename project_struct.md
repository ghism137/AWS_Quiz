# 🏗️ Cấu Trúc Dự Án (Project Structure)

Tài liệu này dành cho **Developers** và **AI Agents** để hiểu rõ quy chuẩn kiến trúc, luồng dữ liệu (data flow), và cách tổ chức các thư mục của dự án, nhằm mục đích bảo trì, mở rộng và phát triển tính năng mới một cách an toàn và dễ dàng.

## 📂 Sơ Đồ Tổ Chức (Directory Tree)

```text
C:\Users\Admin\AWS\
├── index.html            # Ứng dụng Quiz hợp nhất (chứa toàn bộ UI, CSS, và JS Logic)
├── README.md             # Hướng dẫn tổng quan dành cho người dùng 
├── project_struct.md     # Cấu trúc kỹ thuật dành cho nhóm phát triển (Dev & AI Agents)
│
├── data/                 # Thư mục rễ chứa dữ liệu tĩnh (Database Data)
│   ├── questions.js      # Dữ liệu ngân hàng câu hỏi AWS (Load qua biến global)
│   ├── dtdm_questions.js # Dữ liệu ngân hàng câu hỏi DTDM (Load qua biến global)
│   ├── study-data.js     # Dữ liệu nội dung của Study Notes & Knowledge Map
│   ├── *.json            # Dữ liệu backup dạng JSON gốc (Raw Data)
│   └── *.txt, *.pdf      # File thô được dùng để trích xuất ra câu hỏi
│
├── parse_dtdm.py         # AI-assistant / Python Script để parse câu hỏi DTDM từ file .txt -> file .js
├── parse_fast.py         # Python script thay thế xử lý parsing theo cách khác
├── gen_quiz.py           # Python script hỗ trợ format lại layout của câu hỏi
├── extract_data.ps1      # PowerShell Pipeline chạy tuần tự các scripts hỗ trợ tự động hóa
│
└── archive/              # Lưu trữ backup code cũ (Ví dụ: app liền một cục HTML trước khi refactor)
```

## ⚙️ Kiến Trúc Và Luồng Chạy (Architecture & Concept)

### 1. Kiến Trúc Frontend Không Phụ Thuộc (Zero-dependency Architecture)
- Ứng dụng là một trang **Web App Client-Side** hoàn thiện, dựa vào bộ ba `HTML / CSS / Vanilla JS`.
- KHÔNG CÓ framework thứ ba hay package manager (như npm/react/vue...) để giữ nhẹ nhất có thể.
  - **Quy tắc tuyệt đối (Core Rule): Xử lý Import dữ liệu mà không dùng ES Modules (`import/export`)**.
  - **Lí do**: Trình duyệt mặc định chặn hệ thống *CORS policy* cho module khi người dùng mở trang web trực tiếp qua click đúp `file://`.
  - **Hướng giải quyết**: Khối dữ liệu chứa trong thư mục `data/` khởi tạo dưới dạng biến toàn cục (VD: `const DTDM_Q = [...]`). Toàn bộ tính năng UX, Styling và Code logic được tích hợp thẳng vào file `index.html` duy nhất (Monolithic) đảm bảo tính ổn định cao nhất khi chạy offline.
  - Giao diện gọi hàm đọc các file `<script src="data/...js">`, sau đó ứng dụng sẽ linh hoạt switch bộ data tùy chọn của người dùng trong ô Select Option.

### 2. Pipeline Xử Lý Ngân Hàng Câu Hỏi (Data Crawling Flow)
- Quy trình cập nhật thêm câu hỏi được tự động hoá kết hợp giữa Python/AI Regex:
  1. **Nguồn Input**: Đề thi (thường là PDF lưu trong mục `data/`).
  2. **Trích xuất Text**: Biên dịch PDF thành `.txt` thông thường (hoặc dùng OCR nếu cần thiết).
  3. **Parse logic (Python scripts)**: Cấu trúc của đề text sẽ được tóm xuất bằng `re` (Regex) nhờ các scripts (như `parse_dtdm.py`). Script tự động nhận dạn câu hỏi, các option A, B, C, D, và chắt lọc đáp án đúng.
  4. **Output (JS định dạng)**: Các scripts sẽ tự động export thông tin trích chọn về định dạng JSON (vào file `*raw.json`) và string biến JS (vào file `dtdm_questions.js`).
  5. **Tích hợp giao diện**: Giao diện UI chỉ cần trỏ thẻ script src đến file `.js` vừa gen ra là có ngay hàng loạt câu hỏi cho kỳ thi.

## 🛠 Hướng Dẫn Phát Triển / Tích Hợp Thêm (Development Guidelines)

Để thêm hoặc sửa đổi tính năng, thành viên/AI Agent hãy tuân thủ nguyên tắc phân lô trách nhiệm:

1. **Sửa Giao Diện (UI/UX) / Cập Nhật Core Logic**:
   - Mọi tùy chỉnh hiển thị, animation CSS, HTML layout, hay event listener, logic thuật toán đều được lưu giữ tại một file duy nhất: `index.html`.
   - Tìm kiếm block đúng `<style>` cho CSS và `<script>` ở cuối file cho JS logic. Tách biệt rõ ràng nhưng gom chung một chỗ.

2. **Cập Nhật / Xóa sửa Dữ Liệu**:
   - Nếu lỗi một câu cụ thể -> Cầm file editor sử trực tiếp ở `data/questions.js`.
   - Nếu thêm một lô số lượng câu hỏi khổng lồ -> Xin hãy cập nhật lại `.txt` và chạy file `parse_*.py` để script lo hoàn chỉnh.

3. **Cho AI Agents**:
   - `Agent` khi được yêu cầu sửa lỗi Web, TUYỆT ĐỐI tôn trọng kiến trúc tách biệt (Không nhét tất cả style hay script vào lại HTML chính).
   - Khi `Agent` parse dữ liệu, hãy tuân thủ đúng Data Type (Interface) mảng JSON hiện có: `{ id: 1, topic: "String" | topics: ["String"], question: "String", options: ["A", "B", "C", "D"] | {"A": "...", ...}, correct | answer: "String" | ["String", ...], explanation: "String" }`.

## ⚠️ Lỗi Còn Tồn Đọng (Known Issues)

Hiện tại, hệ thống đã ghi nhận và mong đợi các `Agent` lưu ý những khiếm khuyết sau để có kế hoạch refactor/fix ở tương lai:
1. **Lỗi khi xử lý Quiz AWS (Trường hợp Multi-Answer):** Bộ nguồn tiếng Anh AWS Cloud Practitioner có một số tính chất dữ liệu không đồng nhất hoàn toàn (VD: Missing option key, multi-answer không chọn được chính xác hay xác thực chấm điểm). Sẽ phải viết script chuẩn hoá lại `data/questions.js`.
2. **Dữ liệu Missing:** Thiếu cấu trúc question/answer cho câu ở id `195` phần đề DTDM.
