import { readData } from "./response";

test("API が返したデータを取り出す", () => {
  const notices = [{ id: 1 }];
  expect(readData({ data: { data: notices } })).toEqual(notices);
  expect(readData({ data: { data: null } })).toBeNull();
});

test("データのないレスポンスを契約違反として扱う", () => {
  const response = { data: {} } as Parameters<typeof readData>[0];
  expect(() => readData(response)).toThrow("Invalid API response");
});
