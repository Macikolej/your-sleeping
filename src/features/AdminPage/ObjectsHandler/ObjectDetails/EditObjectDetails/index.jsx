import cn from "classnames";
import { useState, useRef } from "react";

import { Text } from "shared/components/Text";
import { Button } from "shared/components/Button";
import { LoadingStatus } from "shared/components/LoadingStatus";
import { CorrectData } from "shared/components/CorrectData";
import { WrongData } from "shared/components/WrongData";
import { ConfirmationPopup } from "shared/components/ConfirmationPopup";

import { apiEditObject } from "utils/api";

import css from "./styles.module.scss";

const validate = (name, basePricePerNight, maxAccommodated) => {
	let passed = true;
	if (name.length === 0) {
		passed = false;
	}

	console.log(basePricePerNight, isFinite(basePricePerNight));

	if (!isFinite(basePricePerNight) || basePricePerNight < 0) {
		passed = false;
	}

	if (!maxAccommodated || maxAccommodated <= 0) {
		passed = false;
	}
	return passed;
};

const getOrientation = (image) => {
	const img = new Image();
	img.src = image;
	if (img.width > img.height) {
		return "horizontal";
	}
	return "vertical";
};

export const EditObjectDetails = ({
	object,
	setIsEditing,
	setShouldRefetch,
	setShouldRefetchDetails,
}) => {
	const [name, setName] = useState(object.name);
	const [basePricePerNight, setBasePricePerNight] = useState(
		object.basePricePerNight
	);
	const [maxAccommodated, setMaxAccommodated] = useState(
		object.maxAccommodated
	);
	const [isCouchSurfing, setIsCouchSurfing] = useState(object.isCouchSurfing);

	const [isInvalid, setIsInvalid] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isConfirming, setIsConfirming] = useState(false);
	const inputRef = useRef();

	const onSubmit = async () => {
		setIsInvalid(null);
		setIsConfirming(false);
		if (validate(name, basePricePerNight, maxAccommodated)) {
			setIsLoading(true);
			const response = await apiEditObject(object.id, {
				name,
				basePricePerNight,
				maxAccommodated,
				isCouchSurfing,
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
		<div className={css.EditObjectDetails}>
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
						Edycja obiektu
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
					<Text className={css.t2}>Nazwa</Text>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						className={css.input}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Cena za noc</Text>
					<input
						type="number"
						min="0"
						value={basePricePerNight}
						onChange={(e) => setBasePricePerNight(e.target.value)}
						className={css.input}
					/>
				</div>
				<div className={css.innerInputContainer}>
					<Text className={css.t2}>Maksymalna liczba osób</Text>
					<input
						type="number"
						min="0"
						value={maxAccommodated}
						onChange={(e) => setMaxAccommodated(e.target.value)}
						className={css.input}
					/>
				</div>
				<input type="file" className={css.hidden} ref={inputRef} />
				<button
					className={css.imageContainer}
					onClick={() => inputRef.current.click()}
				>
					<img
						onClick={() => inputRef.current.click()}
						src={
							"https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
						}
						alt=""
						className={cn(css.image, {
							[css.horizontal]:
								getOrientation(
									"https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
								) === "horizontal",
							[css.vertical]:
								getOrientation(
									"https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
								) === "vertical",
						})}
					/>
				</button>
				<div className={css.form}></div>
			</div>
		</div>
	);
};
