import { EngineObject } from "@game/core/EngineObject";
import { ModaleContent } from "@game/core/Modale";
import { MapEdition } from "../MapEdition";
import { Button } from "@game/interface/components/Button";

export class MapSelectionModale extends ModaleContent {
    private btnPerLine: number;
    private nbBtnLines: number;
    private pages: EngineObject[][];
    private btnWidth: number;
    private btnHeight: number;
    private btnPadding: number;
    protected initContent(): void {
        this.btnPadding = 15;
        this.btnHeight = 60;
        this.btnWidth = 240;
        this.btnPerLine = Math.floor(this.width / (this.btnWidth + 2 * this.btnPadding));
        this.nbBtnLines = Math.floor(this.height / (this.btnHeight + 2 * this.btnPadding));
        let mapIds = MapEdition.getMapList();
        let hasPagination = mapIds.length > this.btnPerLine * this.nbBtnLines - 1; // -1 for 'new map' button
        this.pages = [];
        if (hasPagination) {
            let btnPerPage = (this.btnPerLine - 2) * this.nbBtnLines;
            let nbPages = Math.ceil(mapIds.length / btnPerPage);
            if (nbPages == mapIds.length / btnPerPage) {
                nbPages++; // for 'new map' button
            }
            for (let index = 0; index < nbPages; index++) {
                this.pages[index] = this.createPage(mapIds.slice(index * btnPerPage, (index + 1) * btnPerPage), this.btnPerLine - 2, this.btnWidth + 2 * this.btnPadding, 0);
                if (index == nbPages - 1) this.addNewMapButton(nbPages - 1, this.btnPerLine - 2, this.btnWidth + 2 * this.btnPadding, 0);
                if (index > 0) this.pages[index].push(new Button(
                    this.x + this.btnPadding,
                    this.y + this.btnPadding,
                    this.btnWidth,
                    this.btnHeight,
                    () => {
                        this.gotoPage(index - 1);
                    },
                    {
                        text: '<',
                        strokeColor: 'white'
                    }
                ));
                if (index < nbPages - 1) this.pages[index].push(new Button(
                    this.x + this.btnPadding + (this.btnPerLine - 1) * (this.btnWidth + 2 * this.btnPadding),
                    this.y + this.btnPadding,
                    this.btnWidth,
                    this.btnHeight,
                    () => {
                        this.gotoPage(index + 1);
                    },
                    {
                        text: '>',
                        strokeColor: 'white'
                    }
                ));
            }
        } else {
            this.pages[0] = this.createPage(mapIds, this.btnPerLine, 0, 0);
            this.addNewMapButton(0, this.btnPerLine, 0, 0);
        }
        this.gotoPage(0);
    }
    protected displayContent(): void {
        this.modaleElements.forEach(elem => elem.display());
    }
    private createPage(ids: string[], nbPerLine: number, paddingLeft: number, paddingTop: number): Button[] {
        let page: Button[] = [];
        let i = 0;
        let j = 0;
        ids.forEach(id => {
            page.push(new Button(
                this.x + i * (this.btnWidth + 2 * this.btnPadding) + this.btnPadding + paddingLeft,
                this.y + j * (this.btnHeight + 2 * this.btnPadding) + this.btnPadding + paddingTop,
                this.btnWidth,
                this.btnHeight,
                () => {
                    // Select id
                },
                {
                    text: id,
                    strokeColor: 'white'
                }
            ));
            i++;
            if (i > nbPerLine - 1) {
                i = 0;
                j++;
            }
        });
        return page;
    }
    private gotoPage(n: number): void {
        this.modaleElements = this.pages[n];
    }
    private addNewMapButton(page: number, nbPerLine: number, paddingLeft: number, paddingTop: number): void {
        let newMapBtnIndex = this.pages[page].length;
        let newMapBtnI = newMapBtnIndex % nbPerLine;
        let newMapBtnJ = Math.floor( newMapBtnIndex / nbPerLine);
        this.pages[page].push(new Button(
            this.x + newMapBtnI * (this.btnWidth + 2 * this.btnPadding) + this.btnPadding + paddingLeft,
            this.y + newMapBtnJ * (this.btnHeight + 2 * this.btnPadding) + this.btnPadding + paddingTop,
            this.btnWidth,
            this.btnHeight,
            () => {
                // Add New Map
            },
            {
                text: 'Nouvelle Map',
                strokeColor: 'white'
            }
        ));
    }
}