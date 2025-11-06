const $ = (q, d = document) => d.querySelector(q);
const $$ = (q, d = document) => Array.from(d.querySelectorAll(q));

const has = s => getB().innerText.includes(s);

// elmのタグを生成し、elm内にtxtを T:innerText, H:innerHTML として記入
const createAndSetT = (tag, txt) => { var E = document.createElement(tag); E.innerText = txt; return E; };
const createAndSetH = (tag, txt) => { var E = document.createElement(tag); E.innerHTML = txt; return E; };
const createInput = (type) => { var i = document.createElement("input"); i.type = type; return i; };


// 設定が未保存であることを表す
function unsavedDisplay(e) {
  const closestSpan = e.target.closest("section").querySelector(".changeUnsaved");
  closestSpan.classList.add("unsaved");
  // closestSpan.style.display = "initial";
  EV = e;
};
// 設定が保存されたら消える
function saveDisplay(e) {
  const closestSpan = e.target.closest("section").querySelector(".changeUnsaved");
  closestSpan.classList.remove("unsaved");
  // closestSpan.style.display = "none";
};

/* Labelに入ったinputを生成
 * type   string inputのtype( text | checkbox | radio | ... )
 * txt    string label内文字列
 * option object 追加項目
 *   checked     boolean
 *   placeholder string
 *   display     string   css
 *   value       string   値
 *   event       object 
 *   eventType   string   イベント対象( click | change )
 *   eventFunc   function 関数
 */// input入りLabel生成(タイプ、文字列、追加項目)
function createInputLabel(type, child = null, options = {}) {
  const {
    id = null,
    classList = [],
    display = "",
    value = null,
    title = null,
    checked = false,
    placeholder = "",
    eventType = null,
    eventFunc = null,
    capture = null,
  } = options;

  const input = document.createElement("input");
  input.type = type;

  const label = document.createElement("label");
  label.appendChild(input);
  if (child) {
    if (Array.isArray(child)) {
      // child.forEach(e => label.appendChild(e));
      child.forEach(e => label.appendChild("string" != typeof e ? e : document.createTextNode(e)));
    } else {
      label.appendChild("string" != typeof child ? child : document.createTextNode(child));
    }
  }
  // label.appendChild(document.createTextNode(txt));

  if (id) label.id = id;
  if (Array.isArray(classList) && classList.length > 0) label.classList.add(...classList);

  input.checked = checked;
  if (display) input.style.display = display;
  if (value) input.value = value;
  if (eventType && eventFunc) input.addEventListener(eventType, eventFunc, { capture: capture });
  if (placeholder) input.placeholder = placeholder;

  if (title) label.title = title;

  return label;
};

/* 要素作成
 * tagName string           タグ名
 * child   string | element 文字列または要素
 * option  object           追加項目
 *   id        string 設定するID
 *   classList Array  設定するクラスの配列
 */// 要素作成(タグ名、子要素、追加項目)
/*function create(tagName = "div", child = null, options = {}) {
  const {
    id = null,
    classList = [],
    title = null,
    display = "",
    src = null,
    width = null,
    height = null,
    value = null,
    type = null,
    checked = false,
    placeholder = "",
    eventType = null,
    eventFunc = null,
    capture = null,
    color = null,
    style = null,
  } = options;

  const element = document.createElement(tagName);
  // if (child) element.appendChild("string" != typeof child ? child : document.createTextNode(child));
  if (child) {
    if (Array.isArray(child)) {
      child.forEach(e => element.appendChild(e));
    } else if ("string" != typeof child) {
      element.appendChild(child);
    } else {
      child.split("\n").forEach(e => element.appendChild(document.createTextNode(e)));
      // element.appendChild("string" != typeof child ? child : child.split("\n").forEach(e => document.createTextNode(e)));
    }
    // } else {
    //   element.appendChild("string" != typeof child ? child : document.createTextNode(child));
    // }
  }

  if (id) element.id = id;
  if (Array.isArray(classList) && classList.length > 0) element.classList.add(...classList);
  if (title) element.title = title;
  if (display) element.style.display = display;
  if (value) element.value = value;
  if (type) element.type = type;
  if (checked)  element.checked = checked;
  if (placeholder)  element.placeholder = placeholder;
  if (eventType && eventFunc) element.addEventListener(eventType, eventFunc, { capture: capture });
  if (color)  element.style.color = color;
  if (style)  element.style = style;
  if (src)  element.src = src;
  if (width)  element.width = width;
  if (height)  element.height = height;

  return element;
}*/

function create(tagName = "div", children = [], options = {}) {
  const element = document.createElement(tagName);

  for (let [key, value] of Object.entries(options)) {
    if (!value) continue;

    switch(key){
      case "className":// className: ""
      case "classList":// classList: [...]
        if (Array.isArray(value)) {
          element.classList.add(...value);
        }else {
          element.className = value;
        }
        break;

      case "event":// { type, func, capture }
        if (value.type && "function" === typeof value.func)
          element.addEventListener(value.type, value.func, value.capture ?? false);
        break;

      case "events":// 複数イベント { click: f, mouseover: { func: g, capture: true } }
        for (const [evType, evHandler] of Object.entries(value)) {
          if ("function" === typeof evHandler) {
            element.addEventListener(evType, evHandler);
          }else if ("object" === typeof evHandler && "function" === typeof evHandler.func) {
            // { func, capture } 形式
            element.addEventListener(evType, evHandler.func, evHandler.capture ?? false);
          }
        }
        break;

      case "style":// style: { color: "red" }
        if ("object" === typeof value) Object.assign(element.style, value);
        // if ("object" === typeof value) element.style = value;
        break;

      case "color":
      case "display":
        console.trace(tagName);
        break;

      default:// 上記以外
        try {
          element[key] = value;
        } catch (e) {}// 適用できないオプションは無視
    }
  }


  // 子要素の追加
  if (!Array.isArray(children)) children = [children];
  children.filter(e=>e).forEach(e => {
    if ("string" === typeof e || 'number' === typeof e) {
      String(e).split("\n").forEach(E => element.appendChild(document.createTextNode(E)));
    } else {
      element.appendChild(e);
    }
  });


  return element;
}

  // children.filter(e=>e).forEach(e => {
  //   if ("string" === typeof e) {
  //     e.split("\n").forEach(element.appendChild(document.createTextNode(e)))
  //   }else {
  //     element.appendChild(e)
  //   }
  // });


// selector に当てはまる要素をすべて削除
function remove(selector) {
  // const element = ("string" == typeof selector ? $(selector) : selector);
  // element.parentNode.removeChild(element);

  const elements = ("string" == typeof selector) ? $$(selector) : selector;
  elements.map(e=>e.parentNode.removeChild(e));
}

// JSONオブジェクトでないかを判定（maybeJson != JSONオブジェクト ⇒ true を返す、maybeJson == JSONオブジェクト ⇒ false）
function isNotJson(maybeJson) {
  try {
    JSON.parse(maybeJson);
  } catch (error) {
    return true;
  }
  return false;
}
