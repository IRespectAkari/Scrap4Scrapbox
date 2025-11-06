const defaultData = {
  projectName: "my-knowledge",
}

let data;

$("#submit").addEventListener("click", dataSetting);

function dataSetting(e) {
  console.log("dataSetting start");

  const projectName = $(`input[name="projectName"]`).value;

  console.table("プロジェクト名", projectName);

  chrome.storage.local.set({
    "projectName": projectName
  });

  console.log("dataSetting end");
}

function loadSetting() {
  chrome.storage.local.get("settingDatas", (data) => {
    localSettingDatas = data["settingDatas"] || defaultSettingDatas;
  });
}

// ----------------------------------------------------------------------------------------------------
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
