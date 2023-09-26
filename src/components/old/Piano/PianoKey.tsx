import * as Tone from "tone";
import { useState } from "react";
import { useMouse } from "../../Contexts/MouseProvider"; // Import the useMouse hook

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
  note,
  volume,
  sustained,
  frequency,
  synth,
  path,
  onClick,
}: KeyParams) => {
  const { isMouseDown } = useMouse();
  const [isClicked, setIsClicked] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const classNames = `key ${type}-key ${isClicked ? "clicked" : ""}`;
  const id = `piano-key-${note}`;

  const playSound = () => {
    if (synth) {
      const synth = new Tone.Synth().toDestination();
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
      setTimeout(() => {
        audio.pause();
        setAudio(null);
      }, 400);
    }
  };

  return (
    <div
      id={id}
      className={classNames}
      onClick={(e) => {
        if (e.currentTarget.getAttribute("data-programmatic-click")) {
          playSound();
        }
        setIsClicked(!isClicked);
      }}
      onMouseDown={() => {
        setIsClicked(true);
        onClick?.();
        playSound();
      }}
      onMouseUp={() => {
        setIsClicked(false);
        stopSound();
      }}
      onMouseEnter={() => {
        if (isMouseDown) {
          setIsClicked(true);
          playSound();
        }
      }}
      onMouseLeave={() => {
        setIsClicked(false);
        stopSound();
      }}
    />
  );
};

export default PianoKey;
