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
      tiles: xml.querySelectorAll("planquadrat_t").length
    }
  },
  getStations(xml) {
    const width = xml.querySelector("einstellungen_t").childNodes.item(0).textContent

    // 全ての座標
    return [...xml.querySelectorAll("planquadrat_t")]
      .map((n, index) => {
        // 建物属性でない
        const gebaeude_t = n.querySelector('gebaeude_t');
        if (gebaeude_t && gebaeude_t.lastChild.textContent !== '-1') {
          return
        }
        const x = index % width;
        const y = Math.floor(index / width);
        // 各高さ
        return [...n.querySelectorAll('grund_t')]
          .filter(ground_t => ground_t.childNodes.item(3).textContent)
          .map(ground_t => {
            const obj_t = ground_t.querySelector('obj_t');
            const z = parseInt(ground_t.firstChild.textContent, 10);
            return {
              name: ground_t.childNodes.item(3).textContent,
              coordinates: [[x, y, z]],
              player_id: obj_t.childNodes.item(2).textContent,
            }
          })
          .filter(Boolean) //remove null element
      })
      .filter(Boolean)
      .flat()
  },
  getRelations(xml) {
    const stations = [...xml.querySelectorAll("haltestelle_t")];
    console.log(stations);
  },
  getPlayers(xml) {
    const res = xml.querySelector("spieler_t");
    console.log(res);
  },
}