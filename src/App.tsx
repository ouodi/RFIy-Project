import React, { useState, useEffect } from 'react';
import { Search, MapPin, Package, Truck, Plane, CheckCircle2, Clock, AlertTriangle, Home, Wifi } from 'lucide-react';

interface TrackingStep {
  id: string;
  status: string;
  location: string;
  timestamp: string;
  completed: boolean;
  icon: React.ReactNode;
}

interface BagData {
  bagId: string;
  passengerName: string;
  flightNumber: string;
  destination: string;
  rfidTag: string;
  steps: TrackingStep[];
}

interface Airport {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  active: boolean;
}

// Mock data for Saudi airports
const saudiAirports: Airport[] = [
  { id: '1', name: 'مطار الملك خالد الدولي', code: 'RUH', x: 46.7, y: 35, active: true },
  { id: '2', name: 'مطار الملك عبدالعزيز الدولي', code: 'JED', x: 25, y: 45, active: true },
  { id: '3', name: 'مطار الملك فهد الدولي', code: 'DMM', x: 75, y: 42, active: true },
  { id: '4', name: 'مطار الأمير محمد بن عبدالعزيز', code: 'MED', x: 35, y: 55, active: false },
  { id: '5', name: 'مطار أبها الإقليمي', code: 'AHB', x: 30, y: 75, active: true },
  { id: '6', name: 'مطار تبوك الإقليمي', code: 'TUU', x: 40, y: 20, active: false },
  { id: '7', name: 'مطار حائل الإقليمي', code: 'HAS', x: 55, y: 30, active: true },
];

// Mock baggage data in Arabic
const mockBagData: Record<string, BagData> = {
  'SA12345': {
    bagId: 'SA12345',
    passengerName: 'أحمد محمد العلي',
    flightNumber: 'SV 248',
    destination: 'مطار الملك عبدالعزيز الدولي (JED)',
    rfidTag: 'RFID-7A8B9C2D',
    steps: [
      {
        id: '1',
        status: 'تم تسجيل الوصول',
        location: 'مطار الملك خالد الدولي - صالة المغادرة 3',
        timestamp: '2025-01-15 14:30',
        completed: true,
        icon: <CheckCircle2 className="w-5 h-5" />
      },
      {
        id: '2',
        status: 'فحص أمني',
        location: 'نقطة التفتيش الأمني - المحطة 3',
        timestamp: '2025-01-15 14:45',
        completed: true,
        icon: <Package className="w-5 h-5" />
      },
      {
        id: '3',
        status: 'تم الفرز',
        location: 'مرفق فرز الأمتعة - RUH',
        timestamp: '2025-01-15 15:15',
        completed: true,
        icon: <Package className="w-5 h-5" />
      },
      {
        id: '4',
        status: 'تم التحميل على الطائرة',
        location: 'البوابة A12',
        timestamp: '2025-01-15 16:20',
        completed: true,
        icon: <Plane className="w-5 h-5" />
      },
      {
        id: '5',
        status: 'في الطريق',
        location: 'الرحلة SV 248',
        timestamp: '2025-01-15 17:00',
        completed: true,
        icon: <Plane className="w-5 h-5" />
      },
      {
        id: '6',
        status: 'وصل إلى الوجهة',
        location: 'مطار الملك عبدالعزيز الدولي - صالة الوصول',
        timestamp: '2025-01-15 18:30',
        completed: false,
        icon: <MapPin className="w-5 h-5" />
      },
      {
        id: '7',
        status: 'جاهز للاستلام',
        location: 'حزام الأمتعة رقم 5',
        timestamp: 'في الانتظار',
        completed: false,
        icon: <CheckCircle2 className="w-5 h-5" />
      }
    ]
  },
  'SA67890': {
    bagId: 'SA67890',
    passengerName: 'فاطمة سعد الغامدي',
    flightNumber: 'SV 156',
    destination: 'مطار الملك فهد الدولي (DMM)',
    rfidTag: 'RFID-3E4F5G6H',
    steps: [
      {
        id: '1',
        status: 'تم تسجيل الوصول',
        location: 'مطار الملك عبدالعزيز الدولي - صالة المغادرة 1',
        timestamp: '2025-01-15 09:15',
        completed: true,
        icon: <CheckCircle2 className="w-5 h-5" />
      },
      {
        id: '2',
        status: 'فحص أمني',
        location: 'نقطة التفتيش الأمني - المحطة 1',
        timestamp: '2025-01-15 09:30',
        completed: true,
        icon: <Package className="w-5 h-5" />
      },
      {
        id: '3',
        status: 'تم الفرز',
        location: 'مرفق فرز الأمتعة - JED',
        timestamp: '2025-01-15 10:00',
        completed: true,
        icon: <Package className="w-5 h-5" />
      },
      {
        id: '4',
        status: 'قيد التحميل',
        location: 'البوابة B7',
        timestamp: 'قيد التنفيذ',
        completed: false,
        icon: <Clock className="w-5 h-5" />
      },
      {
        id: '5',
        status: 'في الطريق',
        location: 'الرحلة SV 156',
        timestamp: 'في الانتظار',
        completed: false,
        icon: <Plane className="w-5 h-5" />
      },
      {
        id: '6',
        status: 'وصل إلى الوجهة',
        location: 'مطار الملك فهد الدولي - صالة الوصول',
        timestamp: 'في الانتظار',
        completed: false,
        icon: <MapPin className="w-5 h-5" />
      },
      {
        id: '7',
        status: 'جاهز للاستلام',
        location: 'حزام الأمتعة - سيتم تحديده',
        timestamp: 'في الانتظار',
        completed: false,
        icon: <CheckCircle2 className="w-5 h-5" />
      }
    ]
  }
};

function App() {
  const [bagId, setBagId] = useState('');
  const [currentView, setCurrentView] = useState<'home' | 'tracking' | 'error'>('home');
  const [bagData, setBagData] = useState<BagData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackBag = async () => {
    if (!bagId.trim()) return;
    
    setIsLoading(true);
    
    // Simulate RFID scanning delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const data = mockBagData[bagId.toUpperCase()];
    
    if (data) {
      setBagData(data);
      setCurrentView('tracking');
    } else {
      setCurrentView('error');
    }
    
    setIsLoading(false);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setBagId('');
    setBagData(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrackBag();
    }
  };

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Saudi Arabia Map Background */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Simplified Saudi Arabia outline */}
            <path
              d="M15,35 L25,25 L35,20 L45,18 L55,20 L65,22 L75,25 L85,30 L88,35 L90,45 L88,55 L85,65 L80,70 L75,75 L70,78 L60,80 L50,82 L40,80 L30,78 L25,75 L20,70 L15,65 L12,55 L10,45 L12,40 Z"
              fill="currentColor"
              className="text-primary"
            />
            
            {/* Airport dots with pulsing animation */}
            {saudiAirports.map((airport) => (
              <g key={airport.id}>
                <circle
                  cx={airport.x}
                  cy={airport.y}
                  r="1.5"
                  fill="#437066"
                  className={airport.active ? 'pulse-dot' : ''}
                />
                {airport.active && (
                  <circle
                    cx={airport.x}
                    cy={airport.y}
                    r="3"
                    fill="none"
                    stroke="#437066"
                    strokeWidth="0.3"
                    opacity="0.5"
                    className="pulse-dot"
                  />
                )}
              </g>
            ))}
            
            {/* Animated connection lines between active airports */}
            <g stroke="#437066" strokeWidth="0.2" opacity="0.3">
              <line x1="46.7" y1="35" x2="25" y2="45" className="animate-pulse" />
              <line x1="25" y1="45" x2="75" y2="42" className="animate-pulse" />
              <line x1="46.7" y1="35" x2="55" y2="30" className="animate-pulse" />
            </g>
          </svg>
        </div>

        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100 relative z-10">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-center space-x-3 space-x-reverse">
              <div className="bg-primary p-3 rounded-2xl shadow-lg">
                <Wifi className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">تتبع الأمتعة</h1>
                <p className="text-sm text-primary font-medium">تقنية RFID - المملكة العربية السعودية</p>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-5xl mx-auto px-4 py-16 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              تتبع أمتعتك
              <span className="text-primary block">بتقنية RFID</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              تابع موقع وحالة أمتعتك المسجلة في الوقت الفعلي عبر شبكة المطارات السعودية
              باستخدام أحدث تقنيات RFID
            </p>
          </div>

          {/* Search Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl mx-auto border border-white/20">
            <div className="space-y-6">
              <div>
                <label htmlFor="bagId" className="block text-sm font-medium text-gray-700 mb-3 text-right">
                  رقم الحقيبة / رقم RFID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="bagId"
                    value={bagId}
                    onChange={(e) => setBagId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="أدخل رقم الحقيبة (مثال: SA12345)"
                    className="w-full px-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 pr-12 text-right"
                    disabled={isLoading}
                    dir="ltr"
                  />
                  <Wifi className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
                </div>
              </div>
              
              <button
                onClick={handleTrackBag}
                disabled={!bagId.trim() || isLoading}
                className="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 text-lg flex items-center justify-center space-x-2 space-x-reverse shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>جاري البحث...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>تتبع الحقيبة</span>
                  </>
                )}
              </button>
            </div>

            {/* Sample IDs */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3 text-right">جرب هذه الأرقام التجريبية:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {Object.keys(mockBagData).map((id) => (
                  <button
                    key={id}
                    onClick={() => setBagId(id)}
                    className="px-4 py-2 bg-gray-100 hover:bg-primary hover:text-white text-gray-700 text-sm rounded-xl transition-all duration-200 font-medium"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Airports Info */}
          <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {saudiAirports.filter(airport => airport.active).slice(0, 3).map((airport) => (
              <div key={airport.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 float-animation">
                <div className="w-3 h-3 bg-primary rounded-full mx-auto mb-2 pulse-dot"></div>
                <h3 className="font-semibold text-gray-900 text-sm">{airport.name}</h3>
                <p className="text-xs text-gray-600">{airport.code}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-red-100">
          <div className="bg-red-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">لم يتم العثور على الحقيبة</h2>
          <p className="text-gray-600 mb-6 leading-relaxed text-right">
            لم نتمكن من العثور على أي معلومات للحقيبة برقم "{bagId}". 
            يرجى التحقق من رقم الحقيبة والمحاولة مرة أخرى.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={handleBackToHome}
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-2xl transition-colors duration-200 flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Home className="w-5 h-5" />
              <span>المحاولة مرة أخرى</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'tracking' && bagData) {
    const completedSteps = bagData.steps.filter(step => step.completed).length;
    const progressPercent = (completedSteps / bagData.steps.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToHome}
                className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">بحث جديد</span>
              </button>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 text-right">تتبع الحقيبة</h1>
                  <p className="text-sm text-gray-500 text-right">{bagData.bagId}</p>
                </div>
                <div className="bg-primary p-2 rounded-xl">
                  <Wifi className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Bag Info Card */}
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-100">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-right">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">المسافر</h3>
                <p className="text-lg font-semibold text-gray-900">{bagData.passengerName}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">رقم الرحلة</h3>
                <p className="text-lg font-semibold text-gray-900">{bagData.flightNumber}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">الوجهة</h3>
                <p className="text-lg font-semibold text-gray-900">{bagData.destination}</p>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">رقم RFID</h3>
                <p className="text-lg font-semibold text-primary font-mono">{bagData.rfidTag}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">{completedSteps} من {bagData.steps.length} خطوات مكتملة</span>
                <span className="text-sm font-medium text-gray-700">التقدم</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-right">مسار التتبع</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute right-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              
              {bagData.steps.map((step, index) => (
                <div key={step.id} className="relative flex items-start mb-8 last:mb-0 flex-row-reverse">
                  {/* Timeline dot */}
                  <div className={`
                    flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center relative z-10 transition-all duration-300
                    ${step.completed 
                      ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                      : index === completedSteps 
                        ? 'bg-yellow-400 text-white shadow-lg shadow-yellow-400/25 animate-pulse' 
                        : 'bg-gray-200 text-gray-400'
                    }
                  `}>
                    {step.icon}
                  </div>
                  
                  {/* Timeline content */}
                  <div className="mr-6 flex-1">
                    <div className={`
                      bg-white border-2 rounded-2xl p-4 transition-all duration-300
                      ${step.completed 
                        ? 'border-primary/20 shadow-sm' 
                        : index === completedSteps 
                          ? 'border-yellow-200 bg-yellow-50 shadow-sm' 
                          : 'border-gray-200'
                      }
                    `}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 text-right">
                        <span className={`
                          text-sm font-medium mt-1 sm:mt-0
                          ${step.completed 
                            ? 'text-primary' 
                            : index === completedSteps 
                              ? 'text-yellow-600' 
                              : 'text-gray-400'
                          }
                        `}>
                          {step.timestamp}
                        </span>
                        <h3 className={`
                          font-semibold text-lg
                          ${step.completed 
                            ? 'text-gray-900' 
                            : index === completedSteps 
                              ? 'text-yellow-800' 
                              : 'text-gray-500'
                          }
                        `}>
                          {step.status}
                        </h3>
                      </div>
                      <p className={`
                        text-sm flex items-center space-x-2 space-x-reverse justify-end
                        ${step.completed 
                          ? 'text-gray-600' 
                          : index === completedSteps 
                            ? 'text-yellow-700' 
                            : 'text-gray-400'
                        }
                      `}>
                        <span>{step.location}</span>
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}

export default App;