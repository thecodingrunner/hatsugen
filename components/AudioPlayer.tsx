"use client";

import { Audiobook } from "@/types";
import React, { useEffect, useRef, useState } from "react";
import { FaPause } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa6";
import { RiExpandDiagonalLine } from "react-icons/ri";

const AudioPlayer = ({ audioUrl, thumbnailUrl, title }: any) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
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
    <div className="text-[#D9D9D9] fixed bottom-0 left-0 w-screen bg-[#1E1E1E] opacity-90 z-50 flex justify-center items-center p-4">
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
        <div className="flex flex-col w-[70vw] gap-2 items-center">
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
        <div className="flex w-[20vw] text-3xl items-center h-full justify-center">
            <RiExpandDiagonalLine />
        </div>
    </div>
  );
};

export default AudioPlayer;
