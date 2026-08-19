export type DrinkCategory = "all" | "coffee" | "tea" | "alcohol" | "green_tea";

export type MoodCategory = "relax" | "reward" | "focus" | "refresh";

export interface SweetsInputData {
  name: string;
  image?: string | null; // Base64 or object URL for preview
  selectedPresetId?: string | null;
}

export interface PairingResult {
  sweets: {
    name: string;
    category: string;
    flavorProfile: string[];
    description: string;
  };
  bestMatch: {
    drinkName: string;
    category: "coffee" | "tea" | "alcohol" | "green_tea" | "other";
    categoryLabel: string;
    matchScore: number;
    catchphrase: string;
    flavorSynergy: {
      harmonyReason: string;
      scienceNotes: string;
    };
    servingGuide: {
      temperature: string;
      strengthOrBrew: string;
      recommendedVessel: string;
      specialTip: string;
    };
  };
  alternativePairings: Array<{
    drinkName: string;
    categoryLabel: string;
    matchScore: number;
    shortReason: string;
  }>;
}

export interface SweetsPreset {
  id: string;
  name: string;
  emoji: string;
  category: string;
  defaultDescription: string;
}
