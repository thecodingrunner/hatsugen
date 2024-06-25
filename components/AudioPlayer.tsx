"use client";

import { cn } from "@/lib/utils";
import { Audiobook } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { RiExpandDiagonalLine } from "react-icons/ri";

const AudioPlayer = ({ audioUrl, thumbnailUrl, title, text }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expand, setExpand] = useState(false)
  const audioRef = useRef<any>(null);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", updateProgress);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  const updateProgress = () => {
    const audio = audioRef.current;
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    setProgress(progressPercent);
  };

  return (
    <div className={`text-[#D9D9D9] fixed bottom-0 left-0 w-screen justify-center items-center bg-[#1E1E1E] bg-opacity-95 z-50 ${expand ? 'h-screen' : ''}`}>
        {expand && (
            <div className="w-screen h-screen absolute bottom-0 left-0 overflow-y-auto">
                <p className="z-50 text-white mt-20 w-full px-44 absolute left-0 top-0 text-5xl leading-relaxed pb-28">{text}</p>
                <div className="bg-[#1E1E1E] opacity-90 w-screen h-auto z-10 absolute bottom-0 left-0" />
                {/* <div className="w-full h-full absolute top-0 left-0 overflow-y-hidden">
                    <img src={thumbnailUrl} className="w-full object-cover" alt="thumbnail large" />
                </div> */}
            </div>
        )}
        <div className="flex justify-center items-center p-4 w-screen absolute bottom-0 left-0 z-50 bg-black text-[#D9D9D9]">
            <div className="flex gap-3 items-center w-[20vw]">
                <img
                    src={thumbnailUrl}
                    alt="thumbnail"
                    className="h-20 w-20 mr-4 rounded"
                />
            <div>
                <div className="font-bold text-lg">{title}</div>
            </div>
            </div>
            <div className="flex flex-col w-[70vw] gap-4 items-center">
            <button className="text-3xl" onClick={togglePlayPause}>
                {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <div className="bg-gray-600 h-3 w-[50vw] rounded-full overflow-hidden self-center">
                <div
                className="bg-[#D9D9D9] h-full rounded-full"
                style={{ width: `${progress}%` }}
                ></div>
            </div>
            <audio ref={audioRef} src={audioUrl} />
            </div>
            <div className="flex w-[20vw] text-3xl items-center h-full justify-end">
                <button onClick={() => setExpand(prev => !prev)}>
                    <RiExpandDiagonalLine />
                </button>
            </div>
        </div>
    </div>
  );
};

export default AudioPlayer;
