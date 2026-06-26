/**
 * Pasta (manilha) em SVG — cor pêssego/terracota da imagem de referência.
 * Desenhada em duas camadas para que os cards fiquem "dentro" dela:
 *   FolderBack  → parede traseira + aba (atrás dos cards)
 *   FolderFront → bolso frontal + brilho do topo (na frente dos cards)
 * As cores são fixas (warm) nos dois temas — é um acento de marca proposital.
 */
import type { SVGProps } from "react";

const VIEW_W = 300;
const VIEW_H = 212;

export function FolderBack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient id="folder-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2C8A4" />
          <stop offset="1" stopColor="#E6AC82" />
        </linearGradient>
      </defs>
      {/* parede traseira + aba */}
      <path
        d="M16 44h84a8 8 0 0 1 5.7 2.4l8.4 8.6H284a14 14 0 0 1 14 14v118a14 14 0 0 1-14 14H16a14 14 0 0 1-14-14V58a14 14 0 0 1 14-14Z"
        fill="url(#folder-back)"
      />
      {/* linha de dobra superior interna (profundidade) */}
      <path
        d="M2 70h296"
        stroke="#C98B5E"
        strokeOpacity="0.28"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function FolderFront(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient id="folder-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F0C49E" />
          <stop offset="1" stopColor="#E2A276" />
        </linearGradient>
        <linearGradient id="folder-front-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.07" />
          <stop offset="0.18" stopColor="#000" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* bolso frontal — topo com leve concavidade central (cards espreitam) */}
      <path
        d="M6 118q0-14 14-14h112q18 8 36 0h112q14 0 14 14v76q0 14-14 14H20q-14 0-14-14Z"
        fill="url(#folder-front)"
      />
      <path
        d="M6 118q0-14 14-14h112q18 8 36 0h112q14 0 14 14v76q0 14-14 14H20q-14 0-14-14Z"
        fill="url(#folder-front-shade)"
      />
      {/* brilho do lábio superior */}
      <path
        d="M20 105.5h112q18 7.8 36 0h112"
        stroke="#FFF"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const FOLDER_DIMENSIONS = { width: VIEW_W, height: VIEW_H };
