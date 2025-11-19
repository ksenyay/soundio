"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Download, Play, Square } from "lucide-react";
import { buildClient } from "@/api/buildClient";

const AudioPlayer = ({
  product,
  isPurchased,
}: {
  product: { id: string; title: string; fileUrl: string; duration: string };
  isPurchased: boolean;
}) => {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const previewLimit = 25;
  const [timeLeft, setTimeLeft] = useState<number>(
    isPurchased ? parseDuration(product.duration) : previewLimit
  );

  const cookie = document.cookie;
  const client = buildClient(cookie);

  const audioRef = useRef<HTMLAudioElement>(null);

  const totalDuration = isPurchased
    ? parseDuration(product.duration)
    : previewLimit;

  function parseDuration(duration: string): number {
    if (duration.includes(":")) {
      const [min, sec] = duration.split(":").map(Number);
      return min * 60 + sec;
    }
    return parseFloat(duration);
  }

  function formatTime(seconds: number) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  }

  function stopSound() {
    setIsSoundPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setTimeLeft(totalDuration);
  }

  function startSound() {
    setIsSoundPlaying(true);
    if (audioRef.current) {
      audioRef.current.play();
    }
  }

  function handleTimeUpdate() {
    const audio = audioRef.current;
    if (!audio) return;

    const remaining = totalDuration - audio.currentTime;
    setTimeLeft(remaining > 0 ? remaining : 0);

    // Stop at 10s if not purchased
    if (!isPurchased && audio.currentTime >= previewLimit) {
      stopSound();
    }
  }

  async function updateDownloadCount(id: string) {
    try {
      await client.patch(
        `${process.env.NEXT_PUBLIC_PRODUCT_URL}/api/products/downloads/${id}`,
        {}
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDownload(url: string, id: string, filename: string) {
    try {
      await updateDownloadCount(id);

      const response = await fetch(url);
      const blob = await response.blob();

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  useEffect(() => {
    setTimeLeft(isPurchased ? parseDuration(product.duration) : previewLimit);
  }, [isPurchased, product.duration]);

  return (
    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 rounded-xl py-4 px-3.5"
            onClick={isSoundPlaying ? stopSound : startSound}
          >
            <span
              className={
                "inline-block transition-transform duration-200 " +
                (isSoundPlaying ? "scale-110" : "scale-100")
              }
            >
              {isSoundPlaying ? (
                <Square className="w-6 h-6 ml-1" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </span>
          </Button>
          <div>
            <p className="text-white font-medium">
              {isPurchased ? "Full Track" : "Preview"}
            </p>
            <p className="text-sm text-gray-400">{product.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {!isPurchased && !isSoundPlaying ? "0:25" : formatTime(timeLeft)}
          </span>

          {isPurchased && (
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 hover:bg-white/10 rounded-xl"
              onClick={() =>
                handleDownload(
                  product.fileUrl,
                  product.id,
                  product.title + ".mp3"
                )
              }
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Audio element */}
      <audio
        ref={audioRef}
        src={product.fileUrl}
        onEnded={stopSound}
        onTimeUpdate={handleTimeUpdate}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default AudioPlayer;
