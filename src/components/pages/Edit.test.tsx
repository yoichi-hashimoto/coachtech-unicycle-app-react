import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Edit from "./Edit";
import { useAuthStore } from "../../stores/authStore";
import axios from "../../api/axios";
import { MemoryRouter } from "react-router-dom";

jest.mock("../../api/axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

test("プロフィールを更新できる", async () => {
  const loginUser = {
    name: "ひろし",
    role: "member",
    current_level: 1,
    color_id: 1,
    current_animal: {
      id: 1,
      name: "ひよこ",
    },
  };

  useAuthStore.setState({
    user: loginUser,
    isAuthenticated: true,
  });

  mockedAxios.get.mockResolvedValue({
    data: [],
  });

  mockedAxios.patch.mockResolvedValue({
    data: {
      name: "さとし",
    },
  });

    const operator = userEvent.setup();
    
  render(
    <MemoryRouter>
      <Edit />
    </MemoryRouter>,
  );

  const nameInput = await screen.findByPlaceholderText(/ひろし←6文字以内/);

  await operator.type(nameInput, "さとし");

  const submitButton = screen.getByRole("button", {
    name: /とうろく/i,
  });

  await operator.click(submitButton);

  expect(mockedAxios.patch).toHaveBeenCalled();
});
