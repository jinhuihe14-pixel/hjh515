import {
  AlertTriangle,
  TrendingUp,
  Check,
  Bell,
  AlertCircle,
  Store,
  Clock,
} from 'lucide-react';
import { useInspectionStore } from '@/stores/useInspectionStore';
import type { Warning, WarningLevel } from '@/types';

export default function Warnings() {
  const { warnings, acknowledgeWarning } = useInspectionStore();

  const getWarningLevelColor = (level: WarningLevel) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getWarningLevelDot = (level: WarningLevel) => {
    switch (level) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getWarningLevelLabel = (level: WarningLevel) => {
    switch (level) {
      case 'high':
        return '高风险';
      case 'medium':
        return '中风险';
      case 'low':
        return '低风险';
      default:
        return level;
    }
  };

  const getWarningTypeLabel = (type: string) => {
    switch (type) {
      case 'high_violation':
        return '高频违规';
      case 'high_loss':
        return '高损耗';
      default:
        return type;
    }
  };

  const unacknowledged = warnings.filter((w) => !w.isAcknowledged);
  const highRisk = warnings.filter((w) => w.warningLevel === 'high');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{warnings.length}</p>
              <p className="text-sm text-gray-500 mt-1">预警总数</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-red-600">{unacknowledged.length}</p>
              <p className="text-sm text-gray-500 mt-1">待确认</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-orange-600">{highRisk.length}</p>
              <p className="text-sm text-gray-500 mt-1">高风险</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-600">
                {warnings.filter((w) => w.isAcknowledged).length}
              </p>
              <p className="text-sm text-gray-500 mt-1">已确认</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            待确认预警
          </h3>
          <div className="space-y-3">
            {unacknowledged.map((warning) => (
              <WarningCard
                key={warning.id}
                warning={warning}
                onAcknowledge={acknowledgeWarning}
                getWarningLevelColor={getWarningLevelColor}
                getWarningLevelDot={getWarningLevelDot}
                getWarningLevelLabel={getWarningLevelLabel}
                getWarningTypeLabel={getWarningTypeLabel}
              />
            ))}
            {unacknowledged.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <Check className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                <p>暂无待确认预警</p>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            所有预警记录
          </h3>
          <div className="space-y-3 max-h-96 overflow-auto">
            {warnings.map((warning) => (
              <WarningCard
                key={warning.id}
                warning={warning}
                onAcknowledge={acknowledgeWarning}
                getWarningLevelColor={getWarningLevelColor}
                getWarningLevelDot={getWarningLevelDot}
                getWarningLevelLabel={getWarningLevelLabel}
                getWarningTypeLabel={getWarningTypeLabel}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">预警说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="font-medium text-red-700">高风险</span>
            </div>
            <p className="text-sm text-red-600">
              同一摊位7天内违规次数≥5次，需重点关注并约谈摊主
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="font-medium text-orange-700">中风险</span>
            </div>
            <p className="text-sm text-orange-600">
              同一摊位7天内违规次数3-4次，需增加巡检频次
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="font-medium text-yellow-700">低风险</span>
            </div>
            <p className="text-sm text-yellow-600">
              同一摊位7天内违规次数1-2次，正常巡检即可
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface WarningCardProps {
  warning: Warning;
  onAcknowledge: (id: string) => void;
  getWarningLevelColor: (level: WarningLevel) => string;
  getWarningLevelDot: (level: WarningLevel) => string;
  getWarningLevelLabel: (level: WarningLevel) => string;
  getWarningTypeLabel: (type: string) => string;
}

function WarningCard({
  warning,
  onAcknowledge,
  getWarningLevelColor,
  getWarningLevelDot,
  getWarningLevelLabel,
  getWarningTypeLabel,
}: WarningCardProps) {
  return (
    <div
      className={`p-4 rounded-xl border transition-all ${warning.isAcknowledged ? 'bg-gray-50 border-gray-200 opacity-60' : getWarningLevelColor(warning.warningLevel)}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Store className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-gray-900">{warning.stallName}</p>
              <div className={`w-2 h-2 rounded-full ${getWarningLevelDot(warning.warningLevel)}`} />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-white/50 px-2 py-0.5 rounded">
                {getWarningTypeLabel(warning.warningType)}
              </span>
              <span className="text-xs text-gray-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {warning.createdAt}
              </span>
            </div>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-lg ${warning.isAcknowledged ? 'bg-gray-200 text-gray-600' : 'bg-white/50'}`}
        >
          {warning.isAcknowledged ? '已确认' : getWarningLevelLabel(warning.warningLevel)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">违规次数：</span>
          <span className="font-bold text-lg">{warning.violationCount}</span>
          <span className="text-sm">次</span>
        </div>
        {!warning.isAcknowledged && (
          <button
            onClick={() => onAcknowledge(warning.id)}
            className="px-3 py-1.5 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            确认处理
          </button>
        )}
      </div>
    </div>
  );
}
