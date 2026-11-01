'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalysisReport, Source, Aspect, Claim } from '@/types';
import { SAMPLE_REPORT, SAMPLE_SOURCES, SAMPLE_ASPECTS, SAMPLE_CLAIMS } from '@/data/sample-scholarship';
import { 
  ALL_EVALUATION_SCENARIOS, 
  SCENARIO_STEM_SCHOLARSHIP, 
  SCENARIO_STEM_OPT, 
  SCENARIO_CLEAN_ENERGY 
} from '@/data/scenarios';

interface DarkSpotState {
  question: string;
  sources: Source[];
  aspects: Aspect[];
  claims: Claim[];
  report: AnalysisReport | null;
  isAnalyzing: boolean;
  analysisStage: string;
  activeTab: 'gaps' | 'conflicts' | 'freshness' | 'evidence' | 'checklist' | 'overview';
  activeScenarioId: string;
  currentView: 'landing' | 'workspace' | 'dashboard';
  
  // Source Reader Drawer state
  isSourceDrawerOpen: boolean;
  selectedSourceForDrawer: Source | null;
  highlightedQuote: string | null;
  
  // Modals
  isWhyGapsModalOpen: boolean;
  isExportModalOpen: boolean;

  // Sample mode indicator
  isSampleMode: boolean;

  // AI configuration & health
  aiConfigured: boolean | null;
  aiError: string | null;

  // Actions
  setQuestion: (question: string) => void;
  setAiError: (error: string | null) => void;
  checkAiHealth: () => Promise<boolean>;
  addSource: (source: Source) => void;
  removeSource: (id: string) => void;
  updateSource: (id: string, update: Partial<Source>) => void;
  setAspects: (aspects: Aspect[]) => void;
  setReport: (report: AnalysisReport | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean, stage?: string) => void;
  setActiveTab: (tab: 'gaps' | 'conflicts' | 'freshness' | 'evidence' | 'checklist' | 'overview') => void;
  
  openSourceDrawer: (source: Source, quote?: string) => void;
  closeSourceDrawer: () => void;
  toggleChecklistItem: (itemId: string) => void;
  
  setIsWhyGapsModalOpen: (isOpen: boolean) => void;
  setIsExportModalOpen: (isOpen: boolean) => void;

  setCurrentView: (view: 'landing' | 'workspace' | 'dashboard') => void;
  loadScenario: (scenarioId: string) => void;
  loadSampleMode: () => void;
  resetSession: () => void;
}

export const useDarkSpotStore = create<DarkSpotState>()(
  persist(
    (set, get) => ({
      question: SAMPLE_REPORT.question,
      sources: SAMPLE_SOURCES,
      aspects: SAMPLE_ASPECTS,
      claims: SAMPLE_CLAIMS,
      report: SAMPLE_REPORT,
      isAnalyzing: false,
      analysisStage: '',
      activeTab: 'gaps',
      activeScenarioId: 'stem-scholarship',
      currentView: 'landing',
      
      isSourceDrawerOpen: false,
      selectedSourceForDrawer: null,
      highlightedQuote: null,
      
      isWhyGapsModalOpen: false,
      isExportModalOpen: false,
      isSampleMode: true,
      aiConfigured: null,
      aiError: null,

      setQuestion: (question) => set({ question, activeScenarioId: 'custom' }),
      setAiError: (aiError) => set({ aiError }),
      checkAiHealth: async () => {
        try {
          const res = await fetch('/api/health');
          if (!res.ok) throw new Error('Health check endpoint failed');
          const data = await res.json();
          const configured = Boolean(data.aiConfigured);
          set({ aiConfigured: configured });
          return configured;
        } catch {
          set({ aiConfigured: false });
          return false;
        }
      },
      
      addSource: (source) =>
        set((state) => ({
          sources: [...state.sources.filter((s) => s.id !== source.id), source],
          activeScenarioId: 'custom'
        })),
        
      removeSource: (id) =>
        set((state) => ({
          sources: state.sources.filter((s) => s.id !== id),
          activeScenarioId: 'custom'
        })),
        
      updateSource: (id, update) =>
        set((state) => ({
          sources: state.sources.map((s) => (s.id === id ? { ...s, ...update } : s)),
          activeScenarioId: 'custom'
        })),
        
      setAspects: (aspects) => set({ aspects }),
      
      setReport: (report) => set({ report }),
      
      setIsAnalyzing: (isAnalyzing, stage = '') =>
        set({ isAnalyzing, analysisStage: stage }),
        
      setActiveTab: (activeTab) => set({ activeTab }),
      
      openSourceDrawer: (source, quote) =>
        set({
          isSourceDrawerOpen: true,
          selectedSourceForDrawer: source,
          highlightedQuote: quote || null
        }),
        
      closeSourceDrawer: () =>
        set({
          isSourceDrawerOpen: false,
          selectedSourceForDrawer: null,
          highlightedQuote: null
        }),
        
      setIsWhyGapsModalOpen: (isWhyGapsModalOpen) => set({ isWhyGapsModalOpen }),
      setIsExportModalOpen: (isExportModalOpen) => set({ isExportModalOpen }),
      setCurrentView: (currentView) => set({ currentView }),

      toggleChecklistItem: (itemId) =>
        set((state) => {
          if (!state.report) return state;
          const updatedChecklist = state.report.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          );
          return {
            report: {
              ...state.report,
              checklist: updatedChecklist
            }
          };
        }),
        
      loadScenario: (scenarioId: string) => {
        let found = ALL_EVALUATION_SCENARIOS.find((s) => s.id === scenarioId);
        if (!found) {
          found = SCENARIO_STEM_SCHOLARSHIP;
        }

        const reportWithSources = {
          ...found.report,
          sources: found.sources,
          claims: found.claims
        };

        set({
          question: found.question,
          sources: found.sources,
          aspects: found.aspects,
          claims: found.claims,
          report: reportWithSources,
          activeScenarioId: found.id,
          currentView: 'dashboard',
          isSampleMode: true,
          activeTab: 'gaps',
          isSourceDrawerOpen: false,
          selectedSourceForDrawer: null,
          highlightedQuote: null
        });
      },

      loadSampleMode: () => {
        set({ aiError: null });
        get().loadScenario('stem-scholarship');
      },
        
      resetSession: () =>
        set({
          question: '',
          sources: [],
          aspects: [],
          claims: [],
          report: null,
          activeScenarioId: 'custom',
          currentView: 'workspace',
          isSampleMode: false,
          activeTab: 'gaps',
          isSourceDrawerOpen: false,
          selectedSourceForDrawer: null,
          highlightedQuote: null
        })
    }),
    {
      name: 'digital-dark-spot-session-v2',
      partialize: (state) => ({
        question: state.question,
        sources: state.sources,
        aspects: state.aspects,
        claims: state.claims,
        report: state.report,
        activeScenarioId: state.activeScenarioId,
        isSampleMode: state.isSampleMode
      })
    }
  )
);
