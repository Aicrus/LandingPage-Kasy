/**
 * Pasta (manilha) em SVG — acento pêssego/terracota da marca.
 * Duas camadas para os cards ficarem "dentro":
 *   FolderBack  → parede traseira, aba 3D, interior e bordas laterais
 *   FolderFront → bolso frontal com espessura de papel e lábio curvo
 */
import type { SVGProps } from "react";

const VIEW_W = 300;
const VIEW_H = 212;

const uid = "folder";

export function FolderBack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      aria-hidden
      {...props}
    >
      <defs>
        <linearGradient
          id={`${uid}-back-body`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop offset="0" stopColor="#F4D0AE" />
          <stop offset="0.45" stopColor="#E8B48A" />
          <stop offset="1" stopColor="#D99A6E" />
        </linearGradient>
        <linearGradient
          id={`${uid}-back-interior`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0" stopColor="#C9895C" stopOpacity="0.22" />
          <stop offset="0.35" stopColor="#B87A4F" stopOpacity="0.38" />
          <stop offset="1" stopColor="#A66B42" stopOpacity="0.52" />
        </linearGradient>
        <linearGradient
          id={`${uid}-tab-top`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0" stopColor="#FAE2C8" />
          <stop offset="0.55" stopColor="#EFC9A2" />
          <stop offset="1" stopColor="#E0AD7E" />
        </linearGradient>
        <linearGradient
          id={`${uid}-edge-left`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0" stopColor="#B87A4F" stopOpacity="0.55" />
          <stop offset="1" stopColor="#B87A4F" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${uid}-edge-right`}
          x1="1"
          y1="0"
          x2="0"
          y2="0"
        >
          <stop offset="0" stopColor="#FFF" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFF" stopOpacity="0" />
        </linearGradient>
        <filter
          id={`${uid}-back-shadow`}
          x="-8%"
          y="-4%"
          width="116%"
          height="112%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dx="0"
            dy="6"
            stdDeviation="8"
            floodColor="#8B5A35"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      <g filter={`url(#${uid}-back-shadow)`}>
        {/* corpo traseiro — leve perspectiva (mais largo embaixo) */}
        <path
          d="M10 54 L8 196 Q8 206 18 206 L282 206 Q292 206 292 196 L290 54 Q290 48 284 48 L118 48 L106 34 Q104 30 98 30 L58 30 Q52 30 50 34 L38 48 L16 48 Q10 48 10 54 Z"
          fill={`url(#${uid}-back-body)`}
        />

        {/* aba — face superior iluminada */}
        <path
          d="M50 34 L58 30 L98 30 L106 34 L102 38 L54 38 Z"
          fill={`url(#${uid}-tab-top)`}
        />
        {/* sombra sob a aba */}
        <path
          d="M38 48 L50 34 L106 34 L118 48"
          fill="#A66B42"
          fillOpacity="0.14"
        />
        {/* filete de luz no topo da aba */}
        <path
          d="M56 31.5 L100 31.5"
          stroke="#FFF"
          strokeOpacity="0.55"
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        {/* interior — piso recuado visível acima do bolso */}
        <path
          d="M18 72 L282 72 L282 116 Q282 122 276 122 L24 122 Q18 122 18 116 Z"
          fill={`url(#${uid}-back-interior)`}
        />

        {/* dobra horizontal interna */}
        <path
          d="M16 72 H284"
          stroke="#A66B42"
          strokeOpacity="0.2"
          strokeWidth="1.25"
        />
        <path
          d="M16 72.8 H284"
          stroke="#FFF"
          strokeOpacity="0.12"
          strokeWidth="0.75"
        />

        {/* profundidade lateral esquerda */}
        <path
          d="M10 54 L18 72 V122 L16 196 Q16 202 18 206 L10 206 Q8 206 8 196 V54 Z"
          fill={`url(#${uid}-edge-left)`}
        />
        {/* filete direito iluminado */}
        <path
          d="M290 54 L282 72 V196 Q282 202 280 206 L290 206 V54 Z"
          fill={`url(#${uid}-edge-right)`}
        />

        {/* contorno sutil */}
        <path
          d="M10 54 L8 196 Q8 206 18 206 L282 206 Q292 206 292 196 L290 54 Q290 48 284 48 L118 48 L106 34 Q104 30 98 30 L58 30 Q52 30 50 34 L38 48 L16 48 Q10 48 10 54 Z"
          stroke="#C98B5E"
          strokeOpacity="0.35"
          strokeWidth="0.75"
        />
      </g>
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
        <linearGradient
          id={`${uid}-front-body`}
          x1="0"
          y1="0"
          x2="0.15"
          y2="1"
        >
          <stop offset="0" stopColor="#F2CAA4" />
          <stop offset="0.4" stopColor="#E8B48A" />
          <stop offset="1" stopColor="#D49568" />
        </linearGradient>
        <linearGradient
          id={`${uid}-front-lip-shade`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0" stopColor="#000" stopOpacity="0.14" />
          <stop offset="0.22" stopColor="#000" stopOpacity="0.04" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${uid}-front-pocket-depth`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0" stopColor="#A66B42" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#A66B42" stopOpacity="0.08" />
          <stop offset="1" stopColor="#A66B42" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${uid}-front-thickness`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0" stopColor="#C9895C" />
          <stop offset="0.5" stopColor="#B87A4F" />
          <stop offset="1" stopColor="#9A6340" />
        </linearGradient>
        <linearGradient
          id={`${uid}-front-side-left`}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="0" stopColor="#B87A4F" stopOpacity="0.42" />
          <stop offset="1" stopColor="#B87A4F" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${uid}-front-side-right`}
          x1="1"
          y1="0"
          x2="0"
          y2="0"
        >
          <stop offset="0" stopColor="#FFF" stopOpacity="0.22" />
          <stop offset="1" stopColor="#FFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* sombra de profundidade no bolso (atrás do lábio) */}
      <path
        d="M14 108 Q14 98 24 98 H118 Q150 112 182 98 H276 Q286 98 286 108 V118 H14 Z"
        fill={`url(#${uid}-front-pocket-depth)`}
      />

      {/* bolso frontal — topo côncavo, laterais com leve ângulo */}
      <path
        d="M8 116 Q8 104 20 104 H114 Q150 118 186 104 H280 Q292 104 292 116 V182 Q292 196 278 196 H22 Q8 196 8 182 Z"
        fill={`url(#${uid}-front-body)`}
      />

      {/* vinheta superior */}
      <path
        d="M8 116 Q8 104 20 104 H114 Q150 118 186 104 H280 Q292 104 292 116 V182 Q292 196 278 196 H22 Q8 196 8 182 Z"
        fill={`url(#${uid}-front-lip-shade)`}
      />

      {/* bordas laterais — espessura do papel */}
      <path
        d="M8 116 L20 104 V182 L14 190 Q8 194 8 182 Z"
        fill={`url(#${uid}-front-side-left)`}
      />
      <path
        d="M292 116 L280 104 V182 L286 190 Q292 194 292 182 Z"
        fill={`url(#${uid}-front-side-right)`}
      />

      {/* lábio superior — brilho + sombra */}
      <path
        d="M22 103.5 H114 Q150 117.5 186 103.5 H278"
        stroke="#FFF"
        strokeOpacity="0.58"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M22 106 H114 Q150 120 186 106 H278"
        stroke="#A66B42"
        strokeOpacity="0.16"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* faixa de espessura na base — borda 3D */}
      <path
        d="M22 196 H278 Q286 196 288 200 V204 Q286 208 278 208 H22 Q14 208 12 204 V200 Q14 196 22 196 Z"
        fill={`url(#${uid}-front-thickness)`}
      />
      <path
        d="M22 196.5 H278"
        stroke="#FFF"
        strokeOpacity="0.2"
        strokeWidth="0.75"
      />

      {/* contorno */}
      <path
        d="M8 116 Q8 104 20 104 H114 Q150 118 186 104 H280 Q292 104 292 116 V182 Q292 196 278 196 H22 Q8 196 8 182 Z"
        stroke="#C98B5E"
        strokeOpacity="0.3"
        strokeWidth="0.75"
      />
    </svg>
  );
}

export const FOLDER_DIMENSIONS = { width: VIEW_W, height: VIEW_H };
