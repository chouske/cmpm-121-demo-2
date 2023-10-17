import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Chase's amazing app";

document.title = gameName;

const header = document.createElement("h1");
const mycanvas = document.createElement("canvas");
const clearButton = document.createElement("button");
const undoButton = document.createElement("button");
const redoButton = document.createElement("button");
const EMPTY_LIST = 0;
clearButton.innerHTML = "clear";
undoButton.innerHTML = "undo";
redoButton.innerHTML = "redo";
const ctx = mycanvas.getContext("2d");
mycanvas.width = 256;
mycanvas.height = 256;
const cursor = { active: false, x: 0, y: 0 };
const lines: { x: number; y: number }[][] = [];
const redoStack: { x: number; y: number }[][] = [];
let currentLine: { x: number; y: number }[] = [];
const changedDrawing: Event = new Event("drawing-changed");
mycanvas.addEventListener("mousedown", (event) => {
  cursor.active = true;
  cursor.x = event.offsetX;
  cursor.y = event.offsetY;
  currentLine = [];
  lines.push(currentLine);
  redoStack.splice(0, redoStack.length);
  currentLine.push({ x: cursor.x, y: cursor.y });
});
mycanvas.addEventListener("mousemove", (event) => {
  if (cursor.active) {
    cursor.x = event.offsetX;
    cursor.y = event.offsetY;
    currentLine.push({ x: cursor.x, y: cursor.y });
    mycanvas.dispatchEvent(changedDrawing);
  }
});
mycanvas.addEventListener("drawing-changed", () => {
  ctx?.clearRect(0, 0, mycanvas.width, mycanvas.height);
  lines.forEach((element) => {
    //element is a currentline(array)
    if (element.length > 1) {
      ctx?.beginPath();
      const { x, y } = element[0];
      ctx?.moveTo(x, y);
      for (const { x, y } of element) {
        ctx?.lineTo(x, y);
      }
      ctx?.stroke();
    }
  });

  //cursor.x = event.offsetX;
  //cursor.y = event.offsetY;
});
mycanvas.addEventListener("mouseup", () => {
  cursor.active = false;
});
clearButton.addEventListener("click", () => {
  ctx?.clearRect(0, 0, mycanvas.width, mycanvas.height);
  lines.splice(0, lines.length);
});
undoButton.addEventListener("click", () => {
  if (lines.length > EMPTY_LIST) {
    const pop = lines.pop();
    if (pop != undefined) {
      redoStack.push(pop);
    }
    mycanvas.dispatchEvent(changedDrawing);
  }
});
redoButton.addEventListener("click", () => {
  if (redoStack.length > EMPTY_LIST) {
    const pop = redoStack.pop();
    if (pop != undefined) {
      lines.push(pop);
    }
    mycanvas.dispatchEvent(changedDrawing);
  }
});
header.innerHTML = gameName;
app.append(header);
app.append(mycanvas);
app.append(clearButton);
app.append(undoButton);
app.append(redoButton);
