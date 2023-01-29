import { useState, useEffect, useMemo } from "react";

import { Text } from "shared/components/Text";
import { LoadingStatus } from "shared/components/LoadingStatus";
import { apiGetUsers } from "utils/api";

import { UserDetails } from "./UserDetails";
import css from "./styles.module.scss";

export const UsersHandler = () => {
	const [users, setUsers] = useState(null);

	const [nameFilter, setNameFilter] = useState("");
	const [roleFilter, setRoleFilter] = useState("");
	const [pickedUserId, setPickedUserId] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [shouldRefetch, setShouldRefetch] = useState(false);

	const filteredUsers = useMemo(() => {
		if (users) {
			const filtered = [];
			for (let i = 0; i < users.length; ++i) {
				if (
					nameFilter &&
					!users[i].name.toLowerCase().includes(nameFilter.toLowerCase())
				) {
					continue;
				}

				if (
					roleFilter &&
					users[i].role.toLowerCase() !== roleFilter.toLowerCase()
				) {
					continue;
				}
				filtered.push(users[i]);
			}
			filtered.reverse();
			return filtered;
		}
		return null;
	}, [users, nameFilter, roleFilter]);

	useEffect(() => {
		const getUsers = async () => {
			const users = await apiGetUsers();

			setUsers(users);
		};

		getUsers();
	}, []);

	useEffect(() => {
		const getUsers = async () => {
			setIsLoading(true);
			const users = await apiGetUsers();
			setIsLoading(false);
			setUsers(users);
			setShouldRefetch(false);
		};

		if (shouldRefetch) {
			getUsers();
		}
	}, [shouldRefetch]);

	if (pickedUserId) {
		return (
			<UserDetails
				pickedUserId={pickedUserId}
				setPickedUserId={setPickedUserId}
				setShouldRefetch={setShouldRefetch}
			/>
		);
	}

	return (
		<div className={css.UsersHandler}>
			<div className={css.leftColumn}>
				<Text className={css.t1}>Zarządzanie użytkownikami</Text>
				<input
					value={nameFilter}
					onChange={(e) => setNameFilter(e.target.value)}
					className={css.searchBar}
					placeholder="Szukaj..."
				/>
				<div className={css.radioButtonsContainer}>
					<div className={css.radioButtonContainer}>
						<input
							type="radio"
							name="role"
							className={css.radioButton}
							onChange={(e) =>
								e.currentTarget.value ? setRoleFilter("client") : null
							}
							checked={roleFilter === "client"}
						/>
						<Text className={css.t3}>Klient</Text>
					</div>
					<div className={css.radioButtonContainer}>
						<input
							type="radio"
							name="role"
							className={css.radioButton}
							onChange={(e) =>
								e.currentTarget.value ? setRoleFilter("host") : null
							}
							checked={roleFilter === "host"}
						/>
						<Text className={css.t3}>Host</Text>
					</div>
					<div className={css.radioButtonContainer}>
						<input
							type="radio"
							name="role"
							className={css.radioButton}
							onChange={(e) =>
								e.currentTarget.value ? setRoleFilter("") : null
							}
							checked={roleFilter === ""}
						/>
						<Text className={css.t3}>Wszyscy</Text>
					</div>
				</div>
			</div>
			<div className={css.rightColumn}>
				{filteredUsers && !isLoading ? (
					<>
						<div className={css.innerLeftColumn}>
							{filteredUsers.map((el, i) => {
								if (!(i % 2) && el.role !== "ADMIN") {
									return (
										<button
											key={i}
											className={css.userEntry}
											onClick={() => setPickedUserId(el.id)}
										>
											<Text className={css.t2} type="olive">
												{el.role === "CLIENT"
													? "klient"
													: el.role.toLowerCase()}
											</Text>
											<Text className={css.t2}>{el.name}</Text>
										</button>
									);
								}
							})}
						</div>
						<div className={css.innerRightColumn}>
							{filteredUsers.map((el, i) => {
								if (i % 2 && el.role !== "ADMIN") {
									return (
										<button
											key={i}
											className={css.userEntry}
											onClick={() => setPickedUserId(el.id)}
										>
											<Text className={css.t2} type="olive">
												{el.role === "CLIENT"
													? "klient"
													: el.role.toLowerCase()}
											</Text>
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
