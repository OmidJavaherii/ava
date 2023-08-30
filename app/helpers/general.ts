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

//this function receives a value and it's range plus desired range and then returns a value based on ranges that has been provided
//this function was used to animation a circle around the microphone based on microphones activity
export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
	return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

export const convertToPersianCalendar = (dateString: string): string => {
	const dateParts = dateString.split(' ')[0].split('-');
	const dateObject = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
	let persianDate = dateObject.toLocaleDateString('fa-IR', {
		year: 'numeric',
		month: '2-digit',
		day: 'numeric',
	});
	return persianDate;
};

//returns the file extention in an url
export const getExtentionByUrl = (url: string) => {
	const urlObj = new URL(url);
	const pathname = urlObj.pathname;
	const parts = pathname.split('/');
	const filename = parts[parts.length - 1];
	const extensionParts = filename.split('.');
	if (extensionParts.length === 1) {
		return '';
	}
	return extensionParts[extensionParts.length - 1];
};

export const validateLink = (url: string): boolean => {
	try {
		new URL(url);
	} catch (_) {
		return false;
	}

	const audioFileFormatRegex = /\.(mp3|wav|ogg|flac|m4a)$/i;
	return audioFileFormatRegex.test(url);
};
