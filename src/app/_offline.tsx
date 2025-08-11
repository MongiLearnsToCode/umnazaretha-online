'use client';

import { useTranslation } from "react-i18next";

export default function OfflinePage() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold">{t('offline_title')}</h1>
        <p className="mt-4">{t('offline_text')}</p>
      </div>
    </div>
  );
}
