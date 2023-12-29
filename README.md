# 1. 코드 실행

node_mode 다운로드

```
npm i
```

db생성

```
npx prisma migrate dev --name init
```


서버실행

```
npm run start
```

# 2. 우분투에서의 배포 설명

## 1. 유저 생성

```
-- user 생성
sudo adduser 유저이름

-- user 목록 보기
grep /bin/bash /etc/passwd

-- 폴더생성
mkdir /works/

-- 폴더 권한 설정
user chown 으로 권한 설정
chown -R 유저이름 폴더명/

-- 현재 로그인유저 변경
su 유저명
```

## 2. nvm 설치

터미널에 다음 명령어를 복사해서 nvm 설치

```js

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
또는 
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

## 3. nvm 설정파일 생성

nvm **설정파일 생성**

vi ~/.bashrc

vi ~/.bash_profile

vi ~/.zshrc

nvm 설정파일 내용 작성

```
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

또는 필요에 따라서

```
export NVM_DIR="/home/smartadmin/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

설정파일 적용

```
bash: source ~/.bashrc

zsh: source ~/.zshrc
```

정상적으로 nvm이 설치되었으면 터미널에서 다음 명령어들로 nvm 실행가능

```
nvm --version

// node 설치
nvm install 18

// 버전선택
nvm use 18
```

## 4. pm2 설치

npm으로 pm2 설치 이때 -g옵션

```
npm i pm2 -g
```

pm2 설정파일 생성

```
pm2 init simple
```

설정파일 확장자 변경

```
ecosystem.config.js => ecosystem.config.cjs
```

ecosystem.config.cjs

```
module.exports = {
  apps : [{
		name   : "slog",
    script: './dist/main.js',
    watch: './dist',
    instances: "2",
    exec_mode: "cluster",
    autorestart: true,
    node_args: "--experimental-specifier-resolution=node",    
    wait_ready: true,
    listen_timeout: 50000,
    kill_timeout: 5000,
  }],
};
```

## 5. pm2로 서비스 시작

```
pm2 start ./ecosystem.config.cjs
```

기타 pm2 명령어들

```
-- 모니터링
pm2 monit

-- 프로세스 확인
pm2 list

-- pm2 프로세스 정지
pm2 stop 프로세스

-- 프로세스 삭제 
pm2 kill

-- log 보기
pm2 logs

-- 프로세스 늘리기
pm2 scale 앱이름 +개수

-- 프로세스 줄이기
pm2 scale 앱이름 개수
```

## 기타

우분투에서 postman 설치

```
sudo snap install postman
```