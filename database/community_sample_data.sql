-- VORTEX Game Explorer Community Sample Data
-- 커뮤니티 기본 게시글 샘플 데이터
-- 이 파일은 community_tables.sql 실행 후 실행하세요

-- ============================================
-- 샘플 게시글 데이터 삽입
-- ============================================
-- 주의: 실제 사용자 ID가 필요합니다. 
-- 이 SQL은 현재 auth.users에 있는 첫 번째 사용자의 ID를 사용합니다.
-- 사용자가 없으면 샘플 데이터가 삽입되지 않습니다.

-- 샘플 게시글 삽입 함수
DO $$
DECLARE
  sample_user_id UUID;
  post1_id UUID;
  post2_id UUID;
  post3_id UUID;
  post4_id UUID;
  post5_id UUID;
  post6_id UUID;
BEGIN
  -- 첫 번째 사용자 ID 가져오기 (없으면 종료)
  SELECT id INTO sample_user_id FROM auth.users LIMIT 1;
  
  IF sample_user_id IS NULL THEN
    RAISE NOTICE '사용자가 없어서 샘플 데이터를 삽입할 수 없습니다. 먼저 회원가입을 해주세요.';
    RETURN;
  END IF;

  -- 사용자 프로필이 없으면 생성
  INSERT INTO user_profiles (id, username, display_name, bio)
  VALUES (sample_user_id, 'vortex_admin', 'VORTEX 관리자', 'VORTEX 게임 스토어 관리자입니다.')
  ON CONFLICT (id) DO NOTHING;

  -- 샘플 게시글 1: 토론
  INSERT INTO posts (user_id, title, content, category, game_title, like_count, comment_count, created_at)
  VALUES (
    sample_user_id,
    '사이버 넥서스 2088 최신 업데이트 공유',
    '안녕하세요! 사이버 넥서스 2088의 최신 업데이트에 대해 공유하고 싶어서 글을 올립니다.

오늘 새로 출시된 업데이트에서는 다음과 같은 내용이 추가되었습니다:

1. 새로운 사이버펑크 스킨 추가
   - 네온 스트리트 테마
   - 홀로그램 아머 세트
   - 사이버펑크 무기 스킨

2. 멀티플레이어 모드 개선
   - 매칭 시스템 최적화
   - 새로운 협동 미션 추가
   - PvP 밸런스 조정

3. 버그 수정
   - 메모리 누수 문제 해결
   - 그래픽 렌더링 성능 개선
   - 네트워크 연결 안정성 향상

특히 새로운 사이버펑크 스킨들이 정말 멋지네요! 홀로그램 아머는 야간 전투에서 정말 인상적입니다.

다른 분들도 업데이트 후 느낀 점이나 의견을 공유해주시면 좋을 것 같습니다!',
    '토론',
    '사이버 넥서스 2088',
    124,
    5,
    NOW() - INTERVAL '2 hours'
  ) RETURNING id INTO post1_id;

  -- 샘플 게시글 2: 공략
  INSERT INTO posts (user_id, title, content, category, game_title, like_count, comment_count, created_at)
  VALUES (
    sample_user_id,
    '보이드 워커 공략 팁 모음',
    '보이드 워커를 플레이하면서 알게 된 유용한 팁들을 정리해봤습니다!

📌 필수 팁

1. 자원 관리
   - 초반에는 탄약을 아껴서 사용하세요
   - 의료 키트는 위급 상황에만 사용
   - 배터리는 항상 여유 있게 보관

2. 적 대처법
   - 어둠 속에서 움직일 때는 조용히 이동
   - 소음이 나는 행동은 피하기
   - 적의 패턴을 파악하면 회피가 쉬워짐

3. 맵 활용
   - 숨을 수 있는 장소 미리 파악
   - 탈출 경로 항상 확인
   - 아이템 위치 기억하기

4. 무기 선택
   - 조용한 무기 우선 사용
   - 근접 무기는 최후의 수단
   - 탄약이 많은 무기 선호

이 팁들이 도움이 되셨다면 좋아요 부탁드립니다! 추가 팁이 있으시면 댓글로 공유해주세요.',
    '공략',
    '보이드 워커',
    256,
    10,
    NOW() - INTERVAL '1 day'
  ) RETURNING id INTO post2_id;

  -- 샘플 게시글 3: 파티
  INSERT INTO posts (user_id, title, content, category, game_title, like_count, comment_count, created_at)
  VALUES (
    sample_user_id,
    '메카 어썰트 멀티플레이 파티 모집',
    '메카 어썰트: 타이탄 멀티플레이 파티를 모집합니다!

🎮 파티 정보
- 게임: 메카 어썰트: 타이탄
- 모드: 협동 미션
- 난이도: 하드
- 시간: 오늘 저녁 8시

👥 모집 인원
- 현재: 2명
- 필요: 2명 더

📋 조건
- 레벨 20 이상
- 마이크 필수
- 팀워크 중요

💬 연락처
- 디스코드: 메카파일럿#1234
- 게임 내 ID: MechPilot2024

함께 플레이하고 싶으신 분들은 댓글이나 메시지 주세요!',
    '파티',
    '메카 어썰트: 타이탄',
    42,
    5,
    NOW() - INTERVAL '1 day'
  ) RETURNING id INTO post3_id;

  -- 샘플 게시글 4: 토론
  INSERT INTO posts (user_id, title, content, category, game_title, like_count, comment_count, created_at)
  VALUES (
    sample_user_id,
    '게임 밸런스에 대한 토론',
    '게임 밸런스에 대해 토론해봅시다!

⚖️ 밸런스 논란

최근 업데이트로 인해 여러 게임의 밸런스가 변경되었는데, 여러분의 의견은 어떤가요?

1. 무기 밸런스
   - 일부 무기가 너무 강한가?
   - 약한 무기는 어떻게 버프해야 할까?
   - 메타 무기 다양화 필요?

2. 캐릭터 밸런스
   - 특정 캐릭터가 과도하게 강한가?
   - 약한 캐릭터는 어떻게 개선할까?
   - 팀 조합의 다양성은?

3. 난이도 밸런스
   - 쉬운 난이도는 너무 쉬운가?
   - 어려운 난이도는 공정한가?
   - 중간 난이도는 적절한가?

여러분의 의견을 댓글로 공유해주세요! 개발팀도 이 토론을 보고 있을 수 있습니다.',
    '토론',
    '일반',
    201,
    15,
    NOW() - INTERVAL '1 day'
  ) RETURNING id INTO post4_id;

  -- 샘플 게시글 5: 공략
  INSERT INTO posts (user_id, title, content, category, game_title, like_count, comment_count, created_at)
  VALUES (
    sample_user_id,
    '퀀텀 브레이크 퍼즐 해결법',
    '퀀텀 브레이크의 어려운 퍼즐들을 해결하는 방법을 정리했습니다!

🧩 퍼즐 1: 시간 역행 퍼즐
해결법:
1. 시간을 역행시켜서 과거 상태 확인
2. 미래의 장애물 위치 파악
3. 과거에서 미래 장애물 제거
4. 시간을 정상으로 돌려서 통과

🧩 퍼즐 2: 중력 조작 퍼즐
해결법:
1. 중력을 역전시켜 천장으로 이동
2. 중력 조작으로 물체 이동
3. 정상 중력으로 복귀
4. 통로 열기

🧩 퍼즐 3: 시간 정지 퍼즐
해결법:
1. 시간 정지로 움직이는 플랫폼 고정
2. 플랫폼 위로 이동
3. 시간 재개
4. 플랫폼과 함께 이동

더 어려운 퍼즐이 있으면 댓글로 질문해주세요!',
    '공략',
    '퀀텀 브레이크',
    203,
    10,
    NOW() - INTERVAL '3 days'
  ) RETURNING id INTO post5_id;

  -- 샘플 게시글 6: 파티
  INSERT INTO posts (user_id, title, content, category, game_title, like_count, comment_count, created_at)
  VALUES (
    sample_user_id,
    '사이버 넥서스 멀티플레이 파티 모집',
    '사이버 넥서스 2088 멀티플레이 파티를 모집합니다!

🎮 파티 정보
- 게임: 사이버 넥서스 2088
- 모드: 레이드
- 난이도: 엘리트
- 시간: 매일 저녁 8시

👥 현재 상황
- 탱커: 1명
- 딜러: 2명
- 힐러: 1명
- 필요: 딜러 1명

📋 요구사항
- 레벨 50 이상
- 레이드 경험자
- 마이크 필수
- 정기 참여 가능

💬 연락처
- 디스코드: TeamPlayer#9012
- 게임 ID: CyberNexus2024

함께 레이드를 클리어하고 보상을 획득해봅시다!',
    '파티',
    '사이버 넥서스 2088',
    88,
    5,
    NOW() - INTERVAL '10 hours'
  ) RETURNING id INTO post6_id;

  RAISE NOTICE '샘플 게시글 6개가 성공적으로 삽입되었습니다!';
END $$;

