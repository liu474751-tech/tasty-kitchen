// src/components/SpatialModal.jsx
// 空间态模态框 - 替代 window.confirm
// 2026 Apple Vision Pro 风格: 高斯模糊 + 透视感 + 触觉反馈

import React, { useEffect } from 'react';

export const SpatialModal = ({ isOpen, title, content, onConfirm, onCancel, isCyberMode = true, confirmText = "确认领养", cancelText = "再想想" }) => {
  // 打开时禁用背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel?.();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // 2026 Apple 风: 极度细腻的毛玻璃 + 内部高光
  const modalStyle = isCyberMode 
    ? "bg-gray-900/60 border-white/10 shadow-[0_0_80px_rgba(0,255,100,0.1)] text-white"
    : "bg-white/60 border-white/40 shadow-[0_20px_60px_rgba(0,0,0,0.1)] text-gray-900";

  const confirmBtnStyle = isCyberMode
    ? "text-black bg-gradient-to-r from-cyan-400 to-green-400 shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_30px_rgba(52,211,153,0.6)]"
    : "text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_4px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_4px_30px_rgba(34,197,94,0.5)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩：深邃的渐变模糊 */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-md transition-opacity duration-300"
        onClick={onCancel}
        style={{ animation: 'fadeIn 0.2s ease-out' }}
      />

      {/* 模态框主体：仿 Vision Pro 材质 */}
      <div 
        className={`
          relative w-full max-w-sm rounded-[2rem] p-8 
          backdrop-blur-2xl border 
          border-t-white/20 border-l-white/10 border-b-black/10 border-r-black/10 
          transform transition-all duration-300
          ${modalStyle}
        `}
        style={{ animation: 'modalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* 顶部的高光装饰条，模拟光线折射 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-white/20 rounded-b-full mb-6" />

        {/* 装饰性光晕 */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        <h3 className="text-2xl font-bold text-center mb-4 tracking-tight">
          {title}
        </h3>
        
        <p className="text-center opacity-80 mb-8 leading-relaxed text-sm font-medium whitespace-pre-line">
          {content}
        </p>

        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className={`
              flex-1 py-3.5 rounded-2xl font-bold text-sm 
              backdrop-blur-md bg-gray-500/10 hover:bg-gray-500/20 
              active:scale-95 transition-all duration-200
              ${isCyberMode ? 'text-gray-300' : 'text-gray-600'}
            `}
          >
            {cancelText}
          </button>
          <button 
            onClick={onConfirm}
            className={`
              flex-1 py-3.5 rounded-2xl font-bold text-sm 
              hover:brightness-110 active:scale-95 transition-all duration-200
              ${confirmBtnStyle}
            `}
          >
            {confirmText}
          </button>
        </div>
      </div>

      {/* 内联动画样式 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalEnter {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px);
            filter: blur(10px);
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SpatialModal;
