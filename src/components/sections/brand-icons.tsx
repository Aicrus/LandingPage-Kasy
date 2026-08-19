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
  SiGooglegemini,
  SiMeta,
  SiMixpanel,
  SiRevenuecat,
  SiSentry,
  SiStripe,
  SiSupabase,
  SiWindsurf,
} from "@icons-pack/react-simple-icons";

import { cn } from "@/lib/utils";

export type IconComponent = (props: {
  size?: number | string;
  color?: string;
}) => React.ReactNode;

/** Logomark da OpenAI — não existe nesta versão do pacote simple-icons. */
export function OpenAiIcon({ size = 24, color = "currentColor" }: { size?: number | string; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1815a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.7899.7899 0 0 0-.407-.6765zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4592a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

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
  OpenAI: { Icon: OpenAiIcon, color: null },
  Gemini: { Icon: SiGooglegemini, color: "#8E75B2" },
  Mixpanel: { Icon: SiMixpanel, color: "#7856FF" },
  Sentry: { Icon: SiSentry, color: "#362D59" },
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
