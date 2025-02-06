import {
  searchDuckDuckGo,
  getSearchHistory,
  clearSearchHistory,
} from "./searchController";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import fs from "fs";
import { Request, Response } from "express"; 

jest.mock("fs");

const mockAxios = new MockAdapter(axios);

describe("Search Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  test("should return search results", async () => {
    const req = {
      method: "GET",
      query: { q: "test" },
    } as unknown as Request; 
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockAxios.onGet(/duckduckgo/).reply(200, {
      RelatedTopics: [
        { Text: "Test Result 1", FirstURL: "http://example.com/1" },
        { Text: "Test Result 2", FirstURL: "http://example.com/2" },
      ],
    });

    await searchDuckDuckGo(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { title: "Test Result 1", url: "http://example.com/1" },
      { title: "Test Result 2", url: "http://example.com/2" },
    ]);
  });

  test("should return search results from POST request", async () => {
    const req = { body: { query: "test" } } as unknown as Request; 
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockAxios.onGet(/duckduckgo/).reply(200, {
      RelatedTopics: [
        { Text: "Test Result 1", FirstURL: "http://example.com/1" },
        { Text: "Test Result 2", FirstURL: "http://example.com/2" },
      ],
    });

    await searchDuckDuckGo(req, res);

    expect(res.json).toHaveBeenCalledWith([
      { title: "Test Result 1", url: "http://example.com/1" },
      { title: "Test Result 2", url: "http://example.com/2" },
    ]);
  });

  test("should handle API errors gracefully", async () => {
    const req = {
      method: "GET",
      query: { q: "test" },
    } as unknown as Request; 
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    mockAxios.onGet(/duckduckgo/).networkError();

    await searchDuckDuckGo(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch data" });
  });

  test("should return search history", () => {
    const req = {} as unknown as Request; 
    const res = { json: jest.fn() } as unknown as Response;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockReturnValue(
      JSON.stringify(["query1", "query2"])
    );

    getSearchHistory(req, res);

    expect(res.json).toHaveBeenCalledWith(["query1", "query2"]);
  });

  test("should return an empty history if no file exists", () => {
    const req = {} as unknown as Request; 
    const res = { json: jest.fn() } as unknown as Response;

    (fs.existsSync as jest.Mock).mockReturnValue(false);

    getSearchHistory(req, res);

    expect(res.json).toHaveBeenCalledWith([]);
  });

  test("should clear search history", () => {
    const req = {} as unknown as Request; 
    const res = { json: jest.fn() } as unknown as Response;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

    clearSearchHistory(req, res);

    expect(fs.unlinkSync).toHaveBeenCalledWith("search_history.json");
    expect(res.json).toHaveBeenCalledWith({ message: "History file deleted" });
  });

  test("should handle error when clearing history", () => {
    const req = {} as unknown as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.unlinkSync as jest.Mock).mockImplementation(() => {
      throw new Error("Deletion error");
    });

    clearSearchHistory(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to delete history file",
    });
  });
});
