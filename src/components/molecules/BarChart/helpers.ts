export function getColorForKey(key: string): string {
	switch (key) {
		case "expenses":
			return "#28AFB0";
		case "income":
			return "#A2FAA3";
		case "investments":
			return "#E6C229";
		case "profitLoss":
			return "#D8315B";
		default:
			return "gray";
	}
}
