import { Skill, SkillIronSkin } from "@game/content/skills";
import { Spell, SpellChainLightning, SpellCreateShield, SpellFireball, SpellIcebolt } from "@game/content/spells";
import { Class } from "../Class";

export class ClassElementalSorcerer extends Class {
    public name: string = 'Elemental Sorcerer';
    public icon = {text: "〄", color: '#dddddd'};
    public baseHealth: number = 100;
    public initialSpells: Spell[] = [new SpellFireball(300), new SpellChainLightning(), new SpellIcebolt(), new SpellCreateShield()];
    public spells: Spell[][] = [
        [new SpellFireball(), new SpellChainLightning(), new SpellIcebolt()],
        [new SpellFireball(), new SpellChainLightning(), new SpellIcebolt()],
    ];
    public skills: Skill[][] = [
        [new SkillIronSkin()],
        [],
        [new SkillIronSkin()],
    ];
}