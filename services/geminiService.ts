
import { Creature } from "../types";

// API呼び出しを模擬し、固定またはランダムな応答を返すサービス

export const decipherCreatureLore = async (creature: Creature): Promise<string> => {
  // 擬似的なネットワーク遅延
  await new Promise(resolve => setTimeout(resolve, 1500));

  return `【解析完了】\n\n対象：${creature.name} (${creature.latinName})\n分類：${creature.type}\n\n観測データに基づく追加レポート：\n${creature.shortDesc}\n\nこの生物は非常に特殊な生態系の一部であり、継続的な観測が推奨されます。現時点でのデータは以上です。`;
};

export const chatWithDoctor = async (creature: Creature, userQuestion: string, userName: string = "調査員"): Promise<string> => {
  // 擬似的なネットワーク遅延
  await new Promise(resolve => setTimeout(resolve, 1000));

  const responses = [
      `ふむ、${userName}君。${creature.name}について気になるとは、いい着眼点だ。`,
      `その質問は非常に興味深い！${creature.type}の生物にはよく見られる特徴に関連しているかもしれないな。`,
      `ワシの長年の研究でも、${creature.name}にはまだまだ謎が多いのだよ。一緒に解明していこうじゃないか。`,
      `なるほど...君の観察眼には驚かされるよ。その可能性は否定できないな。`,
      `おっと、すまない。今は一時的に通信状態が不安定で、クラウド上の詳細データベースにはアクセスできないようだ。手元の資料だけで答えよう。`
  ];

  // ランダムに返答
  return responses[Math.floor(Math.random() * responses.length)];
};