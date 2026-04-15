import { useState, useMemo } from "react";
import Icon from "@/components/ui/icon";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const PRODUCTS = [
  // Бюджетные процессоры
  {
    id: 13,
    name: "Ryzen 5 5600",
    category: "Процессоры",
    brand: "AMD",
    price: 8500,
    year: 2021,
    specs: { cores: 6, threads: 12, base: "3.5 ГГц", boost: "4.4 ГГц", tdp: 65, socket: "AM4" },
    tag: "Бюджет",
  },
  {
    id: 14,
    name: "Core i3-13100F",
    category: "Процессоры",
    brand: "Intel",
    price: 7200,
    year: 2022,
    specs: { cores: 4, threads: 8, base: "3.4 ГГц", boost: "4.5 ГГц", tdp: 58, socket: "LGA1700" },
    tag: "Бюджет",
  },
  // Бюджетные видеокарты
  {
    id: 15,
    name: "RX 6600",
    category: "Видеокарты",
    brand: "AMD",
    price: 16500,
    year: 2021,
    specs: { gpu: "Navi 23", vram: "8 ГБ", memType: "GDDR6", bus: "128 бит", tdp: 132 },
    tag: "Бюджет",
    priceHistory: [
      { month: "Янв", price: 20000 },
      { month: "Мар", price: 19000 },
      { month: "Май", price: 18000 },
      { month: "Июл", price: 17500 },
      { month: "Сен", price: 17000 },
      { month: "Ноя", price: 16500 },
    ],
  },
  {
    id: 16,
    name: "GTX 1660 Super",
    category: "Видеокарты",
    brand: "NVIDIA",
    price: 14000,
    year: 2019,
    specs: { gpu: "TU116", vram: "6 ГБ", memType: "GDDR6", bus: "192 бит", tdp: 125 },
    tag: "Бюджет",
    priceHistory: [
      { month: "Янв", price: 17000 },
      { month: "Мар", price: 16000 },
      { month: "Май", price: 15500 },
      { month: "Июл", price: 15000 },
      { month: "Сен", price: 14500 },
      { month: "Ноя", price: 14000 },
    ],
  },
  // Бюджетная оперативная память
  {
    id: 17,
    name: "Kingston Fury 16GB DDR4",
    category: "Оперативная память",
    brand: "Kingston",
    price: 3200,
    year: 2021,
    specs: { capacity: "16 ГБ", speed: "3200 МГц", type: "DDR4", latency: "CL16" },
    tag: "Бюджет",
  },
  {
    id: 18,
    name: "Crucial 16GB DDR4",
    category: "Оперативная память",
    brand: "Crucial",
    price: 2800,
    year: 2020,
    specs: { capacity: "16 ГБ", speed: "3200 МГц", type: "DDR4", latency: "CL22" },
    tag: "Бюджет",
  },
  // Бюджетные накопители
  {
    id: 19,
    name: "Kingston NV2 1TB",
    category: "Накопители",
    brand: "Kingston",
    price: 4500,
    year: 2022,
    specs: { capacity: "1 ТБ", read: "3500 МБ/с", write: "2100 МБ/с", interface: "NVMe PCIe 3.0" },
    tag: "Бюджет",
  },
  {
    id: 20,
    name: "Netac N535S 480GB",
    category: "Накопители",
    brand: "Netac",
    price: 2200,
    year: 2022,
    specs: { capacity: "480 ГБ", read: "560 МБ/с", write: "520 МБ/с", interface: "SATA III" },
    tag: "Бюджет",
  },
  // Бюджетные блоки питания
  {
    id: 21,
    name: "Deepcool PQ650M",
    category: "Блоки питания",
    brand: "Deepcool",
    price: 6800,
    year: 2022,
    specs: { power: "650 Вт", cert: "80+ Gold", modular: "Полумодульный", fan: "120 мм" },
    tag: "Бюджет",
  },
  {
    id: 22,
    name: "Chieftec GPE-600S",
    category: "Блоки питания",
    brand: "Chieftec",
    price: 3900,
    year: 2021,
    specs: { power: "600 Вт", cert: "80+ Bronze", modular: "Немодульный", fan: "120 мм" },
    tag: "Бюджет",
  },
  // Остальные комплектующие
  {
    id: 1,
    name: "Ryzen 5 7600X",
    category: "Процессоры",
    brand: "AMD",
    price: 18900,
    year: 2022,
    specs: { cores: 6, threads: 12, base: "4.7 ГГц", boost: "5.3 ГГц", tdp: 105, socket: "AM5" },
    tag: "Хит",
  },
  {
    id: 2,
    name: "Core i5-14600K",
    category: "Процессоры",
    brand: "Intel",
    price: 21500,
    year: 2023,
    specs: { cores: 14, threads: 20, base: "3.5 ГГц", boost: "5.3 ГГц", tdp: 125, socket: "LGA1700" },
    tag: null,
  },
  {
    id: 3,
    name: "Ryzen 9 7950X",
    category: "Процессоры",
    brand: "AMD",
    price: 54900,
    year: 2022,
    specs: { cores: 16, threads: 32, base: "4.5 ГГц", boost: "5.7 ГГц", tdp: 170, socket: "AM5" },
    tag: "Топ",
  },
  {
    id: 4,
    name: "Core i9-14900K",
    category: "Процессоры",
    brand: "Intel",
    price: 58000,
    year: 2023,
    specs: { cores: 24, threads: 32, base: "3.2 ГГц", boost: "6.0 ГГц", tdp: 253, socket: "LGA1700" },
    tag: null,
  },
  {
    id: 5,
    name: "RTX 4070 Super",
    category: "Видеокарты",
    brand: "NVIDIA",
    price: 62000,
    year: 2024,
    specs: { gpu: "AD104", vram: "12 ГБ", memType: "GDDR6X", bus: "192 бит", tdp: 220 },
    tag: "Хит",
    priceHistory: [
      { month: "Янв", price: 72000 },
      { month: "Мар", price: 68000 },
      { month: "Май", price: 65000 },
      { month: "Июл", price: 63000 },
      { month: "Сен", price: 62000 },
      { month: "Ноя", price: 62000 },
    ],
  },
  {
    id: 6,
    name: "RX 7800 XT",
    category: "Видеокарты",
    brand: "AMD",
    price: 48500,
    year: 2023,
    specs: { gpu: "Navi 32", vram: "16 ГБ", memType: "GDDR6", bus: "256 бит", tdp: 263 },
    tag: null,
    priceHistory: [
      { month: "Янв", price: 55000 },
      { month: "Мар", price: 53000 },
      { month: "Май", price: 51000 },
      { month: "Июл", price: 49500 },
      { month: "Сен", price: 49000 },
      { month: "Ноя", price: 48500 },
    ],
  },
  {
    id: 7,
    name: "RTX 4060",
    category: "Видеокарты",
    brand: "NVIDIA",
    price: 33000,
    year: 2023,
    specs: { gpu: "AD107", vram: "8 ГБ", memType: "GDDR6", bus: "128 бит", tdp: 115 },
    tag: "Выгодно",
    priceHistory: [
      { month: "Янв", price: 38000 },
      { month: "Мар", price: 36000 },
      { month: "Май", price: 35000 },
      { month: "Июл", price: 34000 },
      { month: "Сен", price: 33500 },
      { month: "Ноя", price: 33000 },
    ],
  },
  {
    id: 8,
    name: "Kingston Fury 32GB DDR5",
    category: "Оперативная память",
    brand: "Kingston",
    price: 8900,
    year: 2022,
    specs: { capacity: "32 ГБ", speed: "6000 МГц", type: "DDR5", latency: "CL36" },
    tag: null,
  },
  {
    id: 9,
    name: "G.Skill Trident 64GB DDR5",
    category: "Оперативная память",
    brand: "G.Skill",
    price: 19800,
    year: 2023,
    specs: { capacity: "64 ГБ", speed: "6400 МГц", type: "DDR5", latency: "CL32" },
    tag: "Топ",
  },
  {
    id: 10,
    name: "Samsung 990 Pro 2TB",
    category: "Накопители",
    brand: "Samsung",
    price: 16500,
    year: 2023,
    specs: { capacity: "2 ТБ", read: "7450 МБ/с", write: "6900 МБ/с", interface: "NVMe PCIe 4.0" },
    tag: null,
  },
  {
    id: 11,
    name: "WD Black SN850X 1TB",
    category: "Накопители",
    brand: "WD",
    price: 9200,
    year: 2023,
    specs: { capacity: "1 ТБ", read: "7300 МБ/с", write: "6300 МБ/с", interface: "NVMe PCIe 4.0" },
    tag: "Хит",
  },
  {
    id: 12,
    name: "be quiet! Dark Power 13 1000W",
    category: "Блоки питания",
    brand: "be quiet!",
    price: 28000,
    year: 2022,
    specs: { power: "1000 Вт", cert: "80+ Titanium", modular: "Полностью модульный", fan: "135 мм" },
    tag: null,
  },
];

const CATEGORIES = ["Все", "Процессоры", "Видеокарты", "Оперативная память", "Накопители", "Блоки питания"];
const BRANDS = ["AMD", "Intel", "NVIDIA", "Kingston", "G.Skill", "Samsung", "WD", "be quiet!", "Crucial", "Netac", "Deepcool", "Chieftec"];
const MAX_PRICE = 65000;

type Tab = "catalog" | "search" | "compare";

const formatPrice = (p: number) => p.toLocaleString("ru-RU") + " ₽";

const SPEC_LABELS: Record<string, string> = {
  cores: "Ядра",
  threads: "Потоки",
  base: "Тактовая частота",
  boost: "Буст частота",
  tdp: "TDP (Вт)",
  socket: "Сокет",
  gpu: "Графический процессор",
  vram: "Видеопамять",
  memType: "Тип памяти",
  bus: "Шина памяти",
  api: "API",
  capacity: "Объём",
  speed: "Скорость",
  type: "Тип",
  latency: "Тайминги",
  read: "Скорость чтения",
  write: "Скорость записи",
  interface: "Интерфейс",
  power: "Мощность",
  cert: "Сертификат",
  modular: "Модульность",
  fan: "Вентилятор",
};

function specLabel(key: string) {
  return SPEC_LABELS[key] ?? key;
}

export default function Index() {
  const [tab, setTab] = useState<Tab>("catalog");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleBrand = (b: string) =>
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const toggleCompare = (id: number) =>
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 4
        ? [...prev, id]
        : prev
    );

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = category === "Все" || p.category === category;
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchSearch =
        search === "" ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchBrand && matchPrice && matchSearch;
    });
  }, [category, selectedBrands, priceRange, search]);

  const compareItems = PRODUCTS.filter((p) => compareIds.includes(p.id));

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((s) => !s)}
              className="p-1.5 rounded hover:bg-muted transition-colors"
            >
              <Icon name="PanelLeft" size={18} />
            </button>
            <span className="font-bold tracking-tight text-sm text-foreground">
              ПК для всех
            </span>
          </div>

          <nav className="flex items-center gap-1">
            {(["catalog", "search", "compare"] as Tab[]).map((t) => {
              const labels = { catalog: "Каталог", search: "Поиск", compare: "Сравнение" };
              const icons = { catalog: "LayoutGrid", search: "Search", compare: "GitCompare" };
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-all ${
                    tab === t
                      ? "bg-foreground text-background font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon name={icons[t]} size={14} />
                  {labels[t]}
                  {t === "compare" && compareIds.length > 0 && (
                    <span
                      className="ml-0.5 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "hsl(16 90% 55%)" }}
                    >
                      {compareIds.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-6 py-6 flex gap-6">
        {/* Sidebar */}
        {sidebarOpen && tab !== "compare" && (
          <aside className="w-56 shrink-0 animate-fade-in">
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">
                  Категория
                </p>
                <div className="space-y-0.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`w-full text-left px-3 py-1.5 rounded text-sm transition-all ${
                        category === c
                          ? "bg-foreground text-background font-medium"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3 font-medium">
                  Цена
                </p>
                <Slider
                  min={0}
                  max={MAX_PRICE}
                  step={500}
                  value={priceRange}
                  onValueChange={(v) => setPriceRange(v as [number, number])}
                  className="mb-2"
                />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>

              {/* Brands */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">
                  Производитель
                </p>
                <div className="space-y-1.5">
                  {BRANDS.map((b) => (
                    <label key={b} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        onClick={() => toggleBrand(b)}
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                          selectedBrands.includes(b)
                            ? "bg-foreground border-foreground"
                            : "border-border group-hover:border-foreground"
                        }`}
                      >
                        {selectedBrands.includes(b) && (
                          <Icon name="Check" size={10} className="text-background" />
                        )}
                      </div>
                      <span onClick={() => toggleBrand(b)} className="text-sm text-foreground">
                        {b}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {(selectedBrands.length > 0 || category !== "Все" || priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
                <button
                  onClick={() => {
                    setSelectedBrands([]);
                    setCategory("Все");
                    setPriceRange([0, MAX_PRICE]);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                >
                  <Icon name="X" size={12} />
                  Сбросить фильтры
                </button>
              )}
            </div>
          </aside>
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          {tab === "catalog" && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-base font-semibold">
                  {category === "Все" ? "Все товары" : category}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {filtered.length} позиций
                  </span>
                </h1>
              </div>
              <ProductGrid products={filtered} compareIds={compareIds} onCompare={toggleCompare} />
            </div>
          )}

          {tab === "search" && (
            <div className="animate-slide-up">
              <div className="relative mb-6">
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Название, производитель, категория..."
                  className="w-full pl-11 pr-10 py-3 bg-card border border-border rounded-lg text-sm outline-none focus:border-foreground transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>
              {search === "" ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Icon name="Search" size={36} className="mx-auto mb-3 opacity-25" />
                  <p className="text-sm">Введите запрос для поиска</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Icon name="PackageSearch" size={36} className="mx-auto mb-3 opacity-25" />
                  <p className="text-sm">Ничего не найдено по запросу «{search}»</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">Найдено: {filtered.length}</p>
                  <ProductGrid products={filtered} compareIds={compareIds} onCompare={toggleCompare} />
                </div>
              )}
            </div>
          )}

          {tab === "compare" && (
            <div className="animate-slide-up">
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-base font-semibold">Сравнение</h1>
                {compareIds.length > 0 && (
                  <button
                    onClick={() => setCompareIds([])}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    <Icon name="Trash2" size={12} />
                    Очистить
                  </button>
                )}
              </div>
              {compareItems.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <Icon name="GitCompare" size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm mb-1">Нет товаров для сравнения</p>
                  <p className="text-xs">Добавьте до 4 товаров из каталога</p>
                </div>
              ) : (
                <CompareTable items={compareItems} onRemove={toggleCompare} />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function ProductGrid({
  products,
  compareIds,
  onCompare,
}: {
  products: typeof PRODUCTS;
  compareIds: number[];
  onCompare: (id: number) => void;
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <Icon name="PackageX" size={36} className="mx-auto mb-3 opacity-25" />
        <p className="text-sm">Товары не найдены</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {products.map((p, i) => {
        const inCompare = compareIds.includes(p.id);
        return (
          <div
            key={p.id}
            className="bg-card border border-border rounded-lg p-4 hover:border-foreground/40 transition-all animate-slide-up"
            style={{ animationDelay: `${i * 35}ms` }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  {p.brand}
                </span>
                {p.tag && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 h-4 border-0"
                    style={{ backgroundColor: "hsl(16 90% 55% / 0.12)", color: "hsl(16 90% 48%)" }}
                  >
                    {p.tag}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground">{p.category}</span>
            </div>

            <h3 className="font-semibold text-sm mb-3 leading-snug">{p.name}</h3>

            <div className="space-y-1 mb-3">
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{specLabel(k)}</span>
                  <span className="font-medium">{String(v)}</span>
                </div>
              ))}
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Год выпуска</span>
                <span className="font-medium">{(p as typeof p & { year?: number }).year ?? "—"}</span>
              </div>
            </div>

            {(p as typeof p & { priceHistory?: { month: string; price: number }[] }).priceHistory && (
              <div className="mb-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-medium">
                  История цен
                </p>
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={(p as typeof p & { priceHistory: { month: string; price: number }[] }).priceHistory}>
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <YAxis hide domain={["auto", "auto"]} />
                    <Tooltip
                      contentStyle={{ fontSize: 11, padding: "4px 8px", borderRadius: 6, border: "1px solid hsl(var(--border))", background: "hsl(var(--card))" }}
                      formatter={(v: number) => [formatPrice(v), "Цена"]}
                      labelStyle={{ display: "none" }}
                    />
                    <Line type="monotone" dataKey="price" stroke="hsl(16 90% 55%)" strokeWidth={1.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="font-semibold">{formatPrice(p.price)}</span>
              <button
                onClick={() => onCompare(p.id)}
                className={`text-xs flex items-center gap-1.5 px-2.5 py-1.5 rounded transition-all ${
                  inCompare
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:bg-foreground hover:text-background"
                }`}
              >
                <Icon name={inCompare ? "Check" : "GitCompare"} size={11} />
                {inCompare ? "В сравнении" : "Сравнить"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CompareTable({
  items,
  onRemove,
}: {
  items: typeof PRODUCTS;
  onRemove: (id: number) => void;
}) {
  const allKeys = Array.from(
    new Set(items.flatMap((item) => Object.keys(item.specs)))
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-border">
            <td className="py-3 pr-6 text-[10px] text-muted-foreground uppercase tracking-widest w-40 font-medium">
              Параметр
            </td>
            {items.map((item) => (
              <td key={item.id} className="py-3 px-4 min-w-[180px] align-top">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-0.5 uppercase tracking-wider">
                      {item.brand}
                    </p>
                    <p className="font-semibold leading-snug text-sm">{item.name}</p>
                  </div>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 shrink-0"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              </td>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-border bg-muted/30">
            <td className="py-3 pr-6 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              Цена
            </td>
            {items.map((item) => (
              <td key={item.id} className="py-3 px-4 font-semibold">
                {formatPrice(item.price)}
              </td>
            ))}
          </tr>
          <tr className="border-b border-border">
            <td className="py-3 pr-6 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
              Категория
            </td>
            {items.map((item) => (
              <td key={item.id} className="py-3 px-4 text-sm">
                {item.category}
              </td>
            ))}
          </tr>
          {allKeys.map((key, idx) => {
            const values = items.map((item) => (item.specs as Record<string, unknown>)[key]);
            const numericValues = values.filter((v) => typeof v === "number") as number[];
            const maxVal = numericValues.length > 0 ? Math.max(...numericValues) : null;

            return (
              <tr
                key={key}
                className={`border-b border-border ${idx % 2 !== 0 ? "bg-muted/15" : ""}`}
              >
                <td className="py-3 pr-6 text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                  {specLabel(key)}
                </td>
                {items.map((item) => {
                  const val = (item.specs as Record<string, unknown>)[key];
                  const isTop = maxVal !== null && val === maxVal && numericValues.length > 1;
                  return (
                    <td
                      key={item.id}
                      className={`py-3 px-4 text-sm ${isTop ? "font-semibold" : ""}`}
                      style={isTop ? { color: "hsl(16 90% 48%)" } : undefined}
                    >
                      {val !== undefined ? String(val) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}