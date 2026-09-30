import { ref } from 'vue';

const isCollapsed = ref(localStorage.getItem('plax_sidebar_collapsed') === 'true');

export function useSidebar() {
  function toggleSidebar() {
    isCollapsed.value = !isCollapsed.value;
    localStorage.setItem('plax_sidebar_collapsed', isCollapsed.value ? 'true' : 'false');
  }

  return {
    isCollapsed,
    toggleSidebar,
  };
}
