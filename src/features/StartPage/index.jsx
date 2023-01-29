import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";

import { MainContainer } from "shared/components/MainContainer";
import { Button } from "shared/components/Button";
import { LoadingStatus } from "shared/components/LoadingStatus";
import { apiSignIn, initializeAuthClient } from "utils/api";
import { setAuthHeaders } from "store/app/actions";

import css from "./styles.module.scss";

const authMap = {
	client: {
		username: "user-client",
		password: "pass",
	},
	host: {
		username: "user-host",
		password: "pass",
	},
	admin: {
		username: "user-admin",
		password: "pass",
	},
};

const signIn = async (role, navigate, setIsLoading) => {
	const { username, password } = authMap[role];
	setIsLoading(true);

	const authHeaders = {
		Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString(
			"base64"
		)}`,
	};

	initializeAuthClient({ authHeaders });
	setAuthHeaders(authHeaders);
	const response = await apiSignIn();
	const responseRole = response.role;

	setIsLoading(false);

	switch (responseRole) {
		case "ADMIN":
			navigate("/admin");
			break;
		case "HOST":
			navigate("/host");
			break;
		case "CLIENT":
			navigate("/client");
			break;
	}
};

export const StartPage = () => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);

	if (isLoading) {
		return (
			<MainContainer className={css.StartPage}>
				<LoadingStatus />
			</MainContainer>
		);
	}

	return (
		<MainContainer className={css.StartPage}>
			<Button
				onClick={() => signIn("admin", navigate, setIsLoading)}
				text="Administrator"
				textClassName={css.startPageButtonCaption}
				className={css.startPageButton}
			/>
			<Button
				onClick={() => signIn("host", navigate, setIsLoading)}
				text="Host"
				textClassName={css.startPageButtonCaption}
				className={css.startPageButton}
			/>
			<Button
				onClick={() => signIn("client", navigate, setIsLoading)}
				text="Klient"
				textClassName={css.startPageButtonCaption}
				className={css.startPageButton}
			/>
		</MainContainer>
	);
};
