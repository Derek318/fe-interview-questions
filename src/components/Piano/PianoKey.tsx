import * as Tone from "tone";
import { useState } from "react";
import { useMouse } from "../Contexts/MouseProvider"; // Import the useMouse hook

Tone.start();

interface KeyParams {
  type: string;
  note: string;
  frequency: string;
  path: string;
  onClick?: () => void;
  volume: number;
  sustained: boolean;
  synth: boolean;
}

const PianoKey = ({
  type,
  volume,
  sustained,
  frequency,
  synth,
  path,
  onClick,
}: KeyParams) => {
  const classNames = `key ${type}-key`;
  const { isMouseDown } = useMouse();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const playSound = () => {
    if (synth) {
      // Synth Notes
      const synth = new Tone.Synth().toMaster();
      synth.triggerAttack(frequency);
      if (sustained) {
        setTimeout(() => {
          synth.triggerRelease();
        }, 3000);
      } else {
        setTimeout(() => {
          synth.triggerRelease();
        }, 1000);
      }
    } else {
      // Standard Full Piano
      const newAudio = new Audio(path);
      newAudio.volume = volume;
      setAudio(newAudio);
      newAudio.play();
    }
  };

  const stopSound = () => {
    if (audio && !synth && !sustained) {
      // Add a delay of 2000 milliseconds (2 seconds) before stopping the audio
      setTimeout(() => {
        audio.pause();
        setAudio(null);
      }, 400);
    }
  };
  return (
    <div
      className={classNames}
      onMouseDown={() => {
        onClick?.();
        playSound();
      }}
      onMouseUp={stopSound}
      onMouseEnter={() => {
        console.log(isMouseDown);
        if (isMouseDown) {
          playSound();
        }
      }}
    />
  );
};

export default PianoKey;
