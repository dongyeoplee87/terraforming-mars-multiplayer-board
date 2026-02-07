# Terraforming Mars - Multiplayer Scoreboard

테라포밍 마스 보드게임을 위한 웹 기반 디지털 스코어보드입니다.

## Key Features

### 🎮 멀티플레이어 지원 (최대 2인)
- 1인/2인 플레이 모드 전환
- 각 플레이어별 독립적인 자원 관리
- 화면 분할로 동시 진행 가능

### ✏️ 플레이어 이름 커스터마이징
- 플레이어 이름 클릭으로 즉시 수정 가능
- 게임 중에도 실시간 변경 가능
- New Game 시에도 이름 유지

### ↺ Undo 기능
- 각 플레이어별 독립적인 실행 취소
- 최근 10개 액션까지 되돌리기 가능
- 실수로 인한 자원 조작 실수 방지
- 자원 변경, 생산량 조정, TR 변경 모두 복구 가능

### 💰 계산기 모달
- 각 자원 클릭 시 계산기 팝업
- 숫자 패드로 정확한 입출금 처리
- Spend/Gain 버튼으로 직관적인 조작

### 🌍 세대 진행 자동화
- Generation Next 버튼으로 모든 플레이어 동시 진행
- Megacredits 자동 계산 (생산량 + TR)
- Energy → Heat 자동 변환
- 생산량 자동 적용

### 📱 모바일 원격 접속 지원
- 같은 Wi-Fi 네트워크 내에서 모바일 기기로 접속 가능
- 동적 API URL 설정으로 자동 연결
- 터치 최적화된 UI/UX (tap-highlight, touch-action)
- 반응형 디자인으로 다양한 화면 크기 지원

## 설치 및 실행

### Backend (Flask)

```bash
cd backend
pip install -r requirements.txt
python app.py
```

서버는 `http://0.0.0.0:5000`에서 실행됩니다 (모든 네트워크 인터페이스).

### Frontend

```bash
cd frontend
python -m http.server 8000
```

브라우저에서 `http://localhost:8000`을 엽니다.

### 📱 모바일에서 접속하기

1. **PC의 IP 주소 확인**
   ```powershell
   ipconfig
   ```
   IPv4 주소를 확인하세요 (예: 192.168.0.10)

2. **백엔드 서버 실행** (위 Backend 실행 방법대로)

3. **프론트엔드 서버 실행**
   ```bash
   cd frontend
   # PC의 모든 인터페이스에서 접속 가능하도록 실행
   python -m http.server 8000 --bind 0.0.0.0
   ```

4. **모바일에서 접속**
   - 모바일과 PC가 같은 Wi-Fi에 연결되어 있어야 합니다
   - 모바일 브라우저에서: `http://[PC_IP주소]:8000`
   - 예: `http://192.168.0.10:8000`

5. **방화벽 설정**
   - Windows 방화벽에서 5000번, 8000번 포트 허용 필요
   - 또는 일시적으로 방화벽 비활성화

## 기술 스택

- **Backend**: Flask (Python)
- **Frontend**: Vue.js 3
- **State Management**: RESTful API

## 주요 API 엔드포인트

- `GET /api/game-state`: 게임 상태 조회
- `POST /api/player/<player_id>/resource/<resource_type>`: 자원 업데이트
- `POST /api/player/<player_id>/rating`: TR 업데이트
- `POST /api/player/<player_id>/name`: 플레이어 이름 변경
- `POST /api/player/<player_id>/restore`: Undo (상태 복원)
- `POST /api/generation`: 세대 진행 (모든 플레이어 적용)
- `POST /api/reset`: 게임 초기화
