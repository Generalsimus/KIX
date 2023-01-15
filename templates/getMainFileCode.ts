export const getMainFileCode = () => {
    return /* typescript */ `
import kix from "kix";
import "./style.scss";
import Logo from "./logo.svg";

function App() {
  let time = new Date().toTimeString();

  setInterval(() => {
    time = new Date().toTimeString();
  }, 1000);

  return <div class="contain">
    <h3 class="time">{time}</h3>
    <a href="https://kixjs.ml" target="_blank">
      <Logo />
    </a>
  </div>
}

kix(document.body, <App />);
`.trim();
}