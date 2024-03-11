import { SpellChainLightning } from "./library/ChainLightning";
import { SpellFireball } from "./library/Fireball";
import { Spellicebolt } from "./library/Icebolt";
import { SpellSkipTurn } from "./library/SkipTurn";

export class SpellLibrary {
    public static Skipturn = new SpellSkipTurn();
    public static Fireball = new SpellFireball();
    public static Icebolt = new Spellicebolt();
    public static ChainLightning = new SpellChainLightning();
    
    private constructor() {}
}