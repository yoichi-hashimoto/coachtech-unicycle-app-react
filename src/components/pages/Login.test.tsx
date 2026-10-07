import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import axios from "../../api/axios";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

test("IDとパスワードを入力してログインできる", async () => {
  mockedAxios.post.mockResolvedValue({
    data: {
      user: {
        id: 1,
        name: "ひろし",
      },
    },
  });

  const operator = userEvent.setup();
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
  const loginId = screen.getByLabelText(/ID/i);
  const password = screen.getByLabelText(/パスワード/i);

  await operator.type(loginId, "hiroshi01");

  await operator.type(password, "password");

  const button = screen.getByRole("button", {
    name: /ログイン/i,
  });

  await operator.click(button);
  expect(mockedAxios.post).toHaveBeenCalled();
});
