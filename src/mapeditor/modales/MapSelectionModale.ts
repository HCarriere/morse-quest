import { Modale, ModaleContent } from "@game/core/Modale";
import { MapManager } from "../MapManager";
import { Grid } from "../components/Grid";
import { ButtonStyle } from "@game/interface/components/Button";
import { InputModale } from "./InputModale";

export class MapSelectionModale extends ModaleContent {
    private btnPerLine: number;
    private nbBtnLines: number;
    private pages: Grid[];
    private btnWidth: number;
    private btnHeight: number;
    private btnPadding: number;
    private currentPage: number;
    private btnStyle: ButtonStyle;
    private deactivatedBtnColor: string;
    protected initContent(): void {
        this.btnPadding = 10;
        this.btnHeight = 50;
        this.btnWidth = 200;
        this.btnPerLine = Math.floor(this.width / this.gridCellWidth);
        this.nbBtnLines = Math.floor(this.height / this.gridCellHeight);
        this.btnStyle = {
            strokeColor: 'white',
            textSize: 20,
            color: 'white',
            colorHover: 'grey',
            textColor: 'black'
        };
        this.deactivatedBtnColor = 'grey';
        this.rebuildPages();
        this.gotoPage(0);
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
        let mapIds = MapManager.getMapList();
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
                        ...this.btnStyle,
                        text: '<'
                    }
                );
                if (index < nbPages - 1) this.pages[index].addButton(
                    this.btnPerLine - 1,
                    0,
                    () => {
                        this.gotoPage(index + 1);
                    },
                    {
                        ...this.btnStyle,
                        text: '>'
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
                    if (id != MapManager.currentMapId) {
                        MapManager.loadMap(id);
                        Modale.closeModale();
                    }
                },
                {
                    ...this.btnStyle,
                    text: id,
                    color: id != MapManager.currentMapId ? this.btnStyle.color : this.deactivatedBtnColor,
                    colorHover: id != MapManager.currentMapId && this.btnStyle.colorHover
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
                Modale.openModale(new InputModale('Id de la nouvelle map', (value: string) => {
                    console.log('New map id', value);
                    // Add New Map
                }));
            },
            {
                ...this.btnStyle,
                text: 'Nouvelle Map'
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