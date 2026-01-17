# 커뮤니티 기능 설정 가이드

커뮤니티 기능(게시글, 좋아요, 댓글)을 사용하려면 다음 단계를 따라주세요.

## 빠른 시작

1. Supabase 대시보드에 로그인
2. 왼쪽 메뉴에서 **SQL Editor** 클릭
3. **New Query** 버튼 클릭
4. `community_tables.sql` 파일의 **전체 내용**을 복사하여 붙여넣기
5. **Run** 버튼 클릭 (또는 Ctrl+Enter)

## 생성되는 테이블

- `posts` - 게시글 저장
- `post_likes` - 게시글 좋아요
- `comments` - 댓글 (대댓글 지원)

## 확인 방법

SQL Editor에서 다음 쿼리를 실행하여 테이블이 생성되었는지 확인할 수 있습니다:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('posts', 'post_likes', 'comments');
```

3개의 테이블이 모두 표시되면 성공입니다!

## 샘플 데이터 추가하기

### 1. 게시글 샘플 데이터

기본 게시글이 있으면 좋겠다면 `community_sample_data.sql` 파일을 실행하세요:

1. SQL Editor에서 **New Query** 버튼 클릭
2. `community_sample_data.sql` 파일의 **전체 내용**을 복사하여 붙여넣기
3. **Run** 버튼 클릭

**주의**: 샘플 데이터를 삽입하려면 최소 1명의 사용자가 있어야 합니다. 먼저 회원가입을 한 후 실행하세요.

샘플 데이터에는 다음이 포함됩니다:
- 토론 게시글 2개
- 공략 게시글 2개
- 파티 모집 게시글 2개

### 2. 댓글 샘플 데이터

게시글에 댓글이 표시되도록 하려면 `community_sample_comments.sql` 파일을 실행하세요:

1. SQL Editor에서 **New Query** 버튼 클릭
2. `community_sample_comments.sql` 파일의 **전체 내용**을 복사하여 붙여넣기
3. **Run** 버튼 클릭

**주의**: 
- `community_sample_data.sql`을 먼저 실행해야 합니다.
- 각 게시글의 `comment_count`에 맞는 댓글이 자동으로 삽입됩니다.

댓글 샘플 데이터:
- 게시글 1: 23개 댓글
- 게시글 2: 67개 댓글
- 게시글 3: 18개 댓글
- 게시글 4: 89개 댓글
- 게시글 5: 56개 댓글
- 게시글 6: 22개 댓글

## 문제 해결

### 404 오류가 발생하는 경우
- 테이블이 생성되지 않았을 가능성이 높습니다
- `community_tables.sql` 파일을 다시 실행해주세요

### 권한 오류가 발생하는 경우
- RLS 정책이 제대로 생성되었는지 확인하세요
- `community_tables.sql` 파일의 RLS 정책 부분이 모두 실행되었는지 확인하세요

### 외래 키 오류가 발생하는 경우
- `update_updated_at_column()` 함수가 먼저 생성되어 있어야 합니다
- `schema.sql` 파일을 먼저 실행한 후 `community_tables.sql`을 실행하세요

