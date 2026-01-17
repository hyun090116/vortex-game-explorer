-- VORTEX Game Explorer Database Functions
-- Supabase PostgreSQL Database

-- ============================================
-- 1. PURCHASE WITH GAME DETAILS VIEW
-- ============================================
-- 구매 내역과 게임 정보를 함께 조회하는 뷰
CREATE OR REPLACE VIEW purchase_details AS
SELECT 
  p.id,
  p.user_id,
  p.game_id,
  p.price_paid,
  p.purchase_date,
  p.payment_method,
  p.transaction_id,
  p.status,
  p.created_at,
  g.title as game_title,
  g.cover_image as game_cover_image,
  g.developer as game_developer,
  g.publisher as game_publisher,
  g.genre as game_genre
FROM purchases p
LEFT JOIN games g ON p.game_id = g.id;

-- 뷰에 대한 RLS 정책
ALTER VIEW purchase_details OWNER TO postgres;

-- 사용자는 자신의 구매 내역만 조회 가능
CREATE POLICY "Users can view own purchase details" ON purchase_details
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- 2. USER PROFILE WITH STATS VIEW
-- ============================================
-- 사용자 프로필과 통계 정보를 함께 조회하는 뷰
CREATE OR REPLACE VIEW user_profile_stats AS
SELECT 
  up.id,
  up.username,
  up.display_name,
  up.avatar_url,
  up.bio,
  up.created_at,
  up.updated_at,
  (SELECT COUNT(*) FROM purchases WHERE user_id = up.id) as total_purchases,
  (SELECT COALESCE(SUM(price_paid), 0) FROM purchases WHERE user_id = up.id AND status = 'completed') as total_spent,
  (SELECT COUNT(*) FROM wishlist WHERE user_id = up.id) as wishlist_count,
  (SELECT COUNT(*) FROM reviews WHERE user_id = up.id) as review_count
FROM user_profiles up;

-- 뷰에 대한 RLS 정책
ALTER VIEW user_profile_stats OWNER TO postgres;

-- 사용자는 자신의 프로필 통계만 조회 가능
CREATE POLICY "Users can view own profile stats" ON user_profile_stats
  FOR SELECT USING (auth.uid() = id);

-- ============================================
-- 3. FUNCTION: Get User Purchase History
-- ============================================
CREATE OR REPLACE FUNCTION get_user_purchases(p_user_id UUID)
RETURNS TABLE (
  purchase_id UUID,
  game_id UUID,
  game_title VARCHAR,
  game_cover_image TEXT,
  game_developer VARCHAR,
  price_paid DECIMAL,
  purchase_date TIMESTAMP WITH TIME ZONE,
  status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.game_id,
    g.title,
    g.cover_image,
    g.developer,
    p.price_paid,
    p.purchase_date,
    p.status
  FROM purchases p
  LEFT JOIN games g ON p.game_id = g.id
  WHERE p.user_id = p_user_id
  ORDER BY p.purchase_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. FUNCTION: Create Purchase
-- ============================================
CREATE OR REPLACE FUNCTION create_purchase(
  p_user_id UUID,
  p_game_id UUID,
  p_price_paid DECIMAL,
  p_payment_method VARCHAR DEFAULT NULL,
  p_transaction_id VARCHAR DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_purchase_id UUID;
BEGIN
  INSERT INTO purchases (
    user_id,
    game_id,
    price_paid,
    payment_method,
    transaction_id,
    status
  ) VALUES (
    p_user_id,
    p_game_id,
    p_price_paid,
    p_payment_method,
    p_transaction_id,
    'completed'
  )
  RETURNING id INTO v_purchase_id;

  -- 장바구니에서 해당 게임 제거
  DELETE FROM cart_items 
  WHERE user_id = p_user_id AND game_id = p_game_id;

  RETURN v_purchase_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 5. FUNCTION: Check if User Owns Game
-- ============================================
CREATE OR REPLACE FUNCTION user_owns_game(
  p_user_id UUID,
  p_game_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM purchases 
    WHERE user_id = p_user_id 
      AND game_id = p_game_id 
      AND status = 'completed'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. FUNCTION: Get User Library
-- ============================================
CREATE OR REPLACE FUNCTION get_user_library(p_user_id UUID)
RETURNS TABLE (
  game_id UUID,
  game_title VARCHAR,
  game_cover_image TEXT,
  game_developer VARCHAR,
  purchase_date TIMESTAMP WITH TIME ZONE,
  last_played TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    g.id,
    g.title,
    g.cover_image,
    g.developer,
    p.purchase_date,
    p.purchase_date as last_played -- 실제로는 별도 테이블 필요할 수 있음
  FROM purchases p
  JOIN games g ON p.game_id = g.id
  WHERE p.user_id = p_user_id
    AND p.status = 'completed'
  ORDER BY p.purchase_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. FUNCTION: Update User Profile
-- ============================================
CREATE OR REPLACE FUNCTION update_user_profile(
  p_user_id UUID,
  p_username VARCHAR DEFAULT NULL,
  p_display_name VARCHAR DEFAULT NULL,
  p_bio TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- 프로필이 없으면 생성
  INSERT INTO user_profiles (id, username, display_name, bio, avatar_url)
  VALUES (p_user_id, p_username, p_display_name, p_bio, p_avatar_url)
  ON CONFLICT (id) 
  DO UPDATE SET
    username = COALESCE(EXCLUDED.username, user_profiles.username),
    display_name = COALESCE(EXCLUDED.display_name, user_profiles.display_name),
    bio = COALESCE(EXCLUDED.bio, user_profiles.bio),
    avatar_url = COALESCE(EXCLUDED.avatar_url, user_profiles.avatar_url),
    updated_at = NOW();

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. FUNCTION: Get Purchase Statistics
-- ============================================
CREATE OR REPLACE FUNCTION get_purchase_statistics(p_user_id UUID)
RETURNS TABLE (
  total_purchases BIGINT,
  total_spent DECIMAL,
  average_purchase_price DECIMAL,
  most_expensive_purchase DECIMAL,
  favorite_genre VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_purchases,
    COALESCE(SUM(price_paid), 0) as total_spent,
    COALESCE(AVG(price_paid), 0) as average_purchase_price,
    COALESCE(MAX(price_paid), 0) as most_expensive_purchase,
    (
      SELECT genre[1] 
      FROM games g
      JOIN purchases p ON g.id = p.game_id
      WHERE p.user_id = p_user_id
      GROUP BY genre[1]
      ORDER BY COUNT(*) DESC
      LIMIT 1
    ) as favorite_genre
  FROM purchases
  WHERE user_id = p_user_id AND status = 'completed';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

