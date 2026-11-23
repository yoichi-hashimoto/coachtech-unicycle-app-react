import { readData } from "./response";
import axios from "./axios";

/** @returns {Promise<{ id: number, name: string, color_path: string }[]>} */
export async function fetchColors() {
  const response = await axios.get("/api/colors");

    return readData(response);
}
