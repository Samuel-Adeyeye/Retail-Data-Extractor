import React from 'react';
import { ScanLine, Download } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  hasData: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onExport, hasData }) => {
  return (
    <header 
      className="sticky top-0 z-40 w-full border-b border-border bg-bg-dark/80 backdrop-blur-md"
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 40, 
        width: '100%', 
        borderBottom: '1px solid var(--border)', 
        backgroundColor: 'rgba(15, 23, 42, 0.8)', 
        backdropFilter: 'blur(12px)' 
      }}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem', height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary" style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(6, 182, 212, 0.1)', color: 'var(--primary)' }}>
            <ScanLine size={24} />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-text-main" style={{ fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-main)' }}>
            Retail<span className="text-primary" style={{ color: 'var(--primary)' }}>Extractor</span>
          </h1>
        </div>

        <button
          onClick={onExport}
          disabled={!hasData}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${hasData 
              ? 'bg-primary text-bg-dark hover:bg-primary-hover shadow-lg shadow-primary/20' 
              : 'bg-bg-surface text-text-muted cursor-not-allowed'
            }
          `}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            backgroundColor: hasData ? 'var(--primary)' : 'var(--bg-surface)',
            color: hasData ? 'var(--bg-dark)' : 'var(--text-muted)',
            cursor: hasData ? 'pointer' : 'not-allowed',
            opacity: hasData ? 1 : 0.5
          }}
        >
          <Download size={16} />
          <span>Export JSON</span>
        </button>
      </div>
    </header>
  );
};
