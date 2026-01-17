# RLS 정책 빠른 수정 가이드

## 문제
결제 시 게임을 생성하려고 할 때 "new row violates row-level security policy" 오류가 발생합니다.

## 해결 방법

### Supabase 대시보드에서 실행

1. Supabase 대시보드에 로그인
2. **SQL Editor**로 이동
3. 아래 SQL을 복사하여 실행:

```sql
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Only admins can insert games" ON games;
DROP POLICY IF EXISTS "Only admins can update games" ON games;
DROP POLICY IF EXISTS "Only admins can delete games" ON games;

-- 인증된 사용자가 게임을 생성할 수 있도록 정책 추가
CREATE POLICY "Authenticated users can insert games" ON games
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update games" ON games
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete games" ON games
  FOR DELETE 
  USING (auth.role() = 'authenticated');
```

4. 실행 후 페이지를 새로고침하고 결제를 다시 시도하세요.

## 또는 `rls_policies.sql` 파일 사용

`database/rls_policies.sql` 파일의 내용을 복사하여 Supabase SQL Editor에서 실행하세요.

## 확인 방법

SQL 실행 후, 다음 쿼리로 정책이 제대로 생성되었는지 확인할 수 있습니다:

```sql
SELECT * FROM pg_policies WHERE tablename = 'games';
```

`Authenticated users can insert games` 정책이 보이면 성공입니다.

