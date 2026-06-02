# Codex CLI 실습 프로젝트

이 프로젝트는 Codex CLI 사용법을 연습하기 위한 프로젝트입니다.

## 실행 방법

```bash
npm start
```

서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 자동차 목록 API 검색 예시

전체 자동차 목록을 조회합니다.

```bash
curl http://localhost:3000/cars
```

`company` 값과 일치하는 자동차만 검색합니다.

```bash
curl "http://localhost:3000/cars/search?company=HYUNDAI"
```

`company` 값을 전달하지 않으면 전체 목록을 반환합니다.

```bash
curl http://localhost:3000/cars/search
```

## 자동차 목록 API 가격 필터 예시

`minPrice` 이상, `maxPrice` 이하인 자동차만 조회합니다.

```bash
curl "http://localhost:3000/cars/filter?minPrice=2000&maxPrice=3000"
```

최소 가격만 지정할 수 있습니다.

```bash
curl "http://localhost:3000/cars/filter?minPrice=2500"
```

최대 가격만 지정할 수 있습니다.

```bash
curl "http://localhost:3000/cars/filter?maxPrice=2500"
```


## React 프론트엔드 실행 방법

이 프로젝트는 Express API 서버와 React 프론트엔드를 함께 사용합니다.

### 의존성 설치

루트 패키지와 React 클라이언트 패키지의 의존성을 설치합니다.

```bash
npm install
npm install --prefix client
```

### Express 서버만 실행

```bash
npm run server
```

Express API 서버는 `http://localhost:3000`에서 실행됩니다.

### React 개발 서버만 실행

```bash
npm run client
```

React 개발 서버는 Vite로 실행되며 `/cars` 요청은 `client/vite.config.js`의 프록시 설정을 통해 Express 서버로 전달됩니다.

### Express와 React 함께 실행

```bash
npm run dev
```

개발 중에는 위 명령으로 Express API 서버와 React 개발 서버를 동시에 실행할 수 있습니다.

### React 빌드

```bash
npm run build --prefix client
```

빌드 결과는 `client/dist`에 생성됩니다.
