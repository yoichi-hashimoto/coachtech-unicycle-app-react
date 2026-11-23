export type ApiResponse<T> = {
  data: T;
  message?: string;
};

export function readData<T>(response: { data: ApiResponse<T> }): T {
  if (response.data == null || !Object.prototype.hasOwnProperty.call(response.data, "data")) {
    throw new Error("Invalid API response");
  }
  return response.data.data;
}
