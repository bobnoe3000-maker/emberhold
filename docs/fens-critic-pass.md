# The Fens: critic passes (M8)

**Status:** In progress (2026-10-04). Each M8 slice that adds art, words or quests ends with its pass here
([m8-plan.md](./m8-plan.md)); slice 12 gathers them. Captures are at in-game scale on a 390 × 844 phone, on the
manual clock (`?dev&manual&notitle&scene=…&region=…&tod=…`), measured on the world between the top HUD and the
service bar (12–62 % of the frame's height).

## Pass 1: art, slices 1–2 (the Fens overland and Saltmere)

![The Vale and the Fens, by day and at dusk](img/fens/contact-vale-fens.jpg)

### Measured

| Frame | Luma, Vale | Luma, Fens | Δ | Contrast (σ), Vale | Contrast (σ), Fens |
|---|---|---|---|---|---|
| Town, day | 71.8 | 65.5 | −9 % | 32.6 | 21.2 |
| Town, dusk | 41.0 | 34.9 | −15 % | 29.8 | 19.3 |
| Overland, day | 70.5 | 63.4 | −10 % | 24.9 | 25.5 |
| Overland, dusk | 39.6 | 35.5 | −10 % | 20.6 | 24.0 |

The Fens sit a tenth darker than the Vale, and Saltmere a third flatter: grey water and wet timber under the same
sky. That is the owner's direction (keep it dusky and gloomy), and the services, the hero and the boardwalks still
read at dusk. Nothing was brightened.

### Found and fixed in this pass

| Finding | Fix |
|---|---|
| Saltmere's service bar offered all five services; two exist | The bar is built from the world's services (`src/ui/townmenu.js`); the sim refuses the rest by name ("Saltmere has no inn", `heroes.js`, `smith.js`) |
| The reed beds were busy: a tuft on most tiles, the darkest tone at the peat's edge | Reed density 0.55 on a mere's fringe and 0.16 in the open, two tones lighter (`outdoorpaint.js` `marsh()`) |
| The canal read as a running river: the Vale's water with its flow streaks | Fens water is still bog with a duckweed sheen; the canal's banks are a broken stone kerb (`canal()`, `bank()`) |
| On the overland the hero arrived hidden behind Saltmere's stilt houses | The boardwalk comes in from the town's front (south-east), and the arrival stands on it (`FENS.salt + 16.5, 6.5`) |
| Saltmere's way out sat past the forest ring's hard edge | Moved inside it (x 136–146); the arrival at 128.5 |
| The square's planks each ran its full width, one board 40 tiles long | Boards 4.2 tiles long with staggered butt joints (`deck()`; the plaza's cross-axis coordinate in `groundAt`) |

![The deck square before and after](img/fens/deck-before-after.jpg)

The Vale paid for the canal road: it cut the south-west wood's clump, and the walked map's tree cover fell from
25.1 % to 24.9 % (the woods test asks for 25–35 %). Oaks now line the road's verges every 6 tiles, their crowns closing
over the wood's edge: **25.2 %**.

### Still open

- **Saltmere has nobody in it.** Its people come with Act II (slice 8): Mother Agnes at the chapel, the Drowned
  Eel's keeper, eel-men on the boardwalks.
- **Marsh-lights** (plan slice 2) move to slice 4: they want a drifting light the renderer has no path for yet,
  and the bog-witch's lantern needs the same thing.
- **At night the hero is drawn as a pink stand-in** after 120 manual frames, in the Vale too. It predates M8.
  Logged for a renderer pass, not fixed here.
- Saltmere's contrast (σ 21 against the Vale's 33) is the flat deck's. If the square reads as a floor rather than
  a place once its people stand on it, the next pass adds coiled rope, nets drying on rails and a moored punt to
  break it up.
