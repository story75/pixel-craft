/**
 * Audio mixer for managing audio sources and volumes.
 *
 * @remarks
 * The audio mixer is responsible for managing the audio context and routing audio sources to the correct output.
 * It uses the Web Audio API to handle audio playback.
 *
 * The mixer uses common channels like master, background music (BGM), sound effects (SFX), and voice.
 */
export class AudioMixer {
  private readonly audioContext = new AudioContext();

  private readonly masterGain = this.audioContext.createGain();
  private readonly bgmGain = this.audioContext.createGain();
  private readonly sfxGain = this.audioContext.createGain();
  private readonly voiceGain = this.audioContext.createGain();

  private unlocked = false;

  constructor() {
    document.addEventListener(
      'click',
      () => {
        this.unlock();
      },
      { once: true },
    );

    this.masterGain.connect(this.audioContext.destination);

    this.bgmGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.voiceGain.connect(this.masterGain);
  }

  get masterVolume(): number {
    return this.masterGain.gain.value;
  }

  set masterVolume(volume: number) {
    this.masterGain.gain.value = volume;
  }

  get bgmVolume(): number {
    return this.bgmGain.gain.value;
  }

  set bgmVolume(volume: number) {
    this.bgmGain.gain.value = volume;
  }

  get sfxVolume(): number {
    return this.sfxGain.gain.value;
  }

  set sfxVolume(volume: number) {
    this.sfxGain.gain.value = volume;
  }

  get voiceVolume(): number {
    return this.voiceGain.gain.value;
  }

  set voiceVolume(volume: number) {
    this.voiceGain.gain.value = volume;
  }

  /**
   * Pause all audio sources.
   */
  suspend(): Promise<void> {
    return this.audioContext.suspend();
  }

  /**
   * Resume all audio sources.
   */
  resume(): Promise<void> {
    return this.audioContext.resume();
  }

  /**
   * Load an audio source from a URL.
   *
   * @remarks
   * This will load the audio source from the given URL and return an audio buffer source node.
   * It will not start playing the audio source.
   *
   * @param url - The URL to load the audio source from.
   */
  async load(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    return this.audioContext.decodeAudioData(data);
  }

  /**
   * Create an audio source from an audio buffer.
   *
   * @param audioBuffer - The audio buffer to create the audio source from. Create this via `load()`.
   */
  createSource(audioBuffer: AudioBuffer): AudioBufferSourceNode {
    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;

    return source;
  }

  /**
   * Play an audio source on a specific channel.
   *
   * @param source - The audio source to play. Create this via `createBufferSource()`.
   * @param channel - The channel to play the audio source on.
   */
  play(source: AudioBufferSourceNode, channel: 'bgm' | 'sfx' | 'voice'): void {
    let gain: GainNode;

    switch (channel) {
      case 'bgm':
        gain = this.bgmGain;
        break;
      case 'sfx':
        gain = this.sfxGain;
        break;
      case 'voice':
        gain = this.voiceGain;
        break;
    }

    source.connect(gain);
    source.start();
  }

  private unlock(): void {
    if (this.unlocked) {
      return;
    }

    // play an empty sound
    const buffer = this.audioContext.createBuffer(1, 1, 22050);
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start(0, 0, 0);

    void this.audioContext.resume();
    this.unlocked = true;
  }
}
