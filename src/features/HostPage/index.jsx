import { MainContainer } from "shared/components/MainContainer";

import { ConversationPage } from "../ConversationPage";

import css from "./styles.module.scss";

export const HostPage = () => {
	return (
		<MainContainer className={css.HostPage}>
			<ConversationPage ourUsername="user-host" />
		</MainContainer>
	);
}
