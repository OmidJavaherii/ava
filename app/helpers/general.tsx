export const getHexColorByName = (color: string): string => {
	switch (color) {
		case 'red':
			return '#FF1654';
		case 'blue':
			return '#118AD3';
		case 'green':
			return '#00BA9F';
		default:
			return '#000000';
	}
};

export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
	return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};
