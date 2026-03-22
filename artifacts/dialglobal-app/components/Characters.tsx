import React from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";

const GLOB_HOLDER = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="192" rx="55" ry="10" fill="rgba(0,0,0,0.12)"/>
  <line x1="88" y1="162" x2="82" y2="190" stroke="#3730A3" stroke-width="10" stroke-linecap="round"/>
  <line x1="112" y1="162" x2="118" y2="190" stroke="#3730A3" stroke-width="10" stroke-linecap="round"/>
  <rect x="72" y="100" width="56" height="68" rx="16" fill="#3730A3"/>
  <path d="M88 100 L100 118 L112 100" fill="#4338CA"/>
  <rect x="96" y="100" width="8" height="18" rx="2" fill="rgba(255,255,255,0.92)"/>
  <path d="M72 112 Q50 108 42 122 Q38 134 48 140" stroke="#FBBF7C" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M128 112 Q150 108 158 122 Q162 134 152 140" stroke="#FBBF7C" stroke-width="12" stroke-linecap="round" fill="none"/>
  <circle cx="100" cy="148" r="28" fill="#DBEAFE"/>
  <path d="M84 140 Q90 134 98 138 Q104 136 108 142 Q114 138 118 144 Q120 150 116 154 Q110 157 104 153 Q98 155 92 151 Q86 152 82 146 Q80 143 84 140Z" fill="#6EE7B7" opacity="0.75"/>
  <path d="M78 152 Q81 148 86 150 Q87 155 83 157 Q80 158 77 155Z" fill="#6EE7B7" opacity="0.6"/>
  <ellipse cx="100" cy="148" rx="28" ry="10" stroke="rgba(37,99,235,0.15)" stroke-width="1" fill="none"/>
  <line x1="100" y1="120" x2="100" y2="176" stroke="rgba(37,99,235,0.15)" stroke-width="1"/>
  <circle cx="90" cy="138" r="8" fill="white" opacity="0.2"/>
  <circle cx="100" cy="148" r="28" stroke="#BFDBFE" stroke-width="1.5" fill="none"/>
  <circle cx="100" cy="78" r="24" fill="#FBBF7C"/>
  <path d="M76 74 Q77 50 100 50 Q123 50 124 74 Q120 58 100 58 Q80 58 76 74Z" fill="#1C0A00"/>
  <circle cx="76" cy="78" r="5.5" fill="#FBBF7C"/>
  <circle cx="124" cy="78" r="5.5" fill="#FBBF7C"/>
  <circle cx="91" cy="76" r="4" fill="#1C0A00"/>
  <circle cx="109" cy="76" r="4" fill="#1C0A00"/>
  <circle cx="92.5" cy="74.5" r="1.5" fill="white"/>
  <circle cx="110.5" cy="74.5" r="1.5" fill="white"/>
  <path d="M86 69 Q91 66 96 69" stroke="#1C0A00" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M104 69 Q109 66 114 69" stroke="#1C0A00" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M88 85 Q100 94 112 85" stroke="#1C0A00" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`;

const MID_CALL = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="192" rx="52" ry="9" fill="rgba(0,0,0,0.12)"/>
  <line x1="88" y1="162" x2="84" y2="190" stroke="#3730A3" stroke-width="10" stroke-linecap="round"/>
  <line x1="112" y1="162" x2="116" y2="190" stroke="#3730A3" stroke-width="10" stroke-linecap="round"/>
  <rect x="72" y="100" width="56" height="68" rx="16" fill="#3730A3"/>
  <path d="M88 100 L100 118 L112 100" fill="#4338CA"/>
  <rect x="96" y="100" width="8" height="18" rx="2" fill="rgba(255,255,255,0.92)"/>
  <path d="M72 110 Q55 104 50 90 Q46 78 55 74" stroke="#FBBF7C" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M128 115 Q148 112 152 128" stroke="#3730A3" stroke-width="11" stroke-linecap="round" fill="none"/>
  <rect x="42" y="60" width="18" height="30" rx="4" fill="#1E1B4B"/>
  <rect x="44" y="63" width="14" height="22" rx="2" fill="#4338CA" opacity="0.85"/>
  <path d="M36 65 Q32 72 36 79" stroke="#E8A020" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.8"/>
  <path d="M30 61 Q25 72 30 83" stroke="#E8A020" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.45"/>
  <circle cx="100" cy="76" r="24" fill="#FBBF7C"/>
  <path d="M76 72 Q77 48 100 48 Q123 48 124 72 Q120 56 100 56 Q80 56 76 72Z" fill="#1C0A00"/>
  <circle cx="76" cy="76" r="5.5" fill="#FBBF7C"/>
  <circle cx="124" cy="76" r="5.5" fill="#FBBF7C"/>
  <path d="M70 70 Q66 76 70 82" stroke="#1E1B4B" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <circle cx="69" cy="76" r="4" fill="#1E1B4B"/>
  <path d="M87 72 Q91 68 95 72" stroke="#1C0A00" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M105 72 Q109 68 113 72" stroke="#1C0A00" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M86 84 Q100 96 114 84" stroke="#1C0A00" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <circle cx="87" cy="83" r="5" fill="#F87171" opacity="0.25"/>
  <circle cx="113" cy="83" r="5" fill="#F87171" opacity="0.25"/>
  <rect x="118" y="48" width="62" height="34" rx="12" fill="white" opacity="0.95"/>
  <path d="M122 82 L118 90 L130 82" fill="white" opacity="0.95"/>
  <circle cx="150" cy="42" r="4" fill="rgba(232,160,32,0.55)"/>
  <circle cx="160" cy="30" r="5.5" fill="rgba(232,160,32,0.38)"/>
  <circle cx="168" cy="18" r="7" fill="rgba(232,160,32,0.22)"/>
</svg>`;

const TRAVELLER = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="100" cy="192" rx="54" ry="9" fill="rgba(0,0,0,0.12)"/>
  <line x1="88" y1="162" x2="83" y2="190" stroke="#3730A3" stroke-width="10" stroke-linecap="round"/>
  <line x1="112" y1="162" x2="117" y2="190" stroke="#3730A3" stroke-width="10" stroke-linecap="round"/>
  <rect x="128" y="118" width="34" height="42" rx="8" fill="#6366F1"/>
  <rect x="136" y="110" width="18" height="12" rx="4" fill="none" stroke="#6366F1" stroke-width="3"/>
  <line x1="136" y1="130" x2="162" y2="130" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
  <circle cx="145" cy="140" r="4" fill="rgba(255,255,255,0.4)"/>
  <rect x="72" y="100" width="56" height="68" rx="16" fill="#3730A3"/>
  <path d="M88 100 L100 118 L112 100" fill="#4338CA"/>
  <rect x="96" y="100" width="8" height="18" rx="2" fill="rgba(255,255,255,0.92)"/>
  <path d="M72 110 Q52 105 46 92 Q42 80 52 76" stroke="#FBBF7C" stroke-width="12" stroke-linecap="round" fill="none"/>
  <rect x="30" y="64" width="26" height="20" rx="4" fill="#E8A020"/>
  <rect x="33" y="67" width="8" height="6" rx="1.5" fill="#C8851A"/>
  <path d="M128 108 Q146 104 148 116" stroke="#FBBF7C" stroke-width="12" stroke-linecap="round" fill="none"/>
  <circle cx="100" cy="76" r="24" fill="#FBBF7C"/>
  <path d="M76 72 Q77 48 100 48 Q123 48 124 72 Q120 56 100 56 Q80 56 76 72Z" fill="#1C0A00"/>
  <circle cx="76" cy="76" r="5.5" fill="#FBBF7C"/>
  <circle cx="124" cy="76" r="5.5" fill="#FBBF7C"/>
  <rect x="83" y="69" width="15" height="10" rx="4" fill="#1C0A00"/>
  <rect x="102" y="69" width="15" height="10" rx="4" fill="#1C0A00"/>
  <line x1="98" y1="73" x2="102" y2="73" stroke="#1C0A00" stroke-width="2"/>
  <line x1="76" y1="73" x2="83" y2="73" stroke="#1C0A00" stroke-width="1.5"/>
  <line x1="117" y1="73" x2="124" y2="73" stroke="#1C0A00" stroke-width="1.5"/>
  <circle cx="88" cy="72" r="2" fill="rgba(255,255,255,0.25)"/>
  <circle cx="107" cy="72" r="2" fill="rgba(255,255,255,0.25)"/>
  <path d="M88 86 Q100 95 112 86" stroke="#1C0A00" stroke-width="2" stroke-linecap="round" fill="none"/>
  <circle cx="34" cy="58" r="5" fill="#E8A020" opacity="0.7"/>
  <circle cx="50" cy="48" r="4" fill="#E8A020" opacity="0.45"/>
</svg>`;

const BORED = `<svg width="160" height="140" viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="80" cy="134" rx="44" ry="7" fill="rgba(0,0,0,0.1)"/>
  <path d="M60 110 Q52 118 50 130 Q54 132 60 130 Q64 120 68 114" stroke="#3730A3" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M100 110 Q108 118 110 130 Q106 132 100 130 Q96 120 92 114" stroke="#3730A3" stroke-width="10" stroke-linecap="round" fill="none"/>
  <rect x="58" y="74" width="44" height="44" rx="14" fill="#3730A3"/>
  <path d="M70 74 L80 88 L90 74" fill="#4338CA"/>
  <rect x="76" y="74" width="8" height="14" rx="2" fill="rgba(255,255,255,0.9)"/>
  <path d="M58 82 Q42 88 38 100 Q36 108 44 112" stroke="#FBBF7C" stroke-width="11" stroke-linecap="round" fill="none"/>
  <circle cx="46" cy="48" r="8" fill="#FBBF7C"/>
  <path d="M102 86 Q116 90 118 104" stroke="#3730A3" stroke-width="10" stroke-linecap="round" fill="none"/>
  <circle cx="80" cy="42" r="22" fill="#FBBF7C"/>
  <path d="M58 38 Q59 18 80 18 Q101 18 102 38 Q98 24 80 24 Q62 24 58 38Z" fill="#1C0A00"/>
  <circle cx="58" cy="42" r="5" fill="#FBBF7C"/>
  <circle cx="102" cy="42" r="5" fill="#FBBF7C"/>
  <path d="M70 38 Q73 36 76 38" stroke="#1C0A00" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M84 38 Q87 36 90 38" stroke="#1C0A00" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <circle cx="73" cy="41" r="2.5" fill="#1C0A00"/>
  <circle cx="87" cy="41" r="2.5" fill="#1C0A00"/>
  <line x1="74" y1="50" x2="86" y2="50" stroke="#1C0A00" stroke-width="1.8" stroke-linecap="round"/>
  <circle cx="100" cy="26" r="5" fill="#E8A020" opacity="0.6"/>
  <circle cx="112" cy="14" r="7" fill="#E8A020" opacity="0.35"/>
  <circle cx="120" cy="4" r="9" fill="#E8A020" opacity="0.18"/>
</svg>`;

const SHRUG = `<svg width="160" height="150" viewBox="0 0 160 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="80" cy="144" rx="46" ry="8" fill="rgba(0,0,0,0.1)"/>
  <line x1="68" y1="120" x2="62" y2="144" stroke="#3730A3" stroke-width="10" stroke-linecap="round"/>
  <line x1="92" y1="120" x2="98" y2="144" stroke="#3730A3" stroke-width="10" stroke-linecap="round"/>
  <rect x="55" y="80" width="50" height="46" rx="14" fill="#3730A3"/>
  <path d="M67 80 L80 96 L93 80" fill="#4338CA"/>
  <rect x="76" y="80" width="8" height="16" rx="2" fill="rgba(255,255,255,0.9)"/>
  <path d="M55 88 Q36 82 32 68 Q30 57 40 54" stroke="#FBBF7C" stroke-width="11" stroke-linecap="round" fill="none"/>
  <path d="M28 42 Q24 52 30 60" stroke="#1E1B4B" stroke-width="7" stroke-linecap="round" fill="none"/>
  <circle cx="28" cy="40" r="5" fill="#1E1B4B"/>
  <circle cx="31" cy="62" r="5" fill="#1E1B4B"/>
  <path d="M105 88 Q124 82 128 68 Q130 57 120 54" stroke="#FBBF7C" stroke-width="11" stroke-linecap="round" fill="none"/>
  <circle cx="122" cy="52" r="7" fill="#FBBF7C"/>
  <circle cx="80" cy="58" r="22" fill="#FBBF7C"/>
  <path d="M58 54 Q59 32 80 32 Q101 32 102 54 Q98 40 80 40 Q62 40 58 54Z" fill="#1C0A00"/>
  <circle cx="58" cy="58" r="5" fill="#FBBF7C"/>
  <circle cx="102" cy="58" r="5" fill="#FBBF7C"/>
  <path d="M68 50 Q72 46 76 50" stroke="#1C0A00" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <path d="M84 50 Q88 46 92 50" stroke="#1C0A00" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <circle cx="72" cy="54" r="3.5" fill="#1C0A00"/>
  <circle cx="88" cy="54" r="3.5" fill="#1C0A00"/>
  <circle cx="73.5" cy="52.5" r="1.2" fill="white"/>
  <circle cx="89.5" cy="52.5" r="1.2" fill="white"/>
  <path d="M72 66 Q76 64 80 66 Q84 68 88 66" stroke="#1C0A00" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <circle cx="106" cy="20" r="8" fill="#E8A020" opacity="0.55"/>
  <circle cx="118" cy="10" r="5" fill="#E8A020" opacity="0.35"/>
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
  <line x1="91" y1="138" x2="86" y2="156" stroke="#3730A3" stroke-width="8" stroke-linecap="round"/>
  <line x1="109" y1="138" x2="114" y2="156" stroke="#3730A3" stroke-width="8" stroke-linecap="round"/>
  <rect x="80" y="104" width="40" height="40" rx="12" fill="#3730A3"/>
  <path d="M88 104 L100 116 L112 104" fill="#4338CA"/>
  <rect x="96" y="104" width="8" height="12" rx="2" fill="rgba(255,255,255,0.9)"/>
  <path d="M80 112 Q68 112 66 108" stroke="#FBBF7C" stroke-width="10" stroke-linecap="round" fill="none"/>
  <path d="M120 112 Q132 112 134 108" stroke="#FBBF7C" stroke-width="10" stroke-linecap="round" fill="none"/>
  <circle cx="65" cy="106" r="6" fill="#FBBF7C"/>
  <circle cx="135" cy="106" r="6" fill="#FBBF7C"/>
  <circle cx="100" cy="84" r="20" fill="#FBBF7C"/>
  <path d="M80 80 Q81 62 100 62 Q119 62 120 80 Q116 68 100 68 Q84 68 80 80Z" fill="#1C0A00"/>
  <circle cx="80" cy="84" r="4.5" fill="#FBBF7C"/>
  <circle cx="120" cy="84" r="4.5" fill="#FBBF7C"/>
  <circle cx="92" cy="82" r="3" fill="#1C0A00"/>
  <circle cx="108" cy="82" r="3" fill="#1C0A00"/>
  <ellipse cx="108" cy="91" rx="2" ry="3" fill="#60A5FA" opacity="0.7"/>
  <path d="M90 93 Q100 89 110 93" stroke="#1C0A00" stroke-width="2" stroke-linecap="round" fill="none"/>
  <path d="M87 76 Q92 73 95 77" stroke="#1C0A00" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M105 77 Q108 73 113 76" stroke="#1C0A00" stroke-width="1.5" stroke-linecap="round" fill="none"/>
</svg>`;

const EMPTY_POCKETS = `<svg width="160" height="150" viewBox="0 0 160 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="80" cy="144" rx="44" ry="7" fill="rgba(0,0,0,0.1)"/>
  <line x1="68" y1="116" x2="62" y2="142" stroke="#3730A3" stroke-width="10" stroke-linecap="round"/>
  <line x1="92" y1="116" x2="98" y2="142" stroke="#3730A3" stroke-width="10" stroke-linecap="round"/>
  <rect x="55" y="76" width="50" height="46" rx="14" fill="#3730A3"/>
  <path d="M67 76 L80 92 L93 76" fill="#4338CA"/>
  <rect x="76" y="76" width="8" height="16" rx="2" fill="rgba(255,255,255,0.9)"/>
  <rect x="40" y="90" width="18" height="12" rx="3" fill="white" opacity="0.9"/>
  <rect x="38" y="86" width="22" height="8" rx="3" fill="white" opacity="0.7"/>
  <rect x="102" y="90" width="18" height="12" rx="3" fill="white" opacity="0.9"/>
  <rect x="100" y="86" width="22" height="8" rx="3" fill="white" opacity="0.7"/>
  <path d="M55 86 Q38 82 36 94" stroke="#FBBF7C" stroke-width="11" stroke-linecap="round" fill="none"/>
  <path d="M105 86 Q122 82 124 94" stroke="#FBBF7C" stroke-width="11" stroke-linecap="round" fill="none"/>
  <circle cx="34" cy="96" r="7" fill="#FBBF7C"/>
  <circle cx="126" cy="96" r="7" fill="#FBBF7C"/>
  <circle cx="80" cy="54" r="22" fill="#FBBF7C"/>
  <path d="M58 50 Q59 28 80 28 Q101 28 102 50 Q98 36 80 36 Q62 36 58 50Z" fill="#1C0A00"/>
  <circle cx="58" cy="54" r="5" fill="#FBBF7C"/>
  <circle cx="102" cy="54" r="5" fill="#FBBF7C"/>
  <circle cx="72" cy="50" r="3.5" fill="#1C0A00"/>
  <path d="M83 48 Q87 46 91 50" stroke="#1C0A00" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <circle cx="87" cy="52" r="3.5" fill="#1C0A00"/>
  <circle cx="73.5" cy="48.5" r="1.2" fill="white"/>
  <path d="M70 62 Q80 70 90 62" stroke="#1C0A00" stroke-width="2" stroke-linecap="round" fill="none"/>
  <ellipse cx="96" cy="44" rx="3" ry="4" fill="#60A5FA" opacity="0.6"/>
  <circle cx="112" cy="30" r="7" fill="#E8A020" opacity="0.35"/>
  <circle cx="124" cy="18" r="5" fill="#E8A020" opacity="0.22"/>
</svg>`;

const CELEBRATING = `<svg width="180" height="180" viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="30" width="8" height="8" rx="2" fill="#E8A020" opacity="0.8"/>
  <rect x="148" y="22" width="7" height="7" rx="2" fill="#6366F1" opacity="0.7"/>
  <rect x="30" y="60" width="6" height="6" rx="1.5" fill="#18A85A" opacity="0.6"/>
  <rect x="155" y="55" width="6" height="6" rx="1.5" fill="#E03535" opacity="0.6"/>
  <circle cx="42" cy="24" r="4" fill="#7C3AED" opacity="0.7"/>
  <circle cx="142" cy="42" r="3.5" fill="#E8A020" opacity="0.6"/>
  <circle cx="158" cy="80" r="3" fill="#18A85A" opacity="0.5"/>
  <rect x="24" y="90" width="7" height="5" rx="1.5" fill="#2563EB" opacity="0.5"/>
  <path d="M76 138 Q62 148 56 158" stroke="#3730A3" stroke-width="11" stroke-linecap="round" fill="none"/>
  <path d="M104 138 Q118 130 126 138" stroke="#3730A3" stroke-width="11" stroke-linecap="round" fill="none"/>
  <rect x="68" y="96" width="44" height="48" rx="14" fill="#3730A3"/>
  <path d="M80 96 L90 112 L100 96" fill="#4338CA"/>
  <rect x="86" y="96" width="8" height="16" rx="2" fill="rgba(255,255,255,0.9)"/>
  <path d="M68 104 Q48 90 44 72 Q42 60 54 58" stroke="#FBBF7C" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M112 104 Q132 90 136 72 Q138 60 126 58" stroke="#FBBF7C" stroke-width="12" stroke-linecap="round" fill="none"/>
  <circle cx="54" cy="56" r="8" fill="#FBBF7C"/>
  <circle cx="126" cy="56" r="8" fill="#FBBF7C"/>
  <circle cx="90" cy="72" r="24" fill="#FBBF7C"/>
  <path d="M66 68 Q67 44 90 44 Q113 44 114 68 Q110 52 90 52 Q70 52 66 68Z" fill="#1C0A00"/>
  <circle cx="66" cy="72" r="5.5" fill="#FBBF7C"/>
  <circle cx="114" cy="72" r="5.5" fill="#FBBF7C"/>
  <path d="M78 66 Q82 62 86 66" stroke="#1C0A00" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M94 66 Q98 62 102 66" stroke="#1C0A00" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <path d="M78 80 Q90 94 102 80" stroke="#1C0A00" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M80 82 Q90 93 100 82 Q90 88 80 82Z" fill="#1C0A00" opacity="0.15"/>
  <circle cx="78" cy="79" r="6" fill="#F87171" opacity="0.22"/>
  <circle cx="102" cy="79" r="6" fill="#F87171" opacity="0.22"/>
  <circle cx="22" cy="78" r="8" fill="#E8A020" opacity="0.5"/>
  <circle cx="158" cy="100" r="6" fill="#6366F1" opacity="0.45"/>
  <circle cx="148" cy="18" r="9" fill="#E8A020" opacity="0.35"/>
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
