import { readData } from "./response";
import axios from "./axios";

/** @returns {Promise<import("../components/common/type/user").UserType>} */
export async function fetchLoginUser() {
    const response = await axios.get("/api/user");

    return readData(response);
}
