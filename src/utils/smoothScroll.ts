/**
 * 부드러운 스크롤 유틸리티 함수
 */

/**
 * 특정 요소로 부드럽게 스크롤
 * @param target - 스크롤할 대상 요소 또는 선택자
 * @param offset - 상단 오프셋 (픽셀)
 * @param duration - 스크롤 애니메이션 지속 시간 (밀리초)
 */
export const smoothScrollTo = (
  target: string | HTMLElement,
  offset: number = 0,
  duration: number = 800
): void => {
  const element = typeof target === 'string' 
    ? document.querySelector(target) 
    : target;

  if (!element) {
    console.warn(`Smooth scroll target not found: ${target}`);
    return;
  }

  const startPosition = window.pageYOffset;
  const targetPosition = (element as HTMLElement).getBoundingClientRect().top + window.pageYOffset - offset;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  // Easing function (ease-in-out-cubic)
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const animation = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo({
      top: startPosition + distance * ease,
      behavior: 'auto' // 'smooth' 대신 수동으로 제어
    });

    if (progress < 1) {
      requestAnimationFrame(animation);
    } else {
      // 스크롤 완료 후 URL 해시 업데이트
      const id = typeof target === 'string' 
        ? target.replace('#', '') 
        : element.id;
      if (id) {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  };

  requestAnimationFrame(animation);
};

/**
 * 해시 링크 클릭 시 부드럽게 스크롤
 * @param e - 클릭 이벤트
 * @param offset - 상단 오프셋 (픽셀)
 */
export const handleSmoothScroll = (
  e: React.MouseEvent<HTMLAnchorElement> | MouseEvent,
  offset: number = 80
): void => {
  const target = (e.currentTarget as HTMLAnchorElement)?.getAttribute('href') || 
                 (e.target as HTMLAnchorElement)?.getAttribute('href');

  if (!target || !target.startsWith('#')) {
    return; // 해시 링크가 아니면 기본 동작 유지
  }

  e.preventDefault();
  smoothScrollTo(target, offset);
};

/**
 * 페이지 로드 시 해시가 있으면 해당 위치로 부드럽게 스크롤
 * @param offset - 상단 오프셋 (픽셀)
 */
export const scrollToHashOnLoad = (offset: number = 80): void => {
  if (window.location.hash) {
    // 약간의 지연을 두어 DOM이 완전히 로드된 후 스크롤
    setTimeout(() => {
      smoothScrollTo(window.location.hash, offset);
    }, 100);
  }
};

/**
 * 모든 앵커 링크에 부드러운 스크롤 이벤트 리스너 추가
 * @param offset - 상단 오프셋 (픽셀)
 */
export const initSmoothScroll = (offset: number = 80): (() => void) => {
  const handleClick = (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest('a');
    if (target && target.getAttribute('href')?.startsWith('#')) {
      handleSmoothScroll(e as any, offset);
    }
  };

  document.addEventListener('click', handleClick);

  // 클린업 함수 반환
  return () => {
    document.removeEventListener('click', handleClick);
  };
};

