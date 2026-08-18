import { PairingResult, DrinkCategory, SweetsInputData } from "@/types/pairing";
import { generatePairingMock } from "@/lib/mockPairingService";

/**
 * ペアリング診断を実行するエントリーポイント
 * ※現在はモックサービスを使用。後ほどGemini APIエンドポイントに切り替え可能。
 */
export async function getPairingDiagnosis(
  input: SweetsInputData,
  category: DrinkCategory
): Promise<PairingResult> {
  // リアルなAI診断感を出すため、1秒程度の適度なローディング遅延を挟む
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // モックデータを生成して返却
  return generatePairingMock(input.name, category);
}
