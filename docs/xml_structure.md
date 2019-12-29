
# はじめに
セーブデータの形式には大きく分けてバイナリ形式とXML形式の２つがあります。
そしてそれぞれの形式のデータをzip, bzip2で圧縮したものがあり無圧縮のものと合わせて6種類になります。
sve_analyzerでは現在xml, xml_zipped, xml_bzip2に対応しています。

# セーブデータのXML構造について
構造は大きく分けて設定や路線情報などのカテゴリを表す要素と数値などのデータ形式を表す要素で構成されています。
注意点として、Simutransのバージョンによってデータ項目が増減します。
そのため何番目の値が○○といった形で値を取る場合、要素がずれる可能性があります。

# 構造
ルート要素である`<Simutrans>`の子要素は大まかに以下のようになっています。
`...`があるものは複数回繰り返されているという意味です。

```
<?xml version="1.0"?>
<Simutrans version="0.120.1" pak="pak128">
  // 設定情報
  <einstellungen_t></einstellungen_t>

  // タイル情報
  <planquadrat_t></planquadrat_t>
  ...

  // 駅情報
  <haltestelle_t></haltestelle_t>
  ...

  // 車両情報
  <convoi_t></convoi_t>
  ...

  // 会社情報
  <spieler_t></spieler_t>
  ...

</Simutrans>
```

## Simutrans
ルート要素でありプロパティにセーブした本体のバージョン、pakセット名を持ちます。
OTRPを使用している場合、マイナーバージョンの後ろにOTRPのバージョンがあります。

`<Simutrans version="0.120.8.23" pak="pak128">`

### einstellungen_t
マップサイズやプレーヤーの有効/無効など設定情報が格納されています。

```
<einstellungen_t>
1   <i32>8</i32>      マップ幅
2   <i32>1747</i32>   マップ番号
...
14  <i32>8</i32>      マップ奥行き
...
n   <![CDATA[ja]]>    会社名データ開始
n+1 <bool>true</bool> 会社が有効か
n2+ <i8>1</i8>        会社のタイプ(0:空き, 1:人間, 2: AI貨物, 3:AI旅客, 4:スクリプトAI)
... 16社分繰り返し
</einstellungen_t>
```

### planquadrat_t
タイル[0,0] から順に何も設置されていないタイルも含め、全てのタイル分のデータが保存されています。
512マス×512マスのマップなら262,144個の要素があることになります。
データには座標情報(x,y)は含まれておらず、座標は何番目かのインデックスから求める必要があります。

横幅wマス、n個目のデータの座標は

```
(x, y) = (MOD(n, w), QUOTIENT(n, w))
// MOD:余、QUOTIENT：商
```
planquadrat_t要素は複数のgrund_t要素を持っています。
高架や地下など1タイルで複数の階層レイヤーを持っている場合、レイヤー個数分あります。

```
<planquadrat_t>
...
  // 階層レイヤー情報
  <grund_t></grund_t>
  ...
...
</planquadrat_t>
```

#### ground_t
階層レイヤー情報情報です。
高さ（z軸）、構造物情報を持っています。画面に表示される駅名ラベルもここに含まれています。

```
<grund_t>
  <i8>0</i8>  z座標
...
  <![CDATA[station name]]>  ラベル（駅名、都市名、マーカー）
...
</grund_t>
```

### haltestelle_t
1つの駅に含まれるタイル座標(x,y,z)の一覧が保存されています。

```
<i32>28</i32>   haltestelle_tの個数
<haltestelle_t>
  <i16>1</i16>      駅ID
  <i32>1</i32>      会社ID
  // 座標情報
  <koord3d>
    <i16>24</i16>   x
    <i16>19</i16>   y
    <i8>0</i8>      z
  </koord3d>
  ...
</haltestelle_t>
```

### convoi_t
編成（＝複数の車両を連結して組成したもの）の情報が保存されています。

### spieler_t
会社情報が保存されています。路線情報もここに含まれています。

```
<spieler_t>
  <i8>40</i8>     プレーヤーカラー基調色
  <i8>-64</i8>    プレーヤーカラー補助色
  ...
  // 路線情報
  <simlinemgmt_t></simlinemgmt_t>
  ...
  <![CDATA[player name]]>  会社名
  ...
</spieler_t>
```

#### simlinemgmt_t
会社ごとの路線情報一覧が保存されています。

```
<simlinemgmt_t>
  <i32>2</i32>              路線の合計数
  <i32>2</i32>              路線タイプ(way_type)
  <simline_t>
    <![CDATA[line name]]>   路線名
    <i16>2</i16>            路線ID
    <fahrplan_t>
      <i8>1</i8>
      <i8>8</i8>            停車駅数

      <koord3d></koord3d>   停車座標(x,y,z)
      <i8>0</i8>            積載量
      <i8>0</i8>            待ち時間
      ...<koord3d>から繰り返し
    </fahrplan_t>
    
  </simline_t>
  ...
</simlinemgmt_t>
```

