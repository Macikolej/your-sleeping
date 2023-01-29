import { Text } from "shared/components/Text";

import css from "./styles.module.scss";

export const WrongData = () => {
	return (
		<div className={css.WrongData}>
			<Text type="red" className={css.t4}>Błąd. Nieprawidłowe dane.</Text>
		</div>
	)
}
