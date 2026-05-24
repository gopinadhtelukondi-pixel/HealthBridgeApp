import { getAssistantAdvice } from "../services/assistantService.js";

export const createAssistantAdvice = async (req, res) => {
  try {
    if (!req.body.symptoms?.trim() && !req.body.specialty?.trim()) {
      return res.status(400).json({ message: "Enter symptoms or choose a specialty" });
    }

    const advice = await getAssistantAdvice(req.body);
    res.json(advice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
