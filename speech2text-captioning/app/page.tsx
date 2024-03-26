"use client"

import React, { useState, ChangeEvent } from 'react';
import { Spinner } from "@nextui-org/react";

export default function Home() {
  const [audio, setAudio] = useState<File>();
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<String>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);


  const uplaodAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {

    const audio = e.target.files?.[0]
    setAudio(audio);
    if (!audio) {
      setError('Please select a .wav file');
      return;
    }

    setIsLoading(true);
    convertAudioToText(audio).then((result) => {
      if (result.error) {
        setError(result.error);
        setTranscript(result.error);
      } else if (result.data == "") {
        setError("Cannot Detect the Speech");
      }
      else {
        setTranscript(result.data);
        console.log(result.data);
      }
      setIsLoading(false);
    })
  }

  async function convertAudioToText(audio: File) {
    return fetch('https://eastus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US', {
      method: 'POST',
      body: audio,
      headers: {
        'Content-Type': 'audio/wav',
        'Ocp-Apim-Subscription-Key': '20e0dd5753514db99df06284952a8e51',
      },
    }).then((response) => response.json())
      .then((result) => {
        if (result.error) {
          return { data: null, error: result.error }
        } else {
          return { data: result.DisplayText, error: null };
        }
      }
      )
  }


  return (
    <main className="flex flex-col items-center max-w-full">
      <div className="flex w-full justify-center px-12 mt-4">
        <label className="text-xl uppercase font-semibold mb-2">Speech-to-Text Converter</label>
      </div>

      <div className="w-96 flex flex-col">
        <input type="file" accept=".wav" onChange={uplaodAudioFile} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {isLoading && (
          <Spinner label="Loading" color="primary" labelColor="primary" />
        )}
        {transcript && (
          <div>
            <h2>Transcript:</h2>
            <p>{transcript}</p>
          </div>
        )}
      </div>
    </main>
  );
}
