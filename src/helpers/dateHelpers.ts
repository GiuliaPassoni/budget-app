// Import from the compat version correctly
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

// TypeScript type definition
type Timestamp = firebase.firestore.Timestamp;

const getStartOfDay = (date: Date): Timestamp => {
	const start = new Date(date);
	start.setHours(0, 0, 0, 0);
	return firebase.firestore.Timestamp.fromDate(start);
};

const getEndOfDay = (date: Date): Timestamp => {
	const end = new Date(date);
	end.setHours(23, 59, 59, 999);
	return firebase.firestore.Timestamp.fromDate(end);
};

const getStartOfWeek = (date: Date): Timestamp => {
	const start = new Date(date);
	start.setDate(start.getDate() - start.getDay()); // Start of the week (Sunday) //todo fix for monday
	start.setHours(0, 0, 0, 0);
	return firebase.firestore.Timestamp.fromDate(start);
};

const getEndOfWeek = (date: Date): Timestamp => {
	const end = new Date(date);
	end.setDate(end.getDate() + (6 - end.getDay())); // End of the week (Saturday) //todo fix for sunday
	end.setHours(23, 59, 59, 999);
	return firebase.firestore.Timestamp.fromDate(end);
};

const getStartOfMonth = (date: Date): Timestamp => {
	const start = new Date(date);
	start.setDate(1); // First day of the month
	start.setHours(0, 0, 0, 0);
	return firebase.firestore.Timestamp.fromDate(start);
};

const getEndOfMonth = (date: Date): Timestamp => {
	const end = new Date(date);
	end.setMonth(end.getMonth() + 1, 0); // Last day of the month
	end.setHours(23, 59, 59, 999);
	return firebase.firestore.Timestamp.fromDate(end);
};

const getStartOfYear = (date: Date): Timestamp => {
	const start = new Date(date);
	start.setMonth(0, 1); // First day of the year
	start.setHours(0, 0, 0, 0);
	return firebase.firestore.Timestamp.fromDate(start);
};

const getEndOfYear = (date: Date): Timestamp => {
	const end = new Date(date);
	end.setMonth(11, 31); // Last day of the year
	end.setHours(23, 59, 59, 999);
	return firebase.firestore.Timestamp.fromDate(end);
};

export {
	getStartOfDay,
	getEndOfDay,
	getStartOfWeek,
	getEndOfWeek,
	getStartOfMonth,
	getEndOfMonth,
	getStartOfYear,
	getEndOfYear,
};
