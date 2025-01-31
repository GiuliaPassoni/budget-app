const today = new Date();
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2));

const isSameDay = (date1: Date, date2: Date) => {
	return (
		date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate()
	);
};

export { today, yesterday, twoDaysAgo, isSameDay };
