import LikeButton from "./LikeButton";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuthStore } from "../../../stores/authStore";
import axios from "../../../api/axios";

jest.mock("../../../api/axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

test("❤を押すとLike状態になる", async () => {
  const loginUser = {
    id: 1,
    name: "john",
    role: "member",
  };

  const targetUser = {
    id: 2,
    name: "nao",
    role: "member",
  };

  const history = {
    id: 1,
    user_id: 2,
    challenge_id: 3,
  };

  useAuthStore.setState({
    user: loginUser,
    isAuthenticated: true,
  });

    mockedAxios.post.mockResolvedValue({
        data: {
            message:"Like成功",
        }
    })

  const user = userEvent.setup();

  render(<LikeButton likeHistory={history} fromUser={loginUser}/>);

  const button = screen.getByRole("button");
  expect(button).toHaveTextContent("❤を押す");
  await user.click(button);

  expect(button).toHaveTextContent("❤済み");
});
