import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const ACCENT = "#FD6203";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = Math.min(1, frame / Math.max(1, durationInFrames - 1));

  return (
    <AbsoluteFill style={{ justifyContent: "flex-end" }}>
      <div
        style={{
          height: 8,
          width: "100%",
          backgroundColor: "rgba(255,255,255,0.18)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            backgroundColor: ACCENT,
            boxShadow: `0 0 12px ${ACCENT}`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
