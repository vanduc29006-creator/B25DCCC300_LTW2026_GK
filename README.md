# Danh bạ điện thoại — Đề DE5

Ứng dụng React quản lý danh bạ theo yêu cầu bài giữa kỳ Lập trình Web.

## Công nghệ
- Create React App
- React 18
- React Router DOM 6
- Axios
- CSS thuần, không dùng thư viện UI

## Cài đặt và chạy
```bash
npm install
npm start
```

## Kiểm tra bản build
```bash
npm run build
```

## Chức năng
- Trang chủ và thống kê số liên hệ, yêu thích, Gmail.
- Danh sách, tìm kiếm theo tên/số điện thoại, lọc theo nhóm.
- Đánh dấu/bỏ yêu thích và xóa liên hệ.
- Thêm liên hệ với kiểm tra dữ liệu đầu vào.
- Trang chi tiết và mô phỏng cuộc gọi có bộ đếm giây.
- Nạp dữ liệu từ `public/data/contacts.json` bằng Axios.
- Lưu dữ liệu trong `localStorage` với key `gk_contacts`.

## Routes
- `/` — Trang chủ
- `/contacts` — Danh sách
- `/contacts/new` — Thêm mới
- `/contacts/:id` — Chi tiết

## Lưu ý nộp bài
Tạo repository GitHub public với tên theo mẫu `MãSinhViên_LTW2026_GK`, rồi push nhánh `main`. Thực hiện ít nhất 3 commit có nội dung phản ánh các giai đoạn làm bài. Hãy tự chạy `npm run build` và kiểm tra ứng dụng trước khi nộp.
