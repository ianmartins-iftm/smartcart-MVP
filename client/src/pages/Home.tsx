import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CirclePlus,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBasket,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

type Unit = {
  label: string;
  shortLabel: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  units: Unit[];
  brands: { name: string; prices: number[] }[];
};

type ListItem = {
  id: string;
  productId: string;
  unitIndex: number;
  quantity: number;
};

const products: Product[] = [
  {
    id: "leite",
    name: "Leite integral",
    category: "Laticínios",
    icon: "LT",
    color: "mint",
    units: [
      { label: "1 litro", shortLabel: "1L" },
      { label: "500 ml", shortLabel: "500ml" },
      { label: "caixa com 12 unidades", shortLabel: "caixa c/ 12" },
    ],
    brands: [
      { name: "Piracanjuba", prices: [5.49, 3.29, 62.9] },
      { name: "Itambé", prices: [5.89, 3.59, 68.9] },
      { name: "Elegê", prices: [5.69, 3.39, 65.9] },
    ],
  },
  {
    id: "arroz",
    name: "Arroz branco",
    category: "Mercearia",
    icon: "AR",
    color: "sun",
    units: [
      { label: "1 kg", shortLabel: "1kg" },
      { label: "5 kg", shortLabel: "5kg" },
    ],
    brands: [
      { name: "Camil", prices: [7.49, 34.9] },
      { name: "Tio João", prices: [8.29, 38.9] },
    ],
  },
  {
    id: "banana",
    name: "Banana prata",
    category: "Hortifruti",
    icon: "BN",
    color: "yellow",
    units: [
      { label: "1 kg", shortLabel: "1kg" },
      { label: "unidade", shortLabel: "un." },
    ],
    brands: [{ name: "Hortifruti da casa", prices: [6.99, 0.89] }],
  },
  {
    id: "cafe",
    name: "Café moído",
    category: "Mercearia",
    icon: "CF",
    color: "brown",
    units: [
      { label: "250 g", shortLabel: "250g" },
      { label: "500 g", shortLabel: "500g" },
    ],
    brands: [
      { name: "Pilão", prices: [12.9, 23.9] },
      { name: "3 Corações", prices: [14.49, 26.9] },
      { name: "Melitta", prices: [13.9, 25.9] },
    ],
  },
  {
    id: "ovos",
    name: "Ovos brancos",
    category: "Laticínios",
    icon: "OV",
    color: "peach",
    units: [
      { label: "unidade", shortLabel: "un." },
      { label: "dúzia (12 unidades)", shortLabel: "dúzia" },
    ],
    brands: [
      { name: "Granja Faria", prices: [0.95, 10.49] },
      { name: "Mantiqueira", prices: [1.09, 11.9] },
    ],
  },
  {
    id: "sabao",
    name: "Sabão em pó",
    category: "Casa",
    icon: "SP",
    color: "sky",
    units: [
      { label: "800 g", shortLabel: "800g" },
      { label: "1,6 kg", shortLabel: "1,6kg" },
    ],
    brands: [
      { name: "Omo", prices: [14.9, 26.9] },
      { name: "Brilhante", prices: [11.9, 21.9] },
      { name: "Tixan", prices: [12.49, 22.9] },
    ],
  },
  {
    id: "tomate",
    name: "Tomate",
    category: "Hortifruti",
    icon: "TM",
    color: "red",
    units: [
      { label: "1 kg", shortLabel: "1kg" },
      { label: "unidade", shortLabel: "un." },
    ],
    brands: [{ name: "Hortifruti da casa", prices: [8.99, 1.19] }],
  },
  {
    id: "paes",
    name: "Pão de forma",
    category: "Padaria",
    icon: "PF",
    color: "lavender",
    units: [
      { label: "pacote 400 g", shortLabel: "400g" },
      { label: "pacote 500 g", shortLabel: "500g" },
    ],
    brands: [
      { name: "Wickbold", prices: [9.49, 11.9] },
      { name: "Seven Boys", prices: [8.99, 11.49] },
    ],
  },
];

const categories = ["Todos", "Hortifruti", "Mercearia", "Laticínios", "Casa", "Padaria"];
const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function cheapestBrand(product: Product, unitIndex: number) {
  return product.brands.reduce((cheapest, brand) =>
    brand.prices[unitIndex] < cheapest.prices[unitIndex] ? brand : cheapest,
  );
}

export default function Home() {
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [selectedUnit, setSelectedUnit] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<ListItem[]>([
    { id: "initial-arroz", productId: "arroz", unitIndex: 0, quantity: 1 },
    { id: "initial-banana", productId: "banana", unitIndex: 0, quantity: 2 },
  ]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [showMobileList, setShowMobileList] = useState(false);

  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0];

  const visibleProducts = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = category === "Todos" || product.category === category;
        return matchesCategory && product.name.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR"));
      }),
    [category, search],
  );

  const total = items.reduce((sum, item) => {
    const product = products.find((entry) => entry.id === item.productId);
    if (!product) return sum;
    return sum + cheapestBrand(product, item.unitIndex).prices[item.unitIndex] * item.quantity;
  }, 0);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  function selectProduct(product: Product) {
    setSelectedProductId(product.id);
    setSelectedUnit(0);
  }

  function addItem() {
    const existing = items.find(
      (item) => item.productId === selectedProductId && item.unitIndex === selectedUnit,
    );
    if (existing) {
      setItems((current) =>
        current.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      );
    } else {
      setItems((current) => [
        ...current,
        { id: `${selectedProductId}-${Date.now()}`, productId: selectedProductId, unitIndex: selectedUnit, quantity },
      ]);
    }
    setQuantity(1);
  }

  function changeQuantity(id: string, amount: number) {
    setItems((current) =>
      current
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + amount } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function changeUnit(id: string, unitIndex: number) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, unitIndex } : item)),
    );
  }

  return (
    <div className="smartcart-shell min-h-screen">
      <header className="border-b border-[#dfe9df] bg-[#fbfdf8]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="brand-mark"><ShoppingBasket size={21} strokeWidth={2.5} /></div>
            <div>
              <div className="text-[18px] font-black tracking-[-0.04em] text-[#19372d]">smart<span className="text-[#e87535]">cart</span></div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#829487]">compras mais inteligentes</div>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-sm font-semibold text-[#587063] sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f3e5] text-[#3b8154]"><Check size={16} /></span>
            Lista salva automaticamente
          </div>
          <button className="list-mobile-trigger sm:hidden" onClick={() => setShowMobileList(true)}>
            <ShoppingBasket size={18} />
            <span>{itemCount}</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1240px] px-5 pb-16 pt-8 lg:px-8 lg:pt-12">
        <div className="mb-9 max-w-2xl">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#e87535]">
            <Sparkles size={15} /> lista da semana
          </div>
          <h1 className="text-4xl font-black tracking-[-0.055em] text-[#19372d] sm:text-5xl">
            O que vai para o <span className="title-highlight">carrinho?</span>
          </h1>
          <p className="mt-4 text-[16px] leading-7 text-[#668073]">
            Monte sua lista, escolha o tamanho ideal e veja quanto você vai gastar antes de sair de casa.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_370px]">
          <section>
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative min-w-0 flex-1 sm:max-w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#90a79a]" size={18} />
                <input
                  aria-label="Buscar produto"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar produto..."
                  className="h-12 w-full rounded-2xl border border-[#dce8db] bg-white pl-11 pr-4 text-sm font-medium text-[#264b3b] outline-none transition focus:border-[#75a87e] focus:ring-4 focus:ring-[#cfe8cf]/50"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((entry) => (
                  <button
                    key={entry}
                    onClick={() => setCategory(entry)}
                    className={`category-pill whitespace-nowrap ${category === entry ? "active" : ""}`}
                  >
                    {entry}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-grid">
              {visibleProducts.map((product) => {
                const cheapest = cheapestBrand(product, 0);
                return (
                  <button
                    key={product.id}
                    onClick={() => selectProduct(product)}
                    className={`product-card text-left ${selectedProductId === product.id ? "selected" : ""}`}
                  >
                    <div className={`product-avatar ${product.color}`}>{product.icon}</div>
                    <div className="mt-4 flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[15px] font-extrabold text-[#264b3b]">{product.name}</div>
                        <div className="mt-1 text-xs font-medium text-[#8aa094]">{product.category}</div>
                      </div>
                      <CirclePlus className="shrink-0 text-[#75a57e]" size={19} />
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#edf2ec] pt-3 text-xs">
                      <span className="text-[#83968b]">a partir de</span>
                      <strong className="font-black text-[#3b8154]">{money(cheapest.prices[0])}</strong>
                    </div>
                  </button>
                );
              })}
            </div>
            {visibleProducts.length === 0 && (
              <div className="empty-search"><Search size={24} /><p>Nenhum produto encontrado.</p></div>
            )}

            <div className="add-panel mt-8">
              <div className="mb-5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[15px] font-extrabold text-[#264b3b]">
                    <Package size={18} className="text-[#e87535]" /> Adicionar à lista
                  </div>
                  <p className="mt-1 text-xs text-[#829487]">Escolha o tamanho ou embalagem que você precisa.</p>
                </div>
                <div className="hidden rounded-full bg-[#fff0e5] px-3 py-1 text-xs font-bold text-[#d8662a] sm:block">
                  {selectedProduct.name}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1.2fr_0.9fr_0.55fr_auto]">
                <label className="field-wrap">
                  <span>Produto</span>
                  <select value={selectedProductId} onChange={(event) => selectProduct(products.find((product) => product.id === event.target.value) ?? products[0])}>
                    {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                  </select>
                  <ChevronDown size={16} />
                </label>
                <label className="field-wrap">
                  <span>Unidade / embalagem</span>
                  <select value={selectedUnit} onChange={(event) => setSelectedUnit(Number(event.target.value))}>
                    {selectedProduct.units.map((unit, index) => <option key={unit.label} value={index}>{unit.label}</option>)}
                  </select>
                  <ChevronDown size={16} />
                </label>
                <label className="field-wrap">
                  <span>Quantidade</span>
                  <input type="number" min="1" max="99" value={quantity} onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))} />
                </label>
                <button onClick={addItem} className="add-button"><Plus size={19} /><span className="sm:hidden">Adicionar</span></button>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-[#7f9386]">
                <Sparkles size={14} className="text-[#e87535]" />
                Melhor preço encontrado: <strong className="text-[#4f7f58]">{cheapestBrand(selectedProduct, selectedUnit).name}</strong> por {money(cheapestBrand(selectedProduct, selectedUnit).prices[selectedUnit])}
              </div>
            </div>
          </section>

          <aside className={`list-panel ${showMobileList ? "mobile-open" : ""}`}>
            <div className="list-panel-header">
              <div>
                <div className="flex items-center gap-2 text-lg font-black tracking-[-0.03em] text-[#19372d]">
                  <ShoppingBasket size={20} className="text-[#e87535]" /> Minha lista
                </div>
                <p className="mt-1 text-xs font-medium text-[#829487]">{itemCount} {itemCount === 1 ? "item" : "itens"} selecionados</p>
              </div>
              <button className="list-close sm:hidden" onClick={() => setShowMobileList(false)}><X size={20} /></button>
              <div className="list-total">
                <span>estimativa total</span>
                <strong>{money(total)}</strong>
              </div>
            </div>
            <div className="list-items">
              {items.length === 0 ? (
                <div className="list-empty">
                  <div className="empty-basket"><ShoppingBasket size={27} /></div>
                  <strong>Sua lista está vazia</strong>
                  <p>Adicione produtos para acompanhar sua estimativa.</p>
                </div>
              ) : items.map((item) => {
                const product = products.find((entry) => entry.id === item.productId)!;
                const brand = cheapestBrand(product, item.unitIndex);
                const itemTotal = brand.prices[item.unitIndex] * item.quantity;
                return (
                  <div key={item.id} className="list-item">
                    <div className={`item-mini-avatar ${product.color}`}>{product.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <strong className="truncate text-[14px] font-extrabold text-[#264b3b]">{product.name}</strong>
                        <button aria-label={`Remover ${product.name}`} onClick={() => removeItem(item.id)} className="remove-button"><Trash2 size={15} /></button>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#87998f]">
                        <span>{brand.name}</span><span className="cheapest-label">{product.brands.length > 1 ? "mais barata" : "preço estimado"}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="quantity-control">
                          <button aria-label="Diminuir quantidade" onClick={() => changeQuantity(item.id, -1)}><Minus size={13} /></button>
                          <span>{item.quantity}</span>
                          <button aria-label="Aumentar quantidade" onClick={() => changeQuantity(item.id, 1)}><Plus size={13} /></button>
                        </div>
                        <select className="item-unit-select" value={item.unitIndex} onChange={(event) => changeUnit(item.id, Number(event.target.value))}>
                          {product.units.map((unit, index) => <option key={unit.label} value={index}>{unit.shortLabel}</option>)}
                        </select>
                        <strong className="ml-auto text-[14px] font-black text-[#356c46]">{money(itemTotal)}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="list-panel-footer">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="font-semibold text-[#789083]">Total estimado</span>
                <strong className="text-2xl font-black tracking-[-0.04em] text-[#19372d]">{money(total)}</strong>
              </div>
              <button className="finish-button" onClick={() => setShowMobileList(false)}>
                Conferir lista <ArrowRight size={17} />
              </button>
              <p className="mt-3 text-center text-[10px] font-medium leading-4 text-[#9bad9f]">Os valores são estimativas e podem variar por mercado.</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}