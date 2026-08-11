# Luxembourgish content rules

- Use LOD.lu as the source of truth for every Luxembourgish word, spelling, sense, and lexical translation added to this project.
- Russian translations must be derived from the matching official LOD definition (LOD itself does not provide Russian).
- Audio must come only from the matching LOD entry's official `audioFiles.aac` URL. Never use browser speech synthesis, a German voice, or another third-party voice as a fallback.
- Do not present a headword recording as audio for a complete example sentence. If LOD has no recording for the exact phrase, keep the phrase without audio and make the unavailable state clear.
- Store the verified LOD article ID with each vocabulary item and link back to `https://lod.lu/artikel/{LOD_ID}`.
- When a user supplies a phrase, preserve its intended meaning but normalize Luxembourgish spelling against LOD before adding it.

