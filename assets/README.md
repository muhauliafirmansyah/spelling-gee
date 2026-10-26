# Word illustration assets

88 original flat SVG illustrations for the school spelling bank. These are content assets; the game has not been built.

- [Review all images](word-gallery.html).
- [Compact style preview](previews/style-overview.png).
- Contact sheets: [1–22](previews/words-01.png), [23–44](previews/words-02.png), [45–66](previews/words-03.png), [67–88](previews/words-04.png).
- [Image metadata](../content/word-images.json).
- [Word CSV](../content/school-words.csv).

## Art direction

A simple educational-app style: bold rounded geometry, friendly faces, broad flat colour areas, light ground shadows and generous empty space. Colours include leaf green, sky blue, purple, warm yellow, orange and coral red. The individual SVGs have no visible English labels.

Every SVG is 256 × 256 with viewBox 0 0 256 256 and a transparent background. Shapes remain editable in a vector editor. No raster images, font-dependent lettering, scripts, external assets or rendering filters are used. Indonesian title and description elements provide accessible metadata.

## Using the images

Read image_path, image_alt and image_requires_context from the word CSV. Paths are relative to the project root. Parse image_requires_context explicitly as true or false.

When the image flag is true, pair the illustration with target-identifying English audio, an Indonesian meaning or a suitable spoken sentence. Respect the separate tricky-part context_required flag as well. A false image flag means the illustration is a candidate for picture practice; it is not proof that every child will name the object uniquely.

Use individual SVGs for the child-facing task. The review gallery and PNG sheets show English captions and must not be used as challenge images.

Some scenes deliberately require context: parent/grandfather/niece are relationships, might is a modal meaning, and peaceful/graceful/gorgeous are qualities. Sofa and couch use the same illustration because they share the pictured meaning. Audio distinguishes their target spellings.

## Editing and regeneration

The drawing definitions and metadata are in [generate-word-images.mjs](../tools/generate-word-images.mjs). Run node tools/generate-word-images.mjs from the project root to regenerate all SVGs, the manifest and the HTML gallery. The script uses standard Node.js modules only. It verifies that the illustration keys match the 88 current school words.

Regeneration overwrites generated SVGs and the gallery. Make lasting drawing changes in the generator. The PNG sheets are rendered review snapshots; refresh them after artwork changes. Synchronise the word CSV's image fields if paths, descriptions or context flags change.

## Validation performed

All 88 individual SVGs were rasterised for review. The four sheets cover the complete bank. Files were checked for valid renderability, visible bounds, a consistent viewBox, text-free artwork and absence of external or raster content. Every word has a valid image link. CSV round-trip checks preserve all earlier spelling, sentence, translation, chunk and distractor fields.
