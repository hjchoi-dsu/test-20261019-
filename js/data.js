// 동신대학교 교수학습센터(CTL) 데이터베이스 모듈
const CTL_DATA = {
  // 센터 기본 정보
  info: {
    name: "동신대학교 교수학습지원센터",
    shortName: "동신대 CTL",
    englishName: "Center for Teaching & Learning",
    slogan: "학생이 행복한 대학, 내일을 여는 스마트 배움의 길잡이",
    location: "전라남도 나주시 건재로 235 동신대학교 중앙도서관 2층",
    contact: {
      tel: "061-330-3114 (내선 3841~3)",
      email: "ctl@dsu.ac.kr",
      operatingHours: "평일 09:00 ~ 18:00 (점심시간 12:00~13:00 / 방학 중 단축근무)"
    },
    stats: {
      annualStudents: "3,480+",
      supportScholarship: "1.85억+",
      satisfactionRate: "98.7%",
      activePrograms: "28+"
    }
  },

  // 프로그램 목록
  programs: [
    {
      id: "prog-01",
      title: "2026-1학기 러닝파트너 24기 (학습공동체)",
      subtitle: "전공 & 교과 스터디! 팀당 최대 50만원 지원 및 우수팀 장학금",
      category: "community",
      categoryName: "학습공동체",
      badge: "인기 No.1",
      status: "urgent", // 'open', 'urgent', 'upcoming', 'closed'
      statusText: "마감임박 (D-2)",
      period: "2026.03.10 ~ 2026.03.25",
      activityPeriod: "2026.04.01 ~ 2026.06.12 (총 8주)",
      target: "동신대학교 학부 재학생 (3~5인 1팀 구성)",
      capacity: 40,
      currentEnrolled: 37,
      mileage: 150,
      instructor: "교수학습지원센터 학습지원팀",
      location: "스마트 러닝 라운지 및 자율 스터디룸",
      thumbnail: "assets/hero_banner.jpg",
      description: "동신대 대표 학생주도형 스터디 프로그램! 팀원들과 함께 전공 과목이나 자격증, 어학을 공부하며 주차별 학습일지를 작성하고, 기말 성과발표회를 통해 우수팀으로 선발되면 총 200만원 상당의 시상금과 비교과 마일리지를 획득할 수 있습니다.",
      curriculum: [
        "1단계: 학습계획서 수립 및 오리엔테이션 (비대면 Zoom 병행)",
        "2단계: 주 1회 2시간 이상 협동 스터디 및 주차별 학습활동 보고서 제출",
        "3단계: 중간 모니터링 컨설팅 및 멘토링 지원",
        "4단계: 최종 성과보고서 제출 및 러닝페어 우수팀 시상식"
      ],
      benefits: [
        "팀별 활동지원금 20만~50만원 차등 지원",
        "우수팀 추가 성과 장학금 수여 (최우수 1팀 100만원)",
        "비교과 드림마일리지 150P 지급",
        "교수학습센터 스터디룸 우선 예약 권한 제공"
      ]
    },
    {
      id: "prog-02",
      title: "생성형 AI(ChatGPT & Claude) 활용 A+ 리포트 & 과제 워크숍",
      subtitle: "프롬프트 엔지니어링 실습부터 연구 윤리까지 완벽 마스터",
      category: "aitech",
      categoryName: "AI·에듀테크",
      badge: "HOT 신설",
      status: "open",
      statusText: "접수중",
      period: "2026.03.15 ~ 2026.04.05",
      activityPeriod: "2026.04.08 (수) 15:00~18:00 (3시간 집중)",
      target: "전 재학생 선착순 50명 (노트북 지참 권장)",
      capacity: 50,
      currentEnrolled: 32,
      mileage: 60,
      instructor: "이진우 교수 (AI융합학습 전문가)",
      location: "정보전산원 3층 멀티미디어 스마트실습실",
      thumbnail: "assets/hero_banner.jpg",
      description: "인공지능 시대를 선도하는 대학생 필수 특강! 생성형 AI를 올바르고 똑똑하게 활용하여 자료 조사 시간을 1/10로 단축하고, 논리적인 리포트 개요 작성 및 데이터 분석 기법을 실습합니다. 학업 윤리 준수 가이드라인도 함께 교육합니다.",
      curriculum: [
        "Part 1. 학업 효율을 300% 높이는 핵심 프롬프트 패턴 5가지",
        "Part 2. 논문 검색, 영문 요약, 데이터 시각화 AI 툴 실습",
        "Part 3. 표절 검사와 대학 학업 윤리 기준 명확히 알기",
        "Part 4. 나만의 AI 맞춤형 튜터 챗봇 만들기 실습"
      ],
      benefits: [
        "실습용 AI 프롬프트 템플릿 치트시트 PDF 무료 제공",
        "비교과 드림마일리지 60P 적립",
        "CTL 이수증 공식 발급"
      ]
    },
    {
      id: "prog-03",
      title: "1:1 맞춤형 MLST 학습전략검사 및 전문가 코칭",
      subtitle: "내 공부 유형 분석! 학습 부진 탈출 및 학점 향상 꿀팁 처방",
      category: "consulting",
      categoryName: "1:1 컨설팅",
      badge: "상시접수",
      status: "open",
      statusText: "접수중",
      period: "2026.03.01 ~ 2026.06.30 (학기 상시 운영)",
      activityPeriod: "신청 후 일정 협의 (회당 50분, 대면/비대면 선택)",
      target: "동신대학교 재학생 누구나 (학사경고 및 성적 고민자 우선 배정)",
      capacity: 100,
      currentEnrolled: 64,
      mileage: 40,
      instructor: "CTL 전담 학습전문상담관 (전문상담사)",
      location: "중앙도서관 2층 CTL 1:1 상담실 (또는 온라인 Zoom)",
      thumbnail: "assets/mascot.jpg",
      description: "‘열심히 하는데 왜 시험만 보면 성적이 안 나올까?’ 고민하는 학생을 위한 과학적 진단! 표준화된 MLST-II 학습전략검사를 온라인으로 실시하고, 전문 상담사와 1:1로 만나 나의 학습 습관, 시간 관리, 시험 불안 요인을 분석하고 나만의 최적 공부법을 설계합니다.",
      curriculum: [
        "1단계: 온라인 MLST 표준화 검사 진행 (약 25분 소요)",
        "2단계: 검사 결과 종합 분석 리포트 생성",
        "3단계: 1:1 심층 상담 (시간관리, 필기법, 동기부여, 시험대비 전략 코칭)",
        "4단계: 4주 후 학습 실행도 점검 및 사후 모니터링"
      ],
      benefits: [
        "개인 맞춤형 종합 학습역량 진단 분석표 제공",
        "비교과 드림마일리지 40P 적립",
        "원하는 경우 러닝파트너 또는 튜터링 우선 매칭 기회"
      ]
    },
    {
      id: "prog-04",
      title: "동신 튜터링 (TUTORING) - 선후배 맞춤 학업 멘토링",
      subtitle: "A+ 선배 튜터의 전공 꿀팁 전수! 튜터에게는 장학금 튜티에게는 성적 점프",
      category: "community",
      categoryName: "학습공동체",
      badge: "장학혜택",
      status: "urgent",
      statusText: "마감임박 (D-3)",
      period: "2026.03.12 ~ 2026.03.26",
      activityPeriod: "2026.04.07 ~ 2026.06.05 (주 2시간, 총 20시간)",
      target: "튜터: 직전학기 3.5 이상 선배 / 튜티: 해당 과목 수강 신입생 및 재학생",
      capacity: 30,
      currentEnrolled: 26,
      mileage: 120,
      instructor: "선발된 우수 학생 튜터 & 지도교수",
      location: "동신대 스마트 스터디라운지",
      thumbnail: "assets/hero_banner.jpg",
      description: "어려운 전공 필수 과목, 혼자 끙끙 앓지 마세요! 과목을 이미 A+로 이수한 선배 튜터가 1:1 또는 1:2로 과제, 시험 족보 정리, 핵심 개념 풀이를 다정하게 지도해 주는 동신대 대표 멘토링 프로그램입니다.",
      curriculum: [
        "튜터 사전 교수법 교육 및 교재 선정",
        "주당 2시간 정기 과외식 멘토링 활동",
        "주차별 튜터링 일지 및 피드백 작성",
        "최종 성취도 평가 및 활동 인증서 발급"
      ],
      benefits: [
        "튜터: 활동 장학금 최대 60만원 지급",
        "튜티: 수료 시 드림마일리지 120P 지급",
        "과목 성적 향상 시 '스마트 레벨업 장학금' 연계"
      ]
    },
    {
      id: "prog-05",
      title: "메타인지 기반 '기적의 학점 4.5' 시험대비 학습법 특강",
      subtitle: "벼락치기 탈출! 뇌과학 기반의 기억 지속 복습 알고리즘 & 코넬노트법",
      category: "workshop",
      categoryName: "학습법·특강",
      badge: "실시간 LIVE",
      status: "open",
      statusText: "접수중",
      period: "2026.03.18 ~ 2026.04.10",
      activityPeriod: "2026.04.14 (화) 18:00~20:00 (온·오프라인 하이브리드)",
      target: "학점 상승을 꿈꾸는 동신대학교 전 학부생",
      capacity: 80,
      currentEnrolled: 45,
      mileage: 50,
      instructor: "김민혁 수석학습코치 (학습과학연구소)",
      location: "중앙도서관 시청각실 & 유튜브 라이브 실시간 송출",
      thumbnail: "assets/reward_banner.jpg",
      description: "똑같이 3시간 공부하고도 2배 더 오래 기억하는 비밀! 에빙하우스 망각곡선을 이기는 인출 연습(Retrieval Practice)과 코넬식 스마트 필기법, 중간고사 D-14 맞춤형 시간표 플래닝 비법을 전수합니다.",
      curriculum: [
        "1. 내가 아는 것과 모르는 것을 구별하는 메타인지 훈련법",
        "2. 시험 전날 불안을 없애는 능동적 셀프 테스트(Active Recall)",
        "3. 노션(Notion)과 태블릿을 활용한 스마트 디지털 서머리 작성법",
        "4. 실전 Q&A 및 선배들의 공부 비법 질의응답"
      ],
      benefits: [
        "DSU 프리미엄 학습 플래너 실물 굿즈 증정 (오프라인 참석자)",
        "드림마일리지 50P 적립",
        "강의 다시보기 VOD 2주간 제공"
      ]
    },
    {
      id: "prog-06",
      title: "2026 나의 학습 성공 수기 및 꿀팁 공모전",
      subtitle: "CTL 프로그램 참여 후기와 나만의 독창적인 학업 비법을 뽐내보세요!",
      category: "workshop",
      categoryName: "공모전·이벤트",
      badge: "총상금 250만",
      status: "upcoming",
      statusText: "오픈예정 (4월초)",
      period: "2026.04.01 ~ 2026.05.20",
      activityPeriod: "2026.05.28 심사 발표 및 시상",
      target: "2025~2026년 CTL 프로그램 참여 이력이 있는 재학생",
      capacity: 150,
      currentEnrolled: 0,
      mileage: 80,
      instructor: "동신대학교 교수학습지원센터 운영위원회",
      location: "온라인 접수 (CTL 앱 & 홈페이지 제출)",
      thumbnail: "assets/reward_banner.jpg",
      description: "‘CTL 덕분에 내 대학생활이 이렇게 바뀌었다!’ 러닝파트너, 튜터링, 학습법 특강을 통해 성적 향상을 이뤄낸 감동적인 스토리나 나만의 독창적인 학업 루틴을 에세이 또는 카드뉴스로 제출하는 연례 공모전입니다.",
      curriculum: [
        "에세이 부문: A4 2~3매 분량의 솔직 담백한 성장 수기",
        "미디어 부문: 숏폼 영상(1분 이내) 또는 8~10컷 카드뉴스",
        "학생 심사단 투표 30% + 전문가 심사 70% 반영"
      ],
      benefits: [
        "대상(1명): 총장상 및 장학금 70만원",
        "최우수상(2명): 센터장상 및 장학금 40만원",
        "참가자 전원: 드림마일리지 80P 및 스타벅스 기프티콘 증정"
      ]
    },
    {
      id: "prog-07",
      title: "[교원 전용] 하이브리드 수업을 위한 에듀테크 & AI 교수설계 워크숍",
      subtitle: "생성형 AI를 활용한 강의계획서 작성 및 인터랙티브 퀴즈 도구 활용법",
      category: "faculty",
      categoryName: "교수지원",
      badge: "교수역량강화",
      status: "open",
      statusText: "접수중",
      period: "2026.03.15 ~ 2026.04.10",
      activityPeriod: "2026.04.16 (목) 14:00~17:00",
      target: "동신대학교 전임 및 비전임 교원",
      capacity: 30,
      currentEnrolled: 18,
      mileage: 0,
      instructor: "박경수 교수 (한국교육공학회 이사)",
      location: "CTL 스마트 티칭 스튜디오",
      thumbnail: "assets/hero_banner.jpg",
      description: "학생들의 수업 집중도와 흥미를 극대화하는 최신 교수법! 플립러닝(Flipped Learning) 설계를 위한 멘티미터(Mentimeter), 캔바(Canva), 생성형 AI 도구의 구체적 수업 활용 노하우를 실습합니다.",
      curriculum: [
        "1. 학생들의 질문을 이끌어내는 능동적 수업 상호작용 도구",
        "2. AI를 보조교사로 활용한 평가 문항 및 루브릭(Rubric) 자동 생성",
        "3. 마이크로러닝 숏폼 강의 콘텐츠 제작 기법",
        "4. 동신대 우수 강의 사례 공유 및 티칭 팁 토론"
      ],
      benefits: [
        "교원 업적평가 연구/교육 영역 점수 반영",
        "워크숍 실습 가이드북 교재 배부",
        "희망 교원 대상 1:1 마이크로티칭(수업 컨설팅) 무료 지원"
      ]
    }
  ],

  // 생생 우수 참여 후기
  reviews: [
    {
      id: "rev-1",
      studentName: "김*진",
      department: "간호학과 3학년",
      programName: "러닝파트너 23기",
      rating: 5,
      highlight: "학점 2.9에서 4.25로 극적 반등! 장학금까지 받았어요 ㅠㅠ",
      comment: "혼자 공부할 땐 국가고시 과목이 막막했는데, 러닝파트너로 팀원들과 매주 요약집 만들고 서로 질문놀이 하면서 성적이 정말 엄청 올랐어요. 센터에서 주신 스터디룸도 쾌적하고 멘토링 교수님 조언도 큰 힘이 되었습니다! 동신대생이라면 무조건 신청하세요!",
      date: "2026.02.20",
      avatarBg: "linear-gradient(135deg, #3B82F6, #1D4ED8)"
    },
    {
      id: "rev-2",
      studentName: "이*석",
      department: "컴퓨터공학과 2학년",
      programName: "AI 툴 활용 학업 워크숍",
      rating: 5,
      highlight: "과제 리포트 작성 시간이 절반으로 줄었습니다.",
      comment: "단순히 AI를 베끼는 게 아니라, 내가 쓴 코드를 디버깅하고 논문 자료를 구조화하는 프롬프트 기술을 배웠습니다. 이 워크숍 듣고 나니 팀플 발표 준비가 너무 수월해졌어요. 마일리지 60점도 꿀이었습니다!",
      date: "2026.03.02",
      avatarBg: "linear-gradient(135deg, #10B981, #047857)"
    },
    {
      id: "rev-3",
      studentName: "박*아",
      department: "물리치료학과 1학년",
      programName: "1:1 MLST 학습컨설팅",
      rating: 5,
      highlight: "대학 공부가 고등학교와 달라서 멘붕이었는데 길을 찾았습니다.",
      comment: "고등학교 때처럼 달달 외우다가 첫 퀴즈를 망치고 CTL 문을 두드렸는데, 전문 상담사 선생님께서 제 학습 스타일이 '시각적 요약형'이라는 걸 짚어주시고 플래너 작성법을 1:1로 지도해주셔서 이번 학기 자신감이 생겼습니다.",
      date: "2026.03.11",
      avatarBg: "linear-gradient(135deg, #F59E0B, #D97706)"
    }
  ],

  // 시설 및 공간 안내
  facilities: [
    {
      id: "fac-1",
      name: "스마트 러닝 라운지",
      location: "중앙도서관 2층 로비 앞",
      desc: "자유로운 노트북 사용, 빈백 소파, 듀얼 모니터 검색석 완비! 스터디와 휴식을 동시에 즐길 수 있는 오픈형 배움터",
      capacity: "최대 40석",
      equipment: "고속 Wi-Fi, 전 좌석 콘센트, 컬러 무인복합기, 무소음 키보드 대여",
      availableTime: "평일 09:00 ~ 21:00 (시험기간 24시간 개방)",
      tags: ["자율학습", "노트북존", "휴게공간"]
    },
    {
      id: "fac-2",
      name: "그룹 협동 스터디룸 (Room A / B / C)",
      location: "중앙도서관 2층 CTL 내부",
      desc: "러닝파트너 및 동신 튜터링 전용 팀 프로젝트 공간! 대형 스마트 전자칠판과 방음 시설 완비",
      capacity: "각 룸당 4~8명",
      equipment: "75인치 터치 전자칠판, 웹캠 화상회의 시스템, 화이트보드 벽면",
      availableTime: "평일 09:30 ~ 17:30 (사전 예약제)",
      tags: ["팀프로젝트", "전자칠판", "사전예약"]
    },
    {
      id: "fac-3",
      name: "첨단 크리에이터 & 티칭 스튜디오",
      location: "정보전산원 204호",
      desc: "수업 콘텐츠 녹화, 숏폼 교육 영상 및 학생 유튜브 발표 제작이 가능한 방송급 4K 크로마키 스튜디오",
      capacity: "1~4명",
      equipment: "4K 스튜디오 카메라 2대, 프롬프터, 슈어 고성능 마이크, 전동 크로마키",
      availableTime: "평일 10:00 ~ 17:00 (사전 승인제)",
      tags: ["영상제작", "크로마키", "마이크로티칭"]
    }
  ],

  // 챗봇 동신이 빠른 질의응답 및 키워드 규칙
  faqResponses: [
    {
      keywords: ["러닝파트너", "학습동아리", "스터디"],
      title: "러닝파트너 프로그램 안내",
      content: "러닝파트너는 동신대 대표 협동학습 프로그램입니다! 3~5인이 팀을 이뤄 신청할 수 있으며, 팀별 활동비 최대 50만원 지원 및 활동 후 우수팀 장학금(최대 100만원)과 150P 마일리지가 주어집니다. 지금 [프로그램] 탭에서 신청하실 수 있어요!"
    },
    {
      keywords: ["마일리지", "포인트", "장학금", "드림마일리지"],
      title: "드림 마일리지 혜택 안내",
      content: "CTL 프로그램에 참여할 때마다 비교과 '드림 마일리지'가 차곡차곡 적립됩니다! 400P 이상 달성 시 동신 굿즈 교환권 및 카페 이용권, 학기말 누적 마일리지 상위 학생에게는 최대 100만원의 '비교과 성취 장학금'이 현금으로 지급됩니다! [마이마일리지] 탭에서 확인해보세요."
    },
    {
      keywords: ["상담", "컨설팅", "mlst", "학점", "공부법"],
      title: "1:1 학습컨설팅 예약 안내",
      content: "혼자 공부하기 힘들거나 시험 전략이 고민이라면 전문 상담선생님과의 1:1 MLST 학습컨설팅을 추천해요! 온라인으로 20분간 검사 후 방문 또는 Zoom으로 50분간 맞춤 솔루션을 무료로 받아볼 수 있습니다."
    },
    {
      keywords: ["위치", "어디", "장소", "전화", "연락처", "시간"],
      title: "교수학습센터 위치 및 이용시간",
      content: "동신대학교 중앙도서관 2층에 위치해 있습니다! 평일 09:00~18:00 (점심시간 12:00~13:00) 상시 열려있으니 언제든 편하게 방문해주세요. 직통 전화는 061-330-3114 입니다."
    },
    {
      keywords: ["튜터링", "튜터", "멘토링"],
      title: "동신 튜터링 안내",
      content: "직전 학기 전공 성적이 우수한 선배 튜터와 후배 튜티가 1:1로 매칭되어 전공 과목을 집중 지도받는 멘토링입니다. 튜터에게는 시간당 활동 장학금이, 튜티에게는 학점 향상과 마일리지가 지원됩니다!"
    },
    {
      keywords: ["ai", "인공지능", "chatgpt", "특강"],
      title: "생성형 AI 학업 워크숍 안내",
      content: "최신 ChatGPT와 Claude 등 생성형 AI를 활용한 A+ 리포트 작성 & 데이터 분석 워크숍이 4월에 개설됩니다! 프롬프트 엔지니어링 실습과 대학생 연구 윤리까지 3시간 동안 마스터할 수 있습니다."
    }
  ],

  // 데일리 퀴즈 문제 (마일리지 획득용)
  quizzes: [
    {
      id: "q1",
      question: "동신대학교 교수학습센터(CTL)가 위치한 건물과 층수는 어디일까요?",
      options: ["학생회관 1층", "중앙도서관 2층", "본관 3층", "산학협력관 지하 1층"],
      correctIndex: 1,
      explanation: "정답입니다! 동신대 CTL은 중앙도서관 2층에 위치하고 있습니다."
    },
    {
      id: "q2",
      question: "동신대 학생 3~5인이 팀을 이뤄 전공 스터디를 진행하고 지원금을 받는 대표 프로그램은?",
      options: ["러닝파트너", "동신런닝맨", "스터디프렌즈", "드림메이커"],
      correctIndex: 0,
      explanation: "정답입니다! '러닝파트너'는 팀당 최대 50만원 지원과 우수팀 장학금이 주어지는 대표 프로그램입니다."
    },
    {
      id: "q3",
      question: "동신대학교의 공식 상징 조류(校鳥)이자 CTL 마스코트의 모티브인 새는 무엇일까요?",
      options: ["독수리", "참새", "매 (Falcon)", "비둘기"],
      correctIndex: 2,
      explanation: "정답입니다! 동신대의 교조는 진취적 기상을 상징하는 '매'입니다."
    }
  ],

  // 공지사항
  notices: [
    {
      id: "nt-1",
      tag: "모집공고",
      title: "[대모집] 2026학년도 1학기 러닝파트너 24기 스터디 그룹 모집 (D-2)",
      date: "2026.03.14",
      isNew: true
    },
    {
      id: "nt-2",
      tag: "특강안내",
      title: "[신청] 생성형 AI 활용 A+ 리포트 작성법 특강 사전 접수 안내",
      date: "2026.03.12",
      isNew: true
    },
    {
      id: "nt-3",
      tag: "장학안내",
      title: "2025-2학기 비교과 드림마일리지 장학금 지급 결과 안내",
      date: "2026.02.28",
      isNew: false
    },
    {
      id: "nt-4",
      tag: "시설이용",
      title: "중앙도서관 2층 스마트 러닝 라운지 야간 연장 운영 안내",
      date: "2026.02.15",
      isNew: false
    }
  ]
};

// 브라우저 전역 노출
window.CTL_DATA = CTL_DATA;
