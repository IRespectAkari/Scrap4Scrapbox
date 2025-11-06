const defaultProjectName = "my-knowledge";

let projectName;

function loadProjectName(func) {
  chrome.storage.local.get("projectName", (data) => {
    projectName = data["projectName"] || defaultProjectName;
    if(func) func(projectName);
  });
}

function setProjectName(newProjectName) {
  projectName = newProjectName;
  chrome.storage.local.set({ "projectName": newProjectName });
}

// ----------------------------------------------------------------------------------------------------
/*
function loadSettingDatas(func) {
  chrome.storage.local.get("settingDatas", (data) => {
    localSettingDatas = data["settingDatas"] || defaultSettingDatas;
    log("loadSettingDatas: loaded.");
    func();
  }
  );
}
function saveSettingDatas(settingDatas) {
  log("saveSettingDatas");
  localSettingDatas = settingDatas;
  chrome.storage.local.set({
    "settingDatas": settingDatas
  }, function() {
    chrome.runtime.sendMessage({
      msg: "rebuildContextMenu"
    });
  });
}
*/