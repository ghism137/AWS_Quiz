# AWS Quiz Cloud Application 🚀

Một ứng dụng SPA (Single Page Application) phong cách thiết kế cao cấp (Glassmorphism + Dark/Light Theme) hỗ trợ ôn luyện trắc nghiệm kiến thức Điện Toán Đám Mây và chứng chỉ **AWS Cloud Practitioner**. 

Web App được xây dựng với React và Vite, tích hợp hệ thống bộ đệm bộ nhớ thông minh (Local Storage) giúp tự động cộng dồn điểm, Streak và phân tích ghi chú câu làm sai hoàn toàn ở Client-side.

## 🌟 Tính Năng & Kiến Trúc Nổi Bật
- **Giao diện Kính Premium**: Animation mượt mà, bộ mã màu hiện đại tuỳ chỉnh được thông qua chế độ `☀️ Sáng / 🌙 Tối`.
- **Đa Bộ Câu Hỏi**: Hỗ trợ chuyển đổi nhanh (Hot-swap) giữa bộ Tiếng Việt (Điện toán Đám mây) và Tiếng Anh (AWS Practitioner). Mảng dữ liệu được Lazy Load (Dynamic Import) giúp ứng dụng lên hình chỉ trong chớp mắt.
- **Chế Độ Thi (Exam Mode)**: Tái lập môi trường áp lực cao bằng Countdown Timer có tích hợp thuật toán Absolute Deadline Timestamp - ngăn chặn hoàn toàn gian lận bằng cách Switch Tabs (Trình duyệt ngắt kết nối nền).
- **Security & Error Boundary**: An toàn trước tấn công XSS nhờ `DOMPurify`. Tự động thu gom lỗi Rendering với `react-error-boundary` mà không làm chết App. 
- **Dữ liệu Offline (Serverless)**: Mọi thao tác xử lý game engine (chấm điểm O(1), bộ nhớ tạm O(N)) diễn ra 100% trên trình duyệt.
- **Sao Lưu Cục Bộ (Backup Logs)**: Thể thức xuất Data bằng JSON Export/Import đảm bảo điểm số của bạn có thể được dịch chuyển qua lại giữa nhiều thiết bị.

## 🛠 Hướng Dẫn Sử Dụng & Setup

Ứng dụng không cần backend. Để phát triển hoặc chạy server local:

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi động Development Web Server tốc độ phân phối cực nhanh (HMR)
npm run dev

# 3. Build gói Bundle siêu nhẹ dùng cho Môi trường Cloud Deployment
npm run build
```

## ☁️ Gợi ý Nền tảng Deploy (Triển Khai Mạng)

Dự án là một **Stateless SPA** (Single Page Application, không yêu cầu Backend / Node.js phụ trợ để chạy). Vì thế, để tiết kiệm tối đa các bước config và đạt tốc độ kết nối lý tưởng, có hai giải pháp xuất sắc nhất bạn có thể tin dùng hiện nay:

### 1. Vercel (Khuyến nghị số 1 ⭐)
- **Điểm mạnh**: Kết nối hệ sinh thái React tuyệt đối mượt mà, hỗ trợ CI/CD cực nhanh (Auto-deploy khi đẩy code lên Github). Miễn phí toàn bộ đối với project phi thương mại.
- **Cách làm**: Đẩy repo thư mục hiện tại lên GitHub > Vào Vercel.com tạo dự án > Chọn import từ GitHub. Vercel sẽ tự biết đây là app Vite/React và Deploy nó trong vài chục giây. (Bạn nhớ tạo thêm file `vercel.json` chứa cấu hình điều hướng Route của React-Router là xong).

### 2. Cloudflare Pages (Khuyến nghị số 2)
- **Điểm mạnh**: Tận dụng cơ sở CDN vô đối của Cloudflare trên toàn cầu, kết nối siêu tốc tại bất cứ quốc gia nào (kể cả Việt Nam).
- **Cách làm**: Đăng nhập Cloudflare Pages > Import Github/Gitlab Repo > Framework preset chọn "Vite". (Không cấu hình lằng nhằng như AWS).

*(Dĩ nhiên, nếu bạn thực sự yêu thích quản trị Devops thủ công, bạn vẫn có thể ném thư mục `./dist` lên **AWS S3 + CloudFront** cấu hình tĩnh, nhưng việc này sẽ tốn nhiều nỗ lực set-up Route Redirect / Catch-all Rule hơn rất là nhiều)*.

## 📄 Lịch sử Phiên Bản
Đã được nâng cấp qua 3 Phase quan trọng: 
1. **Migration**: Từ dự án Vanilla JS thuần lên React Vite.
2. **Architecture Cleanup**: Tách Context, Clean Code và Routing vững chắc. 
3. **Enterprise Defense**: Fix race conditions, Timer Background Drift, XSS Shield (DOMPurify), O(1) Data-loop, Lazy module loaders và Boundaries.

*(Vui lòng đọc tham khảo `PROJECT_STRUCT.md` nếu bạn là developer hoặc LLM Agent muốn đóng góp sửa lỗi / thêm tính năng mới vào repo này).*
