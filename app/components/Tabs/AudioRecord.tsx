import localFont from 'next/font/local';
import {Tab} from '@/app/models/Enums';
import {AudioSubmit} from '@/app/models/Interfaces';
import {motion} from 'framer-motion';
import {BsMic} from 'react-icons/bs';

const yekanFontLight = localFont({src: '../../font/iranYekanLight.ttf'});

const AudioRecord = (props: AudioSubmit) => {
	return (
		<motion.div
			className="flex h-full w-full flex-col items-center justify-center"
			initial={{opacity: 0, scale: 0.5}}
			animate={{opacity: 1, scale: 1}}
			exit={{opacity: 0}}
		>
			<div className="relative flex flex-row items-center">
				<div
					className="z-10 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-ava-green text-3xl text-white"
					onClick={() => props.onSubmit('', Tab.TAB_RECORD)}
				>
					<BsMic />
				</div>
			</div>

			<div className={`${yekanFontLight.className} mt-4 text-center`}>
				برای شروع به صحبت، دکمه را فشار دهید
				<br />
				متن پیاده شده آن، در اینجا ظاهر می‌شود
			</div>
		</motion.div>
	);
};

export default AudioRecord;
