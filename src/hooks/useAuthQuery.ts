import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../apis/axios";
import { UserProfile } from "../apis/api";

/**
 * Query key for user profile
 */
export const userQueryKey = ["user", "profile"] as const;

/**
 * Hook to fetch and manage user profile data
 * Automatically refetches on mount if cookies exist
 */
export function useUserProfile(enabled: boolean = true) {
  return useQuery({
    queryKey: userQueryKey,
    queryFn: async (): Promise<UserProfile | null> => {
      try {
        const response = await api.get<UserProfile>("/user/me/");
        if (response.status === 200) {
          return response.data;
        }
        return null;
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        return null;
      }
    },
    enabled, // Only fetch if enabled
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if user is not authenticated
  });
}

/**
 * Hook to handle Kakao login
 * Exchanges authorization code for user session
 */
export function useKakaoLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string): Promise<UserProfile> => {
      console.log("useKakaoLogin: Calling /user/kakao/callback/ with code");

      const response = await api.get<UserProfile>("/user/kakao/callback/", {
        params: { code },
      });

      console.log("useKakaoLogin: Response status:", response.status);
      console.log("useKakaoLogin: Response data:", response.data);

      if (response.status !== 200) {
        throw new Error("Login failed");
      }

      return response.data;
    },
    onSuccess: (userData) => {
      console.log("useKakaoLogin: onSuccess called with:", userData);
      // Seed the query cache with user data from login response
      queryClient.setQueryData(userQueryKey, userData);
    },
  });
}

/**
 * Hook to handle logout
 * Calls backend to blacklist tokens and clears local state
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<void> => {
      try {
        // Call backend to blacklist the refresh token
        // Backend will read refresh token from httponly cookie
        await api.post("/user/signout/", {});
      } catch (error) {
        // Log error but continue with local cleanup
        console.error("Backend logout failed:", error);
      }
    },
    onSettled: () => {
      // Clear all query cache (always run, even if backend call fails)
      queryClient.clear();

      // Explicitly remove user profile from cache
      queryClient.removeQueries({ queryKey: userQueryKey });
    },
  });
}

/**
 * Hook to update user profile (nickname and profile picture)
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      nickname: string;
      profilepic_id: number;
    }): Promise<UserProfile> => {
      const response = await api.put<UserProfile>("/user/me/", data);

      if (response.status !== 200) {
        throw new Error("Profile update failed");
      }

      return response.data;
    },
    onSuccess: (updatedProfile) => {
      // Update the cached user profile
      queryClient.setQueryData(userQueryKey, updatedProfile);
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });
}

/**
 * Hook to update user points
 * Used after purchases or point additions
 */
export function useUpdatePoints() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (points: number): Promise<void> => {
      // Optimistically update the UI
      const previousData = queryClient.getQueryData<UserProfile>(userQueryKey);

      if (previousData) {
        queryClient.setQueryData<UserProfile>(userQueryKey, {
          ...previousData,
          remaining_points: points,
        });
      }
    },
    onError: () => {
      // Refetch on error to ensure sync
      queryClient.invalidateQueries({ queryKey: userQueryKey });
    },
  });
}
