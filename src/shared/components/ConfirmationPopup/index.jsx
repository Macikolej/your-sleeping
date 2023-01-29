import { Text } from "shared/components/Text";
import { Button } from "shared/components/Button";

import css from "./styles.module.scss";

export const ConfirmationPopup = ({
	prompt,
	firstButtonText,
	secondButtonText,
	callback,
	setIsConfirming,
}) => {
	return (
		<div className={css.ConfirmationPopup}>
			<button className={css.overlay} onClick={() => setIsConfirming(false)} />
			<div className={css.confirmationContainer}>
				<Text className={css.t1}>{prompt}</Text>
				<div className={css.buttonsContainer}>
					<Button onClick={callback} text={firstButtonText} className={css.button}/>
					<Button
						buttonType="red"
						onClick={() => setIsConfirming(false)}
						text={secondButtonText}
						className={css.button}
					/>
				</div>
			</div>
		</div>
	);
};
