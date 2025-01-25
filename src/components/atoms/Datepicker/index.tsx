import "./style.css";
import { Accessor, createSignal, Setter } from "solid-js";
import DatePicker, {
	PickerValue,
	OnChangeData,
} from "@rnwonder/solid-date-picker";
import "@rnwonder/solid-date-picker/dist/style.css";
import utils from "@rnwonder/solid-date-picker/utilities";
import CalendarIcon from "~/components/atoms/icons/CalendarIcon";
import Button from "~/components/atoms/Button";
import styles from "~/components/atoms/Button/style.module.css";
// import "@rnwonder/solid-date-picker/themes/ark-ui"; //alternative theme

interface PropsI {
	date: Accessor<Date>;
	setDate: Setter<Date>;
}

export const convertDateToPickerValue = (date: Date): PickerValue => ({
	value: {
		selectedDateObject: {
			day: date.getDate(),
			month: date.getMonth(), // Months are 0-indexed in JavaScript
			year: date.getFullYear(),
		},
	},
	label: date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	}),
});

const convertOnChangeToDate = (data: OnChangeData): Date => {
	const { selectedDate } = data;
	if (!selectedDate?.day || !selectedDate.month || !selectedDate.year) {
		throw new Error("Invalid date selection");
	}

	return new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day);
};

export default function Datepicker(props: PropsI) {
	const [pickerValue, setPickerValue] = createSignal<PickerValue>(
		convertDateToPickerValue(props.date()),
	);

	const handleChange = (data: OnChangeData) => {
		const { selectedDate } = data;
		const newDate = new Date(
			selectedDate.year,
			selectedDate.month,
			selectedDate.day,
		);
		props.setDate(newDate);
		setPickerValue(convertDateToPickerValue(newDate));
	};

	return (
		<DatePicker
			value={pickerValue}
			setValue={setPickerValue}
			onChange={handleChange}
			weekStartDay={1}
			weekDaysType="single"
			shouldCloseOnSelect
			shouldHighlightWeekends
			// hideOutSideDays
			maxDate={utils().getToday()} //todo is future date allowed in the db? Why not?
			backgroundColor="rgb(31, 41, 55)" //gray.800
			weekDaysNameColor="white"
			weekEndDayTextColor="#658ee9"
			primaryColor="#658ee9"
			textColor={"rgb(241,237,237)"}
			pickerPositionX={"center"}
			pickerPositionY={"bottom"}
			renderInput={({ showDate, value }) => (
				<div class="custom-input">
					<input id="custom-datepicker-input" value={value().label} readOnly />
					<Button
						id="calendar"
						styleClass="secondary inline-block"
						onClick={showDate}
					>
						<CalendarIcon />
					</Button>
				</div>
			)}
		/>
	);
}
