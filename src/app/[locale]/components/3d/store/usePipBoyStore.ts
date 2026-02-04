import { create } from 'zustand';

/**
 * Tabs disponibles en el Pip-Boy (como en Fallout 4)
 */
export const PIPBOY_TABS = ['STATS', 'PROJECTS', 'SKILLS', 'DATA'] as const;
export type PipBoyTab = typeof PIPBOY_TABS[number];

/**
 * Tipo para un proyecto del portfolio
 */
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  sector: string;
  client: string;
  location: string;
  context?: string;
  englishCommunication?: boolean;
}

/**
 * Tipo para una skill
 */
export interface PortfolioSkill {
  name: string;
  level: number; // 0-100
  category: 'core' | 'tools' | 'soft';
}

/**
 * Estado del Pip-Boy
 */
interface PipBoyState {
  // Navegación de tabs
  currentTab: PipBoyTab;
  currentTabIndex: number;
  
  // Navegación dentro de un tab (lista de items)
  selectedItemIndex: number;
  
  // Vista de detalle
  isViewingDetail: boolean;
  
  // Datos del portfolio (se cargan desde traducciones)
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
  
  // Estado de animación
  isTransitioning: boolean;
  
  // Sonido habilitado
  soundEnabled: boolean;
}

/**
 * Acciones del Pip-Boy
 */
interface PipBoyActions {
  // Navegación de tabs
  nextTab: () => void;
  prevTab: () => void;
  setTab: (tab: PipBoyTab) => void;
  
  // Navegación de items
  nextItem: () => void;
  prevItem: () => void;
  selectItem: (index: number) => void;
  
  // Vista de detalle
  openDetail: () => void;
  closeDetail: () => void;
  toggleDetail: () => void;
  
  // Datos
  setProjects: (projects: PortfolioProject[]) => void;
  setSkills: (skills: PortfolioSkill[]) => void;
  
  // Utilidades
  setTransitioning: (value: boolean) => void;
  toggleSound: () => void;
  reset: () => void;
  
  // Getters computados
  getCurrentProject: () => PortfolioProject | null;
  getItemCount: () => number;
}

export type PipBoyStore = PipBoyState & PipBoyActions;

/**
 * Estado inicial
 */
const initialState: PipBoyState = {
  currentTab: 'STATS',
  currentTabIndex: 0,
  selectedItemIndex: 0,
  isViewingDetail: false,
  projects: [],
  skills: [],
  isTransitioning: false,
  soundEnabled: true,
};

/**
 * Store principal del Pip-Boy
 * Maneja toda la navegación y estado de la interfaz diegética
 */
export const usePipBoyStore = create<PipBoyStore>((set, get) => ({
  ...initialState,
  
  // ============ NAVEGACIÓN DE TABS ============
  
  nextTab: () => {
    const { currentTabIndex, isTransitioning, isViewingDetail } = get();
    if (isTransitioning || isViewingDetail) return;
    
    const nextIndex = (currentTabIndex + 1) % PIPBOY_TABS.length;
    set({
      currentTabIndex: nextIndex,
      currentTab: PIPBOY_TABS[nextIndex],
      selectedItemIndex: 0, // Reset item selection on tab change
      isTransitioning: true,
    });
    
    // Auto-reset transitioning after animation
    setTimeout(() => set({ isTransitioning: false }), 150);
  },
  
  prevTab: () => {
    const { currentTabIndex, isTransitioning, isViewingDetail } = get();
    if (isTransitioning || isViewingDetail) return;
    
    const prevIndex = currentTabIndex === 0 
      ? PIPBOY_TABS.length - 1 
      : currentTabIndex - 1;
    set({
      currentTabIndex: prevIndex,
      currentTab: PIPBOY_TABS[prevIndex],
      selectedItemIndex: 0,
      isTransitioning: true,
    });
    
    setTimeout(() => set({ isTransitioning: false }), 150);
  },
  
  setTab: (tab: PipBoyTab) => {
    const { isTransitioning, isViewingDetail } = get();
    if (isTransitioning || isViewingDetail) return;
    
    const index = PIPBOY_TABS.indexOf(tab);
    if (index === -1) return;
    
    set({
      currentTab: tab,
      currentTabIndex: index,
      selectedItemIndex: 0,
      isTransitioning: true,
    });
    
    setTimeout(() => set({ isTransitioning: false }), 150);
  },
  
  // ============ NAVEGACIÓN DE ITEMS ============
  
  nextItem: () => {
    const { selectedItemIndex, isTransitioning } = get();
    const itemCount = get().getItemCount();
    if (isTransitioning || itemCount === 0) return;
    
    const nextIndex = (selectedItemIndex + 1) % itemCount;
    set({ selectedItemIndex: nextIndex });
  },
  
  prevItem: () => {
    const { selectedItemIndex, isTransitioning } = get();
    const itemCount = get().getItemCount();
    if (isTransitioning || itemCount === 0) return;
    
    const prevIndex = selectedItemIndex === 0 
      ? itemCount - 1 
      : selectedItemIndex - 1;
    set({ selectedItemIndex: prevIndex });
  },
  
  selectItem: (index: number) => {
    const itemCount = get().getItemCount();
    if (index >= 0 && index < itemCount) {
      set({ selectedItemIndex: index });
    }
  },
  
  // ============ VISTA DE DETALLE ============
  
  openDetail: () => {
    const { currentTab, projects, selectedItemIndex } = get();
    // Solo abrir detalle si hay algo que mostrar
    if (currentTab === 'PROJECTS' && projects[selectedItemIndex]) {
      set({ isViewingDetail: true });
    }
    // Agregar más casos según necesidad (SKILLS detail, etc.)
  },
  
  closeDetail: () => {
    set({ isViewingDetail: false });
  },
  
  toggleDetail: () => {
    const { isViewingDetail } = get();
    if (isViewingDetail) {
      get().closeDetail();
    } else {
      get().openDetail();
    }
  },
  
  // ============ DATOS ============
  
  setProjects: (projects: PortfolioProject[]) => {
    set({ projects });
  },
  
  setSkills: (skills: PortfolioSkill[]) => {
    set({ skills });
  },
  
  // ============ UTILIDADES ============
  
  setTransitioning: (value: boolean) => {
    set({ isTransitioning: value });
  },
  
  toggleSound: () => {
    set((state) => ({ soundEnabled: !state.soundEnabled }));
  },
  
  reset: () => {
    set({ ...initialState, projects: get().projects, skills: get().skills });
  },
  
  // ============ GETTERS COMPUTADOS ============
  
  getCurrentProject: () => {
    const { currentTab, projects, selectedItemIndex } = get();
    if (currentTab !== 'PROJECTS') return null;
    return projects[selectedItemIndex] || null;
  },
  
  getItemCount: () => {
    const { currentTab, projects, skills } = get();
    switch (currentTab) {
      case 'PROJECTS':
        return projects.length;
      case 'SKILLS':
        return skills.length;
      case 'STATS':
        return 4; // Líneas de stats fijas
      case 'DATA':
        return 3; // Education, Blog, Contact
      default:
        return 0;
    }
  },
}));

/**
 * Selectores para optimizar re-renders
 */
export const selectCurrentTab = (state: PipBoyStore) => state.currentTab;
export const selectSelectedIndex = (state: PipBoyStore) => state.selectedItemIndex;
export const selectIsViewingDetail = (state: PipBoyStore) => state.isViewingDetail;
export const selectProjects = (state: PipBoyStore) => state.projects;
export const selectSkills = (state: PipBoyStore) => state.skills;
export const selectIsTransitioning = (state: PipBoyStore) => state.isTransitioning;
