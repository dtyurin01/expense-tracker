import { api } from "@/lib/client";

import type {
  UpdateAvatarResponse,
  UserProfile,
} from "@/features/user/types/types";

export async function getMe() {
  return api.get("api/users/me").json<UserProfile>();
}

export async function uploadAvatar(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  return api
    .post("api/users/avatar", { body: formData })
    .json<UpdateAvatarResponse>();
}
