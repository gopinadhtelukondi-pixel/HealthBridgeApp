import { MAP_POINTS } from "../data/map.js";

export const getMapPoints = (req, res) => {
  res.json(MAP_POINTS);
};