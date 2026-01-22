# Mockup Data 구조

이 폴더는 MongoDB 데이터의 백업본을 JSON 형식으로 관리합니다.

## 폴더 구조

```
mockupdata/
├── save/              # import-data를 통해 MongoDB에 넣은 데이터 (백업본)
│   ├── pois.json
│   ├── packages.json
│   └── kcontents/
│       ├── kpop.json
│       ├── kbeauty.json
│       ├── kfood.json
│       └── kfestival.json
│
├── before/            # 사용자가 직접 검색해서 넣은 데이터 (백업본)
│   ├── pois.json
│   ├── packages.json
│   └── kcontents/
│       ├── kpop.json
│       ├── kbeauty.json
│       ├── kfood.json
│       └── kfestival.json
│
└── (기존 파일들)      # 원본 데이터 (참고용)
```

## 사용 방법

### 1. import-data (MongoDB에 데이터 넣기)
```bash
npm run import-data
```
- `save/` 폴더의 JSON 파일을 읽어서 MongoDB에 삽입합니다.
- 기존 데이터를 삭제하고 새 데이터로 교체합니다.

### 2. export-data (MongoDB에서 데이터 백업)
```bash
npm run export-data
```
- MongoDB의 데이터를 읽어서 `save/` 폴더에 JSON 파일로 저장합니다.
- import-data를 통해 넣은 데이터의 백업본을 생성합니다.

### 3. before.json (수동 관리)
- `before/` 폴더는 사용자가 직접 검색해서 넣은 데이터를 관리합니다.
- 수동으로 파일을 생성/수정할 수 있습니다.

## 주의사항

- `save/` 폴더는 `import-data`와 `export-data` 스크립트가 자동으로 관리합니다.
- `before/` 폴더는 수동으로 관리합니다.
- JSON 파일의 `_id` 필드는 MongoDB ObjectId 형식으로 변환됩니다 (`{ "$oid": "..." }`).

