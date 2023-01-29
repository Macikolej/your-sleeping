import { useState, useMemo } from "react";

import { MainContainer } from "shared/components/MainContainer";

import { UsersHandler } from "./UsersHandler";
import { ObjectsHandler } from "./ObjectsHandler";
import { ConversationPage } from "../ConversationPage";
import css from "./styles.module.scss";

export const AdminPage = () => {
	const [mode, setMode] = useState("users");

	const options = useMemo(() => {
		if (mode === "users") {
			return [
				{ title: "Zarządzaj obiektami", callback: () => setMode("objects") },
				{ title: "Czatuj z innymi", callback: () => setMode("chats") },
			];
		} else if (mode === "objects") {
			return [
				{ title: "Zarządzaj użytkownikami", callback: () => setMode("users") },
				{ title: "Czatuj z innymi", callback: () => setMode("chats") },
			];
		}
		return [
			{ title: "Zarządzaj użytkownikami", callback: () => setMode("users") },
			{ title: "Zarządzaj obiektami", callback: () => setMode("objects") },
		];
	}, [mode]);

	return (
		<MainContainer className={css.AdminPage} options={options}>
			{mode === "users" ? (
				<UsersHandler />
			) : mode === "objects" ? (
				<ObjectsHandler />
			) : (
				<ConversationPage ourUsername="user-admin" />
			)}
		</MainContainer>
	);
};
