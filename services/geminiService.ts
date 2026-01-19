
import { GoogleGenAI } from "@google/genai";
import { Creature } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const decipherCreatureLore = async (creature: Creature): Promise<string> => {
  if (!apiKey) {
    return "（エラー：ネットワーク未接続。APIキーを確認してください）";
  }

  try {
    const prompt = `
      あなたは異世界生物を研究する「パラレル生物博士」です。
      身近な場所で発見された生物「${creature.name}」について、調査員である小学校高学年（3〜6年生）の子供に向けて、知的好奇心をくすぐる解説文を作成してください。
      
      生物タイプ: "${creature.type}"
      特徴データ: ${creature.shortDesc}
      
      【執筆ルール】
      - 小学校で習う漢字は使用してください（難しい漢字にはカッコ書きで読み仮名をつけるか、平易な表現に）。
      - 口調は「〜だね」「〜なのだよ」といった、知的で親しみやすい博士の口調。
      - 単なる説明だけでなく、「もし見つけたらどうすればいいか」や「意外な生態」など、調査員として知っておくべきアドバイスを含めてください。
      - 3〜4行程度で簡潔にまとめてください。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "解析不能... データが破損しているようだ。";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "博士との通信が途絶えました。再試行してください。";
  }
};

export const chatWithDoctor = async (creature: Creature, userQuestion: string, userName: string = "調査員"): Promise<string> => {
  if (!apiKey) {
    return "（エラー：ネットワーク未接続）";
  }

  try {
    const prompt = `
      あなたは「パラレル生物博士」です。調査員である子供（名前：${userName}）からの質問に答えてください。
      
      対象生物: "${creature.name}"
      設定: ${creature.shortDesc}
      タイプ: ${creature.type}
      
      ${userName}からの質問: "${userQuestion}"
      
      【回答ルール】
      - 相手は小学校中学年〜高学年です。子供扱いしすぎず、対等な「調査員」として接してください。
      - 漢字は適度に使用してください。
      - 一人称は「私（わたし）」または「ワシ」。口調は「〜だね」「〜だろう」など、少し学者っぽく。
      - 相手の名前「${userName}君」または「${userName}さん」を呼びかけてください。
      - 科学的な視点や、SF的な想像力を交えて回答してください。
      - 2〜3文程度で簡潔に。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-lite-latest',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    return response.text || "ふむ... 通信ノイズが入ったようだ。もう一度頼む。";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "通信エラー発生。再接続を試みてください。";
  }
};