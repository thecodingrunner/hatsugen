import React, { useState, useRef, useEffect } from 'react';

interface AudioAnalyzerProps {
  audioUrl: string;
}

const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({ audioUrl }) => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize AudioContext
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    setAudioContext(context);

    // Create Analyser node
    const analyserNode = context.createAnalyser();
    analyserNode.fftSize = 2048;
    setAnalyser(analyserNode);

    // Clean up function
    return () => {
      if (context.state !== 'closed') context.close();
    };
  }, []);

  useEffect(() => {
    if (!audioContext || !analyser || !audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    audio.play();

    // Set up the analysis loop
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const analyze = () => {
      analyser.getByteFrequencyData(dataArray);
      setAudioData(new Uint8Array(dataArray));
      requestAnimationFrame(analyze);
    };

    analyze();

    // Clean up
    return () => {
      audio.pause();
      source.disconnect();
    };
  }, [audioContext, analyser, audioUrl]);

  // Render your visualization here using audioData
  return (
    <div>
      {/* Your visualization code goes here */}
      {audioData && <pre>{JSON.stringify(audioData.slice(0, 10))}</pre>}
    </div>
  );
};

export default AudioAnalyzer;