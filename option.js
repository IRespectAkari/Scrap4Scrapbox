'use strict';

const defaultProjectName = "my-knowledge";

chrome.storage.local.get("projectName", (data) => {
  const projectName = data["projectName"] || defaultProjectName;
  $("#nowProjectName").appendChild(create("span", projectName));
  console.log("load projectName: ", projectName);
});

function setProjectName(e) {
  const newProjectName = $(`input[name="projectName"]`).value;
  chrome.storage.local.set({ projectName: newProjectName });
  $("#nowProjectName > span").replaceWith(create("span", newProjectName));
  console.log("set projectName: ", newProjectName);
}

$("#submit").addEventListener("click", setProjectName);
