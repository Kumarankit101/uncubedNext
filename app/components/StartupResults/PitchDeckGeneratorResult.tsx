import React, { useEffect, useState } from 'react';
import { useApiClient } from '@/lib/useApiClient';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useThemeStore } from '@/lib/store/themeStore';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// IndexedDB helpers for PDF caching
const DB_NAME = 'pdfCache';
const STORE_NAME = 'pdfs';

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getFromDB = async (key: string): Promise<any> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const setInDB = async (key: string, value: any): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(value, key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

const deleteFromDB = async (key: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(key);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
interface PitchDeckGeneratorResultProps {
  exportUrl: string;
  resultOutputId: string;
  shareLink: string;
  content: string; // JSON string containing blobName and possibly other info
}

const PitchDeckGeneratorResult = React.memo<PitchDeckGeneratorResultProps>(({
  exportUrl,
  resultOutputId,
  shareLink,
  content
}) => {
  const { callApi } = useApiClient();
  const { theme } = useThemeStore();
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [localBlobUrl, setLocalBlobUrl] = useState<string>('');
  const [pdfBlobLoading, setPdfBlobLoading] = useState(false);
  const [numPages, setNumPages] = useState<number>();

  // Set up PDF.js worker
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  }, []);

  // Step 1: Get SAS URL from backend
  useEffect(() => {
    let blobName = '';
    try {
      const parsed = JSON.parse(content);
      blobName = parsed?.blobName || '';
    } catch (err) {
      console.error('Invalid content JSON in PitchDeckGeneratorResult:', err);
    }

    if (!blobName) return;

    setLoading(true);
    setError('');
    callApi<{ sasToken: string }>('/azure-sas', {
      method: 'POST',
      body: JSON.stringify({ blobName })
    })
      .then((res) => {
        if (res?.sasToken) {
          setPdfUrl(res.sasToken);
        } else {
          setError('Failed to generate SAS URL');
        }
      })
      .catch((err) => {
        console.error('Error calling /azure-sas:', err);
        setError('Error generating SAS URL');
      })
      .finally(() => setLoading(false));
  }, [content, callApi]);

  // Step 2: Fetch PDF as blob when SAS URL changes, with IndexedDB caching
  useEffect(() => {
    const fetchPdf = async () => {
      if (!pdfUrl) return;

      let blobName = '';
      try {
        const parsed = JSON.parse(content);
        blobName = parsed?.blobName || '';
      } catch (err) {
        console.error('Invalid content JSON in PitchDeckGeneratorResult:', err);
      }

      if (!blobName) return;

      const cacheKey = `pdf_${blobName}`;
      setPdfBlobLoading(true);

      // Check cache
      try {
        const cached = await getFromDB(cacheKey);
        if (cached) {
          const { dataUrl, timestamp } = cached;
          const now = Date.now();
          if (now - timestamp < 2 * 60 * 60 * 1000) { // 2 hours
            setLocalBlobUrl(dataUrl);
            setPdfBlobLoading(false);
            return;
          } else {
            await deleteFromDB(cacheKey);
          }
        }
      } catch (err) {
        console.error('Error checking PDF cache:', err);
      }

      // Fetch and cache
      try {
        const res = await fetch(pdfUrl);
        const blob = await res.blob();
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string;
          setLocalBlobUrl(dataUrl);
          // Cache the data URL in IndexedDB
          try {
            const cacheData = { dataUrl, timestamp: Date.now() };
            await setInDB(cacheKey, cacheData);
          } catch (err) {
            console.error('Error caching PDF in IndexedDB:', err);
          }
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error('Failed to fetch and create blob URL for PDF:', err);
        setError('Unable to load PDF content.');
      } finally {
        setPdfBlobLoading(false);
      }
    };

    fetchPdf();
  }, [pdfUrl, content]);

  if (!content) {
    return <p>No pitch deck generated yet.</p>;
  }

  if (loading || pdfBlobLoading) {
    return <p>Loading PDF...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!localBlobUrl) {
    return <p>No PDF available.</p>;
  }

  return (
    <div
      className={`relative p-8 rounded-3xl transition-all duration-200 flex flex-col min-h-0 w-full ${
        theme === 'dark'
          ? 'bg-white/[0.03] backdrop-blur-md border border-white/[0.08] shadow-[0_0_15px_rgba(255,255,255,0.15)]'
          : 'bg-white/90 backdrop-blur-md border border-gray-200/60 shadow-gray-200/60'
      }`}
      style={{
        borderRadius: '30px',
        boxShadow: theme === 'dark' ? '0 0 15px rgba(255,255,255,0.15)' : undefined,
        maxWidth: '100%',
        overflowX: 'hidden'
      }}
    >
      <div className="w-full flex-1 overflow-auto min-h-0 max-w-full">
        <Document
          file={localBlobUrl}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          onLoadError={(error) => setError(`Failed to load PDF: ${error.message}`)}
          loading={<p className="p-4 text-gray-700 text-center dark:text-gray-300">Loading PDF...</p>}
          error={<p className="p-4 text-red-500 text-center">Failed to load PDF. <a href={localBlobUrl} target="_blank" rel="noopener noreferrer" className="underline">Download instead</a>.</p>}
        >
          {Array.from(new Array(numPages), (el, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              scale={1.2}
              className="mb-4"
              width={window.innerWidth > 1200 ? 800 : window.innerWidth - 100}
            />
          ))}
        </Document>
      </div>

      {/* Footer actions */}
      <div
        className={`flex items-center justify-between mt-8 pt-6 ${
          theme === 'dark'
            ? 'border-t border-white/10'
            : 'border-t border-gray-200/60'
        }`}
      >
        <div className={`text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-light-600'
        }`}>
          {numPages ? `${numPages} page${numPages > 1 ? 's' : ''} • Ready to export` : 'PDF loaded'}
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="glass"
            size="sm"
            onClick={() => window.open(localBlobUrl, '_blank')}
            className={`gap-2 transition-all duration-200 ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-light-200/50'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            Open
          </Button>
          <Button
            variant="glass"
            size="sm"
            onClick={() => {
              const a = document.createElement('a');
              a.href = localBlobUrl;
              a.download = 'PitchDeck.pdf';
              a.click();
            }}
            className={`gap-2 transition-all duration-200 ${
              theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-light-200/50'
            }`}
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </div>
    </div>
  );
});

export default PitchDeckGeneratorResult;
export { PitchDeckGeneratorResult };