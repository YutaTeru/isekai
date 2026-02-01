import { Creature, CreatureType, TimeOfDay, Item, SearchArea, SubAreaSpot } from './types';
import { Trees, Footprints, Waves, Home, MapPin, Sun, Leaf, Cloud, Sparkles } from 'lucide-react';

export const SEARCH_AREAS: SearchArea[] = [
  {
    id: 'park',
    label: '公園エリア',
    type: CreatureType.Park,
    icon: Trees,
    color: 'bg-[#C8E6C9] text-[#2E7D32] border-[#4CAF50]',
    description: '多くの生物が観測される基本エリア。遊具周辺は要チェック。',
    bgImage: '/bg/park.png',
    mapImage: '/bg/park_map_highres.png',
    fpsImage: '/bg/park_fps.png'
  },
  {
    id: 'garden',
    label: '庭・路地裏',
    type: CreatureType.Garden,
    icon: Footprints,
    color: 'bg-[#FFECB3] text-[#F57F17] border-[#FFC107]',
    description: '物陰に潜む小型生物が多い。隙間や影を調査せよ。',
    bgImage: '/bg/garden.png',
    mapImage: '/bg/garden_map_highres.png',
    fpsImage: '/bg/garden_fps.png'
  },
  {
    id: 'water',
    label: '水辺・川',
    type: CreatureType.Water,
    icon: Waves,
    color: 'bg-[#E1F5FE] text-[#0277BD] border-[#29B6F6]',
    description: '水棲生物の生息域。水面の波紋や湿った場所を探れ。',
    bgImage: '/bg/water.png',
    mapImage: '/bg/water_map_highres.png',
    fpsImage: '/bg/water_fps.png'
  },
  {
    id: 'house',
    label: '屋内・家',
    type: CreatureType.House,
    icon: Home,
    color: 'bg-[#E1BEE7] text-[#7B1FA2] border-[#9C27B0]',
    description: '人工物に擬態する生物が生息。家具や家電製品の裏側など。',
    bgImage: '/bg/house.png',
    mapImage: '/bg/house_map_highres.png',
    fpsImage: '/bg/house_fps.png'
  },
];

export const AREA_SPOTS: Record<string, SubAreaSpot[]> = {
  park: [
    { id: 'slide', label: '滑り台', x: 25, y: 35, icon: MapPin, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day] },
    { id: 'sandbox', label: '砂場', x: 75, y: 65, icon: MapPin, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day, TimeOfDay.Sunset] },
    { id: 'lamp', label: '街灯', x: 85, y: 25, icon: Sun, activeTimes: [TimeOfDay.Sunset, TimeOfDay.Night] },
    { id: 'bush', label: '茂み', x: 20, y: 80, icon: Leaf, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day, TimeOfDay.Night] },
    { id: 'bench_under', label: 'ベンチの下', x: 60, y: 60, icon: Sparkles, activeTimes: [TimeOfDay.Any], type: 'item', itemId: 'item_stone' },
  ],
  garden: [
    { id: 'flowerpot', label: '植木鉢', x: 30, y: 70, icon: Leaf, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day] },
    { id: 'wall', label: 'ブロック塀', x: 50, y: 40, icon: MapPin, activeTimes: [TimeOfDay.Day, TimeOfDay.Sunset] },
    { id: 'shadow', label: '建物の影', x: 80, y: 80, icon: Footprints, activeTimes: [TimeOfDay.Sunset, TimeOfDay.Night] },
    { id: 'acunit', label: '室外機', x: 20, y: 20, icon: MapPin, activeTimes: [TimeOfDay.Night, TimeOfDay.Morning] },
  ],
  water: [
    { id: 'lilypad', label: '蓮の葉', x: 20, y: 70, icon: Leaf, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day] },
    { id: 'waterfall', label: '小さな滝', x: 50, y: 20, icon: Waves, activeTimes: [TimeOfDay.Day, TimeOfDay.Sunset] },
    { id: 'bridge', label: '木の橋', x: 80, y: 40, icon: MapPin, activeTimes: [TimeOfDay.Sunset, TimeOfDay.Night] },
    { id: 'shore', label: '岸辺', x: 30, y: 40, icon: Footprints, activeTimes: [TimeOfDay.Morning, TimeOfDay.Day] },
  ],
  house: [
    { id: 'bookshelf', label: '本棚', x: 20, y: 30, icon: MapPin, activeTimes: [TimeOfDay.Night, TimeOfDay.Any] },
    { id: 'router', label: 'Wi-Fiルーター', x: 80, y: 70, icon: Sun, activeTimes: [TimeOfDay.Any] },
    { id: 'sofa', label: 'ソファー', x: 40, y: 80, icon: MapPin, activeTimes: [TimeOfDay.Day, TimeOfDay.Sunset] },
    { id: 'window', label: '窓際', x: 70, y: 20, icon: Sun, activeTimes: [TimeOfDay.Morning] },
  ],
  mystery: [
    { id: 'fog', label: '濃霧地帯', x: 50, y: 50, icon: Cloud, activeTimes: [TimeOfDay.Morning] },
  ]
};

export const CREATURES: Creature[] = [
  {
    id: '001',
    name: '綿あめ犬',
    latinName: 'Canis Saccharum',
    type: CreatureType.Park,
    activeTime: [TimeOfDay.Day, TimeOfDay.Sunset],
    imageUrl: 'https://picsum.photos/id/1025/500/500',
    shortDesc: '晴天時の公園に出現。体毛が高純度の糖分（綿あめ）で構成されており、湿度が高いと溶解してしまう。',
    dangerLevel: 1,
    syncRate: 0,
    role: 'none',
    perk: '甘い匂いで他の生物を誘き寄せる',
    trivia: [
      '雨の日は体が小さくなる。',
      '怒るとキャラメル化して少し硬くなる。',
      '実はザラメが好物。'
    ],
    evolutionLevel: 1,
    evolvesTo: '001_evo'
  },
  {
    id: '002',
    name: '豆電球ムシ',
    latinName: 'Lampyridae Volt',
    type: CreatureType.Garden,
    activeTime: [TimeOfDay.Sunset, TimeOfDay.Night],
    imageUrl: 'https://picsum.photos/id/535/500/500',
    shortDesc: '腹部がガラス質の電球状に進化した甲虫。夜間、フィラメントを振動させて発光し、仲間と交信する。',
    dangerLevel: 2,
    syncRate: 0,
    role: 'none',
    perk: '夜間の探索範囲が広がる',
    trivia: [
      '切れると交換が必要（脱皮）。',
      'LED型も最近発見されたらしい。',
      '口癖は「ピカッ」。'
    ],
    evolutionLevel: 1
  },
  {
    id: '003',
    name: '水面すべり猫',
    latinName: 'Felis Hydro',
    type: CreatureType.Water,
    activeTime: [TimeOfDay.Day, TimeOfDay.Morning],
    imageUrl: 'https://picsum.photos/id/40/500/500',
    shortDesc: '表面張力を操り、水面を滑走する猫。肉球は撥水性が高く、浮き輪のような弾力を持つ。',
    dangerLevel: 2,
    syncRate: 0,
    role: 'none',
    perk: '水辺エリアでのアイテム発見率UP',
    trivia: [
      '実は泳げない。',
      '肉球はプニプニというよりポヨポヨ。',
      '魚より水草が好き。'
    ],
    evolutionLevel: 1
  },
  {
    id: '004',
    name: 'しおり竜',
    latinName: 'Draco Bookmarkus',
    type: CreatureType.House,
    activeTime: [TimeOfDay.Night, TimeOfDay.Any],
    imageUrl: 'https://picsum.photos/id/1033/500/500',
    shortDesc: '読みかけの書籍に擬態する極小ドラゴン。物語の内容を吸収し、就寝中の人間に夢として見せることがある。',
    dangerLevel: 1,
    syncRate: 0,
    role: 'none',
    perk: '未探索エリアのヒントをくれる',
    trivia: [
      'ミステリー小説を食べると体色が黒くなる。',
      '電子書籍は味がしなくて嫌い。',
      '辞書を枕にするのがトレンド。'
    ],
    evolutionLevel: 1
  },
  {
    id: '005',
    name: 'Wi-Fi妖精',
    latinName: 'Spiritus Wireless',
    type: CreatureType.House,
    activeTime: [TimeOfDay.Any],
    imageUrl: 'https://picsum.photos/id/804/500/500',
    shortDesc: 'Wi-Fiルーター周辺に発生する光の粒子。機嫌が良いと通信速度をブーストするが、怒ると接続を遮断する。',
    dangerLevel: 3,
    syncRate: 0,
    role: 'none',
    perk: '通信エラー（バグ）を防ぐ',
    trivia: [
      '5GHz帯の方が居心地が良いらしい。',
      'パスワードを変えると混乱する。',
      'ストリーミング動画を横から覗いている。'
    ],
    evolutionLevel: 1
  },
  {
    id: '006',
    name: 'シャドー・ドッグ',
    latinName: 'Umbra Canis',
    type: CreatureType.Garden,
    activeTime: [TimeOfDay.Sunset],
    imageUrl: 'https://picsum.photos/id/237/500/500',
    shortDesc: '夕暮れ時に伸びた影から実体化する黒い犬。物理的な攻撃は通じないが、撫でると温もりを感じる。',
    dangerLevel: 2,
    syncRate: 0,
    role: 'none',
    perk: 'レア生物の気配を察知する',
    trivia: [
      '本体は影の方。',
      '真夜中は逆に姿が見えなくなる。',
      '日向ぼっこは苦手。'
    ],
    evolutionLevel: 1
  },
  {
    id: '007',
    name: 'アスファルト亀',
    latinName: 'Testudo Cementum',
    type: CreatureType.Park,
    activeTime: [TimeOfDay.Day, TimeOfDay.Morning],
    imageUrl: 'https://picsum.photos/id/837/500/500',
    shortDesc: '甲羅がコンクリートと同化している亀。道路のひび割れに擬態して獲物を待つ。強度は鉄に匹敵する。',
    dangerLevel: 1,
    syncRate: 0,
    role: 'none',
    perk: '防御力UP（お土産を落とさない）',
    trivia: [
      '歩くたびにゴリゴリ音がする。',
      'マンホールのふたに恋をすることがある。',
      '夏場は熱くなりすぎて機嫌が悪い。'
    ],
    evolutionLevel: 1
  },
  {
    id: '008',
    name: 'ドリーム・バブル魚',
    latinName: 'Piscis Bulla',
    type: CreatureType.Water,
    activeTime: [TimeOfDay.Morning, TimeOfDay.Day],
    imageUrl: 'https://picsum.photos/id/1053/500/500',
    shortDesc: '七色に輝く泡を吐き出す魚。泡の表面には、その魚が見た「過去の風景」が映し出されるという。',
    dangerLevel: 3,
    syncRate: 0,
    role: 'none',
    perk: '過去ログ（図鑑）にボーナス効果',
    trivia: [
      '泡は触れるとパチンと弾けて音が鳴る。',
      '悲しい過去は黒い泡になる。',
      '陸上でも泡の中なら活動できる。'
    ],
    evolutionLevel: 1
  },
  {
    id: '009',
    name: 'ミスト・スパイダー',
    latinName: 'Aranea Nebula',
    type: CreatureType.Mystery,
    activeTime: [TimeOfDay.Morning],
    imageUrl: 'https://picsum.photos/id/166/500/500',
    shortDesc: '濃霧の朝にのみ出現。水滴で構成された巣を張る。巣に触れると霧散してしまうため、捕獲は困難。',
    dangerLevel: 4,
    syncRate: 0,
    role: 'none',
    perk: '朝の探索成功率UP',
    trivia: [
      '巣にかかるのは霧だけ。',
      '太陽が出ると蒸発して消える。',
      '実は高所恐怖症。'
    ],
    evolutionLevel: 1
  },
  {
    id: '010',
    name: 'ヤキソバ・イヌ',
    latinName: 'Canis Friednoodle',
    type: CreatureType.Park,
    activeTime: [TimeOfDay.Day, TimeOfDay.Sunset],
    imageUrl: '/char/yakisoba_art.jpg',
    sketchUrl: '/char/yakisoba_sketch.jpg',
    realImageUrl: '/char/yakisoba_real.jpg',
    shortDesc: '麺のような体毛を持つ犬型生物。香ばしい匂いで獲物を誘う。実はソース味と塩味の亜種が存在するらしい。',
    dangerLevel: 3,
    syncRate: 0,
    role: 'none',
    perk: '空腹時にアイテム発見率UP',
    trivia: [
      '雨に濡れるとふやけて動きが鈍る。',
      '紅生姜のようなアクセサリーを好む。',
      '熱い場所が好き。'
    ],
    evolutionLevel: 1
  },
  {
    id: '011',
    name: 'ブロッコリー・インコ',
    latinName: 'Psittacus Brassica',
    type: CreatureType.Garden,
    activeTime: [TimeOfDay.Day, TimeOfDay.Morning],
    imageUrl: '/creatures/broccoli_bird.jpg',
    shortDesc: '野菜畑に擬態する鳥。羽毛がブロッコリーの房のように発達している。マヨネーズを見ると興奮してさえずる。',
    dangerLevel: 1,
    syncRate: 0,
    role: 'none',
    perk: '野菜の鮮度を見分ける',
    trivia: [
      '実は野菜嫌い（虫を食べる）。',
      '茹でられる夢を見てうなされることがある。',
      'ドレッシングの匂いが好き。'
    ],
    evolutionLevel: 1
  },
  {
    id: '012',
    name: 'エンピツ・ツムリ',
    latinName: 'Cochlea Graphit',
    type: CreatureType.House,
    activeTime: [TimeOfDay.Any],
    imageUrl: '/creatures/pencil_snail.jpg',
    shortDesc: '殻が鉛筆削りの削りカスで構成されているカタツムリ。這った跡に黒い線が残るため、自分の居場所を隠せない。',
    dangerLevel: 1,
    syncRate: 0,
    role: 'none',
    perk: '地図の未完成部分を補完する',
    trivia: [
      '芯の硬さはHB。',
      '消しゴムが天敵。',
      '興奮すると芯が折れる。'
    ],
    evolutionLevel: 1
  },
  {
    id: '013',
    name: 'フルーツ・クラゲ',
    latinName: 'Medusa Fructus',
    type: CreatureType.Water,
    activeTime: [TimeOfDay.Day],
    imageUrl: '/creatures/fruit_jelly.png',
    shortDesc: '体内に新鮮なフルーツを取り込んでいる透明なクラゲ。ゼリーのような弾力があり、甘い香りが漂っている。',
    dangerLevel: 2,
    syncRate: 0,
    role: 'none',
    perk: '疲労回復（甘いもの補給）',
    trivia: [
      '冷やすと動きが鈍くなる。',
      '季節によって中身のフルーツが変わる。',
      '炭酸水に入れるとシュワシュワする。'
    ],
    evolutionLevel: 1
  },
  // --- PLACEHOLDERS TO REACH 50 ---
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `uj_${i + 11}`,
    name: '？？？',
    latinName: 'Unobserved Specimen',
    type: CreatureType.Mystery,
    activeTime: [TimeOfDay.Any],
    imageUrl: '/image/unknown_creature.png', // Fallback image needed or handle in UI
    shortDesc: '未観測の生体反応。詳細な調査が必要。',
    dangerLevel: 1 as 1 | 2 | 3 | 4 | 5,
    syncRate: 0,
    role: 'none' as 'none',
    perk: '???',
    trivia: [],
    evolutionLevel: 1
  }))
];

export const APP_NAME = "パラレル生物図鑑";

export const ITEMS: Item[] = [
  {
    id: 'item_stone',
    name: '不思議な石',
    icon: '🪨',
    description: '異世界の波動を感じる石。持っていると少しだけ運気が上がる気がする。',
    type: 'material',
    effectValue: 5
  },
  {
    id: 'item_nut',
    name: 'パラレルナッツ',
    icon: '🌰',
    description: '食べると少しだけ浮くらしい木の実。味は未知数。',
    type: 'food',
    effectValue: 10
  },
  {
    id: 'item_screw',
    name: '謎のネジ',
    icon: '🔩',
    description: 'どこのパーツだろう？ 異世界の機械の一部かもしれない。',
    type: 'material',
    effectValue: 5
  },
  {
    id: 'item_shadow',
    name: '逃げ去る影の残滓',
    icon: '💨',
    description: '捕まえられなかった悔しさの結晶。手で触れるとスルリと抜けていく。',
    type: 'lore',
    effectValue: 2
  },
  {
    id: 'item_candy',
    name: '異世界のキャンディ',
    icon: '🍬',
    description: '舐めると風景が少し歪んで見える。相棒が大好きな味。',
    type: 'food',
    effectValue: 20
  },
  {
    id: 'item_memo',
    name: 'おじさんのメモ',
    icon: '📝',
    description: '博士が落とした走り書き。「今日は夕方が狙い目」と書いてある。',
    type: 'lore',
    effectValue: 5
  }
];