import React from 'react';

export enum CreatureType {
  Park = '公園エリア',
  Garden = '庭・路地裏',
  Water = '水辺・川',
  House = '屋内・家',
  Mystery = '未確認・レア'
}

export enum TimeOfDay {
  Morning = '早朝',
  Day = '日中',
  Sunset = '夕暮れ',
  Night = '深夜',
  Any = '常時'
}

export interface Creature {
  id: string;
  name: string;
  latinName: string;
  type: CreatureType;
  activeTime: TimeOfDay[];
  imageUrl: string;
  sketchUrl?: string; // 手描きのスケッチ画像（未発見時に使用）
  videoUrl?: string;
  shortDesc: string;
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  // Buddy System Ext
  syncRate: number; // 0-100
  role: 'buddy' | 'none';
  perk: string;
  trivia: string[];
}

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'doctor';
  text: string;
}

export interface SearchArea {
  id: string;
  label: string;
  type: CreatureType;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
  bgImage: string;
}

export interface SubAreaSpot {
  id: string;
  label: string;
  x: number; // left position %
  y: number; // top position %
  icon: React.ComponentType<any>;
  activeTimes: TimeOfDay[];
}

export interface Item {
  id: string;
  name: string;
  icon: string;
  description: string;
  // Souvenir System Ext
  type: 'food' | 'material' | 'lore';
  effectValue: number; // For syncRate
}

export type SearchPhase = 'idle' | 'walking' | 'scanning' | 'aiming' | 'result';