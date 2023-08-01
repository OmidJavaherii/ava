'use client';
import localFont from 'next/font/local';
import {BsTextRight, BsClock, BsDownload} from 'react-icons/bs';
import {GoCopy} from 'react-icons/go';
import {TfiReload} from 'react-icons/tfi';
import {TbPlayerStopFilled, TbPlayerPlayFilled} from 'react-icons/tb';
import {AiOutlinePause} from 'react-icons/ai';
import {BiSolidVolumeFull, BiSolidVolumeMute} from 'react-icons/bi';
import {useEffect, useRef, useState} from 'react';
import Slider from './Slider';

const yekanFontLight = localFont({src: '../font/iranYekanLight.ttf'});
const iranSansFont = localFont({src: '../font/iranSans.ttf'});

const sampleText = `لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد. کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.`;
const sampleTimedText = [
    {start: 0, stop: 5, text: 'تست 1'},
    {start: 7, stop: 12, text: 'تست 2'},
    {start: 13, stop: 19, text: 'تست 3'},
    {start: 20, stop: 25, text: 'تست 4'},
    {start: 27, stop: 34, text: 'تست 5'},
    {start: 36, stop: 49, text: 'تست 6'},
    {start: 52, stop: 60, text: 'تست 7'},
    {start: 65, stop: 80, text: 'تست 8'},
];
const sampleAudioDuration = 80;

const Transcribe = (props: {
    reButon: boolean;
    color: string;
    onRestart: Function;
}) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [audioPosition, setAudioPosition] = useState<number>(0);
    const [audioVolume, setAudioVolume] = useState<number>(75);
    const [isMute, setIsMute] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const timedItems = useRef(new Array());
    const timedDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const audioInterval = setInterval(() => {
            if (audioPosition < sampleAudioDuration) {
                if (!isPaused) {
                    setAudioPosition(prev => prev + 1);
                }
            }
        }, 1000);
        return () => {
            clearInterval(audioInterval);
        };
    }, [isPaused, audioPosition]);

    useEffect(() => {
        if (activeTab === 0) return;

        const itemIndex = sampleTimedText.findIndex(
            item => audioPosition >= item.start && audioPosition <= item.stop,
        );
        if (itemIndex < 0) return;

        if (!timedDiv.current) return;
        const offset =
            timedItems.current[itemIndex].offsetTop -
            timedDiv.current.offsetTop;

        timedDiv.current.scrollTo({
            behavior: 'smooth',
            top: offset,
        });
    }, [audioPosition]);

    const getTime = (val: number) => {
        const minutes = Math.floor(val / 60);
        const seconds = val % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleVolume = (val: number) => {
        setAudioVolume(val);
    };

    const handlePosition = (val: number) => {
        setAudioPosition(val);
    };

    return (
        <div
            className={`${yekanFontLight.className} flex h-full w-full flex-col items-center gap-2 px-6 py-4`}
            // initial={{opacity: 0, scale: 0.9}}
            // animate={{opacity: 1, scale: 1}}
            // exit={{opacity: 0}}
        >
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
                {props.reButon && (
                    <div className="mr-auto flex flex-row-reverse items-center gap-6">
                        <span
                            className={`flex flex-row-reverse justify-center gap-6 text-lg`}
                        >
                            <BsDownload
                                className={`hover:text-ava-${props.color} cursor-pointer text-lg`}
                            />
                            <GoCopy
                                className={`hover:text-ava-${props.color} cursor-pointer text-lg`}
                            />
                        </span>
                        <button
                            className={`${
                                'bg-ava-' + props.color
                            } flex flex-row-reverse items-center gap-2 rounded-2xl px-3 py-2 text-white hover:brightness-105`}
                            onClick={() => props.onRestart()}
                        >
                            <TfiReload />
                            <span>شروع دوباره</span>
                        </button>
                    </div>
                )}
            </div>
            <hr className="mt-1 h-px w-full bg-black" />
            {activeTab === 0 ? (
                <div className="rtl mt-2 flex flex-col items-center gap-3 overflow-y-auto text-right">
                    <div className="pl-4 text-right leading-7">
                        {sampleText}
                    </div>
                </div>
            ) : (
                <div
                    className="rtl mt-2 flex w-full flex-col overflow-y-auto pl-2"
                    ref={timedDiv}
                >
                    {sampleTimedText.map((text, k) => (
                        <div
                            key={k}
                            className={`${
                                k % 2 == 0 ? 'bg-[#F2F2F2]' : 'bg-white'
                            }
                            ${
                                audioPosition >= text.start &&
                                audioPosition <= text.stop &&
                                `text-ava-${props.color}`
                            } flex w-full flex-row gap-3 rounded-xl px-8 py-4`}
                            ref={element => (timedItems.current[k] = element)}
                        >
                            <div className={`${iranSansFont.className} w-10`}>
                                {getTime(text.stop)}
                            </div>
                            <div className={`${iranSansFont.className} w-10`}>
                                {getTime(text.start)}
                            </div>
                            <div className="mr-4">{text.text}</div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-auto flex h-8 w-[540px] flex-row items-center justify-center gap-2 rounded-lg bg-[#F8F8F8] p-3 text-[#3D3D3D]">
                <div className="flex flex-row text-xl">
                    <TbPlayerStopFilled
                        onClick={() => {
                            setAudioPosition(0);
                            setIsPaused(true);
                        }}
                    />
                    {isPaused ? (
                        <TbPlayerPlayFilled
                            onClick={() => setIsPaused(prev => !prev)}
                        />
                    ) : (
                        <AiOutlinePause
                            onClick={() => setIsPaused(prev => !prev)}
                        />
                    )}
                </div>
                <Slider
                    min={0}
                    max={sampleAudioDuration}
                    value={audioPosition}
                    loaded={70}
                    color={props.color}
                    thin={true}
                    onChange={handlePosition}
                />
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
                        color={props.color}
                        max={100}
                        min={0}
                        value={audioVolume}
                        loaded={0}
                        thin={false}
                        onChange={handleVolume}
                    />
                </div>
            </div>
        </div>
    );
};

export default Transcribe;
