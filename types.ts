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
  realImageUrl?: string; // 実写風画像（高シンクロ時などに使用）
  videoUrl?: string;
  shortDesc: string;
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  // Buddy System Ext
  syncRate: number; // 0-100
  role: 'buddy' | 'none' | 'sage_force' | 'sage_psycho' | 'sage_logic';
  perk: string;
  trivia: string[];
  // Evolution Ext
  evolutionLevel: number; // 1 (Basic) -> 2 (Evolved)
  evolvesTo?: string; // ID of the next form
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
  mapImage: string;
  fpsImage: string;
}

export interface MapNode {
  id: string;
  x: number; // % coordinates (0-100)
  y: number; // % coordinates (0-100)
  type: 'start' | 'junction' | 'waypoint' | 'end';
  nextNodes: string[]; // Possible next node IDs
  targetId?: string; // If 'end', what is here? (null, creatureId, itemId)
}

export interface SubAreaSpot {
  id: string;
  label: string;
  x: number; // left position %
  y: number; // top position %
  icon: React.ComponentType<any>;
  activeTimes: TimeOfDay[];
  type?: 'creature' | 'item'; // Default 'creature'
  itemId?: string; // If type is item
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

export interface NewsData {
  date: string; // YYYY-MM-DD
  type: 'forecast' | 'trivia' | 'advice' | 'lucky';
  title: string;
  content: string;
  luckyItemId?: string; // If type is lucky
  bonusAreaId?: string; // If type is forecast (area)
}