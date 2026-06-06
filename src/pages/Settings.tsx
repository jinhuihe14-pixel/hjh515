import { useState } from 'react';
import {
  Store,
  Users,
  Bell,
  Shield,
  Palette,
  Save,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import { useInspectionStore } from '@/stores/useInspectionStore';
import type { Stall } from '@/types';

const tabs = [
  { id: 'stalls', label: '摊位管理', icon: Store },
  { id: 'users', label: '用户管理', icon: Users },
  { id: 'notifications', label: '通知设置', icon: Bell },
  { id: 'security', label: '安全设置', icon: Shield },
  { id: 'appearance', label: '外观设置', icon: Palette },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('stalls');
  const { stalls } = useInspectionStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStall, setEditingStall] = useState<Stall | null>(null);
  const [newStall, setNewStall] = useState({
    name: '',
    location: '',
    ownerName: '',
    phone: '',
    category: '蔬菜',
  });

  const handleSaveStall = () => {
    setShowAddModal(false);
    setNewStall({ name: '', location: '', ownerName: '', phone: '', category: '蔬菜' });
  };

  return (
    <div className="flex gap-6">
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl w-full max-w-md mx-4">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingStall ? '编辑摊位' : '添加摊位'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStall(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">摊位名称</label>
                <input
                  type="text"
                  value={editingStall?.name || newStall.name}
                  onChange={(e) =>
                    editingStall
                      ? setEditingStall({ ...editingStall, name: e.target.value })
                      : setNewStall({ ...newStall, name: e.target.value })
                  }
                  className="input"
                  placeholder="如：A01-新鲜果蔬"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
                <input
                  type="text"
                  value={editingStall?.location || newStall.location}
                  onChange={(e) =>
                    editingStall
                      ? setEditingStall({ ...editingStall, location: e.target.value })
                      : setNewStall({ ...newStall, location: e.target.value })
                  }
                  className="input"
                  placeholder="如：A区01号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">经营品类</label>
                <select
                  value={editingStall?.category || newStall.category}
                  onChange={(e) =>
                    editingStall
                      ? setEditingStall({ ...editingStall, category: e.target.value })
                      : setNewStall({ ...newStall, category: e.target.value })
                  }
                  className="input"
                >
                  <option value="蔬菜">蔬菜</option>
                  <option value="水果">水果</option>
                  <option value="综合">综合</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">摊主姓名</label>
                <input
                  type="text"
                  value={editingStall?.ownerName || newStall.ownerName}
                  onChange={(e) =>
                    editingStall
                      ? setEditingStall({ ...editingStall, ownerName: e.target.value })
                      : setNewStall({ ...newStall, ownerName: e.target.value })
                  }
                  className="input"
                  placeholder="摊主姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                <input
                  type="tel"
                  value={editingStall?.phone || newStall.phone}
                  onChange={(e) =>
                    editingStall
                      ? setEditingStall({ ...editingStall, phone: e.target.value })
                      : setNewStall({ ...newStall, phone: e.target.value })
                  }
                  className="input"
                  placeholder="联系电话"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingStall(null);
                }}
                className="flex-1 btn-secondary"
              >
                取消
              </button>
              <button onClick={handleSaveStall} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-56 shrink-0">
        <div className="card p-2 sticky top-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        {activeTab === 'stalls' && (
          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">摊位列表</h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn-primary flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  添加摊位
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">摊位名称</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">位置</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">品类</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">摊主</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">联系电话</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stalls.map((stall) => (
                      <tr key={stall.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{stall.name}</p>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{stall.location}</td>
                        <td className="py-4 px-4">
                          <span className="badge bg-primary-100 text-primary-700">
                            {stall.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{stall.ownerName}</td>
                        <td className="py-4 px-4 text-gray-600">{stall.phone}</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => {
                              setEditingStall(stall);
                              setShowAddModal(true);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg inline-block"
                          >
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg inline-block">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-6">通知设置</h3>
              <div className="space-y-4">
                <NotificationToggle label="违规预警通知" defaultChecked />
                <NotificationToggle label="每日巡检提醒" defaultChecked />
                <NotificationToggle label="月度报表推送" defaultChecked />
                <NotificationToggle label="系统更新通知" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-6">用户管理</h3>
            <div className="space-y-3">
              {[
                { name: '张管理', role: '管理员', username: 'admin' },
                { name: '李巡检', role: '巡检员', username: 'inspector' },
                { name: '王分析', role: '分析员', username: 'analyst' },
              ].map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-700 font-semibold">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </div>
                  <span className="badge bg-primary-100 text-primary-700">{user.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'security' || activeTab === 'appearance') && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">功能开发中</h3>
            <p className="text-gray-500 text-sm">该功能正在开发中，敬请期待</p>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationToggle({ label, defaultChecked = false }: { label: string; defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-700">{label}</span>
      <button
        onClick={() => setChecked(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-primary-500' : 'bg-gray-200'}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-0.5'}`}
        />
      </button>
    </div>
  );
}
