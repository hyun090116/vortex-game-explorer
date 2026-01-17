# VORTEX Game Explorer Database Schema

이 폴더에는 Supabase PostgreSQL 데이터베이스 스키마가 포함되어 있습니다.

## 설치 방법

1. Supabase 대시보드에 로그인
2. SQL Editor로 이동
3. 다음 순서로 실행:
   - `schema.sql` 파일의 내용을 복사하여 실행 (기본 테이블 생성)
   - `community_tables.sql` 파일의 내용을 복사하여 실행 (커뮤니티 테이블 생성 - **필수**)
   - `functions.sql` 파일의 내용을 복사하여 실행 (함수 및 뷰 생성)
   - `rls_policies.sql` 파일의 내용을 복사하여 실행 (RLS 정책 업데이트)

또는 Supabase CLI를 사용하는 경우:

```bash
supabase db reset
```

## 커뮤니티 기능 사용하기

커뮤니티 기능(게시글, 좋아요, 댓글)을 사용하려면 **반드시** `community_tables.sql` 파일을 실행해야 합니다.

이 파일에는 다음 테이블들이 포함되어 있습니다:
- `posts` - 게시글
- `post_likes` - 게시글 좋아요
- `comments` - 댓글

테이블을 생성하지 않으면 404 오류가 발생합니다.

## RLS 정책 업데이트

결제 기능을 사용하려면 `rls_policies.sql`을 실행하여 games 테이블의 RLS 정책을 업데이트해야 합니다.
이 파일은 인증된 사용자가 게임을 생성할 수 있도록 허용합니다 (결제 시 게임 자동 생성용).

## 테이블 구조

### 1. user_profiles
사용자 프로필 정보를 저장합니다.
- Supabase Auth의 users 테이블을 확장합니다.

### 2. games
게임 정보를 저장합니다.
- 게임 제목, 설명, 가격, 이미지 등 모든 게임 데이터

### 3. purchases
사용자의 게임 구매 내역을 저장합니다.

### 4. cart_items
사용자의 장바구니 항목을 저장합니다.

### 5. wishlist
사용자의 위시리스트를 저장합니다.

### 6. reviews
게임 리뷰를 저장합니다.

### 7. review_helpful
리뷰의 "도움됨" 평가를 저장합니다.

## Row Level Security (RLS)

모든 테이블에 RLS가 활성화되어 있습니다:
- 사용자는 자신의 데이터만 조회/수정할 수 있습니다.
- 게임과 리뷰는 모든 사용자가 조회할 수 있습니다.

## 트리거

- `updated_at` 자동 업데이트
- 게임 평점 자동 계산
- 리뷰 도움됨 카운트 자동 업데이트

## 주의사항

- 관리자 권한이 필요한 작업(게임 생성/수정/삭제)은 실제 관리자 체크 로직을 추가해야 합니다.
- 프로덕션 환경에서는 적절한 백업 전략을 수립하세요.

