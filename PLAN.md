# zitthenk học cấp cứu sản khoa — chương 6

## Đã xong
- [x] Gom nguồn, loại trùng, đối chiếu y khoa (research/).
- [x] 62 màn học theo chuỗi sinh lý → bệnh sinh → nhận diện → chẩn đoán → xử trí; kiến thức Y4 đầy đủ cùng trang với hình (cột phải, mở sẵn) + trang 🧠 Thử nhớ nối bằng Tiếp.
- [x] **Làm lại giao diện 10/2026:** sổ dán pastel mềm cho bé (font Baloo 2 + Nunito offline, nút kẹo, linh vật Giọt), màn vừa khít 1 màn hình, bản đồ lộ trình A→E.
- [x] **Hình minh họa đúng bản chất:** 62 cảnh riêng = sơ đồ giải phẫu/sinh lý + đồ thị đổi theo điều khiển; mô phỏng nằm trong từng bước (bỏ trang Mô phỏng riêng; #/lab/* chuyển về bước tương ứng).
- [x] **OSCE dựng lại thành trạm từng bước** (hub, học cách làm trạm, 9 trạm, tự chấm theo nhóm tiêu chí).
- [x] Skill `so-tay-y-khoa` cập nhật luật hình/OSCE/kiểm tra (xem `~/.claude/skills/so-tay-y-khoa/references/`).

## Còn lại (vòng nâng cấp tiếp theo)
- [ ] Đánh bóng tiếp: đã sửa badge/nhãn chồng ở ~15 hình; còn kẹt vai, lộn tử cung, vỡ tử cung, Couvelaire cần vẽ kỹ hơn.
- [x] Chốt chương (lật thẻ tự kiểm, lật đủ mới sang chương sau) và 📌 Tra nhanh đi trực.
- [x] Màn mở chương `#/chuong/<id>` (3 mục tiêu + lộ trình trang).
- [ ] Rà lại 100% nội dung ELOs/bài giảng so với 62 màn (bảng phủ ở tab Nguồn).
- [ ] Đóng gói & xuất bản private (hỏi trước khi đăng).

## Nâng cấp UX 10/2026 (theo skill mới)
- [x] Mỗi trang tí hon: **👆 Việc của bạn** → làm xong mới mở **💡 À ra vậy = Thấy → Vì → Nên** (181 chuỗi trong `js/chains.js`) + ghi nhớ chi tiết (giữ 100% nội dung).
- [x] Thanh bước-hình-bước (✓ / số / 🧠) thay chấm; ▶ **Xem mẫu** (bàn tay ma làm đúng chuỗi thao tác ngắn nhất, `js/demo.js`); tay 👆 chỉ đúng chỗ cần làm.
- [x] Chú giải viết tắt (rê/chạm BHSS, NTĐ, PAS…); âm lật trang + công tắc; điện thoại: việc → hình → À ra vậy.
- [x] Sửa vị trí/kích thước hình & khoanh: dây rốn nối rốn bé, tử cung xuyên da, tay đối lực trên vệ, nhãn McRoberts, đường chỉ không chéo, tô màu theo người (không ô chữ nhật), ngồi dậy thật sự ngồi…
- [x] **Qua lại tự do**: Tiếp/Trước/thanh bước/chấm bước luôn bấm được (cả trang tí hon, chốt chương, OSCE); làm đạt đích → huy hiệu **✓ Xong** ở góc hình (bấm để tự đánh dấu/bỏ), lưu trong `state.beats`.
- [x] 16 trang Đúng/Sai → **Hỏi nhanh** (thẻ lớn từng câu + hình + lý do riêng + nhảy câu), có bản điện thoại riêng.
- [ ] 24 cặp trang liền nhau còn lặp kiểu thao tác (xem `WARN=1 node qa/scenes-check.cjs`) → đổi dần cho đa dạng; 9 trang hình chính đứng im.

## Quy ước hình
Mô hình định lượng chỉ là minh họa bám số trong bài (ghi “minh họa”); số guideline luôn kèm nguồn/phiên bản. Chi tiết quy tắc: skill `so-tay-y-khoa` → `references/hinh-minh-hoa.md`.
