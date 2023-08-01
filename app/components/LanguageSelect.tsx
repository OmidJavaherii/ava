"use client";

import { use, useState } from "react";
import { RiArrowUpSFill, RiArrowDownSFill } from "react-icons/ri";

const Items = ["فارسی", "انگلیسی", "آلمانی"];

const LanguageSelect = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<String>("فارسی");

    return (
        <div
            className={`${
                isOpen && "rounded-b-none border-b-0"
            } relative flex h-10 w-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-solid border-ava-green text-ava-green`}
            onClick={() => setIsOpen((prev) => !prev)}
        >
            <span className="flex flex-row items-center justify-center gap-2 text-lg">
                {isOpen ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
                {selectedItem}
            </span>
            {isOpen && (
                <div className="absolute top-9 flex w-28 flex-col gap-1 rounded-b-2xl border border-t-0 border-ava-green ">
                    <hr className="h-px w-full border-0 bg-teal-400" />
                    {Items.filter((item) => item !== selectedItem).map(
                        (filteredItem, k) => (
                            <span
                                key={k}
                                className={`${
                                    k === Items.length - 2 && "rounded-b-2xl"
                                } w-full py-1 pr-2 text-right hover:bg-ava-green hover:text-white`}
                                onClick={() => setSelectedItem(filteredItem)}
                            >
                                {filteredItem}
                            </span>
                        ),
                    )}
                </div>
            )}
        </div>
    );
};

export default LanguageSelect;
