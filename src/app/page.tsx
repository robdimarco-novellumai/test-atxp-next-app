"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useState } from "react";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("Make an image of a RCMP officer as a goose.");

  const onClick = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    setImageUrl(null);
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
      
      const response = await fetch('/api/atxp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      console.log(data.result);
      
      // Parse the response to extract the image URL
      if (data.result?.content && Array.isArray(data.result.content)) {
        for (const item of data.result.content) {
          if (item.type === "text" && item.text) {
            try {
              const parsedText = JSON.parse(item.text);
              if (parsedText.url) {
                setImageUrl(parsedText.url);
                return;
              }
            } catch (parseError) {
              console.log('Could not parse text as JSON:', item.text, parseError);
            }
          }
        }
      }
      
      if (!imageUrl) {
        setError('No image URL found in response');
      }
      
    } catch (error) {
      console.error('Error calling ATXP:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}
    >
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-4 w-full max-w-md">
          <label htmlFor="prompt" className="text-sm font-medium">
            Enter your image prompt:
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button 
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 disabled:opacity-50 disabled:cursor-not-allowed" 
            onClick={onClick}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm max-w-md text-center">
            {error}
          </div>
        )}
        
        {imageUrl && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-lg font-semibold">Generated Image:</h2>
            <div className="relative w-96 h-96">
              <Image
                src={imageUrl}
                alt="Generated image"
                fill
                className="object-contain rounded-lg"
                unoptimized // Since it's an external URL
              />
            </div>
            <a 
              href={imageUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm"
            >
              Open in new tab
            </a>
          </div>
        )}
      </main>
    </div>
  );
}