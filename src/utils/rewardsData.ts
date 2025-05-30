
// Define the reward structure
export type RewardTier = 'bronze' | 'silver' | 'gold';

export interface RewardDefinition {
  name: string;
  description: string;
  points: number;
  category: string;
  membership_required: RewardTier;
  inventory?: number | null;
  cuppingScore?: number;
}

// Define the rewards for each tier
export const rewardsData: RewardDefinition[] = [
  // Bronze Rewards
  {
    name: "Dose of Premium Coffee (78+ Score)",
    description: "A measured dose of our premium coffee with a cupping score of 78+",
    points: 75,
    category: "coffee",
    membership_required: "bronze",
    cuppingScore: 78
  },
  {
    name: "Free Coffee Drink (88+ Score)",
    description: "Enjoy a free coffee drink made with beans rated 88+",
    points: 75,
    category: "drink",
    membership_required: "bronze",
    cuppingScore: 88
  },
  
  // Silver Rewards
  {
    name: "50g Premium Coffee Beans (87+ Score)",
    description: "50 grams of our premium coffee beans with a cupping score of 87+",
    points: 200,
    category: "beans",
    membership_required: "silver",
    cuppingScore: 87
  },
  {
    name: "Free Premium Coffee Cup (89+ Score)",
    description: "A free cup of premium coffee made with beans rated 89+",
    points: 200,
    category: "drink",
    membership_required: "silver",
    cuppingScore: 89
  },
  
  // Gold Rewards
  {
    name: "150g Premium Coffee Bean Bag (87+ Score)",
    description: "150 grams of our premium coffee beans with a cupping score of 87+",
    points: 500,
    category: "beans",
    membership_required: "gold",
    cuppingScore: 87
  },
  {
    name: "Free Premium Coffee Cup Experience (90+ Score)",
    description: "Experience the luxury of our highest-rated 90+ coffee beans in a specially prepared cup",
    points: 500,
    category: "drink",
    membership_required: "gold",
    cuppingScore: 90
  }
];

// Helper function to convert reward definition to database format
export const convertRewardToDbFormat = (reward: RewardDefinition) => {
  return {
    name: reward.name,
    description: reward.description,
    points_required: reward.points,
    category: reward.category,
    membership_required: reward.membership_required,
    inventory: reward.inventory === undefined ? null : reward.inventory,
    cupping_score_min: reward.cuppingScore || null,
    active: true
  };
};
