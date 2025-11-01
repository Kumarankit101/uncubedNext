export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  createdAt: string;
}

export interface Project {
  id: string;
  userId: string;
  startupName: string;
  description: string;
  tagline?: string;
  problem?: string;
  solution?: string;
  targetMarket?: string;
  startupIdea: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  category: 'ALL-IN-ONE' | 'IDEA_VALIDATION' | 'BUSINESS_STRATEGY' | 'PRODUCT_STRATEGY' | 'BRAND_MARKETING' | 'GROWTH_OPERATIONS';
  color: string;
}

export interface AgentResult {
  id: string;
  projectId: string;
  agentId: string;
  input: string;
  output: string;
  status: 'processing' | 'completed' | 'failed';
  creditsUsed: number;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  monthlyCredits: number;
  isActive: boolean;
  description?: string;
  features: string[];
}

export interface CreditTransagent {
  id: string;
  userId: string;
  amount: number;
  type: 'purchase' | 'usage' | 'refund';
  description: string;
  createdAt: string;
}
export interface StartupDetailData {
  id: string;
  startupName: string;
  description: string;
  status: string;
  lastUpdated: string;
  createdAt: string;
  startupIdea: string;
  tagline: string;
  problem: string;
  solution: string;
  targetMarket: string;
  results: {
    outputId: string;
    agentRunId:string;
    agentId: string;
    agentName: string;
    status: string;
    createdAt: string;
    content: string;
    /** Supported output formats: markdown, json, text, pdf, etc. */
    format: 'markdown' | 'json' | 'text' | 'pdf' | 'gammaResponse' |  string;
    creditsUsed: number;
  }[];
  activityLog: {
    id: string;
    agent: string;
    timestamp: string;
    user: string;
  }[];
   notes: string;
}