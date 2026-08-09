"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MusicPlayerContext = createContext(null);

export function MusicPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = volume;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playAt = useCallback((songs, index) => {
    const song = songs[index];
    const audio = audioRef.current;
    if (!song || !audio) return;

    setPlaylist(songs);
    setCurrentIndex(index);
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(song.duration || 0);

    audio.src = song.audioUrl;
    audio.currentTime = 0;
    audio.volume = volume;
    audio.muted = muted;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const playSong = useCallback(
    (song, songs) => {
      const audio = audioRef.current;
      if (!audio || !song) return;

      if (currentSong && currentSong.id === song.id) {
        if (audio.paused) {
          audio.play();
          setIsPlaying(true);
        } else {
          audio.pause();
          setIsPlaying(false);
        }
        return;
      }

      if (Array.isArray(songs) && songs.length) {
        const listIndex = songs.findIndex((s) => s.id === song.id);
        if (listIndex >= 0) {
          playAt(songs, listIndex);
          return;
        }
      }

      const index = playlist.findIndex((s) => s.id === song.id);
      if (index >= 0) {
        playAt(playlist, index);
      } else {
        playAt([song], 0);
      }
    },
    [currentSong, playlist, playAt]
  );

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, [currentSong]);

  const stopAndResetPlayer = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
    }
    setCurrentSong(null);
    setPlaylist([]);
    setCurrentIndex(-1);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const nextSong = useCallback(() => {
    if (!playlist.length) return;
    const next = (currentIndex + 1) % playlist.length;
    playAt(playlist, next);
  }, [playlist, currentIndex, playAt]);

  const previousSong = useCallback(() => {
    if (!playlist.length) return;
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    const prev = (currentIndex - 1 + playlist.length) % playlist.length;
    playAt(playlist, prev);
  }, [playlist, currentIndex, playAt]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const changeVolume = useCallback((value) => {
    const audio = audioRef.current;
    const next = Math.min(1, Math.max(0, value));
    setVolume(next);
    if (audio) {
      audio.volume = next;
      audio.muted = next === 0;
      setMuted(next === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setMuted(nextMuted);
  }, []);

  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  }, []);

  const onDurationChange = useCallback(() => {
    const audio = audioRef.current;
    if (audio && Number.isFinite(audio.duration)) setDuration(audio.duration);
  }, []);

  const onPlay = useCallback(() => setIsPlaying(true), []);
  const onPause = useCallback(() => setIsPlaying(false), []);
  const onEnded = useCallback(() => {
    nextSong();
  }, [nextSong]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDurationChange);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDurationChange);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [onTimeUpdate, onDurationChange, onPlay, onPause, onEnded]);

  const value = useMemo(
    () => ({
      currentSong,
      playlist,
      currentIndex,
      isPlaying,
      currentTime,
      duration,
      volume,
      muted,
      playSong,
      playAt,
      togglePlay,
      nextSong,
      previousSong,
      seek,
      changeVolume,
      toggleMute,
      stopAndResetPlayer,
    }),
    [
      currentSong,
      playlist,
      currentIndex,
      isPlaying,
      currentTime,
      duration,
      volume,
      muted,
      playSong,
      playAt,
      togglePlay,
      nextSong,
      previousSong,
      seek,
      changeVolume,
      toggleMute,
      stopAndResetPlayer,
    ]
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider");
  }
  return context;
}
