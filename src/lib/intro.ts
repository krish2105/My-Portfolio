export const INTRO_SEEN_KEY = "intro-seen";

type SimpleStorage = Pick<Storage, "getItem" | "setItem">;
interface IntroEnv {
  reducedMotion: boolean;
  storage: SimpleStorage | null;
}

/**
 * Read-only check: should the full-screen brand intro play? It's a nice first impression but it hides the
 * page, so it runs once per browser session — not on every load, reload or return visit — and never under
 * prefers-reduced-motion. Side-effect free so it can be evaluated during the first render (deciding *before*
 * paint avoids flashing the overlay on repeat visits). Storage failures (private mode) degrade to "play".
 */
export const peekShouldPlayIntro = ({ reducedMotion, storage }: IntroEnv): boolean => {
  if (reducedMotion) return false;
  try {
    return !storage?.getItem(INTRO_SEEN_KEY);
  } catch {
    return true;
  }
};

/** Record that the intro played this session. Never throws. */
export const markIntroPlayed = (storage: SimpleStorage | null): void => {
  try {
    storage?.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* storage unavailable — the intro will simply play again next load */
  }
};

/** Convenience: peek, and if it should play, mark it as played. */
export const shouldPlayIntro = (env: IntroEnv): boolean => {
  const play = peekShouldPlayIntro(env);
  if (play) markIntroPlayed(env.storage);
  return play;
};
