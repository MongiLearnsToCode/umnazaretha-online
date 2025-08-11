'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function SubscribePage() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t('subscribe')}</CardTitle>
          <CardDescription>{t('subscribe_description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{t('subscribe_text')}</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">{t('subscribe_now')}</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
