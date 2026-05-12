export type AIModel = {
  id: string;
  name: string;
  short: string;
  org: string;
  tagline: string;
  tint: string;        // hex pastel tint
  tintClass: string;   // tailwind bg class
  stripe: [string, string, string]; // tricolor
  elo: number;
  wins: number;
  losses: number;
};

export const MODELS: AIModel[] = [
  { id:"gpt4o",      name:"GPT-4o",     short:"GPT", org:"OpenAI",     tagline:"The Composed Strategist",
    tint:"#FEF9EE", tintClass:"bg-ai-gpt",
    stripe:["#5A6472","#2A2826","#C4882A"], elo:2841, wins:142, losses:38 },
  { id:"claude",     name:"Claude",     short:"CLD", org:"Anthropic",  tagline:"The Calm Intellectual",
    tint:"#E8F4EE", tintClass:"bg-ai-claude",
    stripe:["#C49A6C","#2A2826","#5A8A6E"], elo:2812, wins:135, losses:41 },
  { id:"gemini",     name:"Gemini",     short:"GEM", org:"Google",     tagline:"The Polished Executive",
    tint:"#E8F0FE", tintClass:"bg-ai-gemini",
    stripe:["#4A8FE7","#2A2826","#8B1E2D"], elo:2778, wins:128, losses:46 },
  { id:"grok",       name:"Grok",       short:"GRK", org:"xAI",        tagline:"The Chaotic Rebel",
    tint:"#FDE8E8", tintClass:"bg-ai-grok",
    stripe:["#8B1E2D","#0E0E0E","#C4882A"], elo:2691, wins:108, losses:62 },
  { id:"deepseek",   name:"DeepSeek",   short:"DSK", org:"DeepSeek",   tagline:"The Hungry Challenger",
    tint:"#E8ECF4", tintClass:"bg-ai-deepseek",
    stripe:["#5A6472","#1A2138","#8B1E2D"], elo:2674, wins:104, losses:58 },
  { id:"perplexity", name:"Perplexity", short:"PPL", org:"Perplexity", tagline:"The Relentless Researcher",
    tint:"#F0EDF8", tintClass:"bg-ai-perplexity",
    stripe:["#7A6BAE","#2A2826","#5A6472"], elo:2645, wins:99, losses:64 },
  { id:"llama",      name:"LLaMA",      short:"LMA", org:"Meta",       tagline:"The Open Maverick",
    tint:"#F0EEE8", tintClass:"bg-ai-llama",
    stripe:["#C4A06A","#2A2826","#5A6472"], elo:2622, wins:96, losses:71 },
  { id:"qwen",       name:"Qwen",       short:"QWN", org:"Alibaba",    tagline:"The Silent Precision",
    tint:"#E8F4F2", tintClass:"bg-ai-qwen",
    stripe:["#5A8A88","#2A2826","#8B1E2D"], elo:2598, wins:91, losses:74 },
  { id:"kimi",       name:"Kimi",       short:"KMI", org:"Moonshot",   tagline:"The Rising Force",
    tint:"#FEF4E8", tintClass:"bg-ai-kimi",
    stripe:["#C4882A","#2A2826","#8B1E2D"], elo:2571, wins:84, losses:78 },
];

export const byId = (id: string) => MODELS.find((model) => model.id === id) ?? MODELS[0];
