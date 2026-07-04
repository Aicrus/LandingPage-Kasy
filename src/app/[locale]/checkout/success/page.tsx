import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function CheckoutSuccessPage() {
  const t = await getTranslations("checkout.success");

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-heading text-3xl font-bold tracking-[-0.02em] text-foreground">
        {t("heading")}
      </h1>
      <p className="mt-4 text-pretty text-muted-foreground">{t("body")}</p>
      <Button
        nativeButton={false}
        className="mt-8 rounded-full px-6"
        render={<Link href="/docs" />}
      >
        {t("cta")}
      </Button>
    </main>
  );
}
