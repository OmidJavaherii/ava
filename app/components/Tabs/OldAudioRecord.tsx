import {useEffect, useRef, useState} from 'react';
import localFont from 'next/font/local';
import {motion} from 'framer-motion';
import {BsMic} from 'react-icons/bs';
import {BiSolidSend} from 'react-icons/bi';
import {TbPlayerStopFilled, TbPlayerPlayFilled} from 'react-icons/tb';
import {AudioSubmit} from '../../models/Interfaces';
import {Tab} from '../../models/Enums';
import {mapRange} from '@/app/helpers/general';

const yekanFontLight = localFont({src: '../../font/iranYekanLight.ttf'});

const AudioRecord = (props: AudioSubmit) => {
	const mediaRecorder = useRef<MediaRecorder>();
	const [recording, setRecording] = useState(false);
	const [submit, setSubmit] = useState<boolean>(false);
	const [audio, setAudio] = useState<{url: string; file: File}>();
	const [circleSize, setCircleSize] = useState<number>(50);

	useEffect(() => {
		if (submit) {
			setSubmit(false);
			if (audio?.url && audio?.file) props.onSubmit(audio.url, Tab.TAB_RECORD, audio.file);
		}
	}, [audio]);

	const handleStartRecording = () => {
		const audioContext = new AudioContext();
		const analyser = audioContext.createAnalyser();

		navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
			mediaRecorder.current = new MediaRecorder(stream);
			mediaRecorder.current.start();
			mediaRecorder.current.addEventListener('dataavailable', handleDataAvailable);
			setRecording(true);
			const source = audioContext.createMediaStreamSource(stream);
			source.connect(analyser);
			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			const updateCircleSize = () => {
				analyser.getByteFrequencyData(dataArray);

				let sum = 0;
				for (let i = 0; i < bufferLength; i++) {
					sum += dataArray[i];
				}

				const averageVolume = sum / bufferLength;
				const newSize = mapRange(averageVolume, 0, 100, 100, 150);
				setCircleSize(newSize);

				requestAnimationFrame(updateCircleSize);
			};
			updateCircleSize();
		});
	};

	const handleStopRecording = () => {
		if (mediaRecorder.current) {
			mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
			mediaRecorder.current.stop();
			setRecording(false);
			mediaRecorder.current.removeEventListener('dataavailable', handleDataAvailable);
		}
	};

	const handleSubmitRecording = () => {
		setSubmit(true);
		handleStopRecording();
	};

	const handleDataAvailable = (e: BlobEvent) => {
		if (e.data.size > 0) {
			const blob = new Blob([e.data]);
			const url = URL.createObjectURL(blob);
			const file = new File([e.data], 'recordedAudio');
			setAudio({url, file});
		}
	};

	return (
		<motion.div
			className="flex h-full w-full flex-col items-center justify-center"
			initial={{opacity: 0, scale: 0.5}}
			animate={{opacity: 1, scale: 1}}
			exit={{opacity: 0}}
		>
			<div className="relative flex flex-row items-center">
				{recording && (
					<motion.div
						className="absolute -left-4 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-ava-red text-3xl text-white"
						onClick={() => handleStopRecording()}
						initial={{opacity: 0, scale: 0.5}}
						animate={{opacity: 1, scale: 1}}
						transition={{duration: 0.3}}
					>
						<TbPlayerStopFilled />
					</motion.div>
				)}
				<motion.div
					className="relative"
					initial={{x: 0}}
					animate={{x: recording ? 36 : 0}}
					transition={{duration: 0.3}}
				>
					<div
						className="z-10 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-ava-green text-3xl text-white"
						onClick={() => {
							recording ? handleSubmitRecording() : handleStartRecording();
						}}
					>
						{recording ? <BiSolidSend /> : <BsMic />}
					</div>
					{recording && (
						<div
							className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ava-green opacity-20"
							style={{width: circleSize, height: circleSize}}
						/>
					)}
				</motion.div>
			</div>

			<div className={`${yekanFontLight.className} mt-4 text-center`}>
				{recording ? (
					<>
						صدای شما در حال ضبط است
						<br />
						برای پردازش دکمه ارسال را بزنید
					</>
				) : (
					<>
						برای شروع به صحبت، دکمه را فشار دهید
						<br />
						متن پیاده شده آن، در اینجا ظاهر می‌شود
					</>
				)}
			</div>
		</motion.div>
	);
};

export default AudioRecord;
