import localFont from 'next/font/local';
import {motion} from 'framer-motion';
import {FiUploadCloud} from 'react-icons/fi';
import {ChangeEvent, DragEvent, useRef, useState} from 'react';

const yekanFontLight = localFont({src: '../font/iranYekanLight.ttf'});

const UploadAudio = (props: {
    onSubmit: (audioURL: string, tab: number) => void;
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleInputClick = (): void => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const fileURL = URL.createObjectURL(selectedFile);
            props.onSubmit(fileURL, 1);
        }
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (): void => {
        setIsDragging(false);
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) {
            const fileURL = URL.createObjectURL(droppedFile);
            props.onSubmit(fileURL, 1);
        }
        setIsDragging(false);
    };

    return (
        <motion.div
            key={2}
            className={`relative flex h-full w-full flex-col items-center justify-center ${
                isDragging ? 'animate-pulse bg-ava-blue bg-opacity-10' : ''
            }`}
            initial={{opacity: 0, scale: 0.5}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0}}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <span
                className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-ava-blue text-3xl text-white"
                onClick={handleInputClick}
            >
                <FiUploadCloud />
            </span>
            <div
                className={`${yekanFontLight.className} mt-4 flex flex-col items-center`}
            >
                {isDragging ? (
                    <span>فایل خود را اینجا رها کنید</span>
                ) : (
                    <span>
                        برای بارگذاری فایل گفتاری (صوتی/تصویری)، دکمه را فشار
                        دهید
                    </span>
                )}
                <span>متن پیاده شده آن، در اینجا ظاهر می شود</span>
            </div>
            <input
                type="file"
                accept="audio/*"
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleFileSelect}
            />
        </motion.div>
    );
};

export default UploadAudio;
