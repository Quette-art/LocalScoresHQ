import test from 'node:test';
import assert from 'node:assert/strict';
import { cleanSnapshot, nextDevice, summarizeDevices } from '../server/siteStats.js';
import handler from '../api/admin/site-stats.js';
import { requireAdmin } from '../server/adminAuth.js';
const snapshot = {deviceId:'11111111-1111-4111-8111-111111111111',pageId:'22222222-2222-4222-8222-222222222222',favorites:['Wise-Varsity']};
test('snapshots reject malformed IDs and only accept known teams, once', () => {
 assert.throws(() => cleanSnapshot({...snapshot,deviceId:'../secret'},new Set()));
 assert.deepEqual(cleanSnapshot({...snapshot,favorites:['Wise-Varsity','Wise-Varsity','fake']},new Set(['Wise-Varsity'])).favorites,['Wise-Varsity']);
});
test('heartbeats do not inflate visits or favorite actions; removal updates current totals', () => {
 const first=nextDevice(null,snapshot,1000); assert.equal(first.views,1); assert.equal(first.adds,0);
 const heartbeat=nextDevice(first,snapshot,61000); assert.equal(heartbeat.views,1);
 const added=nextDevice(heartbeat,{...snapshot,favorites:['Wise-Varsity','Suitland-Varsity']},62000); assert.equal(added.adds,1);
 const removed=nextDevice(added,{...snapshot,favorites:['Suitland-Varsity']},63000); assert.equal(removed.removes,1);
 const reload=nextDevice(removed,{...snapshot,pageId:'33333333-3333-4333-8333-333333333333',favorites:['Suitland-Varsity']},64000);
 assert.equal(reload.views,2);assert.equal(reload.adds,1);
 const sum=summarizeDevices([reload],65000);assert.equal(sum.active5m,1);assert.equal(sum.favorites,1);assert.deepEqual(sum.teams,[{team:'Suitland-Varsity',count:1}]);
 assert.equal(summarizeDevices([reload],64000+300001).active5m,0);
});
test('stats endpoint blocks unsigned access before backend initialization', async () => {
 let status, body;const res={setHeader(){},status(n){status=n;return this;},json(x){body=x;return this;}};
 await handler({method:'GET',headers:{}},res);assert.equal(status,403);assert.match(body.error,/Admin/);
});
test('shared admin authorization refuses ordinary anonymous users and honors explicit allowlists', async () => {
 const old=process.env.LSHQ_ADMIN_EMAILS;process.env.LSHQ_ADMIN_EMAILS='owner@example.com';
 const req={headers:{authorization:'Bearer token'}};
 const auth={verifyIdToken:async()=>({uid:'outsider',firebase:{sign_in_provider:'password'}}),getUser:async()=>({uid:'outsider',email:'other@example.com',providerData:[{providerId:'password'}]})};
 try {await assert.rejects(()=>requireAdmin(req,auth),/Access denied/);auth.getUser=async()=>({uid:'owner',email:'owner@example.com'});assert.equal((await requireAdmin(req,auth)).uid,'owner');}
 finally {if(old===undefined) delete process.env.LSHQ_ADMIN_EMAILS;else process.env.LSHQ_ADMIN_EMAILS=old;}
});
test('client reports favorite changes in order without changing the device identity', async () => {
 const keys=['window','document','localStorage','fetch'];const original=Object.fromEntries(keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
 const storage=new Map([['favoriteTeams','[]']]);const requests=[];
 const set=(key,value)=>Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
 set('window',{location:{pathname:'/'}});set('document',{visibilityState:'visible'});
 set('localStorage',{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)});
 set('fetch',async (url,opts)=>{requests.push(JSON.parse(opts.body));return {ok:true};});
 try {
  const {reportActivity,saveTrackedFavorites}=await import('../src/siteActivity.js');
  reportActivity();saveTrackedFavorites(['Wise-Varsity']);saveTrackedFavorites([]);
  await new Promise(resolve=>setTimeout(resolve,20));
  assert.deepEqual(requests.map(item=>item.favorites),[[],['Wise-Varsity'],[]]);
  assert.equal(new Set(requests.map(item=>item.deviceId)).size,1);
  globalThis.window.location.pathname='/admin/stats';reportActivity();
  await new Promise(resolve=>setTimeout(resolve,10));assert.equal(requests.length,3);
 } finally {for(const key of keys){if(original[key])Object.defineProperty(globalThis,key,original[key]);else delete globalThis[key];}}
});
