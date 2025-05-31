import { Skill } from "@game/content/skills";
import { SpellIronGolemInvocation, SpellScrewSplinters, Spell, SpellBoltStorm } from "@game/content/spells";
import { Class } from "../Class";

export class ClassMetalomancer extends Class {
    public name: string = 'Metalomancer';
    public icon = {text: "🜝", color: '#757575'};
    public baseHealth: number = 100;
    public initialSpells: Spell[] = [new SpellIronGolemInvocation(), new SpellScrewSplinters(), new SpellBoltStorm()];
    public spells: Spell[][] = [];
    public skills: Skill[][] = [];
}