# AWS Quiz Cloud Application 🚀

Một ứng dụng SPA (Single Page Application) phong cách thiết kế cao cấp (Glassmorphism + Dark/Light Theme) hỗ trợ ôn luyện trắc nghiệm kiến thức Điện Toán Đám Mây và chứng chỉ **AWS Cloud Practitioner**. 

Web App được xây dựng với React và Vite, tích hợp hệ thống bộ đệm bộ nhớ thông minh (Local Storage) giúp tự động cộng dồn điểm, Streak và phân tích ghi chú câu làm sai hoàn toàn ở Client-side.

## 🌟 Tính Năng Nổi Bật
- **Giao diện Kính Premium**: Animation mượt mà, bộ mã màu hiện đại tuỳ chỉnh được thông qua chế độ `☀️ Sáng / 🌙 Tối`.
- **Đa Bộ Câu Hỏi**: Hỗ trợ chuyển đổi nhanh (Hot-swap) giữa bộ Tiếng Việt (Điện toán Đám mây) và Tiếng Anh (AWS Practitioner).
- **Chế Độ Thi (Exam Mode)**: Tái lập môi trường áp lực cao bằng Countdown Timer tự động chốt bài và đẩy kết quả nếu hết giờ (Cấu hình tự động 1 phút/câu).
- **Review Câu Sai**: Theo dõi tiến độ cá nhân thông qua việc tự động lưu lại những định nghĩa/lỗi thường gặp giúp User rút kinh nghiệm sát sao.
- **Dữ liệu Offline (Serverless)**: Mọi thao tác xử lý game engine diễn ra hoàn toàn trên trình duyệt, không cần Internet để fetch dữ liệu từ Database.
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

## ☁️ Hướng Dẫn Deploy
Do kiến trúc 100% Stateless SPA, sau khi chạy `npm run build`, bạn chỉ việc Copy tệp tin thư mục `dist` và ném lên bất kì hạ tầng Static/CDN nào dưới đây:
- **AWS S3 Bucket** + **CloudFront** (Khuyến khích).
- **AWS Amplify Hosting**.
- **Vercel** / **Netlify** / **GitHub Pages**.

> **Lưu ý**: Đối với Storage Bucket (S3/Cloudfront), hãy trỏ mọi Error Document về `index.html` để React-Router làm nhiệm vụ bẫy (Catch-all) và chuyển hướng các đường link `/study`, `/play` chính xác.

## 📄 License & Maintainer
Đã được nâng cấp qua 2 Phase: (1) Migration JS to React, (2) Code Review Cleanup Architecture.
Vui lòng đọc file `PROJECT_STRUCT.md` nếu bạn là developer hoặc LLM Agent muốn đóng góp sửa lỗi / thêm tính năng mới vào repo này.
