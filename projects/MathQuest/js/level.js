class Level {
    constructor() {
        this.layout = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 0, 4, 0, 0, 1, 0, 5, 0, 0, 1, 0, 4, 0, 0, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
        this.tileset = null;
    }

    async loadTileset(tilesetPath) {
        try {
            const response = await fetch(tilesetPath);
            this.tileset = await response.json();
        } catch (error) {
            console.error("Error loading tileset:", error);
        }
    }

    playerSpawn = {x:0, y:0};
    enemySpawns = [];
    studyStationSpawns = [];

    draw(ctx) {
        if (!this.tileset) {
            console.warn("Tileset not loaded. Call loadTileset() first.");
            return;
        }

        const tileWidth = this.tileset.tilewidth;
        const tileHeight = this.tileset.tileheight;

        this.playerSpawn = null;
        this.enemySpawns = [];
        this.studyStationSpawns = [];

        for (let row = 0; row < this.layout.length; row++) {
            for (let col = 0; col < this.layout[row].length; col++) {
                const tileType = this.layout[row][col];

                switch (tileType) {
                    case 3: // Player spawn
                        this.playerSpawn = { x: col * tileWidth, y: row * tileHeight };
                        break;
                    case 4: // Enemy spawn
                        this.enemySpawns.push({ x: col * tileWidth, y: row * tileHeight });
                        break;
                    case 5: // Study station spawn
                        this.studyStationSpawns.push({ x: col * tileWidth, y: row * tileHeight });
                        break;
                    default:
                        if (tileType > 0 && this.tileset.tiles[tileType]) {
                            const tile = this.tileset.tiles[tileType];
                            ctx.fillStyle = tile.color;
                            ctx.fillRect(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
                        }
                        break;
                }
            }
        console.log('Level draw completed');
        }
    }

    checkCollision(x, y, width, height) {
        if (!this.tileset) {
            console.warn("Tileset not loaded. Call loadTileset() first.");
            return false;
        }

        const tileWidth = this.tileset.tilewidth;
        const tileHeight = this.tileset.tileheight;

        const startRow = Math.floor(y / tileHeight);
        const endRow = Math.ceil((y + height) / tileHeight);
        const startCol = Math.floor(x / tileWidth);
        const endCol = Math.ceil((x + width) / tileWidth);

        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                if (row < 0 || row >= this.layout.length || col < 0 || col >= this.layout[row].length) {
                    continue;
                }

                const tileType = this.layout[row][col];
                if (tileType > 0) { // Assuming tileType 0 is empty space
                    const tileX = col * tileWidth;
                    const tileY = row * tileHeight;

                    // Bounding box collision check
                    if (x < tileX + tileWidth &&
                        x + width > tileX &&
                        y < tileY + tileHeight &&
                        y + height > tileY) {
                        return true; // Collision detected
                    }
                }
            }
        }

        return false; // No collision
    }
}