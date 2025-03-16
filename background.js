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
  // 追加するプロジェクト
  const project = `my-knowledge`;
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
    title: "",
    quoteURL: "",
  };
  switch(window.location.origin) {
    // URLがYoutubeの場合のみ変更する
    case 'https://www.youtube.com':
      dataJson.title = document.querySelector(`#title > h1 > yt-formatted-string`).title;
      dataJson.quoteURL = (t)=>`${t} - [YouTube]\n[${window.location.href}]`;
      break;
    // 通常時の動作
    default:
      dataJson.title = document.title;
      dataJson.quoteURL = (t)=>`[${t} ${window.location.href}]`;
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
    lines.push(...quote.split(/\n/g).map(line=>`	>${line}`));
  }
  lines.push(``);
  lines.push(`#ブックマーク`);
  const body = encodeURIComponent(lines.join(`\n`));

  // ページ作成実行
  window.open(
    `https://scrapbox.io/${project}/${encodedTitle}?body=${body}`,
    '新規ページ作成',
    'top=100,left=1000,width=700,height=500'
  );
}
