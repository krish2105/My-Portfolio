import { profile } from "../../data/portfolio";
import { heroFacts } from "../../lib/heroFacts";

/** Location · work authorisation · availability — the line recruiters screen on, right under the headline. */
const HeroFacts = () => (
  <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-wider text-[var(--text-2)]">
    {heroFacts(profile).map((fact, i) => (
      <li key={fact} className="flex items-center gap-3">
        {i > 0 && <span aria-hidden className="text-[var(--text-3)]">·</span>}
        <span>{fact}</span>
      </li>
    ))}
  </ul>
);

export default HeroFacts;
