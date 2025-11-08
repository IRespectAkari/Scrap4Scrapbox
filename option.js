'use strict';

// デフォルト値
const defaultProjectName = "my-knowledge";
const defaultTags = ["途中", "ブックマーク"];


// プロジェクト名をchrome.storageに追加し、nowProjectNameに設定
function setProjectName(e) {
  const newProjectName = $(`input[name="projectName"]`).value;
  chrome.storage.local.set({ projectName: newProjectName });
  $("#nowProjectName > span").replaceWith(create("span", newProjectName));
  console.log("set projectName: ", newProjectName);
}
$("#projectName-registration").addEventListener("click", setProjectName);


// タグが重複してなければchrome.storageに追加し、タグ一覧に追加
function addTag(e) {
  const newTag = $(`input[name="tag"]`).value.trim();
  const tags = $$("#tags > *").map(e=>e.textContent);

  // 既に存在する場合は何もせず終了
  if (tags.includes(newTag)) return;

  $(`input[name="tag"]`).value = "";
  tags.push(newTag);
  chrome.storage.local.set({ tags: tags });
  $("#tags").appendChild(create("span", newTag));
}
$("#tagAddBtn").addEventListener("click", addTag);


// 初期化処理
async function initializer() {
  const data = await chrome.storage.local.get(null);
  const projectName = data["projectName"] || defaultProjectName;
  const tags = data["tags"] || defaultTags;

  console.log(data);
  console.log(JSON.stringify(data, null, "  "));

  $("#nowProjectName").appendChild(create("span", projectName));
  console.log("load projectName: ", projectName);

  const tagsDiv = $("#tags");
  tags
    .map(e=>create("span", e))
    .forEach(e=>tagsDiv.appendChild(e));
  console.log("load tags: ", tags);
}
initializer();


// オリジンを返す
function getOrigin(url){
  return new URL("https://developer.chrome.com/docs/extensions/how-to/security/sandboxing-eval?hl=ja").origin;
}