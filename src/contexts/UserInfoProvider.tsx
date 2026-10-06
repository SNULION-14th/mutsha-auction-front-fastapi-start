import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { UserProfile } from "@/apis/api";
import {
  Profile1,
  Profile2,
  Profile3,
  Profile4,
  Profile5,
  Profile6,
} from "@/assets/image";
import {
  useUserProfile,
  useLogout,
  useUpdateUserProfile,
  useUpdatePoints,
} from "@/hooks/useAuthQuery";
import { useQueryClient } from "@tanstack/react-query";

type UserInfoContextType = {
  isLoggedIn: boolean;
  profileImage: string;
  nickname: string;
  points: number;
  isLoading: boolean;
  login: (profile: UserProfile) => void;
  logout: () => void;
  updateProfile: (nickname: string, profilepicId: number) => void;
  refreshUserInfo: () => Promise<void>;
  updatePoints: (newPoints: number) => void;
};

const UserInfoContext = createContext<UserInfoContextType | null>(null);

const PROFILE_IMAGES = [
  Profile1,
  Profile2,
  Profile3,
  Profile4,
  Profile5,
  Profile6,
];

function getProfileImageById(id: number | null | undefined): string {
  if (!id) return Profile1;
  return PROFILE_IMAGES[(id - 1) % PROFILE_IMAGES.length] ?? Profile1;
}

export function UserInfoProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();

  // Use TanStack Query for user profile
  // enabled: false prevents automatic fetching on mount
  const { data: userProfile, isLoading, refetch } = useUserProfile(false);
  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateUserProfile();
  const updatePointsMutation = useUpdatePoints();

  // Session restoration on mount - only run once
  useEffect(() => {
    // Don't auto-fetch if we're on the auth callback page
    // The Auth component will handle login and seed the cache
    if (window.location.pathname === "/auth") {
      return;
    }

    // Attempt to restore session by fetching user profile
    // If cookies exist (httponly), backend will authenticate
    // If not, the query will fail silently and user stays logged out
    refetch();
  }, []);

  // Derived state from query data
  const isLoggedIn = useMemo(() => !!userProfile, [userProfile]);
  const profileImage = useMemo(
    () => getProfileImageById(userProfile?.profilepic_id),
    [userProfile?.profilepic_id],
  );
  const nickname = useMemo(
    () => userProfile?.nickname ?? "닉네임",
    [userProfile?.nickname],
  );
  const points = useMemo(
    () => userProfile?.remaining_points ?? 0,
    [userProfile?.remaining_points],
  );

  const logout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const login = useCallback(
    (profile: UserProfile) => {
      // Seed the query cache with login data
      queryClient.setQueryData(["user", "profile"], profile);
    },
    [queryClient],
  );

  const updateProfile = useCallback(
    (newNickname: string, profilepicId: number) => {
      updateProfileMutation.mutate({
        nickname: newNickname,
        profilepic_id: profilepicId,
      });
    },
    [updateProfileMutation],
  );

  const refreshUserInfo = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const updatePoints = useCallback(
    (newPoints: number) => {
      updatePointsMutation.mutate(newPoints);
    },
    [updatePointsMutation],
  );

  return (
    <UserInfoContext.Provider
      value={{
        isLoggedIn,
        profileImage,
        nickname,
        points,
        isLoading,
        login,
        logout,
        updateProfile,
        refreshUserInfo,
        updatePoints,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
}

export function useUserInfo() {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error("useUserInfo must be used within UserInfoProvider");
  }
  return context;
}
