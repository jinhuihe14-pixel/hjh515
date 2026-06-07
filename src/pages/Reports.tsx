import { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Download,
  Calendar,
  TrendingUp,
  FileText,
  BarChart3,
  CheckCircle,
  Activity,
} from 'lucide-react';
import { useInspectionStore } from '@/stores/useInspectionStore';

const COLORS = ['#dc2626', '#f97316', '#8b5cf6', '#22c55e', '#06b6d4'];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const inspections = useInspectionStore((s) => s.inspections);
  const violations = useInspectionStore((s) => s.violations);
  const weighings = useInspectionStore((s) => s.weighings);
  const stalls = useInspectionStore((s) => s.stalls);
  const getMonthlyReport = useInspectionStore((s) => s.getMonthlyReport);
  const getViolationTypeDistribution = useInspectionStore(
    (s) => s.getViolationTypeDistribution
  );
  const getComplianceRate = useInspectionStore((s) => s.getComplianceRate);
  const getResolvedRate = useInspectionStore((s) => s.getResolvedRate);
  const getTotalInspections = useInspectionStore((s) => s.getTotalInspections);
  const getTotalViolations = useInspectionStore((s) => s.getTotalViolations);
  const getCategoryLoss = useInspectionStore((s) => s.getCategoryLoss);
  const getStallCompliance = useInspectionStore((s) => s.getStallCompliance);

  const report = useMemo(() => getMonthlyReport(), [
    inspections,
    violations,
    weighings,
    stalls,
    getMonthlyReport,
  ]);

  const violationTypeData = useMemo(() => getViolationTypeDistribution(), [
    violations,
    getViolationTypeDistribution,
  ]);

  const complianceRate = useMemo(
    () => parseFloat(getComplianceRate().toFixed(1)),
    [inspections, violations, weighings, getComplianceRate]
  );

  const resolvedRate = useMemo(
    () => parseFloat(getResolvedRate().toFixed(1)),
    [violations, getResolvedRate]
  );

  const totalInspections = useMemo(() => getTotalInspections(), [
    inspections,
    weighings,
    getTotalInspections,
  ]);

  const totalViolations = useMemo(() => getTotalViolations(), [
    violations,
    getTotalViolations,
  ]);

  const categoryLossData = useMemo(() => getCategoryLoss(), [
    inspections,
    violations,
    getCategoryLoss,
  ]);

  const stallComplianceData = useMemo(() => getStallCompliance(), [
    inspections,
    violations,
    weighings,
    stalls,
    getStallCompliance,
  ]);

  const trendData = useMemo(() => {
    const days = 7;
    const dayData: Record<
      string,
      { date: string; 巡检数: number; 违规数: number }
    > = {};

    const today = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = `${d.getMonth() + 1}/${d.getDate()}`;
      dayData[key] = { date: key, 巡检数: 0, 违规数: 0 };
    }

    const parseDate = (dateStr: string): Date => {
      const cleaned = dateStr.replace(/\//g, '-');
      const d = new Date(cleaned);
      return isNaN(d.getTime()) ? new Date() : d;
    };

    const formatKey = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

    [...inspections.map((i) => i.inspectionTime), ...weighings.map((w) => w.recordTime)].forEach(
      (timeStr) => {
        const d = parseDate(timeStr);
        const key = formatKey(d);
        if (key in dayData) {
          dayData[key].巡检数++;
        }
      }
    );

    violations.forEach((v) => {
      const d = parseDate(v.createdAt);
      const key = formatKey(d);
      if (key in dayData) {
        dayData[key].违规数++;
      }
    });

    return Object.values(dayData);
  }, [inspections, violations, weighings]);

  const categoryLossPieData = categoryLossData.map((item) => ({
    name: item.category,
    value: item.lossCount,
  }));

  const stallComplianceChartData = stallComplianceData.map((item) => ({
    name: item.name,
    合规率: parseFloat(item.complianceRate.toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">数据报表</h2>
          <p className="text-gray-500 text-sm mt-1">{report.month}数据汇总</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="input w-32"
            >
              <option value="week">本周</option>
              <option value="month">本月</option>
              <option value="quarter">本季度</option>
              <option value="year">本年</option>
            </select>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            导出报表
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">总巡检次数</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalInspections}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">违规总数</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalViolations}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">合规率</p>
              <p className="text-2xl font-bold text-gray-900">
                {complianceRate}%
              </p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">违规解决率</p>
              <p className="text-2xl font-bold text-gray-900">
                {resolvedRate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">巡检与违规趋势</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
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
                <Area
                  type="monotone"
                  dataKey="巡检数"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="违规数"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">违规类型分布</h3>
          <div className="h-72 flex items-center">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={violationTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {violationTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 ml-4">
              {violationTypeData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">{item.type}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">摊位合规率排名</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stallComplianceChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                type="number"
                domain={[0, 100]}
                stroke="#9ca3af"
                fontSize={12}
              />
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
                formatter={(value: number) => [`${value}%`, '合规率']}
              />
              <Bar
                dataKey="合规率"
                fill="#22c55e"
                radius={[0, 4, 4, 0]}
                barSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">变质损耗高发品类</h3>
        <div className="overflow-x-auto">
          {categoryLossData.length > 0 ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    排名
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    品类
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    损耗次数
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    占比
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    趋势
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryLossData.map((item, index) => {
                  const total = categoryLossData.reduce(
                    (sum, i) => sum + i.lossCount,
                    0
                  );
                  const percentage = (
                    (item.lossCount / total) *
                    100
                  ).toFixed(1);
                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-50 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                            index < 3
                              ? 'bg-primary-100 text-primary-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {item.lossCount}次
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-500 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {percentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-sm ${
                            index % 2 === 0
                              ? 'text-red-500'
                              : 'text-green-500'
                          }`}
                        >
                          {index % 2 === 0 ? '↑ 上升' : '↓ 下降'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center text-gray-500">
              暂无变质损耗数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
