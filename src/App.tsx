import { useState, useEffect } from 'react';
import { Calculator, Flame, Radiation as RadiatorIcon, PenTool as Tools, Banknote, Settings } from 'lucide-react';

interface WorkType {
  id: string;
  name: string;
  price: number;
}

interface CombiBoiler {
  id: string;
  name: string;
  price: number;
}

interface Radiator {
  id: string;
  name: string;
  pricePerMeter: number;
}

function App() {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedWorkType, setSelectedWorkType] = useState<string>('');
  const [selectedCombi, setSelectedCombi] = useState<string>('');
  const [selectedRadiator, setSelectedRadiator] = useState<string>('');
  const [radiatorMeters, setRadiatorMeters] = useState<number>(0);
  const [hasDemo, setHasDemo] = useState<boolean>(false);
  const [cashPayment, setCashPayment] = useState<boolean>(false);
  const [flexiblePipe, setFlexiblePipe] = useState<boolean>(false);

  const defaultWorkTypes = [
    { id: 'full', name: 'Petekli Full', price: 22000 },
    { id: 'installation', name: 'Petekli Montaj-Gaz', price: 20000 },
    { id: 'line', name: 'Hat Kaydırma', price: 18000 },
    { id: 'combi', name: 'Kombi Montaj-Gaz', price: 15000 },
    { id: 'stove', name: 'Ocak Hattı', price: 13000 }
  ];

  const [workTypes, setWorkTypes] = useState<WorkType[]>(() => {
    const saved = localStorage.getItem('workTypes');
    return saved ? JSON.parse(saved) : defaultWorkTypes;
  });


  const defaultCombiBoilers = [
    { id: 'vaillant286', name: 'Vaillant 286/5-3 24kW', price: 49000 },
    { id: 'vaillant236', name: 'Vaillant 236/5-3 20kW', price: 45000 },
    { id: 'bosch1200i24', name: 'Bosch 1200i 24kW', price: 32000 },
    { id: 'bosch1200i20', name: 'Bosch 1200i 20kW', price: 28000 }
  ];

  const [combiBoilers, setCombiBoilers] = useState<CombiBoiler[]>(() => {
    const saved = localStorage.getItem('combiBoilers');
    return saved ? JSON.parse(saved) : defaultCombiBoilers;
  });


  const defaultRadiators = [
    { id: 'vaillant', name: 'Vaillant', pricePerMeter: 3000 },
    { id: 'eca', name: 'ECA', pricePerMeter: 2800 },
    { id: 'kalde', name: 'Kalde', pricePerMeter: 2500 }
  ];

  const [radiators, setRadiators] = useState<Radiator[]>(() => {
    const saved = localStorage.getItem('radiators');
    return saved ? JSON.parse(saved) : defaultRadiators;
  });


  const [demolitionPrice, setDemolitionPrice] = useState<number>(() => {
    const saved = localStorage.getItem('demolitionPrice');
    return saved ? Number(saved) : 3000;
  });

  const [flexiblePipePrice, setFlexiblePipePrice] = useState<number>(() => {
    const saved = localStorage.getItem('flexiblePipePrice');
    return saved ? Number(saved) : 5000;
  });

  const [cashDiscountPrice, setCashDiscountPrice] = useState<number>(() => {
    const saved = localStorage.getItem('cashDiscountPrice');
    return saved ? Number(saved) : 5000;
  });

  // Fiyat değişikliklerini localStorage'a kaydetme
  useEffect(() => {
    localStorage.setItem('workTypes', JSON.stringify(workTypes));
  }, [workTypes]);

  useEffect(() => {
    localStorage.setItem('combiBoilers', JSON.stringify(combiBoilers));
  }, [combiBoilers]);

  useEffect(() => {
    localStorage.setItem('radiators', JSON.stringify(radiators));
  }, [radiators]);

  useEffect(() => {
    localStorage.setItem('demolitionPrice', demolitionPrice.toString());
  }, [demolitionPrice]);

  useEffect(() => {
    localStorage.setItem('flexiblePipePrice', flexiblePipePrice.toString());
  }, [flexiblePipePrice]);

  useEffect(() => {
    localStorage.setItem('cashDiscountPrice', cashDiscountPrice.toString());
  }, [cashDiscountPrice]);

  const calculateTotal = () => {
    let baseTotal = 0;
    let additionalTotal = 0;

    // Ana hizmetler (KDV dahil edilecek)
    const workType = workTypes.find(w => w.id === selectedWorkType);
    if (workType) baseTotal += workType.price;

    const combi = combiBoilers.find(c => c.id === selectedCombi);
    if (combi) baseTotal += combi.price;

    const radiator = radiators.find(r => r.id === selectedRadiator);
    if (radiator) baseTotal += radiator.pricePerMeter * radiatorMeters;

    // KDV ekleme (%20)
    baseTotal *= 1.2;

    // Ek hizmetler (KDV dahil edilmeyecek)
    if (hasDemo) additionalTotal += demolitionPrice;
    if (flexiblePipe) additionalTotal += flexiblePipePrice;

    let total = baseTotal + additionalTotal;
    
    // Nakit ödeme indirimi
    const cashDiscount = cashPayment ? cashDiscountPrice : 0;

    return {
      baseAmount: Math.round(baseTotal),
      additionalAmount: Math.round(additionalTotal),
      cashDiscount: cashDiscount,
      total: Math.round(total - cashDiscount)
    };
  };

  const updateWorkTypePrice = (id: string, newPrice: number) => {
    setWorkTypes(prev => prev.map(type => 
      type.id === id ? { ...type, price: newPrice } : type
    ));
  };

  const updateCombiPrice = (id: string, newPrice: number) => {
    setCombiBoilers(prev => prev.map(combi => 
      combi.id === id ? { ...combi, price: newPrice } : combi
    ));
  };

  const updateRadiatorPrice = (id: string, newPrice: number) => {
    setRadiators(prev => prev.map(radiator => 
      radiator.id === id ? { ...radiator, pricePerMeter: newPrice } : radiator
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 space-y-8">
          <div className="text-center relative">
            <h1 className="text-3xl font-bold text-gray-900">Doğalgaz Tesisat Maliyet Hesaplayıcı</h1>
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="absolute right-0 top-0 p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Settings className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* İş Türü Seçimi */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                <Flame className="inline-block mr-2 h-5 w-5" />
                İş Türü
              </label>
              <div className={isEditMode ? "space-y-4" : ""}>
                {isEditMode ? (
                  workTypes.map(type => (
                    <div key={type.id} className="flex items-center gap-4">
                      <span className="flex-grow">{type.name}</span>
                      <input
                        type="number"
                        value={type.price}
                        onChange={(e) => updateWorkTypePrice(type.id, Number(e.target.value))}
                        className="w-32 px-2 py-1 border rounded"
                      />
                      <span className="text-gray-500">₺</span>
                    </div>
                  ))
                ) : (
                  <select
                    value={selectedWorkType}
                    onChange={(e) => setSelectedWorkType(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Seçiniz</option>
                    {workTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Kombi Seçimi */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                <Calculator className="inline-block mr-2 h-5 w-5" />
                Kombi Seçimi
              </label>
              <div className={isEditMode ? "space-y-4" : ""}>
                {isEditMode ? (
                  combiBoilers.map(combi => (
                    <div key={combi.id} className="flex items-center gap-4">
                      <span className="flex-grow">{combi.name}</span>
                      <input
                        type="number"
                        value={combi.price}
                        onChange={(e) => updateCombiPrice(combi.id, Number(e.target.value))}
                        className="w-32 px-2 py-1 border rounded"
                      />
                      <span className="text-gray-500">₺</span>
                    </div>
                  ))
                ) : (
                  <select
                    value={selectedCombi}
                    onChange={(e) => setSelectedCombi(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="">Seçiniz</option>
                    {combiBoilers.map((combi) => (
                      <option key={combi.id} value={combi.id}>
                        {combi.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Petek Seçimi */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                <RadiatorIcon className="inline-block mr-2 h-5 w-5" />
                Petek Seçimi
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {isEditMode ? (
                  <div className="col-span-2 space-y-4">
                    {radiators.map(radiator => (
                      <div key={radiator.id} className="flex items-center gap-4">
                        <span className="flex-grow">{radiator.name}</span>
                        <input
                          type="number"
                          value={radiator.pricePerMeter}
                          onChange={(e) => updateRadiatorPrice(radiator.id, Number(e.target.value))}
                          className="w-32 px-2 py-1 border rounded"
                        />
                        <span className="text-gray-500">₺/metre</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <select
                      value={selectedRadiator}
                      onChange={(e) => setSelectedRadiator(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="">Seçiniz</option>
                      {radiators.map((radiator) => (
                        <option key={radiator.id} value={radiator.id}>
                          {radiator.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      value={radiatorMeters}
                      onChange={(e) => setRadiatorMeters(Number(e.target.value))}
                      placeholder="Metre"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Ek Seçenekler */}
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                <Tools className="inline-block mr-2 h-5 w-5" />
                Ek Seçenekler
              </label>
              
              {isEditMode ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="flex-grow">Kırım Ücreti</span>
                    <input
                      type="number"
                      value={demolitionPrice}
                      onChange={(e) => setDemolitionPrice(Number(e.target.value))}
                      className="w-32 px-2 py-1 border rounded"
                    />
                    <span className="text-gray-500">₺</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex-grow">Esnek Tesisat Ücreti</span>
                    <input
                      type="number"
                      value={flexiblePipePrice}
                      onChange={(e) => setFlexiblePipePrice(Number(e.target.value))}
                      className="w-32 px-2 py-1 border rounded"
                    />
                    <span className="text-gray-500">₺</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="flex-grow">Nakit İndirim Tutarı</span>
                    <input
                      type="number"
                      value={cashDiscountPrice}
                      onChange={(e) => setCashDiscountPrice(Number(e.target.value))}
                      className="w-32 px-2 py-1 border rounded"
                    />
                    <span className="text-gray-500">₺</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hasDemo}
                      onChange={(e) => setHasDemo(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Kırım
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={flexiblePipe}
                      onChange={(e) => setFlexiblePipe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Esnek Tesisat
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cashPayment}
                      onChange={(e) => setCashPayment(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Nakit Ödeme
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* Fiyat Detayları */}
            <div className="mt-8 space-y-4">
              {/* Ana Hizmetler */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-gray-900">Ana Hizmetler (KDV Dahil):</span>
                  <span className="text-xl font-semibold text-gray-900">
                    {calculateTotal().baseAmount.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>

              {/* Ek Hizmetler */}
              {(hasDemo || flexiblePipe) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">Ek Hizmetler:</span>
                    <span className="text-xl font-semibold text-gray-900">
                      {calculateTotal().additionalAmount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>
              )}

              {/* Nakit İndirim */}
              {cashPayment && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-green-700">Nakit İndirim:</span>
                    <span className="text-xl font-semibold text-green-700">
                      -{calculateTotal().cashDiscount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>
              )}

              {/* Genel Toplam */}
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-900">
                    <Banknote className="inline-block mr-2 h-6 w-6" />
                    Genel Toplam:
                  </span>
                  <span className="text-3xl font-bold text-blue-700">
                    {calculateTotal().total.toLocaleString('tr-TR')} ₺
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;