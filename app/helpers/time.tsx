export const convertDurationToSeconds = (duration: string): number => {
	const timeParts = duration.split(':').map(part => parseInt(part, 10));
	return timeParts[0] * 60 * 60 + (timeParts[1] * 60 + timeParts[2]);
};

export const convertSecondsToTime = (val: number) => {
	const minutes = Math.floor(val / 60);
	const seconds = val % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getAudioDuration = (remaining: boolean, duration: number, position: number) => {
	const minutes = Math.floor((duration - (remaining ? position : 0)) / 60);
	const seconds = Math.round((duration - (remaining ? position : 0)) % 60);
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const formatDuration = (duration: string): string => {
	const [hours, minutes, seconds] = duration.split(':');
	if (hours === '00') return `${minutes}:${seconds}`;
	return duration;
};
