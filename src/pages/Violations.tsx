import { useState } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  X,
  MessageSquare,
  Download,
} from 'lucide-react';
import { useInspectionStore } from '@/stores/useInspectionStore';
import type { ViolationRecord, ViolationStatus, ViolationType } from '@/types';

export default function Violations() {
  const { violations, updateViolationStatus } = useInspectionStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ViolationStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ViolationType | 'all'>('all');
  const [selectedViolation, setSelectedViolation] = useState<ViolationRecord | null>(null);
  const [editRemark, setEditRemark] = useState('');
  const [editStatus, setEditStatus] = useState<ViolationStatus>('pending');

  const filteredViolations = violations.filter((v) => {
    const matchesSearch = v.stallName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesType = typeFilter === 'all' || v.violationType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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

  const getViolationTypeColor = (type: string) => {
    switch (type) {
      case 'rotten':
        return 'bg-red-100 text-red-700';
      case 'underweight':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
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

  const handleViewDetail = (violation: ViolationRecord) => {
    setSelectedViolation(violation);
    setEditRemark(violation.remark || '');
    setEditStatus(violation.status);
  };

  const handleSave = () => {
    if (selectedViolation) {
      updateViolationStatus(selectedViolation.id, editStatus, editRemark);
      setSelectedViolation(null);
    }
  };

  return (
    <div className="space-y-6">
      {selectedViolation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">违规详情</h3>
              <button
                onClick={() => setSelectedViolation(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {selectedViolation.imageUrl && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">违规照片</p>
                  <img
                    src={selectedViolation.imageUrl}
                    alt="Violation"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">摊位名称</p>
                  <p className="font-medium text-gray-900">{selectedViolation.stallName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">违规类型</p>
                  <span className={`badge ${getViolationTypeColor(selectedViolation.violationType)}`}>
                    {getViolationTypeLabel(selectedViolation.violationType)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">违规时间</p>
                  <p className="font-medium text-gray-900">{selectedViolation.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">当前状态</p>
                  <span className={`badge ${getStatusBadge(selectedViolation.status)}`}>
                    {getStatusLabel(selectedViolation.status)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">处理状态</p>
                <div className="flex gap-2">
                  {(['pending', 'processing', 'resolved'] as ViolationStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => setEditStatus(status)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${editStatus === status ? getStatusBadge(status) + ' ring-2 ring-offset-2 ring-gray-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {getStatusLabel(status)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">处理备注</p>
                <textarea
                  value={editRemark}
                  onChange={(e) => setEditRemark(e.target.value)}
                  placeholder="请输入处理备注"
                  className="input h-24 resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setSelectedViolation(null)}
                className="flex-1 btn-secondary"
              >
                取消
              </button>
              <button onClick={handleSave} className="flex-1 btn-primary">
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索摊位名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ViolationStatus | 'all')}
              className="input w-36"
            >
              <option value="all">全部状态</option>
              <option value="pending">待处理</option>
              <option value="processing">处理中</option>
              <option value="resolved">已解决</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ViolationType | 'all')}
              className="input w-36"
            >
              <option value="all">全部类型</option>
              <option value="rotten">腐烂变质</option>
              <option value="underweight">缺斤短两</option>
              <option value="other">其他违规</option>
            </select>
            <button className="btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              导出
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {violations.filter((v) => v.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-500">待处理</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {violations.filter((v) => v.status === 'processing').length}
              </p>
              <p className="text-sm text-gray-500">处理中</p>
            </div>
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {violations.filter((v) => v.status === 'resolved').length}
              </p>
              <p className="text-sm text-gray-500">已解决</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">摊位</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">违规类型</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">时间</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">状态</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">备注</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredViolations.map((violation) => (
                <tr key={violation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{violation.stallName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getViolationTypeColor(violation.violationType)}`}>
                      {getViolationTypeLabel(violation.violationType)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{violation.createdAt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${getStatusBadge(violation.status)}`}>
                      {getStatusLabel(violation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {violation.remark || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleViewDetail(violation)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-5 h-5 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredViolations.length === 0 && (
          <div className="py-12 text-center text-gray-500">
            <Filter className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>暂无符合条件的违规记录</p>
          </div>
        )}
      </div>
    </div>
  );
}
