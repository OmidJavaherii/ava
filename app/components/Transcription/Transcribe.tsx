import {useEffect, useRef, useState} from 'react';
import localFont from 'next/font/local';
import AudioPlayer from './AudioPlayer';

import {getHexColorByName} from '@/app/helpers/general';
import {convertSecondsToTime} from '@/app/helpers/time';

import {SourceType, Tab} from '../../models/Enums';

import {CircularProgress, Tooltip, TooltipProps, Zoom, styled, tooltipClasses} from '@mui/material';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {GoCopy} from 'react-icons/go';
import {BsTextRight, BsClock, BsDownload} from 'react-icons/bs';
import {TfiReload} from 'react-icons/tfi';
import {BsMic, BsMicMute} from 'react-icons/bs';
import useTranscribe from '@/app/hooks/useTranscribe';

const yekanFontLight = localFont({src: '../../../public/fonts/iranYekanLight.ttf'});
const iranSansFont = localFont({src: '../../../public/fonts/iranSans.ttf'});

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
	color: string;
	compact: boolean;
	data:
		| {type: SourceType.ID; id: number; url: string}
		| {type: SourceType.LINK; url: string}
		| {type: SourceType.FILE; file: File}
		| {type: SourceType.LIVE};
	onRestart?: Function;
}) => {
	const [activeTab, setActiveTab] = useState<Tab>(0);

	const [isAudioLoaded, setIsAudioLoaded] = useState<boolean>(props.data.type === SourceType.LIVE ? true : false);
	const [audioPosition, setAudioPosition] = useState<number>(0);

	const [isMute, setIsMute] = useState<boolean>(false);

	const [segments, isReady, error, setMute] = useTranscribe(props.data);

	const segmentItems = useRef(new Array());
	const segmentDiv = useRef<HTMLDivElement>(null);

	//this hook will scroll to the segment that is currently playing on the second tab (متن زمان بندی شده)
	useEffect(() => {
		const itemIndex = segments.findIndex(item => audioPosition >= item.start && audioPosition <= item.end);
		if (activeTab === 0) return; //no scroll/calculation needed if the user is not on the second tab
		if (!segmentDiv.current) return;
		if (itemIndex < 0) return;

		const offset = segmentItems.current[itemIndex].offsetTop - segmentDiv.current.offsetTop;
		segmentDiv.current.scrollTo({
			behavior: 'smooth',
			top: offset,
		});
	}, [audioPosition]);

	useEffect(() => setMute(isMute), [isMute]);

	//this function is updating current audio position while user is using live transcribtion
	//since there is no actual audio, the workaround that has been implemented instead is =>
	//using the data received from server to update the "audioPosition" so that it scrolls to =>
	//corresponding segmentg on the second tab
	if (props.data.type === SourceType.LIVE) {
		useEffect(() => {
			if (segments.length > 0) setAudioPosition(segments[segments.length - 1].start);
		}, [segments]);
	}

	const handleRestart = () => {
		if (props.onRestart) props.onRestart();
	};

	const handlePositionChange = (position: number) => {
		setAudioPosition(position);
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
			<div className={`${isAudioLoaded && isReady ? 'hidden' : 'block'}`}>
				<CircularProgress
					sx={{
						color: getHexColorByName(props.color),
					}}
					size={64}
				/>
			</div>
			<div
				className={`${yekanFontLight.className} ${
					isAudioLoaded && isReady ? 'block' : 'hidden'
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
								{props.data.type === SourceType.LIVE && !isMute && (
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
													segments.reduce(
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
							{segments.reduce((accumulator, currentVal) => accumulator + ' ' + currentVal.text, '')}
						</div>
					</div>
				) : (
					<div className="rtl mt-2 flex h-full w-full flex-col overflow-y-auto pl-2" ref={segmentDiv}>
						{segments.map((text, k) => (
							<div
								key={k}
								className={`${k % 2 == 0 ? 'bg-[#F2F2F2]' : 'bg-white'} ${
									audioPosition >= text.start &&
									audioPosition <= text.end &&
									`text-ava-${props.color}`
								} flex w-full flex-row gap-3 rounded-xl px-8 py-4`}
								ref={element => (segmentItems.current[k] = element)}
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
				{props.data.type === SourceType.LIVE ? (
					<div
						className="flex cursor-pointer items-center justify-center rounded-full bg-ava-green p-4 text-2xl text-white"
						onClick={() => setIsMute(prev => !prev)}
					>
						{isMute ? <BsMicMute /> : <BsMic />}
					</div>
				) : (
					<AudioPlayer
						audioURL={
							props.data.type === SourceType.LINK || props.data.type === SourceType.ID
								? props.data.url
								: URL.createObjectURL(props.data.file)
						}
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
