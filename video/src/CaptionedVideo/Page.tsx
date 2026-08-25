import { makeTransform, scale, translateY } from "@remotion/animation-utils";
import { TikTokPage } from "@remotion/captions";
import { fitText } from "@remotion/layout-utils";
import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TheBoldFont } from "../load-font";

const fontFamily = TheBoldFont;

const container: React.CSSProperties = {
  justifyContent: "center",
  alignItems: "center",
  top: undefined,
  bottom: 380,
  height: 220,
};

const DESIRED_FONT_SIZE = 110;
const HIGHLIGHT_COLOR = "#FD6203";

export const Page: React.FC<{
  readonly enterProgress: number;
  readonly page: TikTokPage;
}> = ({ enterProgress, page }) => {
  const frame = useCurrentFrame();
  const { width, fps } = useVideoConfig();
  const timeInMs = (frame / fps) * 1000;

  const fittedText = fitText({
    fontFamily,
    text: page.text,
    withinWidth: width * 0.88,
    textTransform: "uppercase",
  });

  const fontSize = Math.min(DESIRED_FONT_SIZE, fittedText.fontSize);

  const backdropScale = interpolate(enterProgress, [0, 1], [0.9, 1]);
  const backdropOpacity = interpolate(enterProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={container}>
      <div
        style={{
          position: "absolute",
          left: "6%",
          right: "6%",
          top: 0,
          bottom: 0,
          borderRadius: 28,
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.05) 0%, rgba(10,10,10,0.55) 35%, rgba(10,10,10,0.55) 65%, rgba(10,10,10,0.05) 100%)",
          border: `2px solid ${HIGHLIGHT_COLOR}55`,
          transform: makeTransform([scale(backdropScale)]),
          opacity: backdropOpacity,
        }}
      />
      <div
        style={{
          fontSize,
          color: "white",
          WebkitTextStroke: "16px black",
          paintOrder: "stroke",
          transform: makeTransform([
            scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
            translateY(interpolate(enterProgress, [0, 1], [50, 0])),
          ]),
          fontFamily,
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        <span
          style={{
            transform: makeTransform([
              scale(interpolate(enterProgress, [0, 1], [0.8, 1])),
            ]),
          }}
        >
          {page.tokens.map((t) => {
            const startRelativeToSequence = t.fromMs - page.startMs;
            const endRelativeToSequence = t.toMs - page.startMs;

            const active =
              startRelativeToSequence <= timeInMs &&
              endRelativeToSequence > timeInMs;

            const msSinceActive = timeInMs - startRelativeToSequence;
            const pop = active
              ? interpolate(msSinceActive, [0, 160], [1.35, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                  easing: Easing.out(Easing.back(1.8)),
                })
              : 1;

            return (
              <span
                key={t.fromMs}
                style={{
                  display: "inline-block",
                  whiteSpace: "pre",
                  color: active ? HIGHLIGHT_COLOR : "white",
                  transform: `scale(${pop})`,
                  textShadow: active
                    ? `0 0 30px ${HIGHLIGHT_COLOR}aa`
                    : "none",
                }}
              >
                {t.text}
              </span>
            );
          })}
        </span>
      </div>
    </AbsoluteFill>
  );
};
