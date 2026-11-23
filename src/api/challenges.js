import { readData } from "./response";
import axios from "./axios";

/** @returns {Promise<import("../components/common/type/challenge").ChallengeType[]>} */
export async function fetchChallenges() {
  const response = await axios.get("/api/challenges");
    return readData(response);
}
