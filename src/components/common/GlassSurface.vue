<template>
  <div
    class="glass-surface glass-surface--fallback flex items-center justify-center relative overflow-hidden transition-opacity duration-300"
    :class="className"
    :style="customStyles"
  >
    <div class="glass-surface__content w-full h-full p-3 rounded-inherit relative z-10 flex items-center justify-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    width?: string | number;
    height?: string | number;
    borderRadius?: number;
    brightness?: number;
    opacity?: number;
    blur?: number;
    saturation?: number;
    className?: string;
    style?: Record<string, any>;
  }>(),
  {
    borderRadius: 20,
    brightness: 1.15,
    opacity: 0.93,
    blur: 14,
    saturation: 1.8,
    className: '',
    style: () => ({}),
  }
);

const customStyles = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
  const h = typeof props.height === 'number' ? `${props.height}px` : props.height;

  return {
    ...props.style,
    width: w || undefined,
    height: h || undefined,
    borderRadius: `${props.borderRadius}px`,
    backdropFilter: `blur(${props.blur}px) saturate(${props.saturation}) brightness(${props.brightness})`,
    WebkitBackdropFilter: `blur(${props.blur}px) saturate(${props.saturation}) brightness(${props.brightness})`,
  };
});
</script>

<style scoped>
.glass-surface--fallback {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 0 rgba(255, 255, 255, 0.1),
    0 8px 32px 0 rgba(0, 0, 0, 0.45);
}
</style>
