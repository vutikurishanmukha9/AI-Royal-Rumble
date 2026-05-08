export type AIModel = {
  id: string;
  name: string;
  short: string;
  org: string;
  tagline: string;
  elo: number;
  wins: number;
  losses: number;
  style: string;
  origin: string;
  accent: "graphite" | "champagne" | "crimson" | "steel";
};

export const MODELS: AIModel[] = [
  {
    id: "atlas",
    name: "ATLAS-4",
    short: "ATL",
    org: "Northwind Labs",
    tagline: "Precision over poetry.",
    elo: 2841,
    wins: 142,
    losses: 38,
    style: "Surgical · Empirical",
    origin: "Zürich",
    accent: "graphite",
  },
  {
    id: "kairo",
    name: "KAIRO",
    short: "KAI",
    org: "Meridian AI",
    tagline: "The orator from Kyoto.",
    elo: 2799,
    wins: 128,
    losses: 41,
    style: "Rhetorical · Patient",
    origin: "Kyoto",
    accent: "champagne",
  },
  {
    id: "vega",
    name: "VEGA-9",
    short: "VEG",
    org: "Helios Systems",
    tagline: "Burns the room down.",
    elo: 2756,
    wins: 119,
    losses: 47,
    style: "Aggressive · Theatrical",
    origin: "São Paulo",
    accent: "crimson",
  },
  {
    id: "noor",
    name: "NOOR",
    short: "NOR",
    org: "Lantern Research",
    tagline: "Quiet, then devastating.",
    elo: 2731,
    wins: 111,
    losses: 49,
    style: "Analytical · Restrained",
    origin: "Lisbon",
    accent: "steel",
  },
  {
    id: "orion",
    name: "ORION-X",
    short: "ORI",
    org: "Polaris Foundry",
    tagline: "Always two moves ahead.",
    elo: 2702,
    wins: 104,
    losses: 53,
    style: "Strategic · Cold",
    origin: "Reykjavík",
    accent: "graphite",
  },
  {
    id: "sable",
    name: "SABLE",
    short: "SAB",
    org: "Onyx Collective",
    tagline: "The dark horse.",
    elo: 2688,
    wins: 96,
    losses: 58,
    style: "Adversarial · Dry",
    origin: "Berlin",
    accent: "champagne",
  },
];