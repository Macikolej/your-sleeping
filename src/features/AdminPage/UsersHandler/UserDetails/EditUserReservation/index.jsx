import { useState } from "react";

import { Text } from "shared/components/Text";
import { Button } from "shared/components/Button";
import { LoadingStatus } from "shared/components/LoadingStatus";
import { CorrectData } from "shared/components/CorrectData";
import { WrongData } from "shared/components/WrongData";
import { ConfirmationPopup } from "shared/components/ConfirmationPopup";
import { formatDate, formatTime } from "utils/functions";
import { apiEditReservation } from "utils/api";

import css from "./styles.module.scss";

const validate = (startDate, endDate, numberOfAccommodated) => {
	if (!numberOfAccommodated || isNaN(numberOfAccommodated)) {
		return false;
	}
	return new Date(startDate).getTime() < new Date(endDate).getTime();
};

export const EditUserReservation = ({
	reservation,
	setReservationToEdit,
	setShouldRefetchDetails,
}) => {
	const [isConfirming, setIsConfirming] = useState(false);
	const [isInvalid, setIsInvalid] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const [startDate, setStartDate] = useState(reservation.startDate);
	const [extraInformation, setExtraInformation] = useState(
		reservation.extraInformation
	);
	const [numberOfAccommodated, setNumberOfAccommodated] = useState(
		reservation.nrOfAccommodated
	);

	const [sDate, setSDate] = useState(
		new Date(startDate).toLocaleDateString("sv-SE")
	);
	const [sTime, setSTime] = useState(formatTime(startDate));

	const [eDate, setEDate] = useState(
		new Date(reservation.endDate).toLocaleDateString("sv-SE")
	);
	const [eTime, setETime] = useState(formatTime(reservation.endDate));

	const onSubmit = async () => {
		setIsInvalid(null);
		setIsConfirming(false);
		if (validate(sDate, eDate, numberOfAccommodated)) {
			setIsLoading(true);

			const newStartDate = new Date(sDate);
			const newEndDate = new Date(eDate);

			const sT = sTime.split(":");
			const eT = eTime.split(":");

			newStartDate.setHours(parseInt(sT[0]));
			newStartDate.setMinutes(parseInt(sT[1]));
			newEndDate.setHours(parseInt(eT[0]));
			newEndDate.setMinutes(parseInt(eT[1]));

			const response = await apiEditReservation(reservation.id, {
				extraInformation,
				nrOfAccommodated: numberOfAccommodated,
				startDate: newStartDate.toJSON(),
				endDate: newEndDate.toJSON(),
			});

			setIsLoading(false);

			if (response.status !== 200) {
				setIsInvalid(true);
			} else {
				setIsInvalid(false);
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
		<div className={css.EditUserReservation}>
			{isConfirming && (
				<ConfirmationPopup
					callback={onSubmit}
					setIsConfirming={setIsConfirming}
					prompt="Czy na pewno chcesz edytować rezerwacje?"
					firstButtonText="Zatwierdź"
					secondButtonText="Anuluj"
				/>
			)}
			<div className={css.inputContainer}>
				<button
					className={css.absoluteButton}
					onClick={() => setReservationToEdit(null)}
				>
					<Text className={css.absoluteButtonCaption}>X</Text>
				</button>
				<div className={css.upperFlexContainer}>
					<Text className={css.t1} type="sage">
						Edycja rezerwacji użytkownika
					</Text>
					{isInvalid === false ? (
						<CorrectData />
					) : isInvalid === true ? (
						<WrongData />
					) : (
						<></>
					)}
				</div>
				<Text className={css.t1}>{reservation.place.name}</Text>
				<div className={css.upperButtonsContainer}>
					<Button
						text="Zatwierdź zmiany"
						className={css.button}
						onClick={() => setIsConfirming(true)}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Początek pobytu</Text>
					<input
						type="date"
						value={sDate}
						onChange={(e) => setSDate(e.target.value)}
						className={css.input}
					/>
					<input
						type="time"
						value={sTime}
						onChange={(e) => setSTime(e.target.value)}
						className={css.input}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Koniec pobytu</Text>
					<input
						type="date"
						value={eDate}
						onChange={(e) => setEDate(e.target.value)}
						className={css.input}
					/>
					<input
						type="time"
						value={eTime}
						onChange={(e) => setETime(e.target.value)}
						className={css.input}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Dodatkowe informacje</Text>
					<input
						value={extraInformation}
						onChange={(e) => setExtraInformation(e.target.value)}
						className={css.input}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Liczba osób</Text>
					<input
						type="number"
						value={numberOfAccommodated}
						onChange={(e) => setNumberOfAccommodated(e.target.value)}
						className={css.input}
						max={reservation.place.maxAccommodated}
						min={1}
					/>
				</div>
				<div className={css.form}></div>
			</div>
		</div>
	);
};
