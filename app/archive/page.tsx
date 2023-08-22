'use client';
import {useEffect, useState} from 'react';

import Table from '../components/Archive/Table';
import PageNav from '../components/Archive/PageNav';

import {ArchiveList, ArchiveResult} from '../models/Interfaces';
import {convertToPersianCalendar, getExtentionByUrl} from '../helpers/general';

import axios, {AxiosResponse} from 'axios';
import {CircularProgress} from '@mui/material';

const Archive = () => {
	const [page, setPage] = useState(1);
	const [data, setData] = useState<ArchiveList>();

	//initial loading is used when the user opens the archive page for the first time
	//initial loading has a different circular progressbar
	const [initialLoading, setInitialLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		//fetching data from API with page number provided (starting at 1)
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
						file_type: getExtentionByUrl(row.request_data.media_urls),
					};
				});
				setInitialLoading(false);
				setIsLoading(false);
				setData({...res.data, results: updatedResults});
			})
			.catch(error => {
				console.error(error);
				setInitialLoading(false);
				setError(true);
			});
	}, [page]);

	const handlePageChange = (val: number) => {
		setPage(val);
	};

	const onDelete = (id: number) => {
		//deleting the item from local state
		if (!data) return;
		const updatedResults = data?.results.filter(row => {
			return row.id !== id;
		});
		setData(prev => {
			if (prev) return {...prev, results: updatedResults};
		});
		//deleting item from the server
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

	if (!data || error)
		return (
			<div className="flex h-screen w-full items-center justify-center pr-48 text-2xl text-ava-grey">
				<h1>دیتایی وجود ندارد و یا در ارتباط با سرور مشکلی پیش آمده</h1>
			</div>
		);

	return (
		<div className="flex h-screen w-full pr-48">
			<Table data={data} isLoading={isLoading} onDelete={onDelete} />
			<PageNav currentPage={page} items={data.count} onChange={handlePageChange} />
		</div>
	);
};

export default Archive;
