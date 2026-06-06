import { useState, useRef } from 'react';
import {
  Camera,
  RefreshCw,
  Check,
  X,
  Scale,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { useInspectionStore, simulateWeighingRecognition } from '@/stores/useInspectionStore';
import { useUserStore } from '@/stores/useUserStore';

export default function Weighing() {
  const [selectedStallId, setSelectedStallId] = useState<string>('');
  const [standardWeight, setStandardWeight] = useState<number>(1);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedWeight, setRecognizedWeight] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { stalls, addWeighing, addViolation } = useInspectionStore();
  const { user } = useUserStore();

  const selectedStall = stalls.find(s => s.id === selectedStallId);
  const errorRate = recognizedWeight !== null
    ? ((recognizedWeight - standardWeight) / standardWeight * 100)
    : null;
  const isViolation = errorRate !== null && errorRate < -5;

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
      setRecognizedWeight(null);
      setConfidence(null);

      const result = await simulateWeighingRecognition();
      setRecognizedWeight(result.weight);
      setConfidence(result.confidence);
      setIsRecognizing(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedStall || recognizedWeight === null) return;

    const weighingId = `weigh-${Date.now()}`;
    
    addWeighing({
      id: weighingId,
      stallId: selectedStall.id,
      stallName: selectedStall.name,
      inspectorId: user?.id || '',
      recognizedWeight,
      standardWeight,
      errorRate: errorRate || 0,
      isViolation,
      recordTime: new Date().toLocaleString('zh-CN'),
      imageUrl: capturedImage || undefined,
    });

    if (isViolation) {
      addViolation({
        id: `viol-${Date.now()}`,
        stallId: selectedStall.id,
        stallName: selectedStall.name,
        violationType: 'underweight',
        status: 'pending',
        createdAt: new Date().toLocaleString('zh-CN'),
        remark: `缺斤短两，误差${errorRate?.toFixed(1)}%`,
        imageUrl: capturedImage || undefined,
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
    setRecognizedWeight(null);
    setConfidence(null);
    setIsRecognizing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">核验完成</h3>
            <p className="text-gray-500 mt-1">称重记录已保存</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">选择摊位</h3>
            <select
              value={selectedStallId}
              onChange={(e) => setSelectedStallId(e.target.value)}
              className="input"
            >
              <option value="">请选择摊位</option>
              {stalls.map((stall) => (
                <option key={stall.id} value={stall.id}>
                  {stall.name} - {stall.location}
                </option>
              ))}
            </select>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">标准重量设置</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-2">标准重量 (kg)</label>
                <input
                  type="number"
                  value={standardWeight}
                  onChange={(e) => setStandardWeight(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0.01"
                  className="input"
                />
              </div>
              <div className="flex gap-1 mt-6">
                {[0.5, 1, 2, 5].map((w) => (
                  <button
                    key={w}
                    onClick={() => setStandardWeight(w)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${standardWeight === w ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {w}kg
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary-600" />
              拍摄秤具画面
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
                disabled={!selectedStallId}
                className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${selectedStallId ? 'border-primary-300 bg-primary-50/50 hover:bg-primary-50 cursor-pointer' : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'}`}
              >
                <Camera className={`w-12 h-12 mb-3 ${selectedStallId ? 'text-primary-500' : 'text-gray-400'}`} />
                <p className={`font-medium ${selectedStallId ? 'text-primary-600' : 'text-gray-400'}`}>
                  拍摄秤具显示画面
                </p>
                <p className="text-sm text-gray-400 mt-1">请确保数字清晰可见</p>
              </button>
            ) : (
              <div className="relative">
                <img
                  src={capturedImage}
                  alt="Scale"
                  className="w-full aspect-video object-cover rounded-xl"
                />
                {isRecognizing && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-3" />
                      <p className="font-medium">OCR识别中...</p>
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
              <Scale className="w-5 h-5 text-primary-600" />
              核验结果
            </h3>

            {recognizedWeight !== null ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-600 mb-1">标准重量</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {standardWeight.toFixed(2)}
                      <span className="text-lg font-normal ml-1">kg</span>
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl">
                    <p className="text-sm text-green-600 mb-1">识别重量</p>
                    <p className="text-2xl font-bold text-green-700">
                      {recognizedWeight.toFixed(2)}
                      <span className="text-lg font-normal ml-1">kg</span>
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${isViolation ? 'bg-red-50 border border-red-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">误差率</p>
                      <p className={`text-3xl font-bold ${isViolation ? 'text-red-600' : errorRate && errorRate < 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        {errorRate && errorRate > 0 ? '+' : ''}{errorRate?.toFixed(1)}%
                      </p>
                    </div>
                    <div className="text-right">
                      {isViolation ? (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-6 h-6" />
                          <span className="font-medium">缺斤短两</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-6 h-6" />
                          <span className="font-medium">重量合规</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden relative">
                      <div className="absolute inset-y-0 left-1/2 w-px bg-gray-400" />
                      <div
                        className={`h-full rounded-full transition-all ${isViolation ? 'bg-red-500' : 'bg-green-500'}`}
                        style={{
                          width: `${Math.min(Math.abs(errorRate || 0) * 5, 50)}%`,
                          marginLeft: errorRate && errorRate < 0 ? 'auto' : '50%',
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>-10%</span>
                      <span>0%</span>
                      <span>+10%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">识别置信度</span>
                    <span className="font-medium text-gray-900">
                      {confidence && (confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                <Clock className="w-12 h-12 mb-3" />
                <p>等待拍摄秤具画面</p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetForm}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              重置
            </button>
            <button
              onClick={handleSubmit}
              disabled={recognizedWeight === null}
              className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              确认提交
            </button>
          </div>

          <div className="card p-4 bg-yellow-50 border-yellow-200">
            <p className="text-sm text-yellow-700">
              <strong>提示：</strong>误差率低于 -5% 时系统将自动标记为缺斤短两违规
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
