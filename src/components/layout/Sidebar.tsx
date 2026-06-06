import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Camera,
  Scale,
  FileText,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Leaf,
} from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/dashboard', label: '仪表盘', icon: LayoutDashboard },
  { path: '/inspection', label: '巡检拍照', icon: Camera },
  { path: '/weighing', label: '称重核验', icon: Scale },
  { path: '/violations', label: '违规台账', icon: FileText },
  { path: '/warnings', label: '预警中心', icon: AlertTriangle },
  { path: '/reports', label: '数据报表', icon: BarChart3 },
  { path: '/settings', label: '系统设置', icon: Settings },
];

export default function Sidebar() {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-100 w-64">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-900">鲜市巡检</h1>
            <p className="text-xs text-gray-500">智能巡检系统</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn('sidebar-link', isActive && 'sidebar-link-active')
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-700 font-semibold">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500">
              {user?.role === 'admin'
                ? '管理员'
                : user?.role === 'inspector'
                ? '巡检员'
                : '分析员'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
}
