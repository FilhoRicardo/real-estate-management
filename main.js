/* Real Estate Management Obsidian plugin */
"use strict";var j=Object.defineProperty;var q=Object.getOwnPropertyDescriptor;var U=Object.getOwnPropertyNames;var z=Object.prototype.hasOwnProperty;var X=(n,r)=>{for(var t in r)j(n,t,{get:r[t],enumerable:!0})},J=(n,r,t,e)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of U(r))!z.call(n,s)&&s!==t&&j(n,s,{get:()=>r[s],enumerable:!(e=q(r,s))||e.enumerable});return n};var Q=n=>J(j({},"__esModule",{value:!0}),n);var we={};X(we,{default:()=>P});module.exports=Q(we);var u=require("obsidian");function A(n){let r=n.match(/^---\n([\s\S]*?)\n---/);if(!r)return{};let t={},e=null;for(let s of r[1].split(`
`))if(/^  - /.test(s)){let i=s.replace(/^  - /,"").trim().replace(/^["']|["']$/g,"");e&&Array.isArray(t[e])&&t[e].push(i)}else{let i=s.match(/^(\w+):\s*(.*)/);if(!i)continue;e=i[1];let a=i[2].trim();a?a[0]==="["?t[e]=a.slice(1,-1).split(",").map(o=>o.trim().replace(/^["']|["']$/g,"")):t[e]=a.replace(/^["']|["']$/g,""):t[e]=[]}return t}var T=n=>n?n.replace(/^\[\[|\]\]$/g,""):null,Z=n=>n.replace(/\\/g,"/").split("/").pop(),I=n=>Z(n).replace(/\.md$/i,"");var ee=n=>{if(n.match(/^(\d{4})-(\d{2})-(\d{2})$/))return n;let t=n.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!t)return null;let[,e,s,i]=t;return`${i}-${String(Number(s)).padStart(2,"0")}-${String(Number(e)).padStart(2,"0")}`};function te(n){let r=[],t=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})(?:\]\])?[ \t]*(?=\n|$)/g,e=[...n.matchAll(t)].map(s=>({date:ee(s[2]),start:s.index+s[1].length,end:s.index+s[0].length})).filter(s=>s.date);return e.forEach((s,i)=>{var o,c;[...n.slice(s.end,(c=(o=e[i+1])==null?void 0:o.start)!=null?c:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(g=>{let l=g[1].trim();l&&r.push({date:s.date,text:l,order:r.length})})}),r.sort((s,i)=>s.date.localeCompare(i.date)||s.order-i.order),r.forEach(s=>{delete s.order}),r}function _(n,r){let t=A(r),e=t.title||I(n),s=[...r.matchAll(/- \[([ x])\] (.+)/g)].map(o=>({done:o[1]==="x",text:o[2]})),i=te(r),a=Array.isArray(t.tags)?t.tags:t.tags?[t.tags]:[];return{id:n,title:e,filename:I(n),priority:t.priority||"normal",status:t.status||"none",due:t.due||null,scheduled:t.scheduled||null,dateCreated:t.dateCreated||null,dateModified:t.dateModified||null,contexts:Array.isArray(t.contexts)?t.contexts:t.contexts?[t.contexts]:[],client:T(t.client),building:T(t.building),projects:Array.isArray(t.projects)?t.projects.map(T):t.projects?[T(t.projects)]:[],waitingfor:T(t.waitingfor),tags:a,archived:a.includes("archived"),recurrent:t.recurrent==="true"||t.Recurrent==="true"||a.includes("recurrent")||a.includes("recurring"),recurrence:t.recurrence||null,completeInstances:Array.isArray(t.complete_instances)?t.complete_instances:[],skippedInstances:Array.isArray(t.skipped_instances)?t.skipped_instances:[],completedDate:t.completedDate||null,checklist:s,checklistDone:s.filter(o=>o.done).length,checklistTotal:s.length,logs:i,raw:r}}var F="real-estate-management-view",M="real-estate-management",H={tasksFolder:"Real Estate Management/Tasks",clientsFolder:"Real Estate Management/Clients",propertiesFolder:"Real Estate Management/Properties",peopleFolder:"Real Estate Management/People",projectsFolder:"Real Estate Management/Projects",meetingsFolder:"Real Estate Management/Meetings",dailyFolder:"Real Estate Management/Daily Logs",doneFolder:"Real Estate Management/Done"};function k(){let n=new Date,r=t=>String(t).padStart(2,"0");return`${n.getFullYear()}-${r(n.getMonth()+1)}-${r(n.getDate())}`}function N(n,r){let t=new Date(`${n}T12:00:00`);t.setDate(t.getDate()+r);let e=s=>String(s).padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}function x(n){return n.replace(/\\/g,"/").replace(/^\/+|\/+$/g,"")}function ne(n){return n.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g,"-").replace(/\s+/g," ").replace(/[. ]+$/g,"").slice(0,180)||"Untitled"}function se(n){let r=n.basename.trim().toLowerCase();return r==="index"||r.startsWith("_")||n.name==="timetracker.md"}function E(n,r){let t=x(r);return t.length>0&&n.path.startsWith(`${t}/`)}function B(n){return Array.isArray(n)?n.map(String).filter(Boolean):n?[String(n)].filter(Boolean):[]}function V(n){let r=n.trim();return r?r.startsWith("[[")&&r.endsWith("]]")?r:`[[${r}]]`:""}function O(n){return n.split(",").map(r=>r.trim()).filter(Boolean).map(V)}function S(n){return Array.isArray(n)?String(n[0]||""):String(n||"")}function re(n,r){return r==="task"?n.tasksFolder:r==="client"?n.clientsFolder:r==="property"?n.propertiesFolder:r==="person"?n.peopleFolder:r==="project"?n.projectsFolder:r==="meeting"?n.meetingsFolder:n.dailyFolder}function ie(n,r,t){let e=String(r.remType||"").toLowerCase();return["task","client","property","person","project","meeting","daily"].includes(e)?e:E(n,t.tasksFolder)||E(n,t.doneFolder)?"task":E(n,t.clientsFolder)?"client":E(n,t.propertiesFolder)?"property":E(n,t.peopleFolder)?"person":E(n,t.projectsFolder)?"project":E(n,t.meetingsFolder)?"meeting":E(n,t.dailyFolder)?"daily":null}function ae(n,r,t){var s,i;let e=(i=(s=r.match(/^#\s+(.+)$/m))==null?void 0:s[1])==null?void 0:i.trim();return S(t.title||t.name||t.person||t.building)||e||n.basename}function oe(n,r,t){let e=A(r),s=ie(n,e,t);if(!s)return null;if(s==="task"&&!e.remType){let i=_(n.path,r);return{kind:s,file:n,title:i.title,status:i.status,priority:i.priority,due:i.due,scheduled:i.scheduled,date:i.dateCreated,client:i.client,property:i.building,people:i.waitingfor?[i.waitingfor]:[],projects:i.projects||[],tasks:[],legacy:!0,description:L(r),notes:i.logs||[],raw:r,body:L(r)}}return{kind:s,file:n,title:ae(n,r,e),status:S(e.status)||(s==="task"?"open":"active"),priority:S(e.priority)||"normal",due:S(e.due)||null,scheduled:S(e.scheduled)||null,date:S(e.date||e.created||e.dateCreated)||null,client:S(e.client)||null,property:S(e.property||e.building)||null,people:B(e.people||e.person),projects:B(e.projects||e.project),tasks:B(e.tasks||e.task),legacy:!e.remType,description:s==="task"?L(r):"",notes:le(r),raw:r,body:ce(r,s)}}function b(n,r){let e=new RegExp(`(^|\\n)##\\s+${r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}[ \\t]*(?=\\n|$)`,"i").exec(n);if(!e)return"";let s=e.index+e[0].length,i=n.slice(s),a=i.search(/\n##\s+/),o=i.search(/\n---[ \t]*(?=\n|$)/),c=[a,o].filter(l=>l>=0),g=c.length?Math.min(...c):i.length;return i.slice(0,g).trim()}function L(n){let r=b(n,"Description");return r||n.replace(/^---\n[\s\S]*?\n---\n?/,"").split(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/)[0].replace(/^#\s+.+\n?/,"").replace(/^#{1,6}\s+Task descri(?:p)?tion\s*\n?/i,"").trim()}function ce(n,r){return r==="task"?L(n):n.replace(/^---\n[\s\S]*?\n---\n?/,"").replace(/^#\s+.+\n?/,"").split(/\n---[ \t]*(?=\n|$)/)[0].trim()}function le(n){let r=[],t=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2})(?:\]\])?[ \t]*(?=\n|$)/g,e=[...n.matchAll(t)].map(s=>({date:s[2],start:s.index+s[1].length,end:s.index+s[0].length}));return e.forEach((s,i)=>{var o,c;[...n.slice(s.end,(c=(o=e[i+1])==null?void 0:o.start)!=null?c:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(g=>{let l=g[1].trim();l&&r.push({date:s.date,text:l})})}),r.sort((s,i)=>s.date.localeCompare(i.date))}function de(n=new Date){return n.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!1})}function pe(n,r){let t=k(),e=`Log: [${de()}] ${r.trim()}`,s=`### [[${t}]]`,i=new RegExp(`(^|\\n)### (?:\\[\\[)?${t}(?:\\]\\])?[ \\t]*(?=\\n|$)`).exec(n);if(i){let c=i.index+i[0].length,l=n.slice(c).search(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/),m=l===-1?n.length:c+l,h=n.slice(c,m).search(/\n---[ \t]*(?=\n|$)/);if(h!==-1){let p=c+h;return`${n.slice(0,p).trimEnd()}
${e}

${n.slice(p).replace(/^\n+/,"")}`}return`${n.slice(0,m).trimEnd()}
${e}

---
${n.slice(m).replace(/^\n+/,"")}`}let a=`

${s}
${e}

---
`,o=/(^|\n)##\s+Notes[ \t]*(?=\n|$)/i.exec(n);if(o){let c=o.index+o[0].length;return`${n.slice(0,c).trimEnd()}${a}${n.slice(c).replace(/^\n+/,"")}`}return`${n.trimEnd()}

## Notes${a}`}function ue(n,r,t){let e=t.trim();if(!e)return n;let i=new RegExp(`(^|\\n)##\\s+${r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}[ \\t]*(?=\\n|$)`,"i").exec(n),a=`- ${e}`;if(!i)return`${n.trimEnd()}

## ${r}

${a}
`;let o=i.index+i[0].length,g=n.slice(o).search(/\n##\s+/),l=g===-1?n.length:o+g;return`${n.slice(0,l).trimEnd()}
${a}
${n.slice(l)}`}function ge(n){return/^---\n[\s\S]*?\n---/.test(n)?n:`---
---

${n.trimStart()}`}function he(n,r,t){let e=ge(n),s=e.match(/^---\n([\s\S]*?)\n---/);if(!s)return e;let i=s[1],a=`${r}: ${t}`,o=new RegExp(`^${r}:.*$`,"m");return`---
${o.test(i)?i.replace(o,a):`${i.trimEnd()}
${a}`}
---${e.slice(s[0].length)}`}function me(n,r){return Object.entries(r).reduce((t,[e,s])=>he(t,e,s),n)}function G(n){return String(n||"").replace(/^\[\[/,"").replace(/\]\]$/,"").split("|")[0].trim().toLowerCase()}function fe(n){return new Set([n.title,n.file.basename,`[[${n.title}]]`,`[[${n.file.basename}]]`].map(G).filter(Boolean))}function ye(n,r){return n.some(t=>r.has(G(t)))}function ke(n,r){if(n.file.path===r.file.path)return!1;let t=fe(r);return ye([n.client,n.property,...n.people,...n.projects,...n.tasks],t)}function R(n){return n.length?`
${n.map(r=>`  - "${r.replace(/"/g,'\\"')}"`).join(`
`)}`:"[]"}function D(n){return`"${n.replace(/"/g,'\\"')}"`}function $e(n){let r=n.title.trim(),t=k(),e=V(n.client),s=V(n.property),i=O(n.people),a=O(n.projects),o=O(n.tasks),c=n.body.trim();if(n.kind==="task")return`---
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
  - ${M}
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
  - ${M}
  - rem-meeting
---

# ${r}

## Notes

${c||""}

## Decisions

-

## Actions

-
`;let g=`rem-${n.kind}`,l=`client: ${e?D(e):""}
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
  - ${M}
  - ${g}
---

# ${r}

${c||""}

---

## Notes

---
`}function Y(n){return`---
remType: daily
title: ${D(n)}
date: ${n}
workStatus: workday
tags:
  - ${M}
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
`}var P=class extends u.Plugin{constructor(){super(...arguments);this.settings={...H}}async onload(){await this.loadSettings(),this.registerView(F,t=>new C(t,this)),this.addRibbonIcon("building-2","Real Estate Management",()=>{this.activateView()}),this.addCommand({id:"open-real-estate-management",name:"Open Real Estate Management",callback:()=>this.activateView()}),this.addCommand({id:"create-real-estate-task",name:"Create real estate task",callback:()=>this.openCreateModal("task")}),this.addCommand({id:"open-todays-real-estate-log",name:"Open today's real estate daily log",callback:()=>this.openDailyLog()}),this.addSettingTab(new W(this.app,this))}async activateView(){let t=this.app.workspace.getLeavesOfType(F);if(t.length){this.app.workspace.revealLeaf(t[0]);return}let e=this.app.workspace.getRightLeaf(!1);await(e==null?void 0:e.setViewState({type:F,active:!0})),e&&this.app.workspace.revealLeaf(e)}openCreateModal(t){new K(this.app,this,t).open()}async loadSettings(){this.settings=Object.assign({},H,await this.loadData())}async saveSettings(){await this.saveData(this.settings),this.refreshViews()}refreshViews(){this.app.workspace.getLeavesOfType(F).forEach(t=>{let e=t.view;e instanceof C&&e.render()})}async ensureFolder(t){let e=x(t);if(!e)return;let s=e.split("/"),i="";for(let a of s)i=i?`${i}/${a}`:a,this.app.vault.getAbstractFileByPath(i)||await this.app.vault.createFolder(i)}async uniquePath(t,e){let s=x(t),i=e.replace(/\.md$/i,""),a=`${s}/${i}.md`,o=2;for(;this.app.vault.getAbstractFileByPath(a);)a=`${s}/${i} ${o++}.md`;return a}async createRecord(t){let e=re(this.settings,t.kind);await this.ensureFolder(e);let s=await this.uniquePath(e,ne(t.kind==="project"?`Project - ${t.title}`:t.title)),i=await this.app.vault.create(s,$e(t));new u.Notice(`Created ${t.kind}: ${t.title}`),this.refreshViews(),await this.app.workspace.getLeaf(!1).openFile(i)}async addTaskNote(t,e){let s=e.trim();s&&(await this.app.vault.process(t,i=>pe(i,s)),new u.Notice("Task note added"),this.refreshViews())}async updateTaskFields(t,e){await this.app.vault.process(t,s=>me(s,{...e,modified:k(),dateModified:k()})),new u.Notice("Task updated"),this.refreshViews()}async closeTask(t){await this.updateTaskFields(t,{status:"done",completed:k(),completedDate:k()})}async postponeTask(t){let e={};t.due&&(e.due=N(t.due,7)),t.scheduled&&(e.scheduled=N(t.scheduled,7)),!t.due&&!t.scheduled&&(e.due=N(k(),7)),await this.updateTaskFields(t.file,e)}async openDailyLog(t=k()){await this.ensureFolder(this.settings.dailyFolder);let e=`${x(this.settings.dailyFolder)}/${t}.md`,s=this.app.vault.getAbstractFileByPath(e),i=s instanceof u.TFile?s:await this.app.vault.create(e,Y(t));await this.app.workspace.getLeaf(!1).openFile(i),this.refreshViews()}async dailyLogFile(t=k()){await this.ensureFolder(this.settings.dailyFolder);let e=`${x(this.settings.dailyFolder)}/${t}.md`,s=this.app.vault.getAbstractFileByPath(e);return s instanceof u.TFile?s:await this.app.vault.create(e,Y(t))}async appendDailyEntry(t,e){let s=await this.dailyLogFile();await this.app.vault.process(s,i=>ue(i,t,e)),new u.Notice(`Added to ${t}`),this.refreshViews()}async loadRecords(){let t=[];for(let e of this.app.vault.getMarkdownFiles())if(!se(e))try{let s=await this.app.vault.cachedRead(e),i=oe(e,s,this.settings);i&&t.push(i)}catch(s){console.warn(`Real Estate Management skipped ${e.path}`,s)}return t.sort((e,s)=>e.title.localeCompare(s.title))}},C=class extends u.ItemView{constructor(t,e){super(t);this.selectedTaskPath="";this.selectedRecordPath="";this.noteDraft="";this.dailyDrafts={};this.plugin=e}getViewType(){return F}getDisplayText(){return"Real Estate Management"}getIcon(){return"building-2"}async onOpen(){await this.render()}async render(){let t=this.containerEl.children[1];t.empty(),t.addClass("rem-plugin-root");let e=await this.plugin.loadRecords(),s=d=>e.filter($=>$.kind===d),i=s("task"),a=i.filter(d=>d.status!=="done"&&!E(d.file,this.plugin.settings.doneFolder)),o=a.filter(d=>d.due===k()||d.scheduled===k()),c=a.filter(d=>!!d.due&&d.due<k()),g=s("daily").find(d=>d.date===k()),l=i.find(d=>d.file.path===this.selectedTaskPath)||o[0]||a[0];l&&(this.selectedTaskPath=l.file.path);let m=e.find(d=>d.file.path===this.selectedRecordPath&&d.kind!=="task"),f=t.createDiv({cls:"rem-header rem-hero"}),h=f.createDiv();h.createEl("div",{text:"Real Estate Management",cls:"rem-kicker"}),h.createEl("h2",{text:"Mission control"}),h.createEl("p",{text:"Independent Obsidian records for tasks, clients, properties, people, projects, meetings, and daily logs.",cls:"rem-subtitle"});let p=f.createDiv({cls:"rem-actions rem-action-grid"});this.action(p,"+ Task",()=>this.plugin.openCreateModal("task")),this.action(p,"+ Client",()=>this.plugin.openCreateModal("client")),this.action(p,"+ Property",()=>this.plugin.openCreateModal("property")),this.action(p,"+ Person",()=>this.plugin.openCreateModal("person")),this.action(p,"+ Project",()=>this.plugin.openCreateModal("project")),this.action(p,"+ Meeting",()=>this.plugin.openCreateModal("meeting")),this.action(p,g?"Open Daily Log":"Create Daily Log",()=>this.plugin.openDailyLog()),this.action(p,"Refresh",()=>this.render());let y=t.createDiv({cls:"rem-stats"});this.stat(y,"Open tasks",String(a.length)),this.stat(y,"Today",String(o.length)),this.stat(y,"Overdue",String(c.length)),this.stat(y,"Clients",String(s("client").length)),this.stat(y,"Properties",String(s("property").length)),this.stat(y,"People",String(s("person").length)),this.stat(y,"Projects",String(s("project").length)),this.stat(y,"Meetings",String(s("meeting").length)),l&&this.taskDetail(t,l),this.dailyPanel(t,g),m&&this.recordDetail(t,m,e);let w=t.createDiv({cls:"rem-dashboard-grid"});this.taskSection(w,"Today",o,"No tasks due or scheduled today."),this.taskSection(w,"Overdue",c,"No overdue tasks."),this.recordSection(w,"Recent meetings",s("meeting").slice(-8).reverse(),"No meetings yet."),this.recordSection(w,"Properties",s("property").slice(0,12),"No properties yet."),this.recordSection(w,"People",s("person").slice(0,12),"No people yet."),this.recordSection(w,"Projects",s("project").slice(0,12),"No projects yet.")}action(t,e,s){t.createEl("button",{text:e}).addEventListener("click",s)}stat(t,e,s){let i=t.createDiv({cls:"rem-stat"});i.createDiv({text:e,cls:"rem-stat-label"}),i.createDiv({text:s,cls:"rem-stat-value"})}taskSection(t,e,s,i){let a=t.createDiv({cls:"rem-section"});if(a.createEl("h3",{text:e}),!s.length){a.createDiv({text:i,cls:"rem-empty"});return}let o=a.createDiv({cls:"rem-task-list"});for(let c of s.slice(0,12))this.recordRow(o,c)}recordSection(t,e,s,i){let a=t.createDiv({cls:"rem-section"});if(a.createEl("h3",{text:e}),!s.length){a.createDiv({text:i,cls:"rem-empty"});return}let o=a.createDiv({cls:"rem-task-list"});for(let c of s)this.recordRow(o,c)}recordRow(t,e){let s=t.createDiv({cls:"rem-task-row"});e.kind==="task"?(e.file.path===this.selectedTaskPath&&s.addClass("is-selected"),s.addEventListener("click",()=>{this.selectedTaskPath=e.file.path,this.selectedRecordPath="",this.noteDraft="",this.render()})):(e.file.path===this.selectedRecordPath&&s.addClass("is-selected"),s.addEventListener("click",()=>{this.selectedRecordPath=e.file.path,this.render()})),s.createDiv({text:e.title,cls:"rem-task-title"});let i=s.createDiv({cls:"rem-task-meta"});i.createSpan({text:e.kind}),e.legacy&&i.createSpan({text:"legacy"}),e.priority&&e.kind==="task"&&i.createSpan({text:e.priority}),e.status&&i.createSpan({text:e.status}),e.due&&i.createSpan({text:`due ${e.due}`}),e.scheduled&&i.createSpan({text:`scheduled ${e.scheduled}`}),e.client&&i.createSpan({text:e.client}),e.property&&i.createSpan({text:e.property})}taskDetail(t,e){let s=t.createDiv({cls:"rem-task-detail"}),i=s.createDiv({cls:"rem-task-detail-header"}),a=i.createDiv();a.createEl("div",{text:e.legacy?"Legacy TaskNotes task":"Native real estate task",cls:"rem-kicker"}),a.createEl("h3",{text:e.title});let o=a.createDiv({cls:"rem-task-meta"});o.createSpan({text:e.status||"open"}),o.createSpan({text:e.priority||"normal"}),e.due&&o.createSpan({text:`due ${e.due}`}),e.scheduled&&o.createSpan({text:`scheduled ${e.scheduled}`}),e.client&&o.createSpan({text:e.client}),e.property&&o.createSpan({text:e.property});let c=s.createDiv({cls:"rem-task-controls"});this.dateControl(c,"Due",e.due||"",d=>this.updateSelectedTask(e,{due:d})),this.dateControl(c,"Scheduled",e.scheduled||"",d=>this.updateSelectedTask(e,{scheduled:d})),c.createEl("button",{text:"Postpone 1w"}).addEventListener("click",()=>this.plugin.postponeTask(e)),c.createEl("button",{text:"Close task"}).addEventListener("click",()=>this.plugin.closeTask(e.file)),i.createEl("button",{text:"Open file"}).addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file));let l=s.createDiv({cls:"rem-task-detail-grid"}),m=l.createDiv({cls:"rem-panel"});m.createEl("h4",{text:"Description"}),m.createDiv({text:e.description||"No description yet.",cls:e.description?"rem-description":"rem-empty"});let f=l.createDiv({cls:"rem-panel"});f.createEl("h4",{text:"Notes"});let h=f.createDiv({cls:"rem-note-editor"}),p=h.createEl("textarea",{text:this.noteDraft,attr:{placeholder:"Add a task note... Enter to save, Shift+Enter for a new line"}});if(p.value=this.noteDraft,p.addEventListener("input",()=>{this.noteDraft=p.value}),p.addEventListener("keydown",async d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),await this.saveTaskNote(e))}),h.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveTaskNote(e)),!e.notes.length){f.createDiv({text:"No notes yet.",cls:"rem-empty"});return}let w=f.createDiv({cls:"rem-note-list"});for(let d of e.notes.slice().reverse().slice(0,12)){let $=w.createDiv({cls:"rem-note-card"});$.createDiv({text:d.date,cls:"rem-note-date"}),$.createDiv({text:d.text,cls:"rem-note-text"})}}dailyPanel(t,e){let s=t.createDiv({cls:"rem-daily-panel"}),i=s.createDiv({cls:"rem-daily-header"}),a=i.createDiv();a.createEl("div",{text:k(),cls:"rem-kicker"}),a.createEl("h3",{text:"Daily log"}),i.createEl("button",{text:e?"Open daily log":"Create daily log"}).addEventListener("click",()=>this.plugin.openDailyLog());let c=[["Mission",b((e==null?void 0:e.raw)||"","Mission")],["Notes",b((e==null?void 0:e.raw)||"","Notes")],["Reflections",b((e==null?void 0:e.raw)||"","Reflections")],["Brain dump",b((e==null?void 0:e.raw)||"","Brain dump")]],g=s.createDiv({cls:"rem-daily-grid"});for(let[l,m]of c){let f=g.createDiv({cls:"rem-panel"});f.createEl("h4",{text:l}),f.createDiv({text:m||"Nothing written yet.",cls:m?"rem-description rem-daily-body":"rem-empty"});let h=f.createDiv({cls:"rem-daily-editor"}),p=h.createEl("textarea",{attr:{placeholder:`Add ${l.toLowerCase()}...`}});p.value=this.dailyDrafts[l]||"",p.addEventListener("input",()=>{this.dailyDrafts[l]=p.value}),p.addEventListener("keydown",async y=>{y.key==="Enter"&&!y.shiftKey&&(y.preventDefault(),await this.saveDailyEntry(l))}),h.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveDailyEntry(l))}}async saveDailyEntry(t){let e=(this.dailyDrafts[t]||"").trim();e&&(await this.plugin.appendDailyEntry(t,e),this.dailyDrafts[t]="",await this.render())}async saveTaskNote(t){let e=this.noteDraft.trim();e&&(await this.plugin.addTaskNote(t.file,e),this.noteDraft="",await this.render())}recordDetail(t,e,s){let i=s.filter(v=>ke(v,e)),a=i.filter(v=>v.kind==="task"),o=i.filter(v=>v.kind==="meeting"),c=i.filter(v=>v.kind==="project"),g=i.filter(v=>v.kind==="person"),l=i.filter(v=>v.kind==="property"),m=t.createDiv({cls:"rem-record-detail"}),f=m.createDiv({cls:"rem-task-detail-header"}),h=f.createDiv();h.createEl("div",{text:e.kind,cls:"rem-kicker"}),h.createEl("h3",{text:e.title});let p=h.createDiv({cls:"rem-task-meta"});e.status&&p.createSpan({text:e.status}),e.client&&p.createSpan({text:e.client}),e.property&&p.createSpan({text:e.property}),e.date&&p.createSpan({text:e.date}),f.createEl("button",{text:"Open file"}).addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file));let w=m.createDiv({cls:"rem-record-detail-grid"}),d=w.createDiv({cls:"rem-panel"});d.createEl("h4",{text:"Record"}),d.createDiv({text:e.body||"No body yet.",cls:e.body?"rem-description":"rem-empty"});let $=w.createDiv({cls:"rem-panel"});$.createEl("h4",{text:"Linked work"}),this.relatedGroup($,"Tasks",a),this.relatedGroup($,"Meetings",o),this.relatedGroup($,"Projects",c),this.relatedGroup($,"People",g),this.relatedGroup($,"Properties",l),i.length||$.createDiv({text:"No linked records found yet.",cls:"rem-empty"})}relatedGroup(t,e,s){if(!s.length)return;let i=t.createDiv({cls:"rem-related-group"});i.createEl("h5",{text:`${e} (${s.length})`});let a=i.createDiv({cls:"rem-related-list"});for(let o of s.slice(0,8)){let c=a.createDiv({cls:"rem-related-row"});c.createSpan({text:o.title}),c.addEventListener("click",()=>{o.kind==="task"?(this.selectedTaskPath=o.file.path,this.selectedRecordPath=""):this.selectedRecordPath=o.file.path,this.render()})}}dateControl(t,e,s,i){let a=t.createEl("label",{cls:"rem-date-control"});a.createSpan({text:e});let o=a.createEl("input",{type:"date"});o.value=s,o.addEventListener("change",()=>i(o.value))}async updateSelectedTask(t,e){await this.plugin.updateTaskFields(t.file,e),await this.render()}},K=class extends u.Modal{constructor(r,t,e){super(r),this.plugin=t,this.draft={kind:e,title:"",status:e==="task"?"open":"active",priority:"normal",due:"",scheduled:"",client:"",property:"",people:"",projects:"",tasks:"",body:""}}onOpen(){let{contentEl:r}=this;r.empty(),r.addClass("rem-modal"),r.createEl("h2",{text:`New ${this.draft.kind}`}),this.text("Title","Required","title"),this.draft.kind==="task"&&(this.text("Priority","normal, high, low","priority"),this.text("Due","YYYY-MM-DD","due"),this.text("Scheduled","YYYY-MM-DD","scheduled")),this.draft.kind!=="client"&&this.text("Client","Client note name","client"),["client","property"].includes(this.draft.kind)||this.text("Property","Property note name","property"),this.text("People","Comma-separated names","people"),this.draft.kind!=="project"&&this.text("Projects","Comma-separated project names","projects"),this.draft.kind==="meeting"&&this.text("Tasks","Comma-separated task names","tasks"),new u.Setting(r).setName(this.draft.kind==="task"?"Description":"Notes").addTextArea(t=>t.setPlaceholder("Write the starting body...").onChange(e=>{this.draft.body=e})),new u.Setting(r).addButton(t=>t.setButtonText("Create").setCta().onClick(async()=>{if(!this.draft.title.trim()){new u.Notice("Title is required.");return}await this.plugin.createRecord(this.draft),this.close()}))}text(r,t,e){new u.Setting(this.contentEl).setName(r).setDesc(t).addText(s=>s.setValue(String(this.draft[e]||"")).onChange(i=>{this.draft[e]=i}))}},W=class extends u.PluginSettingTab{constructor(r,t){super(r,t),this.plugin=t}display(){let{containerEl:r}=this;r.empty(),r.createEl("h2",{text:"Real Estate Management settings"}),r.createEl("p",{text:"Set vault-relative folders for independent Real Estate Management records. Existing TaskNotes-style task files can still be read as legacy records."}),this.folderSetting("Tasks folder","Native task records.","tasksFolder"),this.folderSetting("Done folder","Optional completed task records.","doneFolder"),this.folderSetting("Clients folder","Client or organisation records.","clientsFolder"),this.folderSetting("Properties folder","Property records.","propertiesFolder"),this.folderSetting("People folder","People and contact records.","peopleFolder"),this.folderSetting("Projects folder","Project records.","projectsFolder"),this.folderSetting("Meetings folder","Meeting records.","meetingsFolder"),this.folderSetting("Daily logs folder","Daily logs and dashboard notes.","dailyFolder")}folderSetting(r,t,e){new u.Setting(this.containerEl).setName(r).setDesc(t).addText(s=>s.setPlaceholder(H[e]).setValue(this.plugin.settings[e]).onChange(async i=>{this.plugin.settings[e]=x(i),await this.plugin.saveSettings()}))}};
