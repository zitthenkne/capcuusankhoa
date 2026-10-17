# zitthenk học Cấp cứu Sản khoa

Web tĩnh học chương 6 (ELOs Topic 46 + giáo trình UMP). Mở `index.html` ở thư mục này hoặc `dist/index.html`; không cần cài đặt hay build.

## Cách học trên web
- **62 màn nhỏ, 10 chặng.** Mỗi màn một ý, vừa khít một màn hình: hình sinh lý + đồ thị ở trái, điều khiển + 3 ô ①②③ ở phải.
- **Mô phỏng nằm ngay trong từng bước.** 62 màn có 62 cảnh riêng (36 họ hình): đường cong mất máu/SI/phân độ sốc, ĐM xoắn bị cơ ép, nhau–hồ máu, TXA & DIC, nhau tiền đạo đo d mm, PAS, nhau bong non + CTG, vỡ tử cung, kẹt vai trên chậu, huyết động AFE… Mọi hình đổi theo thanh kéo/công tắc.
- **Ô ①②③ gắn vùng thật trên hình**; “▶ Tự chạy từng ý”.
- **Không tab con, không giấu kiến thức:** mỗi bài = 2 trang nối bằng **Tiếp** — ① 🔎 Hiểu + 📚 Y4 sâu + 📷 Hình thầy **cùng một trang** (hình đứng yên bên trái, đọc Y4 sâu cuộn ở cột phải, thẻ Y4 mở sẵn) → ② 🧠 Thử nhớ (trắc nghiệm, sai 2 lần mới lộ đáp án). Link: `#/step/<id>` và `#/step/<id>/nho`.
- **Mỗi đại lượng chỉ một điều khiển**, chú giải đồ thị bằng đoạn kẻ mẫu + tên đại lượng (không ghi “(đỏ)/(xanh)”).
- **Luyện OSCE từng bước:** 9 trạm từ đề nhớ lại (5 cấp cứu, 4 tư vấn). Mỗi trạm = đọc đề → vào trạm → nhận định → chẩn đoán → nguy cơ → xử trí → nói với bệnh nhân → đối chiếu; có đồng hồ 5′, ô tự nói, gợi ý + checklist tick theo rubric, tự chấm theo nhóm tiêu chí. Có trang “Học cách làm một trạm”.
- **Chốt chương** cuối mỗi chặng: thẻ lật tự kiểm. **📌 Tra nhanh đi trực**: số/ngưỡng hay dùng kèm link về bài.
- Tìm không dấu, tiến độ lưu trên trình duyệt (xuất/nhập JSON), phím ← → / Space, vuốt ngang, âm thanh tùy chọn.

## Cập nhật 10/2026 (dễ hiểu hơn)
- Mỗi **trang tí hon** = hình to + **👆 Việc của bạn** + (sau khi làm) **💡 À ra vậy: Thấy → Vì → Nên**. Nút **▶ Xem mẫu** cho bàn tay ma làm thử; **chạm chữ gạch chấm** (BHSS, NTĐ…) để xem nghĩa.
- **Không khóa trang**: bấm Tiếp/Trước, thanh bước hay chấm bước để qua lại thoải mái; làm xong trang thì hiện **✓ Xong** ở góc hình.
- Trang ôn **Hỏi nhanh Đúng/Sai**: thẻ lớn từng câu, chạm ✓/✗ → xem lý do ngay.
- Mỗi chương có trang **mở chương** (3 mục tiêu + lộ trình): `#/chuong/<id>`.

## Thư mục
- `dist/`: toàn bộ web và tài nguyên offline (kể cả font), là thư mục xuất bản.
  - `js/scenes-core.js` tiện ích vẽ (đồ thị, giải phẫu, nhãn) · `scenes-1..7.js` các họ hình · `specs.js` màn → cảnh + vùng + ghi chú · `app.js` trình phát màn/OSCE.
- `research/`: kiểm kê nguồn, SHA256, trích xuất, OCR, đối chiếu y khoa. Không xuất bản toàn bộ tài liệu gốc.
- `qa/`: `check.cjs` (dữ liệu), `scenes-check.cjs` (vẽ mọi cảnh ở mọi trạng thái, tới đích, chuỗi nhân–quả, ▶ Xem mẫu, ảnh không tràn khung), báo cáo.
- `.openai/hosting.json`: Site identity và cấu hình static, giữ nguyên project_id khi cập nhật.

## Kiểm tra
```
node qa/check.cjs
node qa/scenes-check.cjs
python -I "%USERPROFILE%\.claude\skills\so-tay-y-khoa\scripts\kiem-tra.py" dist <thư-mục-ảnh>
```

## Nguồn và giới hạn
Nguồn học phần ưu tiên bộ bài lẻ GoodNotes Chương 6 đã đối chiếu. Các điểm guideline ghi đúng phiên bản riêng. Hình/đường cong là **mô hình minh họa** bám bảng số trong bài (vd phân độ sốc I≈15%, II 20–25%, III 30–35%, IV 40–45%), không phải công thức chẩn đoán hay số đo cá thể. Ca OSCE là bản nhớ lại; phần gợi ý/checklist do sổ tay soạn từ bài học UMP + rubric, **không phải đáp án thi chính thức**; ca chưa có đáp án riêng được ghi rõ. Kỹ thuật thủ thuật cần luyện mô hình có giám sát.
