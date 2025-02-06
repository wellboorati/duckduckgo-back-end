import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";

const HISTORY_FILE = "search_history.json";

interface SearchResult {
  title: string;
  url: string;
}

interface DuckDuckGoResponse {
  RelatedTopics: { Text: string; FirstURL: string }[];
}

const saveQuery = (query: string): void => {
  let history: string[] = [];
  if (fs.existsSync(HISTORY_FILE)) {
    history = JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8"));
  }
  if (!history.includes(query)) {
    history.push(query);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history));
  }
};

const extractResults = (topics: any[]): SearchResult[] => {
  let results: SearchResult[] = [];

  topics.forEach((item) => {
    if (item.FirstURL && item.Text) {
      results.push({ title: item.Text, url: item.FirstURL });
    }
    if (item.Topics && Array.isArray(item.Topics)) {
      results = results.concat(extractResults(item.Topics));
    }
  });

  return results;
};

export const searchDuckDuckGo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const query = req.method === "GET" ? (req.query.q as string) : req.body.query;
  if (!query) {
    res.status(400).json({ error: "Query is required" });
    return;
  }

  try {
    const {
      data: { RelatedTopics },
    } = await axios.get<DuckDuckGoResponse>(
      `http://api.duckduckgo.com/?q=${query}&format=json`
    );

    const results = extractResults(RelatedTopics);
    saveQuery(query);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

export const getSearchHistory = (req: Request, res: Response): void => {
  if (fs.existsSync(HISTORY_FILE)) {
    res.json(JSON.parse(fs.readFileSync(HISTORY_FILE, "utf-8")));
    return;
  }
  res.json([]);
};

export const clearSearchHistory = (req: Request, res: Response): void => {
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      fs.unlinkSync(HISTORY_FILE);
      console.log("History file deleted.");
      res.json({ message: "History file deleted" });
    } else {
      res.json({ message: "No history file to delete" });
    }
  } catch (error) {
    console.error("Error deleting history file:", error);
    res.status(500).json({ error: "Failed to delete history file" });
  }
};
