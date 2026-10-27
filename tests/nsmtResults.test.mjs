import test from 'node:test';
import assert from 'node:assert/strict';
import { games } from '../src/data/games.js';
import { hasFinal, calculateTeamRecords } from '../src/dashboardUtils.js';
import { favoriteSummary } from '../src/teamSummary.js';
import { classifyGameNotification } from '../src/notificationPolicy.js';

test('approved NSMT finals match all eleven tracked matchups exactly once', () => {
  const expected = [
    ['fb-2026-10-24-dematha-st-johns',0,12,'2026-10-24'],
    ['fb-2026-10-24-episcopal-landon',47,7,'2026-10-24'],
    ['fb-2026-10-24-bell-h-d-woodson',38,0,'2026-10-24'],
    ['fb-2026-10-24-sidwell-friends-maret',7,42,'2026-10-24'],
    ['fb-2026-10-23-st-stephens-st-agnes-st-john-paul-the-great',37,18,'2026-10-23'],
    ['fb-2026-10-24-flint-hill-st-james',6,34,'2026-10-24'],
    ['md-fb-2026-10-23-fairmont-heights-frederick-douglass',9,36,'2026-10-23'],
    ['md-fb-2026-10-23-flowers-potomac',34,7,'2026-10-24'],
    ['md-fb-2026-10-23-bladensburg-oxon-hill',0,56,'2026-10-24'],
    ['md-fb-2026-10-23-laurel-eleanor-roosevelt',20,17,'2026-10-24'],
    ['md-fb-2026-10-23-gwynn-park-friendly','W','L','2026-10-23'],
  ];
  for (const [id,a,b,date] of expected) {
    const matching = games.filter(g=>g.id===id);
    assert.equal(matching.length,1,id);
    const [g]=matching;
    assert.deepEqual([g.score1,g.score2,g.date],[a,b,date],id);
    assert.equal(hasFinal(g),true,id);
    const records=calculateTeamRecords([g]);
    assert.equal(records.find(r=>r.team === (a>b ? g.team1:g.team2)).wins,1,id);
    assert.equal(records.find(r=>r.team === (a>b ? g.team2:g.team1)).losses,1,id);
  }
});

test('forfeit counts a win/loss without fabricated points or a tie', () => {
  const g=games.find(g=>g.id==='md-fb-2026-10-23-gwynn-park-friendly');
  assert.equal(g.forfeit,true);
  const rows=calculateTeamRecords([g]);
  for(const r of rows) assert.deepEqual([r.pointsFor,r.pointsAgainst,r.ties],[0,0,0]);
  const summary=favoriteSummary({teamName:g.team1,sport:g.sport,division:g.division},[g],'2026-10-27');
  assert.equal(summary.result.outcome,'W');
  assert.equal(summary.result.ownScore,'W');
  assert.equal(classifyGameNotification({...g,score1:100,score2:0,forfeit:false},g),'score');
  assert.equal(hasFinal({...g,score1:'W',score2:'W'}),false);
});
