import { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { DataTable } from './components/DataTable';
import { Modal } from './components/Modal';
import type { Product } from './types';
import { extractDataFromImage } from './services/api';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setProducts([]); // Clear previous results

    try {
      const extractedProducts = await extractDataFromImage(file);
      setProducts(extractedProducts);
    } catch (error) {
      console.error('Extraction failed:', error);
      alert('Failed to extract data. Please check your API key and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-bg-dark text-text-main font-sans">
      <Header onExport={handleExport} hasData={products.length > 0} />
      
      <main className="container mx-auto px-6 py-8 space-y-8" style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <section className="max-w-2xl mx-auto">
          <UploadZone onFileSelect={handleFileSelect} isProcessing={isProcessing} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-main" style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              Extracted Data
              {products.length > 0 && (
                <span className="ml-3 text-sm font-normal text-text-muted px-2 py-1 rounded-md bg-bg-surface border border-border">
                  {products.length} items found
                </span>
              )}
            </h2>
          </div>
          
          <DataTable 
            products={products} 
            onProductClick={setSelectedProduct} 
          />
        </section>
      </main>

      <Modal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </div>
  );
}

export default App;
