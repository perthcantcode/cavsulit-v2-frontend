import React, { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [offline, setOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const onOff = () => setOffline(true);
    const onOn  = () => setOffline(false);
    window.addEventListener('offline', onOff);
    window.addEventListener('online', onOn);
    return () => {
      window.removeEventListener('offline', onOff);
      window.removeEventListener('online', onOn);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[9997] bg-amber-500/95 text-amber-950 text-sm font-medium py-2.5 px-4 text-center shadow-lg">
      You&apos;re offline. Some features may not work.
    </div>
  );
}
