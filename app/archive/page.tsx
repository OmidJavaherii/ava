'use client';
import Link from 'next/link';
import {BsMic, BsLink45Deg, BsDownload, BsTrash} from 'react-icons/bs';
import {FiUploadCloud} from 'react-icons/fi';
import {GoCopy} from 'react-icons/go';
import {AiOutlineFileWord} from 'react-icons/ai';
import localFont from 'next/font/local';
import {useEffect, useState} from 'react';
import PageNav from '../components/PageNav';
import React from 'react';
import Transcribe from '../components/Transcription/Transcribe';
import {AnimatePresence, easeInOut, motion} from 'framer-motion';
import {SourceType} from '../models/Enums';
import axios, {AxiosResponse} from 'axios';
import {ArchiveList, ArchiveResult} from '../models/Interfaces';
import {CircularProgress, Tooltip, TooltipProps, Zoom, styled, tooltipClasses} from '@mui/material';

const iranSansFont = localFont({src: '../font/iranSans.ttf'});

const LightTooltip = styled(({className, ...props}: TooltipProps) => (
	<Tooltip {...props} classes={{popper: className}} TransitionComponent={Zoom} placement="top" />
))(({theme}) => ({
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: theme.palette.common.white,
		color: 'rgba(0, 0, 0, 0.87)',
		boxShadow: theme.shadows[1],
		fontSize: 14,
	},
}));

const animateList = {
	hidden: {opacity: 0},
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};

const animateItem = {
	hidden: {opacity: 0},
	show: {opacity: 1},
};

const Archive = () => {
	const [page, setPage] = useState(1);
	const [data, setData] = useState<ArchiveList>();

	const [initialLoading, setInitialLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(true);

	const [expandedRow, setExpandedRow] = useState<number | undefined>();

	useEffect(() => {
		setIsLoading(true);
		const url = `https://harf.roshan-ai.ir/api/requests?page=${page}`;
		const token = 'd3a08cd693cdac5e8eb50c10ada68b98bfea1f09';

		axios
			.get(url, {
				headers: {Authorization: `Token ${token}`},
			})
			.then((res: AxiosResponse<ArchiveResult>) => {
				const updatedResults = res.data.results.map(row => {
					return {
						...row,
						date: convertToPersianCalendar(row.date),
						file_type: 'mp3',
					};
				});
				setIsLoading(false);
				setData({...res.data, results: updatedResults});
				if (initialLoading) setInitialLoading(false);
			})
			.catch(error => {
				console.error(error);
				setIsLoading(false);
			});
	}, [page]);

	const handleDelete = (id: number) => {
		if (!data) return;
		const updatedResults = data?.results.filter(row => {
			return row.id !== id;
		});
		setData(prev => {
			if (prev) return {...prev, results: updatedResults};
		});
		setExpandedRow(prev => (prev === id ? undefined : prev));
		console.log(process.env.NEXT_PUBLIC_API_TOKEN);
		const url = `https://harf.roshan-ai.ir/api/get_request/${id}`;
		axios
			.delete(url, {
				headers: {Authorization: `Token ${process.env.NEXT_PUBLIC_API_TOKEN}`},
			})
			.then(res => {
				console.log(res.data);
			})
			.catch(error => console.error(error));
	};

	const handlePageChange = (val: number) => {
		setPage(val);
	};

	if (initialLoading) {
		return (
			<div className="flex h-screen w-full items-center justify-center pr-48">
				<CircularProgress
					sx={{
						color: '#00BA9F',
					}}
					size={128}
				/>
			</div>
		);
	}

	if (!data)
		return (
			<div className="flex h-screen w-full items-center justify-center pr-48">
				<h1>دیتایی وجود ندارد</h1>
			</div>
		);

	return (
		<div className="flex h-screen w-full pr-48">
			<div className="relative flex w-full flex-col gap-12 px-36 py-12">
				<div className="flex w-full justify-end pr-4 text-3xl text-ava-green">آرشیو من</div>
				<div className="mt-4 flex w-full flex-col pr-4">
					<div className="text-right">
						<div className="mr-1 flex flex-row-reverse px-4 text-lg">
							<span className="w-12 pr-4" />
							<span className="flex-1 grow-[5] justify-end pr-8">نام فایل</span>
							<span className="flex-1 text-center">تاریخ بارگذاری</span>
							<span className="flex-1 text-center">نوع فایل</span>
							<span className="flex-1 text-center">مدت زمان</span>
							<span className="flex-1 grow-[2]" />
						</div>
						{isLoading ? (
							<div className="absolute left-1/2 top-[40%] mr-48">
								<CircularProgress
									sx={{
										color: '#00BA9F',
									}}
									size={128}
								/>
							</div>
						) : (
							<motion.div
								className="rtl hs mt-6 max-h-[620px] overflow-y-auto pl-4"
								variants={animateList}
								initial="hidden"
								animate="show"
							>
								<AnimatePresence>
									{data.results.map(row => (
										<motion.div
											className={`${
												expandedRow === row.id
													? 'border-solid border-ava-red'
													: 'border-transparent hover:shadow-[1px_2px_5px_0_rgba(0,0,0,0.1)]'
											} my-2 mr-1 flex flex-col rounded-lg border py-2 pr-4`}
											exit={{x: 200, opacity: 0}}
											transition={{
												duration: 0.3,
											}}
											key={row.id}
											variants={animateItem}
										>
											<div className="flex flex-row items-center justify-center">
												<div
													className="cursor-pointer pl-4"
													onClick={() =>
														expandedRow === row.id
															? setExpandedRow(undefined)
															: setExpandedRow(row.id)
													}
												>
													{row.request_type === 'Record' && (
														<div className="flex h-8 w-8 items-center justify-center rounded-full bg-ava-green text-2xl text-white">
															<BsMic />
														</div>
													)}
													{row.request_type === 'Upload' && (
														<div className="flex h-8 w-8 items-center justify-center rounded-full bg-ava-blue text-xl text-white">
															<FiUploadCloud />
														</div>
													)}
													{row.request_type === 'Url' && (
														<div className="flex h-8 w-8 items-center justify-center rounded-full bg-ava-red text-xl text-white">
															<BsLink45Deg />
														</div>
													)}
												</div>
												<div className="flex-1 grow-[5] overflow-hidden text-ellipsis whitespace-nowrap pr-8">
													{row.request_type === 'Url' ? (
														<a
															className="font-light text-[#118AD3] hover:underline"
															href={row.request_data.media_urls}
														>
															{row.request_data.media_urls}
														</a>
													) : (
														<>{row.request_data.media_urls}</>
													)}
												</div>
												<div className={`${iranSansFont.className} flex-1 text-center`}>
													{row.date}
												</div>
												<div className="ltr flex-1 text-center">{row.file_type}</div>
												<div className={`${iranSansFont.className} flex-1 text-center`}>
													{formatDuration(row.duration)}
												</div>
												<div className="flex-1 grow-[2]">
													<div className="flex flex-row items-center justify-center text-lg text-[#8F8F8F]">
														<LightTooltip title="دانلود صدا">
															<div>
																<BsDownload className="mx-3 cursor-pointer hover:text-ava-green" />
															</div>
														</LightTooltip>
														<LightTooltip title="دانلود فایل">
															<div>
																<AiOutlineFileWord className="mx-3 cursor-pointer hover:text-ava-green" />
															</div>
														</LightTooltip>
														<LightTooltip title="کپی متن">
															<div>
																<GoCopy className="mx-3 cursor-pointer hover:text-ava-green" />
															</div>
														</LightTooltip>
														<div
															className="cursor-pointer p-2 hover:rounded-full hover:bg-red-500 hover:text-white"
															onClick={() => handleDelete(row.id)}
														>
															<BsTrash />
														</div>
													</div>
												</div>
											</div>
											<AnimatePresence>
												{expandedRow === row.id && (
													<motion.div
														className="ltr overflow-hidden px-14"
														initial={{
															height: 0,
															opacity: 0.5,
														}}
														animate={{
															height: '20rem',
															opacity: 1,
														}}
														exit={{
															height: 0,
															opacity: 0.5,
														}}
														transition={{
															duration: 0.3,
														}}
													>
														<Transcribe
															Id={row.id}
															compact={true}
															source={SourceType.LINK}
															audioURL={row.request_data.media_urls}
															color={
																(row.request_type === 'Url' && 'red') ||
																(row.request_type === 'Upload' && 'blue') ||
																'green'
															}
														/>
													</motion.div>
												)}
											</AnimatePresence>
										</motion.div>
									))}
								</AnimatePresence>
							</motion.div>
						)}
					</div>
				</div>
			</div>
			<PageNav currentPage={page} items={data.count} onChange={handlePageChange} />
		</div>
	);
};

const convertToPersianCalendar = (dateString: string): string => {
	const dateParts = dateString.split(' ')[0].split('-');
	const dateObject = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
	let persianDate = dateObject.toLocaleDateString('fa-IR', {
		year: 'numeric',
		month: '2-digit',
		day: 'numeric',
	});
	return persianDate;
};

const formatDuration = (duration: string): string => {
	const [hours, minutes, seconds] = duration.split(':');
	if (hours === '00') return `${minutes}:${seconds}`;
	return duration;
};

export default Archive;
