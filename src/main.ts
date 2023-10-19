import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Chase's amazing app";

document.title = gameName;

const header = document.createElement("h1");
const mycanvas = document.createElement("canvas");
const clearButton = document.createElement("button");
const undoButton = document.createElement("button");
const redoButton = document.createElement("button");
const thinButton = document.createElement("button");
const thickButton = document.createElement("button");
clearButton.innerHTML = "clear";
undoButton.innerHTML = "undo";
redoButton.innerHTML = "redo";
thinButton.innerHTML = "thin";
thickButton.innerHTML = "thick";
let currentThickness = "thin";
class CursorCommand {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  execute(ctx: CanvasRenderingContext2D) {
    if (currentThickness == "thin") {
      ctx.lineWidth = 2;
    } else {
      ctx.lineWidth = 10;
    }
    ctx.beginPath();
    ctx.ellipse(
      this.x,
      this.y,
      ctx.lineWidth / 2,
      ctx.lineWidth / 2,
      0,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }
}
let currentLineCommand = null;
class CustomLine {
  coordinates: { x: number; y: number }[] = [];
  thickness;
  constructor(theThickness: string) {
    this.thickness = theThickness;
  }
  display(ctx: CanvasRenderingContext2D) {
    if (this.thickness == "thin") {
      ctx.lineWidth = 2;
    } else {
      ctx.lineWidth = 10;
    }
    ctx.beginPath();
    if (this.coordinates.length > 1) {
      ctx?.beginPath();
      const { x, y } = this.coordinates[0];
      ctx?.moveTo(x, y);
      for (const { x, y } of this.coordinates) {
        ctx?.lineTo(x, y);
      }
      ctx?.stroke();
    }
  }
  add(in1: number, in2: number) {
    this.coordinates.push({ x: in1, y: in2 });
  }
}
const ctx = mycanvas.getContext("2d")!;
mycanvas.width = 256;
mycanvas.height = 256;
const cursor = { active: false, x: 0, y: 0 };
const lines: CustomLine[] = [];
const redoStack: CustomLine[] = [];
let currentLine: CustomLine = new CustomLine(currentThickness);
const changedDrawing: Event = new Event("drawing-changed");
const toolMoved: Event = new Event("tool-moved");
mycanvas.addEventListener("mousedown", (event) => {
  cursor.active = true;
  cursor.x = event.offsetX;
  cursor.y = event.offsetY;
  //currentLine = [];
  currentLine = new CustomLine(currentThickness);
  lines.push(currentLine);
  redoStack.splice(0, redoStack.length);
  //currentLine.push({ x: cursor.x, y: cursor.y });
  currentLine.add(cursor.x, cursor.y);
});
mycanvas.addEventListener("mousemove", (event) => {
  cursor.x = event.offsetX;
  cursor.y = event.offsetY;
  if (cursor.active) {
    //currentLine.push({ x: cursor.x, y: cursor.y });
    currentLine.add(cursor.x, cursor.y);
    mycanvas.dispatchEvent(changedDrawing);
  } else {
    mycanvas.dispatchEvent(toolMoved);
  }
});
mycanvas.addEventListener("tool-moved", () => {
  ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);
  lines.forEach((element) => {
    element.display(ctx);
  });
  currentLineCommand = new CursorCommand(cursor.x, cursor.y);
  currentLineCommand.execute(ctx);
});
mycanvas.addEventListener("drawing-changed", () => {
  ctx?.clearRect(0, 0, mycanvas.width, mycanvas.height);
  lines.forEach((element) => {
    element.display(ctx);
  });
});
mycanvas.addEventListener("mouseup", () => {
  cursor.active = false;
});
clearButton.addEventListener("click", () => {
  ctx?.clearRect(0, 0, mycanvas.width, mycanvas.height);
  lines.splice(0, lines.length);
});
undoButton.addEventListener("click", () => {
  if (lines.length > 0) {
    const pop = lines.pop();
    if (pop != undefined) {
      redoStack.push(pop);
    }
    mycanvas.dispatchEvent(changedDrawing);
  }
});
redoButton.addEventListener("click", () => {
  if (redoStack.length > 0) {
    const pop = redoStack.pop();
    if (pop != undefined) {
      lines.push(pop);
    }
    mycanvas.dispatchEvent(changedDrawing);
  }
});
thinButton.addEventListener("mousedown", () => {
  currentThickness = "thin";
});
thickButton.addEventListener("mousedown", () => {
  currentThickness = "thick";
});
header.innerHTML = gameName;
app.append(header);
app.append(mycanvas);
app.append(clearButton);
app.append(undoButton);
app.append(redoButton);
app.append(thinButton);
app.append(thickButton);
