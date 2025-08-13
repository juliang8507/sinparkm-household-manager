@echo off
echo 🥔🐰 감자토끼 가계부 - GitHub 업로드용 ZIP 생성

REM 업로드 디렉토리 생성
if exist "github-upload" rmdir /s /q "github-upload"
mkdir "github-upload"

echo 📦 핵심 파일들 복사 중...

REM 필수 설정 파일
copy "package.json" "github-upload\"
copy "package-lock.json" "github-upload\"
copy "netlify.toml" "github-upload\"
copy "manifest.json" "github-upload\"
copy "sw.js" "github-upload\"
copy "server.js" "github-upload\"

REM HTML/CSS/JS 파일들
copy "index.html" "github-upload\"
copy "index.css" "github-upload\"
copy "index.js" "github-upload\"
copy "transaction-*.html" "github-upload\"
copy "transaction-*.css" "github-upload\"
copy "transaction-*.js" "github-upload\"
copy "meal-planning.*" "github-upload\"

REM 아이콘
copy "icons.svg" "github-upload\"

REM 디렉토리들 복사
echo 📁 디렉토리 복사 중...
xcopy "src" "github-upload\src" /E /I /Q
xcopy "css" "github-upload\css" /E /I /Q
xcopy "js" "github-upload\js" /E /I /Q
xcopy "potato-rabbit-icons" "github-upload\potato-rabbit-icons" /E /I /Q
xcopy "performance" "github-upload\performance" /E /I /Q
xcopy "scripts" "github-upload\scripts" /E /I /Q

echo ✅ 파일 복사 완료!
echo 📂 github-upload 폴더를 압축해서 GitHub에 업로드하세요.
echo 🌐 GitHub: https://github.com/juliang8507/sinparkm-household-manager

pause