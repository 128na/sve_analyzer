<template>
  <div>
    <div>
      <strong>ファイル情報</strong>
      <p>名前：{{ info.file.name }}</p>
      <p>サイズ：{{ toKB(info.file.size) }} KB</p>
    </div>
    <div>
      <strong>セーブデータ情報</strong>
      <p>バージョン：{{ info.simutrans.version }}</p>
      <p>pak:{{ info.simutrans.pak }}</p>
    </div>
    <div>
      <strong>マップ情報</strong>
      <p>No：{{ info.map.no }}</p>
      <p>横:{{ info.map.width }}</p>
      <p>縦:{{ info.map.depth }}</p>
    </div>
    <div>
      <strong>駅情報</strong>
      <table>
        <thead>
          <th>ID</th>
          <th>所有者ID</th>
          <th>名前</th>
          <th>座標</th>
        </thead>
        <tbody>
          <tr v-for="station in info.stations" :key="station.id">
            <td>{{ station.id }}</td>
            <td>{{ station.player_id }}</td>
            <td>{{ station.name }}</td>
            <td>{{ station.coordinates.map(c=> `[${c[0]}, ${c[1]}, ${c[2]}]`).join(', ') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { toKB } from "../helper";
export default {
  props: ["info"],
  methods: {
    toKB(number = 0) {
      return toKB(number);
    }
  }
};
</script>