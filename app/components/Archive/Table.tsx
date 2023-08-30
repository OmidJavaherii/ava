import Transcribe from '../Transcription/Transcribe';
import {AnimatePresence, easeInOut, motion} from 'framer-motion';
import {SourceType} from '../../models/Enums';
import {formatDuration} from '../../helpers/time';
import {BsMic, BsLink45Deg, BsDownload, BsTrash} from 'react-icons/bs';
import {FiUploadCloud} from 'react-icons/fi';
import {GoCopy} from 'react-icons/go';
import {AiOutlineFileWord} from 'react-icons/ai';
import localFont from 'next/font/local';
import {CircularProgress, Tooltip, TooltipProps, Zoom, styled, tooltipClasses} from '@mui/material';
import {ArchiveList} from '../../models/Interfaces';
import {useState} from 'react';

const iranSansFont = localFont({src: '../../../public/fonts/iranSans.ttf'});

//customizing the tooltip component from MUI
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
//staggering animation for the table items
const animateList = {
	hidden: {opacity: 0},
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05,
		},
	},
};
//fading animation for each table item
const animateItem = {
	hidden: {opacity: 0},
	show: {opacity: 1},
};

const Table = (props: {data: ArchiveList; isLoading: boolean; onDelete: (id: number) => void}) => {
	const {data, isLoading, onDelete} = props;
	const [expandedRow, setExpandedRow] = useState<number | undefined>();

	const handleDelete = (id: number) => {
		onDelete(id);
		setExpandedRow(prev => (prev === id ? undefined : prev));
	};

	return (
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
												? `border-solid border-ava-${
														row.request_data.media_urls.includes('harf.roshan-ai.ir')
															? 'blue'
															: 'red'
												  }`
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
												{row.request_data.media_urls.includes('harf.roshan-ai.ir') ? (
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-ava-blue text-xl text-white">
														<FiUploadCloud />
													</div>
												) : (
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-ava-red text-xl text-white">
														<BsLink45Deg />
													</div>
												)}
												{/* since the live transcription from websocket isn't pushed to the database, we won't need this
													<div className="flex h-8 w-8 items-center justify-center rounded-full bg-ava-green text-2xl text-white">
														<BsMic />
													</div>
												 */}
											</div>
											<div className="flex-1 grow-[5] overflow-hidden text-ellipsis whitespace-nowrap pr-8">
												<div
													className="font-light text-[#118AD3] hover:cursor-pointer hover:underline"
													onClick={() =>
														expandedRow === row.id
															? setExpandedRow(undefined)
															: setExpandedRow(row.id)
													}
												>
													{row.request_data.media_urls}
												</div>
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
														<a href={row.request_data.media_urls} target="_blank">
															<BsDownload className="mx-3 cursor-pointer hover:text-ava-green" />
														</a>
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
														data={{
															type: SourceType.ID,
															id: row.id,
															url: row.request_data.media_urls,
														}}
														compact={true}
														color={
															row.request_data.media_urls.includes('harf.roshan-ai.ir')
																? 'blue'
																: 'red'
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
	);
};
export default Table;
