import { Question } from "../types/question";

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: "D01",
    title: "Chiếc cân bí mật",
    order: 1,
    difficulty: 1,
    skills: ["logic", "equivalence"],
    problem: {
      text: "Một chiếc cân hai đĩa đang ở trạng thái thăng bằng chính xác:\n\n• Đĩa trái: 1 quả táo + 2 quả lê\n• Đĩa phải: 2 quả táo + 1 quả lê\n\nEm hãy chọn nhận định đúng về khối lượng của quả táo và quả lê:",
      answerType: "single-choice",
      choices: [
        { id: "1", label: "1. Táo nặng hơn lê" },
        { id: "2", label: "2. Táo và lê nặng bằng nhau" },
        { id: "3", label: "3. Lê nặng hơn táo" },
      ],
    },
    answer: {
      value: 2,
      displayValue: "Đáp án 2: Táo và lê nặng bằng nhau",
    },
    hints: [
      {
        level: 1,
        text: "Cân đang ở trạng thái thăng bằng, nghĩa là tổng khối lượng ở đĩa trái bằng tổng khối lượng ở đĩa phải.",
      },
      {
        level: 2,
        text: "Quan sát xem ở cả hai đĩa có những loại quả nào giống nhau xuất hiện đồng thời không?",
      },
      {
        level: 3,
        text: "Hãy thử bớt đi 1 quả táo và 1 quả lê ở cả hai đĩa cùng một lúc. Khi đó mỗi đĩa cân còn lại gì?",
      },
    ],
    simulation: {
      type: "balanceLab",
      name: "Phòng thí nghiệm Cân thăng bằng",
      config: {
        left: [
          { type: "apple", icon: "🍎" },
          { type: "pear", icon: "🍐" },
          { type: "pear", icon: "🍐" },
        ],
        right: [
          { type: "apple", icon: "🍎" },
          { type: "apple", icon: "🍎" },
          { type: "pear", icon: "🍐" },
        ],
      },
    },
    teachingPoint: "Cân bằng nghĩa là tổng hai vế bằng nhau.",
    explanation: [
      "Bước 1: Ta lập hệ thức cân bằng ban đầu: 1 Táo + 2 Lê = 2 Táo + 1 Lê.",
      "Bước 2: Bớt đồng thời 1 quả Táo và 1 quả Lê ở cả hai đĩa cân (áp dụng nguyên lý khử đại lượng tương đương).",
      "Bước 3: Đĩa trái sau khi bớt còn lại: 1 quả Lê. Đĩa phải sau khi bớt còn lại: 1 quả Táo.",
      "Kết luận: Vì cân vẫn thăng bằng nên 1 quả Lê có khối lượng bằng đúng 1 quả Táo. Chọn đáp án 2.",
    ],
  },
  {
    id: "D02",
    title: "Bữa tiệc 7 chiếc bàn",
    order: 2,
    difficulty: 1,
    skills: ["pattern", "counting"],
    problem: {
      text: "Một chiếc bàn vuông có thể ngồi được 4 người, mỗi cạnh ngồi được đúng 1 người.\n\nNgười ta ghép 7 chiếc bàn vuông lại thành một hàng dài thẳng tắp, cạnh sát cạnh nhau.\n\nHỏi có thể ngồi được nhiều nhất bao nhiêu người?",
      answerType: "number",
      unit: "người",
      placeholder: "Nhập số người...",
    },
    answer: {
      value: 16,
      displayValue: "16 người",
    },
    hints: [
      {
        level: 1,
        text: "Mỗi chiếc bàn riêng lẻ có 4 cạnh trống, nhưng khi ghép sát nhau thì những cạnh tiếp xúc ở giữa có còn ngồi được không?",
      },
      {
        level: 2,
        text: "Các bàn ở hai đầu hàng có mấy cạnh ngoài? Các bàn nằm ở giữa hàng có mấy cạnh ngoài?",
      },
      {
        level: 3,
        text: "Hãy tính số cạnh ngoài của 2 chiếc bàn ở hai đầu (mỗi bàn có 3 cạnh ngoài tự do) rồi cộng với số cạnh ngoài của 5 chiếc bàn ở giữa (mỗi bàn còn 2 cạnh trống trên và dưới).",
      },
    ],
    simulation: {
      type: "tableMergeLab",
      name: "Mô phỏng Ghép bàn tiệc",
      config: {
        tableCount: 7,
        seatsPerSide: 1,
      },
    },
    teachingPoint: "Khi ghép các đối tượng, phần tiếp xúc có thể không còn được tính.",
    explanation: [
      "Bước 1: Hai chiếc bàn nằm ở hai đầu ngoài cùng có 3 cạnh trống tiếp xúc không gian: 2 × 3 = 6 chỗ ngồi.",
      "Bước 2: Năm chiếc bàn nằm ở giữa bị che mất 2 cạnh hai bên, mỗi bàn chỉ ngồi được ở cạnh trên và cạnh dưới: 5 × 2 = 10 chỗ ngồi.",
      "Bước 3: Tổng số người nhiều nhất có thể ngồi là: 6 + 10 = 16 người.",
      "Công thức tổng quát: Với n chiếc bàn ghép thành hàng dài, số chỗ ngồi tối đa là 2 × n + 2. Với n = 7: (2 × 7) + 2 = 16 người.",
    ],
  },
  {
    id: "D03",
    title: "Chu kỳ của Bella",
    order: 3,
    difficulty: 1,
    skills: ["pattern", "cycle"],
    problem: {
      text: "Thỏ Bella ăn rau củ theo chu kỳ cố định hàng ngày:\n\n• Cà rốt: 2, 0, 3, 1 củ (chu kỳ lặp lại mỗi 4 ngày)\n• Bắp cải: 1, 0, 0, 2, 0, 1 củ (chu kỳ lặp lại mỗi 6 ngày)\n\nTrong 12 ngày đầu tiên, Bella ăn tổng cộng bao nhiêu củ cà rốt và bắp cải?",
      answerType: "number",
      unit: "củ",
      placeholder: "Nhập tổng số củ...",
    },
    answer: {
      value: 26,
      displayValue: "26 củ",
    },
    hints: [
      {
        level: 1,
        text: "Khoảng thời gian 12 ngày gấp mấy lần chu kỳ 4 ngày của cà rốt và mấy lần chu kỳ 6 ngày của bắp cải?",
      },
      {
        level: 2,
        text: "Tính tổng số cà rốt Bella ăn trong 1 chu kỳ 4 ngày, và tổng số bắp cải trong 1 chu kỳ 6 ngày.",
      },
      {
        level: 3,
        text: "Trong 4 ngày cà rốt: 2 + 0 + 3 + 1 = 6 củ. Trong 6 ngày bắp cải: 1 + 0 + 0 + 2 + 0 + 1 = 4 củ. 12 ngày gồm đúng 3 chu kỳ cà rốt và 2 chu kỳ bắp cải.",
      },
    ],
    simulation: {
      type: "cycleLab",
      name: "Bộ đếm Chu kỳ Tuần hoàn",
      config: {
        days: 12,
        series: [
          {
            id: "carrot",
            label: "Cà rốt",
            icon: "🥕",
            values: [2, 0, 3, 1],
          },
          {
            id: "cabbage",
            label: "Bắp cải",
            icon: "🥬",
            values: [1, 0, 0, 2, 0, 1],
          },
        ],
      },
    },
    teachingPoint: "Khi quy luật lặp lại, hãy tìm chu kỳ thay vì tính từng phần tử.",
    explanation: [
      "Bước 1: Tính số cà rốt trong 1 chu kỳ (4 ngày): 2 + 0 + 3 + 1 = 6 củ. Trong 12 ngày có 12 ÷ 4 = 3 chu kỳ hoàn chỉnh. Số cà rốt = 3 × 6 = 18 củ.",
      "Bước 2: Tính số bắp cải trong 1 chu kỳ (6 ngày): 1 + 0 + 0 + 2 + 0 + 1 = 4 củ. Trong 12 ngày có 12 ÷ 6 = 2 chu kỳ hoàn chỉnh. Số bắp cải = 2 × 4 = 8 củ.",
      "Bước 3: Tổng số củ Bella ăn trong 12 ngày là: 18 + 8 = 26 củ.",
    ],
  },
  {
    id: "D04",
    title: "Những hòn đảo bí mật",
    order: 4,
    difficulty: 2,
    skills: ["graph", "path"],
    problem: {
      text: "Giữa các hòn đảo có các cây cầu hai chiều nối trực tiếp:\n\nA-B, A-C, B-D, B-E, C-D, D-F, E-F\n\nHỏi:\n1. Từ đảo A đến đảo F phải đi qua ít nhất bao nhiêu cây cầu (đoạn đường)?\n2. Có bao nhiêu đường đi ngắn nhất như vậy?\n\n(Nhập đáp án theo cú pháp: số đoạn,số cách. Ví dụ: 3,3)",
      answerType: "text",
      placeholder: "Ví dụ: 3,3",
    },
    answer: {
      value: "3,3",
      displayValue: "3 đoạn và 3 cách (nhập: 3,3)",
    },
    hints: [
      {
        level: 1,
        text: "Hãy vẽ sơ đồ các đỉnh A, B, C, D, E, F theo từng tầng khoảng cách tính từ đảo A.",
      },
      {
        level: 2,
        text: "Từ A đi 1 bước tới được B và C. Từ B, C đi tiếp 1 bước tới được D và E. Cần thêm mấy bước để tới được đảo F?",
      },
      {
        level: 3,
        text: "Hãy thử tìm lộ trình qua các tầng: A → {B, C} → {D, E} → F. Đếm xem có tất cả bao nhiêu đường đi hợp lệ gồm 3 cây cầu nối trực tiếp.",
      },
    ],
    simulation: {
      type: "graphPathLab",
      name: "Mạng lưới Đồ thị Quần đảo",
      config: {
        nodes: [
          { id: "A", x: 10, y: 50 },
          { id: "B", x: 35, y: 20 },
          { id: "C", x: 35, y: 80 },
          { id: "D", x: 60, y: 50 },
          { id: "E", x: 60, y: 15 },
          { id: "F", x: 90, y: 50 },
        ],
        edges: [
          ["A", "B"],
          ["A", "C"],
          ["B", "D"],
          ["B", "E"],
          ["C", "D"],
          ["D", "F"],
          ["E", "F"],
        ],
        start: "A",
        target: "F",
      },
    },
    teachingPoint: "Khám phá đồ thị là tìm đường đi thỏa mãn ràng buộc.",
    explanation: [
      "Bước 1: Phân tầng khoảng cách (BFS) từ đảo xuất phát A:\n- Tầng 0: {A}\n- Tầng 1 (1 đoạn): {B, C}\n- Tầng 2 (2 đoạn): {D, E} (qua B-D, B-E, C-D)\n- Tầng 3 (3 đoạn): {F} (qua D-F, E-F)\nNhư vậy đường đi ngắn nhất tốn đúng 3 đoạn đường.",
      "Bước 2: Đếm số đường đi ngắn nhất có độ dài 3:\n• Đường 1: A → B → D → F\n• Đường 2: A → B → E → F\n• Đường 3: A → C → D → F",
      "Kết luận: Có ít nhất 3 đoạn và đúng 3 lộ trình ngắn nhất. Nhập: 3,3.",
    ],
  },
  {
    id: "D05",
    title: "Robot trên bảng số",
    order: 5,
    difficulty: 2,
    skills: ["simulation", "state_tracking"],
    problem: {
      text: "Robot đang đứng tại ô số 25 trên bảng ô vuông 7 × 7 được đánh số từ 1 đến 49 lần lượt theo từng hàng từ trái qua phải (Hàng 1: 1..7, Hàng 2: 8..14,...).\n\nRobot ban đầu quay mặt về phía ô số 18.\n\nRobot thực hiện lặp lại đúng 3 lần chuỗi lệnh sau:\n1. Tiến 1 ô.\n2. Nếu số ở ô hiện tại chia hết cho 3 thì quay TRÁI 90°.\n3. Nếu số ở ô hiện tại không chia hết cho 3 thì quay PHẢI 90°.\n4. Tiến 2 ô.\n\nHỏi sau khi hoàn thành 3 lần lặp, robot dừng lại tại ô số mấy?",
      answerType: "number",
      placeholder: "Nhập số ô cuối cùng...",
    },
    answer: {
      value: 38,
      displayValue: "Ô số 38",
    },
    hints: [
      {
        level: 1,
        text: "Hãy theo dõi nhiều hơn một thông tin.",
      },
      {
        level: 2,
        text: "Em cần theo dõi đồng thời cả vị trí và hướng nhìn của robot qua từng thao tác.",
      },
      {
        level: 3,
        text: "Lập bảng: Lần lặp – Vị trí đầu – Tiến 1 ô – Kiểm tra chia hết cho 3 – Hướng rẽ mới – Tiến 2 ô – Vị trí cuối.",
      },
    ],
    simulation: {
      type: "gridRobotLab",
      name: "Mô phỏng Robot Bảng 7x7",
      config: {
        rows: 7,
        cols: 7,
        startCell: 25,
        startDirection: "up",
        repeat: 3,
        rule: {
          forwardBeforeTurn: 1,
          divisor: 3,
          ifDivisible: "left",
          ifNotDivisible: "right",
          forwardAfterTurn: 2,
        },
      },
    },
    teachingPoint: "Một trạng thái có thể gồm cả vị trí và hướng.",
    explanation: [
      "Bảng 7×7: Ô 18 nằm ngay phía trên ô 25 (vì 25 - 7 = 18). Do đó hướng xuất phát là hướng BẮC (đi lên).",
      "Lần lặp 1:\n• Từ 25 tiến 1 ô hướng Bắc → ô 18.\n• 18 chia hết cho 3 → Quay TRÁI 90° (chuyển sang hướng TÂY - sang trái).\n• Tiến 2 ô hướng Tây → qua 17 rồi đến ô 16. (Kết thúc lần 1: ô 16, hướng Tây)",
      "Lần lặp 2:\n• Từ 16 tiến 1 ô hướng Tây → ô 15.\n• 15 chia hết cho 3 → Quay TRÁI 90° (từ Tây quay trái thành hướng NAM - đi xuống).\n• Tiến 2 ô hướng Nam (mỗi bước xuống tăng 7) → 15 + 7 = 22, 22 + 7 = 29. (Kết thúc lần 2: ô 29, hướng Nam)",
      "Lần lặp 3:\n• Từ 29 tiến 1 ô hướng Nam → ô 36 (29 + 7 = 36).\n• 36 chia hết cho 3 → Quay TRÁI 90° (từ Nam quay trái thành hướng ĐÔNG - sang phải).\n• Tiến 2 ô hướng Đông (mỗi bước sang phải tăng 1) → 36 + 1 = 37, 37 + 1 = 38. (Kết thúc lần 3: ô 38, hướng Đông)",
      "Kết luận: Robot dừng lại tại ô số 38.",
    ],
  },
  {
    id: "D06",
    title: "Xếp hàng A B C D E",
    order: 6,
    difficulty: 2,
    skills: ["combinatorics", "constraint"],
    problem: {
      text: "Có 5 bạn học sinh A, B, C, D, E xếp thành một hàng dọc 5 vị trí.\n\nCác điều kiện bắt buộc:\n• Bạn A phải đứng trước (bên trái) bạn B (không nhất thiết đứng sát nhau).\n• Bạn C KHÔNG được đứng cạnh bạn A.\n• Bạn C KHÔNG được đứng cạnh bạn B.\n\nHỏi có bao nhiêu cách xếp hàng thỏa mãn tất cả các điều kiện trên?",
      answerType: "number",
      unit: "cách",
      placeholder: "Nhập số cách xếp...",
    },
    answer: {
      value: 18,
      displayValue: "18 cách",
    },
    hints: [
      {
        level: 1,
        text: "C không được đứng cạnh A và cũng không được cạnh B. Vậy ai là người duy nhất có thể đứng cạnh C?",
      },
      {
        level: 2,
        text: "Những người có thể đứng kề cạnh C chỉ có thể là bạn D hoặc bạn E (hoặc mép hàng)!",
      },
      {
        level: 3,
        text: "Chia làm 2 trường hợp theo vị trí của C: TH1: C đứng ở hai mép ngoài (vị trí 1 hoặc 5). TH2: C đứng ở giữa (vị trí 2, 3 hoặc 4 - khi đó hai bên C bắt buộc phải là D và E).",
      },
    ],
    simulation: {
      type: "arrangementLab",
      name: "Phòng thí nghiệm Hoán vị & Ràng buộc",
      config: {
        items: ["A", "B", "C", "D", "E"],
        rules: [
          {
            type: "before",
            a: "A",
            b: "B",
            text: "A phải đứng bên trái B",
          },
          {
            type: "notAdjacent",
            a: "C",
            b: "A",
            text: "C không được đứng cạnh A",
          },
          {
            type: "notAdjacent",
            a: "C",
            b: "B",
            text: "C không được đứng cạnh B",
          },
        ],
      },
    },
    teachingPoint: "Chia trường hợp giúp tránh thử một cách ngẫu nhiên.",
    explanation: [
      "Bước 1: Phân tích điều kiện: Vì C không được kề A và B, nên người đứng cạnh C chỉ có thể là D hoặc E.",
      "Trường hợp 1: C đứng ở mép hàng (vị trí 1 hoặc vị trí 5) → Có 2 lựa chọn vị trí cho C.\n• Giả sử C đứng ở vị trí 1: Vị trí 2 cạnh C bắt buộc phải là D hoặc E (2 cách chọn).\n• Ba vị trí còn lại (3, 4, 5) dành cho {A, B, người còn lại của D/E}. Người còn lại của D/E có 3 vị trí để đứng. Hai vị trí còn lại xếp A và B, do A đứng trước B nên chỉ có 1 cách duy nhất.\n• Số cách khi C ở vị trí 1 là: 2 × 3 × 1 = 6 cách.\n• Tương tự khi C ở vị trí 5 cũng có 6 cách.\n→ Tổng TH1 = 6 + 6 = 12 cách.",
      "Trường hợp 2: C đứng ở giữa (vị trí 2, 3 hoặc 4) → Có 3 vị trí cho C.\n• Do C đứng ở giữa nên có đúng 2 người kề hai bên C. Hai người này bắt buộc phải là D và E! D và E có 2! = 2 cách đổi chỗ cho nhau (D-C-E hoặc E-C-D).\n• Hai vị trí còn lại trong hàng dành cho A và B. Do A đứng trước B nên chỉ có 1 cách xếp.\n• Số cách cho TH2 = 3 (chọn vị trí C) × 2 (xếp D, E) × 1 (xếp A, B) = 6 cách.",
      "Tổng số cách xếp hợp lệ = 12 + 6 = 18 cách.",
    ],
  },
  {
    id: "D07",
    title: "Hải ly nhận nhiệm vụ",
    order: 7,
    difficulty: 2,
    skills: ["matching", "constraint"],
    problem: {
      text: "Có 5 nhiệm vụ: A, B, C, D, E cần giao cho 5 chú hải ly. Danh sách các nhiệm vụ mỗi chú hải ly có thể làm:\n\n• Hải ly 1: {A, B}\n• Hải ly 2: {C, D}\n• Hải ly 3: {B, E}\n• Hải ly 4: {C, E}\n• Hải ly 5: {A, B, D}\n\nMỗi hải ly nhận đúng 1 nhiệm vụ và mỗi nhiệm vụ chỉ giao cho đúng 1 hải ly.\nHỏi có bao nhiêu cách phân công hợp lệ?",
      answerType: "number",
      unit: "cách",
      placeholder: "Nhập số cách phân công...",
    },
    answer: {
      value: 3,
      displayValue: "3 cách",
    },
    hints: [
      {
        level: 1,
        text: "Quan sát những nhiệm vụ nào xuất hiện ít nhất trong danh sách khả năng của các chú hải ly.",
      },
      {
        level: 2,
        text: "Nhiệm vụ A chỉ có Hải ly 1 và Hải ly 5 làm được. Nhiệm vụ D chỉ có Hải ly 2 và Hải ly 5 làm được.",
      },
      {
        level: 3,
        text: "Hãy chia 3 trường hợp dựa trên nhiệm vụ của Hải ly 5: Hải ly 5 làm A, Hải ly 5 làm B, hay Hải ly 5 làm D?",
      },
    ],
    simulation: {
      type: "matchingLab",
      name: "Bộ ghép cặp Đồ thị Hai phía",
      config: {
        left: [
          { id: "1", label: "Hải ly 1" },
          { id: "2", label: "Hải ly 2" },
          { id: "3", label: "Hải ly 3" },
          { id: "4", label: "Hải ly 4" },
          { id: "5", label: "Hải ly 5" },
        ],
        right: [
          { id: "A", label: "Nhiệm vụ A" },
          { id: "B", label: "Nhiệm vụ B" },
          { id: "C", label: "Nhiệm vụ C" },
          { id: "D", label: "Nhiệm vụ D" },
          { id: "E", label: "Nhiệm vụ E" },
        ],
        allowed: {
          "1": ["A", "B"],
          "2": ["C", "D"],
          "3": ["B", "E"],
          "4": ["C", "E"],
          "5": ["A", "B", "D"],
        },
      },
    },
    teachingPoint: "Bắt đầu từ đối tượng bị giới hạn nhiều nhất.",
    explanation: [
      "Bước 1: Phân tích theo các khả năng của Hải ly 5 (người có 3 khả năng: A, B, D):",
      "Trường hợp 1: Hải ly 5 làm A.\n• Hải ly 1 buộc phải làm B (vì A đã bị 5 nhận).\n• Hải ly 3 buộc phải làm E (vì B đã bị 1 nhận).\n• Hải ly 4 buộc phải làm C (vì E đã bị 3 nhận).\n• Hải ly 2 buộc phải làm D (vì C đã bị 4 nhận).\n→ Kết quả: (5-A, 1-B, 3-E, 4-C, 2-D): Hợp lệ! (1 cách)",
      "Trường hợp 2: Hải ly 5 làm D.\n• Hải ly 2 buộc phải làm C (vì D đã bị 5 nhận).\n• Hải ly 4 buộc phải làm E (vì C đã bị 2 nhận).\n• Hải ly 3 buộc phải làm B (vì E đã bị 4 nhận).\n• Hải ly 1 buộc phải làm A (vì B đã bị 3 nhận).\n→ Kết quả: (5-D, 2-C, 4-E, 3-B, 1-A): Hợp lệ! (1 cách)",
      "Trường hợp 3: Hải ly 5 làm B.\n• Hải ly 1 buộc phải làm A (vì B đã bị 5 nhận).\n• Hải ly 3 buộc phải làm E (vì B đã bị 5 nhận).\n• Hải ly 4 buộc phải làm C (vì E đã bị 3 nhận).\n• Hải ly 2 buộc phải làm D (vì C đã bị 4 nhận).\n→ Kết quả: (5-B, 1-A, 3-E, 4-C, 2-D): Hợp lệ! (1 cách)",
      "Tổng số phương án phân công hợp lệ là: 1 + 1 + 1 = 3 cách.",
    ],
  },
  {
    id: "D08",
    title: "Trò chơi 18 quyển sách",
    order: 8,
    difficulty: 2,
    skills: ["strategy", "game"],
    problem: {
      text: "Trên bàn có 18 quyển sách.\n\nAlice và Bob thay phiên nhau lấy sách. Mỗi lượt chơi, một người được lấy 1, 2, 3 hoặc 4 quyển sách.\nNgười nào lấy được quyển sách cuối cùng sẽ là người chiến thắng.\n\nAlice là người đi trước. Để chắc chắn giành chiến thắng (dù Bob chơi thế nào), Alice phải lấy bao nhiêu quyển sách ở lượt đầu tiên?",
      answerType: "number",
      unit: "quyển",
      placeholder: "Nhập số quyển sách...",
    },
    answer: {
      value: 3,
      displayValue: "3 quyển sách",
    },
    hints: [
      {
        level: 1,
        text: "Mỗi người bốc từ 1 đến 4 quyển. Hai bạn có thể cùng tạo ra tổng số sách bốc là một hằng số bằng mấy?",
      },
      {
        level: 2,
        text: "1 + 4 = 5. Nếu Alice để lại cho Bob số sách là một bội số của 5, thì sau bất kỳ nước đi nào của Bob, Alice luôn có thể bốc bù để tổng lượt là 5.",
      },
      {
        level: 3,
        text: "18 chia cho 5 dư mấy? Alice cần bốc đúng số dư đó ở lượt đầu tiên.",
      },
    ],
    simulation: {
      type: "takeAwayGame",
      name: "Đấu trường Chiến thuật Bốc sỏi",
      config: {
        initialItems: 18,
        minTake: 1,
        maxTake: 4,
        firstPlayer: "student",
      },
    },
    teachingPoint: "Tìm trạng thái nên để lại cho đối thủ.",
    explanation: [
      "Bước 1: Quy tắc bù trừ nhóm 5: Dù Bob bốc k quyển (1 ≤ k ≤ 4), Alice luôn có thể bốc (5 - k) quyển để tổng số sách 2 người bốc trong 1 vòng luôn bằng 5.",
      "Bước 2: Trạng thái thua cuộc (P-position) là các bội số của 5: {0, 5, 10, 15}. Nếu ai bắt đầu lượt của mình với một bội số của 5 thì đối phương sẽ luôn duy trì được lợi thế thắng.",
      "Bước 3: Tổng số sách ban đầu là 18. Ta có: 18 = 3 × 5 + 3 (18 chia 5 dư 3).",
      "Kết luận: Ở lượt đầu tiên, Alice cần bốc đúng 3 quyển sách để để lại đúng 15 quyển (bội số của 5) cho Bob. Kể từ đó, hễ Bob bốc x quyển thì Alice bốc (5 - x) quyển và chắc chắn sẽ bốc quyển cuối cùng.",
    ],
  },
  {
    id: "D09",
    title: "Robot và pin",
    order: 9,
    difficulty: 2,
    skills: ["optimization", "graph"],
    problem: {
      text: "Robot bắt đầu tại điểm A với 10 đơn vị pin trong máy.\n\nCác tuyến đường giữa các điểm:\n• A → B: tiêu hao 4 pin\n• A → C: tiêu hao 6 pin\n• B → D: tiêu hao 5 pin\n• C → D: tiêu hao 2 pin\n• B → C: được nạp thêm 3 pin (trạm nạp năng lượng)\n\nĐiều kiện: Robot không được để mức pin rơi xuống dưới 0 tại bất kỳ thời điểm nào.\nKhi đến đích D, robot có thể còn lại nhiều nhất bao nhiêu pin?",
      answerType: "number",
      unit: "đơn vị pin",
      placeholder: "Nhập số pin tối đa...",
    },
    answer: {
      value: 7,
      displayValue: "7 đơn vị pin",
    },
    hints: [
      {
        level: 1,
        text: "Hãy tính mức pin còn lại của robot trên tất cả các tuyến đường khả dĩ từ A đến D.",
      },
      {
        level: 2,
        text: "Đặc biệt chú ý tuyến B → C được nạp thêm 3 pin. Liệu đi đường vòng có lợi hơn đi thẳng không?",
      },
      {
        level: 3,
        text: "Đường 1: A-B-D = 10 - 4 - 5 = 1. Đường 2: A-C-D = 10 - 6 - 2 = 2. Đường 3: A-B-C-D = 10 - 4 + 3 - 2 = ?",
      },
    ],
    simulation: {
      type: "energyGraphLab",
      name: "Tối ưu hóa Lộ trình Năng lượng",
      config: {
        initialEnergy: 10,
        nodes: [
          { id: "A", label: "A", x: 10, y: 50 },
          { id: "B", label: "B", x: 40, y: 20 },
          { id: "C", label: "C", x: 40, y: 80 },
          { id: "D", label: "D", x: 85, y: 50 },
        ],
        edges: [
          { from: "A", to: "B", delta: -4, label: "-4" },
          { from: "A", to: "C", delta: -6, label: "-6" },
          { from: "B", to: "D", delta: -5, label: "-5" },
          { from: "C", to: "D", delta: -2, label: "-2" },
          {
            from: "B",
            to: "C",
            delta: 3,
            label: "+3",
            type: "recharge",
          },
        ],
        start: "A",
        target: "D",
        minEnergy: 0,
      },
    },
    teachingPoint: "Phương án có nhiều bước hơn chưa chắc kém hơn.",
    explanation: [
      "Bước 1: Khảo sát lộ trình 1: A → B → D\n• Tại B: 10 - 4 = 6 pin (hợp lệ > 0).\n• Tại D: 6 - 5 = 1 pin.",
      "Bước 2: Khảo sát lộ trình 2: A → C → D\n• Tại C: 10 - 6 = 4 pin (hợp lệ > 0).\n• Tại D: 4 - 2 = 2 pin.",
      "Bước 3: Khảo sát lộ trình 3: A → B → C → D (đi qua trạm sạc)\n• Tại B: 10 - 4 = 6 pin.\n• Đi đoạn B → C: được nạp +3 pin → mức pin tại C là: 6 + 3 = 9 pin!\n• Tại D: 9 - 2 = 7 pin (hợp lệ > 0).",
      "So sánh các kết quả: max(1, 2, 7) = 7. Robot còn lại nhiều nhất 7 pin.",
    ],
  },
  {
    id: "D10",
    title: "Chuỗi Domino",
    order: 10,
    difficulty: 2,
    skills: ["graph", "path"],
    problem: {
      text: "Có 5 quân Domino sau:\n\n[1|2], [2|3], [3|1], [1|4], [4|2]\n\nQuy tắc: Hai quân Domino được đặt cạnh nhau nếu hai đầu tiếp xúc có cùng con số.\n\nHỏi có thể dùng cả 5 quân đúng một lần để tạo thành một chuỗi liên tục hay không?",
      answerType: "single-choice",
      choices: [
        { id: "Có", label: "Có (Tạo được chuỗi)" },
        { id: "Không", label: "Không (Không thể tạo)" },
      ],
      placeholder: "Chọn Có hoặc Không...",
    },
    answer: {
      value: "Có",
      displayValue: "Có (Tạo được chuỗi liên tục)",
    },
    hints: [
      {
        level: 1,
        text: "Mỗi quân Domino có 2 số ở hai đầu, giống như một cạnh nối hai điểm.",
      },
      {
        level: 2,
        text: "Để tạo thành một chuỗi liên tục, mỗi con số ở giữa chuỗi phải xuất hiện mấy lần (mỗi lần đi vào phải đi ra)?",
      },
      {
        level: 3,
        text: "Hãy đếm số lần xuất hiện của từng con số trong 5 quân Domino: số 1 (3 lần), số 2 (3 lần), số 3 (2 lần), số 4 (2 lần). Có bao nhiêu số xuất hiện lẻ lần?",
      },
    ],
    simulation: {
      type: "dominoLab",
      name: "Mô phỏng Nối chuỗi Domino",
      config: {
        pieces: [
          { id: "d1", a: 1, b: 2 },
          { id: "d2", a: 2, b: 3 },
          { id: "d3", a: 3, b: 1 },
          { id: "d4", a: 1, b: 4 },
          { id: "d5", a: 4, b: 2 },
        ],
      },
    },
    teachingPoint: "Hai đầu đặc biệt của chuỗi liên quan đến những số xuất hiện lẻ lần.",
    explanation: [
      "Bước 1: Mô hình hóa: Coi các số {1, 2, 3, 4} là các điểm. Mỗi quân Domino là một đoạn nối 2 điểm.",
      "Bước 2: Đếm số lần xuất hiện của từng số:\n• Số 1: tham gia trong [1|2], [3|1], [1|4] → Xuất hiện 3 lần (lẻ lần)\n• Số 2: tham gia trong [1|2], [2|3], [4|2] → Xuất hiện 3 lần (lẻ lần)\n• Số 3: tham gia trong [2|3], [3|1] → Xuất hiện 2 lần (chẵn lần)\n• Số 4: tham gia trong [1|4], [4|2] → Xuất hiện 2 lần (chẵn lần)",
      "Bước 3: Quy luật chuỗi: Các số ở giữa chuỗi mỗi lần đi vào phải đi ra nên luôn xuất hiện chẵn lần. Chỉ có hai số ở hai đầu chuỗi mới có thể xuất hiện lẻ lần. Vì có đúng 2 số lẻ lần (số 1 và số 2) nên chắc chắn xếp được chuỗi liên tục với hai đầu là 1 và 2!",
      "Ví dụ chuỗi hợp lệ: [1|3] nối [3|2] nối [2|4] nối [4|1] nối [1|2]. Cả 5 quân đều được dùng trọn vẹn đúng 1 lần. Đáp án là: Có.",
    ],
  },
  {
    id: "D11",
    title: "Mười số bí mật",
    order: 11,
    difficulty: 3,
    skills: ["optimization", "constraint"],
    problem: {
      text: "Có 10 số nguyên dương (các số có thể bằng nhau).\n\nBiết rằng bất kỳ 3 số nào trong 10 số đó cũng có tổng không vượt quá 14.\n\nHỏi tổng của cả 10 số đó lớn nhất có thể bằng bao nhiêu?",
      answerType: "number",
      unit: "tổng lớn nhất",
      placeholder: "Nhập tổng lớn nhất...",
    },
    answer: {
      value: 42,
      displayValue: "42",
    },
    hints: [
      {
        level: 1,
        text: "Sắp xếp 10 số nguyên dương theo thứ tự tăng dần: a1 ≤ a2 ≤ ... ≤ a10. Khi đó tổng 3 số nào sẽ lớn nhất?",
      },
      {
        level: 2,
        text: "Tổng của 3 số lớn nhất là a8 + a9 + a10 ≤ 14. Từ đó hãy chặn giới hạn trên của số a8.",
      },
      {
        level: 3,
        text: "Vì a8 ≤ a9 ≤ a10 nên 3 × a8 ≤ a8 + a9 + a10 ≤ 14 → a8 ≤ 4. Do đó tất cả các số từ a1 đến a8 đều không thể vượt quá 4!",
      },
    ],
    simulation: {
      type: "constraintLab",
      name: "Tối ưu hóa Bất đẳng thức Biên",
      config: {
        count: 10,
        minValue: 1,
        objective: {
          type: "maximizeSum",
        },
        constraint: {
          type: "anyKSumAtMost",
          k: 3,
          limit: 14,
        },
      },
    },
    teachingPoint: "Muốn kiểm soát tổng của bất kỳ 3 số nào, chỉ cần kiểm soát tổng của 3 số lớn nhất.",
    explanation: [
      "Bước 1: Gọi 10 số nguyên dương sắp xếp theo thứ tự không giảm là: a1 ≤ a2 ≤ a3 ≤ ... ≤ a8 ≤ a9 ≤ a10.",
      "Bước 2: Ràng buộc 'bất kỳ 3 số nào có tổng ≤ 14' áp dụng cho 3 số lớn nhất là: a8 + a9 + a10 ≤ 14.\nVì a8 ≤ a9 ≤ a10 nên: 3 × a8 ≤ a8 + a9 + a10 ≤ 14 → a8 ≤ 14/3 ≈ 4.67.\nVì a8 là số nguyên dương nên giá trị cực đại của a8 là 4.",
      "Bước 3: Do dãy tăng dần nên mọi số từ a1 đến a7 đều thỏa mãn: a1, a2, ..., a7 ≤ a8 ≤ 4.\nĐể tổng 10 số lớn nhất, ta chọn a1 = a2 = ... = a7 = a8 = 4 (8 số đầu mỗi số bằng 4).",
      "Bước 4: Còn lại 2 số a9 và a10 lớn nhất: ta cần 4 + a9 + a10 ≤ 14 → a9 + a10 ≤ 10 (với 4 ≤ a9 ≤ a10).\nTa có thể chọn a9 = 5 và a10 = 5 (tổng a9 + a10 = 10, thỏa mãn 4 ≤ 5 ≤ 5).",
      "Bước 5: Tổng lớn nhất của 10 số: (8 × 4) + 5 + 5 = 32 + 10 = 42.",
    ],
  },
  {
    id: "D12",
    title: "Bắn tàu",
    order: 12,
    difficulty: 3,
    skills: ["strategy", "coverage"],
    problem: {
      text: "Trên một bảng ô vuông kích thước 4 × 4 gồm 16 ô.\n\nMột con tàu chiến chiếm đúng 3 ô liên tiếp theo hàng ngang hoặc cột dọc (kích thước 1 × 3 hoặc 3 × 1).\nBob hoàn toàn không biết con tàu đang ẩn nấp ở đâu.\n\nMỗi lượt, Bob chọn một ô để bắn phát đạn vào đó.\n\nHỏi Bob cần bắn ít nhất bao nhiêu ô để CHẮC CHẮN bắn trúng tàu trong mọi trường hợp?",
      answerType: "number",
      unit: "ô bắn",
      placeholder: "Nhập số ô bắn ít nhất...",
    },
    answer: {
      value: 5,
      displayValue: "5 ô",
    },
    hints: [
      {
        level: 1,
        text: "'Chắc chắn trúng' có nghĩa là: không thể đặt một con tàu 1 × 3 nào vào bảng mà không bị đè lên ít nhất một ô đã bắn.",
      },
      {
        level: 2,
        text: "Trong mỗi hàng ngang dài 4 ô, muốn không để con tàu 3 ô lọt qua thì cần bắn ít nhất 1 ô. Tương tự với mỗi cột dọc.",
      },
      {
        level: 3,
        text: "Nếu chỉ bắn 4 ô (mỗi hàng 1 ô) thì các cột vẫn có thể chứa đoạn 3 ô trống dọc. Thử kiểm tra xem với 5 ô bắn có thể chặn đứng mọi khả năng không.",
      },
    ],
    simulation: {
      type: "battleshipLab",
      name: "Chiến trường Bắn tàu Tọa độ 4x4",
      config: {
        rows: 4,
        cols: 4,
        shipLength: 3,
        orientations: ["horizontal", "vertical"],
      },
    },
    teachingPoint: "Muốn CHẮC CHẮN trúng, không được để sót bất kỳ vị trí hợp lệ nào của con tàu.",
    explanation: [
      "Bước 1: Khái niệm Tập chặn (Hitting Set): Tập hợp các ô bắn cần giao với mọi vị trí tàu kích thước 1 × 3 và 3 × 1 trên bảng 4 × 4.",
      "Bước 2: Chứng minh 4 phát bắn là chưa đủ: Bảng 4 × 4 có 8 đoạn 1 × 3 ngang và 8 đoạn 3 × 1 dọc. Nếu chỉ bắn 4 phát, để chặn 4 hàng ngang ta phải bắn mỗi hàng đúng 1 ô tại cột 2 hoặc cột 3. Khi đó 4 phát bắn chỉ nằm trên cột 2 và 3, để lại cột 1 và cột 4 hoàn toàn trống trơn (mỗi cột này dài 4 ô, dễ dàng chứa vừa con tàu 3 ô dọc). Do đó không thể chặn hết bằng 4 phát bắn.",
      "Bước 3: Chứng minh 5 phát bắn là đủ: Chọn 5 ô tại các tọa độ (hàng, cột) theo quy luật bao phủ bàn cờ:\n• Ô (1, 2)\n• Ô (2, 4)\n• Ô (3, 1)\n• Ô (4, 3)\n• Và thêm 1 ô chặn đường chéo (chẳng hạn ô (2, 3)).\nKhi đó không còn bất kỳ đoạn 3 ô liên tiếp nào (dù ngang hay dọc) còn trống nguyên vẹn.",
      "Kết luận: Số phát bắn tối thiểu cần thiết để chắc chắn trúng tàu là 5 ô.",
    ],
  },
];
