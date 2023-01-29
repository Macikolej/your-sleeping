import { useState, useEffect, useMemo } from "react";

import { Text } from "shared/components/Text";
import { LoadingStatus } from "shared/components/LoadingStatus";
import { apiGetObjects } from "utils/api";
import couchSurfingLogo from "assets/icons/couch-surfing.png";

import { ObjectDetails } from "./ObjectDetails";
import css from "./styles.module.scss";

export const ObjectsHandler = () => {
	const [objects, setObjects] = useState(null);

	const [nameFilter, setNameFilter] = useState("");
	const [couchSurfingFilter, setCouchSurfingFilter] = useState(false);
	const [pickedObjectId, setPickedObjectId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [shouldRefetch, setShouldRefetch] = useState(false);

	const filteredObjects = useMemo(() => {
		if (objects) {
			const filtered = [];
			for (let i = 0; i < objects.length; ++i) {
				if (
					nameFilter &&
					!objects[i].name.toLowerCase().includes(nameFilter.toLowerCase())
				) {
					continue;
				}

				if (couchSurfingFilter && !objects[i].isCouchSurfing) {
					continue;
				}
				filtered.push(objects[i]);
			}
			filtered.reverse();
			return filtered;
		}
		return null;
	}, [objects, nameFilter, couchSurfingFilter]);

	useEffect(() => {
		const getObjects = async () => {
			const objects = await apiGetObjects();

			setObjects(objects);
		};

		getObjects();
	}, []);

	useEffect(() => {
		const getObjects = async () => {
			setIsLoading(true);
			const objects = await apiGetObjects();
			setIsLoading(false);
			setObjects(objects);
			setShouldRefetch(false);
		};

		if (shouldRefetch) {
			getObjects();
		}
	}, [shouldRefetch]);

	if (pickedObjectId) {
		return (
			<ObjectDetails
				pickedObjectId={pickedObjectId}
				setPickedObjectId={setPickedObjectId}
				setShouldRefetch={setShouldRefetch}
			/>
		);
	}

	return (
		<div className={css.ObjectsHandler}>
			<div className={css.leftColumn}>
				<Text className={css.t1}>Zarządzanie obiektami</Text>
				<input
					value={nameFilter}
					onChange={(e) => setNameFilter(e.target.value)}
					className={css.searchBar}
					placeholder="Szukaj..."
				/>
				<div className={css.radioButtonsContainer}>
					<div className={css.radioButtonContainer}>
						<input
							type="checkbox"
							name="isCouchSurfing"
							className={css.radioButton}
							onClick={(e) => setCouchSurfingFilter(e.target.checked)}
						/>
						<Text className={css.t3}>Couch surfing</Text>
					</div>
				</div>
			</div>
			<div className={css.rightColumn}>
				{filteredObjects && !isLoading ? (
					<>
						<div className={css.innerLeftColumn}>
							{filteredObjects.map((el, i) => {
								if (!(i % 2)) {
									return (
										<button
											key={i}
											className={css.userEntry}
											onClick={() => setPickedObjectId(el.id)}
										>
											{el.isCouchSurfing && (
												<img
													src={couchSurfingLogo}
													alt=""
													className={css.couchSurfingIcon}
												/>
											)}
											<Text className={css.t2} type="olive"></Text>
											<Text className={css.t2}>{el.name}</Text>
										</button>
									);
								}
							})}
						</div>
						<div className={css.innerRightColumn}>
							{filteredObjects.map((el, i) => {
								if (i % 2) {
									return (
										<button
											key={i}
											className={css.userEntry}
											onClick={() => setPickedObjectId(el.id)}
										>
											{el.isCouchSurfing && (
												<img
													src={couchSurfingLogo}
													alt=""
													className={css.couchSurfingIcon}
												/>
											)}
											<Text className={css.t2} type="olive"></Text>
											<Text className={css.t2}>{el.name}</Text>
										</button>
									);
								}
							})}
						</div>
					</>
				) : (
					<LoadingStatus />
				)}
			</div>
		</div>
	);
};
