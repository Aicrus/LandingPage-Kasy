import { getLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { isCheckoutPlan } from "@/lib/stripe/catalog";

function clubLoginUrl(locale: string) {
  const base = (process.env.NEXT_PUBLIC_CLUB_URL ?? "https://club.kasy.dev").replace(
    /\/$/,
    "",
  );
  return `${base}/${locale}/login`;
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const plan = isCheckoutPlan(params.plan) ? params.plan : "annual";
  const isCombo = plan === "kitCourse";
  const locale = await getLocale();
  const t = await getTranslations(
    isCombo ? "checkout.successCombo" : "checkout.success",
  );

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {t("eyebrow")}
      </p>
      <h1 className="mt-4 font-heading text-3xl font-bold tracking-[-0.02em] text-foreground">
        {t("heading")}
      </h1>
      <p className="mt-4 text-pretty text-muted-foreground">{t("body")}</p>
      <p className="mt-3 text-pretty text-[0.875rem] text-muted-foreground/80">
        {t("emailHint")}
      </p>

      <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
        <Button
          nativeButton={false}
          className="rounded-full px-6"
          render={<Link href="/docs" />}
        >
          {t("cta")}
        </Button>
        {isCombo ? (
          <Button
            variant="outline"
            nativeButton={false}
            className="rounded-full px-6"
            render={
              <a href={clubLoginUrl(locale)} rel="noopener noreferrer" />
            }
          >
            {t("ctaClub")}
          </Button>
        ) : null}
      </div>
    </main>
  );
}
