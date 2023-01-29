import { useState, useEffect } from "react";
import cn from "classnames";

import { Text } from "shared/components/Text";
import { Button } from "shared/components/Button";
import { LoadingStatus } from "shared/components/LoadingStatus";
import { ConfirmationPopup } from "shared/components/ConfirmationPopup";
import { apiGetUser, apiDeleteUser } from "utils/api";
import { formatDate } from "utils/functions";
import couchSurfingLogo from "assets/icons/couch-surfing.png";

import { EditUserDetails } from "./EditUserDetails";
import { EditUserReservation } from "./EditUserReservation";
import css from "./styles.module.scss";

const translatingMap = {
	MAN: "mężczyzna",
	WOMAN: "kobieta",
	OTHER: "inna",
	CLIENT: "klient",
	HOST: "host",
	DORMITORY: "dormitorium",
	HOTEL_ROOM: "pokój hotelowy",
	FLAT: "mieszkanie",
};

const onDelete = (id, setShouldRefetch, setPickedUserId) => {
	apiDeleteUser(id);
	setShouldRefetch(true);
	setPickedUserId(null);
};

export const UserDetails = ({
	pickedUserId,
	setPickedUserId,
	setShouldRefetch,
}) => {
	const [user, setUser] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [reservationToEdit, setReservationToEdit] = useState(null);
	const [shouldRefetchDetails, setShouldRefetchDetails] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		const fetchUserData = async () => {
			const userData = await apiGetUser(pickedUserId);
			setUser(userData);
			setShouldRefetchDetails(false);
		};

		if (shouldRefetchDetails) {
			fetchUserData();
		}
	}, [shouldRefetchDetails]);

	useEffect(() => {
		const fetchUserData = async () => {
			const userData = await apiGetUser(pickedUserId);
			setUser(userData);
		};

		if (!user) {
			fetchUserData();
		}
	}, []);

	if (!user) {
		return <LoadingStatus />;
	}

	if (isEditing) {
		return (
			<EditUserDetails
				user={user}
				setIsEditing={setIsEditing}
				setShouldRefetchDetails={setShouldRefetchDetails}
				setShouldRefetch={setShouldRefetch}
			/>
		);
	}

	if (reservationToEdit) {
		return (
			<EditUserReservation
				reservation={reservationToEdit}
				setReservationToEdit={setReservationToEdit}
				setShouldRefetchDetails={setShouldRefetchDetails}
			/>
		);
	}

	return (
		<div className={cn(css.UserDetails, { [css.hidden]: !pickedUserId })}>
			{isDeleting && (
				<ConfirmationPopup
					prompt="Czy na pewno chcesz usunąć użytkownika?"
					firstButtonText="Usuń"
					secondButtonText="Anuluj"
					callback={() =>
						onDelete(pickedUserId, setShouldRefetch, setPickedUserId)
					}
					setIsConfirming={setIsDeleting}
				/>
			)}
			<div className={css.inputContainer}>
				<button
					className={css.absoluteButton}
					onClick={() => setPickedUserId(null)}
				>
					<Text className={css.absoluteButtonCaption}>X</Text>
				</button>
				<div className={css.leftColumn}>
					<Text className={css.t1}>{user.name}</Text>
					<div className={css.userInfoContainer}>
						<Text className={css.t2}>{`Email: ${user.email}`}</Text>
						<Text
							className={css.t2}
						>{`Numer telefonu: ${user.phoneNumber}`}</Text>

						<Text className={css.t2}>{`Płeć: ${
							translatingMap[user.gender]
						}`}</Text>

						<Text className={css.t2}>{`Rola: ${
							translatingMap[user.role]
						}`}</Text>
					</div>
				</div>
				<div className={css.rightColumn}>
					<div className={css.upperButtonsContainer}>
						<Button
							text="Edytuj"
							className={css.button}
							onClick={() => setIsEditing(true)}
						/>
						<Button
							buttonType="red"
							text="Usuń"
							className={css.button}
							onClick={() => setIsDeleting(true)}
						/>
					</div>
					<Text className={css.t3}>
						{user.role === "CLIENT" ? "Rezerwacje" : "Posiadane obiekty"}
					</Text>
					{user.role === "CLIENT" ? (
						<div className={css.innerContainer}>
							{user.reservations.map((el, i) => (
								<button
									className={css.entry}
									key={i}
									onClick={() => setReservationToEdit(el)}
								>
									<Text className={css.t2}>{`${el.place.name}`}</Text>
									<Text className={css.t2}>{`${formatDate(el.startDate)} - ${formatDate(el.endDate)}`}</Text>
								</button>
							))}
						</div>
					) : (
						<div className={css.innerContainer}>
							{user.places.map((el, i) => (
								<button className={css.entry} key={i}>
									<Text className={css.t2}>{`${el.name}`}</Text>
									<Text className={css.t2}>{`typ: ${
										translatingMap[el.type]
									}`}</Text>
									{el.isCouchSurfing && (
										<img
											src={couchSurfingLogo}
											alt=""
											className={css.couchSurfingIcon}
										/>
									)}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
