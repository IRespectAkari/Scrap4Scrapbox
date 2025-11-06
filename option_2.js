
function dataSetting(e) {
  console.log("dataSetting start");

  const newProjectName = $(`input[name="projectName"]`).value;
  console.table("プロジェクト名", newProjectName);
  setProjectName(newProjectName)
  // setData({ "projectName": projectName });
  // chrome.storage.local.set({ "projectName": projectName });

  console.log("dataSetting end");
}

// 現在設定されているプロジェクト名を表示
function loadingData() {
  loadProjectName(()=>{
    $("#nowProjectName").appendChild(document.createTextNode(projectName));
  });
}

loadingData();
$("#submit").addEventListener("click", dataSetting);
