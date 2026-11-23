import { readData } from "./response";
import axios from "./axios";

/** @returns {Promise<import("../components/common/type/skill").SkillType[]>} */
export async function fetchSkills() {
    const response = await axios.get(`/api/skills`);

    return readData(response);
}
