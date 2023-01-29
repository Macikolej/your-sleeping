import { appStore } from ".";

export const setAuthHeaders = (authHeaders) => {
	appStore.update((s) => {
		s.authHeaders = authHeaders;
	});
};
