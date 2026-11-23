import MemberCard from "../common/cards/MemberCard";
import AnimalCard from "../common/cards/AnimalCard";
import React from "react";
import Button from "../common/button/Button";
import Modal from "../common/modal/Modal";
import { useState, useEffect } from "react";
import classes from "./PageCommon.module.css";
import { fetchAvatars } from "../../api/avatars";
import { fetchColors } from "../../api/color";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { isAxiosError } from "axios";
import axios from "../../api/axios";
import { readData, type ApiResponse } from "../../api/response";
import Toast from "../common/modal/Toast";
import Loading from "../common/modal/Loading";


type AvatarType = {
  id: number;
  avatar_path: string;
}

type UserItemType = {
  id: number;
  item_id: number;
  item: {
    id: number;
    name: string;
    avatar_path: string;
  }
}

  type ToastType = {
    message: string;
    type: "success" | "fail";
  }

type ColorType = {
  id: number;
  name: string;
  color_path: string;
}

type UpdatedPayload = {
  name?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
  user_avatar_id?: number;
  color_id?: number;
}

function Edit() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isOpen, setIsOpen] = useState(false);
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [isItemOpen, setIsItemOpen] = useState(false);
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState<string>("");
  const [userColor, setUserColor] = useState<string>("");
  const [avatars, setAvatars] = useState<AvatarType[]>([]);
  const [colors, setColors] = useState<ColorType[]>([]);
  const [userItems, setUserItems] = useState<UserItemType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastType | null>(null);



  function showToast(message:string, type:ToastType["type"]= "success") {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  }

  const [formData, setFormData] = useState({
    name: "",
    current_password: "",
    password: "",
    password_confirmation: "",
    user_avatar_id: "",
    color_id: "",
  });

  useEffect(() => {
    async function loadAvatars() {
      try {
        setIsLoading(true);
        const allAvatars = await fetchAvatars();
        setAvatars(allAvatars);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAvatars();
  }, []);

  useEffect(() => {
    fetchColors().then((data) => {
      console.log(data);
      setColors(data);
    });
  }, []);

  useEffect(() => {
    if (user?.user_items) {
      setUserItems(user.user_items);
    }
  }, [user]);

  const avatarChange = (avatar:AvatarType) => {
    setUserImage(avatar.avatar_path);
    setFormData((prev) => ({
      ...prev,
      user_avatar_id: String(avatar.id),
    }));
    setIsOpen(false);
  };

  const colorChange = (color:ColorType) => {
    setUserColor(color.color_path);
    setFormData((prev) => ({
      ...prev,
      color_id: String(color.id),
    }));
    setIsColorOpen(false);
  };

  const handleEquipItem = async (userItemId:number) => {
    try {
      setIsLoading(true);
      const response = await axios.patch<ApiResponse<{ user_item: UserItemType }>>(`/api/user_item/${userItemId}`);
      const equippedItem = readData(response).user_item;
      setUser({ ...user, equipped_item_path: equippedItem.item.avatar_path });
    } catch (error) {
      console.error(error);
      setToast({
        message: "アイテムの変更に失敗しました",
        type: "fail",
      });
    } finally {
      setIsLoading(false);
    }
    setIsItemOpen(false);
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) return;

    const {
      name,
      current_password,
      password,
      password_confirmation,
      user_avatar_id,
      color_id,
    } = formData;

    const isPasswordChange =
      current_password !== "" ||
      password !== "" ||
      password_confirmation !== "";

    if (isPasswordChange) {
      if (!current_password) {
        showToast("現在のパスワードを入力してください");
        return;
      }

      if (!password) {
        showToast("新しいパスワードを入力してください");
        return;
      }

      if (password.length < 8) {
        showToast("新しいパスワードは8文字以上で入力してください");
        return;
      }

      if (password !== password_confirmation) {
        showToast("新しいパスワードが一致しません");
        return;
      }
    }

    const payload:UpdatedPayload = {};

    if (name.trim() !== "") {
      payload.name = name.trim();
    }

    if (user_avatar_id !== "") {
      payload.user_avatar_id = Number(user_avatar_id);
    }

    if (color_id !== "") {
      payload.color_id = Number(color_id);
    }

    if (isPasswordChange) {
      payload.current_password = current_password;
      payload.password = password;
      payload.password_confirmation = password_confirmation;
    }
    setIsLoading(true);

    type ValidationErrorResponse = {
      errors?: Record<string, string[]>;
    };

    try {

      await axios.get("/sanctum/csrf-cookie");
      const response = await axios.patch(`/api/users/${user.id}`, payload);

      setUser(readData(response));
      setFormData({ name: "", current_password: "", password: "", password_confirmation: "", user_avatar_id: "", color_id: "" });
      showToast("更新しました");
      navigate("/profile");

    } catch (error) {
      if (isAxiosError<ValidationErrorResponse>(error)) {
        const status = error.response?.status;

        if (status === 422) {
          const errors = error.response?.data?.errors ?? {};
          const firstMessage = Object.values(errors)[0]?.[0];

          showToast(
            firstMessage ?? "入力内容を確認してください",
            "fail"
          );
        } else if (status === 401) {
          showToast("ログインしなおしてください", "fail");
        } else if (status === 403) {
          showToast("この変更を行う権限がありません", "fail");
        } else {
          showToast("更新に失敗しました", "fail");
        }
      } else {
        showToast("更新に失敗しました", "fail");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <Loading />;

  return (
    <div className={classes.contentsWrapper}>
      {isLoading && <Loading />}
      <h1>プロフィール変更</h1>
      <div className={classes.editContainer}>
        <MemberCard
          member={{
            ...user,
            avatar_path: userImage || user.avatar_path,
            color_path: userColor || user.color_path,
          }}
          showButton={false}
          level={user.current_level}
          success={user?.success_score}
        />
        <AnimalCard
          animal={user.current_animal}
          remainLevel={user.remain_level}
          currentLevel={user.current_level}
        />
      </div>
      <div className={classes.inputContainer}>
        <div className={classes.buttonWrapper}>
          <Button
            variant="primary"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            アバターを変更する
          </Button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
            <div className={classes.avatarSelector}>
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  className={classes.avatarButton}
                  name="user_avatar_id"
                  value={avatar.id}
                  onClick={() => avatarChange(avatar)}
                >
                  <img
                    src={avatar.avatar_path}
                    className={classes.avatarImg}
                    alt="avatar_image"
                    key={avatar.id}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </Modal>
          <Button variant="primary" onClick={() => setIsColorOpen(true)}>
            背景を選択する
          </Button>
          <Modal
            isOpen={isColorOpen}
            onClose={() => {
              setIsColorOpen(false);
            }}
          >
            <div className={classes.colorContainer}>
              {colors.map((color) => (
                <div className={classes.colors}>
                  <button
                    key={color.id}
                    name="color_id"
                    value={color.id}
                    style={{ backgroundColor: color.color_path }}
                    className={classes.bgColors}
                    onClick={() => colorChange(color)}
                  ></button>
                  <p>{color.name}</p>
                </div>
              ))}
            </div>
          </Modal>
          <Button variant="primary" onClick={() => setIsItemOpen(true)}>
            アイテムを変更する
          </Button>
          <Modal
            isOpen={isItemOpen}
            onClose={() => {
              setIsItemOpen(false);
            }}
          >
            <div className={classes.itemModalContainer}>
              {userItems.map((userItem) => (
                <div className={classes.itemContainer} key={userItem.id}>
                  <button
                    key={userItem.id}
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleEquipItem(userItem.id)}
                    className={classes.usersItems}
                  >
                    <img
                      src={userItem.item.avatar_path}
                      alt=""
                      className={classes.itemsImage}
                      loading="lazy"
                    />
                  </button>
                  <p>{userItem.item.name}</p>
                </div>
              ))}
            </div>
          </Modal>
        </div>
        <div className={classes.inputWrapper}>
          <label htmlFor="name">なまえ</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            placeholder={`${user.name}←6文字以内で入力してください`}
            onChange={handleChange}
          />
          <label htmlFor="current_password">今のパスワード</label>{" "}
          <input
            id="current-password"
            type="password"
            name="current_password"
            value={formData.current_password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <label htmlFor="password">パスワード変更</label>{" "}
          <input
            id="new-password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={"8文字以上で設定してください"}
            autoComplete="new-password"
          />
          <label htmlFor="password_confirmation">パスワード確認</label>{" "}
          <input
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>
        <div style={{ margin: "auto", textAlign: "center" }}>
          <Button variant="primary" onClick={handleSubmit}>
            とうろく
          </Button>
        </div>
        <div className={classes.toastWrapper}>
          {toast && <Toast message={toast.message} type={toast.type} />}
        </div>
      </div>
    </div>
  );
}

export default Edit;
