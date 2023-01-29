import { useState, useEffect } from "react";

import { Button } from "shared/components/Button";
import { Text } from "shared/components/Text";
import { LoadingStatus } from "shared/components/LoadingStatus";
import { apiGetConversations, apiGetUsers } from "utils/api";

import { Conversation } from "./Conversation";
import css from "./styles.module.scss";

export const ConversationPage = ({ ourUsername }) => {
	const map = {
		"user-host": "jan kochanowski",
		"user-client": "krzysztof jarzyna",
	};

	const [conversations, setConversations] = useState(null);
	const [mode, setMode] = useState("default");
	const [username, setUsername] = useState(null);
	const [conversationId, setConversationId] = useState(null);
	const [users, setUsers] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const getConversations = async () => {
			setIsLoading(true);
			const conversations = await apiGetConversations();
			setIsLoading(false);

			setConversations(conversations);
		};

		getConversations();
	}, []);

	console.log(conversations);

	useEffect(() => {
		const getUsers = async () => {
			setIsLoading(true);
			const users = await apiGetUsers();
			setIsLoading(false);

			setUsers(users);
		};

		if (!users && mode === "create") {
			getUsers();
		}
	}, [mode]);

	if (isLoading) {
		return <LoadingStatus />;
	}

	if (username || conversationId) {
		return (
			<Conversation
				setUsername={setUsername}
				username={username}
				conversationId={conversationId}
				mode={mode}
				setMode={setMode}
				setConversationId={setConversationId}
			/>
		);
	}

	return (
		<div className={css.ConversationPage}>
			{mode !== "create" && (
				<div className={css.buttonContainer}>
					<Button
						text="Stwórz nowy czat"
						className={css.newChatButton}
						onClick={() => setMode("create")}
					/>
				</div>
			)}
			<div className={css.content}>
				{mode === "create" &&
					users &&
					users.map((el, i) => {
						if (el.username !== ourUsername) {
							return (
								<Button
									key={i}
									text={el.name}
									onClick={() => setUsername(el.username)}
									className={css.newChatButton}
								/>
							);
						}
					})}
				{mode === "create" && (
					<button
						className={css.absoluteButton}
						onClick={() => setMode("default")}
					>
						<Text className={css.absoluteButtonCaption}>X</Text>
					</button>
				)}
				{mode !== "create" &&
					conversations &&
					conversations.map((el, i) => {
						return (
							<Button
								key={i}
								text={map[el.username]}
								onClick={() => {
									setConversationId(el.id);
									setUsername(el.username);
								}}
								className={css.newChatButton}
							/>
						);
					})}
			</div>
		</div>
	);
};
