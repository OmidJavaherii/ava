"use client";

import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import { FiUser } from "react-icons/fi";
import { PiSignOut } from "react-icons/pi";
import { useState } from "react";

const Profile = (props: { name: String }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            className="flex cursor-pointer flex-col items-end justify-center rounded-2xl border-2 border-solid border-ava-green text-ava-green"
            onClick={() => setIsOpen((prev) => !prev)}
        >
            <span className="flex flex-row items-center justify-end gap-2 px-3 py-1 text-lg">
                {isOpen ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
                {props.name}
                <FiUser />
            </span>
            {isOpen && (
                <>
                    <hr className="h-px w-full border-0 bg-teal-400" />
                    <span className="flex w-full flex-row items-center justify-end gap-2 rounded-b-2xl px-3 py-1 text-lg hover:bg-ava-red hover:text-white">
                        خروج
                        <PiSignOut />
                    </span>
                </>
            )}
        </div>
    );
};

export default Profile;
