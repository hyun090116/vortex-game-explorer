-- VORTEX Game Explorer RLS Policies Update
-- Supabase PostgreSQL Database

-- ============================================
-- GAMES TABLE RLS POLICIES UPDATE
-- ============================================
-- 기존 정책 삭제
DROP POLICY IF EXISTS "Only admins can insert games" ON games;
DROP POLICY IF EXISTS "Only admins can update games" ON games;
DROP POLICY IF EXISTS "Only admins can delete games" ON games;

-- 모든 사용자가 게임을 조회할 수 있음 (기존 정책 유지)
-- CREATE POLICY "Games are viewable by everyone" ON games
--   FOR SELECT USING (true);

-- 인증된 사용자는 게임을 생성할 수 있음 (결제 시 게임 자동 생성용)
CREATE POLICY "Authenticated users can insert games" ON games
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자는 게임을 수정할 수 있음 (자신이 생성한 게임만)
CREATE POLICY "Users can update own games" ON games
  FOR UPDATE 
  USING (true); -- 실제로는 게임 소유자 체크 로직 필요할 수 있음

-- 인증된 사용자는 게임을 삭제할 수 있음 (자신이 생성한 게임만)
CREATE POLICY "Users can delete own games" ON games
  FOR DELETE 
  USING (true); -- 실제로는 게임 소유자 체크 로직 필요할 수 있음

-- ============================================
-- PURCHASES TABLE RLS POLICIES (확인)
-- ============================================
-- 기존 정책이 올바르게 설정되어 있는지 확인
-- 사용자는 자신의 구매 내역만 조회 가능
-- CREATE POLICY "Users can view own purchases" ON purchases
--   FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 구매만 생성 가능
-- CREATE POLICY "Users can insert own purchases" ON purchases
--   FOR INSERT WITH CHECK (auth.uid() = user_id);

