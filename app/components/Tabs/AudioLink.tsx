import localFont from 'next/font/local';
import {motion} from 'framer-motion';
import {BsLink45Deg} from 'react-icons/bs';
import {ChangeEvent, KeyboardEvent, useState} from 'react';
import {ToastContainer, toast} from 'react-toastify';
import {AudioSubmit} from '../../models/Interfaces';
import {Tab} from '../../models/Enums';

const yekanFontLight = localFont({src: '../../font/iranYekanLight.ttf'});

const AudioLink = (props: AudioSubmit) => {
	const [audioURL, setAudioURL] = useState<string>('');
	const [isLinkValid, setIsLinkValid] = useState<boolean>(true);

	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setAudioURL(e.target.value);
	};

	const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			if (validateLink(audioURL)) {
				props.onSubmit(audioURL, Tab.TAB_LINK);
			} else {
				setIsLinkValid(false);
				toast.error('لینک را به صورت صحیح وارد کنید');
			}
		}
	};

	const shakeAnimation = {
		initial: {x: 0},
		shake: {x: [-10, 10, -10, 10, -10, 10, 0]},
	};

	return (
		<motion.div
			key={3}
			className="flex h-full w-full flex-col items-center justify-center"
			initial={{opacity: 0, scale: 0.5}}
			animate={{opacity: 1, scale: 1}}
			exit={{opacity: 0}}
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
			<motion.div
				className="flex h-12 w-[328px] flex-row items-center gap-3 rounded-3xl border border-ava-red p-4"
				initial="initial"
				animate={isLinkValid ? 'initial' : 'shake'}
				variants={shakeAnimation}
				transition={{type: 'spring', stiffness: 1000, damping: 20}}
				onAnimationComplete={() => setIsLinkValid(true)}
			>
				<span className="rounded-full bg-ava-red p-1 text-lg text-white">
					<BsLink45Deg />
				</span>
				<input
					className={`${yekanFontLight.className} w-full text-ava-grey outline-none`}
					type="text"
					placeholder="example.com/samlple.mp3"
					onChange={onInputChange}
					onKeyDown={onInputKeyDown}
				></input>
			</motion.div>
			<div
				className={`${yekanFontLight.className} mt-4 flex flex-col items-center`}
			>
				<span>
					نشانی اینترنتی فایل حاوی گفتار (صوتی/تصویری) را وارد
				</span>
				<span>و دکمه را فشار دهید</span>
			</div>
		</motion.div>
	);
};

const validateLink = (url: string): boolean => {
	try {
		new URL(url);
	} catch (_) {
		return false;
	}

	const audioFileFormatRegex = /\.(mp3|wav|ogg|flac|m4a)$/i;
	return audioFileFormatRegex.test(url);
};

export default AudioLink;
