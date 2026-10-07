import { render, screen } from "@testing-library/react";
import Header from "../../common/header/Header";
import { useAuthStore } from "../../../stores/authStore";
import { MemoryRouter } from "react-router-dom";

test("管理者には管理者機能が表示され、一般ユーザーには表示されない", () => {
  const adminUser = {
    id: 1,
    name: "かんとく",
    is_admin: true,
  };

  useAuthStore.setState({
    user: adminUser,
    isAuthenticated: true,
  });

  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

  expect(screen.getByText("ユーザー削除")).toBeInTheDocument();

  const testUser = {
    id: 2,
    name: "ひろし",
    is_admin: false,
  };

  useAuthStore.setState({
    user: testUser,
    isAuthenticated: true,
  });

  render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );

  expect(screen.queryByText("ユーザー削除")).not.toBeInTheDocument();
});
