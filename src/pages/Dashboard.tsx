import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import {
  Camera,
  FileText,
  AlertTriangle,
  Clock,
  TrendingUp,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInspectionStore } from '@/stores/useInspectionStore';
import type { ViolationRecord } from '@/types';

const COLORS = ['#dc2626', '#f97316', '#8b5cf6'];

export default function Dashboard() {
  const navigate = useNavigate();

  const inspections = useInspectionStore((s) => s.inspections);
  const violations = useInspectionStore((s) => s.violations);
  const weighings = useInspectionStore((s) => s.weighings);
  const warnings = useInspectionStore((s) => s.warnings);
  const getDashboardStats = useInspectionStore((s) => s.getDashboardStats);
  const getComplianceRate = useInspectionStore((s) => s.getComplianceRate);

  const stats = useMemo(() => {
    const dashboard = getDashboardStats();
    const complianceRate = getComplianceRate();
    return {
      ...dashboard,
      complianceRate: parseFloat(complianceRate.toFixed(1)),
    };
  }, [inspections, violations, weighings, warnings, getDashboardStats, getComplianceRate]);

  const recentViolations: ViolationRecord[] = violations.slice(0, 5);

  const statCards = [
    {
      label: '巡检总数',
      value: stats.totalInspections,
      icon: Camera,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50',
    },
    {
      label: '违规总数',
      value: stats.totalViolations,
      icon: FileText,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      label: '合规率',
      value: `${stats.complianceRate}%`,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      label: '待处理违规',
      value: stats.pendingViolations,
      icon: Clock,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
  ];

  const getViolationTypeLabel = (type: string) => {
    switch (type) {
      case 'rotten':
        return '腐烂变质';
      case 'underweight':
        return '缺斤短两';
      default:
        return '其他违规';
    }
  };

  const getViolationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'badge bg-blue-100 text-blue-700';
      case 'resolved':
        return 'badge bg-green-100 text-green-700';
      default:
        return 'badge';
    }
  };

  const getViolationStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '待处理';
      case 'processing':
        return '处理中';
      case 'resolved':
        return '已解决';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <div key={index} className="card p-5 card-hover">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-green-600 font-medium">实时计算</span>
              <span className="text-gray-400 ml-2">基于真实记录</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">巡检趋势</h3>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option>近7天</option>
              <option>近30天</option>
              <option>近90天</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.inspectionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-6">违规类型分布</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.violationTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {stats.violationTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {stats.violationTypeDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-gray-600">{item.type}</span>
                </div>
                <span className="font-medium text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">高频违规摊位</h3>
            <button
              onClick={() => navigate('/warnings')}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.topViolationStalls}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#9ca3af"
                  fontSize={11}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">最近违规记录</h3>
            <button
              onClick={() => navigate('/violations')}
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              查看全部 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {recentViolations.length > 0 ? (
              recentViolations.map((violation) => (
                <div
                  key={violation.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => navigate('/violations')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                      <AlertTriangle className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {violation.stallName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {getViolationTypeLabel(violation.violationType)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={getViolationStatusBadge(violation.status)}>
                      {getViolationStatusLabel(violation.status)}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {violation.createdAt.split(' ')[0]}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                暂无违规记录
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
