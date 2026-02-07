# Terraforming Mars - Multiplayer Scoreboard

웹 기반 테라포밍 마스 스코어보드 애플리케이션입니다.

## 기능

- 1인/2인 플레이 지원
- 테라포밍 레이팅 및 세대 관리
- 6가지 리소스 관리 (Megacredits, Steel, Titanium, Plants, Energy, Heat)
- 생산량(Production)과 보유량(Resources) 분리 관리
- 다음 세대로 이동 시 자동 생산량 적용 및 에너지→히트 변환
- 실시간 상태 동기화

## 설치 및 실행

### Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

서버는 `http://localhost:5000`에서 실행됩니다.

### Frontend

```bash
cd frontend
# 간단한 HTTP 서버 실행 (Python 3)
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다.

## 사용 방법

1. **플레이어 설정**: 상단에서 1인 또는 2인 플레이를 선택합니다.
2. **리소스 관리**:
   - 상단 숫자: 현재 보유한 리소스
   - 중간 숫자: 생산량 (매 세대마다 추가됨)
   - 하단 버튼: 리소스 직접 조작
3. **세대 진행**: "Next" 버튼을 눌러 다음 세대로 이동
   - 생산량이 자동으로 리소스에 추가됩니다
   - 에너지가 히트로 변환됩니다
4. **새 게임**: "New Game" 버튼으로 모든 상태를 초기화합니다.

## 리소스 변환 규칙

- 1 Steel = 2 Megacredits
- 1 Titanium = 3 Megacredits
- 8 Plants = 1 Greenery Tile
- Energy → Heat (매 세대마다 자동 변환)
- 8 Heat = 1 Temperature

## 기술 스택

- **Backend**: Flask (Python)
- **Frontend**: Vue.js 3, Vanilla CSS
- **API**: RESTful API

## 프로젝트 구조

```
terraforming-mars-multiplayer-board/
├── backend/
│   ├── app.py              # Flask 서버
│   └── requirements.txt    # Python 의존성
├── frontend/
│   ├── index.html          # 메인 HTML
│   ├── main.js             # Vue.js 애플리케이션
│   └── style.css           # 스타일시트
└── README.md
```

## API 엔드포인트

- `GET /api/game-state`: 게임 상태 조회
- `POST /api/game-state`: 게임 상태 업데이트
- `POST /api/player/<player_id>/resource/<resource_type>`: 리소스 업데이트
- `POST /api/player/<player_id>/rating`: 테라포밍 레이팅 업데이트
- `POST /api/generation`: 다음 세대로 진행
- `POST /api/player-count`: 플레이어 수 설정
- `POST /api/reset`: 게임 초기화
