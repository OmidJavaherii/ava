'use client';

import localFont from 'next/font/local';
import {useEffect, useState} from 'react';

const iranSansFont = localFont({src: '../font/iranSans.ttf'});

const PageNav = (props: {
    currentPage: number;
    items: number;
    onChange: Function;
}) => {
    const [lastPage, setLastPage] = useState(0);

    useEffect(() => {
        setLastPage([...getPages()].pop() || 0);
    }, []);

    const getPages = () => {
        const pages =
            Math.floor(props.items / 8) + (props.items % 8 > 0 ? 1 : 0);
        return Array.from({length: pages}, (_, index) => index + 1);
    };
    const getRange = (): Array<number> => {
        if (props.currentPage === 1) return [1, 5];
        if (props.currentPage === 2) return [1, 5];
        if (props.currentPage === lastPage) return [lastPage - 5, lastPage - 1];
        if (props.currentPage === lastPage - 1)
            return [lastPage - 5, lastPage - 1];
        if (props.currentPage === lastPage - 2)
            return [lastPage - 5, lastPage - 1];
        return [props.currentPage - 2, props.currentPage + 2];
    };

    return (
        <div
            className={`${iranSansFont.className} absolute bottom-6 left-0 right-0 ml-auto mr-auto flex flex-row-reverse items-center justify-center gap-2 pr-48 text-lg text-ava-green`}
        >
            <span
                className="cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200"
                onClick={() =>
                    props.currentPage > 1 &&
                    props.onChange(props.currentPage - 1)
                }
            >
                {'>'}
            </span>
            <span
                className={`${
                    1 === props.currentPage && 'bg-ava-green text-white'
                } cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200`}
                onClick={() => props.onChange(1)}
            >
                1
            </span>
            {lastPage > 6 ? (
                <>
                    <span>...</span>
                    {getPages()
                        .slice(getRange()[0], getRange()[1])
                        .map((num, k) => (
                            <span
                                key={k}
                                className={`${
                                    num === props.currentPage &&
                                    'bg-ava-green text-white'
                                } cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200`}
                                onClick={() => props.onChange(num)}
                            >
                                {num}
                            </span>
                        ))}
                    <span>...</span>
                </>
            ) : (
                getPages()
                    .slice(1, lastPage - 1)
                    .map((num, k) => (
                        <span
                            key={k}
                            className={`${
                                num === props.currentPage &&
                                'bg-ava-green text-white'
                            } cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200`}
                            onClick={() => props.onChange(num)}
                        >
                            {num}
                        </span>
                    ))
            )}
            {lastPage > 1 && (
                <span
                    className={`${
                        lastPage === props.currentPage &&
                        'bg-ava-green text-white'
                    } cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200`}
                    onClick={() => props.onChange(lastPage)}
                >
                    {lastPage}
                </span>
            )}
            <span
                className="cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200"
                onClick={() =>
                    props.currentPage < lastPage &&
                    props.onChange(props.currentPage + 1)
                }
            >
                {'<'}
            </span>
        </div>
    );
};

export default PageNav;
