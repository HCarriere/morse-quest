import { ModaleContent } from "@game/core/Modale";
import { MapEdition } from "../MapEdition";
import { Grid } from "../components/Grid";

export class MapSelectionModale extends ModaleContent {
    private btnPerLine: number;
    private nbBtnLines: number;
    private pages: Grid[];
    private btnWidth: number;
    private btnHeight: number;
    private btnPadding: number;
    private currentPage: number;
    protected initContent(): void {
        this.btnPadding = 10;
        this.btnHeight = 50;
        this.btnWidth = 200;
        this.btnPerLine = Math.floor(this.width / this.gridCellWidth);
        this.nbBtnLines = Math.floor(this.height / this.gridCellHeight);
        this.rebuildPages();
        this.gotoPage(0);
    }
    protected displayContent(): void {
        this.modaleElements.forEach(elem => elem.display());
    }
    protected resizeContent(): void {
        let newBtnPerLine = Math.floor(this.width / this.gridCellWidth);
        let newNbBtnLines = Math.floor(this.height / this.gridCellHeight);
        if (newBtnPerLine != this.btnPerLine || newNbBtnLines != this.nbBtnLines) {
            this.btnPerLine = newBtnPerLine;
            this.nbBtnLines = newNbBtnLines;
            this.rebuildPages();
            this.gotoPage(this.currentPage);
        } else {
            this.pages.forEach(page => page.recalculatePosition(this.x, this.y, this.width, this.height));
        }
    }
    private rebuildPages(): void {
        let mapIds = MapEdition.getMapList();
        let hasPagination = mapIds.length > this.btnPerLine * this.nbBtnLines - 1; // -1 for 'new map' button
        this.pages = [];
        if (this.btnPerLine < 1 || this.nbBtnLines < 1 || (hasPagination && this.btnPerLine < 3)) return;
        if (hasPagination) {
            let btnPerPage = (this.btnPerLine - 2) * this.nbBtnLines;
            let nbPages = Math.ceil(mapIds.length / btnPerPage);
            if (nbPages == mapIds.length / btnPerPage) {
                nbPages++; // for 'new map' button
            }
            for (let index = 0; index < nbPages; index++) {
                this.pages[index] = this.createPage(mapIds.slice(index * btnPerPage, (index + 1) * btnPerPage), this.btnPerLine - 2, 1, 0);
                if (index == nbPages - 1) this.addNewMapButton(nbPages - 1, this.btnPerLine - 2, this.nbBtnLines, 1, 0);
                if (index > 0) this.pages[index].addButton(
                    0,
                    0,
                    () => {
                        this.gotoPage(index - 1);
                    },
                    {
                        text: '<',
                        strokeColor: 'white',
                        textSize: 20
                    }
                );
                if (index < nbPages - 1) this.pages[index].addButton(
                    this.btnPerLine - 1,
                    0,
                    () => {
                        this.gotoPage(index + 1);
                    },
                    {
                        text: '>',
                        strokeColor: 'white',
                        textSize: 20
                    }
                );
            }
        } else {
            this.pages[0] = this.createPage(mapIds, this.btnPerLine, 0, 0);
            this.addNewMapButton(0, this.btnPerLine, this.nbBtnLines, 0, 0);
        }
    }
    private createPage(ids: string[], nbPerLine: number, ignoreCols: number, ignoreRows: number): Grid {
        let page: Grid = new Grid(this.x, this.y, this.width, this.height, this.btnWidth, this.btnHeight, this.btnPadding, this.btnPadding);
        let i = 0;
        let j = 0;
        ids.forEach(id => {
            page.addButton(
                i + ignoreCols,
                j + ignoreRows,
                () => {
                    // Select id
                },
                {
                    text: id,
                    strokeColor: 'white',
                    textSize: 20
                }
            );
            i++;
            if (i > nbPerLine - 1) {
                i = 0;
                j++;
            }
        });
        return page;
    }
    private gotoPage(n: number): void {
        if (this.pages.length == 0) {
            this.modaleElements = [];
            return;
        }
        if (n < 0) n = 0;
        if (n > this.pages.length - 1) n = this.pages.length - 1;
        this.currentPage = n;
        this.modaleElements = this.pages[n].getEngineObjects();
    }
    private addNewMapButton(page: number, nbPerLine: number, nbLines, ignoreCols: number, ignoreRows: number): void {
        let newMapBtnIndex = this.pages[page].getNbNonEmptyCellsInRange(ignoreCols, ignoreRows, ignoreCols + nbPerLine, ignoreRows + nbLines);
        let newMapBtnI = newMapBtnIndex % nbPerLine;
        let newMapBtnJ = Math.floor( newMapBtnIndex / nbPerLine);
        this.pages[page].addButton(
            newMapBtnI + ignoreCols,
            newMapBtnJ + ignoreRows,
            () => {
                // Add New Map
            },
            {
                text: 'Nouvelle Map',
                strokeColor: 'white',
                textSize: 20
            }
        );
    }
    private get gridCellWidth(): number {
        return this.btnWidth + 2 * this.btnPadding;
    }
    private get gridCellHeight(): number {
        return this.btnHeight + 2 * this.btnPadding;
    }
}