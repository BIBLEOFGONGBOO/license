# LICENSE 운영 지시서

이 문서는 LICENSE 과목 추가와 회원 접근 제어를 위한 작업 기준이다.

## 1. 실제 위치

| 구분 | 정확한 위치 | 역할 |
| --- | --- | --- |
| LICENSE 웹 프로젝트 | `C:\Users\daeca\Documents\ChatGPT\2.license` | GitHub Pages로 공개되는 LICENSE 화면 |
| LICENSE 화면 설정 | `C:\Users\daeca\Documents\ChatGPT\2.license\config.js` | 과목 코드와 HOME 상품 번호 연결 |
| LICENSE 화면 실행 | `C:\Users\daeca\Documents\ChatGPT\2.license\license-main.js` | SET 1 무료, SET 2 이상 HOME 권한 확인 |
| LICENSE 화면 구조 | `C:\Users\daeca\Documents\ChatGPT\2.license\index.html` | 상단·목차·문제 화면 HTML |
| LICENSE 문제 DB | Supabase 프로젝트 `mlpyhuwrkwdtzpswaqgf.supabase.co` → Table Editor → `questions` | 문제·선택지·번역 데이터 |
| LICENSE 과목 목차 DB | 같은 Supabase 프로젝트 → Table Editor → `license_products` | `product_code`, `title`, `set_size`, `active` |
| LICENSE 문제 서버 | 같은 Supabase 프로젝트 → Edge Functions → `smooth-worker` | 문제 반환과 HOME 권한 판정 |
| 중앙 회원 DB | Turso Cloud → database `sat` → table `member` | 회원별 `product_id`, `status` |
| 중앙 상품 DB | Turso Cloud → database `sat` → table `catalog` | 상품 번호와 사람이 보는 상품명 |
| 중앙 회원 API | `C:\Users\daeca\Documents\ChatGPT\0.HOME\functions\api\member.js` | `/api/member`, `active_products` |

## 2. 현재 권한 규칙

- 모든 LICENSE 과목의 SET 1은 무료다.
- SET 2부터는 HOME의 `member` 테이블에서 해당 상품이 `ACTIVE`여야 한다.
- `member.product_id = '0000'` 및 `status = 'ACTIVE'`는 관리자다. 모든 LICENSE 과목을 연다.
- LICENSE는 HOME 로그인 뒤 URL의 `member_id`를 받아 브라우저 저장소 `gongboo-license-member-id`에 저장한다.
- 기존 Supabase Auth의 `member_profiles`, `license_entitlements`는 현재 권한 판정에 사용하지 않는다.

## 3. 현재 과목 코드와 상품 번호

| LICENSE course code | HOME product_id | catalog 표시명 |
| --- | ---: | --- |
| `CNA`, `CALIFORNIACNA` | `6001` | License CNA |
| `REALESTATE`, `CALIFORNIAREALESTATE` | `6002` | License · Real Estate |
| `INSURANCE`, `CALIFORNIAINSURANCE` | `6003` | License · Insurance |
| `MORTGAGE`, `MORTGAGELENDING`, `MORTGAGELENDINGCOMPLIANCE`, `MORTGAGELENDINGLAW` | `6004` | License · Mortgage NMLS |
| `NOTARY` | `6005` | License · Notary |

## 4. 새 LICENSE 과목 추가 순서

새 과목 하나당 아래 네 곳을 모두 확인한다. 현재 방식은 코드 매핑이 두 곳에 있으므로 하나라도 빠지면 SET 2가 열리지 않는다.

1. **HOME 상품 등록**
   - Turso `sat` DB의 `catalog`에 새 `product_id`와 상품명 추가.
   - 예: `6006 | License · SAT | T`.

2. **문제·목차 등록**
   - Supabase `questions`에 새 `course` 코드의 문제 등록.
   - Supabase `license_products`에 `product_code`, `title`, `set_size`, `active = true` 등록.
   - `product_code`는 대문자 기준으로 통일한다.

3. **브라우저 매핑 추가**
   - 파일: `C:\Users\daeca\Documents\ChatGPT\2.license\config.js`
   - `membership.courseProductIds`에 `COURSECODE: '6006'` 추가.

4. **문제 서버 매핑 추가**
   - Supabase → Edge Functions → `smooth-worker`.
   - `COURSE_PRODUCT_IDS`에 같은 `COURSECODE: '6006'` 추가 후 Deploy updates.

## 5. 확인 방법

- 로그아웃 상태: SET 1은 열리고 SET 2는 `Please log in to continue.` 후 HOME으로 이동.
- 권한 없는 로그인 회원: SET 2에서 `This course is not active for your account.`.
- 해당 `product_id`가 ACTIVE인 회원: SET 2 이상 열림.
- 관리자 `0000 / ACTIVE`: 모든 과목의 SET 2 이상 열림.
- 첫 SET의 문제 수는 과목별 `license_products.set_size` 값이다. 과거의 익명 체험 20문제 제한과 혼동하지 않는다.

## 6. 배포 대상

- `config.js`, `license-main.js`, `index.html` 변경: 기존 GitHub Pages 업로드 절차로 LICENSE 저장소에 반영.
- `smooth-worker` 변경: Supabase Edge Functions 화면에서 **Deploy updates**.
- `member.js` 변경: `C:\Users\daeca\Documents\ChatGPT\0.HOME`에서 아래 명령으로 Cloudflare Pages 배포.

```powershell
cd "C:\Users\daeca\Documents\ChatGPT\0.HOME"
npx wrangler pages deploy . --project-name gongboo-home --branch main
```

## 7. 수정하지 않는 파일

- `C:\Users\daeca\Documents\ChatGPT\2.license\login.html` — 기존 LICENSE 전용 로그인 화면. 현재 중앙 로그인 흐름에서 연결하지 않는다.
- `C:\Users\daeca\Documents\ChatGPT\0.HOME\functions\api\member - 복사본.js` 등 복사본 — 운영 API가 아니다.
- 운영 API는 반드시 `C:\Users\daeca\Documents\ChatGPT\0.HOME\functions\api\member.js`만 수정한다.
