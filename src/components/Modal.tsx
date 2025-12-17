import React, { useEffect } from 'react';
import { X, Tag, DollarSign, Percent, Package } from 'lucide-react';
import type { Product } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, product }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.8)', 
        backdropFilter: 'blur(4px)',
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-bg-surface border border-border shadow-2xl"
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          border: '1px solid var(--border)',
          borderRadius: '1rem',
          maxWidth: '32rem',
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="flex items-center justify-between p-6 border-b border-border bg-bg-dark/50"
          style={{ 
            padding: '1.5rem', 
            borderBottom: '1px solid var(--border)',
            backgroundColor: 'rgba(15, 23, 42, 0.5)'
          }}
        >
          <h2 className="text-xl font-semibold text-text-main" style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 600 }}>
            Product Details
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-bg-surface-hover text-text-muted transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6" style={{ padding: '1.5rem' }}>
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Product Name
            </label>
            <p className="text-lg font-medium text-text-main" style={{ color: 'var(--text-main)', fontSize: '1.125rem' }}>
              {product.name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <DollarSign size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Price</span>
              </div>
              <p className="text-xl font-mono font-semibold text-primary" style={{ color: 'var(--primary)', fontSize: '1.25rem', fontFamily: 'monospace' }}>
                {product.price}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Percent size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Discount</span>
              </div>
              <p className="text-lg font-medium text-success" style={{ color: 'var(--success)', fontSize: '1.125rem' }}>
                {product.discount || 'No discount'}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Brand</span>
              </div>
              <p className="text-base text-text-main" style={{ color: 'var(--text-main)' }}>
                {product.brand}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">Unit</span>
              </div>
              <p className="text-base text-text-main" style={{ color: 'var(--text-main)' }}>
                {product.unit || '-'}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-text-muted" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Tag size={14} />
                <span className="text-xs font-medium uppercase tracking-wider">ID</span>
              </div>
              <p className="text-sm font-mono text-text-muted" style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                {product.id}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-border" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <label className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Description
            </label>
            <p className="mt-2 text-sm leading-relaxed text-text-muted" style={{ color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.625' }}>
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
