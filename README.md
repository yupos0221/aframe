# 参考元
* https://github.com/mganeko/aframe

## 配信側
* PCのChromeブラウザで、 [https://yupos0221.github.io/aframe/pc.html](https://yupos0221.github.io/aframe/pc.html) を開く
  * [https://yupos0221.github.io/aframe/raspberry.html](https://yupos0221.github.io/aframe/raspberry.html)
  * Roomがランダムに割り振られます。変更することも可能です
* [Get Devices]ボタンをクリックすると、利用可能な Videoデバイス(カメラ)、Audioデバイス(マイク)のリストを取得します
  * カメラ、マイクへのアクセスを聞かれるので、許可してください
  [Start Video] ボタンをクリックしてください
  * 映像と音声が取得され、ブラウザ内に表示されます
* [Connect] ボタンをクリックしてください
  * SkyWay に接続され、指定されたRoomに参加します
  * 自分の映像の下に、接続するためのURLが表示されます。

* 配信を停止する場合には [Disconnect] → [Stop Video] の順にボタンをクリックしてください

    
## 視聴側 
* WebVR 対応のブラウザを起動してください
* 配信側で表示されたURLを、ブラウザでアクセスします
  * あらかじめ [https://yupos0221.github.io/aframe/vr.html?room=](https://yupos0221.github.io/aframe/vr.html?room=) までをブックマークに入れておき、最後にroom名だけ追加すると手間が少なくなるのでお勧めです
  * PCのブラウザで見る場合は[https://yupos0221.github.io/aframe/go.html?room=](https://yupos0221.github.io/aframe/go.html?room=)
* しばらくロードの時間がかかります
  * A-FRAMEの準備ができたら 中央にメッセージが表示されます
* 画面をクリックしてください（Oculus Goのコントローラーでトリガーを引く）
  * SkyWay に接続され、指定されたRoomに参加します
  * PCに接続されている THETA V の360ど映像が表示されます
* 右下の VRモードボタンをクリックすると、360度モードになります（カーソルを合わせてOculus Goのコントローラーでトリガーを引く）
  * 自分の頭の向いている方向に応じて、映像の見える方向が変わります
* 360度モードを抜けるには コントローラの[戻る]ボタンを押します
* Skywayの接続を切る処理は未実装です。リロードするか、他のページに移動してください

