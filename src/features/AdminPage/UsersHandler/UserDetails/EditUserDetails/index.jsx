import { useState } from "react";

import { Text } from "shared/components/Text";
import { Button } from "shared/components/Button";
import { LoadingStatus } from "shared/components/LoadingStatus";
import { CorrectData } from "shared/components/CorrectData";
import { WrongData } from "shared/components/WrongData";
import { ConfirmationPopup } from "shared/components/ConfirmationPopup";

import { apiEditUser } from "utils/api";

import css from "./styles.module.scss";

const validate = (name, email, gender, phoneNumber, username, role) => {
	let passed = true;
	if (name.length === 0) {
		passed = false;
	}

	if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
		passed = false;
	}

	if (phoneNumber.length !== 9) {
		passed = false;
	}

	if (username.length === 0) {
		passed = false;
	}
	return passed;
};

export const EditUserDetails = ({
	user,
	setIsEditing,
	setShouldRefetch,
	setShouldRefetchDetails,
}) => {
	const [name, setName] = useState(user.name);
	const [email, setEmail] = useState(user.email);
	const [gender, setGender] = useState(user.gender);
	const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
	const [username, setUsername] = useState(user.username);
	const [role, setRole] = useState(user.role);
	const [isInvalid, setIsInvalid] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);

	const onSubmit = async () => {
		setIsInvalid(null);
		setIsConfirming(false);
		if (validate(name, email, gender, phoneNumber, username, role)) {
			setIsLoading(true);
			const response = await apiEditUser(user.id, {
				name,
				email,
				gender,
				phoneNumber,
				username,
				role,
			});

			setIsLoading(false);

			if (response.status !== 200) {
				setIsInvalid(true);
			} else {
				setIsInvalid(false);
				setShouldRefetch(true);
				setShouldRefetchDetails(true);
			}
		} else {
			setIsInvalid(true);
		}
	};

	if (isLoading) {
		return <LoadingStatus />;
	}

	return (
		<div className={css.EditUserDetails}>
			{isConfirming && (
				<ConfirmationPopup
					callback={onSubmit}
					setIsConfirming={setIsConfirming}
					prompt="Czy wprowadzić dokonane zmiany?"
					firstButtonText="Zatwierdź"
					secondButtonText="Anuluj"
				/>
			)}
			<div className={css.inputContainer}>
				<button
					className={css.absoluteButton}
					onClick={() => setIsEditing(false)}
				>
					<Text className={css.absoluteButtonCaption}>X</Text>
				</button>
				<div className={css.upperFlexContainer}>
					<Text className={css.t1} type="sage">
						Edycja danych użytkownika
					</Text>
					{isInvalid === false ? (
						<CorrectData />
					) : isInvalid === true ? (
						<WrongData />
					) : (
						<></>
					)}
				</div>
				<div className={css.upperButtonsContainer}>
					<Button
						text="Zatwierdź zmiany"
						className={css.button}
						onClick={() => setIsConfirming(true)}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Imię i nazwisko</Text>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						className={css.input}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Email</Text>
					<input
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={css.input}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Nazwa użytkownika</Text>
					<input
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className={css.input}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Numer telefonu</Text>
					<input
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						className={css.input}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Rola</Text>
					<input
						type="radio"
						name="role"
						checked={role === "HOST"}
						onChange={(e) => setRole("HOST")}
					/>
					<Text className={css.t3}>Host</Text>
					<input
						type="radio"
						name="role"
						checked={role === "CLIENT"}
						onChange={(e) => setRole("CLIENT")}
					/>
					<Text className={css.t3}>Klient</Text>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Płeć</Text>
					<input
						type="radio"
						name="gender"
						checked={gender === "MAN"}
						onChange={(e) => setGender("MAN")}
					/>
					<Text className={css.t3}>Mężczyzna</Text>
					<input
						type="radio"
						name="gender"
						checked={gender === "WOMAN"}
						onChange={(e) => setGender("WOMAN")}
					/>
					<Text className={css.t3}>Kobieta</Text>
					<input
						type="radio"
						name="gender"
						checked={gender === "OTHER"}
						onChange={(e) => setGender("OTHER")}
					/>
					<Text className={css.t3}>Inna</Text>
				</div>
				<div className={css.form}></div>
			</div>
		</div>
	);
};
