import cn from "classnames";

import { Text } from "shared/components/Text";

import css from "./styles.module.scss";

export const Button = ({
	onClick,
	className,
	textClassName,
	text,
	textType,
	buttonType,
}) => {
	return (
		<button
			className={cn(css.Button, className, {
				[css.redButton]: buttonType === "red",
			})}
			onClick={onClick}
		>
			<Text type={textType} className={textClassName}>
				{text}
			</Text>
		</button>
	);
};
