import {useEffect, useRef, useState} from 'react';
import localFont from 'next/font/local';
import AudioPlayer from './AudioPlayer';

import {getHexColorByName} from '@/app/helpers/general';
import {convertDurationToSeconds, convertSecondsToTime} from '@/app/helpers/time';

import {TimedText, Transcription, TranscriptionRequest, TranscriptionSegment} from '../../models/Interfaces';
import {SourceType, Tab} from '../../models/Enums';

import axios, {AxiosResponse} from 'axios';
import {CircularProgress, Tooltip, TooltipProps, Zoom, styled, tooltipClasses} from '@mui/material';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {GoCopy} from 'react-icons/go';
import {BsTextRight, BsClock, BsDownload} from 'react-icons/bs';
import {TfiReload} from 'react-icons/tfi';
import {BsMic, BsMicMute} from 'react-icons/bs';

const yekanFontLight = localFont({src: '../../font/iranYekanLight.ttf'});
const iranSansFont = localFont({src: '../../font/iranSans.ttf'});

const LightTooltip = styled(({className, ...props}: TooltipProps) => (
	<Tooltip {...props} classes={{popper: className}} TransitionComponent={Zoom} placement="top" />
))(({theme}) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 14,
	},
}));

const Transcribe = (props: {
	Id?: number;
	audioURL?: string;
	source: SourceType;
	onRestart?: Function;
	audioFile?: File;
	color: string;
	compact: boolean;
}) => {
	const [activeTab, setActiveTab] = useState<Tab>(0);
	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

	const [error, setError] = useState<boolean>(false);

	const [isAudioLoaded, setIsAudioLoaded] = useState<boolean>(false);
	const [audioPosition, setAudioPosition] = useState<number>(0);

	const [timedTexts, setTimedTexts] = useState<Array<TimedText>>([]);

	const timedItems = useRef(new Array());
	const timedDiv = useRef<HTMLDivElement>(null);

	const [isRecording, setIsRecording] = useState<boolean>(false);
	const mediaRecorder = useRef<MediaRecorder>();
	const ws = useRef<WebSocket>();

	if (props.source === SourceType.LIVE) {
		useEffect(() => {
			navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
				mediaRecorder.current = new MediaRecorder(stream, {mimeType: 'audio/webm;codecs=opus'});
				mediaRecorder.current.start(1000);
				mediaRecorder.current.addEventListener('dataavailable', handleDataAvailable);
			});
			ws.current = new WebSocket('wss://harf.roshan-ai.ir/ws_api/transcribe_files/');
			ws.current.addEventListener('message', handleLiveTranscription);
			ws.current.addEventListener('open', handleOpenConnection);

			return () => {
				if (mediaRecorder.current && ws.current) {
					mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
					mediaRecorder.current.stop();
					mediaRecorder.current.removeEventListener('dataavailable', handleDataAvailable);
					ws.current.removeEventListener('message', handleLiveTranscription);
					ws.current.removeEventListener('open', handleOpenConnection);
					ws.current.close();
				}
			};
		}, []);

		useEffect(() => {
			if (mediaRecorder.current) {
				if (isRecording) mediaRecorder.current.resume();
				if (!isRecording) mediaRecorder.current.pause();
			}
		}, [isRecording]);
	} else {
		useEffect(() => {
			const urlBase = 'https://harf.roshan-ai.ir/api';
			const headers = {Authorization: `Token ${process.env.NEXT_PUBLIC_API_TOKEN}`};

			const processResponse = (segments: TranscriptionSegment[]) => {
				const timedTexts = segments.map(segment => {
					return {
						...segment,
						start: convertDurationToSeconds(segment.start),
						end: convertDurationToSeconds(segment.end),
					};
				});
				setTimedTexts(timedTexts);
				setIsDataLoaded(true);
			};

			if (props.Id) {
				const url = `${urlBase}/get_request/${props.Id}`;
				axios
					.get(url, {headers})
					.then((res: AxiosResponse<TranscriptionRequest>) =>
						processResponse(res.data.response_data[0].segments),
					)
					.catch(() => setError(true));
			} else {
				const url = `${urlBase}/transcribe_files/`;
				const form = new FormData();
				form.append('language', 'fa');
				if (props.source === SourceType.LINK && props.audioURL) {
					form.append('media_urls', props.audioURL);
				} else if (props.audioFile) {
					form.append('media', props.audioFile);
				}
				axios
					.post(url, form, {headers})
					.then((res: AxiosResponse<Transcription[]>) => processResponse(res.data[0].segments))
					.catch(() => setError(true));
			}
		}, []);
	}

	useEffect(() => {
		const itemIndex = timedTexts.findIndex(item => audioPosition >= item.start && audioPosition <= item.end);
		if (activeTab === 0) return;
		if (!timedDiv.current) return;
		if (itemIndex < 0) return;

		const offset = timedItems.current[itemIndex].offsetTop - timedDiv.current.offsetTop;
		timedDiv.current.scrollTo({
			behavior: 'smooth',
			top: offset,
		});
	}, [audioPosition]);

	const handleRestart = () => {
		if (props.onRestart) props.onRestart();
	};

	const handlePositionChange = (position: number) => {
		setAudioPosition(position);
	};

	const handleDataAvailable = (e: BlobEvent) => {
		if (e.data.size > 0) {
			if (ws.current?.readyState === 1) {
				ws.current.send(e.data);
			} else if (ws.current?.readyState !== 0) {
				setError(true);
			}
		}
	};

	const handleLiveTranscription = (e: MessageEvent<any>) => {
		const {segment_id, text, start, end} = JSON.parse(e.data);
		const data = {text: text, start: convertDurationToSeconds(start), end: convertDurationToSeconds(end)};
		setTimedTexts(prev => {
			const prevData = [...prev];
			prevData[segment_id] = data;
			return prevData;
		});
		setAudioPosition(data.end);
	};

	const handleOpenConnection = () => {
		setIsDataLoaded(true);
		setIsAudioLoaded(true);
		setIsRecording(true);
	};

	const onAudioLoaded = (state: boolean) => {
		setIsAudioLoaded(state);
	};

	if (error)
		return (
			<div className="flex h-full w-full flex-col items-center justify-center gap-6">
				<span className="text-2xl text-ava-grey">در ارتباط با سرور مشکلی پیش آمد</span>
				<button
					className={`${
						'bg-ava-' + props.color
					} flex flex-row-reverse items-center gap-2 rounded-2xl px-3 py-2 text-white hover:brightness-105`}
					onClick={handleRestart}
				>
					<TfiReload />
					<span>تلاش دوباره</span>
				</button>
			</div>
		);

	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className={`${isAudioLoaded && isDataLoaded ? 'hidden' : 'block'}`}>
				<CircularProgress
					sx={{
						color: getHexColorByName(props.color),
					}}
					size={64}
				/>
			</div>
			<div
				className={`${yekanFontLight.className} ${
					isAudioLoaded && isDataLoaded ? 'block' : 'hidden'
				} flex h-full w-full flex-col items-center gap-2 px-6 py-4`}
			>
				<ToastContainer
					position="bottom-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="light"
				/>
				<div className="flex min-h-[48px] w-full flex-row-reverse items-center px-2 text-ava-grey">
					<div className="flex flex-row-reverse">
						<span
							className={`${
								activeTab === 0 && 'font-bold'
							} relative flex cursor-pointer flex-row-reverse items-center gap-2 pl-4 text-sm`}
							onClick={() => setActiveTab(0)}
						>
							<BsTextRight className="text-lg" />
							متن ساده
							{activeTab === 0 && (
								<hr className="absolute -bottom-[27px] left-2 mt-1 h-[2px] w-full bg-neutral-500" />
							)}
						</span>
						<span
							className={`${
								activeTab === 1 && 'font-bold'
							} relative flex cursor-pointer flex-row-reverse items-center gap-2 pr-4 text-sm`}
							onClick={() => setActiveTab(1)}
						>
							<BsClock className="text-lg" />
							متن زمان‌بندی شده
							{activeTab === 1 && (
								<hr className="absolute -bottom-[27px] mt-1 h-[2px] w-full bg-neutral-500" />
							)}
						</span>
					</div>
					{!props.compact && (
						<div className="mr-auto flex flex-row-reverse items-center gap-6">
							<span className={`flex flex-row-reverse items-center justify-center gap-6 text-lg`}>
								{isRecording && (
									<div className="relative">
										<div className="absolute -top-[6px] h-3 w-3 rounded-full bg-ava-red" />
										<div className="absolute -top-[6px] h-3 w-3 animate-ping rounded-full bg-ava-red" />
									</div>
								)}
								<LightTooltip title="دانلود صدا">
									<div>
										<BsDownload
											className={`hover:text-ava-${props.color} cursor-pointer text-lg`}
										/>
									</div>
								</LightTooltip>
								<LightTooltip title="کپی متن">
									<div>
										<GoCopy
											className={`hover:text-ava-${props.color} cursor-pointer text-lg`}
											onClick={() =>
												copyToClipBoard(
													timedTexts.reduce(
														(accumulator, currentVal) =>
															accumulator + ' ' + currentVal.text,
														'',
													),
													'به کلیپبورد افزوده شد',
												)
											}
										/>
									</div>
								</LightTooltip>
							</span>
							<button
								className={`${
									'bg-ava-' + props.color
								} flex flex-row-reverse items-center gap-2 rounded-2xl px-3 py-2 text-white hover:brightness-105`}
								onClick={handleRestart}
							>
								<TfiReload />
								<span>شروع دوباره</span>
							</button>
						</div>
					)}
				</div>
				<hr className="mt-1 h-px w-full bg-black" />
				{activeTab === 0 ? (
					<div className="rtl mt-2 flex h-full w-full flex-col gap-3 overflow-y-auto text-right">
						<div className="pl-4 text-right leading-7">
							{timedTexts.reduce((accumulator, currentVal) => accumulator + ' ' + currentVal.text, '')}
						</div>
					</div>
				) : (
					<div className="rtl mt-2 flex w-full flex-col overflow-y-auto pl-2" ref={timedDiv}>
						{timedTexts.map((text, k) => (
							<div
								key={k}
								className={`${k % 2 == 0 ? 'bg-[#F2F2F2]' : 'bg-white'} ${
									audioPosition >= text.start &&
									audioPosition <= text.end &&
									`text-ava-${props.color}`
								} flex w-full flex-row gap-3 rounded-xl px-8 py-4`}
								ref={element => (timedItems.current[k] = element)}
							>
								<div className={`${iranSansFont.className} w-10`}>{convertSecondsToTime(text.end)}</div>
								<div className={`${iranSansFont.className} w-10`}>
									{convertSecondsToTime(text.start)}
								</div>
								<div className="mr-4">{text.text}</div>
							</div>
						))}
					</div>
				)}
				{props.source === SourceType.LIVE && (
					<div
						className="flex cursor-pointer items-center justify-center rounded-full bg-ava-green p-4 text-2xl text-white"
						onClick={() => setIsRecording(prev => !prev)}
					>
						{isRecording ? <BsMic /> : <BsMicMute />}
					</div>
				)}
				{props.audioURL && (
					<AudioPlayer
						audioURL={props.audioURL}
						color={props.color}
						position={audioPosition}
						onAudioLoaded={onAudioLoaded}
						onPositionChange={handlePositionChange}
					/>
				)}
			</div>
		</div>
	);
};

const copyToClipBoard = (clipboardText: string, toastText: string) => {
	navigator.clipboard.writeText(clipboardText);
	toast.success(toastText);
};

export default Transcribe;
