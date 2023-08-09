import localFont from 'next/font/local';
import {CircularProgress, Slider, duration, styled} from '@mui/material';
import {ToastContainer, toast} from 'react-toastify';
import {useEffect, useRef, useState} from 'react';
import {BsTextRight, BsClock, BsDownload} from 'react-icons/bs';
import {GoCopy} from 'react-icons/go';
import {TfiReload} from 'react-icons/tfi';
import {TbPlayerStopFilled, TbPlayerPlayFilled} from 'react-icons/tb';
import {AiOutlinePause} from 'react-icons/ai';
import {BiSolidVolumeFull, BiSolidVolumeMute} from 'react-icons/bi';
import 'react-toastify/dist/ReactToastify.css';

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

const Transcribe = (props: {
    reButon: boolean;
    color: string;
    onRestart: Function;
    audio: string;
}) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const audioRef = useRef(new Audio(props.audio));
    const [audioDuration, setAudioDuration] = useState<number>(0);
    const [audioPosition, setAudioPosition] = useState<number>(0);
    const [audioVolume, setAudioVolume] = useState<number>(75);
    const [isMute, setIsMute] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const timedItems = useRef(new Array());
    const timedDiv = useRef<HTMLDivElement>(null);

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
            setIsLoaded(true);
        };

        const onTimeUpdate = () => {
            setAudioPosition(audio.currentTime);
            if (audio.currentTime === audio.duration) {
                setIsPlaying(false);
            }
        };

        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('timeupdate', onTimeUpdate);

        return () => {
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('timeupdate', onTimeUpdate);
        };
    }, [props.audio]);

    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) audio.play();
        if (!isPlaying) audio.pause();
    }, [isPlaying]);

    useEffect(() => {
        console.log('ran');
        const audio = audioRef.current;
        if (isMute) audio.volume = 0;
        if (!isMute) audio.volume = audioVolume / 100;
    }, [audioVolume, isMute]);

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

    const handleVolume = (e: Event, val: number | number[]) => {
        const volume = Array.isArray(val) ? 0 : val;
        setAudioVolume(volume);
    };

    const handlePosition = (e: Event, val: number | number[]) => {
        const position = Array.isArray(val) ? 0 : val;
        setAudioPosition(position);
        audioRef.current.currentTime = position;
    };

    const getAudioDuration = (remaining: boolean) => {
        const minutes = Math.floor(
            (audioDuration - (remaining ? audioPosition : 0)) / 60,
        );
        const seconds = Math.round(
            (audioDuration - (remaining ? audioPosition : 0)) % 60,
        );
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };
    if (isLoaded)
        return (
            <div
                className={`${yekanFontLight.className} flex h-full w-full flex-col items-center gap-2 px-6 py-4`}
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
                                    onClick={() =>
                                        copyToClipBoard(
                                            sampleText,
                                            'به کلیپبورد افزوده شد',
                                        )
                                    }
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
                                } ${
                                    audioPosition >= text.start &&
                                    audioPosition <= text.stop &&
                                    `text-ava-${props.color}`
                                } flex w-full flex-row gap-3 rounded-xl px-8 py-4`}
                                ref={element =>
                                    (timedItems.current[k] = element)
                                }
                            >
                                <div
                                    className={`${iranSansFont.className} w-10`}
                                >
                                    {getTime(text.stop)}
                                </div>
                                <div
                                    className={`${iranSansFont.className} w-10`}
                                >
                                    {getTime(text.start)}
                                </div>
                                <div className="mr-4">{text.text}</div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="mt-auto flex h-8 w-[540px] flex-row items-center justify-center gap-3 rounded-lg bg-[#F8F8F8] p-3 text-[#3D3D3D]">
                    <div className="flex flex-row text-xl">
                        <TbPlayerStopFilled
                            onClick={() => {
                                setAudioPosition(0);
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
                            color: getHexColor(props.color),
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
                        value={audioPosition}
                        onChange={handlePosition}
                    />
                    <div className="w-12">{getAudioDuration(true)}</div>
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
                                color: getHexColor(props.color),
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
            </div>
        );

    return (
        <div className="flex h-full w-full items-center justify-center">
            <CircularProgress
                sx={{
                    color: getHexColor(props.color),
                }}
                size={64}
            />
        </div>
    );
};

const getTime = (val: number) => {
    const minutes = Math.floor(val / 60);
    const seconds = val % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const copyToClipBoard = (clipboardText: string, toastText: string) => {
    navigator.clipboard.writeText(clipboardText);
    toast.success(toastText);
};

const getHexColor = (color: string) => {
    switch (color) {
        case 'red':
            return '#FF1654';
        case 'blue':
            return '#118AD3';
        case 'green':
            return '#00BA9F';
    }
};

export default Transcribe;
