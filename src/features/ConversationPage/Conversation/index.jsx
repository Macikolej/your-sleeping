import cn from "classnames";
import { useState, useEffect, useRef } from "react";

import { Text } from "shared/components/Text";
import { Button } from "shared/components/Button";
import { LoadingStatus } from "shared/components/LoadingStatus";
import {
	apiCreateConversation,
	apiGetConversation,
	apiSendMessage,
} from "utils/api";

import css from "./styles.module.scss";

const map = {
	"user-host": "jan kochanowski",
	"user-client": "krzysztof jarzyna",
};

const sortConversations = (c1, c2) => {
	const d1 = new Date(c1.created).getTime();
	const d2 = new Date(c2.created).getTime();

	if (d1 > d2) {
		return 1;
	} else if (d2 > d1) {
		return -1;
	}
	return 0;
};

export const Conversation = ({
	username,
	conversationId,
	setUsername,
	setConversationId,
	mode,
	setMode,
}) => {
	const [conversation, setConversation] = useState(null);
	const [shouldRefetch, setShouldRefetch] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const scrollRef = useRef();

	const sendMessage = async (message) => {
		setMessage("")
		if (!message) {
			return;
		}
		setIsLoading(true);
		const response = await apiSendMessage(conversationId, message);
		setIsLoading(false);
		setShouldRefetch(true);
	};

	useEffect(() => {
		const createConversation = async () => {
			setIsLoading(true);
			const response = await apiCreateConversation(username);
			setIsLoading(false);
			if (response.id) {
				setConversationId(response.id);
			}
		};

		if (mode === "create") {
			createConversation();
			setMode("default");
		}
	}, [mode]);

	useEffect(() => {
		const getConversation = async () => {
			setIsLoading(true);
			const response = await apiGetConversation(conversationId);
			setIsLoading(false);
			setConversation(response);
		};

		if (shouldRefetch) {
			getConversation();
			setShouldRefetch(false);
		}
	}, [shouldRefetch]);

	useEffect(() => {
		const getConversation = async () => {
			setIsLoading(true);
			const response = await apiGetConversation(conversationId);
			setIsLoading(false);
			setConversation(response);
		};

		if (conversationId && !conversation) {
			getConversation();
		}
	}, [conversationId]);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [])

	if (isLoading) {
		return <LoadingStatus />;
	}

	// console.log(conversation);

	return (
		<div className={css.Conversation}>
			<div className={css.content} ref={scrollRef}>
				<button
					className={css.absoluteButton}
					onClick={() => {
						setConversationId(null);
						setUsername(null);
					}}
				>
					<Text className={css.absoluteButtonCaption}>X</Text>
				</button>
				<Text className={css.t1}>{map[username]}</Text>
				<div className={css.conversationContainer}>
					{conversation &&
						conversation.messages.sort(sortConversations).map((el, i) => {
							if (el.text) {
								return (
									<div key={i} className={css.messageContainer}>
										<div
											className={cn(css.message, {
												[css.userMessage]: el.authorUsername !== username,
												[css.otherMessage]: el.authorUsername === username,
											})}
										>
											<Text className={css.t2}>{el.text}</Text>
										</div>
									</div>
								);
							}
						})}
				</div>
				<div className={css.inputContainer}>
					<input
						placeholder="Napisz wiadomość..."
						className={css.input}
						value={message}
						onChange={(e) => setMessage(e.target.value)}
					/>
					<Button
						text="Wyślij"
						className={css.sendButton}
						onClick={() => sendMessage(message)}
					/>
				</div>
			</div>
		</div>
	);
};
