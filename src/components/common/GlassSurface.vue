<template>
  <div
    ref="containerRef"
    :class="['glass-surface', 'glass-surface--svg', className]"
    :style="containerStyle"
  >
    <!-- Inline SVG Filter definition for real liquid displacement refraction -->
    <svg class="glass-surface__filter" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter :id="filterId" color-interpolation-filters="sRGB" x="-10%" y="-10%" width="120%" height="120%">
          <feImage ref="feImageRef" x="0" y="0" width="100%" height="100%" preserveAspectRatio="none" result="map" />

          <feDisplacementMap ref="redChannelRef" in="SourceGraphic" in2="map" id="redchannel" result="dispRed" />
          <feColorMatrix
            in="dispRed"
            type="matrix"
            values="1 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="red"
          />

          <feDisplacementMap
            ref="greenChannelRef"
            in="SourceGraphic"
            in2="map"
            id="greenchannel"
            result="dispGreen"
          />
          <feColorMatrix
            in="dispGreen"
            type="matrix"
            values="0 0 0 0 0
                    0 1 0 0 0
                    0 0 0 0 0
                    0 0 0 1 0"
            result="green"
          />

          <feDisplacementMap ref="blueChannelRef" in="SourceGraphic" in2="map" id="bluechannel" result="dispBlue" />
          <feColorMatrix
            in="dispBlue"
            type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 1 0 0
                    0 0 0 1 0"
            result="blue"
          />

          <feBlend in="red" in2="green" mode="screen" result="rg" />
          <feBlend in="rg" in2="blue" mode="screen" result="output" />
          <feGaussianBlur ref="gaussianBlurRef" in="output" stdDeviation="1.2" />
        </filter>
      </defs>
    </svg>

    <div class="glass-surface__content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    width?: string | number;
    height?: string | number;
    borderRadius?: number;
    borderWidth?: number;
    brightness?: number;
    opacity?: number;
    blur?: number;
    displace?: number;
    backgroundOpacity?: number;
    saturation?: number;
    distortionScale?: number;
    redOffset?: number;
    greenOffset?: number;
    blueOffset?: number;
    xChannel?: string;
    yChannel?: string;
    mixBlendMode?: string;
    className?: string;
    style?: Record<string, any>;
  }>(),
  {
    borderRadius: 24,
    borderWidth: 0.08,
    brightness: 60,
    opacity: 0.92,
    blur: 14,
    displace: 1.5,
    backgroundOpacity: 0.12,
    saturation: 1.8,
    distortionScale: -220,
    redOffset: 0,
    greenOffset: 12,
    blueOffset: 24,
    xChannel: 'R',
    yChannel: 'G',
    mixBlendMode: 'difference',
    className: '',
    style: () => ({}),
  }
);

const randomId = Math.random().toString(36).substring(2, 9);
const filterId = `glass-filter-${randomId}`;
const redGradId = `red-grad-${randomId}`;
const blueGradId = `blue-grad-${randomId}`;

const containerRef = ref<HTMLDivElement | null>(null);
const feImageRef = ref<SVGFeImageElement | null>(null);
const redChannelRef = ref<SVGFEDisplacementMapElement | null>(null);
const greenChannelRef = ref<SVGFEDisplacementMapElement | null>(null);
const blueChannelRef = ref<SVGFEDisplacementMapElement | null>(null);
const gaussianBlurRef = ref<SVGFEGaussianBlurElement | null>(null);

const generateDisplacementMap = () => {
  const rect = containerRef.value?.getBoundingClientRect();
  const actualWidth = rect?.width || 400;
  const actualHeight = rect?.height || 200;
  const edgeSize = Math.min(actualWidth, actualHeight) * (props.borderWidth * 0.5);

  const svgContent = `
    <svg viewBox="0 0 ${actualWidth} ${actualHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${redGradId}" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="${blueGradId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" fill="black"></rect>
      <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${props.borderRadius}" fill="url(#${redGradId})" />
      <rect x="0" y="0" width="${actualWidth}" height="${actualHeight}" rx="${props.borderRadius}" fill="url(#${blueGradId})" style="mix-blend-mode: ${props.mixBlendMode}" />
      <rect x="${edgeSize}" y="${edgeSize}" width="${Math.max(0, actualWidth - edgeSize * 2)}" height="${Math.max(0, actualHeight - edgeSize * 2)}" rx="${props.borderRadius}" fill="hsl(0 0% ${props.brightness}% / ${props.opacity})" style="filter:blur(${props.blur}px)" />
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svgContent)}`;
};

const updateDisplacementMap = () => {
  if (feImageRef.value) {
    feImageRef.value.setAttribute('href', generateDisplacementMap());
  }

  [
    { ref: redChannelRef, offset: props.redOffset },
    { ref: greenChannelRef, offset: props.greenOffset },
    { ref: blueChannelRef, offset: props.blueOffset },
  ].forEach(({ ref: r, offset }) => {
    if (r.value) {
      r.value.setAttribute('scale', (props.distortionScale + offset).toString());
      r.value.setAttribute('xChannelSelector', props.xChannel);
      r.value.setAttribute('yChannelSelector', props.yChannel);
    }
  });

  if (gaussianBlurRef.value) {
    gaussianBlurRef.value.setAttribute('stdDeviation', props.displace.toString());
  }
};

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updateDisplacementMap();

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      setTimeout(updateDisplacementMap, 0);
    });
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

watch(
  () => [
    props.width,
    props.height,
    props.borderRadius,
    props.borderWidth,
    props.brightness,
    props.opacity,
    props.blur,
    props.displace,
    props.distortionScale,
    props.redOffset,
    props.greenOffset,
    props.blueOffset,
    props.xChannel,
    props.yChannel,
    props.mixBlendMode,
  ],
  () => {
    updateDisplacementMap();
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
    '--glass-frost': props.backgroundOpacity,
    '--glass-saturation': props.saturation,
    '--filter-id': `url(#${filterId})`,
  };
});
</script>

<style scoped>
.glass-surface {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  overflow: hidden;
  transition: opacity 0.26s ease-out, transform 0.26s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-surface__filter {
  width: 100%;
  height: 100%;
  pointer-events: none;
  position: absolute;
  inset: 0;
  opacity: 0;
  z-index: -1;
}

.glass-surface__content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 0;
  border-radius: inherit;
  position: relative;
  z-index: 1;
}

.glass-surface--svg {
  background: rgba(18, 18, 18, var(--glass-frost, 0.12));
  backdrop-filter: var(--filter-id, url(#glass-filter)) saturate(var(--glass-saturation, 1.8));
  -webkit-backdrop-filter: var(--filter-id, url(#glass-filter)) saturate(var(--glass-saturation, 1.8));
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow:
    0 0 2px 1px rgba(255, 255, 255, 0.25) inset,
    0 0 12px 4px rgba(255, 255, 255, 0.1) inset,
    0px 4px 16px rgba(0, 0, 0, 0.4),
    0px 12px 36px rgba(0, 0, 0, 0.5),
    0px 4px 16px rgba(255, 255, 255, 0.05) inset;
}

.glass-surface--svg:hover {
  background: rgba(28, 28, 28, calc(var(--glass-frost, 0.12) + 0.08));
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow:
    0 0 3px 1px rgba(255, 255, 255, 0.35) inset,
    0 0 16px 6px rgba(255, 255, 255, 0.15) inset,
    0px 6px 20px rgba(0, 0, 0, 0.5),
    0px 16px 48px rgba(0, 0, 0, 0.6);
}
</style>
