import type { NewNote, Note } from "@/types/note";
import type { User } from "@/types/user";
import { api } from "./api";

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const getCookieHeader = async (cookieHeader?: string): Promise<string> => {
  if (cookieHeader) {
    return cookieHeader;
  }

  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return cookieStore.toString();
};

export const fetchNotes = async (
  { page = 1, perPage = 12, search = "", tag }: FetchNotesParams,
  cookieHeader?: string,
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search.trim() && { search: search.trim() }),
      ...(tag && { tag }),
    },
    headers: {
      Cookie: await getCookieHeader(cookieHeader),
    },
  });

  return data;
};

export const fetchNoteById = async (
  id: string,
  cookieHeader?: string,
): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: await getCookieHeader(cookieHeader),
    },
  });

  return data;
};

export const createNote = async (
  note: NewNote,
  cookieHeader?: string,
): Promise<Note> => {
  const { data } = await api.post<Note>("/notes", note, {
    headers: {
      Cookie: await getCookieHeader(cookieHeader),
    },
  });

  return data;
};

export const getMe = async (cookieHeader?: string): Promise<User> => {
  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: await getCookieHeader(cookieHeader),
    },
  });

  return data;
};

export const checkSession = async (cookieHeader?: string): Promise<boolean> => {
  const { data } = await api.get<{ success: boolean }>("/auth/session", {
    headers: {
      Cookie: await getCookieHeader(cookieHeader),
    },
  });

  return data.success;
};
