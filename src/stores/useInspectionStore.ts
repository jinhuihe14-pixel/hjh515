import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  InspectionRecord,
  ViolationRecord,
  WeighingRecord,
  Stall,
  Warning,
  RecognitionResult,
  DashboardStats,
  MonthlyReport,
} from '@/types';
import {
  mockInspections,
  mockViolations,
  mockWeighings,
  mockStalls,
  mockWarnings,
} from '@/mock/data';

const VIOLATION_TYPE_LABELS: Record<string, string> = {
  rotten: '腐烂变质',
  underweight: '缺斤短两',
  other: '其他违规',
};

interface InspectionState {
  inspections: InspectionRecord[];
  violations: ViolationRecord[];
  weighings: WeighingRecord[];
  stalls: Stall[];
  warnings: Warning[];

  addInspection: (inspection: InspectionRecord) => void;
  addViolation: (violation: ViolationRecord) => void;
  addWeighing: (weighing: WeighingRecord) => void;
  updateViolationStatus: (
    id: string,
    status: ViolationRecord['status'],
    remark?: string
  ) => void;
  acknowledgeWarning: (id: string) => void;
  getViolationsByStatus: (
    status?: ViolationRecord['status']
  ) => ViolationRecord[];
  getStallById: (id: string) => Stall | undefined;

  getDashboardStats: () => DashboardStats;
  getMonthlyReport: () => MonthlyReport;
  getComplianceRate: () => number;
  getViolationTypeDistribution: () => { type: string; count: number }[];
  getTopViolationStalls: (limit?: number) => { name: string; count: number }[];
  getInspectionTrend: (days?: number) => { date: string; count: number }[];
  getCategoryLoss: () => { category: string; lossCount: number }[];
  getStallCompliance: () => { name: string; complianceRate: number }[];
  getResolvedRate: () => number;
  getTotalInspections: () => number;
  getTotalViolations: () => number;
  getPendingViolations: () => number;
  getActiveWarnings: () => number;
}

const parseDate = (dateStr: string): Date => {
  const cleaned = dateStr.replace(/\//g, '-');
  const d = new Date(cleaned);
  if (!isNaN(d.getTime())) return d;
  return new Date();
};

const formatDateKey = (date: Date): string => {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${m}/${d}`;
};

export const useInspectionStore = create<InspectionState>()(
  persist(
    (set, get) => ({
      inspections: mockInspections,
      violations: mockViolations,
      weighings: mockWeighings,
      stalls: mockStalls,
      warnings: mockWarnings,

      addInspection: (inspection) =>
        set((state) => ({
          inspections: [inspection, ...state.inspections],
        })),

      addViolation: (violation) =>
        set((state) => ({
          violations: [violation, ...state.violations],
        })),

      addWeighing: (weighing) =>
        set((state) => ({
          weighings: [weighing, ...state.weighings],
        })),

      updateViolationStatus: (id, status, remark) =>
        set((state) => ({
          violations: state.violations.map((v) =>
            v.id === id
              ? {
                  ...v,
                  status,
                  handledAt:
                    status !== 'pending'
                      ? new Date().toLocaleString('zh-CN')
                      : undefined,
                  remark: remark || v.remark,
                }
              : v
          ),
        })),

      acknowledgeWarning: (id) =>
        set((state) => ({
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

      getTotalInspections: () => {
        const state = get();
        return state.inspections.length + state.weighings.length;
      },

      getTotalViolations: () => {
        const state = get();
        return state.violations.length;
      },

      getPendingViolations: () => {
        const state = get();
        return state.violations.filter((v) => v.status === 'pending').length;
      },

      getActiveWarnings: () => {
        const state = get();
        return state.warnings.filter((w) => !w.isAcknowledged).length;
      },

      getComplianceRate: () => {
        const state = get();
        const total = state.inspections.length + state.weighings.length;
        if (total === 0) return 100;
        const unresolvedViolations = state.violations.filter(
          (v) => v.status === 'pending' || v.status === 'processing'
        ).length;
        const compliant = Math.max(0, total - unresolvedViolations);
        return (compliant / total) * 100;
      },

      getViolationTypeDistribution: () => {
        const state = get();
        const counts: Record<string, number> = {
          rotten: 0,
          underweight: 0,
          other: 0,
        };
        state.violations.forEach((v) => {
          counts[v.violationType] = (counts[v.violationType] || 0) + 1;
        });
        return Object.entries(counts).map(([type, count]) => ({
          type: VIOLATION_TYPE_LABELS[type] || type,
          count,
        }));
      },

      getTopViolationStalls: (limit = 5) => {
        const state = get();
        const stallCounts: Record<string, number> = {};
        state.violations.forEach((v) => {
          stallCounts[v.stallName] = (stallCounts[v.stallName] || 0) + 1;
        });
        return Object.entries(stallCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);
      },

      getInspectionTrend: (days = 7) => {
        const state = get();
        const dayCounts: Record<string, number> = {};

        const today = new Date();
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          dayCounts[formatDateKey(d)] = 0;
        }

        const allRecords = [
          ...state.inspections.map((i) => i.inspectionTime),
          ...state.weighings.map((w) => w.recordTime),
        ];

        allRecords.forEach((timeStr) => {
          const d = parseDate(timeStr);
          const key = formatDateKey(d);
          if (key in dayCounts) {
            dayCounts[key]++;
          }
        });

        return Object.entries(dayCounts).map(([date, count]) => ({
          date,
          count,
        }));
      },

      getCategoryLoss: () => {
        const state = get();
        const categoryCounts: Record<string, number> = {};

        state.violations
          .filter((v) => v.violationType === 'rotten')
          .forEach((v) => {
            const inspection = state.inspections.find(
              (i) => i.id === v.inspectionId
            );
            const categoryName =
              inspection?.recognitionResult.categoryName || '其他';
            categoryCounts[categoryName] =
              (categoryCounts[categoryName] || 0) + 1;
          });

        return Object.entries(categoryCounts)
          .map(([category, lossCount]) => ({ category, lossCount }))
          .sort((a, b) => b.lossCount - a.lossCount);
      },

      getStallCompliance: () => {
        const state = get();
        const stallStats: Record<
          string,
          { total: number; violations: number }
        > = {};

        state.stalls.forEach((s) => {
          stallStats[s.name] = { total: 0, violations: 0 };
        });

        state.inspections.forEach((i) => {
          if (stallStats[i.stallName]) {
            stallStats[i.stallName].total++;
          }
        });

        state.weighings.forEach((w) => {
          if (stallStats[w.stallName]) {
            stallStats[w.stallName].total++;
          }
        });

        state.violations
          .filter((v) => v.status === 'pending' || v.status === 'processing')
          .forEach((v) => {
            if (stallStats[v.stallName]) {
              stallStats[v.stallName].violations++;
            }
          });

        return Object.entries(stallStats)
          .map(([name, stats]) => ({
            name,
            complianceRate:
              stats.total === 0
                ? 100
                : (Math.max(0, stats.total - stats.violations) / stats.total) *
                  100,
          }))
          .sort((a, b) => b.complianceRate - a.complianceRate);
      },

      getResolvedRate: () => {
        const state = get();
        const total = state.violations.length;
        if (total === 0) return 100;
        const resolved = state.violations.filter(
          (v) => v.status === 'resolved'
        ).length;
        return (resolved / total) * 100;
      },

      getDashboardStats: (): DashboardStats => {
        const state = get();
        return {
          totalInspections: state.getTotalInspections(),
          totalViolations: state.getTotalViolations(),
          pendingViolations: state.getPendingViolations(),
          activeWarnings: state.getActiveWarnings(),
          inspectionTrend: state.getInspectionTrend(7),
          violationTypeDistribution: state.getViolationTypeDistribution(),
          topViolationStalls: state.getTopViolationStalls(5),
        };
      },

      getMonthlyReport: (): MonthlyReport => {
        const state = get();
        const now = new Date();
        const month = `${now.getFullYear()}年${now.getMonth() + 1}月`;
        return {
          month,
          totalInspections: state.getTotalInspections(),
          totalViolations: state.getTotalViolations(),
          resolvedRate: parseFloat(state.getResolvedRate().toFixed(1)),
          categoryLoss: state.getCategoryLoss(),
          stallCompliance: state.getStallCompliance(),
        };
      },
    }),
    {
      name: 'inspection-storage',
    }
  )
);

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
      const freshnessLevels: RecognitionResult['freshness'][] = [
        'fresh',
        'normal',
        'rotten',
      ];
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      const randomFreshness =
        freshnessLevels[Math.floor(Math.random() * freshnessLevels.length)];
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

export const simulateWeighingRecognition = (): Promise<{
  weight: number;
  confidence: number;
}> => {
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
