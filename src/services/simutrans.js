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
      x: res.childNodes.item(1).textContent,
      y: res.childNodes.item(27).textContent,
      no: res.childNodes.item(3).textContent,
    }
  },
  getStations(xml) {
    const res = xml.querySelector("planquadrat_t");
    console.log(res);
  },
  getRelations(xml) {
    const res = xml.querySelector("haltestelle_t");
    console.log(res);
  },
  getPlayers(xml) {
    const res = xml.querySelector("spieler_t");
    console.log(res);
  },
}