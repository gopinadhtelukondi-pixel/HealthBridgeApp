import { getRecommendations } from "../services/recommendationService.js";

export const createRecommendation = async (req, res) => {
  try {
    const { symptoms, specialty, budget } = req.body;

    if (!symptoms?.trim() && !specialty?.trim()) {
      return res.status(400).json({ message: "Enter symptoms or choose a specialty" });
    }

    if (budget !== undefined && Number(budget) < 0) {
      return res.status(400).json({ message: "Budget cannot be negative" });
    }

    const recommendations = await getRecommendations(req.body);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
