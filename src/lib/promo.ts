/**
 * Promoção em destaque na faixa fixa do topo do site.
 *
 * Para encerrar a campanha: `ACTIVE_PROMO = null` (a faixa some e o menu volta
 * para o topo). O cupom em si vive na Stripe (promotion code, sem restrição de
 * produto, então vale para Solo e Founder) e precisa ser desativado lá também.
 */
export type SitePromo = {
  code: string;
  percent: number;
};

export const ACTIVE_PROMO: SitePromo | null = {
  code: "BLACKFRIDAY40",
  percent: 40,
};
