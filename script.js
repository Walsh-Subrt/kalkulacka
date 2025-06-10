const inputDisplay = document.getElementById("calculator-input");
const outputDisplay = document.getElementById("calculator-output");
const buttons = document.querySelectorAll(".calculator-buttons button");
const historyDisplay = document.getElementById("history-display");
const clearHistoryBtn = document.getElementById("clear-history-btn");

let input = "";
let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

const updateDisplay = () => inputDisplay.textContent = input || "0";
const renderHistory = () => historyDisplay.innerHTML = history.map(h => `<div>${h}</div>`).join("");
const saveHistory = () => localStorage.setItem("calcHistory", JSON.stringify(history));

const evaluateExpression = (expr) => {
  expr = expr.replace(/(\d+\.?\d*)\^(\d+\.?\d*)/g, "Math.pow($1,$2)");
  try {
    return +Function(`return ${expr}`)().toFixed(10);
  } catch {
    return "Error";
  }
};

const processResult = () => {
  if (!input) return;
  const result = evaluateExpression(input);
  outputDisplay.textContent = result;
  if (result !== "Error") {
    history.push(`${input} = ${result}`);
    if (history.length > 10) history.shift();
    saveHistory();
    renderHistory();
    input = result.toString();
  } else {
    input = "";
  }
  updateDisplay();
};

const handleInput = val => {
  input += val;
  updateDisplay();
};

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const { id, value } = btn;
    if (id === "clear-all-btn") input = "", outputDisplay.textContent = "0";
    else if (id === "clear-btn") input = input.slice(0, -1);
    else value === "=" ? processResult() : handleInput(value);
    updateDisplay();
  });
});

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  saveHistory();
  renderHistory();
});

document.addEventListener("keydown", (e) => {
  const { key } = e;
  if ("0123456789+-*/().^".includes(key)) handleInput(key);
  else if (key === "Enter") processResult();
  else if (key === "Backspace") input = input.slice(0, -1), updateDisplay();
  else if (key === "Escape") input = "", outputDisplay.textContent = "0", updateDisplay();
  if (!["Shift"].includes(key)) e.preventDefault();
});

// Inicializace
updateDisplay();
renderHistory();
