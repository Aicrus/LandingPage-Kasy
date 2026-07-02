import { Bell, Globe, ToggleRight, Webhook } from "lucide-react";
import {
  SiAndroid,
  SiApple,
  SiClaude,
  SiCodemagic,
  SiCursor,
  SiFacebook,
  SiFirebase,
  SiGoogleadmob,
  SiMeta,
  SiRevenuecat,
  SiStripe,
  SiSupabase,
  SiWindsurf,
} from "@icons-pack/react-simple-icons";

import { cn } from "@/lib/utils";

export type IconComponent = (props: {
  size?: number | string;
  color?: string;
}) => React.ReactNode;

/** G colorido oficial — os logos monocromáticos de simple-icons não têm essa versão. */
export function GoogleGIcon({ size = 24 }: { size?: number | string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

/** Mapa central de logos de marca — usado em qualquer seção que precise mostrar "roda com X, Y, Z". */
export const BRAND_ICONS: Record<
  string,
  { Icon: IconComponent; color: string | null }
> = {
  Google: { Icon: GoogleGIcon, color: null },
  Apple: { Icon: SiApple, color: null },
  Facebook: { Icon: SiFacebook, color: "#0866FF" },
  RevenueCat: { Icon: SiRevenuecat, color: "#F2545B" },
  Stripe: { Icon: SiStripe, color: "#635BFF" },
  AdMob: { Icon: SiGoogleadmob, color: "#EA4335" },
  "Meta Ads": { Icon: SiMeta, color: "#0467DF" },
  FCM: { Icon: Bell, color: "#F59E0B" },
  "Firebase Cloud Messaging": { Icon: Bell, color: "#F59E0B" },
  Firebase: { Icon: SiFirebase, color: "#DD2C00" },
  Supabase: { Icon: SiSupabase, color: "#3FCF8E" },
  "REST API": { Icon: Webhook, color: null },
  iOS: { Icon: SiApple, color: null },
  Android: { Icon: SiAndroid, color: "#3DDC84" },
  Web: { Icon: Globe, color: "#38BDF8" },
  Codemagic: { Icon: SiCodemagic, color: "#F45E3F" },
  Cursor: { Icon: SiCursor, color: null },
  "Claude Code": { Icon: SiClaude, color: "#D97757" },
  Claude: { Icon: SiClaude, color: "#D97757" },
  Windsurf: { Icon: SiWindsurf, color: null },
  "UI Kit": { Icon: ToggleRight, color: "#22C55E" },
};

export function BrandTile({
  name,
  size = "size-9",
  iconSize = 17,
  className,
  pill = false,
}: {
  name: string;
  size?: string;
  iconSize?: number;
  className?: string;
  /** Ícone circular proporcional ao `font-size` do pai — para pills compactas. */
  pill?: boolean;
}) {
  const entry = BRAND_ICONS[name];
  const commonClass = cn(
    "flex shrink-0 items-center justify-center",
    pill ? "size-[1.55em] rounded-full" : cn("rounded-lg", size),
    className,
  );
  const resolvedIconSize = pill ? "58%" : iconSize;

  if (!entry) {
    return (
      <span
        title={name}
        aria-hidden
        className={cn(
          commonClass,
          "bg-muted text-[0.65rem] font-bold text-muted-foreground",
        )}
      >
        {name.charAt(0)}
      </span>
    );
  }

  const glow = entry.color ?? "var(--foreground)";

  return (
    <span
      title={name}
      aria-hidden
      className={commonClass}
      style={{
        backgroundColor: `color-mix(in srgb, ${glow} 14%, transparent)`,
      }}
    >
      <entry.Icon size={resolvedIconSize} color={glow} />
    </span>
  );
}
