import { getTranslations } from "next-intl/server";

import { ArrowUpRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Confetti, SuccessBadge } from "@/components/checkout/confetti";
import { CopyCommand } from "@/components/checkout/copy-command";
import { PurchaseTracker } from "@/components/analytics/purchase-tracker";
import { Button } from "@/components/ui/button";
import { isCheckoutPlan } from "@/lib/stripe/catalog";
import { getStripe } from "@/lib/stripe/server";

/** Valor real pago, para as conversões. Falha aqui não quebra a página. */
async function purchaseAmount(sessionId: string | undefined) {
  if (!sessionId) return null;

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid" || session.amount_total === null) {
      return null;
    }
    return { amountTotal: session.amount_total, currency: session.currency ?? "usd" };
  } catch (error) {
    console.error("[checkout-success]", error);
    return null;
  }
}

type Step = { title: string; body: string; prompt?: string };

const INSTALL_COMMAND = "curl -fsSL https://kasy.dev/install | bash";
const INSTALL_COMMAND_WINDOWS = "irm https://kasy.dev/install.ps1 | iex";
const FLOWS_URL = "https://flows.kasy.dev";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  const plan = isCheckoutPlan(params.plan) ? params.plan : "annual";
  const t = await getTranslations("checkout.success");
  const amount = await purchaseAmount(params.session_id);
  const steps = t.raw("steps") as Step[];

  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center px-4 pb-14 pt-[calc(var(--header-height-mobile)+1.75rem)] text-center sm:px-6 sm:py-20">
      <Confetti />
      {params.session_id ? (
        <PurchaseTracker
          eventId={params.session_id}
          plan={plan}
          valueCents={amount?.amountTotal}
          currency={amount?.currency}
        />
      ) : null}

      <SuccessBadge />
      <h1 className="mt-5 font-heading text-3xl font-bold tracking-[-0.02em] text-foreground sm:text-4xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-sm text-pretty text-muted-foreground">{t("body")}</p>

      <ol className="mt-10 flex w-full flex-col gap-3 text-left">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="flex gap-2.5 rounded-2xl border border-border/70 bg-card p-4 sm:gap-4 sm:p-5 shadow-[0_1px_2px_rgba(4,43,89,0.04),0_6px_16px_-10px_rgba(4,43,89,0.12)] dark:shadow-none"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-heading text-[0.9375rem] font-semibold text-foreground">
                {step.title}
              </h2>
              <p className="mt-1 text-[0.875rem] leading-snug text-muted-foreground">
                {step.body}
              </p>
              {i === 0 ? (
                <>
                  <p className="mt-3 text-xs font-medium text-muted-foreground">
                    {t("installMac")}
                  </p>
                  <CopyCommand
                    value={INSTALL_COMMAND}
                    copyLabel={t("copy")}
                    copiedLabel={t("copied")}
                    className="mt-1.5"
                  />
                  <p className="mt-3 text-xs font-medium text-muted-foreground">
                    {t("installWin")}
                  </p>
                  <CopyCommand
                    value={INSTALL_COMMAND_WINDOWS}
                    copyLabel={t("copy")}
                    copiedLabel={t("copied")}
                    className="mt-1.5"
                  />
                </>
              ) : null}
              {step.prompt ? (
                <CopyCommand
                  value={step.prompt}
                  copyLabel={t("copy")}
                  copiedLabel={t("copied")}
                  className="mt-3"
                />
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
        <Button
          nativeButton={false}
          className="rounded-full px-6"
          render={<Link href="/docs/instalar-cli#1-caminho-recomendado-mcp" />}
        >
          {t("ctaInstall")}
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          className="gap-1.5 rounded-full px-6"
          render={<a href={FLOWS_URL} target="_blank" rel="noopener noreferrer" />}
        >
          {t("ctaFlows")}
          <ArrowUpRight className="size-4" />
        </Button>
      </div>

      {plan === "annual" ? (
        <p className="mt-6 max-w-sm text-pretty text-[0.75rem] text-muted-foreground/70">
          {t("renewal")}
        </p>
      ) : null}
    </main>
  );
}
