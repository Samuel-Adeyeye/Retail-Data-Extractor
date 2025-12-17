import React, { useState, useCallback } from 'react';
import { Upload, FileImage, Loader2 } from 'lucide-react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300
        ${isDragging 
          ? 'border-primary bg-primary/10' 
          : 'border-border bg-bg-surface hover:border-primary/50'
        }
        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        borderColor: isDragging ? 'var(--primary)' : 'var(--border)',
        backgroundColor: isDragging ? 'rgba(6, 182, 212, 0.1)' : 'var(--bg-surface)',
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      }}
    >
      <input
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 cursor-pointer"
        onChange={handleFileInput}
        disabled={isProcessing}
      />
      
      <div className="flex flex-col items-center gap-4 text-center p-6">
        <div 
          className="p-4 rounded-full bg-bg-dark"
          style={{ backgroundColor: 'var(--bg-dark)' }}
        >
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" size={32} color="var(--primary)" />
          ) : (
            <Upload className="w-8 h-8 text-primary" size={32} color="var(--primary)" />
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-text-main" style={{ color: 'var(--text-main)', fontSize: '1.25rem', fontWeight: 600 }}>
            {isProcessing ? 'Analyzing Leaflet & Extracting Data...' : 'Upload Retail Leaflet'}
          </h3>
          <p className="text-text-muted" style={{ color: 'var(--text-muted)' }}>
            {isProcessing ? 'This may take a few seconds' : 'Drag & drop or click to browse'}
          </p>
        </div>
        
        {!isProcessing && (
          <div className="flex items-center gap-2 text-xs text-text-muted px-3 py-1 rounded-full border border-border" style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '9999px', padding: '0.25rem 0.75rem', marginTop: '1rem' }}>
            <FileImage size={14} />
            <span>Supports JPG, PNG, WEBP</span>
          </div>
        )}
      </div>
    </div>
  );
};
