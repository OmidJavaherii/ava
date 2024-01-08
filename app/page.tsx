'use client';
import {useReducer, useState} from 'react';
import {SourceType, Tab} from './models/Enums';
import localFont from 'next/font/local';
import LanguageSelect from './components/LanguageSelect';
import Transcribe from './components/Transcription/Transcribe';
import AudioRecord from './components//Tabs/AudioRecord';
import AudioUpload from './components/Tabs/AudioUpload';
import {BsMic, BsLink45Deg} from 'react-icons/bs';
import {FiUploadCloud} from 'react-icons/fi';
import AudioLink from './components/Tabs/AudioLink';
import {useDispatch} from 'react-redux';
import {disable, enable} from './redux/slices/languageSlice';

const yekanFontLight = localFont({src: '../public/fonts/iranYekanLight.ttf'});

export default function Home() {
	const [activeTab, setActiveTab] = useState<Number>(Tab.TAB_RECORD);
	const [activeTranscribe, setActiveTranscribe] = useState<Tab>(Tab.NONE);

	const [audioURL, setAudioURL] = useState<string>();
	const [audioFile, setAudioFile] = useState<File>();

	const languageDispatch = useDispatch();

	const handleRestart = () => {
		setActiveTranscribe(Tab.NONE);
	};

	const onAudioSubmit = (tab: Tab, audio: string | File) => {
		if (typeof audio === 'string') {
			if (tab === Tab.TAB_LINK) setAudioURL(audio);
		} else {
			setAudioFile(audio);
		}
		setActiveTranscribe(tab);
	};

	const getTabContent = () => {
		switch (activeTab) {
			case Tab.TAB_RECORD:
				if (activeTranscribe === Tab.TAB_RECORD) {
					languageDispatch(disable());
					return (
						<Transcribe
							compact={false}
							color="green"
							onRestart={handleRestart}
							data={{type: SourceType.LIVE}}
						/>
					);
				}
				languageDispatch(enable());
				return <AudioRecord onSubmit={onAudioSubmit} />;
			case Tab.TAB_UPLOAD:
				if (activeTranscribe === Tab.TAB_UPLOAD && audioFile) {
					languageDispatch(disable());
					return (
						<Transcribe
							compact={false}
							color="blue"
							onRestart={handleRestart}
							data={{type: SourceType.FILE, file: audioFile}}
						/>
					);
				}
				languageDispatch(enable());
				return <AudioUpload onSubmit={onAudioSubmit} />;
			case Tab.TAB_LINK:
				if (activeTranscribe === Tab.TAB_LINK && audioURL) {
					languageDispatch(disable());
					return (
						<Transcribe
							compact={false}
							color="red"
							onRestart={handleRestart}
							data={{type: SourceType.LINK, url: audioURL}}
						/>
					);
				}
				languageDispatch(enable());
				return <AudioLink onSubmit={onAudioSubmit} />;
			default:
				return <></>;
		}
	};

	return (
		<main className="flex h-screen w-full flex-col items-center pr-48">
			<div className="mt-24 flex w-full flex-col items-center justify-start">
				<span className="text-3xl font-bold text-ava-green">تبدیل گفتار به متن</span>
				<span className="mt-4 font-thin text-ava-grey">
					،آوا با استفاده از هزاران ساعت گفتار با صدای افراد مختلف
				</span>
				<span className="mt-1 font-thin text-ava-grey">
					.زبان فارسی را یاد گرفته است و می‌تواند متن صحبت‌ها را بنویسد
				</span>
			</div>
			<div className="mt-12 flex flex-col">
				<div className={`${yekanFontLight.className} flex flex-row-reverse`}>
					<span
						className={`${
							activeTab === Tab.TAB_RECORD && 'bg-ava-green text-white'
						} flex cursor-pointer flex-row items-center gap-1 rounded-t-lg px-8 py-3 text-ava-grey`}
						onClick={() => setActiveTab(Tab.TAB_RECORD)}
					>
						ضبط صدا
						<BsMic className="text-2xl" />
					</span>
					<span
						className={`${
							activeTab == Tab.TAB_UPLOAD && 'bg-ava-blue text-white'
						} flex cursor-pointer flex-row items-center gap-2 rounded-t-lg px-4 py-3 text-ava-grey`}
						onClick={() => setActiveTab(Tab.TAB_UPLOAD)}
					>
						بارگذاری فایل
						<FiUploadCloud className="text-2xl font-thin" />
					</span>
					<span
						className={`${
							activeTab === Tab.TAB_LINK && 'bg-ava-red text-white'
						} flex cursor-pointer flex-row items-center gap-1 rounded-t-lg px-4 py-3 text-ava-grey`}
						onClick={() => setActiveTab(Tab.TAB_LINK)}
					>
						لینک
						<BsLink45Deg className="text-2xl" />
					</span>
				</div>
				<div
					className={`${
						(activeTab === Tab.TAB_RECORD && 'rounded-tr-none border-ava-green') ||
						(activeTab === Tab.TAB_UPLOAD && 'border-ava-blue') ||
						(activeTab === Tab.TAB_LINK && 'border-ava-red')
					} h-[430px] w-[650px] overflow-hidden rounded-xl border bg-white`}
				>
					{getTabContent()}
				</div>
				<div className="mt-6">
					<span className="flex flex-row-reverse items-center justify-end gap-4 text-ava-grey">
						:زبان گفتار
						<LanguageSelect />
					</span>
				</div>
			</div>
		</main>
	);
}
