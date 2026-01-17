-- VORTEX Game Explorer Database Schema
-- Supabase PostgreSQL Database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USERS PROFILE TABLE
-- ============================================
-- Supabase Auth의 users 테이블을 확장하는 프로필 테이블
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 프로필을 조회할 수 있음 (게시글 작성자 정보 표시용)
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Profiles are viewable by everyone" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. GAMES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  developer VARCHAR(255),
  publisher VARCHAR(255),
  release_date DATE,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  discount_percent INTEGER DEFAULT 0,
  cover_image TEXT,
  screenshots TEXT[], -- 배열로 여러 스크린샷 저장
  trailer_url TEXT,
  genre VARCHAR(50)[],
  tags VARCHAR(50)[],
  platform VARCHAR(50)[],
  rating DECIMAL(3, 2) DEFAULT 0, -- 평균 평점
  review_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_on_sale BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active', -- active, coming_soon, discontinued
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_games_title ON games(title);
CREATE INDEX IF NOT EXISTS idx_games_genre ON games USING GIN(genre);
CREATE INDEX IF NOT EXISTS idx_games_tags ON games USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_featured ON games(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_games_on_sale ON games(is_on_sale) WHERE is_on_sale = TRUE;

-- RLS 활성화
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 게임을 조회할 수 있음
CREATE POLICY "Games are viewable by everyone" ON games
  FOR SELECT USING (true);

-- 인증된 사용자는 게임을 생성할 수 있음 (결제 시 게임 자동 생성용)
CREATE POLICY "Authenticated users can insert games" ON games
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

-- 인증된 사용자는 게임을 수정할 수 있음
CREATE POLICY "Authenticated users can update games" ON games
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

-- 인증된 사용자는 게임을 삭제할 수 있음
CREATE POLICY "Authenticated users can delete games" ON games
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- ============================================
-- 3. PURCHASES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  price_paid DECIMAL(10, 2) NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255) UNIQUE,
  status VARCHAR(20) DEFAULT 'completed', -- completed, pending, refunded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_game_id ON purchases(game_id);
CREATE INDEX IF NOT EXISTS idx_purchases_user_game ON purchases(user_id, game_id);

-- RLS 활성화
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 구매 내역만 조회 가능
CREATE POLICY "Users can view own purchases" ON purchases
  FOR SELECT USING (auth.uid() = user_id);

-- 사용자는 자신의 구매만 생성 가능
CREATE POLICY "Users can insert own purchases" ON purchases
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 4. CART TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id) -- 같은 게임을 중복으로 담을 수 없음
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_cart_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_game_id ON cart_items(game_id);

-- RLS 활성화
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 장바구니만 조회/수정 가능
CREATE POLICY "Users can view own cart" ON cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items" ON cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 5. WISHLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id) -- 같은 게임을 중복으로 추가할 수 없음
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_game_id ON wishlist(game_id);

-- RLS 활성화
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 위시리스트만 조회/수정 가능
CREATE POLICY "Users can view own wishlist" ON wishlist
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own wishlist items" ON wishlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlist items" ON wishlist
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 6. REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  content TEXT,
  is_verified_purchase BOOLEAN DEFAULT FALSE, -- 실제 구매자인지 확인
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, game_id) -- 한 사용자는 한 게임에 하나의 리뷰만 작성 가능
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_game_id ON reviews(game_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- RLS 활성화
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 리뷰를 조회할 수 있음
CREATE POLICY "Reviews are viewable by everyone" ON reviews
  FOR SELECT USING (true);

-- 사용자는 자신의 리뷰만 생성/수정/삭제 가능
CREATE POLICY "Users can insert own reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews" ON reviews
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 7. REVIEW HELPFUL TABLE (리뷰 도움됨 기능)
-- ============================================
CREATE TABLE IF NOT EXISTS review_helpful (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  is_helpful BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, review_id) -- 한 사용자는 한 리뷰에 하나의 평가만 가능
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_review_helpful_user_id ON review_helpful(user_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_review_id ON review_helpful(review_id);

-- RLS 활성화
ALTER TABLE review_helpful ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 도움됨 정보를 조회할 수 있음
CREATE POLICY "Review helpful is viewable by everyone" ON review_helpful
  FOR SELECT USING (true);

-- 사용자는 자신의 도움됨 평가만 생성/수정 가능
CREATE POLICY "Users can insert own helpful votes" ON review_helpful
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own helpful votes" ON review_helpful
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 트리거 적용
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 게임 평점 자동 계산 함수
CREATE OR REPLACE FUNCTION update_game_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE games
  SET 
    rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM reviews
      WHERE game_id = COALESCE(NEW.game_id, OLD.game_id)
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE game_id = COALESCE(NEW.game_id, OLD.game_id)
    )
  WHERE id = COALESCE(NEW.game_id, OLD.game_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 리뷰 생성/수정/삭제 시 게임 평점 업데이트
CREATE TRIGGER update_game_rating_on_review
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_game_rating();

-- 리뷰 도움됨 카운트 업데이트 함수
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE reviews
  SET helpful_count = (
    SELECT COUNT(*)
    FROM review_helpful
    WHERE review_id = COALESCE(NEW.review_id, OLD.review_id)
      AND is_helpful = TRUE
  )
  WHERE id = COALESCE(NEW.review_id, OLD.review_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 도움됨 평가 생성/수정/삭제 시 카운트 업데이트
CREATE TRIGGER update_review_helpful_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON review_helpful
  FOR EACH ROW
  EXECUTE FUNCTION update_review_helpful_count();

-- ============================================
-- 9. POSTS TABLE (커뮤니티 게시글)
-- ============================================
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- 토론, 공략, 파티
  game_title VARCHAR(255), -- 게임 제목 (선택사항)
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_game_title ON posts(game_title);

-- RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 게시글을 조회할 수 있음
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

-- 인증된 사용자는 게시글을 생성할 수 있음
CREATE POLICY "Authenticated users can insert posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 게시글만 수정/삭제 가능
CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 10. POST LIKES TABLE (게시글 좋아요)
-- ============================================
CREATE TABLE IF NOT EXISTS post_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id) -- 한 사용자는 한 게시글에 하나의 좋아요만 가능
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);

-- RLS 활성화
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 좋아요 정보를 조회할 수 있음
CREATE POLICY "Post likes are viewable by everyone" ON post_likes
  FOR SELECT USING (true);

-- 사용자는 자신의 좋아요만 생성/삭제 가능
CREATE POLICY "Users can insert own post likes" ON post_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own post likes" ON post_likes
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 11. COMMENTS TABLE (댓글)
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- 대댓글 지원
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- RLS 활성화
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 댓글을 조회할 수 있음
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

-- 인증된 사용자는 댓글을 생성할 수 있음
CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 사용자는 자신의 댓글만 수정/삭제 가능
CREATE POLICY "Users can update own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 12. FUNCTIONS & TRIGGERS FOR POSTS
-- ============================================

-- 게시글 updated_at 자동 업데이트
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 게시글 좋아요 카운트 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts
  SET like_count = (
    SELECT COUNT(*)
    FROM post_likes
    WHERE post_id = COALESCE(NEW.post_id, OLD.post_id)
  )
  WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 좋아요 생성/삭제 시 카운트 업데이트
CREATE TRIGGER update_post_like_count_trigger
  AFTER INSERT OR DELETE ON post_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_post_like_count();

-- 게시글 댓글 카운트 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts
  SET comment_count = (
    SELECT COUNT(*)
    FROM comments
    WHERE post_id = COALESCE(NEW.post_id, OLD.post_id)
      AND parent_id IS NULL -- 대댓글은 카운트에 포함하지 않음
  )
  WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 댓글 생성/삭제 시 카운트 업데이트
CREATE TRIGGER update_post_comment_count_trigger
  AFTER INSERT OR DELETE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comment_count();

-- ============================================
-- 13. SAMPLE DATA (선택사항)
-- ============================================
-- 필요시 샘플 데이터를 추가할 수 있습니다

