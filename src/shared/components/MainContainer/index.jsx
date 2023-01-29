import { useState } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";

import { Text } from "shared/components/Text";
import { Button } from "shared/components/Button";
import { ReactComponent as Logo } from "assets/images/logo.svg";
import { ReactComponent as UserIcon } from "assets/icons/user.svg";
import { ReactComponent as MenuIcon } from "assets/icons/menu.svg";

import css from "./styles.module.scss";

export const MainContainer = ({ className, children, options }) => {
	const navigate = useNavigate();
	const [isMenuVisible, setIsMenuVisible] = useState(null);
	const newCallback = {};

	return (
		<div className={css.MainContainer}>
			<div className={css.header}>
				<button onClick={() => navigate("/")}>
					<Logo className={css.logo} />
				</button>
				<div className={css.rightMenu}>
					<UserIcon className={css.userIcon} />
					<button
						className={css.menuButton}
						onClick={() => setIsMenuVisible(!isMenuVisible)}
					>
						<MenuIcon className={css.menuIcon} />
					</button>
					{options && (
						<div
							className={cn(css.dpd, {
								[css.dropdown]: isMenuVisible === true,
								[css.dropdownHide]: isMenuVisible === false,
							})}
						>
							{options.map((el, i) => {
								const newCallback = () => {
									el.callback();
									setIsMenuVisible(false);
								};
								return (
									<Button
										text={el.title}
										onClick={newCallback}
										key={i}
										className={css.button}
									/>
								);
							})}
						</div>
					)}
				</div>
			</div>
			<div className={css.content}>
				<div className={className}>{children}</div>
			</div>
		</div>
	);
};
