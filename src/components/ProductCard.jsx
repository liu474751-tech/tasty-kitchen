// src/components/ProductCard.jsx
// 原子化封装的商品卡片组件 - 带状态机、React.memo、PropTypes
import { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

// ============ Atoms 原子组件 ============

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

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['amber', 'green', 'orange', 'purple', 'red']),
};

export function Button({ children, onClick, color = 'amber', disabled = false, loading = false, className = '' }) {
  const colorMap = {
    amber: 'bg-amber-600 hover:bg-amber-500 shadow-neon-amber',
    green: 'bg-green-600 hover:bg-green-500 shadow-neon-green',
    orange: 'bg-orange-600 hover:bg-orange-500 shadow-neon-orange',
    purple: 'bg-purple-600 hover:bg-purple-500 shadow-neon-purple',
    red: 'bg-red-600 hover:bg-red-500 shadow-neon-red',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`py-2 px-4 ${colorMap[color]} rounded-lg font-bold transition-all duration-300 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        hover:shadow-lg active:scale-95 ${className}`}
      aria-label={typeof children === 'string' ? children : undefined}
      aria-busy={loading}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          处理中...
        </span>
      ) : children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  color: PropTypes.oneOf(['amber', 'green', 'orange', 'purple', 'red']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  className: PropTypes.string,
};

// Price 组件 - 支持涨跌颜色显示
export function Price({ price, originalPrice, unit }) {
  const hasDiscount = originalPrice && originalPrice > price;
  const priceChange = originalPrice ? ((price - originalPrice) / originalPrice * 100).toFixed(0) : 0;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`text-xl font-bold ${hasDiscount ? 'text-green-400' : 'text-white'}`}>
          ¥{price}
        </span>
        {hasDiscount && (
          <>
            <span className="text-sm text-gray-500 line-through">¥{originalPrice}</span>
            <span className="text-xs px-1.5 py-0.5 bg-green-600/30 text-green-400 rounded">
              {priceChange}%
            </span>
          </>
        )}
      </div>
      {unit && <span className="text-gray-500">/{unit}</span>}
    </div>
  );
}

Price.propTypes = {
  price: PropTypes.number.isRequired,
  originalPrice: PropTypes.number,
  unit: PropTypes.string,
};

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

ProductInfo.propTypes = {
  name: PropTypes.string.isRequired,
  desc: PropTypes.string,
  color: PropTypes.oneOf(['green', 'orange', 'purple', 'red']),
};

// ============ ProductCard 主组件 ============
// 状态机: normal -> loading -> normal/soldOut

const ProductCard = memo(function ProductCard({ 
  item, 
  color = 'green', 
  onAddToCart, 
  stock = 99,
  minQuantity = 1,  // 起购量
}) {
  const [state, setState] = useState('normal'); // normal | loading | soldOut
  
  const isOutOfStock = stock <= 0;
  
  // 边框颜色映射 - hover 时显示发光效果
  const borderColorMap = {
    green: 'border-green-500/30 hover:border-green-500/50 hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]',
    orange: 'border-orange-500/30 hover:border-orange-500/50 hover:shadow-[0_0_25px_rgba(249,115,22,0.2)]',
    purple: 'border-purple-500/30 hover:border-purple-500/50 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)]',
    red: 'border-red-500/30 hover:border-red-500/50 hover:shadow-[0_0_25px_rgba(239,68,68,0.2)]',
  };

  // 装饰性光晕渐变映射
  const glowGradientMap = {
    green: 'from-green-500/5 to-transparent',
    orange: 'from-orange-500/5 to-transparent',
    purple: 'from-purple-500/5 to-transparent',
    red: 'from-red-500/5 to-transparent',
  };

  // 处理加入购物车 - 带 Loading 状态防抖
  const handleAddToCart = useCallback(async () => {
    if (state === 'loading' || isOutOfStock) return;
    
    setState('loading');
    
    // 模拟网络延迟（实际项目中这里是 API 调用）
    await new Promise(resolve => setTimeout(resolve, 300));
    
    onAddToCart({ ...item, quantity: minQuantity });
    
    // 检查库存
    if (stock <= minQuantity) {
      setState('soldOut');
    } else {
      setState('normal');
    }
  }, [item, onAddToCart, state, isOutOfStock, stock, minQuantity]);

  // 获取按钮文字
  const getButtonText = () => {
    if (isOutOfStock || state === 'soldOut') return '补货中';
    if (minQuantity > 1) return `${minQuantity}${item.unit || '份'}起购`;
    return '加入购物车';
  };

  return (
    <article 
      className={`
        group relative bg-[#111827] backdrop-blur-md border ${borderColorMap[color]} 
        rounded-2xl p-6 transition-all duration-300 cursor-pointer
        hover:-translate-y-2
        ${isOutOfStock ? 'opacity-60 grayscale' : ''}
      `}
    >
      {/* 装饰性背景光晕 - hover 时显示 */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-br ${glowGradientMap[color]} 
          opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none
        `} 
        aria-hidden="true"
      />
      
      {/* 内容区 - 相对定位确保在光晕之上 */}
      <div className="relative z-10">
        {/* Emoji 带放大动画 */}
        <div className="text-5xl text-center mb-4 transform group-hover:scale-110 transition-transform duration-300">
          <span role="img" aria-label={item.name}>{item.emoji}</span>
        </div>
        
        <ProductInfo name={item.name} desc={item.desc} color={color} />
        
        {/* 库存显示 */}
        {stock < 10 && stock > 0 && (
          <p className="text-xs text-center mb-2 text-red-400 animate-pulse">
            仅剩 {stock} {item.unit || '份'}
          </p>
        )}
        
        {/* 价格区块 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={`text-sm ${color === 'green' ? 'text-green-400' : color === 'orange' ? 'text-orange-400' : color === 'purple' ? 'text-purple-400' : 'text-red-400'}`}>
            ￥
          </span>
          <span className="text-2xl font-bold text-white">{item.price}</span>
          {item.unit && <span className="text-gray-500 text-sm">/{item.unit}</span>}
        </div>

        {/* 原价显示（如有） */}
        {item.originalPrice && item.originalPrice > item.price && (
          <p className="text-center text-sm text-gray-500 line-through mb-2">
            原价 ¥{item.originalPrice}
          </p>
        )}
        
        <Button 
          onClick={handleAddToCart} 
          color={color} 
          disabled={isOutOfStock || state === 'soldOut'}
          loading={state === 'loading'}
          className="w-full"
        >
          {getButtonText()}
        </Button>
      </div>
    </article>
  );
});

ProductCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    unit: PropTypes.string,
    emoji: PropTypes.string,
    desc: PropTypes.string,
  }).isRequired,
  color: PropTypes.oneOf(['green', 'orange', 'purple', 'red']),
  onAddToCart: PropTypes.func.isRequired,
  stock: PropTypes.number,
  minQuantity: PropTypes.number,
};

export default ProductCard;
