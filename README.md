# Scrap4Scrapbox
コンテキストメニューにScrapbox(現Cosence)によるページのスクラップを実行するボタンを追加する拡張機能です  
後述しますが純正ブックマークレットを改良したものです  

### 注意事項
これは私自身の為に改良したものなので、これを使う場合は[background.js](background.js)内の`project`定数を<ins>**自身の追加したいプロジェクト名**</ins>に変更してください  

## 機能
現在フォーカスのあるページの内容で自身のScrapboxにページを作成するのを補助します  
- サイトのタイトルを取得
- 本文にページのリンクを追加
- 本文で選択したテキストを引用文として自動追加
- 一行開けて「`#ブックマーク`」タグを自動追加

## 使い方
1. 右クリック時に表示されるコンテキストメニュー（右クリックメニュー、又は上部の拡張機能ボタン）から`新規ページ作成`をクリック  
![contextmenu picture](https://github.com/user-attachments/assets/341f9ce1-2950-44e6-9688-4087cc2f5822)
![image](https://github.com/user-attachments/assets/153bdcda-e332-44d8-be16-106fbb7094da)

1. そのボタンをクリックするとポップアップにて取得したページタイトルが表示されます  
※この時半角の[]は自動的に全角の［］に変換されます  
![image](https://github.com/user-attachments/assets/7c20dec5-3cbd-4e52-8593-d9494cc9acdc)
![image](https://github.com/user-attachments/assets/b4b7cfec-08b2-4022-9d77-364be88af332)

3. OKを押下すると別ウィンドウにて作成されたページが立ち上がります  
![image](https://github.com/user-attachments/assets/de9b7a19-0657-41bc-98a8-adf2667049d2)

## 利点
従来の方法ではこのページをスクラップしたい！と思っても、いちいちページタイトルをコピペしたりURLをコピペしたりするのが面倒！  
でもこの拡張機能があれば右クリックからすぐにページを作成可能！  
URLも本文内に自動記入してくれるからブックマークとしても使える！  
また別ウィンドウで開いてくれるから元記事を見つつ内容の修正をしたり、自分の考えを追記したりもできる！  

# 参考元
Scrapbox開発者が作ったブックマークレットを改良しました！  
