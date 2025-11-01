import React, { useEffect, useState, useRef } from 'react';
import './AppBuilder.css';
import {Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useThemeStore } from '@/lib/store/themeStore';

export interface AppBuilderResultProps {
  childOrigin: string;
  projectId: string;
}

export const AppBuilder = React.memo<AppBuilderResultProps>(({
  childOrigin,
  projectId,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const theme = useThemeStore((state) => state.theme);
  const [isIframeReady, setIsIframeReady] = useState(false);

  // Listen for iframe ready signal
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure message is from the iframe (same origin)
      if (event.origin === window.location.origin && event.data?.type === 'iframe-ready') {
        setIsIframeReady(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  // Send data to iframe when ready or theme changes
  useEffect(() => {
    if (isIframeReady && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { projectId: projectId, theme: theme },
        window.location.origin
      );
    }
  }, [projectId, theme, isIframeReady]);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track fullscreen changes to update icon
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(document.fullscreenElement === iframeRef.current);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
    };
  }, [iframeRef]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      iframeRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="relative flex-1">
      <iframe id={`uncubed-iframe-${projectId}`}
          ref={iframeRef}
          src={childOrigin.replace('http://', 'https://')}
          className="w-full h-[800px] bg-white/[0.05] rounded-lg"
          allowFullScreen
          title="Child App"
        />
      <Button
        variant="glass"
        size="sm"
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 z-10 gap-2"
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4" />
        ) : (
          <Maximize2 className="w-4 h-4" />
        )}
      </Button>
    </div>
  );
});