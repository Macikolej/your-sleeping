import { BrowserRouter, Routes, Route } from "react-router-dom";

import { StartPage } from "features/StartPage";
import { AdminPage } from "features/AdminPage";

export const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<StartPage />} />
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/host" element={<StartPage />} />
				<Route path="/client" element={<StartPage />} />
			</Routes>
		</BrowserRouter>
	);
};
