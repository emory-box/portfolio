// Source-space positions and connections transcribed from slides 20 and 29–33.2.
// Coordinates are centres in the original 1920×1080 canvas; no auto-layout.
const diagrams=[];
function graph(id,title,slide,viewBox,rows){
 const g={id,title,slide,viewBox,nodes:rows.map(([id,label,x,y,w=150,h=62,type='rect',accent=false])=>({id,label,x,y,w,h,type,accent})),edges:[]};
 g.edge=(from,to,options={})=>{g.edges.push({from,to,...options});return g;};
 g.chain=(...ids)=>{ids.slice(1).forEach((id,i)=>g.edge(ids[i],id));return g;};
 diagrams.push(g);return g;
}
let g=graph('sitemap','Site map',20,'15 155 1890 835',[
 ['login','Log in/ Sign up',445,214,158,62],['onboarding','Onboarding',445,297,158,62],['dashboard','Dashboard',445,381,158,62,'rect',true],
 ['scan','Scan',194,484,158,62],['recent','Recent gardens view',445,484,198,62],['info','Info of a garden',677,487,136,62],['add','Add Device',115,654,164,92],['ai','AI Detect',284,654,164,92],
 ['general','General info',463,654,136,92],['weather','Weather',604,654,136,92],['environment','Environment|Info|(overall)',745,654,136,92],['devices','Devices State',886,654,136,92],
 ['list','Garden list',1206,381,158,62,'rect',true],['each','Info of each garden',1206,487,416,62],['each-general','General info',1058,654,136,92],['each-environment','Environment|Info|(Detail)',1206,654,136,92],['control','Control panel',1354,654,136,92],
 ['automation','Automation',1651,381,158,62,'rect',true],['manual','Manual',1571,487,158,62],['smart','Smart',1740,487,158,62],['weekly','Weekly',1513,655,158,92],['daily','Daily',1687,658,158,92],
 ['settings','Setting',1462,835,158,62,'rect',true],['profile','Profile',1277,938,158,62],['settings-general','General',1462,938,158,62],['support','Support',1632,938,158,62]
]);
g.chain('login','onboarding','dashboard','list','automation');
for(const id of ['scan','recent','info'])g.edge('dashboard',id,{fromPort:'bottom',toPort:'top',via:[[445,432],[g.nodes.find(n=>n.id===id).x,432]]});
for(const id of ['add','ai'])g.edge('scan',id,{fromPort:'bottom',toPort:'top',via:[[194,562],[g.nodes.find(n=>n.id===id).x,562]]});
for(const id of ['general','weather','environment','devices'])g.edge('info',id,{fromPort:'bottom',toPort:'top',via:[[677,562],[g.nodes.find(n=>n.id===id).x,562]]});
g.edge('list','each');for(const id of ['each-general','each-environment','control'])g.edge('each',id,{fromPort:'bottom',toPort:'top',via:[[1206,562],[g.nodes.find(n=>n.id===id).x,562]]});
g.edge('automation','manual',{fromPort:'bottom',toPort:'top',via:[[1651,434],[1571,434]]}).edge('automation','smart',{fromPort:'bottom',toPort:'top',via:[[1651,434],[1740,434]]});
for(const id of ['weekly','daily'])g.edge('manual',id,{fromPort:'bottom',toPort:'top',via:[[1571,564],[g.nodes.find(n=>n.id===id).x,564]]});
g.edge('automation','settings',{fromPort:'right',toPort:'right',via:[[1855,381],[1855,835]]});
for(const id of ['profile','settings-general','support'])g.edge('settings',id,{fromPort:'bottom',toPort:'top',via:[[1462,887],[g.nodes.find(n=>n.id===id).x,887]]});

g=graph('sign-in','Signin/ Signup',29,'75 350 1745 335',[
 ['open','Open|App',148,577,104,104,'circle'],['account','Already|have|account?',330,577,198,170,'diamond'],['signup','Signup',608,429,146,30],['new-info','Type in|Info',806,429,104,104,'circle'],['otp','OTP Verifying',971,429,146,30],['otp-code','Type in|OTP code',1134,429,104,104,'circle'],['new-confirm','Confirm',1351,429,104,104,'circle'],
 ['signin','Signin',608,577,146,30],['info','Type in|Info',806,577,104,104,'circle'],['confirm','Confirm',971,577,104,104,'circle'],['onboarding','Onboarding',1532,577,146,30],['dashboard','Dashboard',1732,577,146,30]
]);
g.chain('open','account');g.edge('account','signup',{fromPort:'top',toPort:'left',via:[[330,429]],label:'No',lx:452,ly:429});g.chain('signup','new-info','otp','otp-code','new-confirm');
g.edge('new-confirm','onboarding',{via:[[1431,429],[1431,577]]});g.edge('account','signin',{label:'Yes',lx:470,ly:577});g.chain('signin','info','confirm','onboarding','dashboard');

g=graph('environment','View the environmental parameters of a garden',30,'65 330 1755 335',[
 ['dashboard','Dashboard',198,495,220,48],['choose-list','Choose List',446,495,160,160,'circle'],['list','List of gardens',712,495,220,48],['choose','Choose a|garden',976,495,160,160,'circle'],['detail','Detail of a garden',1224,495,220,48],['environment','Select “detail”|of|environment|dada section',1474,495,160,160,'circle'],['data','Environment dada',1699,495,220,48]
]);g.chain('dashboard','choose-list','list','choose','detail','environment','data');

g=graph('ai-detect','AI Detect',30,'65 670 1780 405',[
 ['dashboard','Dashboard',176,821,176,38],['choose','Choose AI|Detect',474,821,128,128,'circle'],['screen','AI Detect detect sc...',707,821,180,38],['detect','Detect',926,821,128,128,'circle'],['plant','Plant info',1142,821,176,38],['tabs','Switch|between|tabs for...',1362,821,128,128,'circle'],['save','Save|photo?',1556,821,128,114,'diamond'],['yes','Choose|save',1834,758,128,128,'circle'],['no','Back',1834,1003,128,128,'circle']
]);g.chain('dashboard','choose','screen','detect','plant','tabs','save');
g.edge('save','yes',{fromPort:'top',toPort:'left',via:[[1556,694]],label:'Yes',lx:1660,ly:694}).edge('save','no',{fromPort:'bottom',toPort:'left',via:[[1556,1003]],label:'No',lx:1660,ly:1003});
// The AI diagram extends to x=1898 in the supplied capture.
g.viewBox='65 670 1845 405';

g=graph('remote-control','Remote control',31,'105 125 1675 895',[
 ['dashboard','Dashboard',201,397,146,30],['list-choice','Choose|List',478,397,104,104,'circle'],['list','List of gardens',652,397,146,30],['garden','Choose a|garden',829,397,104,104,'circle'],['detail','Detail of a|garden',979,397,146,66],['all','Control|all?',1163,397,146,128,'diamond'],
 ['all-start','Choose start|of each type|of device',1344,213,144,144,'circle'],['kind','Choose|detail of a|type of|device',1344,397,144,144,'circle'],['screen','Screen of devices|of the same type',1531,397,166,66],['many','Control|many|devices?',1520,890,188,160,'diamond'],['multi','Choose|Multi-|control',1520,670,104,104,'circle'],['sheet-multi','Sheet multiselect',1332,670,168,30],['devices','Choose|many|devices',1165,670,104,104,'circle'],
 ['device','Choose a|device',1292,890,104,104,'circle'],['start','Choose|Start',1165,890,104,104,'circle'],['settings','Setting sheet',971,890,166,58],['setup','Set up',766,890,104,104,'circle'],['save','Save?',605,890,164,146,'diamond'],['save-choice','Choose|save',334,703,104,104,'circle'],['run','Run?',180,703,104,94,'diamond'],['run-choice','Choose|run',180,890,104,104,'circle']
]);g.chain('dashboard','list-choice','list','garden','detail','all');
g.edge('all','all-start',{fromPort:'top',toPort:'left',via:[[1163,213]],label:'Yes',lx:1236,ly:213});
g.edge('all-start','settings',{fromPort:'right',toPort:'bottom',via:[[1757,213],[1757,1000],[971,1000]]});
g.edge('all','kind',{label:'No',lx:1253,ly:397});g.edge('kind','screen');g.edge('screen','many',{fromPort:'right',toPort:'right',via:[[1645,397],[1645,890]]});
g.edge('many','multi',{fromPort:'top',toPort:'bottom',label:'Yes',lx:1520,ly:767});g.chain('multi','sheet-multi','devices','start');g.edge('many','device',{label:'No',lx:1386,ly:890});g.chain('device','start','settings','setup','save');
g.edge('save','save-choice',{fromPort:'top',toPort:'right',via:[[605,703]],label:'Yes',lx:460,ly:703});g.edge('save','run-choice',{label:'No',lx:460,ly:890});g.edge('save-choice','run');g.edge('run','run-choice',{fromPort:'bottom',toPort:'top',label:'Yes',lx:180,ly:795});g.edge('run','detail',{fromPort:'top',toPort:'bottom',via:[[180,544],[979,544]],label:'No',lx:180,ly:596});

g=graph('create-schedule','Create a schedule for automated operation',32,'35 150 1845 870',[
 ['dashboard','Dashboard',121,932,140,30],['choose','Choose|Schedule',300,932,108,108,'circle'],['screen','Schedule Screen',466,932,160,30],['create-type','Create|schedule for|one type of|device',650,932,140,140,'circle'],['sprinkle','Sprinkle',855,932,146,128,'diamond'],['fan','Fan',1285,932,146,128,'diamond'],['light','Light',1626,932,140,128,'diamond'],
 ['sprinkle-sheet','Sheet of 2 types of schedule',856,808,260,30],['sprinkle-mode','Ma...',856,730,102,86,'diamond'],['weekly-daily','Weekly/|Daily',694,630,160,132,'diamond'],['weekly','Manual (weekly)',576,546,180,30],['daily','Manual (daily)',826,546,168,30],['day','Choose|day in|week',576,445,120,120,'circle'],['sprinkle-frequency','Choose|frequency',694,281,110,110,'circle'],['soil','Smart (weather+ soil moisture)',986,631,268,46],['soil-preference','Choose|base on|Preference',986,445,126,120,'circle'],
 ['fan-mode','Manual/|Smart',1285,730,146,124,'diamond'],['air','Smart (temperature, air humidity)',1429,628,268,46],['air-preference','Choose|base on|Preference',1429,445,126,120,'circle'],['fan-frequency','Choose|frequency',1160,281,110,110,'circle'],['light-frequency','Choose|frequency',1626,281,114,114,'circle'],['create','Create',1817,208,102,102,'circle']
]);g.chain('dashboard','choose','screen','create-type','sprinkle');g.edge('sprinkle','fan',{label:'No',lx:1070,ly:932});g.edge('fan','light',{label:'No',lx:1455,ly:932});g.edge('light','light-frequency',{fromPort:'top',toPort:'bottom'});
g.edge('sprinkle','sprinkle-sheet',{fromPort:'top',toPort:'bottom',label:'Yes',lx:856,ly:847});g.chain('sprinkle-sheet','sprinkle-mode');
g.edge('sprinkle-mode','weekly-daily',{label:'Manual',lx:747,ly:730,fromPort:'left',toPort:'bottom',via:[[694,730]]});
g.edge('weekly-daily','weekly',{fromPort:'left',toPort:'bottom',via:[[576,630]],label:'Weekly',lx:576,ly:598});g.edge('weekly-daily','daily',{fromPort:'right',toPort:'bottom',via:[[826,630]],label:'Daily',lx:826,ly:598});
g.chain('weekly','day');g.edge('day','sprinkle-frequency',{fromPort:'top',toPort:'bottom',via:[[576,368],[694,368]]});g.edge('daily','sprinkle-frequency',{fromPort:'top',toPort:'bottom',via:[[826,368],[694,368]]});
g.edge('sprinkle-mode','soil',{fromPort:'right',toPort:'bottom',via:[[986,730]],label:'Smart',lx:947,ly:730});g.chain('soil','soil-preference');
g.edge('fan','fan-mode',{fromPort:'top',toPort:'bottom',label:'Yes',lx:1285,ly:831});g.edge('fan-mode','fan-frequency',{fromPort:'left',toPort:'bottom',via:[[1160,730]],label:'Manual',lx:1180,ly:730});
g.edge('fan-mode','air',{fromPort:'right',toPort:'bottom',via:[[1429,730]],label:'Smart',lx:1429,ly:690});g.chain('air','air-preference');
for(const id of ['sprinkle-frequency','soil-preference','fan-frequency','air-preference','light-frequency'])g.edge(id,'create',{fromPort:'top',toPort:'left',via:[[g.nodes.find(n=>n.id===id).x,208]]});

g=graph('apply-schedule','Apply schedule to the control device',33.1,'75 155 1755 760',[
 ['dashboard','Dashboard',164,506,152,32],['choose','Choose|List',369,506,110,110,'circle'],['list','List of gardens',552,506,152,32],['garden','Choose a|garden',738,506,110,110,'circle'],['detail','Detail of a garden',896,506,152,32],['all','Apply|all?',1090,506,152,132,'diamond'],['all-edit','Choose edit|schedule in|control panel',1250,241,146,146,'circle'],['kind','Choose detail|of a type of|device',1350,506,152,146,'circle'],['screen','Screen of devices of the same type',756,826,300,62],['device','Choose a|device to|apply the|schedule',1062,826,152,152,'circle'],['schedule','Sheet to choose schedule',1492,826,244,62],['confirm','Choose|and|confirm',1767,826,110,110,'circle']
]);g.chain('dashboard','choose','list','garden','detail','all');g.edge('all','all-edit',{fromPort:'top',toPort:'left',via:[[1090,241]],label:'Yes',lx:1090,ly:340});g.edge('all-edit','schedule',{fromPort:'right',toPort:'top',via:[[1492,241]]});g.edge('all','kind',{label:'No',lx:1220,ly:506});g.edge('kind','screen',{fromPort:'right',toPort:'left',via:[[1455,506],[1455,688],[574,688],[574,826]]});g.chain('screen','device','schedule','confirm');

g=graph('add-device','Add a device',33.2,'75 275 1785 785',[
 ['dashboard','Dashboard',163,378,150,32],['add','Choose|Add|device',317,378,112,112,'circle'],['scan','Add device|scan screen|(scan)',472,378,150,108],['choose-added','Choose Add|device after|the device is|scanned',644,378,146,146,'circle'],['loading','Loading',814,378,150,32],['success','Success',991,378,150,32],['next','Choose|next',1158,378,112,112,'circle'],['checking','Checking data|value/ Checking|control',1333,378,166,108],['successful','Successful?',1558,378,210,182,'diamond'],['next-two','Choose|next',1776,378,112,112,'circle'],['retry','Try again/ Disable',1558,556,206,52],
 ['setup','Setting|up',164,979,90,68],['have-garden','Have a|garden?',303,979,150,132,'diamond'],['garden','Choose a|garden',526,979,112,112,'circle'],['name','Name the|device',657,979,112,112,'circle'],['plant','Add plant?',825,979,186,100,'diamond'],['toggle','Toggle on',813,793,112,112,'circle'],['add-plant','Choose|Add',945,793,112,112,'circle'],['plant-list','Plant List',1078,793,100,32],['choose-plant','Choose a|plant',1219,793,112,112,'circle'],['plant-info','Info of|the plant',1349,793,94,76],['confirm','Confirm',1492,793,112,112,'circle'],['added','Setting up (with|plant added)',1672,793,162,76],['done','Done',1776,979,112,112,'circle'],
 ['new-garden','Create|new|garden',599,793,112,112,'circle'],['info-sheet','Info sheet',599,701,134,32],['garden-info','Add|garden|info',451,701,112,112,'circle'],['complete','Complete',303,701,112,112,'circle']
]);g.chain('dashboard','add','scan','choose-added','loading','success','next','checking','successful');g.edge('successful','next-two',{label:'Yes',lx:1692,ly:378});g.edge('successful','retry',{fromPort:'bottom',toPort:'top',label:'No',lx:1558,ly:500});g.edge('retry','scan',{fromPort:'left',toPort:'bottom',via:[[472,556]]});g.edge('next-two','setup',{fromPort:'bottom',toPort:'top',via:[[1776,602],[164,602]]});g.chain('setup','have-garden');g.edge('have-garden','garden',{label:'Yes',lx:424,ly:979});g.chain('garden','name','plant');g.edge('plant','done',{label:'No',lx:1320,ly:979});g.edge('plant','toggle',{fromPort:'top',toPort:'left',via:[[825,891],[726,891],[726,793]],label:'Yes',lx:775,ly:891});g.chain('toggle','add-plant','plant-list','choose-plant','plant-info','confirm','added');g.edge('added','done',{fromPort:'right',toPort:'top',via:[[1776,793]]});g.edge('have-garden','new-garden',{fromPort:'top',toPort:'bottom',via:[[303,881],[599,881]],label:'No',lx:451,ly:881});g.chain('new-garden','info-sheet','garden-info','complete');g.edge('complete','setup',{fromPort:'left',toPort:'top',via:[[164,701]]});

module.exports=diagrams;
