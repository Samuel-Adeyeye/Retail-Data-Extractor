import React from 'react';
import type { Product } from '../types';
import { ChevronRight } from 'lucide-react';

interface DataTableProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ products, onProductClick }) => {
  if (products.length === 0) {
    return (
      <div 
        className="w-full p-12 text-center rounded-xl border border-border bg-bg-surface"
        style={{ 
          border: '1px solid var(--border)', 
          backgroundColor: 'var(--bg-surface)', 
          padding: '3rem', 
          borderRadius: '0.75rem',
          color: 'var(--text-muted)'
        }}
      >
        <p>No products extracted yet. Upload a leaflet to begin.</p>
      </div>
    );
  }

  return (
    <div 
      className="w-full overflow-hidden rounded-xl border border-border bg-bg-surface"
      style={{ 
        border: '1px solid var(--border)', 
        backgroundColor: 'var(--bg-surface)', 
        borderRadius: '0.75rem',
        overflow: 'hidden'
      }}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
              <th className="p-4 text-sm font-medium text-text-muted" style={{ color: 'var(--text-muted)', padding: '1rem' }}>Product Name</th>
              <th className="p-4 text-sm font-medium text-text-muted" style={{ color: 'var(--text-muted)', padding: '1rem' }}>Brand</th>
              <th className="p-4 text-sm font-medium text-text-muted" style={{ color: 'var(--text-muted)', padding: '1rem' }}>Unit</th>
              <th className="p-4 text-sm font-medium text-text-muted" style={{ color: 'var(--text-muted)', padding: '1rem' }}>Price</th>
              <th className="p-4 text-sm font-medium text-text-muted" style={{ color: 'var(--text-muted)', padding: '1rem' }}>Discount</th>
              <th className="p-4 text-sm font-medium text-text-muted" style={{ color: 'var(--text-muted)', padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr 
                key={product.id}
                onClick={() => onProductClick(product)}
                className="group cursor-pointer transition-colors hover:bg-bg-surface-hover"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <td className="p-4 font-medium text-text-main" style={{ color: 'var(--text-main)', padding: '1rem' }}>
                  {product.name}
                </td>
                <td className="p-4 text-text-muted" style={{ color: 'var(--text-muted)', padding: '1rem' }}>
                  {product.brand}
                </td>
                <td className="p-4 text-text-muted" style={{ color: 'var(--text-muted)', padding: '1rem' }}>
                  {product.unit || '-'}
                </td>
                <td className="p-4 font-mono text-primary" style={{ color: 'var(--primary)', padding: '1rem', fontFamily: 'monospace' }}>
                  {product.price}
                </td>
                <td className="p-4 text-success" style={{ color: 'var(--success)', padding: '1rem' }}>
                  {product.discount || '-'}
                </td>
                <td className="p-4" style={{ padding: '1rem' }}>
                  <button 
                    className="p-2 rounded-lg hover:bg-bg-dark text-text-muted hover:text-primary transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
