import { getUserInfo, handleSignIn, SignInProps } from "~/helpers/auth_helpers";
import { createQuery } from "@tanstack/solid-query";

export function useHandleSignIn({ email, password }: SignInProps) {
	return createQuery(() => ({
		queryKey: ["sign-in"],
		queryFn: () => {
			return handleSignIn({ email, password });
		},
	}));
}

export function useGetUserInfo() {
	return createQuery(() => ({
		queryKey: ["user-info"],
		queryFn: () => {
			return getUserInfo();
		},
	}));
}
