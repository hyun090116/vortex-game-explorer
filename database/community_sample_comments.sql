-- VORTEX Game Explorer Community Sample Comments
-- 커뮤니티 샘플 댓글 데이터
-- 이 파일은 community_sample_data.sql 실행 후 실행하세요

-- ============================================
-- 샘플 댓글 데이터 삽입
-- ============================================
-- 주의: 실제 사용자 ID와 게시글이 필요합니다. 
-- 이 SQL은 현재 auth.users에 있는 첫 번째 사용자의 ID를 사용합니다.
-- 게시글이 없으면 댓글이 삽입되지 않습니다.

DO $$
DECLARE
  sample_user_id UUID;
  post1_id UUID;
  post2_id UUID;
  post3_id UUID;
  post4_id UUID;
  post5_id UUID;
  post6_id UUID;
  post7_id UUID;
  post8_id UUID;
  post9_id UUID;
  comment_id UUID;
  i INTEGER;
BEGIN
  -- 첫 번째 사용자 ID 가져오기 (없으면 종료)
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  IF sample_user_id IS NULL THEN
    RAISE NOTICE '사용자가 없어서 샘플 댓글을 삽입할 수 없습니다. 먼저 회원가입을 해주세요.';
    RETURN;
  END IF;

  -- 게시글 ID 가져오기
  SELECT id INTO post1_id FROM posts WHERE title = '사이버 넥서스 2088 최신 업데이트 공유' LIMIT 1;
  SELECT id INTO post2_id FROM posts WHERE title = '보이드 워커 공략 팁 모음' LIMIT 1;
  SELECT id INTO post3_id FROM posts WHERE title = '메카 어썰트 멀티플레이 파티 모집' LIMIT 1;
  SELECT id INTO post4_id FROM posts WHERE title = '게임 밸런스에 대한 토론' LIMIT 1;
  SELECT id INTO post5_id FROM posts WHERE title = '퀀텀 브레이크 퍼즐 해결법' LIMIT 1;
  SELECT id INTO post6_id FROM posts WHERE title = '사이버 넥서스 멀티플레이 파티 모집' LIMIT 1;

  -- 게시글 1: 사이버 넥서스 2088 최신 업데이트 공유 (5개 댓글)
  IF post1_id IS NOT NULL THEN
    -- 기존 댓글 삭제 (중복 방지)
    DELETE FROM comments WHERE post_id = post1_id;
    
    -- 샘플 댓글 5개 삽입
    INSERT INTO comments (user_id, post_id, content, created_at) VALUES
    (sample_user_id, post1_id, '정말 좋은 정보 감사합니다! 홀로그램 아머가 정말 멋지네요.', NOW() - INTERVAL '1 hour 50 minutes'),
    (sample_user_id, post1_id, '업데이트 후 플레이해봤는데 정말 만족스럽습니다. 특히 PvP 밸런스가 좋아졌어요.', NOW() - INTERVAL '1 hour 40 minutes'),
    (sample_user_id, post1_id, '네온 스트리트 테마 너무 예쁘네요! 바로 구매했습니다.', NOW() - INTERVAL '1 hour 30 minutes'),
    (sample_user_id, post1_id, '멀티플레이어 매칭이 정말 빨라졌어요. 좋은 업데이트입니다!', NOW() - INTERVAL '1 hour 20 minutes'),
    (sample_user_id, post1_id, '협동 미션 재밌네요. 친구들과 함께 플레이하기 좋습니다.', NOW() - INTERVAL '1 hour 10 minutes');
  END IF;

  -- 게시글 2: 보이드 워커 공략 팁 모음 (10개 댓글)
  IF post2_id IS NOT NULL THEN
    DELETE FROM comments WHERE post_id = post2_id;
    
    -- 샘플 댓글 10개 삽입
    FOR i IN 1..10 LOOP
      INSERT INTO comments (user_id, post_id, content, created_at)
      VALUES (
        sample_user_id,
        post2_id,
        CASE (i % 10)
          WHEN 0 THEN '정말 유용한 팁입니다! 덕분에 게임이 훨씬 쉬워졌어요.'
          WHEN 1 THEN '자원 관리 팁이 특히 도움이 되었습니다. 감사합니다!'
          WHEN 2 THEN '적 대처법이 정말 실용적이네요. 바로 적용해봤습니다.'
          WHEN 3 THEN '맵 활용 팁 덕분에 생존률이 올라갔어요!'
          WHEN 4 THEN '무기 선택 가이드가 정말 도움이 됩니다.'
          WHEN 5 THEN '초보자에게 정말 유용한 공략이네요. 추천합니다!'
          WHEN 6 THEN '의료 키트 관리 팁이 생명줄이었어요.'
          WHEN 7 THEN '배터리 관리 방법이 정말 실용적입니다.'
          WHEN 8 THEN '적의 패턴 파악 팁이 게임을 완전히 바꿨어요.'
          ELSE '좋은 공략 감사합니다! 계속 업데이트 부탁드려요.'
        END,
        NOW() - INTERVAL '1 day' + (i * INTERVAL '20 minutes')
      );
    END LOOP;
  END IF;

  -- 게시글 3: 메카 어썰트 멀티플레이 파티 모집 (5개 댓글)
  IF post3_id IS NOT NULL THEN
    DELETE FROM comments WHERE post_id = post3_id;
    
    INSERT INTO comments (user_id, post_id, content, created_at) VALUES
    (sample_user_id, post3_id, '참여하고 싶은데 레벨이 아직 부족하네요. 다음에 참여하겠습니다!', NOW() - INTERVAL '23 hours 30 minutes'),
    (sample_user_id, post3_id, '디스코드로 연락드렸습니다!', NOW() - INTERVAL '23 hours'),
    (sample_user_id, post3_id, '레벨 25인데 참여 가능할까요?', NOW() - INTERVAL '22 hours 30 minutes'),
    (sample_user_id, post3_id, '오늘 저녁 8시 참여 가능합니다!', NOW() - INTERVAL '20 hours 30 minutes'),
    (sample_user_id, post3_id, '팀워크 중요하다는 말에 공감합니다. 참여하고 싶어요!', NOW() - INTERVAL '20 hours');
  END IF;

  -- 게시글 4: 게임 밸런스에 대한 토론 (15개 댓글)
  IF post4_id IS NOT NULL THEN
    DELETE FROM comments WHERE post_id = post4_id;
    
    -- 샘플 댓글 15개 삽입
    FOR i IN 1..15 LOOP
      INSERT INTO comments (user_id, post_id, content, created_at)
      VALUES (
        sample_user_id,
        post4_id,
        CASE (i % 15)
          WHEN 0 THEN '무기 밸런스에 대해 정말 공감합니다. 일부 무기가 너무 강한 것 같아요.'
          WHEN 1 THEN '캐릭터 밸런스가 중요한데 아직 개선이 필요해 보입니다.'
          WHEN 2 THEN '난이도 밸런스는 적절한 것 같아요. 다만 중간 난이도가 좀 더 다양하면 좋겠습니다.'
          WHEN 3 THEN '메타 무기 다양화가 정말 필요합니다. 지금은 몇 개 무기만 사용되고 있어요.'
          WHEN 4 THEN '약한 무기들을 버프해야 할 것 같습니다. 현재는 선택지가 제한적이에요.'
          WHEN 5 THEN '특정 캐릭터가 과도하게 강한 것 같습니다. 밸런스 패치가 필요해요.'
          WHEN 6 THEN '팀 조합의 다양성이 줄어들고 있는 것 같아요. 밸런스 조정이 필요합니다.'
          WHEN 7 THEN '쉬운 난이도는 너무 쉬운 것 같고, 어려운 난이도는 너무 어려운 것 같아요.'
          WHEN 8 THEN '밸런스 논의가 정말 중요합니다. 개발팀이 이 토론을 봤으면 좋겠어요.'
          WHEN 9 THEN '무기 밸런스보다는 캐릭터 밸런스가 더 시급한 것 같습니다.'
          WHEN 10 THEN '메타가 고정되어 있어서 게임이 지루해지는 것 같아요.'
          WHEN 11 THEN '밸런스 패치를 기대하고 있습니다. 개발팀 응원합니다!'
          WHEN 12 THEN '현재 밸런스는 괜찮은 것 같은데, 더 개선되면 좋겠어요.'
          WHEN 13 THEN '밸런스 토론이 정말 유익합니다. 다양한 의견이 좋네요.'
          ELSE '좋은 토론 감사합니다!'
        END,
        NOW() - INTERVAL '1 day' + (i * INTERVAL '15 minutes')
      );
    END LOOP;
  END IF;

  -- 게시글 5: 퀀텀 브레이크 퍼즐 해결법 (10개 댓글)
  IF post5_id IS NOT NULL THEN
    DELETE FROM comments WHERE post_id = post5_id;
    
    -- 샘플 댓글 10개 삽입
    FOR i IN 1..10 LOOP
      INSERT INTO comments (user_id, post_id, content, created_at)
      VALUES (
        sample_user_id,
        post5_id,
        CASE (i % 12)
          WHEN 0 THEN '시간 역행 퍼즐 해결법이 정말 도움이 되었습니다!'
          WHEN 1 THEN '중력 조작 퍼즐이 어려웠는데 덕분에 해결했습니다.'
          WHEN 2 THEN '시간 정지 퍼즐 팁이 정말 유용했어요!'
          WHEN 3 THEN '퍼즐 해결법 정리해주셔서 감사합니다. 덕분에 진행할 수 있었어요.'
          WHEN 4 THEN '더 어려운 퍼즐도 있나요? 해결법 공유 부탁드려요!'
          WHEN 5 THEN '퍼즐 1 해결법이 정말 명확해서 바로 이해했습니다.'
          WHEN 6 THEN '퍼즐 2에서 막혔었는데 이제 해결할 수 있겠어요!'
          WHEN 7 THEN '퍼즐 3 팁이 정말 실용적입니다. 감사합니다!'
          WHEN 8 THEN '시간 역행 메커니즘을 이해하는 게 중요하네요.'
          WHEN 9 THEN '중력 조작이 핵심이었어요. 좋은 팁 감사합니다!'
          WHEN 10 THEN '시간 정지 활용법이 정말 유용합니다.'
          ELSE '좋은 공략 감사합니다!'
        END,
        NOW() - INTERVAL '3 days' + (i * INTERVAL '1 hour')
      );
    END LOOP;
  END IF;

  -- 게시글 6: 사이버 넥서스 멀티플레이 파티 모집 (5개 댓글)
  IF post6_id IS NOT NULL THEN
    DELETE FROM comments WHERE post_id = post6_id;
    
    INSERT INTO comments (user_id, post_id, content, created_at) VALUES
    (sample_user_id, post6_id, '레이드 경험 많은데 참여하고 싶습니다!', NOW() - INTERVAL '9 hours 30 minutes'),
    (sample_user_id, post6_id, '딜러 역할 가능합니다. 레벨 55입니다!', NOW() - INTERVAL '9 hours'),
    (sample_user_id, post6_id, '정기 참여 가능합니다. 디스코드로 연락드릴게요!', NOW() - INTERVAL '8 hours 30 minutes'),
    (sample_user_id, post6_id, '매일 저녁 8시 참여 가능합니다!', NOW() - INTERVAL '7 hours 30 minutes'),
    (sample_user_id, post6_id, '레이드 클리어 경험이 많아서 도움이 될 것 같아요.', NOW() - INTERVAL '7 hours');
  END IF;

  -- 댓글이 없는 게시글에 댓글 추가
  -- 게시글 7: 스텔라 오디세이 엔딩 스포일러 주의! (댓글 추가)
  SELECT id INTO post7_id FROM posts WHERE title = '스텔라 오디세이 엔딩 스포일러 주의!' LIMIT 1;
  IF post7_id IS NOT NULL THEN
    INSERT INTO comments (user_id, post_id, content, created_at) VALUES
    (sample_user_id, post7_id, '스포일러 주의해주셔서 감사합니다! 아직 엔딩을 못 봤는데 기대됩니다.', NOW() - INTERVAL '4 hours 30 minutes'),
    (sample_user_id, post7_id, '저도 이 게임 엔딩 정말 감동적이었어요. 여러 엔딩이 있다고 들었는데요.', NOW() - INTERVAL '4 hours'),
    (sample_user_id, post7_id, '마지막 선택지에서 고민이 많았는데, 다른 분들은 어떤 선택을 하셨나요?', NOW() - INTERVAL '3 hours 30 minutes'),
    (sample_user_id, post7_id, '엔딩 음악과 연출이 정말 인상적이었습니다. OST도 구매했어요!', NOW() - INTERVAL '3 hours'),
    (sample_user_id, post7_id, '다른 엔딩도 보고 싶어서 다시 플레이하고 있어요.', NOW() - INTERVAL '2 hours 30 minutes');
    
    -- 댓글 수 업데이트
    UPDATE posts SET comment_count = 5 WHERE id = post7_id;
  END IF;

  -- 게시글 8: 네온 드리프트 레이싱 팁 (댓글 추가)
  SELECT id INTO post8_id FROM posts WHERE title = '네온 드리프트 레이싱 팁' LIMIT 1;
  IF post8_id IS NOT NULL THEN
    INSERT INTO comments (user_id, post_id, content, created_at) VALUES
    (sample_user_id, post8_id, '드리프트 타이밍 팁이 정말 도움이 되었습니다!', NOW() - INTERVAL '3 hours 30 minutes'),
    (sample_user_id, post8_id, '부스터 활용법이 핵심이네요. 덕분에 레이스 타임이 많이 줄었어요.', NOW() - INTERVAL '3 hours'),
    (sample_user_id, post8_id, '코스 외곽 활용 팁이 정말 실용적입니다. 감사합니다!', NOW() - INTERVAL '2 hours 30 minutes'),
    (sample_user_id, post8_id, '차량 커스터마이징 설정이 게임을 완전히 바꿨어요.', NOW() - INTERVAL '2 hours'),
    (sample_user_id, post8_id, '초보자에게 정말 유용한 팁이네요. 추천합니다!', NOW() - INTERVAL '1 hour 30 minutes');
    
    -- 댓글 수 업데이트
    UPDATE posts SET comment_count = 5 WHERE id = post8_id;
  END IF;

  -- 게시글 9: 보이드 워커 공포 모드 플레이 파티 (댓글 추가)
  SELECT id INTO post9_id FROM posts WHERE title = '보이드 워커 공포 모드 플레이 파티' LIMIT 1;
  IF post9_id IS NOT NULL THEN
    INSERT INTO comments (user_id, post_id, content, created_at) VALUES
    (sample_user_id, post9_id, '공포 모드 정말 무서운데 함께 플레이하고 싶어요!', NOW() - INTERVAL '7 hours 30 minutes'),
    (sample_user_id, post9_id, '나이트메어 난이도 경험이 있는데 참여 가능할까요?', NOW() - INTERVAL '7 hours'),
    (sample_user_id, post9_id, '밤늦게 플레이 가능합니다. 디스코드로 연락드릴게요!', NOW() - INTERVAL '6 hours 30 minutes'),
    (sample_user_id, post9_id, '공포 게임 좋아하는데 참여하고 싶습니다!', NOW() - INTERVAL '6 hours'),
    (sample_user_id, post9_id, '팀워크 중요하다는 말에 공감합니다. 참여 신청합니다!', NOW() - INTERVAL '5 hours 30 minutes');
    
    -- 댓글 수 업데이트
    UPDATE posts SET comment_count = 5 WHERE id = post9_id;
  END IF;

  RAISE NOTICE '샘플 댓글이 성공적으로 삽입되었습니다!';
END $$;

