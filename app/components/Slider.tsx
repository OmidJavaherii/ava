'use client';

import {useState} from 'react';
import localFont from 'next/font/local';

const iranSansFont = localFont({src: '../font/iranSans.ttf'});

const Slider = (props: {
    min: number;
    max: number;
    value: number;
    loaded: number;
    thin: boolean;
    color: string;
    onChange: Function;
}) => {
    const handleChange = (val: number) => {
        props.onChange(val);
    };

    const getTime = (remaining: boolean) => {
        const minutes = Math.floor(
            (props.max - (remaining ? props.value : 0)) / 60,
        );
        const seconds = (props.max - (remaining ? props.value : 0)) % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="relative flex w-full flex-row gap-2">
            <div className="relative flex w-full items-center ">
                <input
                    type="range"
                    min={0}
                    max={props.max}
                    value={props.value}
                    onChange={e => handleChange(parseInt(e.target.value))}
                    className={`slider slider_${props.color} ${
                        props.thin ? '' : 'slider_invisible_thumb'
                    }`}
                />
                <div
                    className={`${
                        props.thin ? 'h-[1px]' : 'h-[2px]'
                    } absolute left-0 right-0 z-[1] rounded-lg bg-[#C6C6C6]`}
                />
                <div
                    className={`${'bg-ava-' + props.color} ${
                        props.thin ? 'h-[3px]' : 'h-[2px]'
                    } absolute left-0 z-[2] rounded-lg`}
                    style={{
                        width: `${
                            (100 * (props.value - props.min)) /
                            (props.max - props.min)
                        }%`,
                    }}
                />
                <div
                    className={`absolute z-[2] h-[1px] bg-ava-grey`}
                    style={{
                        width: `${
                            (100 *
                                (props.loaded - props.value < 0
                                    ? 0
                                    : props.loaded - props.value)) /
                            100
                        }%`,
                        left: `calc(${
                            (100 * (props.value - props.min)) /
                            (props.max - props.min)
                        }% + 6px)`,
                    }}
                />
            </div>
            {props.thin && (
                <div
                    className={`${iranSansFont.className} flex w-12 justify-center`}
                >
                    {getTime(true)}
                </div>
            )}
        </div>
    );
};

export default Slider;
