import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Chase's amazing app";

document.title = gameName;

const header = document.createElement("h1");
const mycanvas = document.createElement("canvas");
mycanvas.width = 256;
mycanvas.height = 256;
header.innerHTML = gameName;
const ctx = mycanvas.getContext("2d");
//ctx.fillStyle = "green";
//ctx.fillRect(0, 0, 256, 256);
app.append(header);
app.append(mycanvas);
