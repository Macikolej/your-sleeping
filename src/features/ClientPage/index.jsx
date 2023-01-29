import { MainContainer } from "shared/components/MainContainer";

import { ConversationPage } from "../ConversationPage";

import css from "./styles.module.scss";

export const ClientPage = () => {
	return (
		<MainContainer className={css.ClientPage}>
			<ConversationPage ourUsername="user-client" />
		</MainContainer>
	);
}
