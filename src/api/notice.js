import api from "./axios";
import { readData } from "./response";

/** @returns {Promise<{ id: number, title: string, text: string, created_at: string }[]>} */
export async function fetchNotice() {
  return readData(await api.get("/api/notices"));
}
