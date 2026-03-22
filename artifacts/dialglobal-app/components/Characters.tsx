import React from "react";
import { SvgXml } from "react-native-svg";

/* ─── SHARED FACE ANATOMY (more human-like) ───────────────────────────────
   Skin: #FBBF7C | Hair: #2D1500 | Iris: #5C3A1E | Jacket: #3730A3
   Eyes: white sclera + brown iris + black pupil + white catchlight
   Nose: soft V bridge + nostril hints | Lips: M-curve upper + arc lower  */

const GLOB_HOLDER = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="196" rx="52" ry="8" fill="rgba(0,0,0,0.11)"/>
  <line x1="86" y1="162" x2="80" y2="193" stroke="#1E1B4B" stroke-width="13" stroke-linecap="round"/>
  <line x1="114" y1="162" x2="120" y2="193" stroke="#1E1B4B" stroke-width="13" stroke-linecap="round"/>
  <ellipse cx="79" cy="193" rx="12" ry="5" fill="#111827"/>
  <ellipse cx="121" cy="193" rx="12" ry="5" fill="#111827"/>
  <path d="M70 114 Q67 140 69 162 Q80 170 100 170 Q120 170 131 162 Q133 140 130 114 Z" fill="#3730A3"/>
  <path d="M70 114 Q68 140 69 162 Q74 168 82 169 L82 114 Z" fill="rgba(0,0,0,0.10)"/>
  <path d="M88 116 L100 136 L112 116" fill="white"/>
  <circle cx="100" cy="130" r="2" fill="#E8A020"/>
  <rect x="91" y="101" width="18" height="16" rx="5" fill="#FBBF7C"/>
  <path d="M70 122 Q50 128 44 152" stroke="#3730A3" stroke-width="14" stroke-linecap="round" fill="none"/>
  <circle cx="42" cy="154" r="10" fill="#FBBF7C"/>
  <path d="M130 122 Q150 128 156 152" stroke="#3730A3" stroke-width="14" stroke-linecap="round" fill="none"/>
  <circle cx="158" cy="154" r="10" fill="#FBBF7C"/>
  <circle cx="100" cy="168" r="26" fill="#DBEAFE"/>
  <path d="M84 161 Q90 155 98 159 Q104 157 108 163 Q114 159 118 165 Q120 171 116 175 Q110 178 104 174 Q98 176 92 172 Q86 173 82 167 Q80 164 84 161Z" fill="#6EE7B7" opacity="0.75"/>
  <ellipse cx="100" cy="168" rx="26" ry="9" stroke="rgba(37,99,235,0.18)" stroke-width="1" fill="none"/>
  <line x1="100" y1="142" x2="100" y2="194" stroke="rgba(37,99,235,0.12)" stroke-width="1"/>
  <circle cx="91" cy="159" r="6" fill="white" opacity="0.2"/>
  <circle cx="100" cy="168" r="26" stroke="#BFDBFE" stroke-width="1.5" fill="none"/>
  <path d="M69 68 Q62 72 62 80 Q62 88 69 92" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <path d="M131 68 Q138 72 138 80 Q138 88 131 92" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <ellipse cx="100" cy="73" rx="31" ry="33" fill="#FBBF7C"/>
  <ellipse cx="92" cy="60" rx="14" ry="10" fill="rgba(255,220,160,0.28)"/>
  <path d="M69 68 Q70 42 100 40 Q130 42 131 68 Q124 50 100 50 Q76 50 69 68Z" fill="#2D1500"/>
  <path d="M73 66 Q75 48 100 46 Q125 48 127 66 Q120 52 100 52 Q80 52 73 66Z" fill="#3D2000"/>
  <path d="M83 47 Q97 43 115 47" stroke="rgba(120,60,10,0.25)" stroke-width="4" stroke-linecap="round" fill="none"/>
  <rect x="68" y="67" width="6" height="12" rx="3" fill="#2D1500"/>
  <rect x="126" y="67" width="6" height="12" rx="3" fill="#2D1500"/>
  <path d="M77 61 Q85 56 93 60" stroke="#2D1500" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <path d="M107 60 Q115 56 123 61" stroke="#2D1500" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <ellipse cx="86" cy="71" rx="7.5" ry="6" fill="white"/>
  <circle cx="86" cy="71" r="4" fill="#5C3A1E"/>
  <circle cx="86" cy="71" r="2.3" fill="#150800"/>
  <circle cx="88.2" cy="69" r="1.4" fill="white"/>
  <path d="M78.5 68 Q86 64 93.5 68" stroke="#1C0A00" stroke-width="1.3" stroke-linecap="round" fill="none"/>
  <ellipse cx="114" cy="71" rx="7.5" ry="6" fill="white"/>
  <circle cx="114" cy="71" r="4" fill="#5C3A1E"/>
  <circle cx="114" cy="71" r="2.3" fill="#150800"/>
  <circle cx="116.2" cy="69" r="1.4" fill="white"/>
  <path d="M106.5 68 Q114 64 121.5 68" stroke="#1C0A00" stroke-width="1.3" stroke-linecap="round" fill="none"/>
  <path d="M100 76 Q97 83 95 87" stroke="rgba(180,100,40,0.28)" stroke-width="1.3" stroke-linecap="round" fill="none"/>
  <path d="M100 76 Q103 83 105 87" stroke="rgba(180,100,40,0.28)" stroke-width="1.3" stroke-linecap="round" fill="none"/>
  <ellipse cx="95.5" cy="87.5" rx="2.8" ry="2" fill="rgba(160,80,30,0.14)"/>
  <ellipse cx="104.5" cy="87.5" rx="2.8" ry="2" fill="rgba(160,80,30,0.14)"/>
  <path d="M89 94 Q95 90 100 92.5 Q105 90 111 94" stroke="#C07850" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M89 94 Q100 102 111 94" stroke="#C07850" stroke-width="1.6" stroke-linecap="round" fill="none"/>
  <path d="M91 94 Q100 101 109 94 Q100 96.5 91 94Z" fill="rgba(200,110,70,0.18)"/>
  <circle cx="76" cy="82" r="9" fill="rgba(248,113,113,0.12)"/>
  <circle cx="124" cy="82" r="9" fill="rgba(248,113,113,0.12)"/>
</svg>`;

const MID_CALL = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="196" rx="52" ry="8" fill="rgba(0,0,0,0.11)"/>
  <line x1="86" y1="162" x2="82" y2="193" stroke="#1E1B4B" stroke-width="13" stroke-linecap="round"/>
  <line x1="114" y1="162" x2="118" y2="193" stroke="#1E1B4B" stroke-width="13" stroke-linecap="round"/>
  <ellipse cx="80" cy="193" rx="12" ry="5" fill="#111827"/>
  <ellipse cx="120" cy="193" rx="12" ry="5" fill="#111827"/>
  <path d="M70 114 Q67 140 69 162 Q80 170 100 170 Q120 170 131 162 Q133 140 130 114 Z" fill="#3730A3"/>
  <path d="M70 114 Q68 140 69 162 Q74 168 82 169 L82 114 Z" fill="rgba(0,0,0,0.10)"/>
  <path d="M88 116 L100 136 L112 116" fill="white"/>
  <circle cx="100" cy="130" r="2" fill="#E8A020"/>
  <rect x="91" y="101" width="18" height="16" rx="5" fill="#FBBF7C"/>
  <path d="M70 118 Q52 112 47 96 Q43 82 54 78" stroke="#FBBF7C" stroke-width="13" stroke-linecap="round" fill="none"/>
  <rect x="40" y="62" width="19" height="32" rx="5" fill="#1E1B4B"/>
  <rect x="42" y="65" width="15" height="23" rx="3" fill="#4338CA" opacity="0.9"/>
  <path d="M34 67 Q30 75 34 83" stroke="#E8A020" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.85"/>
  <path d="M28 63 Q23 75 28 87" stroke="#E8A020" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.45"/>
  <path d="M130 118 Q148 114 152 130" stroke="#3730A3" stroke-width="13" stroke-linecap="round" fill="none"/>
  <circle cx="153" cy="132" r="9" fill="#FBBF7C"/>
  <path d="M69 68 Q62 72 62 80 Q62 88 69 92" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <path d="M131 68 Q138 72 138 80 Q138 88 131 92" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <ellipse cx="100" cy="73" rx="31" ry="33" fill="#FBBF7C"/>
  <ellipse cx="92" cy="60" rx="14" ry="10" fill="rgba(255,220,160,0.28)"/>
  <path d="M69 68 Q70 42 100 40 Q130 42 131 68 Q124 50 100 50 Q76 50 69 68Z" fill="#2D1500"/>
  <path d="M73 66 Q75 48 100 46 Q125 48 127 66 Q120 52 100 52 Q80 52 73 66Z" fill="#3D2000"/>
  <path d="M83 47 Q97 43 115 47" stroke="rgba(120,60,10,0.25)" stroke-width="4" stroke-linecap="round" fill="none"/>
  <rect x="68" y="67" width="6" height="12" rx="3" fill="#2D1500"/>
  <rect x="126" y="67" width="6" height="12" rx="3" fill="#2D1500"/>
  <path d="M68 72 Q64 78 68 84" stroke="#1E1B4B" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <circle cx="67" cy="78" r="4.5" fill="#1E1B4B"/>
  <path d="M77 61 Q85 56 93 60" stroke="#2D1500" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <path d="M107 60 Q115 56 123 61" stroke="#2D1500" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <path d="M87 70 Q91 66 95 70" stroke="#1C0A00" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M105 70 Q109 66 113 70" stroke="#1C0A00" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <ellipse cx="86" cy="74" rx="7.5" ry="5.5" fill="rgba(90,60,20,0.6)"/>
  <ellipse cx="114" cy="74" rx="7.5" ry="5.5" fill="rgba(90,60,20,0.6)"/>
  <path d="M89 82 Q100 90 111 82" stroke="#C07850" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <circle cx="77" cy="81" r="8" fill="rgba(248,113,113,0.2)"/>
  <circle cx="123" cy="81" r="8" fill="rgba(248,113,113,0.2)"/>
  <rect x="118" y="46" width="64" height="36" rx="12" fill="white" opacity="0.95"/>
  <path d="M122 82 L118 92 L132 82" fill="white" opacity="0.95"/>
  <text x="130" y="60" font-size="8" fill="#5C574E" font-weight="600">Hello from</text>
  <text x="130" y="74" font-size="8" fill="#E8A020" font-weight="800">anywhere!</text>
  <circle cx="152" cy="40" r="4.5" fill="rgba(232,160,32,0.55)"/>
  <circle cx="163" cy="28" r="6" fill="rgba(232,160,32,0.35)"/>
  <circle cx="171" cy="16" r="7.5" fill="rgba(232,160,32,0.2)"/>
</svg>`;

const TRAVELLER = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="196" rx="52" ry="8" fill="rgba(0,0,0,0.11)"/>
  <line x1="86" y1="162" x2="81" y2="193" stroke="#1E1B4B" stroke-width="13" stroke-linecap="round"/>
  <line x1="114" y1="162" x2="119" y2="193" stroke="#1E1B4B" stroke-width="13" stroke-linecap="round"/>
  <ellipse cx="80" cy="193" rx="12" ry="5" fill="#111827"/>
  <ellipse cx="120" cy="193" rx="12" ry="5" fill="#111827"/>
  <rect x="130" y="120" width="36" height="44" rx="9" fill="#6366F1"/>
  <rect x="138" y="112" width="20" height="12" rx="4" fill="none" stroke="#6366F1" stroke-width="3"/>
  <line x1="138" y1="133" x2="166" y2="133" stroke="rgba(255,255,255,0.28)" stroke-width="1.5"/>
  <circle cx="148" cy="143" r="4.5" fill="rgba(255,255,255,0.38)"/>
  <path d="M70 114 Q67 140 69 162 Q80 170 100 170 Q120 170 131 162 Q133 140 130 114 Z" fill="#3730A3"/>
  <path d="M70 114 Q68 140 69 162 Q74 168 82 169 L82 114 Z" fill="rgba(0,0,0,0.10)"/>
  <path d="M88 116 L100 136 L112 116" fill="white"/>
  <circle cx="100" cy="130" r="2" fill="#E8A020"/>
  <rect x="91" y="101" width="18" height="16" rx="5" fill="#FBBF7C"/>
  <path d="M70 118 Q50 112 45 96 Q41 83 52 78" stroke="#FBBF7C" stroke-width="13" stroke-linecap="round" fill="none"/>
  <rect x="28" y="62" width="28" height="22" rx="5" fill="#E8A020"/>
  <rect x="31" y="65" width="9" height="7" rx="2" fill="#C8851A"/>
  <rect x="31" y="73" width="18" height="2.5" rx="1" fill="rgba(255,255,255,0.6)"/>
  <path d="M130 116 Q148 112 150 124" stroke="#FBBF7C" stroke-width="13" stroke-linecap="round" fill="none"/>
  <path d="M69 68 Q62 72 62 80 Q62 88 69 92" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <path d="M131 68 Q138 72 138 80 Q138 88 131 92" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <ellipse cx="100" cy="73" rx="31" ry="33" fill="#FBBF7C"/>
  <ellipse cx="92" cy="60" rx="14" ry="10" fill="rgba(255,220,160,0.28)"/>
  <path d="M69 68 Q70 42 100 40 Q130 42 131 68 Q124 50 100 50 Q76 50 69 68Z" fill="#2D1500"/>
  <path d="M73 66 Q75 48 100 46 Q125 48 127 66 Q120 52 100 52 Q80 52 73 66Z" fill="#3D2000"/>
  <path d="M83 47 Q97 43 115 47" stroke="rgba(120,60,10,0.25)" stroke-width="4" stroke-linecap="round" fill="none"/>
  <rect x="68" y="67" width="6" height="12" rx="3" fill="#2D1500"/>
  <rect x="126" y="67" width="6" height="12" rx="3" fill="#2D1500"/>
  <rect x="81" y="66" width="17" height="12" rx="5" fill="#111827"/>
  <rect x="102" y="66" width="17" height="12" rx="5" fill="#111827"/>
  <line x1="98" y1="71" x2="102" y2="71" stroke="#111827" stroke-width="2.2"/>
  <line x1="69" y1="71" x2="81" y2="71" stroke="#111827" stroke-width="1.8"/>
  <line x1="119" y1="71" x2="131" y2="71" stroke="#111827" stroke-width="1.8"/>
  <circle cx="85" cy="70" r="2.5" fill="rgba(255,255,255,0.22)"/>
  <circle cx="106" cy="70" r="2.5" fill="rgba(255,255,255,0.22)"/>
  <path d="M77 61 Q85 56 93 60" stroke="#2D1500" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <path d="M107 60 Q115 56 123 61" stroke="#2D1500" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <path d="M89 84 Q100 92 111 84" stroke="#C07850" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="38" cy="58" r="5.5" fill="#E8A020" opacity="0.7"/>
  <circle cx="55" cy="48" r="4" fill="#E8A020" opacity="0.45"/>
</svg>`;

const BORED = `<svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="80" cy="136" rx="46" ry="7" fill="rgba(0,0,0,0.1)"/>
  <path d="M58 108 Q50 118 48 132 Q52 134 58 132 Q63 120 66 112" stroke="#1E1B4B" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M102 108 Q110 118 112 132 Q108 134 102 132 Q97 120 94 112" stroke="#1E1B4B" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M55 72 Q52 94 54 108 Q64 116 80 116 Q96 116 106 108 Q108 94 105 72 Z" fill="#3730A3"/>
  <path d="M55 72 Q53 94 54 108 Q59 114 65 115 L65 72 Z" fill="rgba(0,0,0,0.09)"/>
  <path d="M70 74 L80 89 L90 74" fill="white"/>
  <circle cx="80" cy="85" r="1.8" fill="#E8A020"/>
  <path d="M55 78 Q40 86 36 100 Q34 108 42 113" stroke="#FBBF7C" stroke-width="11" stroke-linecap="round" fill="none"/>
  <circle cx="42" cy="46" r="9" fill="#FBBF7C"/>
  <path d="M105 82 Q118 88 120 104" stroke="#3730A3" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M56 36 Q57 16 80 15 Q103 16 104 36 Q98 22 80 22 Q62 22 56 36Z" fill="#2D1500"/>
  <path d="M59 34 Q60 18 80 17 Q100 18 101 34 Q96 22 80 23 Q64 23 59 34Z" fill="#3D2000"/>
  <path d="M55 38 Q57 15 80 14 Q103 15 105 38 Q100 22 80 22 Q60 22 55 38Z" fill="#2D1500"/>
  <rect x="55" y="36" width="5" height="10" rx="2.5" fill="#2D1500"/>
  <rect x="100" y="36" width="5" height="10" rx="2.5" fill="#2D1500"/>
  <path d="M55 36 Q56 16 80 14 Q104 16 105 36" stroke="#3D2000" stroke-width="2" fill="none"/>
  <path d="M56 33 Q58 19 80 18 Q102 19 104 33 Q97 22 80 22 Q63 22 56 33Z" fill="#2D1500"/>
  <path d="M57 38 Q57 14 80 13 Q103 14 103 38 Q97 22 80 22 Q63 22 57 38Z" fill="#2D1500"/>
  <ellipse cx="80" cy="40" rx="24" ry="26" fill="#FBBF7C"/>
  <ellipse cx="74" cy="29" rx="10" ry="7" fill="rgba(255,220,160,0.26)"/>
  <path d="M58 34 Q59 16 80 15 Q101 16 102 34 Q96 20 80 20 Q64 20 58 34Z" fill="#2D1500"/>
  <path d="M62 33 Q63 19 80 18 Q97 19 98 33 Q93 21 80 21 Q67 21 62 33Z" fill="#3D2000"/>
  <rect x="57" y="33" width="5" height="9" rx="2" fill="#2D1500"/>
  <rect x="98" y="33" width="5" height="9" rx="2" fill="#2D1500"/>
  <path d="M66 31 Q72 28 77 30" stroke="#2D1500" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M83 30 Q88 28 94 31" stroke="#2D1500" stroke-width="2" stroke-linecap="round" fill="none"/>
  <ellipse cx="71" cy="36" rx="5.5" ry="4.5" fill="white"/>
  <circle cx="71" cy="36" r="3" fill="#5C3A1E"/>
  <circle cx="71" cy="36" r="1.7" fill="#150800"/>
  <circle cx="72.5" cy="34.5" r="1" fill="white"/>
  <path d="M65.5 33.5 Q71 30.5 76.5 33.5" stroke="#1C0A00" stroke-width="1" stroke-linecap="round" fill="none"/>
  <ellipse cx="89" cy="36" rx="5.5" ry="4.5" fill="white"/>
  <circle cx="89" cy="36" r="3" fill="#5C3A1E"/>
  <circle cx="89" cy="36" r="1.7" fill="#150800"/>
  <circle cx="90.5" cy="34.5" r="1" fill="white"/>
  <path d="M83.5 33.5 Q89 30.5 94.5 33.5" stroke="#1C0A00" stroke-width="1" stroke-linecap="round" fill="none"/>
  <path d="M80 40 Q77.5 45 75 47" stroke="rgba(180,100,40,0.25)" stroke-width="1" stroke-linecap="round" fill="none"/>
  <path d="M80 40 Q82.5 45 85 47" stroke="rgba(180,100,40,0.25)" stroke-width="1" stroke-linecap="round" fill="none"/>
  <line x1="72" y1="52" x2="88" y2="52" stroke="#C07850" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="96" cy="22" r="5" fill="#E8A020" opacity="0.6"/>
  <circle cx="108" cy="12" r="7" fill="#E8A020" opacity="0.38"/>
  <circle cx="118" cy="3" r="9" fill="#E8A020" opacity="0.2"/>
</svg>`;

const SHRUG = `<svg width="160" height="150" viewBox="0 0 160 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="80" cy="146" rx="48" ry="7" fill="rgba(0,0,0,0.1)"/>
  <line x1="67" y1="118" x2="61" y2="144" stroke="#1E1B4B" stroke-width="10" stroke-linecap="round"/>
  <line x1="93" y1="118" x2="99" y2="144" stroke="#1E1B4B" stroke-width="10" stroke-linecap="round"/>
  <ellipse cx="60" cy="144" rx="10" ry="5" fill="#111827"/>
  <ellipse cx="100" cy="144" rx="10" ry="5" fill="#111827"/>
  <path d="M54 80 Q51 100 52 118 Q62 126 80 126 Q98 126 108 118 Q109 100 106 80 Z" fill="#3730A3"/>
  <path d="M54 80 Q52 100 52 118 Q57 124 63 125 L63 80 Z" fill="rgba(0,0,0,0.09)"/>
  <path d="M65 82 L80 97 L95 82" fill="white"/>
  <circle cx="80" cy="92" r="1.8" fill="#E8A020"/>
  <path d="M54 88 Q36 82 30 68 Q27 57 37 52" stroke="#FBBF7C" stroke-width="11" stroke-linecap="round" fill="none"/>
  <path d="M27 42 Q23 52 29 60" stroke="#1E1B4B" stroke-width="7" stroke-linecap="round" fill="none"/>
  <circle cx="27" cy="40" r="5" fill="#1E1B4B"/>
  <circle cx="30" cy="62" r="5" fill="#1E1B4B"/>
  <path d="M106 88 Q124 82 130 68 Q133 57 123 52" stroke="#FBBF7C" stroke-width="11" stroke-linecap="round" fill="none"/>
  <circle cx="124" cy="50" r="8" fill="#FBBF7C"/>
  <path d="M52 56 Q46 60 46 68 Q46 74 52 76" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <path d="M108 56 Q114 60 114 68 Q114 74 108 76" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <ellipse cx="80" cy="58" rx="28" ry="30" fill="#FBBF7C"/>
  <ellipse cx="74" cy="47" rx="12" ry="8" fill="rgba(255,220,160,0.26)"/>
  <path d="M52 54 Q54 30 80 28 Q106 30 108 54 Q102 38 80 38 Q58 38 52 54Z" fill="#2D1500"/>
  <path d="M56 52 Q58 32 80 30 Q102 32 104 52 Q98 38 80 38 Q62 38 56 52Z" fill="#3D2000"/>
  <path d="M66 35 Q74 30 80 32 Q86 30 94 35" stroke="rgba(120,60,10,0.22)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <rect x="51" y="53" width="5" height="10" rx="2" fill="#2D1500"/>
  <rect x="104" y="53" width="5" height="10" rx="2" fill="#2D1500"/>
  <path d="M65 49 Q73 44 79 47" stroke="#2D1500" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M81 47 Q87 44 95 49" stroke="#2D1500" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <ellipse cx="72" cy="54" rx="6.5" ry="5" fill="white"/>
  <circle cx="72" cy="54" r="3.5" fill="#5C3A1E"/>
  <circle cx="72" cy="54" r="2" fill="#150800"/>
  <circle cx="73.8" cy="52.5" r="1.2" fill="white"/>
  <path d="M65.5 51 Q72 47 78.5 51" stroke="#1C0A00" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <ellipse cx="88" cy="54" rx="6.5" ry="5" fill="white"/>
  <circle cx="88" cy="54" r="3.5" fill="#5C3A1E"/>
  <circle cx="88" cy="54" r="2" fill="#150800"/>
  <circle cx="89.8" cy="52.5" r="1.2" fill="white"/>
  <path d="M81.5 51 Q88 47 94.5 51" stroke="#1C0A00" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <path d="M80 58 Q77 64 75 66" stroke="rgba(180,100,40,0.22)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <path d="M80 58 Q83 64 85 66" stroke="rgba(180,100,40,0.22)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <path d="M71 67 Q75 65 80 66.5 Q85 65 89 67" stroke="#C07850" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <circle cx="108" cy="22" r="9" fill="#E8A020" opacity="0.52"/>
  <circle cx="120" cy="10" r="6" fill="#E8A020" opacity="0.32"/>
</svg>`;

const LOCKED_OUT = `<svg width="200" height="160" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="54" y="20" width="92" height="130" rx="8" fill="#EDE9E2"/>
  <rect x="58" y="24" width="84" height="122" rx="6" fill="#E5E0D8"/>
  <line x1="74" y1="24" x2="74" y2="146" stroke="#C8C3BA" stroke-width="3" stroke-linecap="round"/>
  <line x1="100" y1="24" x2="100" y2="146" stroke="#C8C3BA" stroke-width="3" stroke-linecap="round"/>
  <line x1="126" y1="24" x2="126" y2="146" stroke="#C8C3BA" stroke-width="3" stroke-linecap="round"/>
  <line x1="58" y1="60" x2="142" y2="60" stroke="#C8C3BA" stroke-width="2"/>
  <line x1="58" y1="100" x2="142" y2="100" stroke="#C8C3BA" stroke-width="2"/>
  <rect x="88" y="108" width="24" height="20" rx="4" fill="#9B9387"/>
  <path d="M92 108 Q92 98 100 98 Q108 98 108 108" fill="none" stroke="#9B9387" stroke-width="4" stroke-linecap="round"/>
  <circle cx="100" cy="118" r="3" fill="#6B6560"/>
  <line x1="91" y1="138" x2="86" y2="157" stroke="#1E1B4B" stroke-width="8" stroke-linecap="round"/>
  <line x1="109" y1="138" x2="114" y2="157" stroke="#1E1B4B" stroke-width="8" stroke-linecap="round"/>
  <path d="M80 104 Q77 120 78 138 Q86 144 100 144 Q114 144 122 138 Q123 120 120 104 Z" fill="#3730A3"/>
  <path d="M88 106 L100 120 L112 106" fill="white"/>
  <path d="M80 110 Q68 112 66 108" stroke="#FBBF7C" stroke-width="10" stroke-linecap="round" fill="none"/>
  <circle cx="64" cy="107" r="6.5" fill="#FBBF7C"/>
  <path d="M120 110 Q132 112 134 108" stroke="#FBBF7C" stroke-width="10" stroke-linecap="round" fill="none"/>
  <circle cx="136" cy="107" r="6.5" fill="#FBBF7C"/>
  <path d="M82 82 Q76 86 76 93 Q76 99 82 102" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <path d="M118 82 Q124 86 124 93 Q124 99 118 102" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <ellipse cx="100" cy="84" rx="20" ry="22" fill="#FBBF7C"/>
  <path d="M80 80 Q81 62 100 62 Q119 62 120 80 Q114 68 100 68 Q86 68 80 80Z" fill="#2D1500"/>
  <path d="M83 78 Q84 64 100 63 Q116 64 117 78 Q112 68 100 68 Q88 68 83 78Z" fill="#3D2000"/>
  <rect x="79" y="79" width="4" height="8" rx="2" fill="#2D1500"/>
  <rect x="117" y="79" width="4" height="8" rx="2" fill="#2D1500"/>
  <path d="M87 77 Q100 80 113 77" stroke="#2D1500" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M86 74 Q92 70 96 73" stroke="#2D1500" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M104 73 Q108 70 114 74" stroke="#2D1500" stroke-width="2" stroke-linecap="round" fill="none"/>
  <ellipse cx="93" cy="81" rx="5.5" ry="4.5" fill="white"/>
  <circle cx="93" cy="81" r="3" fill="#5C3A1E"/>
  <circle cx="93" cy="81" r="1.7" fill="#150800"/>
  <circle cx="94.5" cy="79.5" r="1" fill="white"/>
  <path d="M87.5 78.5 Q93 75.5 98.5 78.5" stroke="#1C0A00" stroke-width="1" stroke-linecap="round" fill="none"/>
  <ellipse cx="107" cy="81" rx="5.5" ry="4.5" fill="white"/>
  <circle cx="107" cy="81" r="3" fill="#5C3A1E"/>
  <circle cx="107" cy="81" r="1.7" fill="#150800"/>
  <circle cx="108.5" cy="79.5" r="1" fill="white"/>
  <path d="M101.5 78.5 Q107 75.5 112.5 78.5" stroke="#1C0A00" stroke-width="1" stroke-linecap="round" fill="none"/>
  <ellipse cx="107" cy="93" rx="1.8" ry="3" fill="#60A5FA" opacity="0.7"/>
  <path d="M89 95 Q100 91 111 95" stroke="#C07850" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`;

const EMPTY_POCKETS = `<svg width="160" height="150" viewBox="0 0 160 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="80" cy="146" rx="46" ry="7" fill="rgba(0,0,0,0.1)"/>
  <line x1="67" y1="116" x2="61" y2="144" stroke="#1E1B4B" stroke-width="10" stroke-linecap="round"/>
  <line x1="93" y1="116" x2="99" y2="144" stroke="#1E1B4B" stroke-width="10" stroke-linecap="round"/>
  <ellipse cx="60" cy="144" rx="10" ry="5" fill="#111827"/>
  <ellipse cx="100" cy="144" rx="10" ry="5" fill="#111827"/>
  <path d="M53 78 Q50 98 51 116 Q61 124 80 124 Q99 124 109 116 Q110 98 107 78 Z" fill="#3730A3"/>
  <path d="M53 78 Q51 98 51 116 Q56 122 62 123 L62 78 Z" fill="rgba(0,0,0,0.09)"/>
  <path d="M64 80 L80 96 L96 80" fill="white"/>
  <circle cx="80" cy="91" r="1.8" fill="#E8A020"/>
  <rect x="37" y="91" width="19" height="13" rx="4" fill="white" opacity="0.88"/>
  <rect x="35" y="87" width="23" height="8" rx="3" fill="rgba(255,255,255,0.7)"/>
  <rect x="104" y="91" width="19" height="13" rx="4" fill="white" opacity="0.88"/>
  <rect x="102" y="87" width="23" height="8" rx="3" fill="rgba(255,255,255,0.7)"/>
  <path d="M53 86 Q37 80 34 94" stroke="#FBBF7C" stroke-width="11" stroke-linecap="round" fill="none"/>
  <circle cx="32" cy="96" r="8" fill="#FBBF7C"/>
  <path d="M107 86 Q123 80 126 94" stroke="#FBBF7C" stroke-width="11" stroke-linecap="round" fill="none"/>
  <circle cx="128" cy="96" r="8" fill="#FBBF7C"/>
  <path d="M52 52 Q46 56 46 63 Q46 70 52 73" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <path d="M108 52 Q114 56 114 63 Q114 70 108 73" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <ellipse cx="80" cy="54" rx="28" ry="30" fill="#FBBF7C"/>
  <ellipse cx="74" cy="44" rx="12" ry="8" fill="rgba(255,220,160,0.26)"/>
  <path d="M52 50 Q54 26 80 25 Q106 26 108 50 Q102 35 80 35 Q58 35 52 50Z" fill="#2D1500"/>
  <path d="M56 49 Q58 28 80 27 Q102 28 104 49 Q98 35 80 35 Q62 35 56 49Z" fill="#3D2000"/>
  <path d="M65 33 Q74 28 80 30 Q86 28 95 33" stroke="rgba(120,60,10,0.22)" stroke-width="3" stroke-linecap="round" fill="none"/>
  <rect x="51" y="49" width="5" height="10" rx="2" fill="#2D1500"/>
  <rect x="104" y="49" width="5" height="10" rx="2" fill="#2D1500"/>
  <path d="M64 46 Q72 41 78 43" stroke="#2D1500" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M82 43 Q88 41 96 46" stroke="#2D1500" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <ellipse cx="72" cy="51" rx="6.5" ry="5" fill="white"/>
  <circle cx="72" cy="51" r="3.5" fill="#5C3A1E"/>
  <circle cx="72" cy="51" r="2" fill="#150800"/>
  <circle cx="73.8" cy="49.5" r="1.2" fill="white"/>
  <path d="M65.5 48 Q72 44 78.5 48" stroke="#1C0A00" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <ellipse cx="88" cy="51" rx="6.5" ry="5" fill="white"/>
  <circle cx="88" cy="51" r="3.5" fill="#5C3A1E"/>
  <circle cx="88" cy="51" r="2" fill="#150800"/>
  <circle cx="89.8" cy="49.5" r="1.2" fill="white"/>
  <path d="M81.5 48 Q88 44 94.5 48" stroke="#1C0A00" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <path d="M80 55 Q77 60 75 63" stroke="rgba(180,100,40,0.22)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <path d="M80 55 Q83 60 85 63" stroke="rgba(180,100,40,0.22)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
  <path d="M70 64 Q80 72 90 64" stroke="#C07850" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <ellipse cx="96" cy="43" rx="3.5" ry="5" fill="#60A5FA" opacity="0.55"/>
  <circle cx="112" cy="29" r="7" fill="#E8A020" opacity="0.35"/>
  <circle cx="124" cy="18" r="5" fill="#E8A020" opacity="0.22)"/>
</svg>`;

const CELEBRATING = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="18" y="28" width="9" height="9" rx="2" fill="#E8A020" opacity="0.85"/>
  <rect x="150" y="20" width="8" height="8" rx="2" fill="#6366F1" opacity="0.75"/>
  <rect x="28" y="58" width="7" height="7" rx="1.5" fill="#18A85A" opacity="0.65"/>
  <rect x="156" y="53" width="7" height="7" rx="1.5" fill="#E03535" opacity="0.62"/>
  <circle cx="40" cy="22" r="4.5" fill="#7C3AED" opacity="0.72"/>
  <circle cx="144" cy="40" r="4" fill="#E8A020" opacity="0.62"/>
  <circle cx="160" cy="78" r="3.5" fill="#18A85A" opacity="0.52"/>
  <rect x="22" y="88" width="8" height="6" rx="1.5" fill="#2563EB" opacity="0.52"/>
  <path d="M74 136 Q60 148 54 158" stroke="#1E1B4B" stroke-width="11" stroke-linecap="round" fill="none"/>
  <path d="M106 136 Q120 128 128 136" stroke="#1E1B4B" stroke-width="11" stroke-linecap="round" fill="none"/>
  <ellipse cx="52" cy="158" rx="10" ry="5" fill="#111827"/>
  <ellipse cx="130" cy="138" rx="10" ry="5" fill="#111827"/>
  <path d="M66 94 Q63 116 64 136 Q74 144 90 144 Q106 144 116 136 Q117 116 114 94 Z" fill="#3730A3"/>
  <path d="M66 94 Q64 116 64 136 Q69 142 75 143 L75 94 Z" fill="rgba(0,0,0,0.09)"/>
  <path d="M78 96 L90 112 L102 96" fill="white"/>
  <circle cx="90" cy="107" r="2" fill="#E8A020"/>
  <path d="M66 102 Q46 88 42 70 Q40 58 52 56" stroke="#FBBF7C" stroke-width="12" stroke-linecap="round" fill="none"/>
  <circle cx="52" cy="54" r="9" fill="#FBBF7C"/>
  <path d="M114 102 Q134 88 138 70 Q140 58 128 56" stroke="#FBBF7C" stroke-width="12" stroke-linecap="round" fill="none"/>
  <circle cx="128" cy="54" r="9" fill="#FBBF7C"/>
  <path d="M64 68 Q58 72 58 80 Q58 86 64 89" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <path d="M116 68 Q122 72 122 80 Q122 86 116 89" stroke="#D4904A" stroke-width="1.5" fill="#FBBF7C"/>
  <ellipse cx="90" cy="72" rx="28" ry="30" fill="#FBBF7C"/>
  <ellipse cx="84" cy="60" rx="12" ry="8" fill="rgba(255,220,160,0.28)"/>
  <path d="M62 68 Q64 42 90 40 Q116 42 118 68 Q112 50 90 50 Q68 50 62 68Z" fill="#2D1500"/>
  <path d="M66 66 Q68 46 90 44 Q112 46 114 66 Q108 50 90 50 Q72 50 66 66Z" fill="#3D2000"/>
  <path d="M74 46 Q86 42 106 46" stroke="rgba(120,60,10,0.22)" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <rect x="61" y="67" width="6" height="12" rx="3" fill="#2D1500"/>
  <rect x="113" y="67" width="6" height="12" rx="3" fill="#2D1500"/>
  <path d="M75 64 Q83 60 89 63" stroke="#2D1500" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <path d="M91 63 Q97 60 105 64" stroke="#2D1500" stroke-width="2.8" stroke-linecap="round" fill="none"/>
  <path d="M78 64 Q82 60 86 64" stroke="#1C0A00" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M94 64 Q98 60 102 64" stroke="#1C0A00" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <ellipse cx="80" cy="70" rx="7.5" ry="5.8" fill="rgba(90,58,30,0.55)"/>
  <ellipse cx="100" cy="70" rx="7.5" ry="5.8" fill="rgba(90,58,30,0.55)"/>
  <path d="M78 80 Q90 93 102 80" stroke="#C07850" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M80 82 Q90 92 100 82 Q90 87 80 82Z" fill="rgba(200,110,70,0.18)"/>
  <circle cx="76" cy="79" r="7" fill="rgba(248,113,113,0.2)"/>
  <circle cx="104" cy="79" r="7" fill="rgba(248,113,113,0.2)"/>
  <circle cx="18" cy="76" r="8" fill="#E8A020" opacity="0.48"/>
  <circle cx="162" cy="100" r="7" fill="#6366F1" opacity="0.42"/>
  <circle cx="152" cy="15" r="10" fill="#E8A020" opacity="0.3"/>
</svg>`;

type Props = { size?: number };

export function CharGlobeHolder({ size = 200 }: Props) {
  return <SvgXml xml={GLOB_HOLDER} width={size} height={size} />;
}
export function CharMidCall({ size = 200 }: Props) {
  return <SvgXml xml={MID_CALL} width={size} height={size} />;
}
export function CharTraveller({ size = 200 }: Props) {
  return <SvgXml xml={TRAVELLER} width={size} height={size} />;
}
export function CharBored({ size = 160 }: Props) {
  return <SvgXml xml={BORED} width={size} height={size * 0.875} />;
}
export function CharShrug({ size = 160 }: Props) {
  return <SvgXml xml={SHRUG} width={size} height={size * 0.9375} />;
}
export function CharLockedOut({ size = 200 }: Props) {
  return <SvgXml xml={LOCKED_OUT} width={size} height={size * 0.8} />;
}
export function CharEmptyPockets({ size = 160 }: Props) {
  return <SvgXml xml={EMPTY_POCKETS} width={size} height={size * 0.9375} />;
}
export function CharCelebrating({ size = 180 }: Props) {
  return <SvgXml xml={CELEBRATING} width={size} height={size} />;
}
