import { Question } from "../types/question";

export const PRACTICE_QUESTIONS: Question[] = [
  // D13: Những chiếc đĩa táo bị xáo trộn
  {
    id: "D13",
    title: "Những chiếc đĩa táo bị xáo trộn",
    order: 13,
    part: "B",
    status: "available",
    difficulty: 2,
    skills: ["constraint", "range_reasoning", "pattern"],
    problem: {
      text: "Ban đầu có 5 chiếc đĩa.\n\nNếu đĩa thứ nhất có x quả táo thì 5 đĩa lần lượt có:\nx, 2x, 3x, 4x, 5x quả táo.\n\nSau đó, ở mỗi đĩa, Khỉ Nâu có thể thêm hoặc bớt nhiều nhất 3 quả.\nCuối cùng số táo trên 5 đĩa lần lượt là:\n7, 9, 16, 18, 22 quả.\n\nHỏi ban đầu đĩa thứ nhất có bao nhiêu quả táo?",
      answerType: "number",
      unit: "quả",
      placeholder: "Nhập số táo đĩa thứ nhất (x)...",
    },
    answer: {
      value: 5,
      displayValue: "5 quả",
    },
    hints: [
      {
        level: 1,
        text: "Hãy thử một giá trị x rồi kiểm tra cả 5 đĩa.",
      },
      {
        level: 2,
        text: "Mỗi số ban đầu được phép lệch số cuối cùng nhiều nhất 3.",
      },
      {
        level: 3,
        text: "Hãy tìm x sao cho |kx - observed| ≤ 3 với cả 5 đĩa.",
      },
    ],
    simulation: {
      type: "toleranceLab",
      name: "Phòng thí nghiệm Sai lệch Đĩa táo",
      config: {
        multipliers: [1, 2, 3, 4, 5],
        observed: [7, 9, 16, 18, 22],
        tolerance: 3,
        minX: 1,
        maxX: 10,
      },
    },
    teachingPoint:
      "Biến điều kiện ‘sai lệch không quá 3’ thành một khoảng giá trị rồi tìm giá trị thỏa mãn tất cả các khoảng.",
    explanation: [
      "Bước 1: Chuyển đổi điều kiện sai lệch không quá 3 thành bất đẳng thức: Ở đĩa thứ k (k = 1, 2, 3, 4, 5), số táo ban đầu là k·x, số táo sau xáo trộn là observed[k-1]. Điều kiện: |k·x - observed| ≤ 3, tức là: observed - 3 ≤ k·x ≤ observed + 3.",
      "Bước 2: Lập khoảng giá trị cho x ở từng đĩa:\n• Đĩa 1: |x - 7| ≤ 3 ⇒ 4 ≤ x ≤ 10\n• Đĩa 2: |2x - 9| ≤ 3 ⇒ 6 ≤ 2x ≤ 12 ⇒ 3 ≤ x ≤ 6\n• Đĩa 3: |3x - 16| ≤ 3 ⇒ 13 ≤ 3x ≤ 19 ⇒ x ∈ {5, 6} (vì 3×5=15, 3×6=18)\n• Đĩa 4: |4x - 18| ≤ 3 ⇒ 15 ≤ 4x ≤ 21 ⇒ x ∈ {4, 5} (vì 4×4=16, 4×5=20)\n• Đĩa 5: |5x - 22| ≤ 3 ⇒ 19 ≤ 5x ≤ 25 ⇒ x ∈ {4, 5} (vì 5×4=20, 5×5=25).",
      "Bước 3: Tìm giao của tất cả 5 điều kiện:\nGiao của các tập hợp giá trị x nguyên khả dĩ:\n[4, 10] ∩ [3, 6] ∩ {5, 6} ∩ {4, 5} ∩ {4, 5} = {5}.",
      "Kết luận: Giá trị duy nhất thỏa mãn cả 5 đĩa là x = 5 quả táo.",
    ],
  },

  // D14: Cỗ máy tính điểm cơ số 3
  {
    id: "D14",
    title: "Cỗ máy tính điểm cơ số 3",
    order: 14,
    part: "B",
    status: "available",
    difficulty: 2,
    skills: ["number_representation", "carry", "pattern"],
    problem: {
      text: "Một cỗ máy tính điểm đặc biệt gồm 4 tầng hiển thị từ dưới lên trên.\n\nQuy tắc ghi điểm của máy như sau:\n• Mỗi tầng chỉ có thể giữ tối đa 2 hạt ở bên trái.\n• Mỗi khi một tầng nhận đủ 3 hạt, máy sẽ tự động thu hồi 3 hạt này (reset về 0) và chuyển (nhớ) 1 hạt lên tầng ngay phía trên nó.\n• Tầng 1 (tầng dưới cùng): mỗi hạt đại diện cho 1 điểm.\n\nHỏi trước khi cỗ máy bị tràn số (tức là cả 4 tầng đều đạt tối đa 2 hạt mà chưa bị chuyển lên trên), cỗ máy có thể hiển thị số điểm lớn nhất là bao nhiêu?",
      answerType: "number",
      unit: "điểm",
      placeholder: "Nhập số điểm lớn nhất...",
    },
    answer: {
      value: 80,
      displayValue: "80 điểm",
    },
    hints: [
      {
        level: 1,
        text: "Hãy chú ý điều gì xảy ra sau mỗi 3 lần tăng.",
      },
      {
        level: 2,
        text: "Mỗi tầng phía trên có giá trị gấp 3 tầng phía dưới.",
      },
      {
        level: 3,
        text: "Trước khi lỗi, mỗi tầng có thể chứa nhiều nhất 2 hạt bên trái.",
      },
    ],
    simulation: {
      type: "base3AbacusLab",
      name: "Bàn tính Cơ số 3 Tự động nhớ",
      config: {
        levels: 4,
        base: 3,
        maxDigit: 2,
      },
    },
    teachingPoint: "Mỗi vị trí phía trên có giá trị gấp 3 lần vị trí phía dưới.",
    explanation: [
      "Bước 1: Xác định giá trị đơn vị của 1 hạt ở từng tầng:\n• Tầng 1 (dưới cùng): Mỗi hạt = 1 điểm.\n• Tầng 2: Cứ 3 hạt tầng 1 đổi được 1 hạt tầng 2 ⇒ 1 hạt tầng 2 = 3 điểm.\n• Tầng 3: Cứ 3 hạt tầng 2 đổi được 1 hạt tầng 3 ⇒ 1 hạt tầng 3 = 3 × 3 = 9 điểm.\n• Tầng 4 (trên cùng): Cứ 3 hạt tầng 3 đổi được 1 hạt tầng 4 ⇒ 1 hạt tầng 4 = 3 × 9 = 27 điểm.",
      "Bước 2: Tìm cấu hình cực đại không bị tràn số:\nVì mỗi tầng chỉ có thể chứa tối đa 2 hạt bên trái trước khi đủ 3 hạt để carry lên tầng trên, nên trạng thái lớn nhất hiển thị được là cả 4 tầng đều có đúng 2 hạt.",
      "Bước 3: Tính tổng số điểm lớn nhất:\nTổng = 2 × 27 + 2 × 9 + 2 × 3 + 2 × 1 = 54 + 18 + 6 + 2 = 80 điểm.\n(Hoặc dùng công thức cấp số nhân: 3⁴ - 1 = 81 - 1 = 80).",
      "Kết luận: Cỗ máy hiển thị được số điểm lớn nhất là 80 điểm.",
    ],
  },

  // D15: Những con số trên khối lập phương
  {
    id: "D15",
    title: "Những con số trên khối lập phương",
    order: 15,
    part: "B",
    status: "available",
    difficulty: 3,
    skills: ["spatial_reasoning", "constraint", "optimization"],
    problem: {
      text: "Người ta viết 6 số nguyên dương phân biệt lên 6 mặt của một khối lập phương, mỗi mặt một số.\n\nQuy tắc: Hai mặt có chung một cạnh (hai mặt kề nhau) thì hai số viết trên hai mặt đó phải chênh lệch nhau ít nhất là 2 (tức là hiệu giữa chúng không được bằng 0 hoặc 1).\n\nHỏi tổng của 6 số trên khối lập phương có thể nhận giá trị nhỏ nhất là bao nhiêu?",
      answerType: "number",
      unit: "",
      placeholder: "Nhập tổng nhỏ nhất...",
    },
    answer: {
      value: 27,
      displayValue: "27",
    },
    hints: [
      {
        level: 1,
        text: "Không phải mọi cặp mặt của khối lập phương đều kề nhau.",
      },
      {
        level: 2,
        text: "Mỗi mặt chỉ không kề đúng một mặt: mặt đối diện.",
      },
      {
        level: 3,
        text: "Hãy thử ghép những số gần nhau lên các cặp mặt đối diện.",
      },
    ],
    simulation: {
      type: "cubeConstraintLab",
      name: "Phòng thí nghiệm Ràng buộc Khối lập phương",
      config: {
        faces: ["top", "bottom", "front", "back", "left", "right"],
        minValue: 1,
        allDifferent: true,
        adjacentDifferenceAtLeast: 2,
      },
    },
    teachingPoint:
      "Khi bài toán có nhiều điều kiện không được xảy ra, hãy mô hình hóa quan hệ giữa các vị trí trước khi thử số.",
    explanation: [
      "Bước 1: Mô hình hóa cấu trúc hình học khối lập phương:\nKhối lập phương có 6 mặt. Mỗi mặt kề với 4 mặt khác và đối diện với đúng 1 mặt.\nDo đó, 6 mặt chia thành đúng 3 cặp mặt đối diện nhau: (Trên - Dưới), (Trước - Sau), (Trái - Phải).",
      "Bước 2: Phân tích điều kiện chênh lệch ít nhất 2:\nHai mặt kề nhau phải có hiệu ≥ 2. Nghĩa là hai số có hiệu bằng 1 (chênh lệch 1) BẮT BUỘC phải nằm ở hai mặt KHÔNG kề nhau, tức là hai mặt ĐỐI DIỆN nhau!\nVì chỉ có 3 cặp mặt đối diện, ta chỉ có thể tạo ra tối đa 3 cặp số chênh nhau 1.",
      "Bước 3: Lựa chọn bộ số nhỏ nhất bắt đầu từ 1:\n• Cặp đối diện 1: Ta chọn {1, 2} (hiệu = 1, đặt ở 2 mặt đối diện nhau).\n• Mặt nào chứa số 2 cũng sẽ kề với 4 mặt còn lại. Do đó các số ở các mặt còn lại phải chênh với 2 ít nhất là 2. Số nhỏ nhất tiếp theo khả dĩ là 4 (vì 3 kề với 2 sẽ chênh 1 vi phạm).\n• Cặp đối diện 2: Ghép 4 với số tiếp theo chênh 1: chọn {4, 5}.\n• Tương tự, số tiếp theo không được chênh 1 với 5 nên số nhỏ nhất tiếp theo là 7.\n• Cặp đối diện 3: Ghép 7 với {7, 8}.",
      "Bước 4: Kiểm tra và tính tổng:\nBộ số {1, 2, 4, 5, 7, 8} gồm 6 số nguyên dương phân biệt. Mọi cặp mặt kề nhau đều lấy 1 số từ cặp này và 1 số từ cặp kia, khoảng cách nhỏ nhất giữa các cặp là: 4 - 2 = 2 ≥ 2, 7 - 5 = 2 ≥ 2. Tất cả các điều kiện đều thỏa mãn tuyệt đối.",
      "Bước 5: Tính tổng nhỏ nhất: 1 + 2 + 4 + 5 + 7 + 8 = 27.",
      "Kết luận: Tổng nhỏ nhất có thể nhận của 6 số là 27.",
    ],
  },

  // D16: BẢNG SỐ 1 - 2 - 3 (LATIN SQUARE 3x3)
  {
    id: "D16",
    title: "Bảng số 1 – 2 – 3",
    order: 16,
    part: "B",
    status: "available",
    difficulty: 2,
    skills: ["combinatorics", "constraint", "latin_square"],
    problem: {
      text: "Điền các chữ số 1, 2, 3 vào bảng 3×3 sao cho:\n\n• Mỗi hàng chứa đủ 1, 2, 3;\n• Mỗi cột chứa đủ 1, 2, 3.\n\nHỏi có tất cả bao nhiêu bảng khác nhau?",
      answerType: "number",
      placeholder: "Nhập số lượng bảng khác nhau...",
      unit: "bảng",
    },
    answer: {
      type: "numeric",
      value: 12,
      unit: "bảng",
      tolerance: 0,
    },
    hints: [
      {
        level: 1,
        title: "Bắt đầu từ hàng đầu tiên",
        cost: "1 sao tư duy",
        content: "Bắt đầu từ một hàng hợp lệ trước.",
      },
      {
        level: 2,
        title: "Hoán vị hàng",
        cost: "2 sao tư duy",
        content: "Mỗi hàng phải là một hoán vị của 1,2,3.",
      },
      {
        level: 3,
        title: "Ràng buộc cột xác định hàng cuối",
        cost: "3 sao tư duy",
        content: "Sau khi chọn hai hàng đầu, hàng cuối gần như bị xác định.",
      },
    ],
    simulation: {
      type: "latinSquareLab",
      config: {
        size: 3,
        symbols: [1, 2, 3],
        requireEachSymbolPerRow: true,
        requireEachSymbolPerColumn: true,
      },
    },
    teachingPoint: "Ràng buộc ở hàng và cột giúp giảm mạnh số trường hợp cần thử.",
    explanation: [
      "Bước 1: Chọn hàng đầu tiên:\nHàng đầu tiên là một hoán vị của {1, 2, 3}. Số cách xếp hàng 1 là 3! = 3 × 2 × 1 = 6 cách.",
      "Bước 2: Chọn hàng thứ hai không trùng cột:\nGiả sử hàng 1 là (1, 2, 3). Hàng 2 không được có số nào trùng cột với hàng 1. Do đó hàng 2 chỉ có thể là (2, 3, 1) hoặc (3, 1, 2) (có đúng 2 cách).",
      "Bước 3: Hàng thứ ba bị xác định duy nhất:\nỞ mỗi cột, hàng 1 và hàng 2 đã lấy 2 số khác nhau. Vì vậy ở mỗi cột của hàng 3 chỉ còn đúng 1 số duy nhất chưa dùng → có đúng 1 cách điền hàng 3.",
      "Bước 4: Tính tổng số bảng theo quy tắc nhân:\nTổng số bảng = 6 (hàng 1) × 2 (hàng 2) × 1 (hàng 3) = 12 bảng khác nhau.",
      "Kết luận: Có tất cả 12 bảng thỏa mãn yêu cầu đề bài.",
    ],
  },

  // D17: MẬT MÃ CỦA GẤU TRÚC (CODE SCANNER)
  {
    id: "D17",
    title: "Mật mã của Gấu Trúc",
    order: 17,
    part: "B",
    status: "available",
    difficulty: 1,
    skills: ["logic", "elimination", "position_reasoning"],
    problem: {
      text: "Mật mã gồm các chữ số 1 đến 9, mỗi chữ số xuất hiện đúng một lần.\n\nMáy quét thử:\n1 2 2 2 2 2 2 2 2\n\nvà báo: “Không có chữ số nào nằm đúng vị trí.”\n\nHỏi chữ số đầu tiên của mật mã là gì?",
      answerType: "number",
      placeholder: "Nhập chữ số đầu tiên...",
    },
    answer: {
      type: "numeric",
      value: 2,
      tolerance: 0,
    },
    hints: [
      {
        level: 1,
        title: "Ý nghĩa phản hồi từ máy",
        cost: "1 sao tư duy",
        content: "Máy nói rằng không vị trí nào của dãy thử là đúng.",
      },
      {
        level: 2,
        title: "Xét vị trí 2 đến 9",
        cost: "2 sao tư duy",
        content: "Vậy vị trí 2 đến 9 có thể chứa số 2 không?",
      },
      {
        level: 3,
        title: "Số 2 bắt buộc phải xuất hiện",
        cost: "3 sao tư duy",
        content: "Số 2 vẫn bắt buộc phải xuất hiện đúng một lần trong mật mã.",
      },
    ],
    simulation: {
      type: "codeScannerLab",
      config: {
        digits: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        allDifferent: true,
        scan: [1, 2, 2, 2, 2, 2, 2, 2, 2],
        correctPositionCount: 0,
      },
    },
    teachingPoint: "Một thông tin phủ định có thể loại bỏ rất nhiều khả năng cùng lúc.",
    explanation: [
      "Bước 1: Phân tích kết quả quét thử:\nDãy quét thử nghiệm là [1, 2, 2, 2, 2, 2, 2, 2, 2] và máy báo có 0 vị trí đúng. Điều này nghĩa là:\n• Vị trí 1 không thể là chữ số 1.\n• Các vị trí từ 2 đến 9 đều KHÔNG THỂ là chữ số 2.",
      "Bước 2: Ràng buộc bắt buộc của mật mã:\nMật mã gồm đủ 9 chữ số từ 1 đến 9, mỗi chữ số xuất hiện đúng một lần. Do đó, chữ số 2 bắt buộc phải xuất hiện ở một trong 9 vị trí của mật mã.",
      "Bước 3: Loại trừ để tìm vị trí của số 2:\nCác vị trí 2, 3, 4, 5, 6, 7, 8, 9 đều đã bị loại trừ không thể chứa số 2. Vì vậy chữ số 2 chỉ còn DUY NHẤT một vị trí để đứng: đó là vị trí 1.",
      "Kết luận: Chữ số đầu tiên của mật mã bắt buộc là 2.",
    ],
  },

  // D18: CHUNG CƯ CHÓ VÀ MÈO (NUMBER FILTER)
  {
    id: "D18",
    title: "Chung cư chó và mèo",
    order: 18,
    part: "B",
    status: "available",
    difficulty: 2,
    skills: ["number_filter", "divisibility", "logical_and"],
    problem: {
      text: "Có 300 căn hộ, đánh số từ 1 đến 300.\n\nMèo sống ở các căn hộ có số chia hết cho 5.\nChó sống ở các căn hộ có tổng chữ số chia hết cho 5.\n\nHỏi có bao nhiêu căn hộ có cả chó và mèo?",
      answerType: "number",
      placeholder: "Nhập số căn hộ...",
      unit: "căn hộ",
    },
    answer: {
      type: "numeric",
      value: 11,
      unit: "căn hộ",
      tolerance: 0,
    },
    hints: [
      {
        level: 1,
        title: "Lọc điều kiện Mèo trước",
        cost: "1 sao tư duy",
        content: "Trước tiên chỉ giữ các căn chia hết cho 5.",
      },
      {
        level: 2,
        title: "Tính tổng chữ số",
        cost: "2 sao tư duy",
        content: "Sau đó tính tổng chữ số của các căn còn lại.",
      },
      {
        level: 3,
        title: "Giữ các căn thỏa cả hai",
        cost: "3 sao tư duy",
        content: "Chỉ giữ những căn tiếp tục có tổng chữ số chia hết cho 5.",
      },
    ],
    simulation: {
      type: "numberFilterLab",
      config: {
        start: 1,
        end: 300,
        filters: [
          { id: "divisibleBy5", label: "Số căn hộ chia hết cho 5" },
          { id: "digitSumDivisibleBy5", label: "Tổng chữ số chia hết cho 5" },
        ],
      },
    },
    teachingPoint: "Khi cần thỏa hai điều kiện cùng lúc, hãy lọc lần lượt từng điều kiện.",
    explanation: [
      "Bước 1: Lọc điều kiện Mèo (Số chia hết cho 5):\nMột số chia hết cho 5 khi và chỉ khi có chữ số tận cùng là 0 hoặc 5. Từ 1 đến 300 có 300 : 5 = 60 căn hộ chia hết cho 5.",
      "Bước 2: Lọc tiếp điều kiện Chó (Tổng chữ số chia hết cho 5) trong 60 căn trên:\n• Căn có 1 chữ số: Số 5 (tổng = 5, chia hết cho 5) → 1 căn.\n• Căn có 2 chữ số (dạng a0 hoặc a5):\n  - Dạng a0: tổng là a. Để a chia hết cho 5 thì a = 5 → số 50.\n  - Dạng a5: tổng là a + 5. Để chia hết cho 5 thì a chia hết cho 5 → a = 5 → số 55.\n  (Tổng cộng 2 căn: 50, 55).\n• Căn có 3 chữ số từ 100 đến 300 (dạng ab0 hoặc ab5):\n  - Dạng ab0: a + b chia hết cho 5:\n    + a = 1: b = 4 hoặc 9 → 140, 190 (2 căn)\n    + a = 2: b = 3 hoặc 8 → 230, 280 (2 căn)\n    + a = 3: 300 (tổng là 3, loại)\n  - Dạng ab5: a + b + 5 chia hết cho 5 → a + b chia hết cho 5:\n    + a = 1: b = 4 hoặc 9 → 145, 195 (2 căn)\n    + a = 2: b = 3 hoặc 8 → 235, 285 (2 căn)\n• Tổng hợp các căn: {5, 50, 55, 140, 145, 190, 195, 230, 235, 280, 285}.",
      "Kết luận: Có tất cả đúng 11 căn hộ có cả chó và mèo cùng sống.",
    ],
  },

  // D19: 23 NGÀY NHẶT HẠT DẺ (WINDOW OPTIMIZATION)
  {
    id: "D19",
    title: "23 ngày nhặt hạt dẻ",
    order: 19,
    part: "B",
    status: "available",
    difficulty: 3,
    skills: ["optimization", "sliding_window", "constraint"],
    problem: {
      text: "Sóc Leo nhặt hạt trong 23 ngày.\n\n• Mỗi ngày ít nhất 4 hạt.\n• Trong bất kỳ 5 ngày liên tiếp nào, tổng số hạt không vượt quá 50.\n\nHỏi trong 23 ngày, Sóc có thể nhặt nhiều nhất bao nhiêu hạt?",
      answerType: "number",
      placeholder: "Nhập số hạt nhiều nhất...",
      unit: "hạt",
    },
    answer: {
      type: "numeric",
      value: 242,
      unit: "hạt",
      tolerance: 0,
    },
    hints: [
      {
        level: 1,
        title: "Quan sát từng đoạn 5 ngày",
        cost: "1 sao tư duy",
        content: "Hãy nhìn từng đoạn 5 ngày liên tiếp.",
      },
      {
        level: 2,
        title: "Ảnh hưởng của cửa sổ",
        cost: "2 sao tư duy",
        content: "Nếu tăng một ngày, những cửa sổ nào chứa ngày đó sẽ bị ảnh hưởng?",
      },
      {
        level: 3,
        title: "Tìm cận trên và phương án đạt cận",
        cost: "3 sao tư duy",
        content: "Muốn chứng minh lớn nhất, cần tìm cận trên và một phương án đạt được cận đó.",
      },
    ],
    simulation: {
      type: "windowOptimizationLab",
      config: {
        days: 23,
        minimumPerDay: 4,
        windowSize: 5,
        windowLimit: 50,
        objective: "maximizeTotal",
      },
    },
    teachingPoint: "Khi điều kiện áp dụng trên các đoạn liên tiếp có cùng độ dài, hãy quan sát các cửa sổ trượt.",
    explanation: [
      "Bước 1: Phân nhóm 20 ngày đầu:\nChia 20 ngày đầu thành 4 nhóm 5 ngày không giao nhau: (Ngày 1–5), (Ngày 6–10), (Ngày 11–15), (Ngày 16–20).\nMỗi nhóm có tổng ≤ 50, nên tổng 20 ngày đầu ≤ 4 × 50 = 200 hạt.",
      "Bước 2: Thiết lập cận trên cho 3 ngày cuối (Ngày 21, 22, 23):\nXét cửa sổ 5 ngày liên tiếp cuối cùng: Ngày 19, 20, 21, 22, 23.\nTổng 5 ngày này ≤ 50.\nVì mỗi ngày nhặt ít nhất 4 hạt, nên Ngày 19 ≥ 4 và Ngày 20 ≥ 4.\nSuy ra: Ngày 21 + Ngày 22 + Ngày 23 ≤ 50 - 4 - 4 = 42 hạt.",
      "Bước 3: Xác định cận trên toàn bộ 23 ngày:\nTổng số hạt cả 23 ngày ≤ 200 + 42 = 242 hạt.",
      "Bước 4: Chỉ ra phương án tối ưu đạt đúng 242 hạt:\nÁp dụng chu kỳ 5 ngày [34, 4, 4, 4, 4] lặp lại:\n• Các ngày 1, 6, 11, 16, 21: nhặt 34 hạt (5 ngày).\n• Tất cả 18 ngày còn lại: nhặt 4 hạt.\nKiểm tra: Bất kỳ đoạn 5 ngày liên tiếp nào cũng chứa đúng một ngày 34 hạt và bốn ngày 4 hạt → Tổng luôn bằng 34 + 4×4 = 50 ≤ 50 (thỏa mãn tuyệt đối).\nTổng 23 ngày = 5 × 34 + 18 × 4 = 170 + 72 = 242 hạt.",
      "Kết luận: Số hạt nhiều nhất Sóc có thể nhặt được là 242 hạt.",
    ],
  },
  {
    id: "D20",
    title: "Dãy số Fibonacci thu nhỏ",
    order: 20,
    part: "B",
    status: "coming_soon",
    difficulty: 2,
    skills: ["pattern", "cycle", "counting"],
    problem: {
      text: "Thử thách D20: Quy luật bước nhảy và tính chu kỳ của dãy số hồi quy.\n\n(Nội dung mô phỏng đang được chuẩn bị trong đợt cập nhật tiếp theo).",
      answerType: "number",
      placeholder: "Sắp mở...",
    },
    answer: { value: 0 },
    hints: [],
    teachingPoint: "Quan sát chu kỳ số dư khi chia cho một số nguyên.",
    explanation: ["Nội dung sắp mở."],
  },
  {
    id: "D21",
    title: "Trò chơi bốc sỏi Nim 2 đống",
    order: 21,
    part: "B",
    status: "coming_soon",
    difficulty: 3,
    skills: ["strategy", "game", "logic"],
    problem: {
      text: "Thử thách D21: Trạng thái cân bằng và thế tất thắng trong trò chơi Nim 2 đống sỏi.\n\n(Nội dung mô phỏng đang được chuẩn bị trong đợt cập nhật tiếp theo).",
      answerType: "number",
      placeholder: "Sắp mở...",
    },
    answer: { value: 0 },
    hints: [],
    teachingPoint: "Đưa đối thủ vào trạng thái đối xứng không thể đảo ngược.",
    explanation: ["Nội dung sắp mở."],
  },
  {
    id: "D22",
    title: "Đóng gói bưu kiện tối ưu",
    order: 22,
    part: "B",
    status: "coming_soon",
    difficulty: 3,
    skills: ["optimization", "constraint", "counting"],
    problem: {
      text: "Thử thách D22: Sắp xếp các gói kiện hàng vào thùng xe với thể tích tối ưu.\n\n(Nội dung mô phỏng đang được chuẩn bị trong đợt cập nhật tiếp theo).",
      answerType: "number",
      placeholder: "Sắp mở...",
    },
    answer: { value: 0 },
    hints: [],
    teachingPoint: "Ưu tiên khối lớn trước khi lấp đầy khoảng trống bằng khối nhỏ.",
    explanation: ["Nội dung sắp mở."],
  },
];

// Helper export to query all questions
export const ALL_PART_B_QUESTIONS = PRACTICE_QUESTIONS;
export const AVAILABLE_PART_B_QUESTIONS = PRACTICE_QUESTIONS.filter(
  (q) => q.status === "available"
);
