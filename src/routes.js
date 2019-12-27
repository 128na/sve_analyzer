import PageTop from './components/pages/PageTop';
import PageStations from './components/pages/PageStations';
import PageLines from './components/pages/PageLines';
import PageLineDiagram from './components/pages/PageLineDiagram';
import PageUsage from './components/pages/PageUsage';

export default [
  { path: '/', name: 'トップ', component: PageTop },
  { path: '/stations', name: '駅・会社一覧', component: PageStations },
  { path: '/lines', name: '路線一覧', component: PageLines },
  { path: '/diagram', name: '路線図', component: PageLineDiagram },
  { path: '/usage', name: '使い方', component: PageUsage },
];
