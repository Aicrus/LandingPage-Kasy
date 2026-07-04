import { redirect } from "@/i18n/navigation";

export default async function ObterKasyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/#precos", locale });
}
