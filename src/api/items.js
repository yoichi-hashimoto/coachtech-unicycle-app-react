import { readData } from "./response";
import axios from "./axios";

/** @returns {Promise<import("../components/common/type/item").ItemType[]>} */
export async function fetchItems() {
  const response = await axios.get(`/api/items`);

    return readData(response);
}
