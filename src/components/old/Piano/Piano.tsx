import * as Tone from "tone";
import { useState } from "react";
import { SoundOutlined } from "@ant-design/icons";
import { Button, Row, Select, Slider, Switch, Typography } from "antd";
import NoteDisplay from "./NoteDisplay/NoteDisplay";
import { songs } from "../../../data/Songs";
import pianoKeys from "../../../data/pianoKeys";
import PianoKey from "./PianoKey";

import "./Piano.css";

const { Text } = Typography;

const Piano = () => {
  const [clickedNote, setClickedNote] = useState<string>("");
  const [volume, setVolume] = useState<number>(0.5);
  const [sustained, setSustained] = useState(true);
  const [synth, setSynth] = useState(false);
  const [songIdx, setSongIdx] = useState<number>(0);
  const [songIsPlaying, setSongIsPlaying] = useState(false);

  const playNoteWithDelay = async (note: string, duration: string) => {
    setClickedNote(note); // Update the displayed note
    const pianoKey = pianoKeys.find((key) => key.note === note);

    if (pianoKey) {
      const pianoKeyComponent = document.getElementById(
        `piano-key-${pianoKey.note}`
      ) as HTMLElement;

      if (pianoKeyComponent) {
        // Trigger the click event with a custom data attribute
        pianoKeyComponent.setAttribute("data-programmatic-click", "true");
        pianoKeyComponent.click(); // Trigger the click event to apply the "clicked" class

        // Set a timeout to remove the "clicked" class after the note duration
        setTimeout(() => {
          pianoKeyComponent.removeAttribute("data-programmatic-click"); // Remove the custom data attribute
          pianoKeyComponent.click(); // Trigger another click to remove the class
        }, Tone.Time(duration).toMilliseconds());
      }

      // Wait for the duration of the note before resolving the promise
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, Tone.Time(duration).toMilliseconds());
      });
    }
  };

  const handleAutoplay = async () => {
    for (const step of songs[songIdx].song) {
      if (step instanceof Array) {
        await Promise.all(
          step.map(async ({ note, duration }) => {
            setClickedNote(note);
            await playNoteWithDelay(note, duration);
          })
        );
      } else {
        setClickedNote(step.note);
        await playNoteWithDelay(step.note, step.duration);
      }
    }
  };

  return (
    <div>
      <div className="piano">
        {pianoKeys.map((key, index) => (
          <PianoKey
            key={index}
            type={key.type}
            note={key.note}
            frequency={key.frequency}
            path={key.path}
            volume={volume}
            sustained={sustained}
            synth={synth}
            onClick={() => setClickedNote(key.note)}
          />
        ))}
      </div>
      <NoteDisplay note={clickedNote} />
      <Row style={{ paddingTop: "80px" }} justify={"center"} align={"bottom"}>
        <SoundOutlined style={{ paddingBottom: "10px" }} />
        <Slider
          style={{ width: "200px", marginRight: "40px" }}
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(vol) => setVolume(vol)}
        />

        <div style={{ marginRight: "40px" }}>
          <Text strong style={{ display: "block", userSelect: "none" }}>
            Sustain
          </Text>
          <Switch defaultChecked onChange={() => setSustained(!sustained)} />
        </div>
        <div style={{ marginRight: "40px" }}>
          <Text strong style={{ display: "block", userSelect: "none" }}>
            Synth
          </Text>
          <Switch defaultChecked={false} onChange={() => setSynth(!synth)} />
        </div>
        <Select
          style={{ width: "400px" }}
          disabled={songIsPlaying}
          defaultValue={0}
          options={songs.map((song, idx) => ({
            value: idx,
            label: song.name,
          }))}
          onChange={(value) => setSongIdx(value)}
        />
        <Button
          type="primary"
          disabled={songIsPlaying}
          onClick={async () => {
            setSongIsPlaying(true);
            await handleAutoplay();
            setSongIsPlaying(false);
          }}
        >
          Play Song
        </Button>
      </Row>
    </div>
  );
};

export default Piano;
