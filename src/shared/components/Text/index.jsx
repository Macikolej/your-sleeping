import cn from "classnames";

import css from "./styles.module.scss";

export const Text = ({ children, type, className, bold }) => {
	const classNames = {
		black: css.black,
		olive: css.olive,
		sage: css.sage,
		red: css.red,
	};

	return (
		<div className={cn(css.Text, className, { [css.bold]: bold })}>
			<div className={cn(css.text, classNames[type] || css.black)}>
				{children}
			</div>
		</div>
	);
};
