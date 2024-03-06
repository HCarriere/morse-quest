import { SpellChainLightning } from "./spells/ChainLightning";
import { SpellFireball } from "./spells/Fireball";
import { Spellicebolt } from "./spells/Icebolt";
import { SpellSkipTurn } from "./spells/SkipTurn";


export class SpellLibrary {
    public static Skipturn = new SpellSkipTurn();
    public static Fireball = new SpellFireball();
    public static Icebolt = new Spellicebolt();
    public static ChainLightning = new SpellChainLightning();
    
    private constructor() {}
}