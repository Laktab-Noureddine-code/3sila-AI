import { ref, onMounted, onUnmounted, type Ref } from "vue";

export interface SwipeOptions {
  threshold?: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export function useSwipe(
  elementRef: Ref<HTMLElement | null>,
  options: SwipeOptions = {}
) {
  const {
    threshold = 50,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
  } = options;

  const touchStartX = ref(0);
  const touchStartY = ref(0);
  const touchEndX = ref(0);
  const touchEndY = ref(0);
  const isSwiping = ref(false);
  const swipeDirection = ref<"left" | "right" | "up" | "down" | null>(null);
  const deltaX = ref(0);
  const deltaY = ref(0);

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchStartX.value = touch.clientX;
    touchStartY.value = touch.clientY;
    touchEndX.value = touch.clientX;
    touchEndY.value = touch.clientY;
    isSwiping.value = true;
    deltaX.value = 0;
    deltaY.value = 0;
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isSwiping.value) return;
    const touch = e.touches[0];
    if (!touch) return;
    touchEndX.value = touch.clientX;
    touchEndY.value = touch.clientY;
    deltaX.value = touchEndX.value - touchStartX.value;
    deltaY.value = touchEndY.value - touchStartY.value;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.value) return;

    const diffX = touchEndX.value - touchStartX.value;
    const diffY = touchEndY.value - touchStartY.value;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    // Determine if horizontal or vertical swipe
    if (absDiffX > absDiffY && absDiffX > threshold) {
      // Horizontal swipe
      if (diffX > 0) {
        swipeDirection.value = "right";
        onSwipeRight?.();
      } else {
        swipeDirection.value = "left";
        onSwipeLeft?.();
      }
    } else if (absDiffY > absDiffX && absDiffY > threshold) {
      // Vertical swipe
      if (diffY > 0) {
        swipeDirection.value = "down";
        onSwipeDown?.();
      } else {
        swipeDirection.value = "up";
        onSwipeUp?.();
      }
    }

    isSwiping.value = false;
    deltaX.value = 0;
    deltaY.value = 0;
  };

  onMounted(() => {
    const el = elementRef.value;
    if (el) {
      el.addEventListener("touchstart", handleTouchStart, { passive: true });
      el.addEventListener("touchmove", handleTouchMove, { passive: true });
      el.addEventListener("touchend", handleTouchEnd);
    }
  });

  onUnmounted(() => {
    const el = elementRef.value;
    if (el) {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    }
  });

  return {
    isSwiping,
    swipeDirection,
    deltaX,
    deltaY,
  };
}
