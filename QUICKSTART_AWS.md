# 🚀 AWS 배포 빠른 시작 가이드 (PowerShell)

## ⚡ 한 눈에 보는 배포 과정

```powershell
# [1단계] AWS CLI 설치 (관리자 권한 PowerShell)
choco install awscli -y

# [2단계] EB CLI 설치
python -m pip install awsebcli

# [3단계] AWS 설정
aws configure

# [4단계] 배포
cd c:\Users\home\Project\terraforming-mars-multiplayer-board
eb init -p python-3.11 -r ap-northeast-2 terraforming-mars-board
eb create terraforming-mars-env --single --instance-type t2.micro
```

---

## 📝 단계별 상세 가이드

### 1️⃣ AWS CLI 설치

#### 방법 A: Chocolatey 사용 (추천)

**PowerShell을 관리자 권한으로 실행** 후:

```powershell
# Chocolatey가 없다면 먼저 설치
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# AWS CLI 설치
choco install awscli -y

# PowerShell 재시작 후 확인
aws --version
```

#### 방법 B: MSI 설치 파일 사용

1. https://aws.amazon.com/cli/ 에서 Windows MSI 다운로드
2. 설치 후 PowerShell 재시작
3. `aws --version` 확인

---

### 2️⃣ EB CLI 설치

**일반 PowerShell**에서 실행 (관리자 권한 불필요):

```powershell
# Python pip를 사용하여 EB CLI 설치
python -m pip install awsebcli

# 설치 확인
eb --version
```

**⚠️ 주의사항:**
- `pip install awsebcli` 대신 **`python -m pip install awsebcli`** 사용
- Python이 설치되어 있어야 함 (이미 프로젝트 실행했다면 OK)

---

### 3️⃣ AWS 계정 및 자격 증명 설정

#### AWS 계정 생성
1. https://aws.amazon.com/ 접속
2. "Create an AWS Account" 클릭
3. 신용카드 등록 필요 (프리티어 사용 시 청구 없음)

#### IAM 사용자 생성 및 액세스 키 발급

1. AWS Console 로그인
2. **IAM** 서비스로 이동
3. **Users** → **Add users** 클릭
4. 사용자 이름: `eb-deploy-user` 입력
5. **Access key - Programmatic access** 선택
6. **Permissions**: `AdministratorAccess-AWSElasticBeanstalk` 정책 연결
7. 생성 완료 후 **액세스 키 ID**와 **시크릿 액세스 키** 저장 (한 번만 표시됨!)

#### AWS CLI 설정

```powershell
aws configure
```

입력 내용:
```
AWS Access Key ID [None]: AKIA************  (발급받은 액세스 키)
AWS Secret Access Key [None]: ****************************  (발급받은 시크릿 키)
Default region name [None]: ap-northeast-2  (서울 리전)
Default output format [None]: json
```

---

### 4️⃣ 프로젝트 배포

#### 4-1. Git 초기화 (아직 안 했다면)

```powershell
cd c:\Users\home\Project\terraforming-mars-multiplayer-board

git init
git add .
git commit -m "Initial commit for AWS deployment"
```

#### 4-2. Elastic Beanstalk 초기화

```powershell
# 대화형 초기화
eb init

# 또는 한 줄로 초기화
eb init -p python-3.11 -r ap-northeast-2 terraforming-mars-board
```

**대화형 선택 시 입력 내용:**
```
Select a default region: 10 (ap-northeast-2: Asia Pacific (Seoul))
Application name: terraforming-mars-board
Platform: Python
Platform version: Python 3.11
Set up SSH for your instances? Y (선택사항)
```

#### 4-3. 환경 생성 및 배포

```powershell
# 환경 생성 (최초 1회, 5-10분 소요)
eb create terraforming-mars-env --single --instance-type t2.micro

# 배포 진행 상황을 실시간으로 확인할 수 있습니다
```

**성공 메시지 예시:**
```
Environment creation complete.
Application available at terraforming-mars-env.ap-northeast-2.elasticbeanstalk.com
```

#### 4-4. 배포 확인

```powershell
# 상태 확인
eb status

# 브라우저에서 열기
eb open

# 로그 확인
eb logs
```

---

## 🔄 코드 업데이트 및 재배포

```powershell
# 코드 수정 후
git add .
git commit -m "Update game features"

# 재배포 (2-3분 소요)
eb deploy

# 배포 확인
eb open
```

---

## 🛑 인스턴스 중지 및 삭제 (비용 절감)

```powershell
# 환경 완전 삭제 (비용 청구 중지)
eb terminate terraforming-mars-env

# 나중에 다시 생성
eb create terraforming-mars-env --single --instance-type t2.micro
```

---

## 🔍 문제 해결

### 문제: `eb` 명령어를 찾을 수 없음
```powershell
# PATH 확인
$env:Path

# EB CLI 재설치
python -m pip install --upgrade awsebcli

# PowerShell 재시작
```

### 문제: `pip` 명령어 에러
```powershell
# 항상 python -m pip를 사용하세요
python -m pip install awsebcli
python -m pip install --upgrade awsebcli
```

### 문제: AWS 자격 증명 오류
```powershell
# 설정 다시 확인
aws configure list

# 재설정
aws configure
```

### 문제: 배포 실패
```powershell
# 자세한 로그 확인
eb logs --all

# 환경 삭제 후 재생성
eb terminate terraforming-mars-env
eb create terraforming-mars-env --single --instance-type t2.micro
```

---

## 📊 배포 후 확인 사항

### ✅ 체크리스트

- [ ] 웹사이트 접속 가능 (`eb open`)
- [ ] Socket.IO 실시간 통신 작동
- [ ] 모든 게임 기능 정상 작동
- [ ] CloudWatch에서 로그 확인
- [ ] 비용 모니터링 설정 (AWS Budgets)

### 🌐 배포된 URL

```
http://terraforming-mars-env.ap-northeast-2.elasticbeanstalk.com
```

---

## 💰 비용 확인

```powershell
# AWS Console → Billing Dashboard
# 프리티어 사용량 확인
```

**프리티어 한도:**
- EC2 t2.micro: 750시간/월 (24시간 × 31일 = 744시간)
- 1개 인스턴스를 계속 켜놔도 무료!

---

## 📚 추가 명령어

```powershell
# 환경 목록 보기
eb list

# 다른 환경으로 전환
eb use terraforming-mars-env

# 환경 변수 설정
eb setenv FLASK_ENV=production

# SSH 접속
eb ssh

# 헬스 체크
eb health

# 이벤트 로그
eb events
```

---

## 🎯 다음 단계

1. ✅ **배포 완료** - 이력서에 AWS 경험 추가!
2. 🔐 **HTTPS 설정** - AWS Certificate Manager (무료)
3. 🌐 **커스텀 도메인** - Route 53
4. 📊 **모니터링** - CloudWatch 알람 설정
5. 💾 **데이터베이스** - RDS 추가

상세 가이드: [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md)
