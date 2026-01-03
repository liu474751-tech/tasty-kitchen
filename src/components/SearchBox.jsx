// src/components/SearchBox.jsx
// SEO 搜索优化组件 - 支持实时搜索过滤
import { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';

const SearchBox = memo(function SearchBox({ 
  onSearch, 
  placeholder = '搜索商品...', 
  color = 'green' 
}) {
  const [query, setQuery] = useState('');
  
  const colorMap = {
    green: 'border-green-500/30 focus:border-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.2)]',
    orange: 'border-orange-500/30 focus:border-orange-400 focus:shadow-[0_0_15px_rgba(249,115,22,0.2)]',
    purple: 'border-purple-500/30 focus:border-purple-400 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)]',
    red: 'border-red-500/30 focus:border-red-400 focus:shadow-[0_0_15px_rgba(239,68,68,0.2)]',
  };

  const handleChange = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
          🔍
        </span>
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={`
            w-full pl-12 pr-10 py-3 bg-gray-900/80 backdrop-blur-md
            border ${colorMap[color]} rounded-xl
            text-white placeholder-gray-500
            transition-all duration-300 outline-none
          `}
          aria-label="搜索商品"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            aria-label="清除搜索"
          >
            ✕
          </button>
        )}
      </div>
      {query && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          按名称、描述搜索，支持拼音首字母
        </p>
      )}
    </div>
  );
});

SearchBox.propTypes = {
  onSearch: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  color: PropTypes.oneOf(['green', 'orange', 'purple', 'red']),
};

export default SearchBox;
