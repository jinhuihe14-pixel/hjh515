import { create } from 'zustand';
import type { InspectionRecord, ViolationRecord, WeighingRecord, Stall, Warning, DashboardStats, RecognitionResult } from '@/types';
import { mockInspections, mockViolations, mockWeighings, mockStalls, mockWarnings, mockDashboardStats } from '@/mock/data';

interface InspectionState {
  inspections: InspectionRecord[];
  violations: ViolationRecord[];
  weighings: WeighingRecord[];
  stalls: Stall[];
  warnings: Warning[];
  dashboardStats: DashboardStats;
  addInspection: (inspection: InspectionRecord) => void;
  addViolation: (violation: ViolationRecord) => void;
  addWeighing: (weighing: WeighingRecord) => void;
  updateViolationStatus: (id: string, status: ViolationRecord['status'], remark?: string) => void;
  acknowledgeWarning: (id: string) => void;
  getViolationsByStatus: (status?: ViolationRecord['status']) => ViolationRecord[];
  getStallById: (id: string) => Stall | undefined;
}

export const useInspectionStore = create<InspectionState>((set, get) => ({
  inspections: mockInspections,
  violations: mockViolations,
  weighings: mockWeighings,
  stalls: mockStalls,
  warnings: mockWarnings,
  dashboardStats: mockDashboardStats,
  
  addInspection: (inspection) => set((state) => ({
    inspections: [inspection, ...state.inspections],
  })),
  
  addViolation: (violation) => set((state) => ({
    violations: [violation, ...state.violations],
  })),
  
  addWeighing: (weighing) => set((state) => ({
    weighings: [weighing, ...state.weighings],
  })),
  
  updateViolationStatus: (id, status, remark) => set((state) => ({
    violations: state.violations.map((v) =>
      v.id === id
        ? {
            ...v,
            status,
            handledAt: status !== 'pending' ? new Date().toISOString() : undefined,
            remark: remark || v.remark,
          }
        : v
    ),
  })),
  
  acknowledgeWarning: (id) => set((state) => ({
    warnings: state.warnings.map((w) =>
      w.id === id ? { ...w, isAcknowledged: true } : w
    ),
  })),
  
  getViolationsByStatus: (status) => {
    const state = get();
    if (!status) return state.violations;
    return state.violations.filter((v) => v.status === status);
  },
  
  getStallById: (id) => {
    const state = get();
    return state.stalls.find((s) => s.id === id);
  },
}));

export const simulateRecognition = (): Promise<RecognitionResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const categories = [
        { id: 'tomato', name: '番茄' },
        { id: 'apple', name: '苹果' },
        { id: 'spinach', name: '菠菜' },
        { id: 'banana', name: '香蕉' },
        { id: 'carrot', name: '胡萝卜' },
        { id: 'cucumber', name: '黄瓜' },
      ];
      const freshnessLevels: RecognitionResult['freshness'][] = ['fresh', 'normal', 'rotten'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomFreshness = freshnessLevels[Math.floor(Math.random() * freshnessLevels.length)];
      const confidence = 0.75 + Math.random() * 0.2;

      resolve({
        category: randomCategory.id,
        categoryName: randomCategory.name,
        freshness: randomFreshness,
        confidence: parseFloat(confidence.toFixed(2)),
      });
    }, 1500);
  });
};

export const simulateWeighingRecognition = (): Promise<{ weight: number; confidence: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseWeight = 0.9 + Math.random() * 0.15;
      const confidence = 0.85 + Math.random() * 0.1;
      resolve({
        weight: parseFloat(baseWeight.toFixed(2)),
        confidence: parseFloat(confidence.toFixed(2)),
      });
    }, 1200);
  });
};
