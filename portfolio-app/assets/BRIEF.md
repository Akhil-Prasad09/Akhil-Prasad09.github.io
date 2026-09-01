# Asset brief

Every slot below currently ships a code-generated poster or a live canvas. This
file is the upgrade path: generate a richer image externally, then drop it into
`public/media/` under the same filename.

House style, present in every prompt: abstract, azure #38BDF8 on near-black
(#09090b), cinematic, no text. One accent hue only. No purple, no rainbow
gradients, no logos, no lettering, no watermarks.

| Slot | File | Dimensions | Subject |
| --- | --- | --- | --- |
| Emotion Recognition | `public/media/emotion.webp` | 2400 x 1800 (4:3) | Row of face landmark meshes, one activated |
| DentalBot | `public/media/dentalbot.webp` | 2400 x 1800 (4:3) | Mirrored voice waveform under an amplitude envelope |
| Gesture Control | `public/media/gesture.webp` | 2400 x 1800 (4:3) | Hand landmark constellation, 21 tracked joints |
| Chat App | `public/media/chatapp.webp` | 2400 x 1800 (4:3) | Two message columns around an encrypted channel |
| GreenBasket | `public/media/greenbasket.webp` | 2400 x 1800 (4:3) | Grid of produce marks, one selected |
| Portrait | `public/media/portrait.webp` | 1600 x 1600 (1:1) | Editorial headshot |

Posters are 4:3 but the compact project cards crop to roughly 2:1 through the
middle, so keep the subject inside the central horizontal band and leave the top
and bottom sixths quiet.

---

## emotion.webp

```
Abstract data visualization of seven facial landmark meshes arranged in a single
horizontal row across a near-black field, each face reduced to a constellation of
small glowing points with no skin or features rendered, the fourth mesh in the row
lit brighter than the rest with a soft radial glow blooming behind it, azure #38BDF8
on #09090b, cinematic depth, shallow atmospheric haze, generous negative space above
and below the row, no text, no letters, no logos, no purple.
```

## dentalbot.webp

```
Abstract audio waveform rendered as fine vertical azure lines mirrored perfectly
above and below a horizontal center axis, contained by a smooth lens shaped amplitude
envelope that swells at the middle and tapers to points at both ends, thin consistent
strokes, near-black background, faint volumetric glow behind the loudest peak,
azure #38BDF8 on #09090b, cinematic, clinical precision, wide negative space,
no text, no letters, no logos, no purple.
```

## gesture.webp

```
Abstract hand skeleton drawn as a constellation: twenty one small glowing nodes
connected by thin straight lines forming an open palm with five splayed fingers,
fingertip nodes brighter and haloed, a thin circular tracking reticle around one
fingertip, no skin or flesh rendered, floating in dark empty space with a soft radial
glow behind the palm, azure #38BDF8 on #09090b, cinematic, motion capture aesthetic,
no text, no letters, no logos, no purple.
```

## chatapp.webp

```
Abstract encrypted messaging visual: two vertical columns of rounded rectangular
message plates facing each other across a dark gap, plates filled near-black with thin
azure edges and faint illegible symbol noise inside, a single geometric padlock icon of
clean thin strokes floating centered in the gap with a soft radial glow behind it, thin
dashed connection lines running from each column to the lock, azure #38BDF8 on #09090b,
cinematic, secure and minimal, no readable text, no letters, no logos, no purple.
```

## greenbasket.webp

```
Abstract grid of twelve simple geometric produce silhouettes arranged four across and
three down on a near-black field, each drawn as a clean thin outline in azure with no
fill and no shading, exactly one shape in the grid solid filled with bright azure and
lit by a soft radial glow behind it, precise alignment, consistent stroke weight,
generous margins, azure #38BDF8 on #09090b, cinematic, icon system aesthetic,
no text, no letters, no logos, no purple.
```


```
Abstract wide cinematic field of flowing neural filaments and drifting particles
sweeping across a near-black void, thin luminous azure threads bending in laminar
currents with depth of field falling off toward the edges, soft radial bloom at the
center, ultrawide 16:9 composition that stays calm at full bleed, azure #38BDF8 on
#09090b, cinematic, atmospheric, no text, no letters, no logos, no purple.
```

image. To use a still, swap the `<NeuralFlow />` element in
covering the container. The five posters and the portrait need no code change.

## portrait.webp

```
Editorial portrait photograph of a person against a near-black seamless background,
single soft key light from one side with a cool azure #38BDF8 rim light tracing the
shoulder and jaw, deep shadows, calm direct gaze, square 1:1 crop with the head in the
upper third, muted desaturated skin tones, cinematic, shot on 85mm at f2, no text,
no letters, no logos, no purple.
```

---

## Dropping in replacements

Save each file into `public/media/` using exactly the filename listed above, then
rebuild. The site picks them up unchanged: no code edit, no content edit, no
config change. The portrait slot probes its own URL at runtime, so it swaps from
the monogram tile to the photo as soon as the file exists.

To regenerate the code-drawn posters instead, edit
`src/components/media/posters/index.html` and run `node scripts/capture-posters.mjs`.
Open that file directly in a browser to eyeball all five at once, or append
`?slug=gesture` to isolate one.
