import { HashRouter, Routes, Route } from "react-router-dom";

import { StartPage } from "features/StartPage";
import { AdminPage } from "features/AdminPage";
import { HostPage } from "features/HostPage";
import { ClientPage } from "features/ClientPage";

export const Router = () => {
	return (
		<HashRouter>
			<Routes>
				<Route path="/" element={<StartPage />} />
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/host" element={<HostPage />} />
				<Route path="/client" element={<ClientPage />} />
			</Routes>
		</HashRouter>
	);
};
