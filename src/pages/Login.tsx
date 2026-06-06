import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf, Eye, EyeOff, Lock, User } from 'lucide-react';
import { useUserStore } from '@/stores/useUserStore';
import { cn } from '@/lib/utils';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useUserStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (login(username, password)) {
      navigate('/dashboard');
    } else {
      setError('用户名或密码错误');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-8">
            <Leaf className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-bold mb-4">鲜市巡检</h1>
          <p className="text-lg text-white/80 text-center max-w-md">
            智能生鲜市场巡检系统，AI识别助力市场管理，保障食品安全，提升监管效率
          </p>
          <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-md">
            <div className="text-center">
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm text-white/60">识别准确率</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">80%</div>
              <div className="text-sm text-white/60">效率提升</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-sm text-white/60">实时监控</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">欢迎回来</h2>
            <p className="text-gray-500 mt-2">请登录您的账户</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="input pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                'w-full btn-primary py-3',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  登录中...
                </span>
              ) : (
                '登 录'
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500 mb-2">演示账号：</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-white rounded-lg text-center">
                <div className="font-medium text-gray-900">admin</div>
                <div className="text-gray-500">管理员</div>
              </div>
              <div className="p-2 bg-white rounded-lg text-center">
                <div className="font-medium text-gray-900">inspector</div>
                <div className="text-gray-500">巡检员</div>
              </div>
              <div className="p-2 bg-white rounded-lg text-center">
                <div className="font-medium text-gray-900">analyst</div>
                <div className="text-gray-500">分析员</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">密码：123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
