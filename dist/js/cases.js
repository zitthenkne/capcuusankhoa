/* Ca lấy từ tài liệu người dùng cung cấp; nguồn và đáp án được phân loại theo chứng cứ trong tệp. */
window.CASES_NOTE = "Chỉ sử dụng các tình huống OSCE đã đọc được trong tài liệu người dùng cung cấp; không tạo đề hoặc lựa chọn trắc nghiệm mới. Các bản được gắn “Đề nhớ lại” vì có lời kể/biên soạn của sinh viên; verified chỉ xác nhận đã đọc nguồn, không xác nhận đây là phiếu đề hoặc đáp án chính thức. Giữ dữ kiện và câu hỏi có trong nguồn, kể cả chỗ thiếu/mâu thuẫn được ghi chú. Đáp án chỉ hiển thị nếu đã thấy lời trả lời trong tài liệu; không có thì để trống, không tự giải thay. Các câu “Thầy giải” vẫn được ghi là đáp án tham khảo SV do chưa có chứng cứ độc lập về tác giả. Đồng hồ 5 phút là chế độ luyện tập, không phải thời lượng đề gốc. Rubric NBN gốc bên dưới là tài liệu riêng, không gán tự động cho mọi ca NBN.";

window.OFFICIAL_RUBRIC = {
  title: 'Rubric gốc: Nhau bong non',
  source: 'RUBRIC.pdf, trang 6 — đối chiếu trực tiếp ảnh trang gốc',
  context: 'Bảng này thuộc một trạm nhau bong non có CTG đe dọa thai nghiêm trọng, cần mổ lấy thai khẩn. Không áp dụng máy móc yêu cầu mổ khẩn cho mọi ca nhau bong non, đặc biệt thai đã lưu. Nội dung dưới đây diễn đạt lại các tiêu chí của bảng gốc; các checklist trong từng tình huống là bài tự luyện riêng.',
  levels: ['Không đạt (F)', 'Vừa đạt mức yêu cầu (40%)', 'Đạt trên mức yêu cầu (80%)', 'Hoàn thành rất tốt mọi yêu cầu (100%)'],
  rows: [
    {name: 'Thái độ cấp cứu', max: 0.75, criteria: ['Từ từ, thản nhiên.', 'Thể hiện thái độ khẩn trương.', 'Ô này không tính điểm; bảng gốc yêu cầu giám khảo không ghi điểm vào ô này.', 'Có kêu gọi hỗ trợ.']},
    {name: 'Thái độ và ngôn ngữ khi giao tiếp, tư vấn', max: 1, criteria: ['Chỉ quan tâm y học, trao đổi một chiều hoặc cung cấp thông tin không trung thực.', 'Tìm hiểu hoàn cảnh, hiểu biết y xã hội; trao đổi hai chiều; thông tin đủ và đúng nhưng còn dùng ngôn ngữ y học.', 'Quan tâm hoàn cảnh và hiểu biết của thai phụ; điều chỉnh theo đáp ứng; thông tin đủ, đúng bằng ngôn ngữ đời thường.', 'Đồng cảm, trung thực, dùng tốt ngôn ngữ đời thường; kiểm tra sự thông hiểu và cùng thai phụ xử lý vấn đề.']},
    {name: 'Nhận định băng ghi CTG', max: 1.75, criteria: ['Không nhận định được tình trạng đe dọa thai.', 'Nhận diện được tình trạng đe dọa thai trên CTG.', 'Thêm nhận định mức độ đe dọa nghiêm trọng.', 'Thêm nhận diện tăng trương lực cơ bản và rối loạn cơn co kiểu gò cường tính.']},
    {name: 'Chẩn đoán nhau bong non', max: 1.75, criteria: ['Không đề cập chẩn đoán nhau bong non.', 'Nghi ngờ, nghĩ đến hoặc đưa nhau bong non vào chẩn đoán phân biệt.', 'Khẳng định chẩn đoán nhau bong non, không còn chẩn đoán phân biệt khác trong dữ kiện trạm này.', 'Thêm nhận định nhau bong non thể nặng.']},
    {name: 'Nguy cơ cho con', max: 1.5, criteria: ['Không nêu được tình trạng đe dọa tính mạng con.', 'Nêu tính mạng bé đang bị đe dọa.', 'Thêm nhận định tình trạng nghiêm trọng, có nguy cơ tử vong.', 'Thêm nguy cơ tử vong ngay cả khi mổ khẩn và tình trạng thai có thể xấu rất nhanh.']},
    {name: 'Nguy cơ cho mẹ', max: 1.5, criteria: ['Không nêu được nguy cơ băng huyết sau sinh.', 'Nêu được nguy cơ băng huyết sau sinh.', 'Thêm giải thích liên quan rối loạn đông máu.', 'Thêm giải thích các nguy cơ khác, kể cả tử vong.']},
    {name: 'Xử trí nhau bong non', max: 1.75, criteria: ['Không đề nghị mổ lấy thai khẩn trong tình huống của trạm.', 'Đề nghị mổ lấy thai khẩn.', 'Thêm chuẩn bị truyền máu cho mẹ hoặc chuẩn bị kíp hồi sức sơ sinh.', 'Chuẩn bị cả truyền máu cho mẹ và kíp hồi sức sơ sinh, mời nhi hỗ trợ đón bé.']}
  ]
};


window.OSCE_AUDIT = {
  "selectedCases": 9,
  "withSourceAnswer": 4,
  "withoutSourceAnswer": 5,
  "reviewedFiles": 19,
  "reviewedAdditionalCompilations": [
    "OSCE FULLBOOK.docx: script/tình huống hướng dẫn, không xác lập được kỳ thi cho ca riêng.",
    "Script chị Thiên Ân Y19.pdf, trang 22–23: script TOLAC, không có bộ dữ kiện đề riêng.",
    "OSCE SẢN Y4 (siêu tổng hợp).pdf: lớp chữ lỗi font, chưa OCR toàn bộ; chưa dùng làm nguồn tạo ca.",
    "TỔNG HỢP OSCE UPDATE ANH GIA BẢO.pdf: script theo chủ đề; trang 76 đã nhìn trực tiếp là rubric NBN trùng bảng gốc, không phải đề mới."
  ],
  "deduplicated": [
    "Đề OSCE Y21 - Đợt 2.pdf có hai bản lưu: giữ một ca TOLAC.",
    "Y18 OSCE có key.docx trùng ngữ cảnh NTĐ Y18(1) trong OSCE Cũ (Tổng hợp).pdf: giữ ca có lời chữa.",
    "ĐỀ-THI-OSCE-ĐỢT-3-Y17.docx và bản -1 trùng NBN thai 30 tuần: giữ bản PDF tổng hợp có phần Trả lời.",
    "tổng hợp đề nhớ.docx trùng Khác(1), Phòng 3 NTĐ 26 tuần: giữ bản PDF có số trang."
  ],
  "scopeLimits": [
    "Không thấy ca BHSS hoặc vỡ tử cung có đề riêng đủ dữ kiện trong các đề OSCE đã đọc; không điền ca tự tạo để phủ chủ đề.",
    "Tình-huống-OSCE-cô-HOA.pdf đã đọc 8 trang: các ca là giảm thai máy, sinh non, TSG, tư vấn di truyền và cổ tử cung ngắn; không chọn làm ca CĐ6.",
    "Y18 Block 1.pdf là tập ảnh câu hỏi trắc nghiệm e-learning, không phải trạm OSCE; đã kiểm tra ảnh trang 21, không nhập thành OSCE.",
    "OSCE SẢN.pdf chủ yếu là script theo chủ đề, không thấy bộ dữ kiện đề riêng đủ cho ca mới; trang 5 đã nhìn trực tiếp là trang tiêu đề tư vấn thiếu máu.",
    "Một số tài liệu tổng hợp có lớp chữ lỗi font và các trang ảnh chưa OCR toàn bộ; bộ ca không được gọi là đầy đủ tuyệt đối mọi đề trong toàn kho."
  ],
  "notFullyOCRed": [
    "Y18 Block 1.pdf: tập MCQ e-learning, không nhập thành OSCE; nhiều trang là ảnh có chú thích viết tay.",
    "OSCE SẢN Y4 (siêu tổng hợp).pdf: lớp text bị lỗi font; chưa OCR toàn bộ 138 trang.",
    "TỔNG HỢP OSCE UPDATE ANH GIA BẢO.pdf: các trang ảnh 30,31,39,52,81 chưa OCR; trang 76 đã xem là rubric NBN trùng."
  ],
  "images": "Ảnh trang gốc phục vụ đối chiếu; không bổ sung hình CTG không thuộc đề."
};

window.OSCE_CASES = [
  {
    "id": "de-y18-1-ntd",
    "title": "Y18 đợt 1 · Nhau tiền đạo ra huyết",
    "topic": "ntd",
    "tag": "Cốt lõi",
    "minutes": 5,
    "timeMode": "luyện tập",
    "stem": "Trạm này là cái mô hình toàn máu, phải vô xử trí cấp cứu liền, xong ròi sau đó chỉ cần mở miệng nói chữ Khám mỏ vịt là có tờ giấy cuối cùng (mấy cái trước có cho sẵn rồi 1 SÂ nhau, 1 sổ khám thai) rồi tư vấn với xử trí, quản lý sao thôi. \"Nhau tiền đạo trung tâm, không thấy Nhau cài răng lược\"",
    "vitals": "",
    "originalQuestions": [],
    "source": {
      "file": "Y18 OSCE có key.docx",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\Y18\\Y18 OSCE có key.docx",
      "pages": [
        "Mục Trạm 6 (DOCX)"
      ],
      "examLabel": "Y18 · Trạm 6",
      "sourceKind": "Đề nhớ lại",
      "verified": true
    },
    "sourceAnswer": {
      "kind": "Đáp án tham khảo SV",
      "file": "Y18 OSCE có key.docx",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\Y18\\Y18 OSCE có key.docx",
      "pages": [
        "Mục Trạm 6 (DOCX)"
      ],
      "confidence": "Đã đọc trực tiếp phần trả lời trong bản lưu; chưa có bằng chứng là đáp án chính thức của bộ môn."
    },
    "rubric": [],
    "modelAnswer": [
      "Năm nay bỏ điểm \"thái độ khẩn trương\" (thấy máu không nên xem bệnh án) vì dịch thôi nha. Đo sinh hiệu ngay, thiết lập kim, và PHẢI KHÁM MỎ VỊT -> chưa shock và cần ổn định nội khoa ngay. Lưu ý nó còn cơn co TC nữa và nó chính là thủ phạm (phải xác định nó có chuyển dạ). Nguy cơ cho mẹ và cho con (phải confirm tuổi thai) (mất máu, BHSS) và (đủ tháng rồi không sao, không ảnh hưởng đến bé nhưng nếu mẹ shock và suy hô hấp thì vẫn có thể ảnh hưởng đến con). ĐI MỔ NGAY (vì sẽ chảy máu nữa)"
    ],
    "sources": [
      "UMP",
      "ELO",
      "RUBRIC"
    ],
    "images": [],
    "notes": "Bản nhớ lại trạm thi, có ghi “Thầy giải” nhưng không có tài liệu xác thực độc lập về tác giả đáp án. Trùng ngữ cảnh Y18 (1), OSCE Cũ (Tổng hợp).pdf trang 4; giữ bản có lời chữa. Nguồn không nêu câu hỏi giám khảo nguyên văn hoặc tuổi thai cụ thể trong phần đề. Câu “đủ tháng rồi không sao” là lời ghi trong đáp án tham khảo, không phải bảo đảm thai an toàn: chính nguồn cũng nhắc mẹ sốc có thể ảnh hưởng con. Thời lượng 5 phút chỉ phục vụ tự luyện.",
    "answerLabel": "Trích đáp án tham khảo trong kho; chưa xác thực là đáp án bộ môn",
    "rubricLabel": "Không tự tạo thang chấm cho đề này",
    "originalAnswer": [
      "Năm nay bỏ điểm \"thái độ khẩn trương\" (thấy máu không nên xem bệnh án) vì dịch thôi nha. Đo sinh hiệu ngay, thiết lập kim, và PHẢI KHÁM MỎ VỊT -> chưa shock và cần ổn định nội khoa ngay. Lưu ý nó còn cơn co TC nữa và nó chính là thủ phạm (phải xác định nó có chuyển dạ). Nguy cơ cho mẹ và cho con (phải confirm tuổi thai) (mất máu, BHSS) và (đủ tháng rồi không sao, không ảnh hưởng đến bé nhưng nếu mẹ shock và suy hô hấp thì vẫn có thể ảnh hưởng đến con). ĐI MỔ NGAY (vì sẽ chảy máu nữa)"
    ],
    "referenceAnswer": [
      "Năm nay bỏ điểm \"thái độ khẩn trương\" (thấy máu không nên xem bệnh án) vì dịch thôi nha. Đo sinh hiệu ngay, thiết lập kim, và PHẢI KHÁM MỎ VỊT -> chưa shock và cần ổn định nội khoa ngay. Lưu ý nó còn cơn co TC nữa và nó chính là thủ phạm (phải xác định nó có chuyển dạ). Nguy cơ cho mẹ và cho con (phải confirm tuổi thai) (mất máu, BHSS) và (đủ tháng rồi không sao, không ảnh hưởng đến bé nhưng nếu mẹ shock và suy hô hấp thì vẫn có thể ảnh hưởng đến con). ĐI MỔ NGAY (vì sẽ chảy máu nữa)"
    ],
    "answerReview": {
      "status": "Có hiệu chỉnh",
      "summary": "Giữ trọng tâm đo sinh hiệu, cấp cứu và nhận định chuyển dạ của lời chữa. Sửa cách trấn an tuyệt đối về thai và không biến “đi mổ ngay” thành quy tắc áp cho mọi ca khi bản nhớ chưa ghi đủ tuổi thai, lượng máu và diễn tiến.",
      "corrections": [
        {
          "original": "“Năm nay bỏ điểm thái độ khẩn trương ... vì dịch”",
          "corrected": "Đây là ghi nhớ cách chấm của một kỳ thi cũ, không phải quy định hiện hành hoặc lý do giảm tính khẩn khi gặp xuất huyết. Vẫn phải có thái độ cấp cứu theo ELO.",
          "reason": "Không chuyển ghi chú thời dịch không ghi năm thành hướng dẫn chấm hoặc thực hành cho mọi kỳ thi; ELO yêu cầu nhận thức ảnh hưởng nghiêm trọng và thái độ cấp cứu.",
          "sources": [
            {
              "id": "ELO46",
              "file": "ELOs Topic 46.pdf",
              "path": "G:\\.shortcut-targets-by-id\\1LGkoGmu2vsQz17j40FGYtpQ2Q28pnHOO\\Y4 chị Mai Bùi\\SẢN KHOA\\LÝ THUYẾT\\Chương 6. Cấp Cứu Sản Khoa\\ELOs Topic 46.pdf",
              "pages": [
                1,
                2
              ],
              "label": "ELO Topic 46, trang 1–2: quản lý ban đầu và thái độ cấp cứu"
            }
          ]
        },
        {
          "original": "“đủ tháng rồi không sao, không ảnh hưởng đến bé”",
          "corrected": "Đủ tháng không bảo đảm thai không bị ảnh hưởng. Chảy máu mẹ nặng gây giảm trao đổi oxy; còn phải đánh giá tim thai và tình trạng mẹ.",
          "reason": "UMP mô tả ảnh hưởng lên thai khi chảy máu quan trọng và nguy cơ chu sinh. Phần đề của bản nhớ cũng chưa ghi tuổi thai cụ thể.",
          "sources": [
            {
              "id": "UMP19",
              "file": "4 Nhau_tien_dao.pdf",
              "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\4 Nhau_tien_dao.pdf",
              "pages": [
                3,
                4
              ],
              "label": "Giáo trình UMP: Nhau tiền đạo, trang 3–4; đã đọc trực tiếp"
            }
          ]
        },
        {
          "original": "“ĐI MỔ NGAY (vì sẽ chảy máu nữa)”",
          "corrected": "Xác nhận tuổi thai, mức xuất huyết, mẹ–thai và chuyển dạ. Theo UMP, chấm dứt thai kỳ dựa tuổi thai và lâm sàng; chảy máu trầm trọng hoặc chuyển dạ có thể buộc sinh sớm. Nhau che lỗ trong cần mổ khi đã quyết định chấm dứt thai kỳ.",
          "reason": "Không suy chỉ định chỉ từ dự báo sẽ chảy máu lại. Lời chữa nêu cơn co và cần xác định chuyển dạ: phải giữ bước nhận định đó.",
          "sources": [
            {
              "id": "UMP19",
              "file": "4 Nhau_tien_dao.pdf",
              "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\4 Nhau_tien_dao.pdf",
              "pages": [
                3,
                4
              ],
              "label": "Giáo trình UMP: Nhau tiền đạo, trang 3–4; đã đọc trực tiếp"
            }
          ]
        }
      ],
      "correctedAnswer": [
        "Ưu tiên nhận định cấp cứu: đo sinh hiệu, đánh giá xuất huyết và tình trạng mẹ; triển khai hồi sức phù hợp đồng thời đánh giá thai. Giữ trọng tâm này của đáp án tham khảo [UMP19, trang 3–4; ELO46, trang 1].",
        "Xác nhận tuổi thai, xem sổ và siêu âm, đánh giá có chuyển dạ hay không. Giữ bước nhận định trước quyết định đường sinh; không mặc định mọi cơn co đều đã là chuyển dạ [UMP19, trang 4].",
        "Nhận định nhau tiền đạo trung tâm ra huyết theo dữ kiện nguồn. Chấm dứt thai kỳ dựa tuổi thai và tình trạng lâm sàng; nếu xuất huyết trầm trọng hoặc có chuyển dạ, chuẩn bị mổ và hồi sức đồng thời. Không mặc định đã đủ tháng khi phần đề không ghi [UMP19, trang 4].",
        "Tư vấn nguy cơ mất máu, BHSS, truyền máu và khả năng phải can thiệp cầm máu; thai vẫn có thể thiếu oxy khi mẹ mất máu quan trọng. Không nói “đủ tháng rồi không sao” [UMP19, trang 3–4]."
      ],
      "verifiedSources": [
        {
          "id": "UMP19",
          "file": "4 Nhau_tien_dao.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\4 Nhau_tien_dao.pdf",
          "pages": [
            3,
            4
          ],
          "label": "Giáo trình UMP: Nhau tiền đạo, trang 3–4; đã đọc trực tiếp"
        },
        {
          "id": "ELO46",
          "file": "ELOs Topic 46.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1LGkoGmu2vsQz17j40FGYtpQ2Q28pnHOO\\Y4 chị Mai Bùi\\SẢN KHOA\\LÝ THUYẾT\\Chương 6. Cấp Cứu Sản Khoa\\ELOs Topic 46.pdf",
          "pages": [
            1,
            2
          ],
          "label": "ELO Topic 46, trang 1–2: quản lý ban đầu và thái độ cấp cứu"
        }
      ]
    },
    "textbookCorrection": {
      "answer": [
        "Ưu tiên nhận định cấp cứu: đo sinh hiệu, đánh giá xuất huyết và tình trạng mẹ; triển khai hồi sức phù hợp đồng thời đánh giá thai. Giữ trọng tâm này của đáp án tham khảo [UMP19, trang 3–4; ELO46, trang 1].",
        "Xác nhận tuổi thai, xem sổ và siêu âm, đánh giá có chuyển dạ hay không. Giữ bước nhận định trước quyết định đường sinh; không mặc định mọi cơn co đều đã là chuyển dạ [UMP19, trang 4].",
        "Nhận định nhau tiền đạo trung tâm ra huyết theo dữ kiện nguồn. Chấm dứt thai kỳ dựa tuổi thai và tình trạng lâm sàng; nếu xuất huyết trầm trọng hoặc có chuyển dạ, chuẩn bị mổ và hồi sức đồng thời. Không mặc định đã đủ tháng khi phần đề không ghi [UMP19, trang 4].",
        "Tư vấn nguy cơ mất máu, BHSS, truyền máu và khả năng phải can thiệp cầm máu; thai vẫn có thể thiếu oxy khi mẹ mất máu quan trọng. Không nói “đủ tháng rồi không sao” [UMP19, trang 3–4]."
      ],
      "sources": [
        {
          "id": "UMP19",
          "file": "4 Nhau_tien_dao.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\4 Nhau_tien_dao.pdf",
          "pages": [
            3,
            4
          ],
          "label": "Giáo trình UMP: Nhau tiền đạo, trang 3–4; đã đọc trực tiếp"
        },
        {
          "id": "ELO46",
          "file": "ELOs Topic 46.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1LGkoGmu2vsQz17j40FGYtpQ2Q28pnHOO\\Y4 chị Mai Bùi\\SẢN KHOA\\LÝ THUYẾT\\Chương 6. Cấp Cứu Sản Khoa\\ELOs Topic 46.pdf",
          "pages": [
            1,
            2
          ],
          "label": "ELO Topic 46, trang 1–2: quản lý ban đầu và thái độ cấp cứu"
        }
      ],
      "note": "Bản hiệu chỉnh/chuẩn hóa câu trả lời tham khảo dựa giáo trình UMP đã đọc; đây không phải đáp án chính thức mới của bộ môn."
    },
    "guidelineNotes": [
      "Đối chiếu an toàn riêng, không thay đáp án học phần: RCOG GTG63 (2011), trang 8, phân biệt khám mỏ vịt với khám âm đạo bằng ngón tay. Không khám bằng ngón tay khi nhau tiền đạo còn là khả năng chẩn đoán, trước khi siêu âm loại trừ. Nguồn đã đọc trực tiếp: https://www.rcog.org.uk/media/pwdi1tef/gtg_63.pdf"
    ],
    "imageLabel": "Ảnh trang tài liệu nguồn (có thể chứa lời giải); mở sau khi tự trả lời."
  },
  {
    "id": "de-y17-3-nbn",
    "title": "Y17 đợt 3 · Đau bụng, tử cung co cứng ở thai 30 tuần",
    "topic": "nbn",
    "tag": "Cốt lõi",
    "minutes": 5,
    "timeMode": "luyện tập",
    "stem": "BN nữ thai hiện tại 30 tuần , sổ khám thai không ghi nhận bất thường , sáng nay đột ngột đau bụng dữ dội , đau ở bụng dưới nên đi nhập cấp cứu , không ra dịch , không ra máu . qua thăm khám thấy không có đề kháng thành bụng , không phản ứng thành bụng , đau nhiều vùng bụng dưới, tử cung co căng cứng liên tục, tim thai không đều , sinh hiệu bệnh nhân ổn ,khám trong TC mở 2cm xóa 5O% , ối vỡ khi khám , dịch hồng , khong có dây rốn sa ra ngoài .",
    "vitals": "Theo nguồn: “tim thai không đều, sinh hiệu bệnh nhân ổn”. Không có trị số sinh hiệu mẹ.",
    "originalQuestions": [
      "Nhận định tình trạng hiện tại của BN",
      "Xử trí như thế nào cho BN"
    ],
    "source": {
      "file": "OSCE Cũ (Tổng hợp).pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\ĐỀ\\OSCE Cũ (Tổng hợp).pdf",
      "pages": [
        17
      ],
      "examLabel": "Y17 (3) · Trạm 6",
      "sourceKind": "Đề nhớ lại",
      "verified": true
    },
    "sourceAnswer": {
      "kind": "Đáp án tham khảo SV",
      "file": "OSCE Cũ (Tổng hợp).pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\ĐỀ\\OSCE Cũ (Tổng hợp).pdf",
      "pages": [
        17
      ],
      "confidence": "Đã đọc trực tiếp phần trả lời trong bản lưu; chưa có bằng chứng là đáp án chính thức của bộ môn."
    },
    "rubric": [],
    "modelAnswer": [
      "1.Nhận định: Chẩn đoán: con đầu, thai 30w, ngôi ?, nhau bong non Tình trạng: Mẹ: sinh hiệu ổn, có dấu chuyển dạ Con: tim thai không đều ➔ nghĩ đến ng nhân thiếu O2 2.Mắc monitoring Cơn gò ➔ cường tính không? Tim thai ➔ Nhịp giảm muộn lặp lại… Mổ lấy thai liền (CTC mở 2cm chờ đợi rất lâu)"
    ],
    "sources": [
      "UMP",
      "ELO",
      "RUBRIC"
    ],
    "images": [
      "assets/osce/r06-p17.png"
    ],
    "notes": "Nguồn tự ghi “Có một số chỗ nhớ thiếu”. Trùng ĐỀ-THI-OSCE-ĐỢT-3-Y17.docx và bản -1.docx; chọn bản tổng hợp vì có phần trả lời. Giữ ký tự “5O%” của bản nguồn trong đề; không tự bổ sung ngôi, PARA hoặc băng CTG. Phần trả lời ghi “con đầu”, “ngôi ?” và CTG giả định: đó là nội dung đáp án tham khảo, không phải dữ kiện đã có ở đề.",
    "answerLabel": "Trích đáp án tham khảo trong kho; chưa xác thực là đáp án bộ môn",
    "rubricLabel": "Không tự tạo thang chấm cho đề này",
    "originalAnswer": [
      "1.Nhận định: Chẩn đoán: con đầu, thai 30w, ngôi ?, nhau bong non Tình trạng: Mẹ: sinh hiệu ổn, có dấu chuyển dạ Con: tim thai không đều ➔ nghĩ đến ng nhân thiếu O2 2.Mắc monitoring Cơn gò ➔ cường tính không? Tim thai ➔ Nhịp giảm muộn lặp lại… Mổ lấy thai liền (CTC mở 2cm chờ đợi rất lâu)"
    ],
    "referenceAnswer": [
      "1.Nhận định: Chẩn đoán: con đầu, thai 30w, ngôi ?, nhau bong non Tình trạng: Mẹ: sinh hiệu ổn, có dấu chuyển dạ Con: tim thai không đều ➔ nghĩ đến ng nhân thiếu O2 2.Mắc monitoring Cơn gò ➔ cường tính không? Tim thai ➔ Nhịp giảm muộn lặp lại… Mổ lấy thai liền (CTC mở 2cm chờ đợi rất lâu)"
    ],
    "answerReview": {
      "status": "Có hiệu chỉnh",
      "summary": "Chẩn đoán làm việc NBN và chuẩn bị sinh khẩn khi thai bị đe dọa phù hợp nguyên tắc UMP. Bỏ các dữ kiện đáp án tự bổ sung mà đề nhớ không cung cấp; không coi nhịp giảm muộn là hình CTG đã quan sát.",
      "corrections": [
        {
          "original": "“Chẩn đoán: con đầu, thai 30w, ngôi ?, nhau bong non”",
          "corrected": "Thai 30 tuần, nghi nhau bong non theo đau và tử cung co căng cứng; chưa đủ dữ kiện để kết luận con đầu hoặc ngôi.",
          "reason": "Phần đề không có PARA hoặc ngôi; không tự bổ sung thông tin hành chính sản khoa khi đọc đáp án.",
          "sources": [
            {
              "id": "UMP23",
              "file": "5 Nhau_bong_non.pdf",
              "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
              "pages": [
                2,
                3
              ],
              "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
            },
            {
              "id": "ELO46",
              "file": "ELOs Topic 46.pdf",
              "path": "G:\\.shortcut-targets-by-id\\1LGkoGmu2vsQz17j40FGYtpQ2Q28pnHOO\\Y4 chị Mai Bùi\\SẢN KHOA\\LÝ THUYẾT\\Chương 6. Cấp Cứu Sản Khoa\\ELOs Topic 46.pdf",
              "pages": [
                1,
                2
              ],
              "label": "ELO Topic 46, trang 1–2: quản lý ban đầu và thái độ cấp cứu"
            }
          ]
        },
        {
          "original": "“Tim thai ➔ Nhịp giảm muộn lặp lại…”",
          "corrected": "Đề chỉ có tim thai không đều; cần đánh giá/monitor khi không làm chậm xử trí. Không khẳng định đã thấy nhịp giảm muộn khi chưa có băng ghi nguồn.",
          "reason": "UMP xem lâm sàng và tình trạng mẹ–thai là cơ sở nhận định; không biến một gợi ý trong lời giải thành dữ kiện gốc.",
          "sources": [
            {
              "id": "UMP23",
              "file": "5 Nhau_bong_non.pdf",
              "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
              "pages": [
                2,
                3
              ],
              "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
            }
          ]
        },
        {
          "original": "“Mổ lấy thai liền (CTC mở 2cm chờ đợi rất lâu)”",
          "corrected": "Nếu thai sống bị đe dọa và chưa thể sinh âm đạo nhanh, mổ lấy thai là lựa chọn ưu tiên trong khi hồi sức mẹ và chuẩn bị máu/sơ sinh.",
          "reason": "Đây là điều kiện quyết định đường sinh theo UMP; không chỉ dựa một số đo cổ tử cung tách khỏi mẹ và thai.",
          "sources": [
            {
              "id": "UMP23",
              "file": "5 Nhau_bong_non.pdf",
              "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
              "pages": [
                2,
                3
              ],
              "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
            }
          ]
        }
      ],
      "correctedAnswer": [
        "Nghi nhau bong non: thai 30 tuần đau đột ngột, tử cung co căng cứng liên tục và tim thai không đều. Mẹ trong đề còn sinh hiệu ổn; không tự gán sốc. Chưa biết PARA và ngôi [UMP23, trang 2].",
        "Gọi hỗ trợ, đánh giá và theo dõi mẹ–thai, chuẩn bị hồi sức và máu theo diễn tiến. Làm rõ tình trạng tim thai bằng theo dõi phù hợp; không điền nhịp giảm muộn khi đề chưa cho CTG [UMP23, trang 2–3].",
        "Nếu thai sống bị đe dọa và chưa thể sinh âm đạo nhanh, mổ lấy thai khẩn theo nguyên tắc UMP; xử trí nội khoa, sản khoa và biến chứng song song [UMP23, trang 3]."
      ],
      "verifiedSources": [
        {
          "id": "UMP23",
          "file": "5 Nhau_bong_non.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
          "pages": [
            2,
            3
          ],
          "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
        },
        {
          "id": "ELO46",
          "file": "ELOs Topic 46.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1LGkoGmu2vsQz17j40FGYtpQ2Q28pnHOO\\Y4 chị Mai Bùi\\SẢN KHOA\\LÝ THUYẾT\\Chương 6. Cấp Cứu Sản Khoa\\ELOs Topic 46.pdf",
          "pages": [
            1,
            2
          ],
          "label": "ELO Topic 46, trang 1–2: quản lý ban đầu và thái độ cấp cứu"
        }
      ]
    },
    "textbookCorrection": {
      "answer": [
        "Nghi nhau bong non: thai 30 tuần đau đột ngột, tử cung co căng cứng liên tục và tim thai không đều. Mẹ trong đề còn sinh hiệu ổn; không tự gán sốc. Chưa biết PARA và ngôi [UMP23, trang 2].",
        "Gọi hỗ trợ, đánh giá và theo dõi mẹ–thai, chuẩn bị hồi sức và máu theo diễn tiến. Làm rõ tình trạng tim thai bằng theo dõi phù hợp; không điền nhịp giảm muộn khi đề chưa cho CTG [UMP23, trang 2–3].",
        "Nếu thai sống bị đe dọa và chưa thể sinh âm đạo nhanh, mổ lấy thai khẩn theo nguyên tắc UMP; xử trí nội khoa, sản khoa và biến chứng song song [UMP23, trang 3]."
      ],
      "sources": [
        {
          "id": "UMP23",
          "file": "5 Nhau_bong_non.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
          "pages": [
            2,
            3
          ],
          "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
        },
        {
          "id": "ELO46",
          "file": "ELOs Topic 46.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1LGkoGmu2vsQz17j40FGYtpQ2Q28pnHOO\\Y4 chị Mai Bùi\\SẢN KHOA\\LÝ THUYẾT\\Chương 6. Cấp Cứu Sản Khoa\\ELOs Topic 46.pdf",
          "pages": [
            1,
            2
          ],
          "label": "ELO Topic 46, trang 1–2: quản lý ban đầu và thái độ cấp cứu"
        }
      ],
      "note": "Bản hiệu chỉnh/chuẩn hóa câu trả lời tham khảo dựa giáo trình UMP đã đọc; đây không phải đáp án chính thức mới của bộ môn."
    },
    "guidelineNotes": [],
    "imageLabel": "Ảnh trang tài liệu nguồn (có thể chứa lời giải); mở sau khi tự trả lời."
  },
  {
    "id": "de-y17-5-nbn-song-thai",
    "title": "Y17 đợt 5 · “Rớt tim thai rồi bác sĩ ơi”",
    "topic": "nbn",
    "tag": "Cốt lõi",
    "minutes": 5,
    "timeMode": "luyện tập",
    "stem": "Trạm cấp cứu, tình huống điều dưỡng báo “ Rớt tim thai rồi bác sĩ ơi”",
    "vitals": "Phần ghi diễn biến trong nguồn nói “bệnh nhân shock”; không có trị số mạch, huyết áp.",
    "originalQuestions": [
      "“What behind” — nghĩa là ở EFM này cái gì gây ra nó và cần xử trí gì?"
    ],
    "source": {
      "file": "OSCE Cũ (Tổng hợp).pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\ĐỀ\\OSCE Cũ (Tổng hợp).pdf",
      "pages": [
        20
      ],
      "examLabel": "Y17 (5) · Trạm 3",
      "sourceKind": "Đề nhớ lại",
      "verified": true
    },
    "sourceAnswer": {
      "kind": "Đáp án tham khảo SV",
      "file": "OSCE Cũ (Tổng hợp).pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\ĐỀ\\OSCE Cũ (Tổng hợp).pdf",
      "pages": [
        20
      ],
      "confidence": "Đã đọc trực tiếp phần trả lời trong bản lưu; chưa có bằng chứng là đáp án chính thức của bộ môn."
    },
    "rubric": [],
    "modelAnswer": [
      "Chạy lẹ vào, lấy ngay sinh hiệu, phát hiện ra bệnh nhân shock, xử trí shock, sau đó hãy khoang đọc EFM vội, mà hãy vào khám ngay bệnh nhân, sẽ nhận ra những dấu hiệu rất điển hình của nhau bong non: như cơn co cường tính, nước ối màu đỏ, sau đó hãy quay lại EFM và trả lời câu hỏi “ What behind” nghĩa là ở EFM này cái gì gây ra nó và cần xử trí gì, trường hợp này là song thai với nhau bong non, thai đã có những nhịp giảm muộn lặp lại, nhịp giảm kéo dài → đề nghị chấm dứt thai kỳ ngay lập tức với mổ sanh Trạm này các bạn được ăn cả ngã về không, vào thi rất rối, nói được từ Nhau Bong Non thôi là cuộc đời lên hương"
    ],
    "sources": [
      "UMP",
      "ELO",
      "RUBRIC"
    ],
    "images": [
      "assets/osce/r06-p20.png"
    ],
    "notes": "Nguồn gộp diễn biến phát hiện và lời xử trí vào cùng một đoạn. Song thai, sốc, gò cường tính, nước ối đỏ và biến động tim thai xuất hiện trong đoạn lời giải đã giữ nguyên; không đưa các dữ kiện được tiết lộ này thành phần đề ban đầu. Không thấy ảnh EFM của trạm đi kèm trang nguồn, vì vậy đây không phải bài chấm đọc CTG từ hình.",
    "answerLabel": "Trích đáp án tham khảo trong kho; chưa xác thực là đáp án bộ môn",
    "rubricLabel": "Không tự tạo thang chấm cho đề này",
    "originalAnswer": [
      "Chạy lẹ vào, lấy ngay sinh hiệu, phát hiện ra bệnh nhân shock, xử trí shock, sau đó hãy khoang đọc EFM vội, mà hãy vào khám ngay bệnh nhân, sẽ nhận ra những dấu hiệu rất điển hình của nhau bong non: như cơn co cường tính, nước ối màu đỏ, sau đó hãy quay lại EFM và trả lời câu hỏi “ What behind” nghĩa là ở EFM này cái gì gây ra nó và cần xử trí gì, trường hợp này là song thai với nhau bong non, thai đã có những nhịp giảm muộn lặp lại, nhịp giảm kéo dài → đề nghị chấm dứt thai kỳ ngay lập tức với mổ sanh Trạm này các bạn được ăn cả ngã về không, vào thi rất rối, nói được từ Nhau Bong Non thôi là cuộc đời lên hương"
    ],
    "referenceAnswer": [
      "Chạy lẹ vào, lấy ngay sinh hiệu, phát hiện ra bệnh nhân shock, xử trí shock, sau đó hãy khoang đọc EFM vội, mà hãy vào khám ngay bệnh nhân, sẽ nhận ra những dấu hiệu rất điển hình của nhau bong non: như cơn co cường tính, nước ối màu đỏ, sau đó hãy quay lại EFM và trả lời câu hỏi “ What behind” nghĩa là ở EFM này cái gì gây ra nó và cần xử trí gì, trường hợp này là song thai với nhau bong non, thai đã có những nhịp giảm muộn lặp lại, nhịp giảm kéo dài → đề nghị chấm dứt thai kỳ ngay lập tức với mổ sanh Trạm này các bạn được ăn cả ngã về không, vào thi rất rối, nói được từ Nhau Bong Non thôi là cuộc đời lên hương"
    ],
    "answerReview": {
      "status": "Có hiệu chỉnh",
      "summary": "Giữ chẩn đoán NBN trong diễn biến song thai, sốc và thai bị đe dọa mà bản nhớ nêu. Hiệu chỉnh cách học thành một chuỗi chờ đợi: UMP yêu cầu xử trí nội khoa, sản khoa và biến chứng song song.",
      "corrections": [
        {
          "original": "“lấy ngay sinh hiệu, phát hiện ra bệnh nhân shock, xử trí shock, sau đó ... hãy vào khám ... sau đó hãy quay lại EFM”",
          "corrected": "Gọi kíp; hồi sức sốc, khám đích, đánh giá tim thai và chuẩn bị chấm dứt thai kỳ diễn ra song song. Không chờ xử trí sốc xong mới khởi động đánh giá thai hoặc chuẩn bị mổ.",
          "reason": "UMP ghi rõ điều trị NBN đồng thời nội khoa, sản khoa và biến chứng; các vai trong kíp có thể làm các việc cùng lúc.",
          "sources": [
            {
              "id": "UMP23",
              "file": "5 Nhau_bong_non.pdf",
              "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
              "pages": [
                2,
                3
              ],
              "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
            }
          ]
        },
        {
          "original": "“What behind” và các nhịp giảm trên EFM trong bản kể",
          "corrected": "Có thể thảo luận ý nghĩa các dấu CTG mà tác giả nhớ lại; không chấm kỹ năng đọc băng gốc khi tệp không kèm ảnh EFM của trạm.",
          "reason": "Chưa có hình gốc thì chưa thể kiểm chứng từng đặc tính băng ghi hoặc nhóm CTG.",
          "sources": [
            {
              "id": "UMP23",
              "file": "5 Nhau_bong_non.pdf",
              "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
              "pages": [
                2,
                3
              ],
              "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
            }
          ]
        }
      ],
      "correctedAnswer": [
        "Bản kể mô tả sau tiếp cận thấy sốc, gò cường tính, ối đỏ, song thai và tim thai có biến động nghiêm trọng: nhận định nhau bong non nặng, nguy cơ mẹ và thai [UMP23, trang 2–3].",
        "Hồi sức sốc và kiểm soát sản khoa cùng xử trí biến chứng song song. Không đợi hồi sức hoàn tất rồi mới gọi hỗ trợ, đánh giá thai hoặc chuẩn bị sinh [UMP23, trang 3].",
        "Nếu thai còn sống bị đe dọa và không thể sinh âm đạo nhanh, mổ lấy thai khẩn; chuẩn bị máu và sơ sinh. Chỉ dùng mô tả EFM của bản nhớ để thảo luận, không xem đó là ảnh CTG đã được kiểm chứng [UMP23, trang 3]."
      ],
      "verifiedSources": [
        {
          "id": "UMP23",
          "file": "5 Nhau_bong_non.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
          "pages": [
            2,
            3
          ],
          "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
        },
        {
          "id": "ELO46",
          "file": "ELOs Topic 46.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1LGkoGmu2vsQz17j40FGYtpQ2Q28pnHOO\\Y4 chị Mai Bùi\\SẢN KHOA\\LÝ THUYẾT\\Chương 6. Cấp Cứu Sản Khoa\\ELOs Topic 46.pdf",
          "pages": [
            1,
            2
          ],
          "label": "ELO Topic 46, trang 1–2: quản lý ban đầu và thái độ cấp cứu"
        }
      ]
    },
    "textbookCorrection": {
      "answer": [
        "Bản kể mô tả sau tiếp cận thấy sốc, gò cường tính, ối đỏ, song thai và tim thai có biến động nghiêm trọng: nhận định nhau bong non nặng, nguy cơ mẹ và thai [UMP23, trang 2–3].",
        "Hồi sức sốc và kiểm soát sản khoa cùng xử trí biến chứng song song. Không đợi hồi sức hoàn tất rồi mới gọi hỗ trợ, đánh giá thai hoặc chuẩn bị sinh [UMP23, trang 3].",
        "Nếu thai còn sống bị đe dọa và không thể sinh âm đạo nhanh, mổ lấy thai khẩn; chuẩn bị máu và sơ sinh. Chỉ dùng mô tả EFM của bản nhớ để thảo luận, không xem đó là ảnh CTG đã được kiểm chứng [UMP23, trang 3]."
      ],
      "sources": [
        {
          "id": "UMP23",
          "file": "5 Nhau_bong_non.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
          "pages": [
            2,
            3
          ],
          "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
        },
        {
          "id": "ELO46",
          "file": "ELOs Topic 46.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1LGkoGmu2vsQz17j40FGYtpQ2Q28pnHOO\\Y4 chị Mai Bùi\\SẢN KHOA\\LÝ THUYẾT\\Chương 6. Cấp Cứu Sản Khoa\\ELOs Topic 46.pdf",
          "pages": [
            1,
            2
          ],
          "label": "ELO Topic 46, trang 1–2: quản lý ban đầu và thái độ cấp cứu"
        }
      ],
      "note": "Bản hiệu chỉnh/chuẩn hóa câu trả lời tham khảo dựa giáo trình UMP đã đọc; đây không phải đáp án chính thức mới của bộ môn."
    },
    "guidelineNotes": [],
    "imageLabel": "Ảnh trang tài liệu nguồn (có thể chứa lời giải); mở sau khi tự trả lời."
  },
  {
    "id": "de-nho-ntd-26w",
    "title": "Đề nhớ tổng hợp · Ra huyết ở thai 26 tuần",
    "topic": "ntd",
    "tag": "Cốt lõi",
    "minutes": 5,
    "timeMode": "luyện tập",
    "stem": "Trạm 1: bn 26w ra huyết, hỏi bệnh sử tiền căn, tư vấn và khám Tiền căn có 1 lần sanh con có TSG, 1 lần VMC. Khám nhớ nghe tim thai trên mô hình Trạm 2: trả kết quả cls có siêu âm nhau bám đến lỗ trong ctc, còn lại bình thường.",
    "vitals": "",
    "originalQuestions": [
      "Trạm 1: hỏi bệnh sử tiền căn, tư vấn và khám.",
      "Trạm 2: trả kết quả cận lâm sàng có siêu âm nhau bám đến lỗ trong cổ tử cung, còn lại bình thường."
    ],
    "source": {
      "file": "OSCE Cũ (Tổng hợp).pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\ĐỀ\\OSCE Cũ (Tổng hợp).pdf",
      "pages": [
        22
      ],
      "examLabel": "Khác (1) · Phòng 3, trạm 1–2",
      "sourceKind": "Đề nhớ lại",
      "verified": true
    },
    "sourceAnswer": {
      "kind": "Không thấy đáp án",
      "file": "OSCE Cũ (Tổng hợp).pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\ĐỀ\\OSCE Cũ (Tổng hợp).pdf",
      "pages": [
        22
      ],
      "confidence": "Không thấy đáp án riêng cho trạm này trong bản nguồn đã đọc."
    },
    "rubric": [],
    "modelAnswer": [],
    "sources": [
      "UMP",
      "ELO",
      "RUBRIC"
    ],
    "images": [
      "assets/osce/r06-p22.png"
    ],
    "notes": "Trùng Phòng 3 trong tổng hợp đề nhớ.docx. Không có tên khóa/đợt thi được xác lập, không có đáp án riêng và không thêm kết luận xử trí. Các yêu cầu diễn đạt lại từ câu văn liền trong bản nhớ; không thêm câu hỏi mới.",
    "answerLabel": "Chưa thấy đáp án trong nguồn",
    "rubricLabel": "Không tự tạo thang chấm cho đề này",
    "originalAnswer": [],
    "referenceAnswer": [],
    "answerReview": {
      "status": "Chưa đủ dữ kiện",
      "summary": "Không có đáp án riêng của trạm trong bản đã đọc. Giữ nguyên đề và không tự tạo đáp án để thay khoảng trống.",
      "corrections": [],
      "correctedAnswer": [],
      "verifiedSources": []
    },
    "textbookCorrection": null,
    "guidelineNotes": [],
    "imageLabel": "Ảnh trang tài liệu nguồn (có thể chứa lời giải); mở sau khi tự trả lời."
  },
  {
    "id": "de-y19-2-ntd",
    "title": "Y19 đợt 2 · Tư vấn kết quả siêu âm nhau tiền đạo",
    "topic": "ntd",
    "tag": "Cốt lõi",
    "minutes": 5,
    "timeMode": "luyện tập",
    "stem": "Sản phụ đến vì có kết quả siêu âm nhau tiền đạo (thai >28w). Tư vấn.",
    "vitals": "",
    "originalQuestions": [
      "Tư vấn."
    ],
    "source": {
      "file": "Y19 OSCE Sản Đợt 2 Review.docx",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\Y19\\Y19 OSCE Sản Đợt 2 Review.docx",
      "pages": [
        "Mục Trạm 6 (DOCX)"
      ],
      "examLabel": "Y19 đợt 2 · Trạm 6",
      "sourceKind": "Đề nhớ lại",
      "verified": true
    },
    "sourceAnswer": {
      "kind": "Không thấy đáp án",
      "file": "Y19 OSCE Sản Đợt 2 Review.docx",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\Y19\\Y19 OSCE Sản Đợt 2 Review.docx",
      "pages": [
        "Mục Trạm 6 (DOCX)"
      ],
      "confidence": "Không thấy đáp án riêng cho trạm này trong bản nguồn đã đọc."
    },
    "rubric": [],
    "modelAnswer": [],
    "sources": [
      "UMP",
      "ELO",
      "RUBRIC"
    ],
    "images": [],
    "notes": "Bản review chỉ ghi một câu cho trạm này. Không có tuổi thai cụ thể ngoài “>28w”, không có sinh hiệu, tình trạng ra huyết hay đáp án. Không ghép thêm dữ kiện từ ca tư vấn khác để làm đề có vẻ đầy đủ.",
    "answerLabel": "Chưa thấy đáp án trong nguồn",
    "rubricLabel": "Không tự tạo thang chấm cho đề này",
    "originalAnswer": [],
    "referenceAnswer": [],
    "answerReview": {
      "status": "Chưa đủ dữ kiện",
      "summary": "Không có đáp án riêng của trạm trong bản đã đọc. Giữ nguyên đề và không tự tạo đáp án để thay khoảng trống.",
      "corrections": [],
      "correctedAnswer": [],
      "verifiedSources": []
    },
    "textbookCorrection": null,
    "guidelineNotes": [],
    "imageLabel": "Ảnh trang tài liệu nguồn (có thể chứa lời giải); mở sau khi tự trả lời."
  },
  {
    "id": "de-y19-3-nbn",
    "title": "Y19 đợt 3 · Tim thai 60 lần/phút, mẹ còn ổn",
    "topic": "nbn",
    "tag": "Cốt lõi",
    "minutes": 5,
    "timeMode": "luyện tập",
    "stem": "1 BN 3 tháng cuối đến khám than đau bụng Có sẵn tờ khám thai trong TCN III, bth, không nhau tiền đạo Tiếp cận cấp cứu Lưu ý: sinh hiệu bà này còn ổn, tim thai em bé 60 lần/ phút, âm đạo ra ít huyết, bụng gò cứng liên tục, không có kết quả CTG,",
    "vitals": "Nguyên văn nguồn: “sinh hiệu bà này còn ổn, tim thai em bé 60 lần/phút”.",
    "originalQuestions": [],
    "source": {
      "file": "OSCE-sản-đợt-3-Y19-1.pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\ĐỀ\\OSCE-sản-đợt-3-Y19-1.pdf",
      "pages": [
        4,
        5
      ],
      "examLabel": "Y19 đợt 3 · Trạm 6",
      "sourceKind": "Đề nhớ lại",
      "verified": true
    },
    "sourceAnswer": {
      "kind": "Đáp án tham khảo SV",
      "file": "OSCE-sản-đợt-3-Y19-1.pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\ĐỀ\\OSCE-sản-đợt-3-Y19-1.pdf",
      "pages": [
        4,
        5
      ],
      "confidence": "Đã đọc trực tiếp phần trả lời trong bản lưu; chưa có bằng chứng là đáp án chính thức của bộ môn."
    },
    "rubric": [],
    "modelAnswer": [
      "xử trí là la làng lên, mổ lấy thai cấp cứu, gọi NICU đón bé và vân vân (nói cho đủ...)"
    ],
    "sources": [
      "UMP",
      "ELO",
      "RUBRIC"
    ],
    "images": [
      "assets/osce/r04-p04.png",
      "assets/osce/r04-p05.png"
    ],
    "notes": "Đây là bản nhớ lại, không phải ảnh phiếu đề chính thức. Nguồn không ghi riêng danh sách câu hỏi của trạm 6. “Tiếp cận cấp cứu” là yêu cầu ghi trong bản nguồn. Không có kết quả CTG; không thêm băng CTG minh họa để thay đề.",
    "answerLabel": "Trích đáp án tham khảo trong kho; chưa xác thực là đáp án bộ môn",
    "rubricLabel": "Không tự tạo thang chấm cho đề này",
    "originalAnswer": [
      "xử trí là la làng lên, mổ lấy thai cấp cứu, gọi NICU đón bé và vân vân (nói cho đủ...)"
    ],
    "referenceAnswer": [
      "xử trí là la làng lên, mổ lấy thai cấp cứu, gọi NICU đón bé và vân vân (nói cho đủ...)"
    ],
    "answerReview": {
      "status": "Đã đối chiếu",
      "summary": "Hướng cấp cứu, mổ khẩn và gọi hồi sức sơ sinh trong đáp án phù hợp nguyên tắc UMP khi thai sống bị đe dọa và chưa thể sinh âm đạo nhanh. Giữ đúng mẹ còn sinh hiệu ổn; nguồn không có CTG hoặc dữ kiện đủ về khả năng sinh âm đạo.",
      "corrections": [],
      "correctedAnswer": [
        "Giữ nhận định cấp cứu của lời giải: mẹ còn sinh hiệu ổn nhưng tim thai 60 lần/phút, tử cung gò cứng liên tục và ra ít huyết gợi nhau bong non với thai bị đe dọa [UMP23, trang 2].",
        "Gọi hỗ trợ và hồi sức sơ sinh, chuẩn bị can thiệp khẩn. Theo UMP, nếu thai sống có khả năng cứu và chưa đủ điều kiện sinh âm đạo nhanh, mổ lấy thai ưu tiên; đánh giá mẹ, chuẩn bị máu và xử trí sản khoa song song [UMP23, trang 3].",
        "Không thêm sốc cho mẹ và không dựng một kết quả CTG: bản nguồn nói mẹ còn ổn và không có kết quả CTG. Cần xác nhận điều kiện đường sinh trong tiếp cận thực tế; bản nhớ không chép lại dữ kiện này."
      ],
      "verifiedSources": [
        {
          "id": "UMP23",
          "file": "5 Nhau_bong_non.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
          "pages": [
            2,
            3
          ],
          "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
        },
        {
          "id": "ELO46",
          "file": "ELOs Topic 46.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1LGkoGmu2vsQz17j40FGYtpQ2Q28pnHOO\\Y4 chị Mai Bùi\\SẢN KHOA\\LÝ THUYẾT\\Chương 6. Cấp Cứu Sản Khoa\\ELOs Topic 46.pdf",
          "pages": [
            1,
            2
          ],
          "label": "ELO Topic 46, trang 1–2: quản lý ban đầu và thái độ cấp cứu"
        }
      ]
    },
    "textbookCorrection": {
      "answer": [
        "Giữ nhận định cấp cứu của lời giải: mẹ còn sinh hiệu ổn nhưng tim thai 60 lần/phút, tử cung gò cứng liên tục và ra ít huyết gợi nhau bong non với thai bị đe dọa [UMP23, trang 2].",
        "Gọi hỗ trợ và hồi sức sơ sinh, chuẩn bị can thiệp khẩn. Theo UMP, nếu thai sống có khả năng cứu và chưa đủ điều kiện sinh âm đạo nhanh, mổ lấy thai ưu tiên; đánh giá mẹ, chuẩn bị máu và xử trí sản khoa song song [UMP23, trang 3].",
        "Không thêm sốc cho mẹ và không dựng một kết quả CTG: bản nguồn nói mẹ còn ổn và không có kết quả CTG. Cần xác nhận điều kiện đường sinh trong tiếp cận thực tế; bản nhớ không chép lại dữ kiện này."
      ],
      "sources": [
        {
          "id": "UMP23",
          "file": "5 Nhau_bong_non.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\5 Nhau_bong_non.pdf",
          "pages": [
            2,
            3
          ],
          "label": "Giáo trình UMP: Nhau bong non, trang 2–3; đã đọc trực tiếp"
        },
        {
          "id": "ELO46",
          "file": "ELOs Topic 46.pdf",
          "path": "G:\\.shortcut-targets-by-id\\1LGkoGmu2vsQz17j40FGYtpQ2Q28pnHOO\\Y4 chị Mai Bùi\\SẢN KHOA\\LÝ THUYẾT\\Chương 6. Cấp Cứu Sản Khoa\\ELOs Topic 46.pdf",
          "pages": [
            1,
            2
          ],
          "label": "ELO Topic 46, trang 1–2: quản lý ban đầu và thái độ cấp cứu"
        }
      ],
      "note": "Bản hiệu chỉnh/chuẩn hóa câu trả lời tham khảo dựa giáo trình UMP đã đọc; đây không phải đáp án chính thức mới của bộ môn."
    },
    "guidelineNotes": [],
    "imageLabel": "Ảnh trang tài liệu nguồn (có thể chứa lời giải); mở sau khi tự trả lời."
  },
  {
    "id": "de-y21-2-tolac",
    "title": "Y21 đợt 2 · Xin tư vấn sinh thường sau mổ",
    "topic": "tolac",
    "tag": "Mở rộng",
    "minutes": 5,
    "timeMode": "luyện tập",
    "stem": "Khai thác bệnh sử + tư vấn - 2 năm trước mổ ngang đoạn dưới vì ngôi mông. Đợt này thai 39w vô hỏi sinh thường được không - Có 3 cái giấy, 2 giấy sổ khám thai, 1 giấy xuất viện đợt trước. Phải hỏi mới đưa ra - Trạm này khá dễ, hỏi bệnh rồi tư vấn thôi",
    "vitals": "",
    "originalQuestions": [
      "Khai thác bệnh sử + tư vấn."
    ],
    "source": {
      "file": "Đề OSCE Y21 - Đợt 2.pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\Osce\\Đề OSCE Y21 - Đợt 2.pdf",
      "pages": [
        2
      ],
      "examLabel": "Y21 đợt 2 · Trạm 5",
      "sourceKind": "Đề nhớ lại",
      "verified": true
    },
    "sourceAnswer": {
      "kind": "Không thấy đáp án",
      "file": "Đề OSCE Y21 - Đợt 2.pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\Osce\\Đề OSCE Y21 - Đợt 2.pdf",
      "pages": [
        2
      ],
      "confidence": "Không thấy đáp án riêng cho trạm này trong bản nguồn đã đọc."
    },
    "rubric": [],
    "modelAnswer": [],
    "sources": [
      "UMP",
      "ELO",
      "RUBRIC"
    ],
    "images": [
      "assets/osce/r01-p02.png"
    ],
    "notes": "Bản nhớ ghi “Biên soạn: MG - QC - MH - MQ”. Trùng bản cùng tên trong Y20-Y21-Y22, nhưng bản đó có thêm chú giải ngoài trạm; chọn bản ngắn sạch. Không thấy đáp án riêng, không tự gán script tư vấn TOLAC chung thành đáp án của kỳ thi.",
    "answerLabel": "Chưa thấy đáp án trong nguồn",
    "rubricLabel": "Không tự tạo thang chấm cho đề này",
    "originalAnswer": [],
    "referenceAnswer": [],
    "answerReview": {
      "status": "Chưa đủ dữ kiện",
      "summary": "Không có đáp án riêng của trạm trong bản đã đọc. Giữ nguyên đề và không tự tạo đáp án để thay khoảng trống.",
      "corrections": [],
      "correctedAnswer": [],
      "verifiedSources": []
    },
    "textbookCorrection": null,
    "guidelineNotes": [],
    "imageLabel": "Ảnh trang tài liệu nguồn (có thể chứa lời giải); mở sau khi tự trả lời."
  },
  {
    "id": "de-y22-1-tolac",
    "title": "Y22 đợt 1 · TOLAC ở thai phụ 22 tuổi",
    "topic": "tolac",
    "tag": "Mở rộng",
    "minutes": 5,
    "timeMode": "luyện tập",
    "stem": "Bối cảnh Bạn là bác sĩ làm việc tại phòng khám của bệnh viện phụ sản R. Một thai phụ 22 tuổi đến tư vấn về thực hiện TOLAC Yêu cầu Hỏi thông tin liên quan đến vấn đề và tư vấn vấn đề của bà ta. Bệnh nhân chuẩn nói lý do đến khám: “Bác sĩ ơi tui hiện tại thai 40 tuần, tui có 1 lần mổ lấy thai 2 năm trước, không biết lần này tui có thể sanh thường được không ạ” Thông tin Sản phụ 22 tuổi, nhân viên văn phòng, thai 40 ngày, chưa có dấu hiệu chuyển dạ, đến để tư vấn thực hiện TOLAC Tiền căn: - Nội ngoại khoa: không ghi nhận bất thường. - Gia đình: không ghi nhận bất thường. - Sản khoa: ● PARA: 1001. Năm 2023, 1 lần sanh mổ vì thai yếu, con 3300 gram, tuổi thai đủ tháng, hậu phẫu 5 ngày, không biến chứng mẹ và con, bé hiện khỏe. - Phụ khoa: ● Không viêm nhiễm phụ khoa. ● Không chấn thương, phẫu thuật vùng bụng, chậu. ● Không thực hiện thủ thuật gì trong lòng tử cung. Thai kỳ hiện tại: thai 40 tuần, thông tin sổ khám thai từ đầu thai kỳ mọi thứ đều bình thường. - Thông tin khám hôm nay là con 3000 gram, ngôi chỏm, độ lọt -2, ối còn, cổ tử cung mở 2cm, xóa 70%. - Vết mổ cũ ngang trên vệ, kích thước 10 cm, không đau. (Trạm này giấy tờ của bệnh nhân chuẩn sẽ là sổ khám thai, 1 tờ giấy ra viện (tờ này sẽ được giấu dưới gối nên phải xin mới được đưa cho)).",
    "vitals": "",
    "originalQuestions": [
      "Vậy tui có thực hiện sanh thường được không bác sĩ?",
      "Sanh thường có nguy hiểm gì không bác sĩ, sanh mổ có nguy hiểm gì?",
      "Theo bác sĩ tui nên sanh thường hay sanh mổ?"
    ],
    "source": {
      "file": "OSCE SẢN Y22 - Đợt 1.pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\Y20-Y21-Y22\\OSCE SẢN Y22 - Đợt 1.pdf",
      "pages": [
        5
      ],
      "examLabel": "Y22 đợt 1 · Trạm 5",
      "sourceKind": "Đề nhớ lại",
      "verified": true
    },
    "sourceAnswer": {
      "kind": "Không thấy đáp án",
      "file": "OSCE SẢN Y22 - Đợt 1.pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\Y20-Y21-Y22\\OSCE SẢN Y22 - Đợt 1.pdf",
      "pages": [
        5
      ],
      "confidence": "Không thấy đáp án riêng cho trạm này trong bản nguồn đã đọc."
    },
    "rubric": [],
    "modelAnswer": [],
    "sources": [
      "UMP",
      "ELO",
      "RUBRIC"
    ],
    "images": [
      "assets/osce/r03-p05.png"
    ],
    "notes": "Bản nhớ có dữ liệu vai diễn và câu hỏi bệnh nhân chuẩn, nhưng không thấy phần đáp án của trạm này. Giữ nguyên lỗi/mâu thuẫn: một dòng ghi “thai 40 ngày”, trong khi lời bệnh nhân và mục thai kỳ hiện tại cùng ghi “40 tuần”; cần đối chiếu ảnh nguồn. Sẹo ngoài da “ngang trên vệ” không tự xác nhận đường rạch cơ tử cung; đề có nhắc giấy ra viện phải xin. Không tự thêm nội dung của giấy đó khi nguồn không chép lại.",
    "answerLabel": "Chưa thấy đáp án trong nguồn",
    "rubricLabel": "Không tự tạo thang chấm cho đề này",
    "originalAnswer": [],
    "referenceAnswer": [],
    "answerReview": {
      "status": "Chưa đủ dữ kiện",
      "summary": "Không có đáp án riêng của trạm trong bản đã đọc. Giữ nguyên đề và không tự tạo đáp án để thay khoảng trống.",
      "corrections": [],
      "correctedAnswer": [],
      "verifiedSources": []
    },
    "textbookCorrection": null,
    "guidelineNotes": [],
    "imageLabel": "Ảnh trang tài liệu nguồn (có thể chứa lời giải); mở sau khi tự trả lời."
  },
  {
    "id": "de-nho-ntd-36w-lan4",
    "title": "Đề nhớ tổng hợp · Nhau tiền đạo ra huyết lần thứ 4",
    "topic": "ntd",
    "tag": "Cốt lõi",
    "minutes": 5,
    "timeMode": "luyện tập",
    "stem": "Nhau tiền đạo trung tâm đang ra huyết, 36 tuần, nhập viện 3 lần rồi lần này là lần thứ 4.",
    "vitals": "",
    "originalQuestions": [
      "Nhận định tình trạng và đưa ra hướng xử trí cho BN."
    ],
    "source": {
      "file": "OSCE Cũ (Tổng hợp).pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\ĐỀ\\OSCE Cũ (Tổng hợp).pdf",
      "pages": [
        24
      ],
      "examLabel": "Khác (3) · Trạm 2",
      "sourceKind": "Đề nhớ lại",
      "verified": true
    },
    "sourceAnswer": {
      "kind": "Không thấy đáp án",
      "file": "OSCE Cũ (Tổng hợp).pdf",
      "path": "G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\ĐỀ\\OSCE Cũ (Tổng hợp).pdf",
      "pages": [
        24
      ],
      "confidence": "Không thấy đáp án riêng cho trạm này trong bản nguồn đã đọc."
    },
    "rubric": [],
    "modelAnswer": [],
    "sources": [
      "UMP",
      "ELO",
      "RUBRIC"
    ],
    "images": [
      "assets/osce/r06-p24.png"
    ],
    "notes": "Trang 24 là ảnh; đã OCR bằng Tesseract vie và đối chiếu trực tiếp ảnh trang gốc. Chưa xác định khóa/đợt, chưa thấy đáp án. Trang ghi format thi: mỗi phòng 1 phút đọc đề, giảng viên chấm qua camera; không có thời lượng làm trạm, nên đồng hồ 5 phút trên web là chế độ tự luyện.",
    "answerLabel": "Chưa thấy đáp án trong nguồn",
    "rubricLabel": "Không tự tạo thang chấm cho đề này",
    "originalAnswer": [],
    "referenceAnswer": [],
    "answerReview": {
      "status": "Chưa đủ dữ kiện",
      "summary": "Không có đáp án riêng của trạm trong bản đã đọc. Giữ nguyên đề và không tự tạo đáp án để thay khoảng trống.",
      "corrections": [],
      "correctedAnswer": [],
      "verifiedSources": []
    },
    "textbookCorrection": null,
    "guidelineNotes": [],
    "imageLabel": "Ảnh trang tài liệu nguồn (có thể chứa lời giải); mở sau khi tự trả lời."
  }
];

/* Đọc theo chủ đề cho trạm thiếu key: không chuyển thành đáp án riêng của đề. */
(() => {
  const ntd = {
    title: 'Đoạn tham khảo theo chủ đề, không phải đáp án riêng của đề · Nhau tiền đạo',
    file: '4 Nhau_tien_dao.pdf',
    path: 'G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\4 Nhau_tien_dao.pdf',
    pages: [3, 4],
    authors: 'Trần Nhật Huy, Âu Nhựt Luân · Bộ môn Phụ Sản, Đại học Y Dược TP. Hồ Chí Minh',
    sourceKind: 'Giáo trình UMP trong kho',
    verified: true,
    excerpt: [
      'Xuất huyết âm đạo trong ba tháng cuối thai kỳ không kèm theo đau bụng là một dấu hiệu điển hình của nhau tiền đạo.',
      'Khả năng tự cầm máu sau sanh của cuộc sanh với nhau tiền đạo rất kém.',
      'Quyết định chấm dứt thai kỳ phải dựa vào tuổi thai và tình trạng lâm sàng của thai phụ.',
      'Nếu chảy máu là trầm trọng hoặc thai nhi đã trưởng thành thì chấm dứt thai kỳ là lựa chọn.',
      'Đối với nhau tiền đạo toàn phần (trung tâm) và một phần (bán trung tâm) thì mổ sanh là bắt buộc khi có quyết định chấm dứt thai kỳ, ngoại trừ trong trường hợp thai nhi quá nhỏ (dưới 20 tuần) và không có khả năng sống sót.',
      'Trong điều kiện bệnh nhân ổn định, mổ lấy thai thường được chỉ định ở tuổi thai 37-38 tuần.',
      'Đôi khi phải chấm dứt thai kỳ sớm hơn nếu chảy máu nhiều hoặc thai phụ đi vào chuyển dạ sinh non.'
    ],
    note: 'Trích nguyên văn đã làm sạch xuống dòng, từ trang 3–4 của đúng bài Nhau tiền đạo UMP. Mốc 37–38 tuần là quan điểm của bản giáo trình đang lưu, trong điều kiện người bệnh ổn định; không phải kết luận xử trí cá thể hóa cho bất kỳ đề thiếu dữ kiện nào. Trang đầu bài không ghi năm xuất bản; mục đọc thêm có Beckmann ấn bản 8 (2018), không đủ để khẳng định năm xuất bản bài hoặc gắn nhãn hướng dẫn 2026.'
  };
  const tolac = {
    title: 'Đoạn tham khảo theo chủ đề, không phải đáp án riêng của đề · TOLAC/VBAC',
    file: '7 Theo dõi sanh ngả âm đạo trên vết mổ cũ.pdf',
    path: 'G:\\.shortcut-targets-by-id\\1x5vGyHFgiprAye4jvH8EERK8BCRuhAuo\\SẢN Y4\\1. SẢN\\13. ÔN OSCE SẢN\\OSCE sản y4\\zzzz\\Chủ đề 6\\7 Theo dõi sanh ngả âm đạo trên vết mổ cũ.pdf',
    pages: [1, 2, 3],
    authors: 'Nguyễn Hồng Hoa, Nguyễn Thị Bích Quy, Vũ Thị Thục Anh · Bộ môn Phụ Sản, Đại học Y Dược TP. Hồ Chí Minh',
    sourceKind: 'Giáo trình UMP trong kho',
    verified: true,
    excerpt: [
      'Sanh ngã âm đạo trên tử cung có sẹo mổ lấy thai cũ (VBAC: vaginal birth after cesarean): sinh ngả âm đạo thành công ở thai phụ có sẹo mổ lấy thai trước đó',
      'Thử thách sinh ngã âm đạo trên tử cung có sẹo mổ cũ (TOLAC: trial of labor after caesarean): kế hoạch sinh ngả âm đạo an toàn cho một thai phụ có sẹo mổ lấy thai',
      'Vết mổ dọc thân hay hình chữ T trên cơ tử cung, tiền căn vỡ tử cung, vết mổ trên thân tử cung, sản phụ từ chối sinh ngã âm đạo, chống chỉ định về mặt sản khoa như nhau tiền đạo…, cơ sở không thích hợp là những chống chỉ định tuyệt đối của TOLAC.',
      'TOLAC chỉ được thực hiện ở cơ sở có thể theo dõi tim thai bằng monitoring và có đủ phương tiện và nhân lực giải quyết nếu có tình trạng vỡ tử cung xảy ra',
      'Khi một sản phụ nhập phòng sinh với sẹo mổ lấy thai, các chuyên khoa sản, sơ sinh, nhi, gây mê hồi sức cùng phòng mổ và các phương tiện hồi sức (bao gồm các chế phẩm máu) cần sẵn sàng trong trường hợp biến chứng xảy ra',
      'Sản phụ nên được theo dõi bằng monitor liên tục từ khi cơn co chuyển dạ bắt đầu xuất hiện, và trong suốt quá trình chuyển dạ',
      'Khởi phát chuyển dạ làm tăng nguy cơ vỡ tử cung so với chuyển dạ tự nhiên hay mổ lấy thai lại',
      'Bất thường trên tim thai là dấu hiệu báo hiệu sớm và có ý nghĩa nhất của vỡ tử cung khi thực hiện TOLAC (xem thêm ở bài vỡ tử cung).'
    ],
    note: 'Trích nguyên văn đã làm sạch xuống dòng từ bài UMP, trang 1–3. Đây là khung đọc để đối chiếu hồ sơ, điều kiện cơ sở, theo dõi và nguy cơ; không xác nhận thai phụ của đề đủ điều kiện TOLAC khi chưa có giấy ra viện hoặc dữ kiện cần thiết. Không lấy sẹo da để tự suy đường rạch cơ tử cung, không dùng một độ dày sẹo hoặc một tỷ lệ trong sách làm bảo đảm an toàn cá nhân. Không gán script SV thành đáp án bộ môn.'
  };
  window.OSCE_REFERENCE_READINGS = {ntd, tolac};
  for (const c of window.OSCE_CASES) {
    c.referenceReading = [];
    if (!c.modelAnswer.length && c.topic === 'ntd') c.referenceReading = [ntd];
    if (!c.modelAnswer.length && c.topic === 'tolac') c.referenceReading = [tolac];
    if (c.referenceReading.length) {
      c.referenceReadingLabel = 'Đọc theo chủ đề · không phải đáp án riêng của đề';
      c.notes += ' Có đoạn tham khảo từ giáo trình UMP theo chủ đề bên dưới; phần này không lấp dữ kiện còn thiếu và không thay đổi trạng thái chưa có đáp án riêng.';
    }
  }
})();
