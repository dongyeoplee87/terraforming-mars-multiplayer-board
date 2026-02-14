# 간편 배포: Render.com (무료)

Render.com은 AWS보다 설정이 간단하고 완전 무료로 사용할 수 있습니다.
이력서 임팩트는 AWS보다 낮지만, 빠르게 배포하고 싶다면 추천합니다.

## 🚀 Render.com 배포 (5분)

### 1. GitHub에 코드 업로드

```powershell
cd c:\Users\home\Project\terraforming-mars-multiplayer-board

# Git 초기화
git init
git add .
git commit -m "Initial commit"

# GitHub 저장소 생성 후 (https://github.com/new)
git remote add origin https://github.com/yourusername/terraforming-mars-board.git
git branch -M main
git push -u origin main
```

### 2. Render.com 설정

1. https://render.com 회원가입 (GitHub 연동)
2. "New Web Service" 클릭
3. GitHub 저장소 선택
4. 설정:
   - **Name**: terraforming-mars-board
   - **Environment**: Python 3
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && gunicorn --worker-class eventlet -w 1 --bind 0.0.0.0:$PORT app:app`
   - **Instance Type**: Free
5. "Create Web Service" 클릭

### 3. 배포 완료!

3-5분 후 URL 생성: `https://terraforming-mars-board.onrender.com`

## 📝 이력서 기재

```
Render.com을 활용한 Flask 애플리케이션 배포
Git/GitHub 기반 CI/CD 자동 배포
```

---

## ⚖️ AWS vs Render 비교

| 항목 | AWS Elastic Beanstalk | Render.com |
|------|----------------------|------------|
| **이력서 가치** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **배포 난이도** | 중 (10-15분) | 쉬움 (5분) |
| **프리티어** | 12개월 | 영구 무료 |
| **비용 (12개월 후)** | $8-15/월 | $0 (제한있음) |
| **학습 가치** | 높음 (실무 직결) | 보통 |
| **서비스 경험** | EC2, S3, CloudWatch 등 | PaaS |
| **추천 대상** | 이력서 강화 필요 | 빠른 프로토타입 |

**결론**:
- **이력서용 → AWS 추천** (임베디드→AX 전환에 유리)
- **빠른 배포용 → Render 추천**
