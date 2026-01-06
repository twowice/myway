"use client";

import { compressProfileImage, uploadProfileImage } from "@/lib/user/profile";

export type MyProfileData = {
  gender: string;
  imageUrl: string;
};

export const fetchMyProfile = async (
  userId: string,
  fallbackImage?: string | null
): Promise<MyProfileData> => {
  const response = await fetch(`/api/mypage/profile?userId=${userId}`);
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "프로필 조회 실패");
  }

  const data = (await response.json()) as {
    gender?: string | null;
    imageUrl?: string | null;
  };

  return {
    gender: data?.gender ?? "",
    imageUrl: data?.imageUrl ?? fallbackImage ?? "",
  };
};

export const updateMyGender = async (gender: string) => {
  const response = await fetch("/api/user/gender", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ gender }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message ?? "성별 저장 실패");
  }
};

export const uploadMyProfileImage = async (
  file: File,
  onUpdated?: (imageUrl: string) => void
) => {
  const compressed = await compressProfileImage(file);
  const result = await uploadProfileImage(compressed);
  if (result.imageUrl) {
    onUpdated?.(result.imageUrl);
  }
  return result;
};
