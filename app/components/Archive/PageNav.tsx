import localFont from 'next/font/local';
import {useEffect, useState} from 'react';

const iranSansFont = localFont({src: '../../../public/fonts/iranSans.ttf'});

const PageNav = (props: {currentPage: number; items: number; onChange: Function}) => {
	const {currentPage, items, onChange} = props;

	const [lastPage, setLastPage] = useState(0);
	const [pages, setPages] = useState<Array<number>>([]);

	//this hook calculates the number of pages based on the overall item count and returns an array including all pages
	useEffect(() => {
		const numberOfPages = Math.floor(items / 10) + (items % 10 > 0 ? 1 : 0);
		setLastPage(numberOfPages);
		setPages(Array.from({length: numberOfPages}, (_, index) => index + 1));
	}, []);

	//this function returns the numbers that should be displayed between first and last page on the page navigator
	const getRange = (): Array<number> => {
		if (currentPage === 1) return [1, 5];
		if (currentPage === 2) return [1, 5];
		if (currentPage === lastPage) return [lastPage - 5, lastPage - 1];
		if (currentPage === lastPage - 1) return [lastPage - 5, lastPage - 1];
		if (currentPage === lastPage - 2) return [lastPage - 5, lastPage - 1];
		return [currentPage - 2, currentPage + 2];
	};

	return (
		<div
			className={`${iranSansFont.className} absolute bottom-6 left-0 right-0 ml-auto mr-auto flex flex-row-reverse items-center justify-center gap-2 pr-48 text-lg text-ava-green`}
		>
			<span
				className="cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200"
				onClick={() => currentPage > 1 && onChange(currentPage - 1)}
			>
				{'>'}
			</span>
			<span
				className={`${
					1 === currentPage && 'bg-ava-green text-white'
				} cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200`}
				onClick={() => onChange(1)}
			>
				1
			</span>
			{lastPage > 6 ? (
				<>
					<span>...</span>
					{pages.slice(getRange()[0], getRange()[1]).map((num, k) => (
						<span
							key={k}
							className={`${
								num === currentPage && 'bg-ava-green text-white'
							} cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200`}
							onClick={() => onChange(num)}
						>
							{num}
						</span>
					))}
					<span>...</span>
				</>
			) : (
				pages.slice(1, lastPage - 1).map((num, k) => (
					<span
						key={k}
						className={`${
							num === currentPage && 'bg-ava-green text-white'
						} cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200`}
						onClick={() => onChange(num)}
					>
						{num}
					</span>
				))
			)}
			{lastPage > 1 && (
				<span
					className={`${
						lastPage === currentPage && 'bg-ava-green text-white'
					} cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200`}
					onClick={() => onChange(lastPage)}
				>
					{lastPage}
				</span>
			)}
			<span
				className="cursor flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-slate-200"
				onClick={() => currentPage < lastPage && onChange(currentPage + 1)}
			>
				{'<'}
			</span>
		</div>
	);
};

export default PageNav;
