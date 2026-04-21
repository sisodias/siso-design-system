# IaSiriChat

## What it is
AI voice assistant interface with animated mic button, waveform visualizer, ambient particles, and a demo mode that cycles through listening, processing, and speaking states.

## What it's used for
- Voice-triggered AI assistants
- Audio recording interfaces
- Interactive voice command UIs

## Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onStart` | `() => void` | — | Callback when recording starts |
| `onStop` | `(duration: number) => void` | — | Callback when recording stops |
| `onVolumeChange` | `(volume: number) => void` | — | Callback with volume level 0-100 |
| `className` | `string` | — | Additional CSS classes |
| `demoMode` | `boolean` | `true` | Auto-cycle through states for demo |

## Source
21st.dev

## Tags
voice, siri, ai, assistant, waveform, microphone, animated, framer-motion
