import { Creature, CreatureType, TimeOfDay, Item } from './types';

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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    trivia: []
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