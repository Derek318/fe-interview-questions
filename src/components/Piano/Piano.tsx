import { useState } from "react";
import { SoundOutlined } from "@ant-design/icons";
import { Row, Slider, Switch, Typography } from "antd";
import pianoKeys from "../../data/pianoKeys";
import PianoKey from "./PianoKey";
import NoteDisplay from "./NoteDisplay/NoteDisplay";

import "./Piano.css";

const { Text } = Typography;

const Piano = () => {
  const [clickedNote, setClickedNote] = useState<string>("");
  const [volume, setVolume] = useState<number>(0.5);
  const [sustained, setSustained] = useState(true);
  const [synth, setSynth] = useState(false);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
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
      <Row style={{ paddingTop: "80px" }} justify={"center"} align={"middle"}>
        <SoundOutlined />
        <Slider
          style={{ width: "200px", marginRight: "40px" }}
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={handleVolumeChange}
        />

        <div style={{ marginRight: "40px" }}>
          <Text strong style={{ display: "block", userSelect: "none" }}>
            Sustain
          </Text>
          <Switch defaultChecked onChange={() => setSustained(!sustained)} />
        </div>
        <div>
          <Text strong style={{ display: "block", userSelect: "none" }}>
            Synth
          </Text>
          <Switch defaultChecked={false} onChange={() => setSynth(!synth)} />
        </div>
      </Row>
    </div>
  );
};

export default Piano;
