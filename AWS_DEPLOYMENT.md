# AWS 배포 가이드

## 🎯 이력서 가치
이 프로젝트를 AWS에 배포하면 다음과 같은 경험을 이력서에 기재할 수 있습니다:
- AWS Elastic Beanstalk을 활용한 웹 애플리케이션 배포 및 운영
- EC2, S3, CloudWatch 등 AWS 핵심 서비스 경험
- 프로덕션 환경 구성 (Nginx, Gunicorn)
- 실시간 통신 (Socket.IO) 구현 및 배포

---

## 💰 요금 정보

### AWS 프리티어 (12개월 무료)
- **EC2 t2.micro**: 750시간/월 무료
- **S3**: 5GB 저장, 20,000 GET 요청 무료
- **데이터 전송**: 15GB/월 아웃바운드 무료

### 예상 비용
- **프리티어 기간 (12개월)**: **$0**
- **프리티어 이후**: 월 $8-15 (사용하지 않을 때 인스턴스 중지 가능)
- **파티 3-6시간 사용**: **무료**

---

## 🚀 AWS Elastic Beanstalk 배포 방법

### 1. AWS CLI 설치

**Windows (PowerShell - 관리자 권한으로 실행):**
```powershell
# PowerShell을 관리자 권한으로 실행한 후 아래 명령어 실행
# Chocolatey 설치
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# AWS CLI 설치
choco install awscli -y

# 터미널 재시작 후 확인
aws --version
```

**또는 MSI 설치:**
https://aws.amazon.com/cli/

### 2. AWS 계정 설정

1. AWS 계정 생성: https://aws.amazon.com/
2. IAM 사용자 생성 및 액세스 키 받기
   - AWS Console → IAM → Users → Add User
   - Permissions: `AdministratorAccess-AWSElasticBeanstalk`
   - 액세스 키 ID와 시크릿 키 저장

3. AWS CLI 설정:
```powershell
aws configure
# AWS Access Key ID: [발급받은 키]
# AWS Secret Access Key: [발급받은 시크릿]
# Default region name: ap-northeast-2  (서울)
# Default output format: json
```

### 3. EB CLI 설치

```powershell
# Python pip를 사용하여 EB CLI 설치
python -m pip install awsebcli

# 설치 확인
eb --version
```

### 4. 프로젝트 초기화

프로젝트 루트에서:

```powershell
cd c:\Users\home\Project\terraforming-mars-multiplayer-board

# Elastic Beanstalk 초기화
eb init

# 선택 옵션:
# - Region: ap-northeast-2 (서울)
# - Application name: terraforming-mars-board
# - Platform: Python 3.11
# - SSH: Yes (선택사항)
```

### 5. 환경 생성 및 배포

```powershell
# 환경 생성 (최초 1회)
eb create terraforming-mars-env --single --instance-type t2.micro

# 배포 (코드 변경 시)
eb deploy

# 상태 확인
eb status

# 웹 브라우저에서 열기
eb open

# 로그 확인
eb logs

# 종료 (비용 절감)
eb terminate terraforming-mars-env
```

### 6. 환경 변수 설정 (필요시)

```powershell
eb setenv FLASK_ENV=production
```

---

## 🔧 프로덕션 환경 설정 (이미 완료됨)

다음 파일들이 자동으로 생성되었습니다:

1. **`.ebextensions/01_environment.config`**: Elastic Beanstalk 환경 설정
2. **`.ebextensions/02_nginx.config`**: Nginx 리버스 프록시 + WebSocket 설정
3. **`backend/app.py`**: 환경별 실행 설정 추가됨
4. **`.gitignore`**: AWS 관련 파일 제외

---

## 📊 모니터링 및 관리

### CloudWatch로 모니터링
```powershell
# AWS Console → CloudWatch → Dashboards
# 자동으로 생성된 대시보드에서 확인:
# - CPU 사용률
# - 네트워크 트래픽
# - 요청 수
```

### 비용 절감 팁
1. **사용하지 않을 때 인스턴스 중지**:
   ```powershell
   eb terminate terraforming-mars-env
   ```

2. **필요할 때만 재생성** (2-3분 소요):
   ```powershell
   eb create terraforming-mars-env --single --instance-type t2.micro
   ```

3. **알람 설정**: AWS Budgets에서 $5 예산 초과 시 알림

---

## 🌐 커스텀 도메인 연결 (선택사항)

### Route 53 사용
1. 도메인 구매 ($12/년)
2. Route 53에서 호스팅 영역 생성
3. Elastic Beanstalk 환경에 도메인 연결
4. HTTPS 인증서 발급 (AWS Certificate Manager - 무료)

---

## 🎓 이력서 작성 예시

### 프로젝트 섹션
```
[개인 프로젝트] Terraforming Mars 멀티플레이어 스코어보드
2026.01 - 2026.02

• AWS Elastic Beanstalk을 활용한 Flask 웹 애플리케이션 배포 및 운영
• Socket.IO 기반 실시간 멀티플레이어 통신 구현
• Nginx + Gunicorn 프로덕션 환경 구성 및 WebSocket 설정
• CloudWatch를 통한 애플리케이션 모니터링 및 로그 관리
• AWS 프리티어를 활용한 비용 최적화

기술 스택: Python, Flask, Socket.IO, JavaScript, AWS (EC2, Elastic Beanstalk,
CloudWatch), Nginx, Gunicorn

GitHub: https://github.com/yourusername/terraforming-mars-board
Demo: http://terraforming-mars-env.ap-northeast-2.elasticbeanstalk.com
```

### 기술 스택 섹션
```
Cloud & DevOps
- AWS: EC2, Elastic Beanstalk, CloudWatch, S3
- Web Server: Nginx, Gunicorn
- Version Control: Git, GitHub
```

---

## ⚡ 빠른 시작 (All-in-One)

```powershell
# 1. AWS CLI 설치 확인
aws --version

# 2. EB CLI 설치
python -m pip install awsebcli

# 3. AWS 자격 증명 설정
aws configure

# 4. 프로젝트로 이동
cd c:\Users\home\Project\terraforming-mars-multiplayer-board

# 5. Git 초기화 (아직 안했다면)
git init
git add .
git commit -m "Initial commit for AWS deployment"

# 6. EB 초기화
eb init -p python-3.11 -r ap-northeast-2 terraforming-mars-board

# 7. 환경 생성 및 배포
eb create terraforming-mars-env --single --instance-type t2.micro

# 8. 브라우저에서 열기
eb open
```

---

## 🔍 트러블슈팅

### 문제: 502 Bad Gateway
```powershell
# 로그 확인
eb logs

# Gunicorn 설정 확인
eb ssh
sudo tail -f /var/log/eb-engine.log
```

### 문제: WebSocket 연결 실패
- Nginx 설정 확인: `.ebextensions/02_nginx.config`
- Socket.IO 클라이언트 URL이 올바른지 확인

### 문제: 배포 실패
```powershell
# 상태 확인
eb status

# 자세한 로그
eb logs --all
```

---

## 📞 추가 학습 리소스

1. **AWS Elastic Beanstalk 문서**: https://docs.aws.amazon.com/elasticbeanstalk/
2. **AWS 프리티어 안내**: https://aws.amazon.com/free/
3. **Flask 배포 가이드**: https://flask.palletsprojects.com/en/latest/deploying/
4. **Socket.IO 배포**: https://socket.io/docs/v4/

---

## 💡 다음 단계 (선택사항)

1. **RDS 데이터베이스 추가**: 게임 상태를 영구 저장
2. **CloudFront CDN**: 전 세계 빠른 접속
3. **Auto Scaling**: 사용자 증가에 대응
4. **CI/CD 파이프라인**: GitHub Actions + AWS CodeDeploy
5. **컨테이너화**: Docker + ECS/Fargate

이러한 확장 경험도 이력서에 추가할 수 있습니다!
