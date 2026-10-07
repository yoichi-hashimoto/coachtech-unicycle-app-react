import { render, screen } from "@testing-library/react";
import Profile from "./Profile";
import { useAuthStore } from "../../stores/authStore";
import { MemoryRouter } from "react-router-dom";

test("ログインユーザーのプロフィールが表示される", () => {
    const loginUser = {
        name: "ひろし",
        role: "member",
        current_level: 5,
        total_points:10,
        current_animal: {
            id:1,
            name: "ひよこ",
        }
    };

    useAuthStore.setState({
        user: loginUser,
        isAuthenticated: true,
    });

    render(
        <MemoryRouter>
            <Profile />
        </MemoryRouter>);

    expect(screen.getByText("ひろし")).toBeInTheDocument();
    expect(screen.getByText("ひよこ")).toBeInTheDocument();
});