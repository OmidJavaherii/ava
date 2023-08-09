'use client';
import {useState} from 'react';
import localFont from 'next/font/local';
import LanguageSelect from './components/LanguageSelect';
import Transcribe from './components/Transcribe';
import AudioRecorder from './components/AudioRecorder';
import UploadAudio from './components/UploadAudio';
import {BsMic, BsLink45Deg} from 'react-icons/bs';
import {FiUploadCloud} from 'react-icons/fi';
import LinkAudio from './components/LinkAudio';

const yekanFontLight = localFont({src: './font/iranYekanLight.ttf'});

export default function Home() {
    const [activeTab, setActiveTab] = useState<Number>(0);
    const [activeTranscribe, setActiveTranscribe] = useState<
        Number | undefined
    >();
    const [activeAudio, setActiveAudio] = useState<string>('');

    const handleRestart = () => {
        setActiveTranscribe(undefined);
    };

    const onAudioSubmit = (audioURL: string, tab: number) => {
        setActiveAudio(audioURL);
        setActiveTranscribe(tab);
    };

    const getTabConent = () => {
        switch (activeTab) {
            case 0:
                if (activeTranscribe === 0)
                    return (
                        <Transcribe
                            reButon={true}
                            color="green"
                            onRestart={handleRestart}
                            audio={activeAudio}
                        />
                    );
                return <AudioRecorder onSubmit={onAudioSubmit} />;
            case 1:
                if (activeTranscribe === 1)
                    return (
                        <Transcribe
                            reButon={true}
                            color="blue"
                            onRestart={handleRestart}
                            audio={activeAudio}
                        />
                    );
                return <UploadAudio onSubmit={onAudioSubmit} />;
            case 2:
                if (activeTranscribe === 2)
                    return (
                        <Transcribe
                            reButon={true}
                            color="red"
                            onRestart={handleRestart}
                            audio={activeAudio}
                        />
                    );
                return <LinkAudio onSubmit={onAudioSubmit} />;
            default:
                return <></>;
        }
    };

    return (
        <main className="flex h-screen w-full flex-col items-center pr-48">
            <div className="mt-24 flex w-full flex-col items-center justify-start">
                <span className="text-3xl font-bold text-ava-green">
                    تبدیل گفتار به متن
                </span>
                <span className="mt-4 font-thin text-ava-grey">
                    ،آوا با استفاده از هزاران ساعت گفتار با صدای افراد مختلف
                </span>
                <span className="mt-1 font-thin text-ava-grey">
                    .زبان فارسی را یاد گرفته است و می‌تواند متن صحبت‌ها را
                    بنویسد
                </span>
            </div>
            <div className="mt-12 flex flex-col">
                <div
                    className={`${yekanFontLight.className} flex flex-row-reverse`}
                >
                    <span
                        className={`${
                            activeTab == 0 && 'bg-ava-green text-white'
                        } flex cursor-pointer flex-row items-center gap-1 rounded-t-lg px-8 py-3 text-ava-grey`}
                        onClick={() => setActiveTab(0)}
                    >
                        ظبط صدا
                        <BsMic className="text-2xl" />
                    </span>
                    <span
                        className={`${
                            activeTab == 1 && 'bg-ava-blue text-white'
                        } flex cursor-pointer flex-row items-center gap-2 rounded-t-lg px-4 py-3 text-ava-grey`}
                        onClick={() => setActiveTab(1)}
                    >
                        بارگذاری فایل
                        <FiUploadCloud className="text-2xl font-thin" />
                    </span>
                    <span
                        className={`${
                            activeTab == 2 && 'bg-ava-red text-white'
                        } flex cursor-pointer flex-row items-center gap-1 rounded-t-lg px-4 py-3 text-ava-grey`}
                        onClick={() => setActiveTab(2)}
                    >
                        لینک
                        <BsLink45Deg className="text-2xl" />
                    </span>
                </div>
                <div
                    className={`${
                        (activeTab == 0 &&
                            'rounded-tr-none border-ava-green') ||
                        (activeTab == 1 && 'border-ava-blue') ||
                        (activeTab == 2 && 'border-ava-red')
                    } h-[430px] w-[650px] overflow-hidden rounded-xl border bg-white`}
                >
                    {getTabConent()}
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
