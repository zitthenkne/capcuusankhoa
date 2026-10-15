# zitthenk học Cấp cứu Sản khoa — chương 6

- [x] Xác định chương, roots và ELOs Topic 46.
- [x] Đọc tài liệu, loại trùng SHA256/nội dung, kiểm kê phần thiếu OCR.
- [x] Đối chiếu thông số và thuốc với nguồn chính thống, đánh dấu khác biệt cũ–mới.
- [x] Biên soạn bài học theo chuỗi sinh lý → bệnh sinh → nhận diện → chẩn đoán → xử trí → OSCE.
- [x] Dựng HTML/CSS/JS không build: học từng bước, SVG tương tác, bài tập, trạm OSCE, tìm kiếm, tiến độ, hash.
- [x] Đối chiếu coverage từng mục với ELOs/bài giảng/rubric.
- [x] Kiểm thử browser desktop/mobile, storage/hash, mô phỏng, phản hồi tự kiểm tra, đề/đáp án, liên kết.
- [ ] Đóng gói và xuất bản private; bàn giao nguồn local.

## Phạm vi

ELOs Topic 46, năng lực 17–18: sốc mất máu, nhau tiền đạo, nhau bong non, vỡ tử cung, BHSS, dự phòng BHSS. TOLAC, sinh khó do vai và thuyên tắc ối là phần đọc thêm. Checklist app là công cụ tự luyện, không thay thế rubric thi thật.

## Kiến trúc

Tài liệu địa phương + guideline → dữ liệu bài học có source ID → app tĩnh → tiến độ localStorage. URL hash mang vị trí học, không mang tiến độ cá nhân; xuất/nhập JSON giúp chuyển tiến độ khi đổi thiết bị.

## Visual

Theo skill được người dùng chỉ định: sổ dán pastel, ink #2f2a3f, nền caro kem, hồng đào/mint/lavender, nút lớn, SVG có nhãn và mô tả. Flowchart cỡ doc-wide, tối đa 7 nút mỗi sơ đồ; cơ chế phức tạp chia thành nhiều bước. Dùng sơ đồ giải phẫu tối giản, ghi rõ mô phỏng giáo dục.
