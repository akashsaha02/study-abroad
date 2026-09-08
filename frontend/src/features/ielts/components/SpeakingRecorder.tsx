"use client";

import { ieltsApi } from "@/features/ielts/api";
import { IELTS_STORAGE_BUCKETS } from "@abroadly/shared/ielts";
import { createClient } from "@/lib/supabase/client";
import { Button } from "antd";
import { useRef, useState } from "react";

export function SpeakingRecorder({
  attemptId,
  questionId,
  userId,
}: {
  attemptId: string;
  questionId: string;
  userId: string;
}) {
  const [recording, setRecording] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream);
    chunks.current = [];
    rec.ondataavailable = (e) => chunks.current.push(e.data);
    rec.onstop = async () => {
      const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
      setUrl(URL.createObjectURL(blob));
      const supabase = createClient();
      const path = `${userId}/${attemptId}/${questionId}.webm`;
      await supabase.storage.from(IELTS_STORAGE_BUCKETS.speaking).upload(path, blob, {
        upsert: true,
      });
      await ieltsApi.saveSpeaking(attemptId, questionId, path);
    };
    rec.start();
    recorder.current = rec;
    setRecording(true);
  }

  function stop() {
    recorder.current?.stop();
    setRecording(false);
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {!recording ? (
          <Button onClick={() => void start()}>Record</Button>
        ) : (
          <Button danger onClick={stop}>
            Stop
          </Button>
        )}
      </div>
      {url && <audio controls src={url} className="w-full" />}
      <p className="text-xs text-muted-foreground">
        Recordings are private. Band scoring is manual — no automatic speaking score.
      </p>
    </div>
  );
}
