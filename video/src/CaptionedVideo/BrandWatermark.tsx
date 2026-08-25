import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const ACCENT = "#FD6203";

export const BrandWatermark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.6 },
    durationInFrames: 20,
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const glow = interpolate(
    Math.sin(frame / 12),
    [-1, 1],
    [0.35, 0.7],
    { easing: Easing.inOut(Easing.ease) },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "64px 0 0 48px",
        opacity: enter * fadeOut,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          transform: `translateY(${interpolate(enter, [0, 1], [-30, 0])}px)`,
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: ACCENT,
            boxShadow: `0 0 ${8 + glow * 14}px ${ACCENT}`,
          }}
        />
        <span
          style={{
            fontFamily:
              "'Archivo', system-ui, -apple-system, sans-serif",
            fontWeight: 700,
            fontSize: 34,
            letterSpacing: 2,
            color: "white",
            textShadow: "0 2px 10px rgba(0,0,0,0.55)",
          }}
        >
          TAINO<span style={{ color: ACCENT }}>®</span>
        </span>
      </div>
    </AbsoluteFill>
  );
};
