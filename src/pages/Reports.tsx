import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
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
  PieChart as PieChartIcon,
  Activity,
} from 'lucide-react';
import { mockMonthlyReport } from '@/mock/data';

const COLORS = ['#22c55e', '#f97316', '#dc2626', '#8b5cf6', '#06b6d4'];

const violationTrendData = [
  { month: '1月', 腐烂变质: 18, 缺斤短两: 8, 其他: 5 },
  { month: '2月', 腐烂变质: 22, 缺斤短两: 6, 其他: 4 },
  { month: '3月', 腐烂变质: 15, 缺斤短两: 10, 其他: 6 },
  { month: '4月', 腐烂变质: 28, 缺斤短两: 12, 其他: 3 },
  { month: '5月', 腐烂变质: 25, 缺斤短两: 9, 其他: 7 },
  { month: '6月', 腐烂变质: 15, 缺斤短两: 5, 其他: 3 },
];

const categoryLossData = mockMonthlyReport.categoryLoss.map((item) => ({
  name: item.category,
  value: item.lossCount,
}));

const stallComplianceData = mockMonthlyReport.stallCompliance.map((item) => ({
  name: item.name,
  合规率: item.complianceRate,
}));

const inspectionTrendData = [
  { date: '6/1', 巡检数: 28, 违规数: 3 },
  { date: '6/2', 巡检数: 32, 违规数: 5 },
  { date: '6/3', 巡检数: 29, 违规数: 2 },
  { date: '6/4', 巡检数: 35, 违规数: 4 },
  { date: '6/5', 巡检数: 32, 违规数: 3 },
  { date: '6/6', 巡检数: 30, 违规数: 2 },
  { date: '6/7', 巡检数: 34, 违规数: 1 },
];

export default function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">数据报表</h2>
          <p className="text-gray-500 text-sm mt-1">{mockMonthlyReport.month}数据汇总</p>
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
              <p className="text-2xl font-bold text-gray-900">{mockMonthlyReport.totalInspections}</p>
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
              <p className="text-2xl font-bold text-gray-900">{mockMonthlyReport.totalViolations}</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">违规解决率</p>
              <p className="text-2xl font-bold text-gray-900">{mockMonthlyReport.resolvedRate}%</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">摊位总数</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 mb-4">巡检与违规趋势</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inspectionTrendData}>
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
                    data={categoryLossData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryLossData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 ml-4">
              {categoryLossData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">月度违规趋势</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={violationTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="腐烂变质" fill="#dc2626" radius={[4, 4, 0, 0]} />
              <Bar dataKey="缺斤短两" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="其他" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">摊位合规率排名</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stallComplianceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" fontSize={12} />
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
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">排名</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">品类</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">损耗次数</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">占比</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">趋势</th>
              </tr>
            </thead>
            <tbody>
              {categoryLossData.map((item, index) => {
                const total = categoryLossData.reduce((sum, i) => sum + i.value, 0);
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${index < 3 ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.value}次</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${index % 2 === 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {index % 2 === 0 ? '↑ 上升' : '↓ 下降'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
