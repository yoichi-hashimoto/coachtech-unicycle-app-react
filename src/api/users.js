import { readData } from "./response";
import axios from "./axios";

/** @returns {Promise<import("../components/common/type/user").UserType[]>} */
export async function fetchUsers() {
    const response = await axios.get("/api/users");

    return readData(response);
}
