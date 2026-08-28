"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const PLAYLIST_ID = "RDEMlqRUru2cnmPNQT36aDBmLA";
const PLAYER_ELEMENT_ID = "watendawili-music-player";
const IFRAME_API_SRC = "https://www.youtube.com/iframe_api";

type YTPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  nextVideo: () => void;
  previousVideo: () => void;
  destroy: () => void;
};

type YTPlayerEvent = { target: YTPlayer; data: number };

type YTNamespace = {
  Player: new (
    elementId: string,
    options: {
      height: string;
      width: string;
      playerVars: Record<string, string | number>;
      events: {
        onReady?: (event: YTPlayerEvent) => void;
        onStateChange?: (event: YTPlayerEvent) => void;
      };
    }
  ) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

type MusicPlayerContextValue = {
  isReady: boolean;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function createPlayer() {
      if (cancelled || !window.YT) return;
      playerRef.current = new window.YT.Player(PLAYER_ELEMENT_ID, {
        height: "0",
        width: "0",
        playerVars: {
          listType: "playlist",
          list: PLAYLIST_ID,
          autoplay: 0,
          playsinline: 1,
        },
        events: {
          onReady: () => setIsReady(true),
          onStateChange: (event) => {
            setIsPlaying(event.data === window.YT!.PlayerState.PLAYING);
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const previousCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previousCallback?.();
        createPlayer();
      };
      if (!document.querySelector(`script[src="${IFRAME_API_SRC}"]`)) {
        const script = document.createElement("script");
        script.src = IFRAME_API_SRC;
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, []);

  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);
  const next = useCallback(() => playerRef.current?.nextVideo(), []);
  const previous = useCallback(() => playerRef.current?.previousVideo(), []);
  const toggle = useCallback(() => {
    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
  }, [isPlaying]);

  const value: MusicPlayerContextValue = {
    isReady,
    isPlaying,
    play,
    pause,
    toggle,
    next,
    previous,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      {/* Off-screen, not display:none — YouTube's iframe needs to stay in the
          render tree for playback to keep running while browsing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -left-[9999px] -top-[9999px] h-px w-px overflow-hidden opacity-0"
      >
        <div id={PLAYER_ELEMENT_ID} />
      </div>
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const ctx = useContext(MusicPlayerContext);
  if (!ctx) throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  return ctx;
}
