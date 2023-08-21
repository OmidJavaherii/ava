import {Slider} from '@mui/material';
import {useEffect, useRef, useState} from 'react';
import {TbPlayerStopFilled, TbPlayerPlayFilled} from 'react-icons/tb';
import {AiOutlinePause} from 'react-icons/ai';
import {BiSolidVolumeFull, BiSolidVolumeMute} from 'react-icons/bi';
import {getHexColorByName} from '@/app/helpers/general';
import {getAudioDuration} from '@/app/helpers/time';

const AudioPlayer = (props: {
	audioURL: string;
	color: string;
	position: number;
	onAudioLoaded: (state: boolean) => void;
	onPositionChange: (position: number) => void;
}) => {
	const audioRef = useRef(new Audio(props.audioURL));

	const [audioDuration, setAudioDuration] = useState<number>(0);
	const [audioVolume, setAudioVolume] = useState<number>(75);
	const [isMute, setIsMute] = useState<boolean>(false);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	useEffect(() => {
		const audio = audioRef.current;
		const onLoadedMetadata = () => {
			if (audio.duration === Infinity) {
				audio.currentTime = 1e101;
				audio.ontimeupdate = function () {
					this.ontimeupdate = () => {
						return;
					};
					setAudioDuration(audio.duration);
					audio.currentTime = 0;
				};
			} else {
				setAudioDuration(audio.duration);
			}
			props.onAudioLoaded(true);
		};

		const onTimeUpdate = () => {
			props.onPositionChange(audio.currentTime);
			if (audio.currentTime === audio.duration) {
				setIsPlaying(false);
			}
		};

		audio.addEventListener('loadedmetadata', onLoadedMetadata);
		audio.addEventListener('timeupdate', onTimeUpdate);

		return () => {
			audio.removeEventListener('loadedmetadata', onLoadedMetadata);
			audio.removeEventListener('timeupdate', onTimeUpdate);
			audio.pause();
			audio.currentTime = 0;
		};
	}, []);

	useEffect(() => {
		if (isPlaying) audioRef.current.play();
		if (!isPlaying) audioRef.current.pause();
	}, [isPlaying]);

	useEffect(() => {
		if (isMute) audioRef.current.volume = 0;
		if (!isMute) audioRef.current.volume = audioVolume / 100;
	}, [audioVolume, isMute]);

	const handleVolume = (e: Event, val: number | number[]) => {
		const volume = Array.isArray(val) ? 0 : val;
		setAudioVolume(volume);
	};

	const handlePosition = (e: Event, val: number | number[]) => {
		const position = Array.isArray(val) ? 0 : val;
		props.onPositionChange(position);
		audioRef.current.currentTime = position;
	};
	return (
		<div className="mt-auto flex h-8 w-[540px] flex-row items-center justify-center gap-3 rounded-lg bg-[#F8F8F8] p-3 text-[#3D3D3D]">
			<div className="flex flex-row text-xl">
				<TbPlayerStopFilled
					onClick={() => {
						props.onPositionChange(0);
						setIsPlaying(false);
					}}
				/>
				{isPlaying ? (
					<AiOutlinePause
						onClick={() => setIsPlaying(prev => !prev)}
					/>
				) : (
					<TbPlayerPlayFilled
						onClick={() => setIsPlaying(prev => !prev)}
					/>
				)}
			</div>
			<Slider
				sx={{
					color: getHexColorByName(props.color),
					height: 3,
					'& .MuiSlider-thumb': {
						'::after': {
							width: 0,
							height: 0,
						},
						width: 14,
						height: 14,
						'&.Mui-active': {
							width: 18,
							height: 18,
						},
						'&:hover, &.Mui-focusVisible, &.Mui-active': {
							boxShadow: 'none',
						},
					},
				}}
				min={0}
				max={audioDuration}
				value={props.position}
				onChange={handlePosition}
			/>
			<div className="w-12">
				{getAudioDuration(true, audioDuration, props.position)}
			</div>
			<div className="flex w-40 flex-row items-center justify-center gap-2 text-2xl">
				{isMute ? (
					<BiSolidVolumeMute
						onClick={() => setIsMute(prev => !prev)}
					/>
				) : (
					<BiSolidVolumeFull
						onClick={() => setIsMute(prev => !prev)}
					/>
				)}
				<Slider
					sx={{
						color: getHexColorByName(props.color),
						'& .MuiSlider-thumb ': {
							display: 'none',
						},
					}}
					size="small"
					max={100}
					min={0}
					value={audioVolume}
					onChange={handleVolume}
				/>
			</div>
		</div>
	);
};

export default AudioPlayer;
