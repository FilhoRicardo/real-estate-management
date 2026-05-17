/* Real Estate Management Obsidian plugin */
"use strict";var Y=Object.defineProperty;var ie=Object.getOwnPropertyDescriptor;var ae=Object.getOwnPropertyNames;var oe=Object.prototype.hasOwnProperty;var ce=(n,r)=>{for(var t in r)Y(n,t,{get:r[t],enumerable:!0})},le=(n,r,t,e)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of ae(r))!oe.call(n,s)&&s!==t&&Y(n,s,{get:()=>r[s],enumerable:!(e=ie(r,s))||e.enumerable});return n};var de=n=>le(Y({},"__esModule",{value:!0}),n);var Me={};ce(Me,{default:()=>H});module.exports=de(Me);var l=require("obsidian");function I(n){let r=n.match(/^---\n([\s\S]*?)\n---/);if(!r)return{};let t={},e=null;for(let s of r[1].split(`
`))if(/^  - /.test(s)){let i=s.replace(/^  - /,"").trim().replace(/^["']|["']$/g,"");e&&Array.isArray(t[e])&&t[e].push(i)}else{let i=s.match(/^(\w+):\s*(.*)/);if(!i)continue;e=i[1];let o=i[2].trim();o?o[0]==="["?t[e]=o.slice(1,-1).split(",").map(a=>a.trim().replace(/^["']|["']$/g,"")):t[e]=o.replace(/^["']|["']$/g,""):t[e]=[]}return t}var C=n=>n?n.replace(/^\[\[|\]\]$/g,""):null,pe=n=>n.replace(/\\/g,"/").split("/").pop(),X=n=>pe(n).replace(/\.md$/i,"");var ue=n=>{if(n.match(/^(\d{4})-(\d{2})-(\d{2})$/))return n;let t=n.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!t)return null;let[,e,s,i]=t;return`${i}-${String(Number(s)).padStart(2,"0")}-${String(Number(e)).padStart(2,"0")}`};function he(n){let r=[],t=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})(?:\]\])?[ \t]*(?=\n|$)/g,e=[...n.matchAll(t)].map(s=>({date:ue(s[2]),start:s.index+s[1].length,end:s.index+s[0].length})).filter(s=>s.date);return e.forEach((s,i)=>{var a,c;[...n.slice(s.end,(c=(a=e[i+1])==null?void 0:a.start)!=null?c:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(u=>{let d=u[1].trim();d&&r.push({date:s.date,text:d,order:r.length})})}),r.sort((s,i)=>s.date.localeCompare(i.date)||s.order-i.order),r.forEach(s=>{delete s.order}),r}function J(n,r){let t=I(r),e=t.title||X(n),s=[...r.matchAll(/- \[([ x])\] (.+)/g)].map(a=>({done:a[1]==="x",text:a[2]})),i=he(r),o=Array.isArray(t.tags)?t.tags:t.tags?[t.tags]:[];return{id:n,title:e,filename:X(n),priority:t.priority||"normal",status:t.status||"none",due:t.due||null,scheduled:t.scheduled||null,dateCreated:t.dateCreated||null,dateModified:t.dateModified||null,contexts:Array.isArray(t.contexts)?t.contexts:t.contexts?[t.contexts]:[],client:C(t.client),building:C(t.building),projects:Array.isArray(t.projects)?t.projects.map(C):t.projects?[C(t.projects)]:[],waitingfor:C(t.waitingfor),tags:o,archived:o.includes("archived"),recurrent:t.recurrent==="true"||t.Recurrent==="true"||o.includes("recurrent")||o.includes("recurring"),recurrence:t.recurrence||null,completeInstances:Array.isArray(t.complete_instances)?t.complete_instances:[],skippedInstances:Array.isArray(t.skipped_instances)?t.skipped_instances:[],completedDate:t.completedDate||null,checklist:s,checklistDone:s.filter(a=>a.done).length,checklistTotal:s.length,logs:i,raw:r}}var P="real-estate-management-view",V="real-estate-management",_={tasksFolder:"Real Estate Management/Tasks",clientsFolder:"Real Estate Management/Clients",propertiesFolder:"Real Estate Management/Properties",peopleFolder:"Real Estate Management/People",projectsFolder:"Real Estate Management/Projects",meetingsFolder:"Real Estate Management/Meetings",dailyFolder:"Real Estate Management/Daily Logs",doneFolder:"Real Estate Management/Done"};function y(){let n=new Date,r=t=>String(t).padStart(2,"0");return`${n.getFullYear()}-${r(n.getMonth()+1)}-${r(n.getDate())}`}function F(n,r){let t=new Date(`${n}T12:00:00`);t.setDate(t.getDate()+r);let e=s=>String(s).padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}function ge(n){var e,s;let r=String(n||"").toLowerCase();if(r.includes("daily"))return 1;if(r.includes("monthly"))return 30;if(r.includes("quarter"))return 91;if(r.includes("year"))return 365;let t=((e=r.match(/interval=(\d+)/i))==null?void 0:e[1])||((s=r.match(/every\s+(\d+)/i))==null?void 0:s[1]);return t&&Number(t)||7}function L(n){return n.replace(/\\/g,"/").replace(/^\/+|\/+$/g,"")}function me(n){return n.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g,"-").replace(/\s+/g," ").replace(/[. ]+$/g,"").slice(0,180)||"Untitled"}function fe(n){let r=n.basename.trim().toLowerCase();return r==="index"||r.startsWith("_")||n.name==="timetracker.md"}function T(n,r){let t=L(r);return t.length>0&&n.path.startsWith(`${t}/`)}function B(n){return Array.isArray(n)?n.map(String).filter(Boolean):n?[String(n)].filter(Boolean):[]}function j(n){let r=n.trim();return r?r.startsWith("[[")&&r.endsWith("]]")?r:`[[${r}]]`:""}function M(n){return n.split(",").map(r=>r.trim()).filter(Boolean).map(j)}function W(n){return n.map(r=>r.replace(/^\[\[/,"").replace(/\]\]$/,"")).join(", ")}function x(n){return Array.isArray(n)?String(n[0]||""):String(n||"")}function ye(n,r){return r==="task"?n.tasksFolder:r==="client"?n.clientsFolder:r==="property"?n.propertiesFolder:r==="person"?n.peopleFolder:r==="project"?n.projectsFolder:r==="meeting"?n.meetingsFolder:n.dailyFolder}function ke(n,r,t){let e=String(r.remType||"").toLowerCase();return["task","client","property","person","project","meeting","daily"].includes(e)?e:T(n,t.tasksFolder)||T(n,t.doneFolder)?"task":T(n,t.clientsFolder)?"client":T(n,t.propertiesFolder)?"property":T(n,t.peopleFolder)?"person":T(n,t.projectsFolder)?"project":T(n,t.meetingsFolder)?"meeting":T(n,t.dailyFolder)?"daily":null}function $e(n,r,t){var s,i;let e=(i=(s=r.match(/^#\s+(.+)$/m))==null?void 0:s[1])==null?void 0:i.trim();return x(t.title||t.name||t.person||t.building)||e||n.basename}function ve(n,r,t){let e=I(r),s=ke(n,e,t);if(!s)return null;if(s==="task"&&!e.remType){let i=J(n.path,r);return{kind:s,file:n,title:i.title,status:i.status,priority:i.priority,due:i.due,scheduled:i.scheduled,date:i.dateCreated,client:i.client,property:i.building,people:i.waitingfor?[i.waitingfor]:[],projects:i.projects||[],tasks:[],legacy:!0,description:O(r),notes:i.logs||[],raw:r,body:O(r),recurrent:i.recurrent,recurrence:i.recurrence}}return{kind:s,file:n,title:$e(n,r,e),status:x(e.status)||(s==="task"?"open":"active"),priority:x(e.priority)||"normal",due:x(e.due)||null,scheduled:x(e.scheduled)||null,date:x(e.date||e.created||e.dateCreated)||null,client:x(e.client)||null,property:x(e.property||e.building)||null,people:B(e.people||e.person),projects:B(e.projects||e.project),tasks:B(e.tasks||e.task),legacy:!e.remType,description:s==="task"?O(r):"",notes:Ee(r),raw:r,body:we(r,s),recurrent:x(e.recurrent)==="true"||B(e.tags).includes("recurrent"),recurrence:x(e.recurrence)||null}}function b(n,r){let e=new RegExp(`(^|\\n)##\\s+${r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}[ \\t]*(?=\\n|$)`,"i").exec(n);if(!e)return"";let s=e.index+e[0].length,i=n.slice(s),o=i.search(/\n##\s+/),a=i.search(/\n---[ \t]*(?=\n|$)/),c=[o,a].filter(d=>d>=0),u=c.length?Math.min(...c):i.length;return i.slice(0,u).trim()}function O(n){let r=b(n,"Description");return r||n.replace(/^---\n[\s\S]*?\n---\n?/,"").split(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/)[0].replace(/^#\s+.+\n?/,"").replace(/^#{1,6}\s+Task descri(?:p)?tion\s*\n?/i,"").trim()}function we(n,r){return r==="task"?O(n):n.replace(/^---\n[\s\S]*?\n---\n?/,"").replace(/^#\s+.+\n?/,"").split(/\n---[ \t]*(?=\n|$)/)[0].trim()}function Ee(n){let r=[],t=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2})(?:\]\])?[ \t]*(?=\n|$)/g,e=[...n.matchAll(t)].map(s=>({date:s[2],start:s.index+s[1].length,end:s.index+s[0].length}));return e.forEach((s,i)=>{var a,c;[...n.slice(s.end,(c=(a=e[i+1])==null?void 0:a.start)!=null?c:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(u=>{let d=u[1].trim();d&&r.push({date:s.date,text:d})})}),r.sort((s,i)=>s.date.localeCompare(i.date))}function ne(n=new Date){return n.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!1})}function Z(n,r){let t=y(),e=`Log: [${ne()}] ${r.trim()}`,s=`### [[${t}]]`,i=new RegExp(`(^|\\n)### (?:\\[\\[)?${t}(?:\\]\\])?[ \\t]*(?=\\n|$)`).exec(n);if(i){let c=i.index+i[0].length,d=n.slice(c).search(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/),$=d===-1?n.length:c+d,h=n.slice(c,$).search(/\n---[ \t]*(?=\n|$)/);if(h!==-1){let g=c+h;return`${n.slice(0,g).trimEnd()}
${e}

${n.slice(g).replace(/^\n+/,"")}`}return`${n.slice(0,$).trimEnd()}
${e}

---
${n.slice($).replace(/^\n+/,"")}`}let o=`

${s}
${e}

---
`,a=/(^|\n)##\s+Notes[ \t]*(?=\n|$)/i.exec(n);if(a){let c=a.index+a[0].length;return`${n.slice(0,c).trimEnd()}${o}${n.slice(c).replace(/^\n+/,"")}`}return`${n.trimEnd()}

## Notes${o}`}function De(n,r,t){let e=t.trim();if(!e)return n;let i=new RegExp(`(^|\\n)##\\s+${r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}[ \\t]*(?=\\n|$)`,"i").exec(n),o=`- ${e}`;if(!i)return`${n.trimEnd()}

## ${r}

${o}
`;let a=i.index+i[0].length,u=n.slice(a).search(/\n##\s+/),d=u===-1?n.length:a+u;return`${n.slice(0,d).trimEnd()}
${o}
${n.slice(d)}`}function Re(n,r){let t=`| ${ne()} | ${r} |`,e=/(^|\n)##\s+Time Clock[ \t]*(?=\n|$)/i.exec(n);if(!e)return`${n.trimEnd()}

## Time Clock

| Time | Event |
| --- | --- |
${t}

---
`;let s=e.index+e[0].length,o=n.slice(s).search(/\n##\s+/),a=o===-1?n.length:s+o,c=n.slice(s,a);if(!/\|\s*Time\s*\|\s*Event\s*\|/i.test(c))return`${n.slice(0,s).trimEnd()}

| Time | Event |
| --- | --- |
${t}

---
${n.slice(a).replace(/^\n+/,"")}`;let u=c.search(/\n---[ \t]*(?=\n|$)/);if(u!==-1){let d=s+u;return`${n.slice(0,d).trimEnd()}
${t}

${n.slice(d).replace(/^\n+/,"")}`}return`${n.slice(0,a).trimEnd()}
${t}

---
${n.slice(a).replace(/^\n+/,"")}`}function xe(n){return/^---\n[\s\S]*?\n---/.test(n)?n:`---
---

${n.trimStart()}`}function Se(n,r,t){let e=xe(n),s=e.match(/^---\n([\s\S]*?)\n---/);if(!s)return e;let i=s[1],o=`${r}: ${t}`,a=new RegExp(`^${r}:.*$`,"m");return`---
${a.test(i)?i.replace(a,o):`${i.trimEnd()}
${o}`}
---${e.slice(s[0].length)}`}function ee(n,r){return Object.entries(r).reduce((t,[e,s])=>Se(t,e,s),n)}function se(n){return String(n||"").replace(/^\[\[/,"").replace(/\]\]$/,"").split("|")[0].trim().toLowerCase()}function Te(n){return new Set([n.title,n.file.basename,`[[${n.title}]]`,`[[${n.file.basename}]]`].map(se).filter(Boolean))}function Fe(n,r){return n.some(t=>r.has(se(t)))}function be(n,r){if(n.file.path===r.file.path)return!1;let t=Te(r);return Fe([n.client,n.property,...n.people,...n.projects,...n.tasks],t)}function R(n){return n.length?`
${n.map(r=>`  - "${r.replace(/"/g,'\\"')}"`).join(`
`)}`:"[]"}function E(n){return`"${n.replace(/"/g,'\\"')}"`}function Le(n){let r=n.title.trim(),t=y(),e=j(n.client),s=j(n.property),i=M(n.people),o=M(n.projects),a=M(n.tasks),c=n.body.trim();if(n.kind==="task")return`---
remType: task
title: ${E(r)}
status: ${n.status||"open"}
priority: ${n.priority||"normal"}
due: ${n.due||""}
scheduled: ${n.scheduled||""}
recurrent: ${n.recurrent==="true"?"true":"false"}
recurrence: ${n.recurrence||""}
created: ${t}
modified: ${t}
client: ${e?E(e):""}
property: ${s?E(s):""}
people: ${R(i)}
projects: ${R(o)}
tags:
  - ${V}
  - rem-task
---

# ${r}

## Description

${c||""}

---

## Notes

---
`;if(n.kind==="meeting")return`---
remType: meeting
title: ${E(r)}
date: ${t}
client: ${e?E(e):""}
property: ${s?E(s):""}
people: ${R(i)}
projects: ${R(o)}
tasks: ${R(a)}
tags:
  - ${V}
  - rem-meeting
---

# ${r}

## Notes

${c||""}

## Decisions

-

## Actions

-
`;let u=`rem-${n.kind}`,d=`client: ${e?E(e):""}
property: ${s?E(s):""}
people: ${R(i)}
projects: ${R(o)}
tasks: ${R(a)}`;return`---
remType: ${n.kind}
title: ${E(r)}
status: ${n.status||"active"}
created: ${t}
modified: ${t}
${d}
tags:
  - ${V}
  - ${u}
---

# ${r}

${c||""}

---

## Notes

---
`}function te(n){return`---
remType: daily
title: ${E(n)}
date: ${n}
workStatus: workday
tags:
  - ${V}
  - rem-daily
---

# ${n}

## Mission

-

## Notes

-

## Reflections

-

## Brain dump

-

## Time Clock

| Time | Event |
| --- | --- |

---
`}var H=class extends l.Plugin{constructor(){super(...arguments);this.settings={..._}}async onload(){await this.loadSettings(),this.registerView(P,t=>new K(t,this)),this.addRibbonIcon("building-2","Real Estate Management",()=>{this.activateView()}),this.addCommand({id:"open-real-estate-management",name:"Open Real Estate Management",callback:()=>this.activateView()}),this.addCommand({id:"create-real-estate-task",name:"Create real estate task",callback:()=>this.openCreateModal("task")}),this.addCommand({id:"open-todays-real-estate-log",name:"Open today's real estate daily log",callback:()=>this.openDailyLog()}),this.addSettingTab(new Q(this.app,this))}async activateView(){let t=this.app.workspace.getLeavesOfType(P);if(t.length){this.app.workspace.revealLeaf(t[0]);return}let e=this.app.workspace.getRightLeaf(!1);await(e==null?void 0:e.setViewState({type:P,active:!0})),e&&this.app.workspace.revealLeaf(e)}openCreateModal(t){new G(this.app,this,t).open()}async loadSettings(){this.settings=Object.assign({},_,await this.loadData())}async saveSettings(){await this.saveData(this.settings),this.refreshViews()}refreshViews(){this.app.workspace.getLeavesOfType(P).forEach(t=>{let e=t.view;e instanceof K&&e.render()})}async ensureFolder(t){let e=L(t);if(!e)return;let s=e.split("/"),i="";for(let o of s)i=i?`${i}/${o}`:o,this.app.vault.getAbstractFileByPath(i)||await this.app.vault.createFolder(i)}async uniquePath(t,e){let s=L(t),i=e.replace(/\.md$/i,""),o=`${s}/${i}.md`,a=2;for(;this.app.vault.getAbstractFileByPath(o);)o=`${s}/${i} ${a++}.md`;return o}async createRecord(t){let e=ye(this.settings,t.kind);await this.ensureFolder(e);let s=await this.uniquePath(e,me(t.kind==="project"?`Project - ${t.title}`:t.title)),i=await this.app.vault.create(s,Le(t));new l.Notice(`Created ${t.kind}: ${t.title}`),this.refreshViews(),await this.app.workspace.getLeaf(!1).openFile(i)}async addTaskNote(t,e){let s=e.trim();s&&(await this.app.vault.process(t,i=>Z(i,s)),new l.Notice("Task note added"),this.refreshViews())}async addRecordNote(t,e){let s=e.trim();s&&(await this.app.vault.process(t,i=>Z(i,s)),new l.Notice("Record note added"),this.refreshViews())}async updateTaskFields(t,e){await this.app.vault.process(t,s=>ee(s,{...e,modified:y(),dateModified:y()})),new l.Notice("Task updated"),this.refreshViews()}async updateRecordMetadata(t,e){let s={title:E(e.title.trim()||t.title),status:e.status.trim()||t.status||"active",date:e.date.trim(),modified:y(),dateModified:y()};t.kind!=="client"&&(s.client=e.client.trim()?E(j(e.client)):""),["client","property"].includes(t.kind)||(s.property=e.property.trim()?E(j(e.property)):""),s.people=R(M(e.people)),s.projects=R(M(e.projects)),t.kind==="meeting"&&(s.tasks=R(M(e.tasks))),await this.app.vault.process(t.file,i=>ee(i,s)),new l.Notice("Record metadata updated"),this.refreshViews()}async closeTask(t){await this.updateTaskFields(t,{status:"done",completed:y(),completedDate:y()})}async finishTaskInstance(t){let e=ge(t.recurrence),s={lastCompleted:y(),status:t.status==="done"?"open":t.status||"open"};t.due&&(s.due=F(t.due,e)),t.scheduled&&(s.scheduled=F(t.scheduled,e)),!t.due&&!t.scheduled&&(s.due=F(y(),e)),await this.updateTaskFields(t.file,s),new l.Notice(`Finished instance; next run moved by ${e} days`)}async postponeTask(t){let e={};t.due&&(e.due=F(t.due,7)),t.scheduled&&(e.scheduled=F(t.scheduled,7)),!t.due&&!t.scheduled&&(e.due=F(y(),7)),await this.updateTaskFields(t.file,e)}async openDailyLog(t=y()){await this.ensureFolder(this.settings.dailyFolder);let e=`${L(this.settings.dailyFolder)}/${t}.md`,s=this.app.vault.getAbstractFileByPath(e),i=s instanceof l.TFile?s:await this.app.vault.create(e,te(t));await this.app.workspace.getLeaf(!1).openFile(i),this.refreshViews()}async dailyLogFile(t=y()){await this.ensureFolder(this.settings.dailyFolder);let e=`${L(this.settings.dailyFolder)}/${t}.md`,s=this.app.vault.getAbstractFileByPath(e);return s instanceof l.TFile?s:await this.app.vault.create(e,te(t))}async appendDailyEntry(t,e){let s=await this.dailyLogFile();await this.app.vault.process(s,i=>De(i,t,e)),new l.Notice(`Added to ${t}`),this.refreshViews()}async addDailyTimeClockEvent(t){let e=await this.dailyLogFile();await this.app.vault.process(e,s=>Re(s,t)),new l.Notice(`${t} saved`),this.refreshViews()}async loadRecords(){let t=[];for(let e of this.app.vault.getMarkdownFiles())if(!fe(e))try{let s=await this.app.vault.cachedRead(e),i=ve(e,s,this.settings);i&&t.push(i)}catch(s){console.warn(`Real Estate Management skipped ${e.path}`,s)}return t.sort((e,s)=>e.title.localeCompare(s.title))}},K=class extends l.ItemView{constructor(t,e){super(t);this.selectedTaskPath="";this.selectedRecordPath="";this.noteDraft="";this.recordNoteDrafts={};this.dailyDrafts={};this.searchQuery="";this.plugin=e}getViewType(){return P}getDisplayText(){return"Real Estate Management"}getIcon(){return"building-2"}async onOpen(){await this.render()}async render(){let t=this.containerEl.children[1];t.empty(),t.addClass("rem-plugin-root");let e=await this.plugin.loadRecords(),s=this.filterRecords(e),i=m=>s.filter(S=>S.kind===m),o=i("task"),a=o.filter(m=>m.status!=="done"&&!T(m.file,this.plugin.settings.doneFolder)),c=a.filter(m=>m.due===y()||m.scheduled===y()),u=a.filter(m=>!!m.due&&m.due<y()),d=i("daily").find(m=>m.date===y()),$=o.find(m=>m.file.path===this.selectedTaskPath)||c[0]||a[0];$&&(this.selectedTaskPath=$.file.path);let w=s.find(m=>m.file.path===this.selectedRecordPath&&m.kind!=="task"),h=t.createDiv({cls:"rem-header rem-hero"}),g=h.createDiv();g.createEl("div",{text:"Real Estate Management",cls:"rem-kicker"}),g.createEl("h2",{text:"Mission control"}),g.createEl("p",{text:"Independent Obsidian records for tasks, clients, properties, people, projects, meetings, and daily logs.",cls:"rem-subtitle"});let D=g.createEl("input",{cls:"rem-search",attr:{placeholder:"Search tasks, clients, properties, people, projects, meetings...",type:"search"}});D.value=this.searchQuery,D.addEventListener("input",()=>{this.searchQuery=D.value,this.render()});let v=h.createDiv({cls:"rem-actions rem-action-grid"});this.action(v,"+ Task",()=>this.plugin.openCreateModal("task")),this.action(v,"+ Client",()=>this.plugin.openCreateModal("client")),this.action(v,"+ Property",()=>this.plugin.openCreateModal("property")),this.action(v,"+ Person",()=>this.plugin.openCreateModal("person")),this.action(v,"+ Project",()=>this.plugin.openCreateModal("project")),this.action(v,"+ Meeting",()=>this.plugin.openCreateModal("meeting")),this.action(v,d?"Open Daily Log":"Create Daily Log",()=>this.plugin.openDailyLog()),this.action(v,"Refresh",()=>this.render());let p=t.createDiv({cls:"rem-stats"});this.stat(p,"Open tasks",String(a.length)),this.stat(p,"Today",String(c.length)),this.stat(p,"Overdue",String(u.length)),this.stat(p,"Clients",String(i("client").length)),this.stat(p,"Properties",String(i("property").length)),this.stat(p,"People",String(i("person").length)),this.stat(p,"Projects",String(i("project").length)),this.stat(p,"Meetings",String(i("meeting").length)),this.searchQuery.trim()&&this.stat(p,"Search results",String(s.length)),$&&this.taskDetail(t,$),this.dailyPanel(t,d),w&&this.recordDetail(t,w,s);let k=t.createDiv({cls:"rem-dashboard-grid"});this.taskSection(k,"Today",c,"No tasks due or scheduled today."),this.taskSection(k,"Overdue",u,"No overdue tasks."),this.recordSection(k,"Recent meetings",i("meeting").slice(-8).reverse(),"No meetings yet."),this.recordSection(k,"Properties",i("property").slice(0,12),"No properties yet."),this.recordSection(k,"People",i("person").slice(0,12),"No people yet."),this.recordSection(k,"Projects",i("project").slice(0,12),"No projects yet.")}action(t,e,s){t.createEl("button",{text:e}).addEventListener("click",s)}filterRecords(t){let e=this.searchQuery.trim().toLowerCase();return e?t.filter(s=>[s.kind,s.title,s.file.basename,s.status,s.priority,s.due,s.scheduled,s.date,s.client,s.property,...s.people,...s.projects,...s.tasks,s.body].filter(Boolean).some(i=>String(i).toLowerCase().includes(e))):t}stat(t,e,s){let i=t.createDiv({cls:"rem-stat"});i.createDiv({text:e,cls:"rem-stat-label"}),i.createDiv({text:s,cls:"rem-stat-value"})}taskSection(t,e,s,i){let o=t.createDiv({cls:"rem-section"});if(o.createEl("h3",{text:e}),!s.length){o.createDiv({text:i,cls:"rem-empty"});return}let a=o.createDiv({cls:"rem-task-list"});for(let c of s.slice(0,12))this.recordRow(a,c)}recordSection(t,e,s,i){let o=t.createDiv({cls:"rem-section"});if(o.createEl("h3",{text:e}),!s.length){o.createDiv({text:i,cls:"rem-empty"});return}let a=o.createDiv({cls:"rem-task-list"});for(let c of s)this.recordRow(a,c)}recordRow(t,e){let s=t.createDiv({cls:"rem-task-row"});e.kind==="task"?(e.file.path===this.selectedTaskPath&&s.addClass("is-selected"),s.addEventListener("click",()=>{this.selectedTaskPath=e.file.path,this.selectedRecordPath="",this.noteDraft="",this.render()})):(e.file.path===this.selectedRecordPath&&s.addClass("is-selected"),s.addEventListener("click",()=>{this.selectedRecordPath=e.file.path,this.render()})),s.createDiv({text:e.title,cls:"rem-task-title"});let i=s.createDiv({cls:"rem-task-meta"});i.createSpan({text:e.kind}),e.legacy&&i.createSpan({text:"legacy"}),e.priority&&e.kind==="task"&&i.createSpan({text:e.priority}),e.status&&i.createSpan({text:e.status}),e.due&&i.createSpan({text:`due ${e.due}`}),e.scheduled&&i.createSpan({text:`scheduled ${e.scheduled}`}),e.client&&i.createSpan({text:e.client}),e.property&&i.createSpan({text:e.property})}taskDetail(t,e){let s=t.createDiv({cls:"rem-task-detail"}),i=s.createDiv({cls:"rem-task-detail-header"}),o=i.createDiv();o.createEl("div",{text:e.legacy?"Legacy TaskNotes task":"Native real estate task",cls:"rem-kicker"}),o.createEl("h3",{text:e.title});let a=o.createDiv({cls:"rem-task-meta"});a.createSpan({text:e.status||"open"}),a.createSpan({text:e.priority||"normal"}),e.due&&a.createSpan({text:`due ${e.due}`}),e.scheduled&&a.createSpan({text:`scheduled ${e.scheduled}`}),e.recurrent&&a.createSpan({text:e.recurrence?`recurrent ${e.recurrence}`:"recurrent"}),e.client&&a.createSpan({text:e.client}),e.property&&a.createSpan({text:e.property});let c=s.createDiv({cls:"rem-task-controls"});this.dateControl(c,"Due",e.due||"",p=>this.updateSelectedTask(e,{due:p})),this.dateControl(c,"Scheduled",e.scheduled||"",p=>this.updateSelectedTask(e,{scheduled:p})),c.createEl("button",{text:"Postpone 1w"}).addEventListener("click",()=>this.plugin.postponeTask(e)),e.recurrent&&c.createEl("button",{text:"Finish instance"}).addEventListener("click",()=>this.plugin.finishTaskInstance(e)),c.createEl("button",{text:"Close task"}).addEventListener("click",()=>this.plugin.closeTask(e.file)),i.createEl("button",{text:"Open file"}).addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file));let d=s.createDiv({cls:"rem-task-detail-grid"}),$=d.createDiv({cls:"rem-panel"});$.createEl("h4",{text:"Description"}),$.createDiv({text:e.description||"No description yet.",cls:e.description?"rem-description":"rem-empty"});let w=d.createDiv({cls:"rem-panel"});w.createEl("h4",{text:"Notes"});let h=w.createDiv({cls:"rem-note-editor"}),g=h.createEl("textarea",{text:this.noteDraft,attr:{placeholder:"Add a task note... Enter to save, Shift+Enter for a new line"}});if(g.value=this.noteDraft,g.addEventListener("input",()=>{this.noteDraft=g.value}),g.addEventListener("keydown",async p=>{p.key==="Enter"&&!p.shiftKey&&(p.preventDefault(),await this.saveTaskNote(e))}),h.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveTaskNote(e)),!e.notes.length){w.createDiv({text:"No notes yet.",cls:"rem-empty"});return}let v=w.createDiv({cls:"rem-note-list"});for(let p of e.notes.slice().reverse().slice(0,12)){let k=v.createDiv({cls:"rem-note-card"});k.createDiv({text:p.date,cls:"rem-note-date"}),k.createDiv({text:p.text,cls:"rem-note-text"})}}dailyPanel(t,e){let s=t.createDiv({cls:"rem-daily-panel"}),i=s.createDiv({cls:"rem-daily-header"}),o=i.createDiv();o.createEl("div",{text:y(),cls:"rem-kicker"}),o.createEl("h3",{text:"Daily log"}),i.createEl("button",{text:e?"Open daily log":"Create daily log"}).addEventListener("click",()=>this.plugin.openDailyLog());let c=[["Mission",b((e==null?void 0:e.raw)||"","Mission")],["Notes",b((e==null?void 0:e.raw)||"","Notes")],["Reflections",b((e==null?void 0:e.raw)||"","Reflections")],["Brain dump",b((e==null?void 0:e.raw)||"","Brain dump")]],u=s.createDiv({cls:"rem-time-clock-panel"}),d=u.createDiv({cls:"rem-time-clock-header"});d.createEl("h4",{text:"Time Clock"});let $=d.createDiv({cls:"rem-time-clock-actions"});for(let h of["Clock in","Break start","Break finish","Clock out"])$.createEl("button",{text:h}).addEventListener("click",()=>this.plugin.addDailyTimeClockEvent(h));u.createDiv({text:b((e==null?void 0:e.raw)||"","Time Clock")||"No time events yet.",cls:e?"rem-description rem-time-clock-body":"rem-empty"});let w=s.createDiv({cls:"rem-daily-grid"});for(let[h,g]of c){let D=w.createDiv({cls:"rem-panel"});D.createEl("h4",{text:h}),D.createDiv({text:g||"Nothing written yet.",cls:g?"rem-description rem-daily-body":"rem-empty"});let v=D.createDiv({cls:"rem-daily-editor"}),p=v.createEl("textarea",{attr:{placeholder:`Add ${h.toLowerCase()}...`}});p.value=this.dailyDrafts[h]||"",p.addEventListener("input",()=>{this.dailyDrafts[h]=p.value}),p.addEventListener("keydown",async k=>{k.key==="Enter"&&!k.shiftKey&&(k.preventDefault(),await this.saveDailyEntry(h))}),v.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveDailyEntry(h))}}async saveDailyEntry(t){let e=(this.dailyDrafts[t]||"").trim();e&&(await this.plugin.appendDailyEntry(t,e),this.dailyDrafts[t]="",await this.render())}async saveTaskNote(t){let e=this.noteDraft.trim();e&&(await this.plugin.addTaskNote(t.file,e),this.noteDraft="",await this.render())}recordDetail(t,e,s){let i=s.filter(f=>be(f,e)),o=i.filter(f=>f.kind==="task"),a=i.filter(f=>f.kind==="meeting"),c=i.filter(f=>f.kind==="project"),u=i.filter(f=>f.kind==="person"),d=i.filter(f=>f.kind==="property"),$=t.createDiv({cls:"rem-record-detail"}),w=$.createDiv({cls:"rem-task-detail-header"}),h=w.createDiv();h.createEl("div",{text:e.kind,cls:"rem-kicker"}),h.createEl("h3",{text:e.title});let g=h.createDiv({cls:"rem-task-meta"});e.status&&g.createSpan({text:e.status}),e.client&&g.createSpan({text:e.client}),e.property&&g.createSpan({text:e.property}),e.date&&g.createSpan({text:e.date});let D=w.createDiv({cls:"rem-detail-actions"});D.createEl("button",{text:"Edit metadata"}).addEventListener("click",()=>new q(this.app,this.plugin,e).open()),D.createEl("button",{text:"Open file"}).addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file));let k=$.createDiv({cls:"rem-record-detail-grid"}),m=k.createDiv({cls:"rem-panel"});m.createEl("h4",{text:"Record"}),m.createDiv({text:e.body||"No body yet.",cls:e.body?"rem-description":"rem-empty"});let S=k.createDiv({cls:"rem-panel"});S.createEl("h4",{text:"Linked work"}),this.relatedGroup(S,"Tasks",o),this.relatedGroup(S,"Meetings",a),this.relatedGroup(S,"Projects",c),this.relatedGroup(S,"People",u),this.relatedGroup(S,"Properties",d),i.length||S.createDiv({text:"No linked records found yet.",cls:"rem-empty"});let N=k.createDiv({cls:"rem-panel rem-record-notes-panel"});N.createEl("h4",{text:"Notes"});let U=N.createDiv({cls:"rem-note-editor"}),A=U.createEl("textarea",{attr:{placeholder:`Add a ${e.kind} note... Enter to save, Shift+Enter for a new line`}});if(A.value=this.recordNoteDrafts[e.file.path]||"",A.addEventListener("input",()=>{this.recordNoteDrafts[e.file.path]=A.value}),A.addEventListener("keydown",async f=>{f.key==="Enter"&&!f.shiftKey&&(f.preventDefault(),await this.saveRecordNote(e))}),U.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveRecordNote(e)),!e.notes.length){N.createDiv({text:"No notes yet.",cls:"rem-empty"});return}let re=N.createDiv({cls:"rem-note-list"});for(let f of e.notes.slice().reverse().slice(0,12)){let z=re.createDiv({cls:"rem-note-card"});z.createDiv({text:f.date,cls:"rem-note-date"}),z.createDiv({text:f.text,cls:"rem-note-text"})}}relatedGroup(t,e,s){if(!s.length)return;let i=t.createDiv({cls:"rem-related-group"});i.createEl("h5",{text:`${e} (${s.length})`});let o=i.createDiv({cls:"rem-related-list"});for(let a of s.slice(0,8)){let c=o.createDiv({cls:"rem-related-row"});c.createSpan({text:a.title}),c.addEventListener("click",()=>{a.kind==="task"?(this.selectedTaskPath=a.file.path,this.selectedRecordPath=""):this.selectedRecordPath=a.file.path,this.render()})}}async saveRecordNote(t){let e=(this.recordNoteDrafts[t.file.path]||"").trim();e&&(await this.plugin.addRecordNote(t.file,e),this.recordNoteDrafts[t.file.path]="",await this.render())}dateControl(t,e,s,i){let o=t.createEl("label",{cls:"rem-date-control"});o.createSpan({text:e});let a=o.createEl("input",{type:"date"});a.value=s,a.addEventListener("change",()=>i(a.value))}async updateSelectedTask(t,e){await this.plugin.updateTaskFields(t.file,e),await this.render()}},G=class extends l.Modal{constructor(r,t,e){super(r),this.plugin=t,this.draft={kind:e,title:"",status:e==="task"?"open":"active",priority:"normal",due:"",scheduled:"",client:"",property:"",people:"",projects:"",tasks:"",body:"",recurrent:"false",recurrence:""}}onOpen(){let{contentEl:r}=this;r.empty(),r.addClass("rem-modal"),r.createEl("h2",{text:`New ${this.draft.kind}`}),this.text("Title","Required","title"),this.draft.kind==="task"&&(this.text("Priority","normal, high, low","priority"),this.text("Due","YYYY-MM-DD","due"),this.text("Scheduled","YYYY-MM-DD","scheduled"),this.text("Recurrent","true or false","recurrent"),this.text("Recurrence","weekly, daily, monthly, quarterly, yearly, or every 14 days","recurrence")),this.draft.kind!=="client"&&this.text("Client","Client note name","client"),["client","property"].includes(this.draft.kind)||this.text("Property","Property note name","property"),this.text("People","Comma-separated names","people"),this.draft.kind!=="project"&&this.text("Projects","Comma-separated project names","projects"),this.draft.kind==="meeting"&&this.text("Tasks","Comma-separated task names","tasks"),new l.Setting(r).setName(this.draft.kind==="task"?"Description":"Notes").addTextArea(t=>t.setPlaceholder("Write the starting body...").onChange(e=>{this.draft.body=e})),new l.Setting(r).addButton(t=>t.setButtonText("Create").setCta().onClick(async()=>{if(!this.draft.title.trim()){new l.Notice("Title is required.");return}await this.plugin.createRecord(this.draft),this.close()}))}text(r,t,e){new l.Setting(this.contentEl).setName(r).setDesc(t).addText(s=>s.setValue(String(this.draft[e]||"")).onChange(i=>{this.draft[e]=i}))}},q=class extends l.Modal{constructor(r,t,e){super(r),this.plugin=t,this.record=e,this.draft={title:e.title,status:e.status||"active",date:e.date||"",client:e.client?e.client.replace(/^\[\[/,"").replace(/\]\]$/,""):"",property:e.property?e.property.replace(/^\[\[/,"").replace(/\]\]$/,""):"",people:W(e.people),projects:W(e.projects),tasks:W(e.tasks)}}onOpen(){let{contentEl:r}=this;r.empty(),r.addClass("rem-modal"),r.createEl("h2",{text:`Edit ${this.record.kind}`}),this.text("Title","Shown in the dashboard and frontmatter.","title"),this.text("Status","active, paused, done, archived, etc.","status"),this.text("Date","YYYY-MM-DD when useful.","date"),this.record.kind!=="client"&&this.text("Client","Client note name.","client"),["client","property"].includes(this.record.kind)||this.text("Property","Property note name.","property"),this.text("People","Comma-separated people names.","people"),this.text("Projects","Comma-separated project names.","projects"),this.record.kind==="meeting"&&this.text("Tasks","Comma-separated task names.","tasks"),new l.Setting(r).addButton(t=>t.setButtonText("Save metadata").setCta().onClick(async()=>{if(!this.draft.title.trim()){new l.Notice("Title is required.");return}await this.plugin.updateRecordMetadata(this.record,this.draft),this.close()}))}text(r,t,e){new l.Setting(this.contentEl).setName(r).setDesc(t).addText(s=>s.setValue(this.draft[e]).onChange(i=>{this.draft[e]=i}))}},Q=class extends l.PluginSettingTab{constructor(r,t){super(r,t),this.plugin=t}display(){let{containerEl:r}=this;r.empty(),r.createEl("h2",{text:"Real Estate Management settings"}),r.createEl("p",{text:"Set vault-relative folders for independent Real Estate Management records. Existing TaskNotes-style task files can still be read as legacy records."}),this.folderSetting("Tasks folder","Native task records.","tasksFolder"),this.folderSetting("Done folder","Optional completed task records.","doneFolder"),this.folderSetting("Clients folder","Client or organisation records.","clientsFolder"),this.folderSetting("Properties folder","Property records.","propertiesFolder"),this.folderSetting("People folder","People and contact records.","peopleFolder"),this.folderSetting("Projects folder","Project records.","projectsFolder"),this.folderSetting("Meetings folder","Meeting records.","meetingsFolder"),this.folderSetting("Daily logs folder","Daily logs and dashboard notes.","dailyFolder")}folderSetting(r,t,e){new l.Setting(this.containerEl).setName(r).setDesc(t).addText(s=>s.setPlaceholder(_[e]).setValue(this.plugin.settings[e]).onChange(async i=>{this.plugin.settings[e]=L(i),await this.plugin.saveSettings()}))}};
