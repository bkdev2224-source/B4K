# 데이터 임포트 스크립트

## 사용 방법

```bash
npm run import-data
```

## 필요 사항

1. `.env.local` 파일에 `MONGODB_URI`가 설정되어 있어야 합니다.
2. MongoDB 서버가 실행 중이어야 합니다 (로컬 또는 Atlas).

## MongoDB Atlas 연결 문제 해결

MongoDB Atlas를 사용하는 경우:

1. **IP 화이트리스트 확인**: Atlas 대시보드에서 현재 IP 주소가 허용되어 있는지 확인하세요.
   - Network Access > Add IP Address
   - 개발 환경에서는 `0.0.0.0/0` (모든 IP 허용)을 사용할 수 있지만, 프로덕션에서는 권장하지 않습니다.

2. **데이터베이스 사용자 확인**: Atlas 대시보드에서 데이터베이스 사용자가 생성되어 있고 권한이 있는지 확인하세요.

3. **연결 문자열 확인**: `.env.local`의 `MONGODB_URI`가 올바른지 확인하세요.
   - 형식: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

## 로컬 MongoDB 사용

로컬 MongoDB를 사용하는 경우:

```env
MONGODB_URI=mongodb://localhost:27017/B4K_TEST
```

## 데이터 삽입 내용

스크립트는 다음 데이터를 MongoDB에 삽입합니다:

- **POIs**: `mockupdata/pois.json`의 모든 POI 데이터
- **Packages**: `mockupdata/packages.json`의 모든 패키지 데이터
- **KContents**: `mockupdata/kcontents/` 폴더의 모든 K-Content 데이터
  - kpop.json
  - kbeauty.json
  - kfood.json
  - kfestival.json

## 주의사항

- 스크립트를 실행하면 기존 데이터가 삭제되고 새 데이터로 교체됩니다.
- ID 변환: JSON 파일의 `_id` 필드는 MongoDB ObjectId로 변환됩니다.

