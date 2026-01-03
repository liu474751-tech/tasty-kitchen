// src/components/ProductCard.jsx
// 原子化封装的商品卡片组件

export function Badge({ children, color = 'amber' }) {
  const colorMap = {
    amber: 'bg-amber-900/50 text-amber-300',
    green: 'bg-green-900/50 text-green-300',
    orange: 'bg-orange-900/50 text-orange-300',
    purple: 'bg-purple-900/50 text-purple-300',
    red: 'bg-red-900/50 text-red-300',
  };
  return (
    <span className={`px-3 py-1 ${colorMap[color] || colorMap.amber} text-xs rounded-full font-bold`}>
      {children}
    </span>
  );
}

export function Button({ children, onClick, color = 'amber', disabled = false, className = '' }) {
  const colorMap = {
    amber: 'bg-amber-600 hover:bg-amber-500',
    green: 'bg-green-600 hover:bg-green-500',
    orange: 'bg-orange-600 hover:bg-orange-500',
    purple: 'bg-purple-600 hover:bg-purple-500',
    red: 'bg-red-600 hover:bg-red-500',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-2 px-4 ${colorMap[color]} rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
}

export function PriceSection({ price, unit }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xl font-bold text-white">¥{price}</span>
      {unit && <span className="text-gray-500">/{unit}</span>}
    </div>
  );
}

export function ProductInfo({ name, desc, color = 'green' }) {
  const colorMap = {
    green: 'text-green-300',
    orange: 'text-orange-300',
    purple: 'text-purple-300',
    red: 'text-red-300',
  };
  
  return (
    <>
      <h3 className={`text-lg font-bold ${colorMap[color]} text-center mb-1`}>{name}</h3>
      <p className="text-gray-400 text-sm text-center mb-3">{desc}</p>
    </>
  );
}

export default function ProductCard({ 
  item, 
  color = 'green', 
  onAddToCart, 
  disabled = false,
  showStock = false,
  stock = 99 
}) {
  const borderColorMap = {
    green: 'border-green-500/30 hover:border-green-400 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]',
    orange: 'border-orange-500/30 hover:border-orange-400 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]',
    purple: 'border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
    red: 'border-red-500/30 hover:border-red-400 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
  };

  const isOutOfStock = showStock && stock <= 0;

  return (
    <article 
      className={`bg-gray-900/80 border ${borderColorMap[color]} rounded-2xl p-6 hover:-translate-y-2 transition-all cursor-pointer ${isOutOfStock ? 'opacity-60' : ''}`}
    >
      {/* Emoji 带无障碍标签 */}
      <div className="text-5xl text-center mb-3">
        <span role="img" aria-label={item.name}>{item.emoji}</span>
      </div>
      
      <ProductInfo name={item.name} desc={item.desc} color={color} />
      
      {showStock && (
        <p className={`text-xs text-center mb-2 ${stock <= 5 ? 'text-red-400' : 'text-gray-500'}`}>
          {isOutOfStock ? '已售罄' : `库存: ${stock}`}
        </p>
      )}
      
      <PriceSection price={item.price} unit={item.unit} />
      
      <Button 
        onClick={() => onAddToCart(item)} 
        color={color} 
        disabled={disabled || isOutOfStock}
        className="w-full mt-4"
      >
        {isOutOfStock ? '已售罄' : '加入购物车'}
      </Button>
    </article>
  );
}
