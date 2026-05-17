/* Real Estate Management Obsidian plugin */
"use strict";var b=Object.defineProperty;var I=Object.getOwnPropertyDescriptor;var _=Object.getOwnPropertyNames;var Y=Object.prototype.hasOwnProperty;var q=(n,r)=>{for(var t in r)b(n,t,{get:r[t],enumerable:!0})},G=(n,r,t,e)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of _(r))!Y.call(n,s)&&s!==t&&b(n,s,{get:()=>r[s],enumerable:!(e=I(r,s))||e.enumerable});return n};var U=n=>G(b({},"__esModule",{value:!0}),n);var ge={};q(ge,{default:()=>x});module.exports=U(ge);var d=require("obsidian");function L(n){let r=n.match(/^---\n([\s\S]*?)\n---/);if(!r)return{};let t={},e=null;for(let s of r[1].split(`
`))if(/^  - /.test(s)){let i=s.replace(/^  - /,"").trim().replace(/^["']|["']$/g,"");e&&Array.isArray(t[e])&&t[e].push(i)}else{let i=s.match(/^(\w+):\s*(.*)/);if(!i)continue;e=i[1];let a=i[2].trim();a?a[0]==="["?t[e]=a.slice(1,-1).split(",").map(o=>o.trim().replace(/^["']|["']$/g,"")):t[e]=a.replace(/^["']|["']$/g,""):t[e]=[]}return t}var D=n=>n?n.replace(/^\[\[|\]\]$/g,""):null,z=n=>n.replace(/\\/g,"/").split("/").pop(),W=n=>z(n).replace(/\.md$/i,"");var X=n=>{if(n.match(/^(\d{4})-(\d{2})-(\d{2})$/))return n;let t=n.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!t)return null;let[,e,s,i]=t;return`${i}-${String(Number(s)).padStart(2,"0")}-${String(Number(e)).padStart(2,"0")}`};function J(n){let r=[],t=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})(?:\]\])?[ \t]*(?=\n|$)/g,e=[...n.matchAll(t)].map(s=>({date:X(s[2]),start:s.index+s[1].length,end:s.index+s[0].length})).filter(s=>s.date);return e.forEach((s,i)=>{var o,c;[...n.slice(s.end,(c=(o=e[i+1])==null?void 0:o.start)!=null?c:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(f=>{let l=f[1].trim();l&&r.push({date:s.date,text:l,order:r.length})})}),r.sort((s,i)=>s.date.localeCompare(i.date)||s.order-i.order),r.forEach(s=>{delete s.order}),r}function K(n,r){let t=L(r),e=t.title||W(n),s=[...r.matchAll(/- \[([ x])\] (.+)/g)].map(o=>({done:o[1]==="x",text:o[2]})),i=J(r),a=Array.isArray(t.tags)?t.tags:t.tags?[t.tags]:[];return{id:n,title:e,filename:W(n),priority:t.priority||"normal",status:t.status||"none",due:t.due||null,scheduled:t.scheduled||null,dateCreated:t.dateCreated||null,dateModified:t.dateModified||null,contexts:Array.isArray(t.contexts)?t.contexts:t.contexts?[t.contexts]:[],client:D(t.client),building:D(t.building),projects:Array.isArray(t.projects)?t.projects.map(D):t.projects?[D(t.projects)]:[],waitingfor:D(t.waitingfor),tags:a,archived:a.includes("archived"),recurrent:t.recurrent==="true"||t.Recurrent==="true"||a.includes("recurrent")||a.includes("recurring"),recurrence:t.recurrence||null,completeInstances:Array.isArray(t.complete_instances)?t.complete_instances:[],skippedInstances:Array.isArray(t.skipped_instances)?t.skipped_instances:[],completedDate:t.completedDate||null,checklist:s,checklistDone:s.filter(o=>o.done).length,checklistTotal:s.length,logs:i,raw:r}}var R="real-estate-management-view",F="real-estate-management",A={tasksFolder:"Real Estate Management/Tasks",clientsFolder:"Real Estate Management/Clients",propertiesFolder:"Real Estate Management/Properties",peopleFolder:"Real Estate Management/People",projectsFolder:"Real Estate Management/Projects",meetingsFolder:"Real Estate Management/Meetings",dailyFolder:"Real Estate Management/Daily Logs",doneFolder:"Real Estate Management/Done"};function m(){let n=new Date,r=t=>String(t).padStart(2,"0");return`${n.getFullYear()}-${r(n.getMonth()+1)}-${r(n.getDate())}`}function C(n,r){let t=new Date(`${n}T12:00:00`);t.setDate(t.getDate()+r);let e=s=>String(s).padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}function T(n){return n.replace(/\\/g,"/").replace(/^\/+|\/+$/g,"")}function Q(n){return n.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g,"-").replace(/\s+/g," ").replace(/[. ]+$/g,"").slice(0,180)||"Untitled"}function Z(n){let r=n.basename.trim().toLowerCase();return r==="index"||r.startsWith("_")||n.name==="timetracker.md"}function w(n,r){let t=T(r);return t.length>0&&n.path.startsWith(`${t}/`)}function j(n){return Array.isArray(n)?n.map(String).filter(Boolean):n?[String(n)].filter(Boolean):[]}function N(n){let r=n.trim();return r?r.startsWith("[[")&&r.endsWith("]]")?r:`[[${r}]]`:""}function P(n){return n.split(",").map(r=>r.trim()).filter(Boolean).map(N)}function E(n){return Array.isArray(n)?String(n[0]||""):String(n||"")}function ee(n,r){return r==="task"?n.tasksFolder:r==="client"?n.clientsFolder:r==="property"?n.propertiesFolder:r==="person"?n.peopleFolder:r==="project"?n.projectsFolder:r==="meeting"?n.meetingsFolder:n.dailyFolder}function te(n,r,t){let e=String(r.remType||"").toLowerCase();return["task","client","property","person","project","meeting","daily"].includes(e)?e:w(n,t.tasksFolder)||w(n,t.doneFolder)?"task":w(n,t.clientsFolder)?"client":w(n,t.propertiesFolder)?"property":w(n,t.peopleFolder)?"person":w(n,t.projectsFolder)?"project":w(n,t.meetingsFolder)?"meeting":w(n,t.dailyFolder)?"daily":null}function ne(n,r,t){var s,i;let e=(i=(s=r.match(/^#\s+(.+)$/m))==null?void 0:s[1])==null?void 0:i.trim();return E(t.title||t.name||t.person||t.building)||e||n.basename}function se(n,r,t){let e=L(r),s=te(n,e,t);if(!s)return null;if(s==="task"&&!e.remType){let i=K(n.path,r);return{kind:s,file:n,title:i.title,status:i.status,priority:i.priority,due:i.due,scheduled:i.scheduled,date:i.dateCreated,client:i.client,property:i.building,people:i.waitingfor?[i.waitingfor]:[],projects:i.projects||[],tasks:[],legacy:!0,description:H(r),notes:i.logs||[],raw:r}}return{kind:s,file:n,title:ne(n,r,e),status:E(e.status)||(s==="task"?"open":"active"),priority:E(e.priority)||"normal",due:E(e.due)||null,scheduled:E(e.scheduled)||null,date:E(e.date||e.created||e.dateCreated)||null,client:E(e.client)||null,property:E(e.property||e.building)||null,people:j(e.people||e.person),projects:j(e.projects||e.project),tasks:j(e.tasks||e.task),legacy:!e.remType,description:s==="task"?H(r):"",notes:ie(r),raw:r}}function re(n,r){let e=new RegExp(`(^|\\n)##\\s+${r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}[ \\t]*(?=\\n|$)`,"i").exec(n);if(!e)return"";let s=e.index+e[0].length,i=n.slice(s),a=i.search(/\n##\s+/),o=i.search(/\n---[ \t]*(?=\n|$)/),c=[a,o].filter(l=>l>=0),f=c.length?Math.min(...c):i.length;return i.slice(0,f).trim()}function H(n){let r=re(n,"Description");return r||n.replace(/^---\n[\s\S]*?\n---\n?/,"").split(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/)[0].replace(/^#\s+.+\n?/,"").replace(/^#{1,6}\s+Task descri(?:p)?tion\s*\n?/i,"").trim()}function ie(n){let r=[],t=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2})(?:\]\])?[ \t]*(?=\n|$)/g,e=[...n.matchAll(t)].map(s=>({date:s[2],start:s.index+s[1].length,end:s.index+s[0].length}));return e.forEach((s,i)=>{var o,c;[...n.slice(s.end,(c=(o=e[i+1])==null?void 0:o.start)!=null?c:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(f=>{let l=f[1].trim();l&&r.push({date:s.date,text:l})})}),r.sort((s,i)=>s.date.localeCompare(i.date))}function ae(n=new Date){return n.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!1})}function oe(n,r){let t=m(),e=`Log: [${ae()}] ${r.trim()}`,s=`### [[${t}]]`,i=new RegExp(`(^|\\n)### (?:\\[\\[)?${t}(?:\\]\\])?[ \\t]*(?=\\n|$)`).exec(n);if(i){let c=i.index+i[0].length,l=n.slice(c).search(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/),k=l===-1?n.length:c+l,g=n.slice(c,k).search(/\n---[ \t]*(?=\n|$)/);if(g!==-1){let p=c+g;return`${n.slice(0,p).trimEnd()}
${e}

${n.slice(p).replace(/^\n+/,"")}`}return`${n.slice(0,k).trimEnd()}
${e}

---
${n.slice(k).replace(/^\n+/,"")}`}let a=`

${s}
${e}

---
`,o=/(^|\n)##\s+Notes[ \t]*(?=\n|$)/i.exec(n);if(o){let c=o.index+o[0].length;return`${n.slice(0,c).trimEnd()}${a}${n.slice(c).replace(/^\n+/,"")}`}return`${n.trimEnd()}

## Notes${a}`}function ce(n){return/^---\n[\s\S]*?\n---/.test(n)?n:`---
---

${n.trimStart()}`}function le(n,r,t){let e=ce(n),s=e.match(/^---\n([\s\S]*?)\n---/);if(!s)return e;let i=s[1],a=`${r}: ${t}`,o=new RegExp(`^${r}:.*$`,"m");return`---
${o.test(i)?i.replace(o,a):`${i.trimEnd()}
${a}`}
---${e.slice(s[0].length)}`}function de(n,r){return Object.entries(r).reduce((t,[e,s])=>le(t,e,s),n)}function v(n){return n.length?`
${n.map(r=>`  - "${r.replace(/"/g,'\\"')}"`).join(`
`)}`:"[]"}function y(n){return`"${n.replace(/"/g,'\\"')}"`}function pe(n){let r=n.title.trim(),t=m(),e=N(n.client),s=N(n.property),i=P(n.people),a=P(n.projects),o=P(n.tasks),c=n.body.trim();if(n.kind==="task")return`---
remType: task
title: ${y(r)}
status: ${n.status||"open"}
priority: ${n.priority||"normal"}
due: ${n.due||""}
scheduled: ${n.scheduled||""}
created: ${t}
modified: ${t}
client: ${e?y(e):""}
property: ${s?y(s):""}
people: ${v(i)}
projects: ${v(a)}
tags:
  - ${F}
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
title: ${y(r)}
date: ${t}
client: ${e?y(e):""}
property: ${s?y(s):""}
people: ${v(i)}
projects: ${v(a)}
tasks: ${v(o)}
tags:
  - ${F}
  - rem-meeting
---

# ${r}

## Notes

${c||""}

## Decisions

-

## Actions

-
`;let f=`rem-${n.kind}`,l=`client: ${e?y(e):""}
property: ${s?y(s):""}
people: ${v(i)}
projects: ${v(a)}
tasks: ${v(o)}`;return`---
remType: ${n.kind}
title: ${y(r)}
status: ${n.status||"active"}
created: ${t}
modified: ${t}
${l}
tags:
  - ${F}
  - ${f}
---

# ${r}

${c||""}

---

## Notes

---
`}function ue(n){return`---
remType: daily
title: ${y(n)}
date: ${n}
workStatus: workday
tags:
  - ${F}
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
`}var x=class extends d.Plugin{constructor(){super(...arguments);this.settings={...A}}async onload(){await this.loadSettings(),this.registerView(R,t=>new M(t,this)),this.addRibbonIcon("building-2","Real Estate Management",()=>{this.activateView()}),this.addCommand({id:"open-real-estate-management",name:"Open Real Estate Management",callback:()=>this.activateView()}),this.addCommand({id:"create-real-estate-task",name:"Create real estate task",callback:()=>this.openCreateModal("task")}),this.addCommand({id:"open-todays-real-estate-log",name:"Open today's real estate daily log",callback:()=>this.openDailyLog()}),this.addSettingTab(new O(this.app,this))}async activateView(){let t=this.app.workspace.getLeavesOfType(R);if(t.length){this.app.workspace.revealLeaf(t[0]);return}let e=this.app.workspace.getRightLeaf(!1);await(e==null?void 0:e.setViewState({type:R,active:!0})),e&&this.app.workspace.revealLeaf(e)}openCreateModal(t){new B(this.app,this,t).open()}async loadSettings(){this.settings=Object.assign({},A,await this.loadData())}async saveSettings(){await this.saveData(this.settings),this.refreshViews()}refreshViews(){this.app.workspace.getLeavesOfType(R).forEach(t=>{let e=t.view;e instanceof M&&e.render()})}async ensureFolder(t){let e=T(t);if(!e)return;let s=e.split("/"),i="";for(let a of s)i=i?`${i}/${a}`:a,this.app.vault.getAbstractFileByPath(i)||await this.app.vault.createFolder(i)}async uniquePath(t,e){let s=T(t),i=e.replace(/\.md$/i,""),a=`${s}/${i}.md`,o=2;for(;this.app.vault.getAbstractFileByPath(a);)a=`${s}/${i} ${o++}.md`;return a}async createRecord(t){let e=ee(this.settings,t.kind);await this.ensureFolder(e);let s=await this.uniquePath(e,Q(t.kind==="project"?`Project - ${t.title}`:t.title)),i=await this.app.vault.create(s,pe(t));new d.Notice(`Created ${t.kind}: ${t.title}`),this.refreshViews(),await this.app.workspace.getLeaf(!1).openFile(i)}async addTaskNote(t,e){let s=e.trim();s&&(await this.app.vault.process(t,i=>oe(i,s)),new d.Notice("Task note added"),this.refreshViews())}async updateTaskFields(t,e){await this.app.vault.process(t,s=>de(s,{...e,modified:m(),dateModified:m()})),new d.Notice("Task updated"),this.refreshViews()}async closeTask(t){await this.updateTaskFields(t,{status:"done",completed:m(),completedDate:m()})}async postponeTask(t){let e={};t.due&&(e.due=C(t.due,7)),t.scheduled&&(e.scheduled=C(t.scheduled,7)),!t.due&&!t.scheduled&&(e.due=C(m(),7)),await this.updateTaskFields(t.file,e)}async openDailyLog(t=m()){await this.ensureFolder(this.settings.dailyFolder);let e=`${T(this.settings.dailyFolder)}/${t}.md`,s=this.app.vault.getAbstractFileByPath(e),i=s instanceof d.TFile?s:await this.app.vault.create(e,ue(t));await this.app.workspace.getLeaf(!1).openFile(i),this.refreshViews()}async loadRecords(){let t=[];for(let e of this.app.vault.getMarkdownFiles())if(!Z(e))try{let s=await this.app.vault.cachedRead(e),i=se(e,s,this.settings);i&&t.push(i)}catch(s){console.warn(`Real Estate Management skipped ${e.path}`,s)}return t.sort((e,s)=>e.title.localeCompare(s.title))}},M=class extends d.ItemView{constructor(t,e){super(t);this.selectedTaskPath="";this.noteDraft="";this.plugin=e}getViewType(){return R}getDisplayText(){return"Real Estate Management"}getIcon(){return"building-2"}async onOpen(){await this.render()}async render(){let t=this.containerEl.children[1];t.empty(),t.addClass("rem-plugin-root");let e=await this.plugin.loadRecords(),s=u=>e.filter(h=>h.kind===u),i=s("task"),a=i.filter(u=>u.status!=="done"&&!w(u.file,this.plugin.settings.doneFolder)),o=a.filter(u=>u.due===m()||u.scheduled===m()),c=a.filter(u=>!!u.due&&u.due<m()),f=s("daily").find(u=>u.date===m()),l=i.find(u=>u.file.path===this.selectedTaskPath)||o[0]||a[0];l&&(this.selectedTaskPath=l.file.path);let k=t.createDiv({cls:"rem-header rem-hero"}),$=k.createDiv();$.createEl("div",{text:"Real Estate Management",cls:"rem-kicker"}),$.createEl("h2",{text:"Mission control"}),$.createEl("p",{text:"Independent Obsidian records for tasks, clients, properties, people, projects, meetings, and daily logs.",cls:"rem-subtitle"});let g=k.createDiv({cls:"rem-actions rem-action-grid"});this.action(g,"+ Task",()=>this.plugin.openCreateModal("task")),this.action(g,"+ Client",()=>this.plugin.openCreateModal("client")),this.action(g,"+ Property",()=>this.plugin.openCreateModal("property")),this.action(g,"+ Person",()=>this.plugin.openCreateModal("person")),this.action(g,"+ Project",()=>this.plugin.openCreateModal("project")),this.action(g,"+ Meeting",()=>this.plugin.openCreateModal("meeting")),this.action(g,f?"Open Daily Log":"Create Daily Log",()=>this.plugin.openDailyLog()),this.action(g,"Refresh",()=>this.render());let p=t.createDiv({cls:"rem-stats"});this.stat(p,"Open tasks",String(a.length)),this.stat(p,"Today",String(o.length)),this.stat(p,"Overdue",String(c.length)),this.stat(p,"Clients",String(s("client").length)),this.stat(p,"Properties",String(s("property").length)),this.stat(p,"People",String(s("person").length)),this.stat(p,"Projects",String(s("project").length)),this.stat(p,"Meetings",String(s("meeting").length)),l&&this.taskDetail(t,l);let S=t.createDiv({cls:"rem-dashboard-grid"});this.taskSection(S,"Today",o,"No tasks due or scheduled today."),this.taskSection(S,"Overdue",c,"No overdue tasks."),this.recordSection(S,"Recent meetings",s("meeting").slice(-8).reverse(),"No meetings yet."),this.recordSection(S,"Properties",s("property").slice(0,12),"No properties yet."),this.recordSection(S,"People",s("person").slice(0,12),"No people yet."),this.recordSection(S,"Projects",s("project").slice(0,12),"No projects yet.")}action(t,e,s){t.createEl("button",{text:e}).addEventListener("click",s)}stat(t,e,s){let i=t.createDiv({cls:"rem-stat"});i.createDiv({text:e,cls:"rem-stat-label"}),i.createDiv({text:s,cls:"rem-stat-value"})}taskSection(t,e,s,i){let a=t.createDiv({cls:"rem-section"});if(a.createEl("h3",{text:e}),!s.length){a.createDiv({text:i,cls:"rem-empty"});return}let o=a.createDiv({cls:"rem-task-list"});for(let c of s.slice(0,12))this.recordRow(o,c)}recordSection(t,e,s,i){let a=t.createDiv({cls:"rem-section"});if(a.createEl("h3",{text:e}),!s.length){a.createDiv({text:i,cls:"rem-empty"});return}let o=a.createDiv({cls:"rem-task-list"});for(let c of s)this.recordRow(o,c)}recordRow(t,e){let s=t.createDiv({cls:"rem-task-row"});e.kind==="task"?(e.file.path===this.selectedTaskPath&&s.addClass("is-selected"),s.addEventListener("click",()=>{this.selectedTaskPath=e.file.path,this.noteDraft="",this.render()})):s.addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file)),s.createDiv({text:e.title,cls:"rem-task-title"});let i=s.createDiv({cls:"rem-task-meta"});i.createSpan({text:e.kind}),e.legacy&&i.createSpan({text:"legacy"}),e.priority&&e.kind==="task"&&i.createSpan({text:e.priority}),e.status&&i.createSpan({text:e.status}),e.due&&i.createSpan({text:`due ${e.due}`}),e.scheduled&&i.createSpan({text:`scheduled ${e.scheduled}`}),e.client&&i.createSpan({text:e.client}),e.property&&i.createSpan({text:e.property})}taskDetail(t,e){let s=t.createDiv({cls:"rem-task-detail"}),i=s.createDiv({cls:"rem-task-detail-header"}),a=i.createDiv();a.createEl("div",{text:e.legacy?"Legacy TaskNotes task":"Native real estate task",cls:"rem-kicker"}),a.createEl("h3",{text:e.title});let o=a.createDiv({cls:"rem-task-meta"});o.createSpan({text:e.status||"open"}),o.createSpan({text:e.priority||"normal"}),e.due&&o.createSpan({text:`due ${e.due}`}),e.scheduled&&o.createSpan({text:`scheduled ${e.scheduled}`}),e.client&&o.createSpan({text:e.client}),e.property&&o.createSpan({text:e.property});let c=s.createDiv({cls:"rem-task-controls"});this.dateControl(c,"Due",e.due||"",h=>this.updateSelectedTask(e,{due:h})),this.dateControl(c,"Scheduled",e.scheduled||"",h=>this.updateSelectedTask(e,{scheduled:h})),c.createEl("button",{text:"Postpone 1w"}).addEventListener("click",()=>this.plugin.postponeTask(e)),c.createEl("button",{text:"Close task"}).addEventListener("click",()=>this.plugin.closeTask(e.file)),i.createEl("button",{text:"Open file"}).addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file));let l=s.createDiv({cls:"rem-task-detail-grid"}),k=l.createDiv({cls:"rem-panel"});k.createEl("h4",{text:"Description"}),k.createDiv({text:e.description||"No description yet.",cls:e.description?"rem-description":"rem-empty"});let $=l.createDiv({cls:"rem-panel"});$.createEl("h4",{text:"Notes"});let g=$.createDiv({cls:"rem-note-editor"}),p=g.createEl("textarea",{text:this.noteDraft,attr:{placeholder:"Add a task note... Enter to save, Shift+Enter for a new line"}});if(p.value=this.noteDraft,p.addEventListener("input",()=>{this.noteDraft=p.value}),p.addEventListener("keydown",async h=>{h.key==="Enter"&&!h.shiftKey&&(h.preventDefault(),await this.saveTaskNote(e))}),g.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveTaskNote(e)),!e.notes.length){$.createDiv({text:"No notes yet.",cls:"rem-empty"});return}let u=$.createDiv({cls:"rem-note-list"});for(let h of e.notes.slice().reverse().slice(0,12)){let V=u.createDiv({cls:"rem-note-card"});V.createDiv({text:h.date,cls:"rem-note-date"}),V.createDiv({text:h.text,cls:"rem-note-text"})}}async saveTaskNote(t){let e=this.noteDraft.trim();e&&(await this.plugin.addTaskNote(t.file,e),this.noteDraft="",await this.render())}dateControl(t,e,s,i){let a=t.createEl("label",{cls:"rem-date-control"});a.createSpan({text:e});let o=a.createEl("input",{type:"date"});o.value=s,o.addEventListener("change",()=>i(o.value))}async updateSelectedTask(t,e){await this.plugin.updateTaskFields(t.file,e),await this.render()}},B=class extends d.Modal{constructor(r,t,e){super(r),this.plugin=t,this.draft={kind:e,title:"",status:e==="task"?"open":"active",priority:"normal",due:"",scheduled:"",client:"",property:"",people:"",projects:"",tasks:"",body:""}}onOpen(){let{contentEl:r}=this;r.empty(),r.addClass("rem-modal"),r.createEl("h2",{text:`New ${this.draft.kind}`}),this.text("Title","Required","title"),this.draft.kind==="task"&&(this.text("Priority","normal, high, low","priority"),this.text("Due","YYYY-MM-DD","due"),this.text("Scheduled","YYYY-MM-DD","scheduled")),this.draft.kind!=="client"&&this.text("Client","Client note name","client"),["client","property"].includes(this.draft.kind)||this.text("Property","Property note name","property"),this.text("People","Comma-separated names","people"),this.draft.kind!=="project"&&this.text("Projects","Comma-separated project names","projects"),this.draft.kind==="meeting"&&this.text("Tasks","Comma-separated task names","tasks"),new d.Setting(r).setName(this.draft.kind==="task"?"Description":"Notes").addTextArea(t=>t.setPlaceholder("Write the starting body...").onChange(e=>{this.draft.body=e})),new d.Setting(r).addButton(t=>t.setButtonText("Create").setCta().onClick(async()=>{if(!this.draft.title.trim()){new d.Notice("Title is required.");return}await this.plugin.createRecord(this.draft),this.close()}))}text(r,t,e){new d.Setting(this.contentEl).setName(r).setDesc(t).addText(s=>s.setValue(String(this.draft[e]||"")).onChange(i=>{this.draft[e]=i}))}},O=class extends d.PluginSettingTab{constructor(r,t){super(r,t),this.plugin=t}display(){let{containerEl:r}=this;r.empty(),r.createEl("h2",{text:"Real Estate Management settings"}),r.createEl("p",{text:"Set vault-relative folders for independent Real Estate Management records. Existing TaskNotes-style task files can still be read as legacy records."}),this.folderSetting("Tasks folder","Native task records.","tasksFolder"),this.folderSetting("Done folder","Optional completed task records.","doneFolder"),this.folderSetting("Clients folder","Client or organisation records.","clientsFolder"),this.folderSetting("Properties folder","Property records.","propertiesFolder"),this.folderSetting("People folder","People and contact records.","peopleFolder"),this.folderSetting("Projects folder","Project records.","projectsFolder"),this.folderSetting("Meetings folder","Meeting records.","meetingsFolder"),this.folderSetting("Daily logs folder","Daily logs and dashboard notes.","dailyFolder")}folderSetting(r,t,e){new d.Setting(this.containerEl).setName(r).setDesc(t).addText(s=>s.setPlaceholder(A[e]).setValue(this.plugin.settings[e]).onChange(async i=>{this.plugin.settings[e]=T(i),await this.plugin.saveSettings()}))}};
