'use client';
import {BsMic, BsLink45Deg} from 'react-icons/bs';
import {FiUploadCloud} from 'react-icons/fi';
import {useState} from 'react';
import localFont from 'next/font/local';
import LanguageSelect from './components/LanguageSelect';
import Transcribe from './components/Transcribe';
import {motion} from 'framer-motion';

const yekanFontLight = localFont({src: './font/iranYekanLight.ttf'});

export default function Home() {
    const [activeTab, setActiveTab] = useState<Number>(0);
    const [activeTranscribe, setActiveTranscribe] = useState<
        Number | undefined
    >();

    const handleRestart = () => {
        setActiveTranscribe(undefined);
    };
    console.log(activeTranscribe);
    const getTabConent = () => {
        switch (activeTab) {
            case 0:
                if (activeTranscribe === 0)
                    return (
                        <Transcribe
                            reButon={true}
                            color="green"
                            onRestart={handleRestart}
                        />
                    );
                return (
                    <motion.div
                        key={1}
                        className="flex h-full w-full flex-col items-center justify-center"
                        initial={{opacity: 0, scale: 0.5}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0}}
                    >
                        <span
                            className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-ava-green text-3xl text-white"
                            onClick={() => setActiveTranscribe(0)}
                        >
                            <BsMic />
                        </span>
                        <div className={`${yekanFontLight.className} mt-4`}>
                            برای شروع به صحبت، دکمه را فشار دهید
                            <br />
                            متن پیاده شده آن، در اینجا ظاهر می‌شود
                        </div>
                    </motion.div>
                );
            case 1:
                if (activeTranscribe === 1)
                    return (
                        <Transcribe
                            reButon={true}
                            color="blue"
                            onRestart={handleRestart}
                        />
                    );
                return (
                    <motion.div
                        key={2}
                        className="flex h-full w-full flex-col items-center justify-center"
                        initial={{opacity: 0, scale: 0.5}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0}}
                    >
                        <span
                            className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-ava-blue text-3xl text-white"
                            onClick={() => setActiveTranscribe(1)}
                        >
                            <FiUploadCloud />
                        </span>
                        <div
                            className={`${yekanFontLight.className} mt-4 flex flex-col items-center`}
                        >
                            <span>
                                برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را
                                فشار دهید
                            </span>
                            <span>متن پیاده شده آن، در اینجا ظاهر می شود</span>
                        </div>
                    </motion.div>
                );
            case 2:
                if (activeTranscribe === 2)
                    return (
                        <Transcribe
                            reButon={true}
                            color="red"
                            onRestart={handleRestart}
                        />
                    );
                return (
                    <motion.div
                        key={3}
                        className="flex h-full w-full flex-col items-center justify-center"
                        initial={{opacity: 0, scale: 0.5}}
                        animate={{opacity: 1, scale: 1}}
                        exit={{opacity: 0}}
                    >
                        <div className="flex h-12 w-[328px] flex-row items-center gap-3 rounded-3xl border border-ava-red p-4">
                            <span className="rounded-full bg-ava-red p-1 text-lg text-white">
                                <BsLink45Deg />
                            </span>
                            <input
                                type="text"
                                placeholder="example.com/samlple.mp3"
                                className={`${yekanFontLight.className} w-full text-ava-grey outline-none`}
                            ></input>
                        </div>
                        <div
                            className={`${yekanFontLight.className} mt-4 flex flex-col items-center`}
                        >
                            <span>
                                نشانی اینترنتی فایل حاوی گفتار (صوتی/تصویری) را
                                وارد
                            </span>
                            <span>و دکمه را فشار دهید</span>
                        </div>
                    </motion.div>
                );
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
                    } h-[430px] w-[650px] rounded-xl border bg-white`}
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
