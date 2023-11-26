const VOID = 'xx &#x7a7a xx';
const WIND = '-- &#x6c34 --';
const EARTH = '.. &#x5730 ..';
const FIRE = '^^ &#x706b ^^';
const WATER = '~~ &#x98a8 ~~';
const DRAGON = '~&gt; &#x1f409; &lt;~';

const TILE_CLASSES = {
  [VOID]: 'void',
  [WIND]: 'wind',
  [EARTH]: 'earth',
  [FIRE]: 'fire',
  [WATER]: 'water',
  [DRAGON]: 'dragon',
}

const LANDSCAPES = {
  peak: [
    [ 2, 2, 2, 2, 2 ],
    [ 2, 3, 3, 3, 2 ],
    [ 2, 3, 4, 3, 2 ],
    [ 2, 3, 3, 3, 2 ],
    [ 2, 2, 2, 2, 2 ],
  ],
  waves: [
    [ 2, 3, 2, 3, 2 ],
    [ 2, 3, 2, 3, 2 ],
    [ 2, 3, 2, 3, 2 ],
    [ 2, 3, 2, 3, 2 ],
    [ 2, 3, 2, 3, 2 ],
  ],
  mesa: [
    [ 1, 2, 1, 2, 1 ],
    [ 2, 4, 4, 4, 2 ],
    [ 1, 4, 4, 4, 1 ],
    [ 2, 4, 4, 4, 2 ],
    [ 1, 2, 1, 2, 1 ],
  ],
  lake: [
    [ 3, 3, 3, 3, 3 ],
    [ 3, 2, 1, 2, 3 ],
    [ 3, 1, 0, 1, 3 ],
    [ 3, 2, 1, 2, 3 ],
    [ 3, 3, 3, 3, 3 ],
  ],
  hill: [
    [ 1, 3, 4, 3, 1 ],
    [ 1, 3, 4, 3, 1 ],
    [ 1, 3, 4, 3, 1 ],
    [ 1, 3, 4, 3, 1 ],
    [ 1, 3, 4, 3, 1 ],
  ],
};


class Gorinto
{
  constructor(landscape, fifthPlayer, dragons) {
    const allTiles = new Array(100);
    allTiles.fill(VOID, 0, 20);
    allTiles.fill(WIND, 20, 40);
    allTiles.fill(EARTH, 40, 60);
    allTiles.fill(FIRE, 60, 80);
    allTiles.fill(WATER, 80, 100);
    if (fifthPlayer) {
      for (let i = 0; i < 5; ++i) {
        allTiles.push(VOID, WIND, EARTH, FIRE, WATER);
      }
    }
    if (dragons) {
      allTiles.push(DRAGON, DRAGON, DRAGON, DRAGON, DRAGON);
    }

    this.bag = this.shuffle(allTiles);
    this.landscape = Array.from(LANDSCAPES[landscape]);
  }

  shuffle(tiles) {
    let currentIndex = tiles.length;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

      // Pick a remaining element.
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [tiles[currentIndex], tiles[randomIndex]] = [
        tiles[randomIndex], tiles[currentIndex]];
    }

    return tiles;
  }

  draw() {
    return this.bag.pop();
  }

  static populateBoard() {
    let landscape = document.querySelector('#board-landscape');
    let landscapeValue = landscape.options[landscape.selectedIndex].value;
    let dragonExpansion = document.querySelector('#dragon-chk');
    let fifthPlayerExpansion = document.querySelector('#fivep-chk');

    const g = new Gorinto(landscapeValue.toLowerCase(),
                          fifthPlayerExpansion.checked,
                          dragonExpansion.checked);

    const renderTile = (t) => {
      return `<div class="tile ${TILE_CLASSES[t]}">${t}</div>`
    }

    let rows = document.querySelectorAll('tr[data-row]');
    rows.forEach((r) => {
      let rIndex = parseInt(r.dataset.row, 10) - 1;
      let cols = r.querySelectorAll('td');
      cols.forEach((c) => {
        let cIndex = parseInt(c.dataset.col, 10) - 1;
        let tileCount = g.landscape[rIndex][cIndex];
        if (fifthPlayerExpansion.checked) {
          tileCount = tileCount + 1;
        }
        let stack = new Array(tileCount);
        stack.fill('x');
        stack = stack.map(_ => g.draw());
        c.innerHTML = stack.map(renderTile).join("\n");
      });
    })

    return g;
  }
}
