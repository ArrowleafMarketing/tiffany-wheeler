# public/video

Web-ready encodes of the *A Nephite Christmas* footage. Sources are in `assets/media-library/`: `Horizontal-4k.mov` (16:9 master), `Vertical-1080.mov` (9:16 reframe of the same 30s edit) and `IMG_3989.mov` (iPhone HDR read-aloud). Everything is Christmas content. No Easter footage exists yet.

## Files

| File | Resolution | Duration | Size | Codec (for `type=`) | Audio | Intended use |
|---|---|---|---|---|---|---|
| `hero-720.webm` | 1280x720, 24fps | 30.33s | 1.71 MB | AV1 Main 8-bit, `av01.0.05M.08` | **none** | Desktop hero loop. First `<source>` |
| `hero-720.mp4` | 1280x720, 24fps | 30.33s | 2.57 MB | H.264 High L4.0, `avc1.640028` | **none** | Desktop hero loop. Fallback `<source>` |
| `hero-mobile.webm` | 540x960, 24fps | 30.33s | 1.30 MB | AV1 Main 8-bit, `av01.0.04M.08` | **none** | Mobile hero loop (<768px). First `<source>` |
| `hero-mobile.mp4` | 540x960, 24fps | 30.33s | 1.69 MB | H.264 High L4.0, `avc1.640028` | **none** | Mobile hero loop. Fallback `<source>` |
| `trailer-preview-1080.mp4` | 1920x1080, 24fps | 16.00s (cut from the 30.4s trailer, 0.6s fade out; full files moved to `assets/derived/video-full/`) | 12.38 MB | H.264 High L4.0 + AAC-LC 128k 48k stereo, `avc1.640028, mp4a.40.2` | yes, -15.7 LUFS | Click-to-play "Watch the trailer" (desktop) |
| `trailer-preview-720.mp4` | 1280x720, 24fps | 16.00s | 5.12 MB | H.264 High L3.1 + AAC-LC 128k, `avc1.64001F, mp4a.40.2` | yes, -15.7 LUFS | Click-to-play trailer on mobile |
| `readaloud-clip.mp4` | 720x1280 (portrait), 30fps | 42.80s | 6.33 MB | H.264 High L3.1 + AAC-LC 128k, `avc1.64001F, mp4a.40.2` | yes, -16.2 LUFS | "Hear the author read it" section, click-to-play |
| `hero-poster.jpg` | 1920x1080 | | 185 KB | JPEG | | Poster for `hero-720.*` and both trailers |
| `hero-mobile-poster.jpg` | 1080x1920 | | 149 KB | JPEG | | Poster for `hero-mobile.*` |
| `readaloud-poster.jpg` | 720x1280 | | 98 KB | JPEG | | Poster for `readaloud-clip.mp4` |

Total: **31.5 MB** on disk (videos 31.1 MB, posters 0.43 MB). What a visitor downloads on first view: desktop hero about 1.9 MB (AV1 plus poster), mobile hero about 1.45 MB. Trailers and the read-aloud load nothing until clicked, provided `preload="none"` is set.

All MP4s have `moov` before `mdat` (faststart). All video is tagged BT.709 SDR, yuv420p, square pixels, and carries no rotation metadata. All files have metadata stripped.

## Poster mapping

| Video | Poster | Frame |
|---|---|---|
| `hero-720.webm` / `.mp4` | `hero-poster.jpg` | Horizontal-4k at t=12.0s: mom and three kids by the fireplace, title legible |
| `hero-mobile.webm` / `.mp4` | `hero-mobile-poster.jpg` | Vertical-1080 at **t=12.0s**, the same moment. I checked 5.7s: the book sits at the frame edge and the youngest child is cut off. At 12.0s the title is centered and sharp |
| `trailer-1080.mp4` / `trailer-720.mp4` | `hero-poster.jpg` | Same frame as the hero |
| `readaloud-clip.mp4` | `readaloud-poster.jpg` | IMG_3989 at t=0.8s (0.2s into the clip): smiling to camera, cover face-on, "Written by Tiffany Wheeler / Illustrated by Kelley Hicken" readable |

The hero loops start at 0s on the grandmother shot, while the poster shows the 12s fireplace frame. So there is one visible change from poster to first frame when playback begins. That is normal for a background loop.

The loop seam is a clean hard cut: the last shot and the first shot are both full-brightness footage, with no fade to black.

## Markup

```html
<!-- Hero: muted autoplay loop. Swap by viewport; honor prefers-reduced-motion by showing only the poster. -->
<video autoplay muted loop playsinline preload="metadata" poster="/video/hero-poster.jpg">
  <source src="/video/hero-720.webm" type='video/webm; codecs="av01.0.05M.08"'>
  <source src="/video/hero-720.mp4"  type='video/mp4; codecs="avc1.640028"'>
</video>
<video autoplay muted loop playsinline preload="metadata" poster="/video/hero-mobile-poster.jpg">
  <source src="/video/hero-mobile.webm" type='video/webm; codecs="av01.0.04M.08"'>
  <source src="/video/hero-mobile.mp4"  type='video/mp4; codecs="avc1.640028"'>
</video>

<!-- Trailer: click to play, sound on -->
<video controls playsinline preload="none" poster="/video/hero-poster.jpg">
  <!-- media= on video <source> works in current Chrome/Firefox/Safari (support returned in 2023). Older browsers ignore it and take this first source. -->
  <source src="/video/trailer-720.mp4"  type="video/mp4" media="(max-width: 767px)">
  <source src="/video/trailer-1080.mp4" type="video/mp4">
</video>

<!-- Read-aloud: portrait, click to play -->
<video controls playsinline preload="none" poster="/video/readaloud-poster.jpg" width="720" height="1280">
  <source src="/video/readaloud-clip.mp4" type="video/mp4">
</video>
```

Browsers that can't decode AV1 skip the `.webm` source because of its `codecs=` string. That includes older Safari and iPhones before the 15 Pro. Those browsers play the H.264 MP4 instead.

## Read-aloud clip details

- **Source range:** IMG_3989 from 0.6s to 43.4s. She starts speaking at about 1.4s, so the clip opens with a short lead-in.
- **Content:**
  - 0 to 7s: she holds the cover to camera and introduces the book.
  - 7 to 9s: she opens it.
  - About 10 to 12s: the title page.
  - 17 to 31s: the first two story spreads.
  - 33 to 42.8s: the third spread.
- **Ending:** the clip ends inside a natural 2s pause on the third spread, before the right-hand page, with a 0.8s audio fade-out. It does not give the whole book away. The full video is 3:11 and covers every page.
- **HDR to SDR:** done with a real tone map through macOS VideoToolbox (`transpose_vt` then `scale_vt` with bt709 matrix, primaries and transfer). This replaces the matrix-only fallback in the discovery doc. I compared the two side by side. The fallback made her face near-clipped and the colors flat. The VideoToolbox version has natural skin tones, a saturated cover and no blown highlights. This path only works on a Mac.
- **Audio:**
  - Chain: 80 Hz high-pass, light FFT denoise (`afftdn nr=10`), +18.6 dB linear gain, a limiter at about -2.5 dBFS, then AAC.
  - Result: -16.2 LUFS integrated, -2.2 dBTP, LRA 16.4, so natural speech dynamics are kept.
  - I didn't use loudnorm because its dynamic fallback lifted the pauses and noise floor about 2 dB more. The source is very quiet (-34 LUFS), so the room tone is audible between phrases, but low.

## Trailer audio (measured, not listened to)

**Conclusion: dry spoken audio with no music bed.** It is either a voice-over or the families' live reading. Captions are still needed: there's no transcript yet, so no `.vtt` exists. Meta and the hero play muted anyway.

Measurements on `trailer-1080.mp4`:
- **Energy is in the speech band.** Mean level by band: 300 to 3400 Hz is -20.4 dB, below 200 Hz is -29.0 dB, above 6 kHz is -42.3 dB.
- **Effectively mono.** L minus R measures -56.5 dB after AAC (-83 dB in the source).
- **Strong syllable-rate modulation.** 26% of 50 ms windows sit more than 12 dB below the median, with about 1.4 dips per second.
- **Gaps drop to near silence.** At the shot cuts (3.0 to 4.0s, 14.5 to 16.1s, 29.5 to 30.3s) the level falls to -50 to -60 dB, so nothing continuous plays underneath.
- **The loudest passage is 26.5 to 29.5s,** over the closing wide shot. It might be a closing line or tagline.

Loudness: two-pass loudnorm to I=-16, TP=-1.5, LRA=11. Linear mode would have exceeded the true-peak limit, so loudnorm applied dynamic gain. Output: -15.7 LUFS, -1.5 dBTP, LRA 7.2.

## Encode settings

- **hero-720.mp4:** 4K source, lanczos scale to 1280x720, `libx264 -preset veryslow -crf 28.5 -tune film -g 48 -level 4.0`, `-an`. CRF 28 at `slow` came out at 2.84 MB, over the 2.6 MB target.
- **hero-720.webm:** `libsvtav1 -preset 6 -crf 40 -g 240`, `-an`.
- **hero-mobile.mp4:** Vertical source, scaled to 540x960, `libx264 -preset veryslow -crf 29`, `-an`. At `slow` it was 1.78 MB, over the 1.7 MB target.
- **hero-mobile.webm:** `libsvtav1 -preset 6 -crf 40`, `-an`. Kept because it is 23% smaller than the MP4.
- **trailer-1080.mp4 / trailer-720.mp4:** `libx264 -preset slow`, CRF 22 at L4.0 for 1080p and CRF 24 for 720p, AAC 128k at 48 kHz. The 1080p file is larger than the 10.5 MB in the discovery test because the 4K lanczos downscale keeps more detail. It only loads on click.
- **readaloud-clip.mp4:** VideoToolbox HDR-to-SDR as described above, `-fps_mode cfr -r 30`, `libx264 -preset slow -crf 27 -g 60`.

## Open items / caveats

1. **Is the reader Tiffany Wheeler? Unconfirmed.** The woman in IMG_3989 closely resembles `TiffanyWheeler-About2.jpg`: the same shoulder-length blonde hair, face shape and smile. I think it is very likely her, but it needs client confirmation, along with permission to use the clip on the site and in ads. Until then, don't label the section "Tiffany reads…".
2. **No captions.** Both the trailer and the read-aloud need a transcript turned into WebVTT, because no speech-to-text tool is available here.
3. **Repo weight.** These files add 31.5 MB to `public/`. Consider Git LFS, or moving the files to a CDN or Shopify Files when the Shopify cutover happens.
4. **Possible trims.** If a lighter hero is wanted, an 11.5s loop cut from 3.8 to 15.3s measured about 0.84 MB (H.264) in discovery testing.
