-- VORTEX Game Explorer Community Tables
-- 커뮤니티 기능을 위한 테이블 생성 SQL
-- Supabase SQL Editor에서 실행하세요

-- ============================================
-- POSTS TABLE (커뮤니티 게시글)
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
-- POST LIKES TABLE (게시글 좋아요)
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
-- COMMENTS TABLE (댓글)
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
-- FUNCTIONS & TRIGGERS FOR POSTS
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

