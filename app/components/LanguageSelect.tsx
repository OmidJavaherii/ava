import {use, useState} from 'react';
import {RiArrowUpSFill, RiArrowDownSFill} from 'react-icons/ri';
import {useDispatch, useSelector} from 'react-redux';
import {setPersian, setEnglish} from '../redux/slices/languageSlice';
import {RootState} from '../redux/store';

const Items = ['فارسی', 'انگلیسی'];

const LanguageSelect = () => {
	const [isOpen, setIsOpen] = useState(false);
	const {name, enable} = useSelector((state: RootState) => state.languageReducer.value);
	const dispatch = useDispatch();

	const setLanguage = (language: string) => {
		switch (language) {
			case 'فارسی':
				dispatch(setPersian());
				break;
			case 'انگلیسی':
				dispatch(setEnglish());
				break;
		}
	};

	return (
		<div
			className={`${
				isOpen && 'rounded-b-none border-b-0'
			} relative flex h-10 w-28 flex-col items-center justify-center gap-2 rounded-2xl border border-solid ${
				enable
					? 'cursor-pointer border-ava-green text-ava-green'
					: 'cursor-not-allowed border-ava-grey text-ava-grey'
			}`}
			onClick={() => setIsOpen(prev => (enable ? !prev : prev))}
		>
			<span className="flex flex-row items-center justify-center gap-2 text-lg">
				{isOpen ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
				{name}
			</span>
			{isOpen && (
				<div className="absolute top-9 flex w-28 flex-col gap-1 rounded-b-2xl border border-t-0 border-ava-green ">
					<hr className="h-px w-full border-0 bg-teal-400" />
					{Items.filter(item => item !== name).map((filteredItem, k) => (
						<span
							key={k}
							className={`${
								k === Items.length - 2 && 'rounded-b-2xl'
							} w-full py-1 pr-2 text-right hover:bg-ava-green hover:text-white`}
							onClick={() => setLanguage(filteredItem)}
						>
							{filteredItem}
						</span>
					))}
				</div>
			)}
		</div>
	);
};

export default LanguageSelect;
