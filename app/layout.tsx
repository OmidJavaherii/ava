'use client';
import './globals.css';
import type {Metadata} from 'next';
import {useSelectedLayoutSegment} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import localFont from 'next/font/local';
import UserBox from './components/UserBox';

const yekanFont = localFont({src: '../public/fonts/iranYekan.ttf'});

export default function RootLayout({children}: {children: React.ReactNode}) {
	const activeSegment = useSelectedLayoutSegment();
	return (
		<html lang="en">
			<body className={yekanFont.className}>
				{children}
				<div className="absolute left-12 top-12">
					<UserBox name={'مهمان'} />
				</div>
				<div className="fixed right-0 top-0 flex h-screen w-48 flex-col rounded-bl-lg rounded-tl-lg bg-gradient-to-b from-ava-gradient-1 to-ava-gradient-2">
					<div className="absolute h-full w-full">
						<Image
							src={'/icons/bg_text.svg'}
							priority={true}
							fill={true}
							alt="background text"
							style={{
								objectFit: 'none',
								objectPosition: '-45px 0',
							}}
						/>
					</div>
					<div className="mt-12 flex flex-row items-center justify-center gap-3">
						<span className="text-2xl text-white">آوا</span>
						<Image src={'/icons/logo.svg'} width={20} height={38} alt="ava logo" />
					</div>
					<ul className="mt-48 flex w-full flex-col gap-6 p-4">
						<li>
							<Link
								href={'/'}
								className={`${
									activeSegment === null
										? 'bg-ava-item-active'
										: 'hover:bg-ava-item-hover hover:bg-opacity-40'
								} relative flex w-full cursor-pointer flex-row rounded-md p-3 text-white`}
							>
								<span className="flex w-3/4 justify-center">تبدیل گفتار</span>
								<span className="flex w-1/4 justify-center">
									<Image src={'/icons/speech.svg'} width={22} height={25} alt="speech icon" />
								</span>
							</Link>
						</li>
						<li>
							<Link
								href={'/archive'}
								className={`${
									activeSegment === 'archive'
										? 'bg-ava-item-active'
										: 'hover:bg-ava-item-hover hover:bg-opacity-40'
								} relative flex w-full cursor-pointer flex-row rounded-md p-3 text-white`}
							>
								<span className="flex w-3/4 justify-center">آرشیو</span>
								<span className="flex w-1/4 justify-center">
									<Image
										className="right-0"
										src={'/icons/archive.svg'}
										width={22}
										height={25}
										alt="archive icon"
									/>
								</span>
							</Link>
						</li>
					</ul>
				</div>
			</body>
		</html>
	);
}
