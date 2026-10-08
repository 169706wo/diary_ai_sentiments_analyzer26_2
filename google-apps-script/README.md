# 구글 앱스 스크립트 (GAS) 설정 및 배포 가이드

제공해 주신 구글 스프레드시트와 연동되는 CRUD 웹 앱 스크립트입니다.

- **스프레드시트 주소**: [Google Sheets 바로가기](https://docs.google.com/spreadsheets/d/1Ye4QuGEjjGiQTWyzJDxTSyX-4fDBKKkk57OQ2gSmI9U/edit)
- **스크립트 소스 코드**: `google-apps-script/Code.gs`

---

## 1. 구글 시트 구조
시트 첫 행에 다음 3개의 컬럼 헤더가 구성됩니다:
- `timestamp`: 고유 식별자 / 생성 시간값 (ID 역할)
- `datetime`: 작성 날짜 및 시간 문자열 (예: `2026년 10월 8일 목요일 오후 3:00`)
- `content`: 일기 본문 내용

---

## 2. 구글 시트에 스크립트 등록 및 웹 앱 배포 방법

1. 제공해 주신 [구글 시트 링크](https://docs.google.com/spreadsheets/d/1Ye4QuGEjjGiQTWyzJDxTSyX-4fDBKKkk57OQ2gSmI9U/edit)를 브라우저로 엽니다.
2. 상단 메뉴에서 **[확장 프로그램] > [Apps Script]**를 클릭합니다.
3. 열린 편집기 창의 기존 코드를 지우고, [Code.gs](file:///Users/haesol/Downloads/diary_ai_sentiments_analyzer26_2/google-apps-script/Code.gs) 내용을 복사하여 붙여넣습니다.
4. 상단의 **[저장 (💾)]** 버튼을 누릅니다.
5. 우측 상단의 **[배포] > [새 배포]**를 클릭합니다.
   - 유형 선택: **웹 앱 (Web app)**
   - 설명: `MindLog CRUD API`
   - 다음 사용자 모드로 실행: **나 (내 Google 계정)**
   - 액세스 권한이 있는 사용자: **모든 사용자 (Anyone)** *(웹 앱/프론트엔드에서 호출 가능하도록 설정)*
6. **[배포]** 버튼을 누르고 최초 1회 **권한 검토(액세스 허용)**를 진행합니다.
7. 배포 완료 후 나타나는 **웹 앱 URL (`https://script.google.com/macros/s/.../exec`)**을 복사합니다.

---

## 3. API 사용법 (CRUD)

### 1) 조회 (Read) - `GET`
- **전체 목록 조회**:
  ```http
  GET https://script.google.com/macros/s/{DEPLOY_ID}/exec?action=read
  ```
- **특정 timestamp 단건 조회**:
  ```http
  GET https://script.google.com/macros/s/{DEPLOY_ID}/exec?action=read&timestamp=1728363600000
  ```

### 2) 생성 (Create) - `POST`
- **Body (JSON)**:
  ```json
  {
    "action": "create",
    "datetime": "2026년 10월 8일 목요일 오후 3:00",
    "content": "오늘 하루도 뜻깊은 시간이었다."
  }
  ```

### 3) 수정 (Update) - `POST`
- **Body (JSON)**:
  ```json
  {
    "action": "update",
    "timestamp": "1728363600000",
    "datetime": "2026년 10월 8일 목요일 오후 4:00",
    "content": "수정된 일기 내용입니다."
  }
  ```

### 4) 삭제 (Delete) - `POST`
- **Body (JSON)**:
  ```json
  {
    "action": "delete",
    "timestamp": "1728363600000"
  }
  ```
