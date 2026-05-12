export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8000/api/v1";

export type AIRumbleModel = {
  name: string;
  display_name: string;
  tagline: string;
  personality: string;
  is_active: boolean;
};

export type CreateRumbleRequest = {
  task: string;
  selected_ais?: string[];
};

export type CreateRumbleResponse = {
  rumble_id: string;
  task: string;
  selected_ais: string[];
  status: string;
  stream_url: string;
};

export type RumbleArgument = {
  ai_name: string;
  argument_type: string;
  content: string;
  phase?: string | null;
  target_ai?: string | null;
};

export type RumbleRound = {
  round_type: string;
  round_number: number;
  status: string;
  arguments: RumbleArgument[];
};

export type RumbleState = {
  rumble_id: string;
  task: string;
  status: string;
  selected_ais: string[];
  rounds: RumbleRound[];
  votes: Record<string, number>;
  winner?: string | null;
};

export type VoteResponse = {
  success: boolean;
  voted_ai: string;
  current_votes: Record<string, number>;
  total_votes: number;
};

export type ResultsResponse = {
  rumble_id: string;
  task: string;
  winner: string | null;
  winner_display_name: string | null;
  winner_tagline: string | null;
  final_votes: Record<string, number>;
  total_votes: number;
  winner_percentage: number;
  key_arguments: Record<string, string>;
  completed_at: string | null;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    const message = body?.message || body?.detail?.message || "Request failed";
    throw new Error(message);
  }
  return body as T;
}

export function createRumble(payload: CreateRumbleRequest) {
  return request<CreateRumbleResponse>("/rumble", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getRumble(rumbleId: string) {
  return request<RumbleState>(`/rumble/${rumbleId}`);
}

export function castVote(rumbleId: string, votedAi: string) {
  return request<VoteResponse>(`/rumble/${rumbleId}/vote`, {
    method: "POST",
    body: JSON.stringify({ voted_ai: votedAi }),
  });
}

export function getResults(rumbleId: string) {
  return request<ResultsResponse>(`/rumble/${rumbleId}/results`);
}

export function getModels() {
  return request<{ models: AIRumbleModel[] }>("/models");
}

export function streamUrl(rumbleId: string) {
  return `${API_BASE_URL}/rumble/${rumbleId}/stream`;
}
