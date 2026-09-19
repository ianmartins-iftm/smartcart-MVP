import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  Map,
  MapPinned,
  PartyPopper,
  Plus,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  location: string;
  instruction: string;
  suggestion?: boolean;
};

type ListItem = {
  id: string;
  productId: string;
  quantity: string;
};

type RouteItem = ListItem & {
  product: Product;
  order: number;
};

type AppMode = "list" | "optimizing" | "route" | "complete";

const categoryOrder = ["Hortifrúti", "Padaria", "Laticínios", "Cereais", "Mercearia", "Açougue"];

const products: Product[] = [
  { id: "leite", name: "Leite", category: "Laticínios", location: "Laticínios – Corredor A", instruction: "Geladeira central, prateleira do meio", suggestion: true },
  { id: "arroz", name: "Arroz", category: "Cereais", location: "Cereais – Corredor B", instruction: "Prateleira inferior, sacos de 1kg e 5kg", suggestion: true },
  { id: "pao", name: "Pão", category: "Padaria", location: "Padaria – Padaria", instruction: "Balcão de pães frescos, ao centro", suggestion: true },
  { id: "tomate", name: "Tomate", category: "Hortifrúti", location: "Hortifrúti – Entrada", instruction: "Primeira gôndola ao entrar, lado direito", suggestion: true },
  { id: "frango", name: "Frango", category: "Açougue", location: "Açougue – Açougue", instruction: "Balcão refrigerado, seção de aves", suggestion: true },
  { id: "banana", name: "Banana", category: "Mercearia", location: "Mercearia – Corredor C", instruction: "Pergunte a um atendente", suggestion: true },
  { id: "feijao", name: "Feijão", category: "Mercearia", location: "Mercearia – Corredor C", instruction: "Corredor de grãos, lado esquerdo", suggestion: true },
  { id: "cafe", name: "Café", category: "Mercearia", location: "Mercearia – Corredor C", instruction: "Prateleira de bebidas quentes", suggestion: true },
  { id: "macarrao", name: "Macarrão", category: "Cereais", location: "Cereais – Corredor B", instruction: "Corredor de massas", suggestion: true },
  { id: "iogurte", name: "Iogurte", category: "Laticínios", location: "Laticínios – Corredor A", instruction: "Geladeira lateral", suggestion: true },
  { id: "detergente", name: "Detergente", category: "Mercearia", location: "Mercearia – Corredor C", instruction: "Corredor de limpeza", suggestion: true },
  { id: "acucar", name: "Açúcar", category: "Cereais", location: "Cereais – Corredor B", instruction: "Prateleira de mercearia seca", suggestion: true },
  { id: "maca", name: "Maçã", category: "Hortifrúti", location: "Hortifrúti – Entrada", instruction: "Cesta de frutas, lado esquerdo", suggestion: true },
  { id: "manteiga", name: "Manteiga", category: "Laticínios", location: "Laticínios – Corredor A", instruction: "Geladeira central", suggestion: true },
];

const fixedSuggestions = ["Feijão", "Café", "Macarrão", "Iogurte", "Detergente", "Açúcar", "Maçã", "Manteiga"];
const emptySuggestions = ["Leite", "Arroz", "Pão", "Frango", "Tomate", "Feijão", "Café", "Macarrão"];
const formatQuantity = (value: string) => value.trim() || "1";

function productFor(item: ListItem) {
  return products.find((product) => product.id === item.productId) ?? products[0];
}

function StoreMap({ route, currentIndex }: { route: RouteItem[]; currentIndex: number }) {
  const categoryPoints: Record<string, [number, number]> = {
    Hortifrúti: [78, 82],
    Padaria: [180, 82],
    Laticínios: [285, 82],
    Cereais: [180, 190],
    Mercearia: [285, 190],
    Açougue: [78, 190],
  };
  const points = route.map((item, index) => {
    const [baseX, baseY] = categoryPoints[item.product.category] ?? [180, 190];
    const sameCategoryBefore = route.slice(0, index).filter((entry) => entry.product.category === item.product.category).length;
    return { x: baseX + sameCategoryBefore * 16, y: baseY + sameCategoryBefore * 12, item, index };
  });
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="store-map-card" aria-label="Mapa fixo do supermercado">
      <svg className="store-map" viewBox="0 0 360 430" role="img" aria-label="Rota entre os setores do supermercado">
        <rect x="14" y="18" width="105" height="106" rx="10" className="map-zone map-zone-mint" />
        <rect x="128" y="18" width="104" height="106" rx="10" className="map-zone map-zone-yellow" />
        <rect x="241" y="18" width="105" height="106" rx="10" className="map-zone map-zone-blue" />
        <rect x="14" y="140" width="105" height="90" rx="10" className="map-zone map-zone-red" />
        <rect x="128" y="140" width="104" height="90" rx="10" className="map-zone map-zone-yellow" />
        <rect x="241" y="140" width="105" height="90" rx="10" className="map-zone map-zone-purple" />
        <rect x="14" y="246" width="105" height="73" rx="10" className="map-zone map-zone-cyan" />
        <rect x="128" y="246" width="104" height="73" rx="10" className="map-zone map-zone-orange" />
        <rect x="14" y="336" width="332" height="38" rx="9" className="map-checkouts" />
        <rect x="134" y="389" width="92" height="28" rx="9" className="map-entrance" />
        <text x="66" y="78" className="map-label">Hortifrúti</text>
        <text x="167" y="78" className="map-label">Padaria</text>
        <text x="273" y="78" className="map-label">Laticínios</text>
        <text x="163" y="190" className="map-label">Cereais</text>
        <text x="270" y="190" className="map-label">Mercearia</text>
        <text x="48" y="190" className="map-label">Açougue</text>
        <text x="50" y="285" className="map-small-label">Limpeza</text>
        <text x="164" y="285" className="map-small-label">Bebidas</text>
        <text x="151" y="360" className="map-small-label">Caixas</text>
        <text x="151" y="407" className="map-small-label">Entrada</text>
        {points.length > 1 && <polyline points={linePoints} className="map-route-line" />}
        {points.map(({ x, y, item, index }) => {
          const complete = index < currentIndex || currentIndex === route.length;
          const current = index === currentIndex && currentIndex < route.length;
          return (
            <g key={item.id} className={complete ? "map-point map-point-complete" : current ? "map-point map-point-current" : "map-point map-point-next"}>
              <circle cx={x} cy={y} r="18" />
              <text x={x} y={y + 5} textAnchor="middle">{complete ? "✓" : index + 1}</text>
            </g>
          );
        })}
      </svg>
      <div className="map-legend"><span><i className="legend-dot legend-current" />Atual</span><span><i className="legend-dot legend-complete" />Concluído</span><span><i className="legend-dot legend-next" />Próximo</span></div>
    </div>
  );
}

export default function Home() {
  const [mode, setMode] = useState<AppMode>("list");
  const [items, setItems] = useState<ListItem[]>([]);
  const [productInput, setProductInput] = useState("");
  const [quantityInput, setQuantityInput] = useState("1");
  const [route, setRoute] = useState<RouteItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const suggestionProducts = useMemo(() => products.filter((product) => product.suggestion), []);
  const currentRouteItem = route[currentIndex];

  function addProduct(productName = productInput) {
    const normalized = productName.trim().toLocaleLowerCase("pt-BR");
    const product = products.find((entry) => entry.name.toLocaleLowerCase("pt-BR") === normalized);
    if (!product) return;
    const existing = items.find((item) => item.productId === product.id);
    if (existing) {
      setItems((current) => current.map((item) => item.id === existing.id ? { ...item, quantity: formatQuantity(quantityInput) } : item));
    } else {
      setItems((current) => [...current, { id: `${product.id}-${Date.now()}`, productId: product.id, quantity: formatQuantity(quantityInput) }]);
    }
    setProductInput("");
    setQuantityInput("1");
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function optimizeRoute() {
    const grouped = [...items].sort((a, b) => {
      const categoryA = categoryOrder.indexOf(productFor(a).category);
      const categoryB = categoryOrder.indexOf(productFor(b).category);
      return categoryA - categoryB;
    });
    setRoute(grouped.map((item, index) => ({ ...item, product: productFor(item), order: index + 1 })));
    setCurrentIndex(0);
    setMode("optimizing");
    window.setTimeout(() => setMode("route"), 650);
  }

  function completeCurrent() {
    if (currentIndex >= route.length - 1) {
      setCurrentIndex(route.length);
      setMode("complete");
      return;
    }
    setCurrentIndex((current) => current + 1);
  }

  function newList() {
    setItems([]);
    setRoute([]);
    setCurrentIndex(0);
    setProductInput("");
    setQuantityInput("1");
    setMode("list");
  }

  if (mode === "complete") {
    return (
      <main className="artifact-shell">
        <section className="completion-card">
          <PartyPopper size={46} strokeWidth={1.6} />
          <h1>Lista completa!</h1>
          <p>Todos os {route.length} itens encontrados</p>
          <div className="time-saved"><span>Tempo estimado economizado</span><strong>~{Math.max(8, route.length * 2)} min</strong></div>
          <button className="new-list-button" onClick={newList}><ShoppingCart size={18} /> Nova Lista</button>
        </section>
        <RouteItems route={route} currentIndex={currentIndex} />
      </main>
    );
  }

  if (mode === "route" || mode === "optimizing") {
    return (
      <main className="artifact-shell route-shell">
        <header className="route-header">
          <button className="back-list-button" onClick={() => setMode("list")}><ArrowLeft size={17} /> Lista</button>
          <div><h1><Map size={20} /> Rota Otimizada</h1><p>Parada {Math.min(currentIndex + 1, route.length)} de {route.length}</p></div>
          <div className="route-progress"><span>{currentIndex}/{route.length}</span><i><b style={{ width: `${route.length ? (currentIndex / route.length) * 100 : 0}%` }} /></i></div>
        </header>
        {mode === "optimizing" ? <div className="optimizing-screen"><Sparkles size={34} /><strong>Calculando rota ótima...</strong></div> : <>
          <StoreMap route={route} currentIndex={currentIndex} />
          <RouteCard item={currentRouteItem} onNext={completeCurrent} />
          <RouteItems route={route} currentIndex={currentIndex} />
        </>}
      </main>
    );
  }

  return (
    <main className="artifact-shell">
      <section className="artifact-hero"><div className="artifact-brand"><ShoppingCart size={26} /><div><h1>SmartCart</h1><p>📍 Supermercado RR – Aeroporto</p></div></div></section>
      <section className="shopping-card add-shopping-card">
        <h2>📝 Minha Lista de Compras</h2>
        <div className="artifact-form">
          <input list="registered-products" value={productInput} onChange={(event) => setProductInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addProduct(); }} placeholder="Adicionar produto..." aria-label="Adicionar produto" />
          <datalist id="registered-products">{products.map((product) => <option key={product.id} value={product.name} />)}</datalist>
          <input value={quantityInput} onChange={(event) => setQuantityInput(event.target.value)} placeholder="Qtd" aria-label="Quantidade" />
          <button onClick={() => addProduct()} aria-label="Adicionar produto"><Plus size={27} /></button>
        </div>
        <p className="artifact-hint">💡 Exemplos: "1", "2x", "500g", "1kg"</p>
      </section>
      <section className={`shopping-card items-card ${items.length === 0 ? "empty-items-card" : ""}`}>
        {items.length === 0 ? <div className="empty-state"><ShoppingCart size={54} strokeWidth={1.2} /><p>Sua lista está vazia</p></div> : items.map((item, index) => {
          const product = productFor(item);
          return <div className="artifact-list-item" key={item.id}><span className="item-number">{index + 1}</span><strong>{product.name} <em>({item.quantity})</em></strong><button onClick={() => removeItem(item.id)} aria-label={`Remover ${product.name}`}><X size={23} /></button></div>;
        })}
      </section>
      <section className="suggestions-section"><h2>Sugestões rápidas:</h2><div className="suggestion-chips">{(items.length === 0 ? emptySuggestions : fixedSuggestions).map((name) => <button key={name} onClick={() => addProduct(name)}>+ {name}</button>)}</div></section>
      {items.length > 0 && <button className="optimize-button" onClick={optimizeRoute}><MapPinned size={21} /> Otimizar Rota ({items.length} {items.length === 1 ? "item" : "itens"})</button>}
      {items.length === 0 && <p className="empty-footnote">Escolha produtos cadastrados para montar sua lista.</p>}
    </main>
  );
}

function RouteCard({ item, onNext }: { item?: RouteItem; onNext: () => void }) {
  if (!item) return null;
  return <section className="route-card"><div className="route-card-title"><span>📍 IR AGORA PARA</span><b>{item.order}<small> de rota</small></b></div><h2>{item.product.name} <em>({item.quantity})</em></h2><div className="route-location"><strong>📦 {item.product.location}</strong><p>{item.product.instruction}</p></div><button onClick={onNext}><Check size={20} /> Encontrei! Próximo <span>→</span></button></section>;
}

function RouteItems({ route, currentIndex }: { route: RouteItem[]; currentIndex: number }) {
  return <section className="route-items"><h2>TODOS OS ITENS</h2>{route.map((item, index) => { const complete = index < currentIndex || currentIndex === route.length; const current = index === currentIndex && currentIndex < route.length; return <div className={`route-item-row ${complete ? "is-complete" : current ? "is-current" : ""}`} key={item.id}><span className="route-item-number">{complete ? <Check size={15} /> : item.order}</span><div><strong>{item.product.name} <em>({item.quantity})</em></strong><small>{item.product.location}</small></div>{complete ? <Check className="row-check" size={16} /> : current ? <b>ATUAL</b> : null}</div>; })}</section>;
}
