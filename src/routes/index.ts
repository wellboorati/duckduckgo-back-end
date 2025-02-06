import { Router } from "express";
import { clearSearchHistory, getSearchHistory, searchDuckDuckGo } from "../controllers/searchController";

export const router = Router();

// Search endpoints (GET and POST)
router.get("/", searchDuckDuckGo);
router.post("/", searchDuckDuckGo);

// History endpoints
router.get("/history", getSearchHistory);
router.post("/clear-history", clearSearchHistory);

