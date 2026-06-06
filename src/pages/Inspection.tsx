import { useState, useRef } from 'react';
import {
  Camera,
  RefreshCw,
  Check,
  X,
  MapPin,
  Clock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { useInspectionStore, simulateRecognition } from '@/stores/useInspectionStore';
import { useUserStore } from '@/stores/useUserStore';
import type { RecognitionResult, Stall } from '@/types';

export default function Inspection() {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognitionResult, setRecognitionResult] = useState<RecognitionResult | null>(null);
  const [remark, setRemark] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { stalls, addInspection, addViolation } = useInspectionStore();
  const { user } = useUserStore();

  const handleCapture = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      setIsRecognizing(true);
      setRecognitionResult(null);

      const result = await simulateRecognition();
      setRecognitionResult(result);
      setIsRecognizing(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedStall || !recognitionResult || !capturedImage) return;

    const inspectionId = `insp-${Date.now()}`;
    
    addInspection({
      id: inspectionId,
      stallId: selectedStall.id,
      stallName: selectedStall.name,
      inspectorId: user?.id || '',
      inspectorName: user?.name || '',
      inspectionTime: new Date().toLocaleString('zh-CN'),
      imageUrl: capturedImage,
      recognitionResult,
    });

    if (recognitionResult.freshness === 'rotten') {
      addViolation({
        id: `viol-${Date.now()}`,
        inspectionId,
        stallId: selectedStall.id,
        stallName: selectedStall.name,
        violationType: 'rotten',
        status: 'pending',
        createdAt: new Date().toLocaleString('zh-CN'),
        remark,
        imageUrl: capturedImage,
      });
    }

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setCapturedImage(null);
    setRecognitionResult(null);
    setRemark('');
    setIsRecognizing(false);
  };

  const getFreshnessLabel = (freshness: string) => {
    switch (freshness) {
      case 'fresh':
        return '新鲜';
      case 'normal':
        return '一般';
      case 'rotten':
        return '腐烂';
      default:
        return freshness;
    }
  };

  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case 'fresh':
        return 'text-green-600 bg-green-100';
      case 'normal':
        return 'text-yellow-600 bg-yellow-100';
      case 'rotten':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-8 text-center animate-bounce">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">提交成功</h3>
            <p className="text-gray-500 mt-1">巡检记录已保存</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary-600" />
              选择摊位
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {stalls.map((stall) => (
                <button
                  key={stall.id}
                  onClick={() => setSelectedStall(stall)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${selectedStall?.id === stall.id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <p className="font-medium text-gray-900 text-sm">{stall.name}</p>
                  <p className="text-xs text-gray-500">{stall.location}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary-600" />
              拍摄照片
            </h3>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {!capturedImage ? (
              <button
                onClick={handleCapture}
                disabled={!selectedStall}
                className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${selectedStall ? 'border-primary-300 bg-primary-50/50 hover:bg-primary-50 cursor-pointer' : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'}`}
              >
                <Camera className={`w-12 h-12 mb-3 ${selectedStall ? 'text-primary-500' : 'text-gray-400'}`} />
                <p className={`font-medium ${selectedStall ? 'text-primary-600' : 'text-gray-400'}`}>
                  点击拍摄或上传照片
                </p>
                <p className="text-sm text-gray-400 mt-1">请先选择摊位</p>
              </button>
            ) : (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full aspect-video object-cover rounded-xl"
                />
                {isRecognizing && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                      <p className="font-medium">AI识别中...</p>
                    </div>
                  </div>
                )}
                {!isRecognizing && (
                  <button
                    onClick={handleCapture}
                    className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600" />
              识别结果
            </h3>

            {recognitionResult ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">识别品类</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {recognitionResult.categoryName}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">置信度</p>
                    <p className="text-xl font-semibold text-gray-900">
                      {(recognitionResult.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-2">新鲜度检测</p>
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1.5 rounded-lg font-medium ${getFreshnessColor(recognitionResult.freshness)}`}
                    >
                      {getFreshnessLabel(recognitionResult.freshness)}
                    </span>
                    <div className="flex-1 mx-4">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${recognitionResult.freshness === 'fresh' ? 'bg-green-500 w-full' : recognitionResult.freshness === 'normal' ? 'bg-yellow-500 w-1/2' : 'bg-red-500 w-1/4'}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {recognitionResult.freshness === 'rotten' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-700">检测到腐烂变质</p>
                      <p className="text-sm text-red-600">系统将自动记录违规</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                <Clock className="w-12 h-12 mb-3" />
                <p>等待拍摄照片进行识别</p>
              </div>
            )}
          </div>

          {recognitionResult && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">备注信息</h3>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="请输入备注信息（可选）"
                className="input h-24 resize-none"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              取消
            </button>
            <button
              onClick={handleSubmit}
              disabled={!recognitionResult}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              提交记录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
