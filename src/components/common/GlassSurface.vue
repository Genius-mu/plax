<template>
  <div
    class="glass-surface flex flex-col justify-start items-stretch relative overflow-hidden transition-all duration-200"
    :class="className"
    :style="containerStyle"
  >
    <div class="glass-surface__content w-full h-full">
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
    blur?: number;
    saturation?: number;
    className?: string;
    style?: Record<string, any>;
  }>(),
  {
    borderRadius: 20,
    blur: 16,
    saturation: 1.8,
    className: '',
    style: () => ({}),
  }
);

const containerStyle = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
  const h = typeof props.height === 'number' ? `${props.height}px` : props.height;

  return {
    ...props.style,
    width: w || undefined,
    height: h || undefined,
    borderRadius: `${props.borderRadius}px`,
    backdropFilter: `blur(${props.blur}px) saturate(${props.saturation})`,
    WebkitBackdropFilter: `blur(${props.blur}px) saturate(${props.saturation})`,
  };
});
</script>

<style scoped>
.glass-surface {
  position: relative;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
    0 12px 36px 0 rgba(0, 0, 0, 0.5);
  transition: transform 0.2s ease-out, background-color 0.2s ease-out;
}

.glass-surface:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.28);
}

.glass-surface__content {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 1;
}
</style>
