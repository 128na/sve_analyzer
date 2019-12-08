export default {
  getSimutransInfo(xml) {
    const res = xml.querySelector("Simutrans");
    return {
      version: res.getAttribute("version"),
      pak: res.getAttribute("pak")
    }
  },
  getMapInfo(xml) {
    const res = xml.querySelector("einstellungen_t");
    // [...res.childNodes].map((n, i) => console.log(i, n.textContent))

    return {
      width: res.childNodes.item(0).textContent,
      depth: res.childNodes.item(13).textContent,
      no: res.childNodes.item(1).textContent,
    }
  },
  /**
   * 各駅の座標一覧を取得する
   */
  getStations(xml) {
    return [...xml.querySelectorAll("haltestelle_t")]
      .map(s => {
        return {
          id: parseInt(s.childNodes.item(0).textContent, 10),
          player_id: parseInt(s.childNodes.item(1).textContent, 10),
          coordinates: [...s.querySelectorAll('koord3d')].map(k => [
            parseInt(k.childNodes.item(0).textContent, 10),
            parseInt(k.childNodes.item(1).textContent, 10),
            parseInt(k.childNodes.item(2).textContent, 10)
          ])
        }
      })
  },
  /**
   * 各駅の座標一覧に駅情報をマージする
   */
  mergeStationInfo(stations, xml) {
    const width = xml.querySelector("einstellungen_t").childNodes.item(0).textContent;

    /**
     * 個々の要素はインデックスから算出する必要があるためフィルタせずに全ての座標をパースする
     */
    [...xml.querySelectorAll("planquadrat_t")]
      .map((n, index) => {
        const x = index % width;
        const y = Math.floor(index / width);
        // マス内の各高さで名前のついているもの
        [...n.querySelectorAll('grund_t')]
          .filter(ground_t => ground_t.childNodes.item(3).textContent)
          .map(ground_t => {
            const z = parseInt(ground_t.firstChild.textContent, 10);
            const coordinate = [x, y, z];

            const obj_t = ground_t.querySelector('obj_t');
            const player_id = parseInt(obj_t.childNodes.item(2).textContent, 10);
            const info = {
              name: ground_t.childNodes.item(3).textContent,
            };

            stations = this.mergeStationInfoBy(stations, coordinate, player_id, info);
          })
      });
    return stations;
  },
  mergeStationInfoBy(stations, coordinate, player_id, info) {
    return stations.map(s => {
      const has_coordinate = s.coordinates.findIndex(c => c[0] === coordinate[0] && c[1] === coordinate[1] && c[2] === coordinate[2]) !== -1;
      const match_player_id = s.player_id === player_id;
      if (has_coordinate && match_player_id) {
        return Object.assign({}, s, info);
      }
      return s;
    })
  },
  getPlayers(xml) {
    const begin_player = [...xml.querySelector("einstellungen_t").childNodes].findIndex(n => n.textContent === 'ja');
    const players = [...Array(16)].map((_, i) => begin_player + 2 * (i + 1))
      .map(no => {
        return {
          // 0 non active, 1 user, 2:AI freight, 3:AI passenger ,4:scripted AI
          type: parseInt(xml.querySelector("einstellungen_t").childNodes.item(no).textContent, 10)
        }
      });
    [...xml.querySelectorAll("spieler_t")]
      .map((p, index) => {
        players[index].name = p.childNodes.item(p.childNodes.length - 2).textContent
      });
    return players;
  },
}