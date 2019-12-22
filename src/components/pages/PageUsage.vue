<template>
  <b-container class="page">
    <div class="page-content">
      <div class="mb-5">
        <h4>解析方法</h4>
        <ol>
          <li>トップページで対応した形式で保存したセーブデータファイル（○○.sve）を選択します。</li>
          <li>ファイルを選択し、解析が終わるのを待ちます。解析のステータスはウインドウのタイトルに表示されます。</li>
          <li>解析が完了するとページタイトルが[完了]になり、駅一覧などが閲覧できるようになります。</li>
          <li>解析データはエクスポート機能でファイルに保存することができます。</li>
        </ol>
      </div>
      <div class="mb-5">
        <h4>セーブ形式の変更方法</h4>
        <ol>
          <li>Simutrans本体のあるフォルダの中で「config」フォルダを探します。</li>
          <li>フォルダ内のsimuconf.tabをテキストエディタで開きます。</li>
          <li>「saveformat」の項目を探し値を変更します。xmlで保存する場合「saveformat = xml」にします。</li>
          <li>Simutransを起動し、解析したいセーブデータを読み込みます。</li>
          <li>ゲームが再開されたらゲームを保存します。上書き保存せず別ファイルにしておくとよいです。</li>
          <li>
            xml形式はファイルサイズが非常に大きく、普段使いには向いていません。
            <br />保存が終わったら「saveformat」の値を元に戻しておきましょう。
          </li>
        </ol>
      </div>
      <div class="mb-5">
        <h4>仕様</h4>
        <div class="ml-4">
          <dl>
            <dt>対応セーブ形式</dt>
            <dd>xml, xml_zipped, xml_bzip2</dd>
            <dt>対応バージョン</dt>
            <dd>120.0~</dd>
            <dt>動作確認バージョン</dt>
            <dd>121.0, 120.4, 120.4(OTRP v23.1)</dd>
            <dt>解析時間の目安</dt>
            <dd>
              <p>マップサイズ1920x1280のデータを使用した場合の所要時間です。</p>
              <table class="table table-sm">
                <thead>
                  <th>形式</th>
                  <th>セーブデータサイズ</th>
                  <th>解析時間</th>
                </thead>
                <tbody>
                  <tr>
                    <td>xml</td>
                    <td>2.6GB</td>
                    <td>15分</td>
                  </tr>
                  <tr>
                    <td>xml_zipped</td>
                    <td>110MB</td>
                    <td>25分</td>
                  </tr>
                  <tr>
                    <td>xml_bzip2</td>
                    <td>46MB</td>
                    <td>20分</td>
                  </tr>
                </tbody>
              </table>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </b-container>
</template>
<style lang="scss" scoped>
.table {
  width: auto;
}
</style>