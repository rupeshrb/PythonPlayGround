import { codeSnippets, type CodeSnippet, type InsertCodeSnippet } from "@shared/schema";

export interface IStorage {
  // User related operations from the existing schema
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Code snippet operations
  saveCodeSnippet(snippet: InsertCodeSnippet): Promise<CodeSnippet>;
  getCodeSnippets(): Promise<CodeSnippet[]>;
  getCodeSnippet(id: number): Promise<CodeSnippet | undefined>;
  updateCodeSnippet(id: number, snippet: Partial<InsertCodeSnippet>): Promise<CodeSnippet | undefined>;
  deleteCodeSnippet(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private snippets: Map<number, CodeSnippet>;
  private userIdCounter: number;
  private snippetIdCounter: number;

  constructor() {
    this.users = new Map();
    this.snippets = new Map();
    this.userIdCounter = 1;
    this.snippetIdCounter = 1;
  }

  // User related operations (from the existing implementation)
  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Code snippet operations
  async saveCodeSnippet(snippet: InsertCodeSnippet): Promise<CodeSnippet> {
    const id = this.snippetIdCounter++;
    const newSnippet: CodeSnippet = { ...snippet, id };
    this.snippets.set(id, newSnippet);
    return newSnippet;
  }

  async getCodeSnippets(): Promise<CodeSnippet[]> {
    return Array.from(this.snippets.values()).sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }

  async getCodeSnippet(id: number): Promise<CodeSnippet | undefined> {
    return this.snippets.get(id);
  }

  async updateCodeSnippet(id: number, updatedFields: Partial<InsertCodeSnippet>): Promise<CodeSnippet | undefined> {
    const snippet = this.snippets.get(id);
    if (!snippet) return undefined;
    
    const updatedSnippet = { ...snippet, ...updatedFields };
    this.snippets.set(id, updatedSnippet);
    return updatedSnippet;
  }

  async deleteCodeSnippet(id: number): Promise<boolean> {
    return this.snippets.delete(id);
  }
}

export const storage = new MemStorage();
