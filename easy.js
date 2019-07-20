// animation delay in seconds
const DELAY = 0.17;
// distance: number of pixels a puzzle piece will move
const DISTANCE = 100;
/**********************************
// STEP 1 - Create puzzlePieces data structure.
// I suggest using an array of objects but feel free to change that
// An example of a puzzle piece object could be: { name: ".box1", x: 0, y: 0 }
**********************************/
const puzzleDOM = [...document.querySelectorAll("[class^=box]")];
const puzzlePieces = puzzleDOM.map(piece => {
  return {
    piece: piece,
    name: piece.className,
    pieceX: 0,
    pieceY: 0,
    order: Number.parseInt(piece.dataset.idx) + 1
  };
});
// blankSpace: initialize blank square as last piece so as to remember where it is.
const blankDOM = document.querySelector(".blank");
const blankSpace = {
  piece: blankDOM,
  name: blankDOM.className,
  blankX: 300,
  blankY: 300,
  order: 16
};
// Will eventually use it to ask direction of clicked puzzle piece(s).
// Once pieces move, must remember to update x,y values to new blank space coords
// I'm structuring my program sort of like how Vue does it - all in my puzzle object below.
const puzzle = {
  moves: 0,
  pieces: puzzlePieces,
  delay: DELAY,
  distance: DISTANCE,
  blank: blankSpace,
  movement: {
    currentPiece: null,
    directionToMove: "",
    pieceX: 0,
    pieceY: 0
  },
  initialize() {
    /************************************     
    // STEP 2 - Implement initialize function such that it
    // attaches click event handlers for each piece
    // and within that, invokes the slide function
    ***************************************/
    puzzleDOM.map(piece =>
      piece.addEventListener("click", this.slide.bind(puzzle))
    );
    // show puzzle pieces
    this.display();
  },
  display() {
    // initialize pieces to their proper order
    // this.pieces.forEach(piece => {
    //   const pieceDOM = document.querySelector(piece.name);
    //   TweenLite.set(pieceDOM, { x: piece.x, y: piece.y });
    // });
    /*********************************
     * create a shuffled array instead
     */
    const order = Object.keys(this.pieces);

    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }

    // display shuffled pieces
    for (let i = 0; i < 4; i++) {
      const y = i * this.distance;
      for (let j = 0; j < 4; j++) {
        const x = j * this.distance;
        if (i === 3 && j === 3) {
          const {piece, blankX, blankY} = this.blank;
          TweenMax.set(piece, {x: blankX, y: blankY});
        } else {
        const index = order.shift();
        const { piece } = this.pieces[index];
        this.pieces[index].pieceX = x;
        this.pieces[index].pieceY = y;
        TweenMax.set(piece, { x, y });
        }
      }
    }

  },
  slide(e) {
    // call isMoveable to find out direction to move
    // remember to adjust coordinates including adjusting blank piece's coordinates
    /************************************
    // STEP 4 - Implement slide function so that you set x,y coordinates of appropriate puzzle piece(s)
    *********************************/

    this.movement.currentPiece = e.target;

    const { pieceX: pX, pieceY: pY } = this.pieces[e.target.dataset.idx];

    this.movement.pieceX = pX;
    this.movement.pieceY = pY;

    const { pieceX, pieceY } = this.movement;

    const { blankX, blankY } = this.blank;

    // Now animate current puzzle piece now that x, y coordinates have been set above
    // TweenMax.to(this.currentPiece, 0.17, {
    //   x: this.pieces[this.currentPiece.dataset.idx].x,
    //   y: this.pieces[this.currentPiece.dataset.idx].y,
    //   ease: Power0.easeNone
    // });

    if (this.isMoveable()) {
      this.moves++;
      switch (this.movement.directionToMove) {
        case "up":
          for (y = blankY; y <= pieceY; y += DISTANCE) {
            this.pieces.forEach(piece => this.move(piece, blankX, y));
          }
          break;
        case "down":
          for (y = blankY; y >= pieceY; y -= DISTANCE) {
            this.pieces.forEach(piece => this.move(piece, blankX, y));
          }
          break;
        case "left":
          for (x = blankX; x <= pieceX; x += DISTANCE) {
            this.pieces.forEach(piece => this.move(piece, x, blankY));
          }
          break;
        case "right":
          for (x = blankX; x >= pieceX; x -= DISTANCE) {
            this.pieces.forEach(piece => this.move(piece, x, blankY));
          }
          break;
        default:
      }

      const {piece, blankX: bX, blankY: bY} = this.blank;
      piece.textContent = `Moves ${this.moves}`;
      TweenMax.set(piece, {x: bX, y: bY});
      
      // check if puzzle is solved
      let isSolved = true;
      for (let i = 0; i < 4; i++) {
        const y = i * this.distance;
        for (let j = 0; j < 4; j++) {
          if (i === 3 && j === 3) break;
          const x = j * this.distance;
          const order = i * 4 + j;
          const { pieceX, pieceY } = this.pieces[order];
          if (!(pieceX == x && pieceY == y)) {
            isSolved = false;
          }
        }
        if (!isSolved) break;
      }
      if (isSolved) {
        setTimeout(() => {alert("Winner!");}, this.delay * 1001);
        puzzleDOM.forEach(piece => piece.style.pointerEvents = "none");
      }
    }
  },
  move(piece, x, y) {
    if (piece.pieceX === x && piece.pieceY === y) {
      [piece.pieceY, this.blank.blankY] = [this.blank.blankY, piece.pieceY];
      [piece.pieceX, this.blank.blankX] = [this.blank.blankX, piece.pieceX];
      TweenMax.to(piece.piece, this.delay, {
        x: piece.pieceX,
        y: piece.pieceY,
        ease: Power0.easeNone
      });
    }
  },
  isMoveable() {
    /********************************************
    // STEP 3 - Implement isMoveable function to find out / return which direction to move
    // Is the clicked piece movable?
    // If yes, then return a direction to one of: "up", "down", "left", "right"
    // If no, then return a direction of ""
     ******************************************/

    let canMove = true;
    const { pieceX, pieceY } = this.movement;
    const { blankX, blankY } = this.blank;

    if (pieceX === blankX) {
      this.movement.directionToMove = pieceY > blankY ? "up" : "down";
    } else if (pieceY === blankY) {
      this.movement.directionToMove = pieceX > blankX ? "left" : "right";
    } else {
      this.movement.directionToMove = "";
      canMove = false;
    }
    return canMove;
  },
  unshuffle() {
    for (let i = 0; i < 4; i++) {
      let y = i * this.distance;
      for (let j = 0; j < 4; j++) {
        let x = j * this.distance;
        if (i === 3 && j === 3) {
          const {piece} = this.blank;
          this.blank.blankX = x;
          this.blank.blankY = y;
          TweenMax.set(piece, { x, y });
        } else {
        const order = i * 4 + j;
        const { piece } = this.pieces[order];
        this.pieces[order].pieceX = x;
        this.pieces[order].pieceY = y;
        TweenMax.set(piece, { x, y });
        }
      }
    }
  }
};

puzzle.initialize();

/* 
STEP 5 - Comment each function implemented
STEP 6 - Submit to github
STEP 7 - host on web server
*/
