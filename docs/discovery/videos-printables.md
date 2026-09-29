# Media catalog: videos, printable PDFs, animated GIF

Source folder: `/Users/ryanmata/Desktop/Arrowleaf Marketing/tiffany-wheeler/assets/media-library`. I didn't modify anything in the repo. All frames, thumbnails and test encodes are in the scratchpad at `/private/tmp/claude-501/-Users-ryanmata-Desktop-Arrowleaf-Marketing-tiffany-wheeler/86c2c9b5-128c-496e-bb63-b781462a7d36/scratchpad/`.

## 1. Videos

### 1.1 Probe results (observed)

| File | Size | Duration | Video | Audio | Other metadata |
|---|---|---|---|---|---|
| Horizontal-4k.mov | 172.9 MB | 30.33s | H.264 High, 3840x2160, 24fps, SDR bt709, ~45.6 Mbps | PCM s24le, 48k, 2ch | DaVinci Resolve export, 2024-11-10. **Master, 16:9** |
| Horizontal-1080.mov | 51.2 MB | 30.33s | H.264 High, 1920x1080, 24fps, ~13.5 Mbps | PCM s24le, 2ch | Resolve export, same edit as the 4K file |
| Horizontal-1080.m4v | 51.2 MB | 30.33s | same as above | same | **Byte-identical to Horizontal-1080.mov** (same MD5 `b3fdba1e…`). A renamed copy. |
| Vertical-1080.mov | 51.5 MB | 30.33s | H.264 High, 1080x1920, 24fps | PCM s24le, 2ch | Resolve export. **9:16 reframe of the same edit** (same 8 cut points, same audio) |
| silentvideo.mp4 | 8.1 MB | 30.22s | H.264 High, 1920x1080, ~2.15 Mbps, variable frame rate (timebase 120, average ~24fps) | **none** | VLC transcode, 2026-09-04. **The live site's current homepage background video** |
| video.m4v | 5.1 MB | 29.96s | **HEVC** Main, 1920x1080, ~1.23 Mbps | **MP2** audio, 44.1k | VLC transcode of Horizontal-1080 (cuts ~0.1s later, ~0.37s trimmed). HEVC plus MP2 plays poorly in browsers. **Don't use.** |
| IMG_3989.mov | 209.9 MB | 3:11.5 | HEVC 10-bit, stored 1920x1080 with rotation -90, so it **displays portrait 1080x1920**. 30fps, **HDR** (HLG / Dolby Vision profile 8.4) | AAC 44.1k, 2ch | iPhone 14, recorded 2024-11-07. Raw phone footage |

**Duplicates:**
- **Same file:** Horizontal-1080.mov and Horizontal-1080.m4v are the same file.
- **Same 30s edit:** Horizontal-4k, Horizontal-1080, video.m4v and silentvideo.mp4 are all one edit, with the Vertical file as its 9:16 version. Scene cuts are at 3.79, 7.63, 11.46, 15.29, 18.75, 22.42 and 27.63s.
- **silentvideo.mp4 differs slightly:** its first shot (0–3.8s) is the grandmother with four kids by the stairs, which also appears again at 7.6s. The masters open on the grandmother with two girls. Everything after 3.8s matches.

Only three sources are distinct: **Horizontal-4k.mov** (16:9 master), **Vertical-1080.mov** (9:16 master) and **IMG_3989.mov**.

### 1.2 Content

**The 30s edit** (frames in `videos/h1080/`, `h4k/`, `v1080/`, `silent/`, `videom4v/`, and one frame per shot in `*/shots.jpg`):

Polished lifestyle footage: families reading *A Nephite Christmas* in a bright, softly decorated Christmas living room (flocked mini trees, bottle-brush trees, a lit fireplace). The blue night-sky book cover with its title is clearly visible in several shots. There are no text overlays, logo, title card, end card or call to action; it is pure footage.

Shot list:
1. 0–3.8s: grandmother in a leather armchair with two little girls, slow move through foreground greenery.
2. 3.8–7.6s: mom and three kids sitting on the carpet by the fireplace, reading the book (cover visible).
3. 7.6–11.5s: grandmother with four kids in the armchair by the stairs.
4. 11.5–15.3s: the fireplace group, tighter.
5. 15.3–18.75s: close-up of a mom's finger pointing at an interior spread, two girls on a sofa.
6. 18.75–22.4s: a different young mom with a toddler boy on the floor, both laughing.
7. 22.4–27.6s: grandmother with two girls, one raising her hand.
8. 27.6–30.3s: wide shot of the fireplace family (closing shot).

The whole piece is Christmas-only, with no Easter content.

**IMG_3989.mov** (12 frames in `videos/img3989/sheet.jpg`):

A single static portrait shot. A blonde woman in a navy top sits in front of a fireplace decorated with a red "J…" letter sign (likely "JOY") and silver star cutouts. She reads *A Nephite Christmas* aloud to the camera page by page, from the cover through the final "Merry Christmas" spread, so the entire book appears in the video.

She looks like Tiffany Wheeler in `TiffanyWheeler-About2.jpg`. That is my inference, and it needs client confirmation.

### 1.3 Audio

There is no whisper, whisper-cpp or other speech-to-text tool installed, so I didn't transcribe anything. Everything below comes from ffmpeg measurements (volumedetect, silencedetect, EBU R128, band filters).

**30s edit** (identical measurements in the 4K, 1080 and Vertical files):
- Mean level -27.8 dB, peak -7.6 dB, integrated loudness **-24.4 LUFS** (quiet for web or social, which normally targets -14 to -16).
- The difference between left and right channels is -83 dB, so it is **effectively mono** (the same signal on both channels).
- Energy is concentrated in the speech band. Below 200 Hz measures -38 dB, 300–3400 Hz measures -29 dB, and above 6 kHz measures -51 dB.
- There are 11 gaps of 0.3–1.6s in 30s, several sitting right at shot cuts (3.0–4.1, 7.2–8.0, 11.2–11.7, 14.5–16.1, 18.9–19.2, 22.3–22.7s). The clip ends with 0.6s of silence.
- **Inference:** this is spoken audio, either a voice-over or the moms' live reading, not a music bed. Music would normally be wider in stereo, fuller across frequencies, and continuous. The mom in shot 2 is mid-speech on camera. **Needs a listen to confirm.**
- For ads and trailers, captions are needed either way, since Meta autoplays muted.

**IMG_3989:** mean -39.5 dB, integrated -35.4 LUFS (very quiet), 100 short silences in 191s. This is continuous read-aloud speech with natural pauses, matching her visibly moving mouth. It needs loudness normalization.

### 1.4 How the live site uses these (observed via curl)
- The homepage has a muted, looping, autoplaying `<video>` background (theme box 1800x700) with `silentvideo.mp4` as its source.
- The `/product/nephite-christmas/` page embeds **the raw 51 MB `Vertical-1080.mov`** (13.6 Mbps with uncompressed PCM audio) with `preload="auto"`. That is a serious page-weight and conversion problem, and the rebuild should fix it.

### 1.5 Recommendations

**(a) Muted autoplay hero loop:** encode from **Horizontal-4k.mov** (best source). Serve the vertical-derived version below 768px width, since most ad traffic is mobile.
- The full 30s loop works well: every shot is cut-based, so looping from the final wide shot back to the opening grandmother shot is a clean hard cut.
- Shorter option: 3.8–15.3s (fireplace family → grandmother with four kids → fireplace close). Tested at 0.84 MB.
- Poster frame: **t = 12.0s** (fireplace family, book cover legible). Tested at 185 KB for a 1920px JPG.

**(b) Product-page "watch the trailer" embed:** the same 30s edit from Horizontal-4k with audio, 1080p H.264 and AAC normalized to -16 LUFS. Use click-to-play with `preload="none"` (or `metadata`) plus the poster frame.
- Add a WebVTT caption file once the audio is transcribed.
- Consider an end card with the "Get Both Books" call to action.
- A separate "Hear Tiffany read it" section could use a **20–40s excerpt of IMG_3989**, such as the cover and first two spreads. Don't use the full 3:11: it gives away the whole book.

**(c) Vertical ads and social:**
- **Vertical-1080.mov** is the 9:16 master for Reels, Stories and TikTok (30s). For platform upload, send a high-quality H.264 file and let Meta re-encode it.
- **IMG_3989** is strong author-to-camera material for 9:16 ads. Cut 15–30s hooks such as "Did you know the Nephites saw the sign of Christ's birth?" and the cover reveal.
- IMG_3989 must be converted from HDR to SDR first, or it will look washed out or blown out on Android and in the Meta ad pipeline.

### 1.6 ffmpeg commands (sizes are from actual test encodes in `scratchpad/videos/test/`)

```bash
M="/Users/ryanmata/Desktop/Arrowleaf Marketing/tiffany-wheeler/assets/media-library"
H="$M/Horizontal-4k.mov"; V="$M/Vertical-1080.mov"

# --- (a) HERO: muted loop, 1280x720 ---
# H.264, full 30s -> 2.42 MB (tested)
ffmpeg -i "$H" -an -vf "scale=1280:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 28 -profile:v high -tune film -g 48 -movflags +faststart hero-720.mp4
# AV1 (SVT), full 30s -> 1.71 MB (tested); list first in <source>, type='video/webm; codecs="av01.0.05M.08"'
ffmpeg -i "$H" -an -vf "scale=1280:-2:flags=lanczos,format=yuv420p" \
  -c:v libsvtav1 -preset 6 -crf 40 -g 240 hero-720.webm
# optional VP9 WebM fallback
ffmpeg -i "$H" -an -vf "scale=1280:-2:flags=lanczos,format=yuv420p" \
  -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 hero-720.vp9.webm
# 1080p variant: CRF 30 -> 3.63 MB (over the 3 MB target); stay at 720p for the background
# Short loop 11.5s (shots 2-4) -> 0.84 MB (tested)
ffmpeg -ss 3.8 -t 11.5 -i "$H" -an -vf "scale=1280:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 28 -movflags +faststart hero-720-short.mp4
# Mobile portrait hero, 540x960 -> 1.51 MB (tested)
ffmpeg -i "$V" -an -vf "scale=540:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 29 -movflags +faststart hero-mobile-540x960.mp4
# Poster JPG (t=12s, cover legible) -> 185 KB; convert to AVIF/WebP afterwards or let next/image handle it
ffmpeg -ss 12 -i "$H" -frames:v 1 -vf "scale=1920:-2:flags=lanczos" -q:v 3 hero-poster.jpg
ffmpeg -ss 5.7 -i "$V" -frames:v 1 -vf "scale=1080:-2" -q:v 3 hero-mobile-poster.jpg

# --- (b) TRAILER with sound, 1080p -> 10.5 MB (tested) ---
ffmpeg -i "$H" -vf "scale=1920:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 22 -profile:v high \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 128k -movflags +faststart trailer-1080.mp4
# 720p variant for mobile: swap in scale=1280:-2, -crf 24
ffmpeg -i "$H" -vf "scale=1920:-2:flags=lanczos,format=yuv420p" -c:v libsvtav1 -preset 6 -crf 34 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a libopus -b:a 96k trailer-1080.webm

# --- (c) VERTICAL ads/social ---
# Upload master for Meta/TikTok (high quality; platform re-encodes), loudness -14 LUFS
ffmpeg -i "$V" -c:v libx264 -preset slow -crf 18 -profile:v high -pix_fmt yuv420p \
  -af "loudnorm=I=-14:TP=-1:LRA=11" -c:a aac -b:a 192k -ar 48000 -movflags +faststart vertical-ad-1080x1920.mp4
# Web embed of the vertical, 720x1280 -> 4.7 MB (tested)
ffmpeg -i "$V" -vf "scale=720:-2:flags=lanczos,format=yuv420p" -c:v libx264 -preset slow -crf 24 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 128k -movflags +faststart vertical-720.mp4

# --- IMG_3989 (HDR HLG, portrait via rotation flag; ffmpeg auto-rotates) ---
# Preferred HDR->SDR tone map (needs an ffmpeg build with zimg; the local Homebrew ffmpeg 8.1.1 has NO zscale):
ffmpeg -ss 0 -t 30 -i "$M/IMG_3989.mov" -vf "zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,\
tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p,scale=720:-2" \
  -c:v libx264 -preset slow -crf 26 -r 30 -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 128k \
  -movflags +faststart readaloud-clip-720.mp4
# Fallback that works on this machine (colour-matrix conversion only; slightly flat, acceptable): 60s -> 11.7 MB at CRF 24; use CRF 27-28 for web
ffmpeg -ss 30 -t 60 -i "$M/IMG_3989.mov" -vf "scale=720:-2:in_color_matrix=bt2020:out_color_matrix=bt709,format=yuv420p" \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -c:v libx264 -preset slow -crf 27 \
  -af "loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 128k -movflags +faststart readaloud-60s-720.mp4
# Alternative: macOS AVFoundation (/usr/bin/avconvert), e.g. -p Preset1920x1080 --start 30 --duration 30 (SDR output not verified)
```

Suggested hero markup: `<video autoplay muted loop playsinline preload="metadata" poster=…>` with the AV1 WebM source first and the H.264 MP4 fallback second. Use a `<picture>`-style media-query swap, or two `<video>` elements toggled by CSS, to switch between the 16:9 and 9:16 versions. Respect `prefers-reduced-motion` by showing only the poster.

## 2. Printable PDFs

Page thumbnails (40 dpi) are in `scratchpad/printables/` (`singles.jpg`, `nativity.jpg`, `Nativity-01..12.jpg`). For comparison, I also rendered the 29-page `RGB-Nephite-Christmas-Coloring-and-Activity-Book-With-Cover.pdf` (`coloringbook.jpg`).

| File | Pages / size | Made with / date | Content | Live-site status (curl) |
|---|---|---|---|---|
| **Cube-Dove.pdf** | 1 page, US Letter, 527 KB | Illustrator 29.5, 2025-06-19 | Papercraft: "Make Your Own Cubed Dove". A grey cube-net bird with wings, eyes and beak, plus 3 lines of cut/fold/glue instructions. | **Free**: a direct download link on `/home/freebies/` (no email capture) |
| **Family-Praying.pdf** | 1 page, Letter, 947 KB | Illustrator, 2025-06-20; PDF title "Page 15" | Coloring page: Nephite mother, girl and boy (in a red headband) praying, with more figures in the foreground and a dove tapestry on the wall. Ornate Mesoamerican-style border with stars and suns. Printed page number 15. | **Free**, same freebies page. **Same art as page 15 of the paid Coloring and Activity Book** |
| **Nephi-preaching.pdf** | 1 page, Letter, 1.1 MB | Illustrator, 2025-06-23 | Coloring page: bearded prophet Nephi in a robe, arms raised, preaching from a stone temple doorway with geometric-patterned steps. Ornate border, printed page number 13. | **Free**, same freebies page. I didn't find it in the 29-page coloring book, where page 13 is a different page (low-res check) |
| **Origami-Dove.pdf** | 1 page, Letter, 2.0 MB | Illustrator, 2025-06-24 | Illustrated step-by-step origami dove diagram (about 10 steps) inside an ornate black-and-white border, titled "Origami Dove". | **Free**, same freebies page |
| **Full-Nativity-Kit.pdf** | **12 pages**, 583x799 pt (a non-standard size, about 8.1x11.1 in), 2.0 MB | Acrobat 25, 2025-06-25 | Color-your-own stand-up nativity set. Page 1: five assembly steps (print on cardstock, color, cut, make a paper-ring stand, insert). Figures: baby Jesus in the manger, Mary, Joseph, a Nephite boy and man praying, sleeping or kneeling figures, a Nephite temple/pyramid backdrop with two suns and a moon, sheep, the star, a shepherd, an ox, a donkey, three wise men on camels. Pages 11–12 are ruled strip templates for the stands. | **Paid product**: "Nephite Christmas Nativity Craft (PDF download)", $2.99, currently on sale for $2.69, WooCommerce product 1248. Not linked from the freebies page |

**Free or paid:**
- **Free on the current site:** Cube-Dove, Family-Praying, Nephi-preaching and Origami-Dove are ungated downloads under "Nephite Christmas Freebies". The same page also offers free Easter "Digital Wallpaper Downloads" (Crosses, He-is-Risen, Jesus, Mary and Tomb wallpaper JPGs), but there are no Easter printable PDFs.
- **Paid:** Full-Nativity-Kit is a $2.99 digital product.
- **Recommendation:** use the four free PDFs as an **email or SMS lead magnet** ("Free Nephite Christmas activity pack"), bundled into one ZIP or PDF with a coloring-book upsell. Keep the nativity kit as a paid add-on or order bump, or a gift-with-purchase. The live site already runs "Free Digital Bundle with $75 purchase" and "Free Ornament with $50 purchase" promotions.
- **Point to confirm:** Family-Praying is a page from the paid coloring book. Giving it away works as a sample page, but the client should confirm that's intended.

## 3. Animated GIF: Animated-cropped-waving-boy.gif

**Specs (observed):**
- 600x600, **41 frames**, 100 ms each, so **10 fps and a 4.1s loop**.
- 1.62 MB, 99-color palette, **transparent background**.

**Content:** the book's Nephite boy character in cartoon style (brown hair, red tied headband, teal sleeveless top, holding a pencil). He waves, rests his chin on his fist with eyes closed as if thinking, then smiles and waves again. It is the same character as the coloring-book cover ("Join me for a Nephite Christmas Adventure!"). Contact sheet: `scratchpad/printables/gif_sheet.png`.

**Live usage:** a circular image block on `/product/nephite-christmas/`, loaded as a CSS background-image.

**Recommendation:** a friendly mascot for the hero, cart drawer or empty states, or next to the lead-magnet form. Convert it to animated WebP with transparency, which comes out at **0.71 MB**, 56% smaller (tested):

```bash
gif2webp -q 80 -m 6 -mixed "$M/Animated-cropped-waving-boy.gif" -o waving-boy.webp
```

A transparent video format (VP9 WebM plus HEVC-with-alpha for Safari) would cut the size further.

## 4. Questions for the client
1. Is the woman in IMG_3989 Tiffany? Can we use clips of her reading the book in ads and on the site?
2. What exactly is the 30s edit's audio: voice-over, the families reading, or ambient sound? It needs a transcript for captions. Is there a music or VO version, or an end-card version, from the videographer (the files are DaVinci Resolve exports)?
3. Is any Easter video footage coming? Every current video is Christmas-only.
4. Should the free printables be email-gated as a lead magnet on the new site, where they are currently ungated?