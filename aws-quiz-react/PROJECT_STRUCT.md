# Tài Liệu Cấu Trúc Dự Án Dành Cho AI Agent & Developer 🤖👨‍💻

Tài liệu này đóng vai trò là "Nhà Kho Kiến Thức" (Knowledge Base) **BẮT BUỘC PHẢI ĐỌC** dành cho các AI Coding Agents hoặc lập trình viên mới gia nhập dự án. Hãy nắm rõ các Constraint (Ràng buộc), luồng State và Convention trước khi đề xuất bất kì thay đổi nào trên mã nguồn.

---

## 🏗️ 1. Nguyên Lý Thiết Kế Cơ Bản (Project Philosophy)
- **Kiến trúc Cloud-Ready SPA**: Ứng dụng không có Backend Server (Stateless). Deploy dưới dạng Static Web Hosting (AWS S3, CloudFront, Amplify). Mọi API Call (nếu có sau này) phải được giữ độc lập không ảnh hưởng luồng Offline hiện tại.
- **Client-Side Storage**: Kết quả, tiến trình được ghi trực tiếp vào `localStorage`. Để tránh quá tải dung lượng và lỗi SSR, toàn bộ giao tiếp Storage đi qua wrapper `src/utils/storageService.js`.
- **CSS-First (No UI Frameworks)**: Giao diện sử dụng thuần Vanilla CSS được custom trong `index.css` (Glassmorphism & CSS Variables). **Nghiêm cấm** việc tự ý cài đặt thêm Tailwind CSS, Bootstrap hay Material UI làm phình to dự án trừ khi User chủ động yêu cầu.
- **Lazy Loading & Code Splitting**: Các phân hệ/page (StudyBoard, QuizPlayground) và file Database JSON tĩnh đều được tải động thông qua `React.lazy()` và `import()`. Điều này giữ cho File Bundle (index.js) đầu tiên siêu nhỏ gọn.

---

## 📂 2. Cấu Trúc Thư Mục Chi Tiết
```text
aws-quiz-react/
├── package.json                 # Cấu hình dependency hiện tại: Vite, React 18, React-Router-Dom, Lucide-React
├── vite.config.js               # Chuẩn Default Vite Build. Đầu ra tại /dist
├── src/
│   ├── main.jsx                 # Entry Point, nạp React.StrictMode, nạp Router BrowserRouter
│   ├── App.jsx                  # Điểm giao Routing (<Routes> chứa "/", "/play", "/study", "/result") và nạp Provider
│   ├── index.css                # CSS Variables (:root[data-theme]) điều khiển Dark/Light và Glassmorphism utilities
│   │
│   ├── components/              # --- [LỚP HIỂN THỊ UI] ---
│   │   ├── Header.jsx           # Global Header. Toggle Themes, xuất file Backup (JSON). 
│   │   ├── SetupBoard.jsx       # Trang Root ("/"). Thiết lập Quiz: Chọn Level/Topic/ExamMode => Điều phối sang "/play"
│   │   ├── QuizPlayground.jsx   # Trang "/play". Chứa màn hình Timer và Question View
│   │   ├── ResultBoard.jsx      # Trang "/result". In Điểm số, Streak và lưu list sai vào Storage
│   │   ├── StudyBoard.jsx       # Trang "/study". Đọc kiến thức từ study-data.json
│   │   └── ToggleSwitch.jsx     # UI Component dùng chung (tái sử dụng) cho nút gạt On/Off (như Exam Mode)
│   │
│   ├── context/                 # --- [LỚP ĐIỀU PHỐI DATA] ---
│   │   └── QuizContext.jsx      # Chứa `<QuizContext.Provider>`. Chỉ nạp 1 Engine duy nhất cho toàn app.
│   │
│   ├── hooks/                   # --- [LỚP XỬ LÝ LOGIC (BUSINESS LOGIC)] ---
│   │   └── useQuizEngine.js     # Trái tim của App. Tính điểm tổng, Random/Shuffle, Lưu Log. 
│   │
│   ├── data/                    # --- [LỚP CƠ SỞ DỮ LIỆU TĨNH] ---
│   │   ├── questions.json       # Bank ID: 'aws'
│   │   ├── dtdm_questions.json  # Bank ID: 'dtdm'
│   │   └── study-data.json      # Study maps
│   │
│   └── utils/                   # --- [LỚP ÚT ÍCH] ---
│       ├── storageService.js    # Interface giao tiếp LocalStorage (safeGetItem, safeSetJSON...)
│       ├── fileBackup.js        # Logic xuất file Json đảm bảo SRP cho component chức năng
│       └── constants.js         # Lưu các Enums (Vd: QUIZ_MODES) khử triệt để Hard-coded Magic Strings
```

---

## 🔄 3. Cơ Chế Quản Lý State (Core Flow)

### A. Quiz Context & Memory Leak Prevention
**Ràng buộc Agent:** `QuizContext.jsx` giữ state `activeBank` (vd: `dtdm` hay `aws`). Khi `activeBank` thay đổi, `useQuizEngine` chứa `useEffect` quét qua sự thay đổi này để **tự xoá dọn State bộ câu hỏi cũ**, reset lại Timer, Index, và Score để đề phòng rò rỉ bộ nhớ (Memory Leak). **Không được Initialize 2 Engine chạy song song trong Context.**

### B. Pure Function & Side-Effects trong React
**Ràng buộc Agent:** Ở component `QuizPlayground.jsx` có xử lý đếm ngược (Timer). Phải tuân thủ nghiêm ngặt nguyên lý Cập nhật trạng thái (State Updates) của React:
- Gọi hàm `setTimeLeft` chỉ dùng để thực thi Logic nội tại (như `prev => prev - 1`).
- Các Side-Effect như gọi Router (`navigate('/result')`) hay Call API tuyệt đối **không** được nhét vào trong update-callback setState. Nó đã được tách ra một `useEffect` theo dõi biến `timeLeft === 0`.

### C. Quản Lý Ngân Hàng Câu Hỏi (Schema)
Nếu muốn mở rộng thêm ngân hàng câu hỏi mới (vd: Azure, GCP), file JSON cần cấu trúc tương tự:
```json
[
  {
    "id": "q1",
    "topic": "Compute",
    "level": "Cơ bản",
    "question": "Dịch vụ nào của AWS cung cấp máy chủ ảo?",
    "options": {
      "A": "Amazon S3",
      "B": "Amazon EC2"
    },
    "answer": ["B"],
    "explanation": "EC2 cung cấp Elastic Compute Cloud..."
  }
]
```
- Khóa `answer` bắt buộc là một Mảng `["A"]` hoặc `["A", "B", "C"]` (Multi-choice).
- Bổ sung import file này vào `QuizContext.jsx` và cập nhật logic ternary/switch-case để map `activeBank`.

---

## 🛠️ 4. Hướng Dẫn Nâng Cấp/Maintain (Dành Cho Agents)

Khi DEV yêu cầu bạn thêm code sửa hoặc bổ sung tính năng mới, hãy check kĩ checklist này:

1. **Hiệu suất (Performance check):**
   - Không được convert các mảng Data tĩnh (.json) ngược trở lại dạng module JavaScript nặng nề. Vite tối ưu File JSON nhẹ hơn hẳn.
   - Khi tìm kiếm / check đúng sai của mảng, ưu tiên O(N) short-circuit (vd dùng `Array.every()` hoặc `Array.some()`) thay vì `forEach()`.
2. **Persistence Data (Lưu trữ dữ liệu):**
   - Đừng dùng `localStorage.getItem` trực tiếp. Gọi `storageService.getItem()` (đã có catch Exception).
   - Data Key Rules: `${bankName}_score` và `${bankName}_wrongQ`. Giữ max 200 wrong questions để tránh Quota Limit 5MB. Đã có code handle ở `saveWrongData`.
3. **Thêm UI Layout Mới:**
   - Khi component yêu cầu route mởi (Vd: `/profile`), tạo Component trong folder `components/`. Import vào `App.jsx` thông qua `React.lazy` và bao bọc bằng tag `<Route>`.
   - Cố gắng chia nhỏ các khối UI phức tạp thành các Child Component (e.g. `ToggleSwitch.jsx`) để file logic chính không bị phân tâm theo nguyên lý Trách nhiệm Độc lập (SRP).
   - Tuyệt đối không hard-code các Magic Strings. Hãy đưa vào `constants.js`.
4. **UX & Error Handling (Luồng & Bắt lỗi):**
   - **XSS Prevention:** Nội dung đẩy thẳng vào HTML parser (như `dangerouslySetInnerHTML`) của React BẮT BUỘC phải quấn qua `DOMPurify.sanitize()` để phòng chống chèn lén Script độc hại.
   - **Không cản trở Thread:** KHÔNG sử dụng `window.alert()` hay `window.confirm()`. Hãy throw hoặc return object lỗi (`{success: false, error: "..."}`) ra cho Component tự hiển thị UI Toast/Chữ thông báo.
   - **Tránh Fallback:** Việc gọi dữ liệu số từ localStorage (hoặc API) luôn phải có lớp dự phòng ép kiểu (Ví dụ: kiểm tra `isNaN` sau khi `parseInt`).
   - Các Route rẽ nhánh lỗi sẽ được App Wrapper `<ErrorBoundary>` đón và xuất UI Fallback Crash thay vì Màn hình trắng tử thần (White Screen of Death).
5. **Thuật Toán và Flow:**
   - Tránh tối đa sử dụng Time.setInterval phụ thuộc vào State. Hãy tính **Time-Delta** bằng công thức `Deadline Absolute Timestamp - Date.now()` để giải quyết vấn đề Trình duyệt thắt cổ chai luồng (Throttle Timer) khi user mở Background Tabs.
   - Với những mảng dữ liệu đặc thù phải query/so sánh liên tục `allWrongQs`, hãy dùng dạng dữ liệu `new Set` chuẩn mực thay cho việc dùng mảng (`Array`) gọi Object`.includes()` (Chống O(N) Complexity).

Hãy làm việc thận trọng, tuân thủ nguyên tắc Clean Code và KISS (Keep It Simple, Stupid) khi duy trì hệ thống này.
