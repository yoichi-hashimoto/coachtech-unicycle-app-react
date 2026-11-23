import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import AdminRoute from "./AdminRoute";

afterEach(() => {
  useAuthStore.setState(useAuthStore.getInitialState());
});

function Home() {
  const { state } = useLocation();
  return <p>{state?.authError ? "認証エラー" : "トップ"}</p>;
}

function renderRoute() {
  render(
    <MemoryRouter initialEntries={["/register"]}>
      <Routes>
        <Route path="/register" element={<AdminRoute>管理画面</AdminRoute>} />
        <Route path="/login" element={<p>ログイン</p>} />
        <Route path="/" element={<Home />} />
      </Routes>
    </MemoryRouter>,
  );
}

test("認証確認中は読み込みを表示する", () => {
  renderRoute();
  expect(screen.getByText("読み込み中...")).toBeInTheDocument();
});

test.each([
  ["unauthenticated", null, "ログイン"],
  ["error", null, "認証エラー"],
  ["authenticated", { id: 1, is_admin: false }, "トップ"],
  ["authenticated", { id: 1, is_admin: true }, "管理画面"],
])("%s の認証結果に応じて画面を表示する", (authStatus, user, expected) => {
  useAuthStore.setState({ authStatus, user });
  renderRoute();
  expect(screen.getByText(expected)).toBeInTheDocument();
});
