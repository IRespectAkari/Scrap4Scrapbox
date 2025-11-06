// self.importScripts("data.js");

let projectName;
chrome.storage.local.get("projectName", (data) => {
  projectName = data["projectName"] || "my-knowldge";
})

chrome.runtime.onInstalled.addListener(function (details) {
  /* コンテキストメニューを作成 */
  const contextMenu = chrome.contextMenus.create({
    id: "Scrap4Scrapbox",
    title: "新規ページ作成",
    contexts: ["all"],
  });
});

/* コンテキストメニューがクリックされた時の処理 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: script,
  });
});

// 簡易型一行版
// const script = ()=>{var t=window.prompt(`Scrap "${document.title}" to my-knowledge.`,document.title);if (!t) return;var ls=['['+document.title+' '+window.location.href+']'];var q=window.getSelection().toString();if (q.trim()) ls=ls.concat(q.split(/\n/g).map(l=>' > '+l));ls.push('');var b=encodeURIComponent(ls.join('\n'));window.open('https://scrapbox.io/my-knowledge/'+encodeURIComponent(t.trim())+'?body='+b)};
// const script = ()=>{var t=window.prompt(`Scrap "${document.title}" to my-knowledge.`,document.title);if (!t) return;var ls=['['+document.title+' '+window.location.href+']'];var q=window.getSelection().toString();if (q.trim()) ls=ls.concat(q.split(/\n/g).map(l=>' > '+l));ls.push('');ls.push('#ブックマーク');var b=encodeURIComponent(ls.join('\n'));window.open('https://scrapbox.io/my-knowledge/'+encodeURIComponent(t.trim())+'?body='+b,'新規ページ作成','top=100,left=1000,width=700,height=500')};
// const script = ()=>{var w=window;var t=document.title;var tt=w.prompt(`Scrap "${t}" to my-knowledge.`,t);if (!tt) return;var ls=['['+tt+' '+w.location.href+']'];var q=w.getSelection().toString();if (q.trim()) ls=ls.concat(q.split(/\n/g).map(l=>' > '+l));ls.push('');ls.push('#ブックマーク');var e=encodeURIComponent;var b=e(ls.join('\n'));w.open('https://scrapbox.io/my-knowledge/'+e(tt.trim())+'?body='+b,'新規ページ作成','top=100,left=1000,width=700,height=500')};

function script() {
  console.log("window.location.origin ->", window.location.origin);

  const regList = [
    `[0-9]`,
    `[a-zA-Z]`,
    `[\u4E00-\u9FFF\u3005-\u3007]`,// 漢字
    `[\u30A0-\u30FF]`,// カタカナ
    `[\uFF61-\uFF9F]`,// 半角カタカナ
  ];
  function ab(t) {
    const s = new Set();
    let rslt = t;
    for (let r of regList) {
      t.match(new RegExp(`${r}{2,}`, "g"))?.forEach(e => {
        if (!s.has(e)) {
          s.add(e);
          rslt = rslt.replace(new RegExp(`(?<!${r})${e}(?!${r})`), `[${e}]`);
        }
      });
    }
    return rslt;
  }
  // 追加するプロジェクト
  const project = projectName || `my-knowledge`;
  // プロンプトに表示されるテキスト
  const promptTxt = (Title)=>`Scrap "${Title}" to ${project}.`;
  // 置換対応マップ
  const replaceTextList = {
    "[": "［",
    "]": "］",
  };
  // 置換関数
  const replaceAllText = (Title, replaceMap) => Object.keys(replaceMap).reduce((pre, cur) => pre.replaceAll(cur, replaceMap[cur]), Title);
  // 関数Json
  const dataJson = {
    title: document.title,
    quoteURL: (t)=>`[${t} ${window.location.href}]`,
    tags: ["途中", "ブックマーク"]
  };
  switch(window.location.origin) {
    case "https://scrapbox.io":
      dataJson.title = document.title.split(" - ")[0];
      dataJson.quoteURL = (t) => `[${decodeURIComponent(window.location.pathname)}]`;
      dataJson.tags.push(document.title.split(" - ")[1]);
      break;
    case 'https://www.youtube.com':
      if (window.location.pathname == "/watch") {
        dataJson.title = document.querySelector(`#title > h1 > yt-formatted-string`).title;
        dataJson.quoteURL = (t)=>`${t} - [YouTube]\n[${window.location.href}]`;
        dataJson.tags.push("後で見る動画");
        dataJson.tags.push(document.querySelector(`#text > a`).innerText);
      }
      break;
    case 'https://atmarkit.itmedia.co.jp':
      dataJson.title = document.title.split(" - ")[0];
      dataJson.tags.push(`＠IT`);
      break;
    case 'https://kotobank.jp/word':
      dataJson.tags.push("コトバンク");
      break;
    case 'https://www.tohoho-web.com':
    case 'https://ja.wikipedia.org':
      const splitTitle = document.title.split(" - ");
      dataJson.title = splitTitle[0];
      dataJson.tags.push(splitTitle[1]);
      break;
    // 通常時の動作
    default:
      dataJson.tags.push("後で読みたいサイト");
      break;
  }

  // 処理開始
  // タイトル処理
  const originalTitle = dataJson.title;
  const replacedTitle = replaceAllText(originalTitle, replaceTextList);
  const title = window.prompt(promptTxt(replacedTitle), replacedTitle);
  if (!title) return;
  const encodedTitle = encodeURIComponent(title.trim());

  // 本文作成
  const lines = [];
  lines.push(dataJson.quoteURL(replacedTitle));
  const quote = window.getSelection().toString().trim();
  if (quote) {
    // push
    // lines.push(...quote.split(/\n/g).map(line=>`	>${line}`));
    lines.push(...ab(quote).split(/\n/g).map(line=>`	>${line}`));// <-------------- AutoBracketter 組み込みテスト
  }
  lines.push(``);
  // (空白|^#)が含まれるならブラケット、でないなら先頭に#、その後lineに追加
  dataJson.tags.map(e => /(\s|^#)/.test(e) ? `[${e}]` : `#${e}`).reverse().forEach(e => lines.push(e));
  const body = encodeURIComponent(lines.join(`\n`));

  // ページ作成実行
  window.open(
    `https://scrapbox.io/${project}/${encodedTitle}?body=${body}`,
    '新規ページ作成',
    'top=100,left=1000,width=700,height=500'
  );
}
