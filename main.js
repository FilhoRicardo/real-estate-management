/* Real Estate Management Obsidian plugin */
"use strict";var A=Object.defineProperty;var Z=Object.getOwnPropertyDescriptor;var ee=Object.getOwnPropertyNames;var te=Object.prototype.hasOwnProperty;var ne=(n,r)=>{for(var t in r)A(n,t,{get:r[t],enumerable:!0})},se=(n,r,t,e)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of ee(r))!te.call(n,s)&&s!==t&&A(n,s,{get:()=>r[s],enumerable:!(e=Z(r,s))||e.enumerable});return n};var re=n=>se(A({},"__esModule",{value:!0}),n);var xe={};ne(xe,{default:()=>N});module.exports=re(xe);var u=require("obsidian");function B(n){let r=n.match(/^---\n([\s\S]*?)\n---/);if(!r)return{};let t={},e=null;for(let s of r[1].split(`
`))if(/^  - /.test(s)){let i=s.replace(/^  - /,"").trim().replace(/^["']|["']$/g,"");e&&Array.isArray(t[e])&&t[e].push(i)}else{let i=s.match(/^(\w+):\s*(.*)/);if(!i)continue;e=i[1];let a=i[2].trim();a?a[0]==="["?t[e]=a.slice(1,-1).split(",").map(o=>o.trim().replace(/^["']|["']$/g,"")):t[e]=a.replace(/^["']|["']$/g,""):t[e]=[]}return t}var T=n=>n?n.replace(/^\[\[|\]\]$/g,""):null,ie=n=>n.replace(/\\/g,"/").split("/").pop(),q=n=>ie(n).replace(/\.md$/i,"");var ae=n=>{if(n.match(/^(\d{4})-(\d{2})-(\d{2})$/))return n;let t=n.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!t)return null;let[,e,s,i]=t;return`${i}-${String(Number(s)).padStart(2,"0")}-${String(Number(e)).padStart(2,"0")}`};function oe(n){let r=[],t=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})(?:\]\])?[ \t]*(?=\n|$)/g,e=[...n.matchAll(t)].map(s=>({date:ae(s[2]),start:s.index+s[1].length,end:s.index+s[0].length})).filter(s=>s.date);return e.forEach((s,i)=>{var o,c;[...n.slice(s.end,(c=(o=e[i+1])==null?void 0:o.start)!=null?c:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(h=>{let l=h[1].trim();l&&r.push({date:s.date,text:l,order:r.length})})}),r.sort((s,i)=>s.date.localeCompare(i.date)||s.order-i.order),r.forEach(s=>{delete s.order}),r}function U(n,r){let t=B(r),e=t.title||q(n),s=[...r.matchAll(/- \[([ x])\] (.+)/g)].map(o=>({done:o[1]==="x",text:o[2]})),i=oe(r),a=Array.isArray(t.tags)?t.tags:t.tags?[t.tags]:[];return{id:n,title:e,filename:q(n),priority:t.priority||"normal",status:t.status||"none",due:t.due||null,scheduled:t.scheduled||null,dateCreated:t.dateCreated||null,dateModified:t.dateModified||null,contexts:Array.isArray(t.contexts)?t.contexts:t.contexts?[t.contexts]:[],client:T(t.client),building:T(t.building),projects:Array.isArray(t.projects)?t.projects.map(T):t.projects?[T(t.projects)]:[],waitingfor:T(t.waitingfor),tags:a,archived:a.includes("archived"),recurrent:t.recurrent==="true"||t.Recurrent==="true"||a.includes("recurrent")||a.includes("recurring"),recurrence:t.recurrence||null,completeInstances:Array.isArray(t.complete_instances)?t.complete_instances:[],skippedInstances:Array.isArray(t.skipped_instances)?t.skipped_instances:[],completedDate:t.completedDate||null,checklist:s,checklistDone:s.filter(o=>o.done).length,checklistTotal:s.length,logs:i,raw:r}}var F="real-estate-management-view",P="real-estate-management",K={tasksFolder:"Real Estate Management/Tasks",clientsFolder:"Real Estate Management/Clients",propertiesFolder:"Real Estate Management/Properties",peopleFolder:"Real Estate Management/People",projectsFolder:"Real Estate Management/Projects",meetingsFolder:"Real Estate Management/Meetings",dailyFolder:"Real Estate Management/Daily Logs",doneFolder:"Real Estate Management/Done"};function $(){let n=new Date,r=t=>String(t).padStart(2,"0");return`${n.getFullYear()}-${r(n.getMonth()+1)}-${r(n.getDate())}`}function O(n,r){let t=new Date(`${n}T12:00:00`);t.setDate(t.getDate()+r);let e=s=>String(s).padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}function S(n){return n.replace(/\\/g,"/").replace(/^\/+|\/+$/g,"")}function ce(n){return n.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g,"-").replace(/\s+/g," ").replace(/[. ]+$/g,"").slice(0,180)||"Untitled"}function le(n){let r=n.basename.trim().toLowerCase();return r==="index"||r.startsWith("_")||n.name==="timetracker.md"}function E(n,r){let t=S(r);return t.length>0&&n.path.startsWith(`${t}/`)}function V(n){return Array.isArray(n)?n.map(String).filter(Boolean):n?[String(n)].filter(Boolean):[]}function W(n){let r=n.trim();return r?r.startsWith("[[")&&r.endsWith("]]")?r:`[[${r}]]`:""}function H(n){return n.split(",").map(r=>r.trim()).filter(Boolean).map(W)}function x(n){return Array.isArray(n)?String(n[0]||""):String(n||"")}function de(n,r){return r==="task"?n.tasksFolder:r==="client"?n.clientsFolder:r==="property"?n.propertiesFolder:r==="person"?n.peopleFolder:r==="project"?n.projectsFolder:r==="meeting"?n.meetingsFolder:n.dailyFolder}function pe(n,r,t){let e=String(r.remType||"").toLowerCase();return["task","client","property","person","project","meeting","daily"].includes(e)?e:E(n,t.tasksFolder)||E(n,t.doneFolder)?"task":E(n,t.clientsFolder)?"client":E(n,t.propertiesFolder)?"property":E(n,t.peopleFolder)?"person":E(n,t.projectsFolder)?"project":E(n,t.meetingsFolder)?"meeting":E(n,t.dailyFolder)?"daily":null}function ue(n,r,t){var s,i;let e=(i=(s=r.match(/^#\s+(.+)$/m))==null?void 0:s[1])==null?void 0:i.trim();return x(t.title||t.name||t.person||t.building)||e||n.basename}function he(n,r,t){let e=B(r),s=pe(n,e,t);if(!s)return null;if(s==="task"&&!e.remType){let i=U(n.path,r);return{kind:s,file:n,title:i.title,status:i.status,priority:i.priority,due:i.due,scheduled:i.scheduled,date:i.dateCreated,client:i.client,property:i.building,people:i.waitingfor?[i.waitingfor]:[],projects:i.projects||[],tasks:[],legacy:!0,description:C(r),notes:i.logs||[],raw:r,body:C(r)}}return{kind:s,file:n,title:ue(n,r,e),status:x(e.status)||(s==="task"?"open":"active"),priority:x(e.priority)||"normal",due:x(e.due)||null,scheduled:x(e.scheduled)||null,date:x(e.date||e.created||e.dateCreated)||null,client:x(e.client)||null,property:x(e.property||e.building)||null,people:V(e.people||e.person),projects:V(e.projects||e.project),tasks:V(e.tasks||e.task),legacy:!e.remType,description:s==="task"?C(r):"",notes:me(r),raw:r,body:ge(r,s)}}function b(n,r){let e=new RegExp(`(^|\\n)##\\s+${r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}[ \\t]*(?=\\n|$)`,"i").exec(n);if(!e)return"";let s=e.index+e[0].length,i=n.slice(s),a=i.search(/\n##\s+/),o=i.search(/\n---[ \t]*(?=\n|$)/),c=[a,o].filter(l=>l>=0),h=c.length?Math.min(...c):i.length;return i.slice(0,h).trim()}function C(n){let r=b(n,"Description");return r||n.replace(/^---\n[\s\S]*?\n---\n?/,"").split(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/)[0].replace(/^#\s+.+\n?/,"").replace(/^#{1,6}\s+Task descri(?:p)?tion\s*\n?/i,"").trim()}function ge(n,r){return r==="task"?C(n):n.replace(/^---\n[\s\S]*?\n---\n?/,"").replace(/^#\s+.+\n?/,"").split(/\n---[ \t]*(?=\n|$)/)[0].trim()}function me(n){let r=[],t=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2})(?:\]\])?[ \t]*(?=\n|$)/g,e=[...n.matchAll(t)].map(s=>({date:s[2],start:s.index+s[1].length,end:s.index+s[0].length}));return e.forEach((s,i)=>{var o,c;[...n.slice(s.end,(c=(o=e[i+1])==null?void 0:o.start)!=null?c:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(h=>{let l=h[1].trim();l&&r.push({date:s.date,text:l})})}),r.sort((s,i)=>s.date.localeCompare(i.date))}function fe(n=new Date){return n.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!1})}function z(n,r){let t=$(),e=`Log: [${fe()}] ${r.trim()}`,s=`### [[${t}]]`,i=new RegExp(`(^|\\n)### (?:\\[\\[)?${t}(?:\\]\\])?[ \\t]*(?=\\n|$)`).exec(n);if(i){let c=i.index+i[0].length,l=n.slice(c).search(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/),f=l===-1?n.length:c+l,m=n.slice(c,f).search(/\n---[ \t]*(?=\n|$)/);if(m!==-1){let p=c+m;return`${n.slice(0,p).trimEnd()}
${e}

${n.slice(p).replace(/^\n+/,"")}`}return`${n.slice(0,f).trimEnd()}
${e}

---
${n.slice(f).replace(/^\n+/,"")}`}let a=`

${s}
${e}

---
`,o=/(^|\n)##\s+Notes[ \t]*(?=\n|$)/i.exec(n);if(o){let c=o.index+o[0].length;return`${n.slice(0,c).trimEnd()}${a}${n.slice(c).replace(/^\n+/,"")}`}return`${n.trimEnd()}

## Notes${a}`}function ye(n,r,t){let e=t.trim();if(!e)return n;let i=new RegExp(`(^|\\n)##\\s+${r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}[ \\t]*(?=\\n|$)`,"i").exec(n),a=`- ${e}`;if(!i)return`${n.trimEnd()}

## ${r}

${a}
`;let o=i.index+i[0].length,h=n.slice(o).search(/\n##\s+/),l=h===-1?n.length:o+h;return`${n.slice(0,l).trimEnd()}
${a}
${n.slice(l)}`}function ke(n){return/^---\n[\s\S]*?\n---/.test(n)?n:`---
---

${n.trimStart()}`}function $e(n,r,t){let e=ke(n),s=e.match(/^---\n([\s\S]*?)\n---/);if(!s)return e;let i=s[1],a=`${r}: ${t}`,o=new RegExp(`^${r}:.*$`,"m");return`---
${o.test(i)?i.replace(o,a):`${i.trimEnd()}
${a}`}
---${e.slice(s[0].length)}`}function we(n,r){return Object.entries(r).reduce((t,[e,s])=>$e(t,e,s),n)}function J(n){return String(n||"").replace(/^\[\[/,"").replace(/\]\]$/,"").split("|")[0].trim().toLowerCase()}function ve(n){return new Set([n.title,n.file.basename,`[[${n.title}]]`,`[[${n.file.basename}]]`].map(J).filter(Boolean))}function De(n,r){return n.some(t=>r.has(J(t)))}function Ee(n,r){if(n.file.path===r.file.path)return!1;let t=ve(r);return De([n.client,n.property,...n.people,...n.projects,...n.tasks],t)}function R(n){return n.length?`
${n.map(r=>`  - "${r.replace(/"/g,'\\"')}"`).join(`
`)}`:"[]"}function D(n){return`"${n.replace(/"/g,'\\"')}"`}function Re(n){let r=n.title.trim(),t=$(),e=W(n.client),s=W(n.property),i=H(n.people),a=H(n.projects),o=H(n.tasks),c=n.body.trim();if(n.kind==="task")return`---
remType: task
title: ${D(r)}
status: ${n.status||"open"}
priority: ${n.priority||"normal"}
due: ${n.due||""}
scheduled: ${n.scheduled||""}
created: ${t}
modified: ${t}
client: ${e?D(e):""}
property: ${s?D(s):""}
people: ${R(i)}
projects: ${R(a)}
tags:
  - ${P}
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
title: ${D(r)}
date: ${t}
client: ${e?D(e):""}
property: ${s?D(s):""}
people: ${R(i)}
projects: ${R(a)}
tasks: ${R(o)}
tags:
  - ${P}
  - rem-meeting
---

# ${r}

## Notes

${c||""}

## Decisions

-

## Actions

-
`;let h=`rem-${n.kind}`,l=`client: ${e?D(e):""}
property: ${s?D(s):""}
people: ${R(i)}
projects: ${R(a)}
tasks: ${R(o)}`;return`---
remType: ${n.kind}
title: ${D(r)}
status: ${n.status||"active"}
created: ${t}
modified: ${t}
${l}
tags:
  - ${P}
  - ${h}
---

# ${r}

${c||""}

---

## Notes

---
`}function X(n){return`---
remType: daily
title: ${D(n)}
date: ${n}
workStatus: workday
tags:
  - ${P}
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
`}var N=class extends u.Plugin{constructor(){super(...arguments);this.settings={...K}}async onload(){await this.loadSettings(),this.registerView(F,t=>new j(t,this)),this.addRibbonIcon("building-2","Real Estate Management",()=>{this.activateView()}),this.addCommand({id:"open-real-estate-management",name:"Open Real Estate Management",callback:()=>this.activateView()}),this.addCommand({id:"create-real-estate-task",name:"Create real estate task",callback:()=>this.openCreateModal("task")}),this.addCommand({id:"open-todays-real-estate-log",name:"Open today's real estate daily log",callback:()=>this.openDailyLog()}),this.addSettingTab(new _(this.app,this))}async activateView(){let t=this.app.workspace.getLeavesOfType(F);if(t.length){this.app.workspace.revealLeaf(t[0]);return}let e=this.app.workspace.getRightLeaf(!1);await(e==null?void 0:e.setViewState({type:F,active:!0})),e&&this.app.workspace.revealLeaf(e)}openCreateModal(t){new I(this.app,this,t).open()}async loadSettings(){this.settings=Object.assign({},K,await this.loadData())}async saveSettings(){await this.saveData(this.settings),this.refreshViews()}refreshViews(){this.app.workspace.getLeavesOfType(F).forEach(t=>{let e=t.view;e instanceof j&&e.render()})}async ensureFolder(t){let e=S(t);if(!e)return;let s=e.split("/"),i="";for(let a of s)i=i?`${i}/${a}`:a,this.app.vault.getAbstractFileByPath(i)||await this.app.vault.createFolder(i)}async uniquePath(t,e){let s=S(t),i=e.replace(/\.md$/i,""),a=`${s}/${i}.md`,o=2;for(;this.app.vault.getAbstractFileByPath(a);)a=`${s}/${i} ${o++}.md`;return a}async createRecord(t){let e=de(this.settings,t.kind);await this.ensureFolder(e);let s=await this.uniquePath(e,ce(t.kind==="project"?`Project - ${t.title}`:t.title)),i=await this.app.vault.create(s,Re(t));new u.Notice(`Created ${t.kind}: ${t.title}`),this.refreshViews(),await this.app.workspace.getLeaf(!1).openFile(i)}async addTaskNote(t,e){let s=e.trim();s&&(await this.app.vault.process(t,i=>z(i,s)),new u.Notice("Task note added"),this.refreshViews())}async addRecordNote(t,e){let s=e.trim();s&&(await this.app.vault.process(t,i=>z(i,s)),new u.Notice("Record note added"),this.refreshViews())}async updateTaskFields(t,e){await this.app.vault.process(t,s=>we(s,{...e,modified:$(),dateModified:$()})),new u.Notice("Task updated"),this.refreshViews()}async closeTask(t){await this.updateTaskFields(t,{status:"done",completed:$(),completedDate:$()})}async postponeTask(t){let e={};t.due&&(e.due=O(t.due,7)),t.scheduled&&(e.scheduled=O(t.scheduled,7)),!t.due&&!t.scheduled&&(e.due=O($(),7)),await this.updateTaskFields(t.file,e)}async openDailyLog(t=$()){await this.ensureFolder(this.settings.dailyFolder);let e=`${S(this.settings.dailyFolder)}/${t}.md`,s=this.app.vault.getAbstractFileByPath(e),i=s instanceof u.TFile?s:await this.app.vault.create(e,X(t));await this.app.workspace.getLeaf(!1).openFile(i),this.refreshViews()}async dailyLogFile(t=$()){await this.ensureFolder(this.settings.dailyFolder);let e=`${S(this.settings.dailyFolder)}/${t}.md`,s=this.app.vault.getAbstractFileByPath(e);return s instanceof u.TFile?s:await this.app.vault.create(e,X(t))}async appendDailyEntry(t,e){let s=await this.dailyLogFile();await this.app.vault.process(s,i=>ye(i,t,e)),new u.Notice(`Added to ${t}`),this.refreshViews()}async loadRecords(){let t=[];for(let e of this.app.vault.getMarkdownFiles())if(!le(e))try{let s=await this.app.vault.cachedRead(e),i=he(e,s,this.settings);i&&t.push(i)}catch(s){console.warn(`Real Estate Management skipped ${e.path}`,s)}return t.sort((e,s)=>e.title.localeCompare(s.title))}},j=class extends u.ItemView{constructor(t,e){super(t);this.selectedTaskPath="";this.selectedRecordPath="";this.noteDraft="";this.recordNoteDrafts={};this.dailyDrafts={};this.plugin=e}getViewType(){return F}getDisplayText(){return"Real Estate Management"}getIcon(){return"building-2"}async onOpen(){await this.render()}async render(){let t=this.containerEl.children[1];t.empty(),t.addClass("rem-plugin-root");let e=await this.plugin.loadRecords(),s=d=>e.filter(v=>v.kind===d),i=s("task"),a=i.filter(d=>d.status!=="done"&&!E(d.file,this.plugin.settings.doneFolder)),o=a.filter(d=>d.due===$()||d.scheduled===$()),c=a.filter(d=>!!d.due&&d.due<$()),h=s("daily").find(d=>d.date===$()),l=i.find(d=>d.file.path===this.selectedTaskPath)||o[0]||a[0];l&&(this.selectedTaskPath=l.file.path);let f=e.find(d=>d.file.path===this.selectedRecordPath&&d.kind!=="task"),y=t.createDiv({cls:"rem-header rem-hero"}),m=y.createDiv();m.createEl("div",{text:"Real Estate Management",cls:"rem-kicker"}),m.createEl("h2",{text:"Mission control"}),m.createEl("p",{text:"Independent Obsidian records for tasks, clients, properties, people, projects, meetings, and daily logs.",cls:"rem-subtitle"});let p=y.createDiv({cls:"rem-actions rem-action-grid"});this.action(p,"+ Task",()=>this.plugin.openCreateModal("task")),this.action(p,"+ Client",()=>this.plugin.openCreateModal("client")),this.action(p,"+ Property",()=>this.plugin.openCreateModal("property")),this.action(p,"+ Person",()=>this.plugin.openCreateModal("person")),this.action(p,"+ Project",()=>this.plugin.openCreateModal("project")),this.action(p,"+ Meeting",()=>this.plugin.openCreateModal("meeting")),this.action(p,h?"Open Daily Log":"Create Daily Log",()=>this.plugin.openDailyLog()),this.action(p,"Refresh",()=>this.render());let k=t.createDiv({cls:"rem-stats"});this.stat(k,"Open tasks",String(a.length)),this.stat(k,"Today",String(o.length)),this.stat(k,"Overdue",String(c.length)),this.stat(k,"Clients",String(s("client").length)),this.stat(k,"Properties",String(s("property").length)),this.stat(k,"People",String(s("person").length)),this.stat(k,"Projects",String(s("project").length)),this.stat(k,"Meetings",String(s("meeting").length)),l&&this.taskDetail(t,l),this.dailyPanel(t,h),f&&this.recordDetail(t,f,e);let w=t.createDiv({cls:"rem-dashboard-grid"});this.taskSection(w,"Today",o,"No tasks due or scheduled today."),this.taskSection(w,"Overdue",c,"No overdue tasks."),this.recordSection(w,"Recent meetings",s("meeting").slice(-8).reverse(),"No meetings yet."),this.recordSection(w,"Properties",s("property").slice(0,12),"No properties yet."),this.recordSection(w,"People",s("person").slice(0,12),"No people yet."),this.recordSection(w,"Projects",s("project").slice(0,12),"No projects yet.")}action(t,e,s){t.createEl("button",{text:e}).addEventListener("click",s)}stat(t,e,s){let i=t.createDiv({cls:"rem-stat"});i.createDiv({text:e,cls:"rem-stat-label"}),i.createDiv({text:s,cls:"rem-stat-value"})}taskSection(t,e,s,i){let a=t.createDiv({cls:"rem-section"});if(a.createEl("h3",{text:e}),!s.length){a.createDiv({text:i,cls:"rem-empty"});return}let o=a.createDiv({cls:"rem-task-list"});for(let c of s.slice(0,12))this.recordRow(o,c)}recordSection(t,e,s,i){let a=t.createDiv({cls:"rem-section"});if(a.createEl("h3",{text:e}),!s.length){a.createDiv({text:i,cls:"rem-empty"});return}let o=a.createDiv({cls:"rem-task-list"});for(let c of s)this.recordRow(o,c)}recordRow(t,e){let s=t.createDiv({cls:"rem-task-row"});e.kind==="task"?(e.file.path===this.selectedTaskPath&&s.addClass("is-selected"),s.addEventListener("click",()=>{this.selectedTaskPath=e.file.path,this.selectedRecordPath="",this.noteDraft="",this.render()})):(e.file.path===this.selectedRecordPath&&s.addClass("is-selected"),s.addEventListener("click",()=>{this.selectedRecordPath=e.file.path,this.render()})),s.createDiv({text:e.title,cls:"rem-task-title"});let i=s.createDiv({cls:"rem-task-meta"});i.createSpan({text:e.kind}),e.legacy&&i.createSpan({text:"legacy"}),e.priority&&e.kind==="task"&&i.createSpan({text:e.priority}),e.status&&i.createSpan({text:e.status}),e.due&&i.createSpan({text:`due ${e.due}`}),e.scheduled&&i.createSpan({text:`scheduled ${e.scheduled}`}),e.client&&i.createSpan({text:e.client}),e.property&&i.createSpan({text:e.property})}taskDetail(t,e){let s=t.createDiv({cls:"rem-task-detail"}),i=s.createDiv({cls:"rem-task-detail-header"}),a=i.createDiv();a.createEl("div",{text:e.legacy?"Legacy TaskNotes task":"Native real estate task",cls:"rem-kicker"}),a.createEl("h3",{text:e.title});let o=a.createDiv({cls:"rem-task-meta"});o.createSpan({text:e.status||"open"}),o.createSpan({text:e.priority||"normal"}),e.due&&o.createSpan({text:`due ${e.due}`}),e.scheduled&&o.createSpan({text:`scheduled ${e.scheduled}`}),e.client&&o.createSpan({text:e.client}),e.property&&o.createSpan({text:e.property});let c=s.createDiv({cls:"rem-task-controls"});this.dateControl(c,"Due",e.due||"",d=>this.updateSelectedTask(e,{due:d})),this.dateControl(c,"Scheduled",e.scheduled||"",d=>this.updateSelectedTask(e,{scheduled:d})),c.createEl("button",{text:"Postpone 1w"}).addEventListener("click",()=>this.plugin.postponeTask(e)),c.createEl("button",{text:"Close task"}).addEventListener("click",()=>this.plugin.closeTask(e.file)),i.createEl("button",{text:"Open file"}).addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file));let l=s.createDiv({cls:"rem-task-detail-grid"}),f=l.createDiv({cls:"rem-panel"});f.createEl("h4",{text:"Description"}),f.createDiv({text:e.description||"No description yet.",cls:e.description?"rem-description":"rem-empty"});let y=l.createDiv({cls:"rem-panel"});y.createEl("h4",{text:"Notes"});let m=y.createDiv({cls:"rem-note-editor"}),p=m.createEl("textarea",{text:this.noteDraft,attr:{placeholder:"Add a task note... Enter to save, Shift+Enter for a new line"}});if(p.value=this.noteDraft,p.addEventListener("input",()=>{this.noteDraft=p.value}),p.addEventListener("keydown",async d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),await this.saveTaskNote(e))}),m.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveTaskNote(e)),!e.notes.length){y.createDiv({text:"No notes yet.",cls:"rem-empty"});return}let w=y.createDiv({cls:"rem-note-list"});for(let d of e.notes.slice().reverse().slice(0,12)){let v=w.createDiv({cls:"rem-note-card"});v.createDiv({text:d.date,cls:"rem-note-date"}),v.createDiv({text:d.text,cls:"rem-note-text"})}}dailyPanel(t,e){let s=t.createDiv({cls:"rem-daily-panel"}),i=s.createDiv({cls:"rem-daily-header"}),a=i.createDiv();a.createEl("div",{text:$(),cls:"rem-kicker"}),a.createEl("h3",{text:"Daily log"}),i.createEl("button",{text:e?"Open daily log":"Create daily log"}).addEventListener("click",()=>this.plugin.openDailyLog());let c=[["Mission",b((e==null?void 0:e.raw)||"","Mission")],["Notes",b((e==null?void 0:e.raw)||"","Notes")],["Reflections",b((e==null?void 0:e.raw)||"","Reflections")],["Brain dump",b((e==null?void 0:e.raw)||"","Brain dump")]],h=s.createDiv({cls:"rem-daily-grid"});for(let[l,f]of c){let y=h.createDiv({cls:"rem-panel"});y.createEl("h4",{text:l}),y.createDiv({text:f||"Nothing written yet.",cls:f?"rem-description rem-daily-body":"rem-empty"});let m=y.createDiv({cls:"rem-daily-editor"}),p=m.createEl("textarea",{attr:{placeholder:`Add ${l.toLowerCase()}...`}});p.value=this.dailyDrafts[l]||"",p.addEventListener("input",()=>{this.dailyDrafts[l]=p.value}),p.addEventListener("keydown",async k=>{k.key==="Enter"&&!k.shiftKey&&(k.preventDefault(),await this.saveDailyEntry(l))}),m.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveDailyEntry(l))}}async saveDailyEntry(t){let e=(this.dailyDrafts[t]||"").trim();e&&(await this.plugin.appendDailyEntry(t,e),this.dailyDrafts[t]="",await this.render())}async saveTaskNote(t){let e=this.noteDraft.trim();e&&(await this.plugin.addTaskNote(t.file,e),this.noteDraft="",await this.render())}recordDetail(t,e,s){let i=s.filter(g=>Ee(g,e)),a=i.filter(g=>g.kind==="task"),o=i.filter(g=>g.kind==="meeting"),c=i.filter(g=>g.kind==="project"),h=i.filter(g=>g.kind==="person"),l=i.filter(g=>g.kind==="property"),f=t.createDiv({cls:"rem-record-detail"}),y=f.createDiv({cls:"rem-task-detail-header"}),m=y.createDiv();m.createEl("div",{text:e.kind,cls:"rem-kicker"}),m.createEl("h3",{text:e.title});let p=m.createDiv({cls:"rem-task-meta"});e.status&&p.createSpan({text:e.status}),e.client&&p.createSpan({text:e.client}),e.property&&p.createSpan({text:e.property}),e.date&&p.createSpan({text:e.date}),y.createEl("button",{text:"Open file"}).addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file));let w=f.createDiv({cls:"rem-record-detail-grid"}),d=w.createDiv({cls:"rem-panel"});d.createEl("h4",{text:"Record"}),d.createDiv({text:e.body||"No body yet.",cls:e.body?"rem-description":"rem-empty"});let v=w.createDiv({cls:"rem-panel"});v.createEl("h4",{text:"Linked work"}),this.relatedGroup(v,"Tasks",a),this.relatedGroup(v,"Meetings",o),this.relatedGroup(v,"Projects",c),this.relatedGroup(v,"People",h),this.relatedGroup(v,"Properties",l),i.length||v.createDiv({text:"No linked records found yet.",cls:"rem-empty"});let L=w.createDiv({cls:"rem-panel rem-record-notes-panel"});L.createEl("h4",{text:"Notes"});let Y=L.createDiv({cls:"rem-note-editor"}),M=Y.createEl("textarea",{attr:{placeholder:`Add a ${e.kind} note... Enter to save, Shift+Enter for a new line`}});if(M.value=this.recordNoteDrafts[e.file.path]||"",M.addEventListener("input",()=>{this.recordNoteDrafts[e.file.path]=M.value}),M.addEventListener("keydown",async g=>{g.key==="Enter"&&!g.shiftKey&&(g.preventDefault(),await this.saveRecordNote(e))}),Y.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveRecordNote(e)),!e.notes.length){L.createDiv({text:"No notes yet.",cls:"rem-empty"});return}let Q=L.createDiv({cls:"rem-note-list"});for(let g of e.notes.slice().reverse().slice(0,12)){let G=Q.createDiv({cls:"rem-note-card"});G.createDiv({text:g.date,cls:"rem-note-date"}),G.createDiv({text:g.text,cls:"rem-note-text"})}}relatedGroup(t,e,s){if(!s.length)return;let i=t.createDiv({cls:"rem-related-group"});i.createEl("h5",{text:`${e} (${s.length})`});let a=i.createDiv({cls:"rem-related-list"});for(let o of s.slice(0,8)){let c=a.createDiv({cls:"rem-related-row"});c.createSpan({text:o.title}),c.addEventListener("click",()=>{o.kind==="task"?(this.selectedTaskPath=o.file.path,this.selectedRecordPath=""):this.selectedRecordPath=o.file.path,this.render()})}}async saveRecordNote(t){let e=(this.recordNoteDrafts[t.file.path]||"").trim();e&&(await this.plugin.addRecordNote(t.file,e),this.recordNoteDrafts[t.file.path]="",await this.render())}dateControl(t,e,s,i){let a=t.createEl("label",{cls:"rem-date-control"});a.createSpan({text:e});let o=a.createEl("input",{type:"date"});o.value=s,o.addEventListener("change",()=>i(o.value))}async updateSelectedTask(t,e){await this.plugin.updateTaskFields(t.file,e),await this.render()}},I=class extends u.Modal{constructor(r,t,e){super(r),this.plugin=t,this.draft={kind:e,title:"",status:e==="task"?"open":"active",priority:"normal",due:"",scheduled:"",client:"",property:"",people:"",projects:"",tasks:"",body:""}}onOpen(){let{contentEl:r}=this;r.empty(),r.addClass("rem-modal"),r.createEl("h2",{text:`New ${this.draft.kind}`}),this.text("Title","Required","title"),this.draft.kind==="task"&&(this.text("Priority","normal, high, low","priority"),this.text("Due","YYYY-MM-DD","due"),this.text("Scheduled","YYYY-MM-DD","scheduled")),this.draft.kind!=="client"&&this.text("Client","Client note name","client"),["client","property"].includes(this.draft.kind)||this.text("Property","Property note name","property"),this.text("People","Comma-separated names","people"),this.draft.kind!=="project"&&this.text("Projects","Comma-separated project names","projects"),this.draft.kind==="meeting"&&this.text("Tasks","Comma-separated task names","tasks"),new u.Setting(r).setName(this.draft.kind==="task"?"Description":"Notes").addTextArea(t=>t.setPlaceholder("Write the starting body...").onChange(e=>{this.draft.body=e})),new u.Setting(r).addButton(t=>t.setButtonText("Create").setCta().onClick(async()=>{if(!this.draft.title.trim()){new u.Notice("Title is required.");return}await this.plugin.createRecord(this.draft),this.close()}))}text(r,t,e){new u.Setting(this.contentEl).setName(r).setDesc(t).addText(s=>s.setValue(String(this.draft[e]||"")).onChange(i=>{this.draft[e]=i}))}},_=class extends u.PluginSettingTab{constructor(r,t){super(r,t),this.plugin=t}display(){let{containerEl:r}=this;r.empty(),r.createEl("h2",{text:"Real Estate Management settings"}),r.createEl("p",{text:"Set vault-relative folders for independent Real Estate Management records. Existing TaskNotes-style task files can still be read as legacy records."}),this.folderSetting("Tasks folder","Native task records.","tasksFolder"),this.folderSetting("Done folder","Optional completed task records.","doneFolder"),this.folderSetting("Clients folder","Client or organisation records.","clientsFolder"),this.folderSetting("Properties folder","Property records.","propertiesFolder"),this.folderSetting("People folder","People and contact records.","peopleFolder"),this.folderSetting("Projects folder","Project records.","projectsFolder"),this.folderSetting("Meetings folder","Meeting records.","meetingsFolder"),this.folderSetting("Daily logs folder","Daily logs and dashboard notes.","dailyFolder")}folderSetting(r,t,e){new u.Setting(this.containerEl).setName(r).setDesc(t).addText(s=>s.setPlaceholder(K[e]).setValue(this.plugin.settings[e]).onChange(async i=>{this.plugin.settings[e]=S(i),await this.plugin.saveSettings()}))}};
