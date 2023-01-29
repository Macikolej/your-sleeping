export const formatDate = (date) => {
	const newDate = new Date(date);

	let day = (newDate.getDate()).toString();
	let month = (newDate.getMonth() + 1).toString();
	let year = (newDate.getFullYear()).toString();

	if (day.length !== 2) {
		day = "0" + day;
	}
	if (month.length !== 2) {
		month = "0" + month;
	}

	return `${day}.${month}.${year}`;
}

export const formatTime = (date) => {
	const newDate = new Date(date);

	let hour = (newDate.getHours()).toString();
	let minute = (newDate.getMinutes()).toString();

	if (hour.length !== 2) {
		hour = "0" + hour;
	}

	if (minute.length !== 2) {
		minute = "0" + minute;
	}

	return `${hour}:${minute}`;
}
