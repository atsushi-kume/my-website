/* ===== OneDrive Picker UI ===== */

import { listFolder } from "./graphDrive.js";

let currentPath = "";
let onSelectCallback = null;

export async function openPicker(token, mountId, onSelect) {
  onSelectCallback = onSelect;
  currentPath = "";

  const mount = document.getElementById(mountId);
  mount.innerHTML = `
    <div id="picker-path">/</div>
    <ul id="picker-list"></ul>
  `;

  await render(token);
}

async function render(token) {
  const data = await listFolder(token, currentPath);
  const list = document.getElementById("picker-list");
  const pathView = document.getElementById("picker-path");

  pathView.textContent = "/" + currentPath;

  list.innerHTML = "";

  // 戻る
  if (currentPath) {
    const li = document.createElement("li");
    li.textContent = "⬅ ..";
    li.onclick = () => {
      currentPath = currentPath.split("/").slice(0, -1).join("/");
      render(token);
    };
    list.appendChild(li);
  }

  for (const item of data.value) {
    const li = document.createElement("li");

    if (item.folder) {
      li.textContent = "📁 " + item.name;
      li.onclick = () => {
        currentPath = currentPath
          ? currentPath + "/" + item.name
          : item.name;
        render(token);
      };
    } else {
      li.textContent = "📄 " + item.name;
      li.onclick = () => {
        onSelectCallback(item);
      };
    }

    list.appendChild(li);
  }
}