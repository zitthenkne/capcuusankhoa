# zitthenk học cấp cứu sản khoa — chương 6

## Đã xong
- [x] Gom nguồn, loại trùng, đối chiếu y khoa (research/).
- [x] 62 màn học theo chuỗi sinh lý → bệnh sinh → nhận diện → chẩn đoán → xử trí; kiến thức Y4 đầy đủ cùng trang với hình (cột phải, mở sẵn) + trang 🧠 Thử nhớ nối bằng Tiếp.
- [x] **Làm lại giao diện 10/2026:** sổ dán pastel mềm cho bé (font Baloo 2 + Nunito offline, nút kẹo, linh vật Giọt), màn vừa khít 1 màn hình, bản đồ lộ trình A→E.
- [x] **Hình minh họa đúng bản chất:** 62 cảnh riêng = sơ đồ giải phẫu/sinh lý + đồ thị đổi theo điều khiển; mô phỏng nằm trong từng bước (bỏ trang Mô phỏng riêng; #/lab/* chuyển về bước tương ứng).
- [x] **OSCE dựng lại thành trạm từng bước** (hub, học cách làm trạm, 9 trạm, tự chấm theo nhóm tiêu chí).
- [x] Skill `so-tay-y-khoa` cập nhật luật hình/OSCE/kiểm tra (xem `~/.claude/skills/so-tay-y-khoa/references/`).

## Đã xong (Bộ 30 nâng cấp đột phá: Giữ trọn 181 trang tí hon, Nâng cấp đồ họa SVG & Chiều sâu First-Principles - 10/2026)
### I. Bảo tồn & Nâng cấp Trực quan tại chỗ (Không gộp trang, giữ 100% kiến thức & hiệu ứng):
- [x] **01. Bảo tồn tuyệt đối 181 trang tí hon nguyên bản:** Không gộp cơ học gây nhồi nhét khung hình 560x350; giữ trọn 100% kiến thức, từng câu giải thích "say" và chuyển động hoạt họa mượt mà.
- [x] **02. Bộ 4 Dynamic SVG Helpers mới (`dist/js/beats-core.js`):** `gauge()` (đồng hồ bán nguyệt kim quay), `ctg()` (lưới CTG tim thai & cơn gò), `balloon()` (bóng Bakri buồng tử cung), `pulseRhythm()` (sóng mạch co bóp theo tần số).
- [x] **03. Cơ chế Dự đoán → Thử → Giải thích 2 chiều (`ask`):** Tích hợp vào các trạm hiểm hóc trong `beats-cuoi.js`, `beats-vai.js` với câu hỏi phản xạ lâm sàng, phản hồi lập tức.
- [x] **04. Hệ thống liên kết 2 chiều Hình ↔ Mắt xích (`#hl-*`):** Hover hoặc xem mắt xích sẽ làm phát sáng đúng vùng giải phẫu tương ứng trên SVG.
- [x] **05. Hộp Cạm bẫy lâm sàng (`trap-box`):** Nhấn mạnh các sai lầm kinh điển dễ mất điểm OSCE hoặc gây nguy hiểm cho sản phụ.
- [x] **06. Hộp Ghi nhớ thực chiến (`clin-box`):** Đúc kết nguyên tắc vàng từ guideline WHO 2025 / FIGO / RCOG.

### II. Đồ họa Giải phẫu & Mô phỏng Lâm sàng Đột phá (Visual Art & Clinical Models):
- [x] **07. Máy theo dõi CTG tăng trương lực cơ bản & cơn co cường tính trong Bong nhau non (`bb-tl`):** Vẽ đồng thời sóng nhịp tim thai rơi muộn và trương lực cơ bản tử cung tăng vọt.
- [x] **08. Máy theo dõi CTG nhịp tim thai chậm sâu kéo dài do vỡ tử cung trong chuyển dạ (`bv-ctg`):** Trực quan hóa dấu hiệu sụp đổ tim thai xuất hiện sớm nhất trước tam chứng lâm sàng muộn.
- [x] **09. Tử cung gỗ Couvelaire bầm tím ngấm máu dưới thanh mạc (`bb-couv`):** Mô phỏng các mảng máu tụ tím đen dưới thanh mạc kèm nguyên tắc bảo tồn tử cung nếu co hồi tốt.
- [x] **10. Mô phỏng 3 mức độ lộn tử cung cấp tính kèm vòng thắt cổ tử cung (`bp-lon`):** Hố lõm sâu trên xương mu, mặt nội mạc phơi bày ở âm đạo và vòng thắt cổ tử cung siết nghẹt.
- [x] **11. Thủ thuật hoàn vị Johnson đẩy đáy tử cung về rốn (`bp-hoanvi`):** Hướng lực đẩy dọc trục chậu và nguyên tắc cấm tuyệt đối dùng thuốc co tử cung trước khi hoàn vị.
- [x] **12. Động lực học thủ thuật Rubin II xoay vai góc 45° (`bv-xoay2`):** Cung đo góc xoay đưa vai từ đường kính trước-sau sang đường kính chéo rộng hơn của eo trên.
- [x] **13. Thủ thuật Jacquemier hạ tay sau quét ngang qua ngực (`bv-tay`):** Trực quan hóa việc giảm đường kính lọt từ 12 cm xuống 9,5 cm (đường kính vai-nách) giúp vai trước trượt lọt.

### III. Chiều sâu Kiến thức First-Principles & Công cụ Lâm sàng tại giường (Toolbox):
- [x] **14. Phác đồ Truyền máu Khối lượng lớn (MTP 1:1:1):** 4 Hồng cầu lắng : 4 Huyết tương tươi : 1 Khối tiểu cầu gạn tách + Tranexamic acid + Canxi tĩnh mạch trong Tra cứu.
- [x] **15. Bản đồ 8 Lỗi cấm Tử thần (Fatal Error Red Lines):** 8 lỗi rớt ngay lập tức trong OSCE Cấp cứu Sản khoa (khám ngón tay khi nghi NTĐ, bolus oxytocin nhanh, tocolysis trong NBN...).
- [x] **16. Thước đo lượng máu mất trực quan tại giường bệnh:** Quy đổi gạc 10x10cm (60ml), gạc lớn (350ml), khay quả đậu (500ml), máu tràn ga giường (1000-1500ml).
- [x] **17. Cảnh báo Chống chỉ định đỏ của Thuốc cấp cứu:** Ergometrine (TSG), Carboprost (Hen), Bolus Oxytocin tĩnh mạch, Tocolysis (NBN).
- [x] **18. Bảng Tra cứu & Đối chiếu Song song (`#/sosanh` & phím `S`):** 4 ma trận đối chiếu lâm sàng kinh điển (NBN vs NTĐ, Vỡ tử cung vs Nứt sẹo, Đờ TC vs Chấn thương, Kẹt vai trước vs Kẹt vai sau).
- [x] **19. Bộ lọc danh mục tìm kiếm thông minh:** Chip lọc theo Thuốc & Dịch, Cạm bẫy lâm sàng, Kỹ năng OSCE, Cơ chế bệnh sinh.

### IV. Trải nghiệm Trực chiến & Luyện thi OSCE (OSCE Rigor & UX):
- [x] **20. Chế độ Ban đêm Y tế (Night-Duty Dark Mode):** Nút `🌙` trên topbar (`#night-toggle`) và phím `N` với bảng màu tối dịu mắt, độ tương phản cao cho ca trực đêm.
- [x] **21. Bảng kiểm OSCE và Xuất Clipboard (`#export-checklist-btn`):** Sao chép toàn bộ bảng rubric 10 điểm chuẩn bộ môn sang Clipboard chỉ bằng 1 chạm.
- [x] **22. Sổ ghi chú thực chiến cá nhân OSCE (`#osce-personal-note`):** Lưu tự động phản xạ và lưu ý của học viên theo từng trạm vào `localStorage`.
- [x] **23. Bảng câu hỏi vặn hiểm hóc của Giám khảo OSCE (Examiner Tough Questions):** Tích hợp vào màn thi thử 5 phút kèm câu trả lời mẫu chuẩn Y4 ĐHYD.
- [x] **24. Tình huống giao tiếp & phản ứng của Sản phụ (Patient Reactions & Empathy Quotes):** Câu nói lo sợ của sản phụ và lời giải thích trấn an thấu cảm của bác sĩ.
- [x] **25. Bộ đếm thời gian động từng mốc can thiệp (Golden Minute Clinical Timers):** Phân bổ nhịp trạm 5 phút chuẩn OSCE.
- [x] **26. Âm thanh tổng hợp Web Audio API (Synthesized SFX):** Chuông cảnh báo 1 phút cuối (`sound('bell')`) và tiếng cồng hết giờ 5 phút (`sound('gong')`) 100% offline.
- [x] **27. Thang điểm Rubric 10 điểm Bộ môn Sản:** Phân rã từng tiêu chí và tính điểm thời gian thực.
- [x] **28. Hệ thống phím tắt bàn phím toàn diện:** `Space` (tiếp/bấm giờ), `ArrowRight` (màn tiếp), `ArrowLeft` (màn trước), `N` (đổi night mode), `S` (mở đối chiếu), `/` (tìm kiếm).
- [x] **29. Điều hướng chính bổ sung tab `⚖️ Đối chiếu`:** Kết nối xuyên suốt trên topbar và `ALL_SCREENS`.
- [x] **30. Kiểm định tự động QA đạt 100% Tuyệt đối:** `qa/scenes-check.cjs` 62 màn · 36 loại cảnh · 335 trạng thái · 181 trang tí hon (1831 trạng thái) · 0 lỗi · 0 cảnh báo hình chính đứng im.

## Còn lại (xuất bản & bảo trì)
- [ ] Rà lại 100% nội dung ELOs/bài giảng so với 62 màn (bảng phủ ở tab Nguồn).
- [ ] Đóng gói & xuất bản private (hỏi trước khi đăng).

## Quy ước hình
Mô hình định lượng chỉ là minh họa bám số trong bài (ghi “minh họa”); số guideline luôn kèm nguồn/phiên bản. Chi tiết quy tắc: skill `so-tay-y-khoa` → `references/hinh-minh-hoa.md`.
