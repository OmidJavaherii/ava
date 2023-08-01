'use client';
import Link from 'next/link';
import {BsMic, BsLink45Deg, BsDownload, BsTrash} from 'react-icons/bs';
import {FiUploadCloud} from 'react-icons/fi';
import {GoCopy} from 'react-icons/go';
import {AiOutlineFileWord} from 'react-icons/ai';
import localFont from 'next/font/local';
import {useEffect, useState} from 'react';
import PageNav from '../components/PageNav';
import {log} from 'console';
import React from 'react';
import Transcribe from '../components/Transcribe';

const yekanFontLight = localFont({src: '../font/iranYekanLight.ttf'});
const iranSansFont = localFont({src: '../font/iranSans.ttf'});

enum inputType {
    record,
    upload,
    link,
}
const exampleData: {
    type: inputType;
    fileName: string;
    uploadDate: string;
    fileType: string;
    duration: number;
}[] = [
    {
        type: inputType.link,
        fileName:
            'https://irsv.upmusics.com/Downloads/Musics/SirvanKlongggggggggggg',
        uploadDate: '1400-08-21',
        fileType: '.mp3',
        duration: 1000,
    },
    {
        type: inputType.upload,
        fileName: 'khaterate To',
        uploadDate: '1400-08-20',
        fileType: '.mp4',
        duration: 1000,
    },
    {
        type: inputType.link,
        fileName:
            'https://irsv.upmusics.com/Downloads/Musics/SirvanKlongggggggggggg',
        uploadDate: '1400-08-20',
        fileType: '.wav',
        duration: 1000,
    },
    {
        type: inputType.record,
        fileName: 'پادکست رادیو راه - فصل دوم -قسمت ششم- راه سروش',
        uploadDate: '1400-08-19',
        fileType: '.mp3',
        duration: 1000,
    },
    {
        type: inputType.link,
        fileName:
            'https://irsv.upmusics.com/Downloads/Musics/SirvanKlongggggggggggg',
        uploadDate: '1400-08-16',
        fileType: '.mp3',
        duration: 1000,
    },
    {
        type: inputType.upload,
        fileName: 'khaterate To',
        uploadDate: '1400-08-15',
        fileType: '.mp4',
        duration: 1000,
    },
    {
        type: inputType.link,
        fileName:
            'https://irsv.upmusics.com/Downloads/Musics/Sirvan%20Klongggggggggggg',
        uploadDate: '1400-08-14',
        fileType: '.wav',
        duration: 1000,
    },
    {
        type: inputType.record,
        fileName: 'پادکست رادیو راه - فصل دوم -قسمت ششم- راه سروش',
        uploadDate: '1400-08-12',
        fileType: '.mp3',
        duration: 1000,
    },
    {
        type: inputType.link,
        fileName:
            'https://irsv.upmusics.com/Downloads/Musics/SirvanKlongggggggggggg',
        uploadDate: '1400-08-21',
        fileType: '.mp3',
        duration: 1000,
    },
    {
        type: inputType.upload,
        fileName: 'khaterate To',
        uploadDate: '1400-08-20',
        fileType: '.mp4',
        duration: 1000,
    },
    {
        type: inputType.link,
        fileName:
            'https://irsv.upmusics.com/Downloads/Musics/SirvanKlongggggggggggg',
        uploadDate: '1400-08-20',
        fileType: '.wav',
        duration: 1000,
    },
    {
        type: inputType.upload,
        fileName: 'پادکست رادیو راه - فصل دوم -قسمت ششم- راه سروش',
        uploadDate: '1400-08-19',
        fileType: '.mp3',
        duration: 1000,
    },
    {
        type: inputType.link,
        fileName:
            'https://irsv.upmusics.com/Downloads/Musics/SirvanKlongggggggggggg',
        uploadDate: '1400-08-16',
        fileType: '.mp3',
        duration: 1000,
    },
    {
        type: inputType.record,
        fileName: 'khaterate To',
        uploadDate: '1400-08-15',
        fileType: '.mp4',
        duration: 1000,
    },
    {
        type: inputType.link,
        fileName:
            'https://irsv.upmusics.com/Downloads/Musics/Sirvan%20Klongggggggggggg',
        uploadDate: '1400-08-14',
        fileType: '.wav',
        duration: 1000,
    },
    {
        type: inputType.record,
        fileName: 'پادکست رادیو راه - فصل دوم -قسمت ششم- راه سروش',
        uploadDate: '1400-08-12',
        fileType: '.mp3',
        duration: 1000,
    },
];

const Archive = () => {
    const [page, setPage] = useState(1);
    const [expandedRow, setExpandedRow] = useState<number | undefined>();

    const getTime = (val: number) => {
        const minutes = Math.floor(val / 60);
        const seconds = val % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handlePageChange = (val: number) => {
        console.log(val);
        setPage(val);
    };

    return (
        <div className="flex h-screen w-full pr-48">
            <div className="relative flex w-full flex-col gap-12 px-36 py-20">
                <div className="flex w-full justify-end pr-4 text-3xl text-ava-green">
                    آرشیو من
                </div>
                <div className="mt-4 flex w-full flex-col">
                    <div className="text-right">
                        <div className="ml-4 mr-1 flex flex-row-reverse text-lg">
                            <span className="flex w-[54%] justify-end pb-6 pr-24">
                                نام فایل
                            </span>
                            <span className="w-[14%] pb-6 text-center">
                                تاریخ بارگذاری
                            </span>
                            <span className="w-[10%] pb-6 text-center">
                                نوع فایل
                            </span>
                            <span className="w-[10%] pb-6 text-center">
                                مدت زمان
                            </span>
                        </div>
                        <div className="rtl max-h-[560px] overflow-y-auto pl-4">
                            {exampleData
                                .slice(page * 8 - 8, page * 8)
                                .map((row, k) => (
                                    <div
                                        className={`${
                                            expandedRow === k &&
                                            'rounded-lg border border-solid border-ava-red'
                                        } flex flex-col hover:shadow-[1px_2px_5px_0_rgba(0,0,0,0.1)]`}
                                        onClick={() => setExpandedRow(k)}
                                        key={k}
                                    >
                                        <div className="my-2 mr-1 flex flex-row items-center rounded-lg py-2 pr-4">
                                            <div className="w-[5%] min-w-fit">
                                                {row.type ===
                                                    inputType.link && (
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ava-red text-2xl text-white">
                                                        <BsLink45Deg />
                                                    </div>
                                                )}
                                                {row.type ===
                                                    inputType.record && (
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ava-green text-xl text-white">
                                                        <BsMic />
                                                    </div>
                                                )}
                                                {row.type ===
                                                    inputType.upload && (
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ava-blue text-xl text-white">
                                                        <FiUploadCloud />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="w-[50%] overflow-hidden text-ellipsis whitespace-nowrap pr-2">
                                                {row.type === inputType.link ? (
                                                    <Link
                                                        className="font-light text-[#118AD3] hover:underline"
                                                        href={row.fileName}
                                                    >
                                                        {row.fileName}
                                                    </Link>
                                                ) : (
                                                    <>{row.fileName}</>
                                                )}
                                            </div>
                                            <div
                                                className={`${iranSansFont.className} w-[15%] text-center`}
                                            >
                                                {row.uploadDate}
                                            </div>
                                            <div className="ltr w-[10%] text-center">
                                                {row.fileType}
                                            </div>
                                            <div
                                                className={`${iranSansFont.className} w-[10%] text-center`}
                                            >
                                                {getTime(row.duration)}
                                            </div>
                                            <div className="w-[13%]">
                                                <div className="flex flex-row items-center justify-center text-lg text-[#8F8F8F]">
                                                    <BsDownload className="mx-3 cursor-pointer hover:text-ava-green" />
                                                    <AiOutlineFileWord className="mx-3 cursor-pointer hover:text-ava-green" />
                                                    <GoCopy className="mx-3 cursor-pointer hover:text-ava-green" />
                                                    <div className="cursor-pointer p-2 hover:rounded-full hover:bg-red-500 hover:text-white">
                                                        <BsTrash />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {expandedRow === k && (
                                            <div className="ltr max-h-96 overflow-y-auto px-16">
                                                <Transcribe
                                                    reButon={false}
                                                    color="red"
                                                    onRestart={() => null}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
            <PageNav
                currentPage={page}
                items={exampleData.length}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default Archive;
