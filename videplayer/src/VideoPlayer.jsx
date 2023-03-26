import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import {
  Box,
  Flex,
  IconButton,
  Progress,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FaBackward, FaForward, FaPause, FaPlay } from 'react-icons/fa';
import { FaVolumeMute, FaVolumeOff, FaVolumeUp } from 'react-icons/fa';

const formatTime = (seconds) => {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes().toString().padStart(2, '0');
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  if (hh) {
    return `${hh}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
};

const VideoPlayer = ({ url }) => {
  const [playing, setPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const playerRef = useRef(null);

  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && playing) {
        setPlayedSeconds(playerRef.current.getCurrentTime());
      }
    }, 100);
    return () => clearInterval(interval);
  }, [playing]);

  const handlePlayPauseClick = () => {
    setPlaying((prevState) => !prevState);
  };

  const handleFastBackwardClick = () => {
    const nextTime = Math.max(playedSeconds - 5, 0);
    playerRef.current.seekTo(nextTime);
    setPlayedSeconds(nextTime);
  };

  const handleFastForwardClick = () => {
    const nextTime = Math.min(playedSeconds + 5, duration);
    playerRef.current.seekTo(nextTime);
    setPlayedSeconds(nextTime);
  };

  const handlePlaybackRateChange = (value) => {
    setPlaybackRate(value);
  };

  const handleSliderMouseDown = () => {
    setPlaying(false);
  };

  const handleSliderMouseUp = () => {
    setPlaying(true);
  };

  const handleSliderChange = (value) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value);
      setPlayedSeconds(value);
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleVolumeChange = (value) => {
    setVolume(value);
    setMuted(false);
  };

  const handleMute = () => {
    setMuted(!muted);
  };

  return (
    <Box>
      <ReactPlayer
        url={url}
        playing={playing}
        playbackRate={playbackRate}
        width="100%"
        height="100%"
        ref={playerRef}
        onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
        onDuration={handleDuration}
        volume={muted ? 0 : volume}
      />

      <Flex alignItems="center" justifyContent="space-between" mt="4">
        <Box display="flex" alignItems="center">
          <IconButton
            icon={<FaBackward />}
            size="sm"
            onClick={handleFastBackwardClick}
            mr="2"
            aria-label="Fast Backward"
          />
          <IconButton
            icon={playing ? <FaPause /> : <FaPlay />}
            size="sm"
            onClick={handlePlayPauseClick}
            mr="2"
            aria-label={playing ? 'Pause' : 'Play'}
          />
          <IconButton
            icon={<FaForward />}
            size="sm"
            onClick={handleFastForwardClick}
            mr="2"
            aria-label="Fast Forward"
          />
          <Text color="gray.500" fontSize="sm">
            {formatTime(playedSeconds)} / {formatTime(duration)}
          </Text>
        </Box>
        <Stack direction="row" alignItems="center">
          <Text color="gray.500" fontSize="sm" mr="2">
            Speed:
          </Text>
          <Slider
            aria-label="Speed"
            defaultValue={1}
            min={0.5}
            max={2}
            step={0.1}
            value={playbackRate}
            onChange={handlePlaybackRateChange}
            w="80px"
            mr="2"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize="sm">{playbackRate}x</SliderThumb>
          </Slider>
        </Stack>
      </Flex>
      <Slider
        aria-label="Video Progress"
        value={playedSeconds}
        max={duration}
        onChange={handleSliderChange}
        onMouseDown={handleSliderMouseDown}
        onMouseUp={handleSliderMouseUp}
        mt="4"
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb fontSize="sm">{formatTime(playedSeconds)}</SliderThumb>
      </Slider>

      <Box display="flex" alignItems="center">
        <IconButton
          icon={muted ? <FaVolumeMute /> : <FaVolumeOff />}
          size="sm"
          variant="ghost"
          isRound
          aria-label={muted ? 'Unmute' : 'Mute'}
          onClick={handleMute}
        />
        <Box flex="1" mr="4">
          <Slider
            value={volume}
            min={0}
            max={1}
            step={0.01}
            onChange={handleVolumeChange}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <IconButton
          icon={<FaVolumeUp />}
          size="sm"
          variant="ghost"
          isRound
          aria-label="Volume up"
          onClick={() => handleVolumeChange(Math.min(volume + 0.1, 1))}
        />
      </Box>
    </Box>
  );
};

export default VideoPlayer;
