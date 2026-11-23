import { readData } from "./response";
import axios from "./axios";

/** @returns {Promise<{ id: number, avatar_path: string }[]>} */
export async function fetchAvatars() {
    const response = await axios.get("/api/avatars");

    return readData(response);
}
