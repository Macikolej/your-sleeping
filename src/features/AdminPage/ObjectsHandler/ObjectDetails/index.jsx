import { useState, useEffect } from "react";
import cn from "classnames";

import { Text } from "shared/components/Text";
import { Button } from "shared/components/Button";
import { LoadingStatus } from "shared/components/LoadingStatus";
import { ConfirmationPopup } from "shared/components/ConfirmationPopup";
import { apiGetObject, apiDeleteObject } from "utils/api";
import { formatDate } from "utils/functions";
import couchSurfingLogo from "assets/icons/couch-surfing.png";

import { EditObjectDetails } from "./EditObjectDetails";
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

const getOrientation = (image) => {
	const img = new Image();
	img.src = image;
	if (img.width > img.height) {
		return "horizontal";
	}
	return "vertical";
};

const onDelete = (id, setShouldRefetch, setPickedObjectId) => {
	apiDeleteObject(id);
	setShouldRefetch(true);
	setPickedObjectId(null);
};

export const ObjectDetails = ({
	pickedObjectId,
	setPickedObjectId,
	setShouldRefetch,
}) => {
	const [object, setObject] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [shouldRefetchDetails, setShouldRefetchDetails] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	useEffect(() => {
		const fetchObjectData = async () => {
			const objectData = await apiGetObject(pickedObjectId);
			setObject(objectData);
			setShouldRefetchDetails(false);
		};

		if (shouldRefetchDetails) {
			fetchObjectData();
		}
	}, [shouldRefetchDetails]);

	useEffect(() => {
		const fetchObjectData = async () => {
			const objectData = await apiGetObject(pickedObjectId);
			setObject(objectData);
		};

		if (!object) {
			fetchObjectData();
		}
	}, []);

	if (!object) {
		return <LoadingStatus />;
	}

	if (isEditing) {
		return (
			<EditObjectDetails
				object={object}
				setIsEditing={setIsEditing}
				setShouldRefetchDetails={setShouldRefetchDetails}
				setShouldRefetch={setShouldRefetch}
			/>
		);
	}

	return (
		<div className={cn(css.ObjectDetails, { [css.hidden]: !pickedObjectId })}>
			{isDeleting && (
				<ConfirmationPopup
					prompt="Czy na pewno chcesz usunąć ten obiekt?"
					firstButtonText="Usuń"
					secondButtonText="Anuluj"
					callback={() =>
						onDelete(pickedObjectId, setShouldRefetch, setPickedObjectId)
					}
					setIsConfirming={setIsDeleting}
				/>
			)}
			<div className={css.inputContainer}>
				<button
					className={css.absoluteButton}
					onClick={() => setPickedObjectId(null)}
				>
					<Text className={css.absoluteButtonCaption}>X</Text>
				</button>
				<div className={css.leftColumn}>
					<div className={css.imageContainer}>
						<img
							src={object.images[0]}
							alt=""
							className={cn(css.image, {
								[css.horizontal]:
									getOrientation(object.images[0]) === "horizontal",
								[css.vertical]: getOrientation(object.images[0]) === "vertical",
							})}
						/>
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
					<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
						{object.isCouchSurfing && (
							<img
								src={couchSurfingLogo}
								alt=""
								className={css.couchSurfingIcon}
							/>
						)}
						<Text className={css.t1}>{object.name}</Text>
					</div>
					<div className={css.userInfoContainer}>
						<Text
							className={css.t2}
						>{`Cena za noc: ${object.basePricePerNight}`}</Text>
						<Text className={css.t2}>{`Typ: ${
							translatingMap[object.type]
						}`}</Text>

						<Text
							className={css.t2}
						>{`Maksymalna liczba osób: ${object.maxAccommodated}`}</Text>

						{object.details.nrOfBathrooms && (
							<Text
								className={css.t2}
							>{`Liczba łazienek: ${object.details.nrOfBathrooms}`}</Text>
						)}

						{object.details.nrOfBedrooms && (
							<Text
								className={css.t2}
							>{`Liczba sypialni: ${object.details.nrOfBedrooms}`}</Text>
						)}

						{object.details.sharedKitchen ||
							(object.details.privateKitchen === false && (
								<Text className={css.t2}>{`Wspólna kuchnia`}</Text>
							))}

						{object.details.sharedBathroom && (
							<Text className={css.t2}>{`Wspólna łazienka`}</Text>
						)}

						{object.details.genderDivision === false && (
							<Text className={css.t2}>{`Brak podziału na płci`}</Text>
						)}

						<Text
							className={css.t2}
						>{`Numer telefonu właściciela: ${object.owner.phoneNumber}`}</Text>
					</div>
				</div>
			</div>
		</div>
	);
};
