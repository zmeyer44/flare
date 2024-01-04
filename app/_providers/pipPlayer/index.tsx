"use client";

import { createContext, useContext, useMemo, useReducer, useRef } from "react";
import { atom, useAtom } from "jotai";
import { type MediaPlayerInstance } from "@vidstack/react";

type Video = {
  url: string;
  author: string;
  title?: string;
  thumbnail?: string;
  encodedEvent?: string;
};

interface PlayerState {
  wasPlaying: boolean;
  playing: boolean;
  muted: boolean;
  duration: number;
  currentTime: number;
  episode: Video | null;
  showPip: boolean;
  player: React.RefObject<MediaPlayerInstance>;
}

interface PublicPlayerActions {
  initPip: (playerState?: Partial<PlayerState>, state?: boolean) => void;
  play: (episode?: Video) => void;
  clear: () => void;
  pause: () => void;
  updateCurrentTime: (time: number) => void;
  toggle: (episode?: Video) => void;
  seekBy: (amount: number) => void;
  seek: (time: number) => void;
  playbackRate: (rate: number) => void;
  toggleMute: () => void;
  isPlaying: (episode?: Video) => boolean;
}

export type PlayerAPI = PlayerState & PublicPlayerActions;

const enum ActionKind {
  SET_META = "SET_META",
  SHOW_PIP = "SHOW_PIP",
  HIDE_PIP = "HIDE_PIP",
  CLEAR = "CLEAR",
  PLAY = "PLAY",
  PAUSE = "PAUSE",
  TOGGLE_MUTE = "TOGGLE_MUTE",
  SET_CURRENT_TIME = "SET_CURRENT_TIME",
  SET_DURATION = "SET_DURATION",
}

type Action =
  | { type: ActionKind.SET_META; payload: Video }
  | { type: ActionKind.CLEAR }
  | { type: ActionKind.PLAY; payload: Video }
  | { type: ActionKind.SHOW_PIP; payload?: Partial<PlayerState> }
  | { type: ActionKind.HIDE_PIP }
  | { type: ActionKind.PAUSE }
  | { type: ActionKind.TOGGLE_MUTE }
  | { type: ActionKind.SET_CURRENT_TIME; payload: number }
  | { type: ActionKind.SET_DURATION; payload: number };

const AudioPlayerContext = createContext<PlayerAPI | null>(null);

function audioReducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case ActionKind.SET_META:
      return { ...state, episode: action.payload };
    case ActionKind.SHOW_PIP:
      return { ...state, ...action.payload, showPip: true };
    case ActionKind.HIDE_PIP:
      return { ...state, showPip: false };
    case ActionKind.CLEAR:
      return { ...state, episode: null, showPip: false };
    case ActionKind.PLAY:
      return {
        ...state,
        episode: action.payload,
        playing: true,
        wasPlaying: true,
      };
    case ActionKind.PAUSE:
      return { ...state, playing: false, wasPlaying: false };
    case ActionKind.TOGGLE_MUTE:
      return { ...state, muted: !state.muted };
    case ActionKind.SET_CURRENT_TIME:
      return { ...state, currentTime: action.payload };
    case ActionKind.SET_DURATION:
      return { ...state, duration: action.payload };
  }
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  let player = useRef<MediaPlayerInstance>(null);
  let [state, dispatch] = useReducer(audioReducer, {
    player,
    wasPlaying: false,
    playing: false,
    showPip: false,
    muted: false,
    duration: 0,
    currentTime: 0,
    episode: null,
  });
  let playerRef = useRef<React.ElementRef<"video">>(null);

  let actions = useMemo<PublicPlayerActions>(() => {
    return {
      initPip(playerState, newVal) {
        console.log("at init pip", playerState, state.episode);
        if (newVal === false) {
          dispatch({ type: ActionKind.HIDE_PIP });
        } else {
          dispatch({ type: ActionKind.SHOW_PIP, payload: playerState });
        }
      },
      play(episode) {
        if (episode) {
          if (player.current?.paused) {
            player.current.play();
          }
          dispatch({ type: ActionKind.PLAY, payload: episode });
          //   if (player.current) {
          //     console.log("Current source", player.current.state.source);
          //     player.current.startLoading();
          //   }
          //   if (
          //     playerRef.current &&
          //     playerRef.current.currentSrc !== episode.url
          //   ) {
          //     let playbackRate = playerRef.current.playbackRate;
          //     playerRef.current.src = episode.url;
          //     playerRef.current.load();
          //     playerRef.current.pause();
          //     playerRef.current.playbackRate = playbackRate;
          //     playerRef.current.currentTime = 0;
          //   }
        }

        // playerRef.current?.play();
      },
      pause() {
        if (!player.current?.paused) {
          player.current?.pause();
        }
        dispatch({ type: ActionKind.PAUSE });
      },
      clear() {
        dispatch({ type: ActionKind.CLEAR });
      },
      updateCurrentTime(time) {
        console.log("updateCurrentTime", time);
        dispatch({
          type: ActionKind.SET_CURRENT_TIME,
          payload: time,
        });
      },
      toggle(episode) {
        this.isPlaying(episode) ? actions.pause() : actions.play(episode);
      },
      seekBy(amount) {
        if (playerRef.current) {
          playerRef.current.currentTime += amount;
        }
      },
      seek(time) {
        if (playerRef.current) {
          playerRef.current.currentTime = time;
        }
      },
      playbackRate(rate) {
        if (playerRef.current) {
          playerRef.current.playbackRate = rate;
        }
      },
      toggleMute() {
        dispatch({ type: ActionKind.TOGGLE_MUTE });
      },
      isPlaying(episode) {
        return episode
          ? state.playing && playerRef.current?.currentSrc === episode.url
          : state.playing;
      },
    };
  }, [state.playing]);

  let api = useMemo<PlayerAPI>(
    () => ({ ...state, ...actions, player }),
    [state, actions],
  );

  return (
    <>
      <AudioPlayerContext.Provider value={api}>
        {children}
      </AudioPlayerContext.Provider>
      {/* <video
        ref={playerRef}
        onPlay={() => dispatch({ type: ActionKind.PLAY })}
        onPause={() => dispatch({ type: ActionKind.PAUSE })}
        onTimeUpdate={(event) => {
          dispatch({
            type: ActionKind.SET_CURRENT_TIME,
            payload: Math.floor(event.currentTarget.currentTime),
          });
        }}
        onDurationChange={(event) => {
          dispatch({
            type: ActionKind.SET_DURATION,
            payload: Math.floor(event.currentTarget.duration),
          });
        }}
        muted={state.muted}
      /> */}
    </>
  );
}

export function usePlayer(episode?: Video) {
  console.log("episode", episode);
  let player = useContext(AudioPlayerContext);
  return useMemo<PlayerAPI>(
    () => ({
      ...player!,
      initPip(playerState, type) {
        console.log(
          "initPip() in useMemo",
          player?.player.current?.currentTime,
        );
        if (episode) {
          player!.initPip({ episode, ...playerState }, type);
          player!.play(episode);
        } else {
          player!.initPip(playerState, type);
        }
      },
      play() {
        console.log("Play called", player?.player.current?.currentTime);
        player!.play(episode);
      },
      clear() {
        player!.clear();
      },
      toggle() {
        player!.toggle(episode);
      },
      get playing() {
        return player!.isPlaying(episode);
      },
    }),
    [player, episode],
  );
}
