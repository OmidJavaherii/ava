import {useEffect, useRef, useState} from 'react';
import {TimedText, Transcription, TranscriptionRequest, TranscriptionSegment} from '../models/Interfaces';
import {SourceType} from '../models/Enums';
import {convertDurationToSeconds} from '../helpers/time';
import axios, {AxiosResponse} from 'axios';

const useTranscribe = (
	props:
		| {type: SourceType.ID; id: number}
		| {type: SourceType.LINK; url: string}
		| {type: SourceType.FILE; file: File}
		| {type: SourceType.LIVE},
): [Array<TimedText>, boolean, number, (mute: boolean) => void] => {
	const [segments, setSegments] = useState<Array<TimedText>>([]);
	const [isReady, setIsReady] = useState<boolean>(false);
	const [error, setError] = useState<number>(0);

	const mediaRecorder = useRef<MediaRecorder>();
	const ws = useRef<WebSocket>();

	const onMicDataAvailable = (e: BlobEvent) => {
		if (e.data.size > 0) {
			if (ws.current?.readyState === 1) {
				ws.current.send(e.data);
			} else if (ws.current?.readyState !== 0) {
				setError(1);
			}
		}
	};

	const onSocketOpen = () => {
		setIsReady(true);
	};

	const onSocketMessage = (e: MessageEvent<any>) => {
		const {segment_id, text, start, end} = JSON.parse(e.data);
		const data = {text: text, start: convertDurationToSeconds(start), end: convertDurationToSeconds(end)};
		setSegments(prev => {
			const prevData = [...prev];
			prevData[segment_id] = data;
			return prevData;
		});
	};

	const setMute = (mute: boolean) => {
		if (mediaRecorder.current) {
			if (mute) mediaRecorder.current.pause();
			if (!mute) mediaRecorder.current.resume();
		}
	};

	useEffect(() => {
		if (props.type !== SourceType.LIVE) return;
		navigator.mediaDevices
			.getUserMedia({audio: true})
			.then(stream => {
				mediaRecorder.current = new MediaRecorder(stream, {mimeType: 'audio/webm;codecs=opus'});
				mediaRecorder.current.start(1000);
				mediaRecorder.current.addEventListener('dataavailable', onMicDataAvailable);
			})
			.catch(() => {
				setError(3);
			});
		ws.current = new WebSocket('wss://harf.roshan-ai.ir/ws_api/transcribe_files/');
		ws.current.addEventListener('open', onSocketOpen);
		ws.current.addEventListener('message', onSocketMessage);

		return () => {
			if (mediaRecorder.current && ws.current) {
				mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
				mediaRecorder.current.stop();
				mediaRecorder.current.removeEventListener('dataavailable', onMicDataAvailable);
				ws.current.removeEventListener('open', onSocketOpen);
				ws.current.removeEventListener('message', onSocketMessage);
				ws.current.close();
			}
		};
	}, []);
	useEffect(() => {
		if (props.type === SourceType.LIVE) return;
		const urlBase = 'https://harf.roshan-ai.ir/api';
		const headers = {Authorization: `Token ${process.env.NEXT_PUBLIC_API_TOKEN}`};

		const processResponse = (segments: TranscriptionSegment[]) => {
			const timedTexts = segments.map(segment => {
				return {
					...segment,
					start: convertDurationToSeconds(segment.start),
					end: convertDurationToSeconds(segment.end),
				};
			});
			setSegments(timedTexts);
			setIsReady(true);
		};

		if (props.type === SourceType.ID) {
			const url = `${urlBase}/get_request/${props.id}`;
			axios
				.get(url, {headers})
				.then((res: AxiosResponse<TranscriptionRequest>) => processResponse(res.data.response_data[0].segments))
				.catch(() => setError(2));
		} else {
			const url = `${urlBase}/transcribe_files/`;
			const form = new FormData();
			form.append('language', 'fa');
			if (props.type === SourceType.LINK) {
				form.append('media_urls', props.url);
			} else if (props.type === SourceType.FILE) {
				form.append('media', props.file);
			}
			axios
				.post(url, form, {headers})
				.then((res: AxiosResponse<Transcription[]>) => processResponse(res.data[0].segments))
				.catch(() => setError(2));
		}
	}, []);
	return [segments, isReady, error, setMute];
};

export default useTranscribe;
