'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AnalysisReport, Source, Aspect, Claim } from '@/types';
import { SAMPLE_REPORT, SAMPLE_SOURCES, SAMPLE_ASPECTS, SAMPLE_CLAIMS } from '@/data/sample-scholarship';

interface DarkSpotState {
  question: string;
  sources: Source[];
  aspects: Aspect[];
  claims: Claim[];
  report: AnalysisReport | null;
  isAnalyzing: boolean;
  analysisStage: string;
  activeTab: string;
  
  // Source Reader Drawer state
  isSourceDrawerOpen: boolean;
  selectedSourceForDrawer: Source | null;
  highlightedQuote: string | null;
  
  // Sample mode indicator
  isSampleMode: boolean;

  // Actions
  setQuestion: (question: string) => void;
  addSource: (source: Source) => void;
  removeSource: (id: string) => void;
  updateSource: (id: string, update: Partial<Source>) => void;
  setAspects: (aspects: Aspect[]) => void;
  setReport: (report: AnalysisReport | null) => void;
  setIsAnalyzing: (isAnalyzing: boolean, stage?: string) => void;
  setActiveTab: (tab: string) => void;
  
  openSourceDrawer: (source: Source, quote?: string) => void;
  closeSourceDrawer: () => void;
  toggleChecklistItem: (itemId: string) => void;
  
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
      activeTab: 'overview',
      
      isSourceDrawerOpen: false,
      selectedSourceForDrawer: null,
      highlightedQuote: null,
      isSampleMode: true,

      setQuestion: (question) => set({ question }),
      
      addSource: (source) =>
        set((state) => ({
          sources: [...state.sources.filter((s) => s.id !== source.id), source]
        })),
        
      removeSource: (id) =>
        set((state) => ({
          sources: state.sources.filter((s) => s.id !== id)
        })),
        
      updateSource: (id, update) =>
        set((state) => ({
          sources: state.sources.map((s) => (s.id === id ? { ...s, ...update } : s))
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
        
      loadSampleMode: () =>
        set({
          question: SAMPLE_REPORT.question,
          sources: SAMPLE_SOURCES,
          aspects: SAMPLE_ASPECTS,
          claims: SAMPLE_CLAIMS,
          report: SAMPLE_REPORT,
          isSampleMode: true,
          activeTab: 'overview',
          isSourceDrawerOpen: false,
          selectedSourceForDrawer: null,
          highlightedQuote: null
        }),
        
      resetSession: () =>
        set({
          question: '',
          sources: [],
          aspects: [],
          claims: [],
          report: null,
          isSampleMode: false,
          activeTab: 'overview',
          isSourceDrawerOpen: false,
          selectedSourceForDrawer: null,
          highlightedQuote: null
        })
    }),
    {
      name: 'digital-dark-spot-session',
      partialize: (state) => ({
        question: state.question,
        sources: state.sources,
        aspects: state.aspects,
        claims: state.claims,
        report: state.report,
        isSampleMode: state.isSampleMode
      })
    }
  )
);
