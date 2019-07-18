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
    name: piece.className,
    x: 0,
    y: 0,
    order: Number.parseInt(piece.dataset.idx) + 1
  };
});
// blankSpace: initialize blank square as last piece so as to remember where it is.
// Will eventually use it to ask direction of clicked puzzle piece(s).
// Once pieces move, must remember to update x,y values to new blank space coords
const blankSpace = { x: 300, y: 300, order: 16 };
// I'm structuring my program sort of like how Vue does it - all in my puzzle object below.
const puzzle = {
  pieces: puzzlePieces,
  piecesDOM: puzzleDOM,
  distance: DISTANCE,
  blankSpace,
  currentPiece: null,
  directionToMove: "",
  initialize: function() {
    /************************************     
    // STEP 2 - Implement initialize function such that it
    // attaches click event handlers for each piece
    // and within that, invokes the slide function
    ***************************************/
    this.piecesDOM.map(piece => piece.addEventListener("click", this.slide.bind(puzzle)));
    // show puzzle pieces
    this.display();
  },
  display: function() {
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
      y = i * this.distance;
      for (let j = 0; j < 4; j++) {
        if(i === 3 && j === 3) break;
        x = j * this.distance;
        const index = order.shift();
        this.pieces[index].x = x;
        this.pieces[index].y = y;
        TweenMax.to(this.piecesDOM[index], 0, { x: x, y: y });
      }
    }
  },
  slide: function() {
    // call isMoveable to find out direction to move
    // remember to adjust coordinates including adjusting blank piece's coordinates
    /************************************
    // STEP 4 - Implement slide function so that you set x,y coordinates of appropriate puzzle piece(s)
    *********************************/
   
    console.log(this.isMoveable());
    // Now animate current puzzle piece now that x, y coordinates have been set above
    // TweenMax.to(this.currentPiece, 0.17, {
    //   x: this.pieces[this.currentPiece.dataset.idx].x,
    //   y: this.pieces[this.currentPiece.dataset.idx].y,
    //   ease: Power0.easeNone
    // });
  },
  isMoveable: function() {
    /********************************************
    // STEP 3 - Implement isMoveable function to find out / return which direction to move
    // Is the clicked piece movable?
    // If yes, then return a direction to one of: "up", "down", "left", "right"
    // If no, then return a direction of ""
     ******************************************/
    // blankSpace.x || blankSpace.y
    console.log();
    return true;
  }
};

puzzle.initialize();

/* 
STEP 5 - Comment each function implemented
STEP 6 - Submit to github
STEP 7 - host on web server
*/
