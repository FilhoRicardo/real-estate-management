/* Real Estate Management Obsidian plugin */
"use strict";var B=Object.defineProperty;var Z=Object.getOwnPropertyDescriptor;var ee=Object.getOwnPropertyNames;var te=Object.prototype.hasOwnProperty;var ne=(n,i)=>{for(var t in i)B(n,t,{get:i[t],enumerable:!0})},se=(n,i,t,e)=>{if(i&&typeof i=="object"||typeof i=="function")for(let s of ee(i))!te.call(n,s)&&s!==t&&B(n,s,{get:()=>i[s],enumerable:!(e=Z(i,s))||e.enumerable});return n};var re=n=>se(B({},"__esModule",{value:!0}),n);var Se={};ne(Se,{default:()=>N});module.exports=re(Se);var p=require("obsidian");function O(n){let i=n.match(/^---\n([\s\S]*?)\n---/);if(!i)return{};let t={},e=null;for(let s of i[1].split(`
`))if(/^  - /.test(s)){let r=s.replace(/^  - /,"").trim().replace(/^["']|["']$/g,"");e&&Array.isArray(t[e])&&t[e].push(r)}else{let r=s.match(/^(\w+):\s*(.*)/);if(!r)continue;e=r[1];let a=r[2].trim();a?a[0]==="["?t[e]=a.slice(1,-1).split(",").map(o=>o.trim().replace(/^["']|["']$/g,"")):t[e]=a.replace(/^["']|["']$/g,""):t[e]=[]}return t}var F=n=>n?n.replace(/^\[\[|\]\]$/g,""):null,ie=n=>n.replace(/\\/g,"/").split("/").pop(),q=n=>ie(n).replace(/\.md$/i,"");var ae=n=>{if(n.match(/^(\d{4})-(\d{2})-(\d{2})$/))return n;let t=n.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!t)return null;let[,e,s,r]=t;return`${r}-${String(Number(s)).padStart(2,"0")}-${String(Number(e)).padStart(2,"0")}`};function oe(n){let i=[],t=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})(?:\]\])?[ \t]*(?=\n|$)/g,e=[...n.matchAll(t)].map(s=>({date:ae(s[2]),start:s.index+s[1].length,end:s.index+s[0].length})).filter(s=>s.date);return e.forEach((s,r)=>{var o,c;[...n.slice(s.end,(c=(o=e[r+1])==null?void 0:o.start)!=null?c:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(g=>{let l=g[1].trim();l&&i.push({date:s.date,text:l,order:i.length})})}),i.sort((s,r)=>s.date.localeCompare(r.date)||s.order-r.order),i.forEach(s=>{delete s.order}),i}function Q(n,i){let t=O(i),e=t.title||q(n),s=[...i.matchAll(/- \[([ x])\] (.+)/g)].map(o=>({done:o[1]==="x",text:o[2]})),r=oe(i),a=Array.isArray(t.tags)?t.tags:t.tags?[t.tags]:[];return{id:n,title:e,filename:q(n),priority:t.priority||"normal",status:t.status||"none",due:t.due||null,scheduled:t.scheduled||null,dateCreated:t.dateCreated||null,dateModified:t.dateModified||null,contexts:Array.isArray(t.contexts)?t.contexts:t.contexts?[t.contexts]:[],client:F(t.client),building:F(t.building),projects:Array.isArray(t.projects)?t.projects.map(F):t.projects?[F(t.projects)]:[],waitingfor:F(t.waitingfor),tags:a,archived:a.includes("archived"),recurrent:t.recurrent==="true"||t.Recurrent==="true"||a.includes("recurrent")||a.includes("recurring"),recurrence:t.recurrence||null,completeInstances:Array.isArray(t.complete_instances)?t.complete_instances:[],skippedInstances:Array.isArray(t.skipped_instances)?t.skipped_instances:[],completedDate:t.completedDate||null,checklist:s,checklistDone:s.filter(o=>o.done).length,checklistTotal:s.length,logs:r,raw:i}}var b="real-estate-management-view",C="real-estate-management",W={tasksFolder:"Real Estate Management/Tasks",clientsFolder:"Real Estate Management/Clients",propertiesFolder:"Real Estate Management/Properties",peopleFolder:"Real Estate Management/People",projectsFolder:"Real Estate Management/Projects",meetingsFolder:"Real Estate Management/Meetings",dailyFolder:"Real Estate Management/Daily Logs",doneFolder:"Real Estate Management/Done"};function w(){let n=new Date,i=t=>String(t).padStart(2,"0");return`${n.getFullYear()}-${i(n.getMonth()+1)}-${i(n.getDate())}`}function V(n,i){let t=new Date(`${n}T12:00:00`);t.setDate(t.getDate()+i);let e=s=>String(s).padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}function T(n){return n.replace(/\\/g,"/").replace(/^\/+|\/+$/g,"")}function ce(n){return n.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g,"-").replace(/\s+/g," ").replace(/[. ]+$/g,"").slice(0,180)||"Untitled"}function le(n){let i=n.basename.trim().toLowerCase();return i==="index"||i.startsWith("_")||n.name==="timetracker.md"}function R(n,i){let t=T(i);return t.length>0&&n.path.startsWith(`${t}/`)}function H(n){return Array.isArray(n)?n.map(String).filter(Boolean):n?[String(n)].filter(Boolean):[]}function I(n){let i=n.trim();return i?i.startsWith("[[")&&i.endsWith("]]")?i:`[[${i}]]`:""}function K(n){return n.split(",").map(i=>i.trim()).filter(Boolean).map(I)}function x(n){return Array.isArray(n)?String(n[0]||""):String(n||"")}function de(n,i){return i==="task"?n.tasksFolder:i==="client"?n.clientsFolder:i==="property"?n.propertiesFolder:i==="person"?n.peopleFolder:i==="project"?n.projectsFolder:i==="meeting"?n.meetingsFolder:n.dailyFolder}function pe(n,i,t){let e=String(i.remType||"").toLowerCase();return["task","client","property","person","project","meeting","daily"].includes(e)?e:R(n,t.tasksFolder)||R(n,t.doneFolder)?"task":R(n,t.clientsFolder)?"client":R(n,t.propertiesFolder)?"property":R(n,t.peopleFolder)?"person":R(n,t.projectsFolder)?"project":R(n,t.meetingsFolder)?"meeting":R(n,t.dailyFolder)?"daily":null}function ue(n,i,t){var s,r;let e=(r=(s=i.match(/^#\s+(.+)$/m))==null?void 0:s[1])==null?void 0:r.trim();return x(t.title||t.name||t.person||t.building)||e||n.basename}function he(n,i,t){let e=O(i),s=pe(n,e,t);if(!s)return null;if(s==="task"&&!e.remType){let r=Q(n.path,i);return{kind:s,file:n,title:r.title,status:r.status,priority:r.priority,due:r.due,scheduled:r.scheduled,date:r.dateCreated,client:r.client,property:r.building,people:r.waitingfor?[r.waitingfor]:[],projects:r.projects||[],tasks:[],legacy:!0,description:j(i),notes:r.logs||[],raw:i,body:j(i)}}return{kind:s,file:n,title:ue(n,i,e),status:x(e.status)||(s==="task"?"open":"active"),priority:x(e.priority)||"normal",due:x(e.due)||null,scheduled:x(e.scheduled)||null,date:x(e.date||e.created||e.dateCreated)||null,client:x(e.client)||null,property:x(e.property||e.building)||null,people:H(e.people||e.person),projects:H(e.projects||e.project),tasks:H(e.tasks||e.task),legacy:!e.remType,description:s==="task"?j(i):"",notes:me(i),raw:i,body:ge(i,s)}}function L(n,i){let e=new RegExp(`(^|\\n)##\\s+${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}[ \\t]*(?=\\n|$)`,"i").exec(n);if(!e)return"";let s=e.index+e[0].length,r=n.slice(s),a=r.search(/\n##\s+/),o=r.search(/\n---[ \t]*(?=\n|$)/),c=[a,o].filter(l=>l>=0),g=c.length?Math.min(...c):r.length;return r.slice(0,g).trim()}function j(n){let i=L(n,"Description");return i||n.replace(/^---\n[\s\S]*?\n---\n?/,"").split(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/)[0].replace(/^#\s+.+\n?/,"").replace(/^#{1,6}\s+Task descri(?:p)?tion\s*\n?/i,"").trim()}function ge(n,i){return i==="task"?j(n):n.replace(/^---\n[\s\S]*?\n---\n?/,"").replace(/^#\s+.+\n?/,"").split(/\n---[ \t]*(?=\n|$)/)[0].trim()}function me(n){let i=[],t=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2})(?:\]\])?[ \t]*(?=\n|$)/g,e=[...n.matchAll(t)].map(s=>({date:s[2],start:s.index+s[1].length,end:s.index+s[0].length}));return e.forEach((s,r)=>{var o,c;[...n.slice(s.end,(c=(o=e[r+1])==null?void 0:o.start)!=null?c:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(g=>{let l=g[1].trim();l&&i.push({date:s.date,text:l})})}),i.sort((s,r)=>s.date.localeCompare(r.date))}function fe(n=new Date){return n.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",hour12:!1})}function U(n,i){let t=w(),e=`Log: [${fe()}] ${i.trim()}`,s=`### [[${t}]]`,r=new RegExp(`(^|\\n)### (?:\\[\\[)?${t}(?:\\]\\])?[ \\t]*(?=\\n|$)`).exec(n);if(r){let c=r.index+r[0].length,l=n.slice(c).search(/\n### (?:\[\[)?\d{4}-\d{2}-\d{2}/),f=l===-1?n.length:c+l,$=n.slice(c,f).search(/\n---[ \t]*(?=\n|$)/);if($!==-1){let u=c+$;return`${n.slice(0,u).trimEnd()}
${e}

${n.slice(u).replace(/^\n+/,"")}`}return`${n.slice(0,f).trimEnd()}
${e}

---
${n.slice(f).replace(/^\n+/,"")}`}let a=`

${s}
${e}

---
`,o=/(^|\n)##\s+Notes[ \t]*(?=\n|$)/i.exec(n);if(o){let c=o.index+o[0].length;return`${n.slice(0,c).trimEnd()}${a}${n.slice(c).replace(/^\n+/,"")}`}return`${n.trimEnd()}

## Notes${a}`}function ye(n,i,t){let e=t.trim();if(!e)return n;let r=new RegExp(`(^|\\n)##\\s+${i.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}[ \\t]*(?=\\n|$)`,"i").exec(n),a=`- ${e}`;if(!r)return`${n.trimEnd()}

## ${i}

${a}
`;let o=r.index+r[0].length,g=n.slice(o).search(/\n##\s+/),l=g===-1?n.length:o+g;return`${n.slice(0,l).trimEnd()}
${a}
${n.slice(l)}`}function ke(n){return/^---\n[\s\S]*?\n---/.test(n)?n:`---
---

${n.trimStart()}`}function $e(n,i,t){let e=ke(n),s=e.match(/^---\n([\s\S]*?)\n---/);if(!s)return e;let r=s[1],a=`${i}: ${t}`,o=new RegExp(`^${i}:.*$`,"m");return`---
${o.test(r)?r.replace(o,a):`${r.trimEnd()}
${a}`}
---${e.slice(s[0].length)}`}function ve(n,i){return Object.entries(i).reduce((t,[e,s])=>$e(t,e,s),n)}function X(n){return String(n||"").replace(/^\[\[/,"").replace(/\]\]$/,"").split("|")[0].trim().toLowerCase()}function we(n){return new Set([n.title,n.file.basename,`[[${n.title}]]`,`[[${n.file.basename}]]`].map(X).filter(Boolean))}function De(n,i){return n.some(t=>i.has(X(t)))}function Ee(n,i){if(n.file.path===i.file.path)return!1;let t=we(i);return De([n.client,n.property,...n.people,...n.projects,...n.tasks],t)}function S(n){return n.length?`
${n.map(i=>`  - "${i.replace(/"/g,'\\"')}"`).join(`
`)}`:"[]"}function D(n){return`"${n.replace(/"/g,'\\"')}"`}function Re(n){let i=n.title.trim(),t=w(),e=I(n.client),s=I(n.property),r=K(n.people),a=K(n.projects),o=K(n.tasks),c=n.body.trim();if(n.kind==="task")return`---
remType: task
title: ${D(i)}
status: ${n.status||"open"}
priority: ${n.priority||"normal"}
due: ${n.due||""}
scheduled: ${n.scheduled||""}
created: ${t}
modified: ${t}
client: ${e?D(e):""}
property: ${s?D(s):""}
people: ${S(r)}
projects: ${S(a)}
tags:
  - ${C}
  - rem-task
---

# ${i}

## Description

${c||""}

---

## Notes

---
`;if(n.kind==="meeting")return`---
remType: meeting
title: ${D(i)}
date: ${t}
client: ${e?D(e):""}
property: ${s?D(s):""}
people: ${S(r)}
projects: ${S(a)}
tasks: ${S(o)}
tags:
  - ${C}
  - rem-meeting
---

# ${i}

## Notes

${c||""}

## Decisions

-

## Actions

-
`;let g=`rem-${n.kind}`,l=`client: ${e?D(e):""}
property: ${s?D(s):""}
people: ${S(r)}
projects: ${S(a)}
tasks: ${S(o)}`;return`---
remType: ${n.kind}
title: ${D(i)}
status: ${n.status||"active"}
created: ${t}
modified: ${t}
${l}
tags:
  - ${C}
  - ${g}
---

# ${i}

${c||""}

---

## Notes

---
`}function z(n){return`---
remType: daily
title: ${D(n)}
date: ${n}
workStatus: workday
tags:
  - ${C}
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
`}var N=class extends p.Plugin{constructor(){super(...arguments);this.settings={...W}}async onload(){await this.loadSettings(),this.registerView(b,t=>new A(t,this)),this.addRibbonIcon("building-2","Real Estate Management",()=>{this.activateView()}),this.addCommand({id:"open-real-estate-management",name:"Open Real Estate Management",callback:()=>this.activateView()}),this.addCommand({id:"create-real-estate-task",name:"Create real estate task",callback:()=>this.openCreateModal("task")}),this.addCommand({id:"open-todays-real-estate-log",name:"Open today's real estate daily log",callback:()=>this.openDailyLog()}),this.addSettingTab(new Y(this.app,this))}async activateView(){let t=this.app.workspace.getLeavesOfType(b);if(t.length){this.app.workspace.revealLeaf(t[0]);return}let e=this.app.workspace.getRightLeaf(!1);await(e==null?void 0:e.setViewState({type:b,active:!0})),e&&this.app.workspace.revealLeaf(e)}openCreateModal(t){new _(this.app,this,t).open()}async loadSettings(){this.settings=Object.assign({},W,await this.loadData())}async saveSettings(){await this.saveData(this.settings),this.refreshViews()}refreshViews(){this.app.workspace.getLeavesOfType(b).forEach(t=>{let e=t.view;e instanceof A&&e.render()})}async ensureFolder(t){let e=T(t);if(!e)return;let s=e.split("/"),r="";for(let a of s)r=r?`${r}/${a}`:a,this.app.vault.getAbstractFileByPath(r)||await this.app.vault.createFolder(r)}async uniquePath(t,e){let s=T(t),r=e.replace(/\.md$/i,""),a=`${s}/${r}.md`,o=2;for(;this.app.vault.getAbstractFileByPath(a);)a=`${s}/${r} ${o++}.md`;return a}async createRecord(t){let e=de(this.settings,t.kind);await this.ensureFolder(e);let s=await this.uniquePath(e,ce(t.kind==="project"?`Project - ${t.title}`:t.title)),r=await this.app.vault.create(s,Re(t));new p.Notice(`Created ${t.kind}: ${t.title}`),this.refreshViews(),await this.app.workspace.getLeaf(!1).openFile(r)}async addTaskNote(t,e){let s=e.trim();s&&(await this.app.vault.process(t,r=>U(r,s)),new p.Notice("Task note added"),this.refreshViews())}async addRecordNote(t,e){let s=e.trim();s&&(await this.app.vault.process(t,r=>U(r,s)),new p.Notice("Record note added"),this.refreshViews())}async updateTaskFields(t,e){await this.app.vault.process(t,s=>ve(s,{...e,modified:w(),dateModified:w()})),new p.Notice("Task updated"),this.refreshViews()}async closeTask(t){await this.updateTaskFields(t,{status:"done",completed:w(),completedDate:w()})}async postponeTask(t){let e={};t.due&&(e.due=V(t.due,7)),t.scheduled&&(e.scheduled=V(t.scheduled,7)),!t.due&&!t.scheduled&&(e.due=V(w(),7)),await this.updateTaskFields(t.file,e)}async openDailyLog(t=w()){await this.ensureFolder(this.settings.dailyFolder);let e=`${T(this.settings.dailyFolder)}/${t}.md`,s=this.app.vault.getAbstractFileByPath(e),r=s instanceof p.TFile?s:await this.app.vault.create(e,z(t));await this.app.workspace.getLeaf(!1).openFile(r),this.refreshViews()}async dailyLogFile(t=w()){await this.ensureFolder(this.settings.dailyFolder);let e=`${T(this.settings.dailyFolder)}/${t}.md`,s=this.app.vault.getAbstractFileByPath(e);return s instanceof p.TFile?s:await this.app.vault.create(e,z(t))}async appendDailyEntry(t,e){let s=await this.dailyLogFile();await this.app.vault.process(s,r=>ye(r,t,e)),new p.Notice(`Added to ${t}`),this.refreshViews()}async loadRecords(){let t=[];for(let e of this.app.vault.getMarkdownFiles())if(!le(e))try{let s=await this.app.vault.cachedRead(e),r=he(e,s,this.settings);r&&t.push(r)}catch(s){console.warn(`Real Estate Management skipped ${e.path}`,s)}return t.sort((e,s)=>e.title.localeCompare(s.title))}},A=class extends p.ItemView{constructor(t,e){super(t);this.selectedTaskPath="";this.selectedRecordPath="";this.noteDraft="";this.recordNoteDrafts={};this.dailyDrafts={};this.searchQuery="";this.plugin=e}getViewType(){return b}getDisplayText(){return"Real Estate Management"}getIcon(){return"building-2"}async onOpen(){await this.render()}async render(){let t=this.containerEl.children[1];t.empty(),t.addClass("rem-plugin-root");let e=await this.plugin.loadRecords(),s=this.filterRecords(e),r=h=>s.filter(M=>M.kind===h),a=r("task"),o=a.filter(h=>h.status!=="done"&&!R(h.file,this.plugin.settings.doneFolder)),c=o.filter(h=>h.due===w()||h.scheduled===w()),g=o.filter(h=>!!h.due&&h.due<w()),l=r("daily").find(h=>h.date===w()),f=a.find(h=>h.file.path===this.selectedTaskPath)||c[0]||o[0];f&&(this.selectedTaskPath=f.file.path);let k=s.find(h=>h.file.path===this.selectedRecordPath&&h.kind!=="task"),$=t.createDiv({cls:"rem-header rem-hero"}),u=$.createDiv();u.createEl("div",{text:"Real Estate Management",cls:"rem-kicker"}),u.createEl("h2",{text:"Mission control"}),u.createEl("p",{text:"Independent Obsidian records for tasks, clients, properties, people, projects, meetings, and daily logs.",cls:"rem-subtitle"});let E=u.createEl("input",{cls:"rem-search",attr:{placeholder:"Search tasks, clients, properties, people, projects, meetings...",type:"search"}});E.value=this.searchQuery,E.addEventListener("input",()=>{this.searchQuery=E.value,this.render()});let v=$.createDiv({cls:"rem-actions rem-action-grid"});this.action(v,"+ Task",()=>this.plugin.openCreateModal("task")),this.action(v,"+ Client",()=>this.plugin.openCreateModal("client")),this.action(v,"+ Property",()=>this.plugin.openCreateModal("property")),this.action(v,"+ Person",()=>this.plugin.openCreateModal("person")),this.action(v,"+ Project",()=>this.plugin.openCreateModal("project")),this.action(v,"+ Meeting",()=>this.plugin.openCreateModal("meeting")),this.action(v,l?"Open Daily Log":"Create Daily Log",()=>this.plugin.openDailyLog()),this.action(v,"Refresh",()=>this.render());let d=t.createDiv({cls:"rem-stats"});this.stat(d,"Open tasks",String(o.length)),this.stat(d,"Today",String(c.length)),this.stat(d,"Overdue",String(g.length)),this.stat(d,"Clients",String(r("client").length)),this.stat(d,"Properties",String(r("property").length)),this.stat(d,"People",String(r("person").length)),this.stat(d,"Projects",String(r("project").length)),this.stat(d,"Meetings",String(r("meeting").length)),this.searchQuery.trim()&&this.stat(d,"Search results",String(s.length)),f&&this.taskDetail(t,f),this.dailyPanel(t,l),k&&this.recordDetail(t,k,s);let y=t.createDiv({cls:"rem-dashboard-grid"});this.taskSection(y,"Today",c,"No tasks due or scheduled today."),this.taskSection(y,"Overdue",g,"No overdue tasks."),this.recordSection(y,"Recent meetings",r("meeting").slice(-8).reverse(),"No meetings yet."),this.recordSection(y,"Properties",r("property").slice(0,12),"No properties yet."),this.recordSection(y,"People",r("person").slice(0,12),"No people yet."),this.recordSection(y,"Projects",r("project").slice(0,12),"No projects yet.")}action(t,e,s){t.createEl("button",{text:e}).addEventListener("click",s)}filterRecords(t){let e=this.searchQuery.trim().toLowerCase();return e?t.filter(s=>[s.kind,s.title,s.file.basename,s.status,s.priority,s.due,s.scheduled,s.date,s.client,s.property,...s.people,...s.projects,...s.tasks,s.body].filter(Boolean).some(r=>String(r).toLowerCase().includes(e))):t}stat(t,e,s){let r=t.createDiv({cls:"rem-stat"});r.createDiv({text:e,cls:"rem-stat-label"}),r.createDiv({text:s,cls:"rem-stat-value"})}taskSection(t,e,s,r){let a=t.createDiv({cls:"rem-section"});if(a.createEl("h3",{text:e}),!s.length){a.createDiv({text:r,cls:"rem-empty"});return}let o=a.createDiv({cls:"rem-task-list"});for(let c of s.slice(0,12))this.recordRow(o,c)}recordSection(t,e,s,r){let a=t.createDiv({cls:"rem-section"});if(a.createEl("h3",{text:e}),!s.length){a.createDiv({text:r,cls:"rem-empty"});return}let o=a.createDiv({cls:"rem-task-list"});for(let c of s)this.recordRow(o,c)}recordRow(t,e){let s=t.createDiv({cls:"rem-task-row"});e.kind==="task"?(e.file.path===this.selectedTaskPath&&s.addClass("is-selected"),s.addEventListener("click",()=>{this.selectedTaskPath=e.file.path,this.selectedRecordPath="",this.noteDraft="",this.render()})):(e.file.path===this.selectedRecordPath&&s.addClass("is-selected"),s.addEventListener("click",()=>{this.selectedRecordPath=e.file.path,this.render()})),s.createDiv({text:e.title,cls:"rem-task-title"});let r=s.createDiv({cls:"rem-task-meta"});r.createSpan({text:e.kind}),e.legacy&&r.createSpan({text:"legacy"}),e.priority&&e.kind==="task"&&r.createSpan({text:e.priority}),e.status&&r.createSpan({text:e.status}),e.due&&r.createSpan({text:`due ${e.due}`}),e.scheduled&&r.createSpan({text:`scheduled ${e.scheduled}`}),e.client&&r.createSpan({text:e.client}),e.property&&r.createSpan({text:e.property})}taskDetail(t,e){let s=t.createDiv({cls:"rem-task-detail"}),r=s.createDiv({cls:"rem-task-detail-header"}),a=r.createDiv();a.createEl("div",{text:e.legacy?"Legacy TaskNotes task":"Native real estate task",cls:"rem-kicker"}),a.createEl("h3",{text:e.title});let o=a.createDiv({cls:"rem-task-meta"});o.createSpan({text:e.status||"open"}),o.createSpan({text:e.priority||"normal"}),e.due&&o.createSpan({text:`due ${e.due}`}),e.scheduled&&o.createSpan({text:`scheduled ${e.scheduled}`}),e.client&&o.createSpan({text:e.client}),e.property&&o.createSpan({text:e.property});let c=s.createDiv({cls:"rem-task-controls"});this.dateControl(c,"Due",e.due||"",d=>this.updateSelectedTask(e,{due:d})),this.dateControl(c,"Scheduled",e.scheduled||"",d=>this.updateSelectedTask(e,{scheduled:d})),c.createEl("button",{text:"Postpone 1w"}).addEventListener("click",()=>this.plugin.postponeTask(e)),c.createEl("button",{text:"Close task"}).addEventListener("click",()=>this.plugin.closeTask(e.file)),r.createEl("button",{text:"Open file"}).addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file));let l=s.createDiv({cls:"rem-task-detail-grid"}),f=l.createDiv({cls:"rem-panel"});f.createEl("h4",{text:"Description"}),f.createDiv({text:e.description||"No description yet.",cls:e.description?"rem-description":"rem-empty"});let k=l.createDiv({cls:"rem-panel"});k.createEl("h4",{text:"Notes"});let $=k.createDiv({cls:"rem-note-editor"}),u=$.createEl("textarea",{text:this.noteDraft,attr:{placeholder:"Add a task note... Enter to save, Shift+Enter for a new line"}});if(u.value=this.noteDraft,u.addEventListener("input",()=>{this.noteDraft=u.value}),u.addEventListener("keydown",async d=>{d.key==="Enter"&&!d.shiftKey&&(d.preventDefault(),await this.saveTaskNote(e))}),$.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveTaskNote(e)),!e.notes.length){k.createDiv({text:"No notes yet.",cls:"rem-empty"});return}let v=k.createDiv({cls:"rem-note-list"});for(let d of e.notes.slice().reverse().slice(0,12)){let y=v.createDiv({cls:"rem-note-card"});y.createDiv({text:d.date,cls:"rem-note-date"}),y.createDiv({text:d.text,cls:"rem-note-text"})}}dailyPanel(t,e){let s=t.createDiv({cls:"rem-daily-panel"}),r=s.createDiv({cls:"rem-daily-header"}),a=r.createDiv();a.createEl("div",{text:w(),cls:"rem-kicker"}),a.createEl("h3",{text:"Daily log"}),r.createEl("button",{text:e?"Open daily log":"Create daily log"}).addEventListener("click",()=>this.plugin.openDailyLog());let c=[["Mission",L((e==null?void 0:e.raw)||"","Mission")],["Notes",L((e==null?void 0:e.raw)||"","Notes")],["Reflections",L((e==null?void 0:e.raw)||"","Reflections")],["Brain dump",L((e==null?void 0:e.raw)||"","Brain dump")]],g=s.createDiv({cls:"rem-daily-grid"});for(let[l,f]of c){let k=g.createDiv({cls:"rem-panel"});k.createEl("h4",{text:l}),k.createDiv({text:f||"Nothing written yet.",cls:f?"rem-description rem-daily-body":"rem-empty"});let $=k.createDiv({cls:"rem-daily-editor"}),u=$.createEl("textarea",{attr:{placeholder:`Add ${l.toLowerCase()}...`}});u.value=this.dailyDrafts[l]||"",u.addEventListener("input",()=>{this.dailyDrafts[l]=u.value}),u.addEventListener("keydown",async E=>{E.key==="Enter"&&!E.shiftKey&&(E.preventDefault(),await this.saveDailyEntry(l))}),$.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveDailyEntry(l))}}async saveDailyEntry(t){let e=(this.dailyDrafts[t]||"").trim();e&&(await this.plugin.appendDailyEntry(t,e),this.dailyDrafts[t]="",await this.render())}async saveTaskNote(t){let e=this.noteDraft.trim();e&&(await this.plugin.addTaskNote(t.file,e),this.noteDraft="",await this.render())}recordDetail(t,e,s){let r=s.filter(m=>Ee(m,e)),a=r.filter(m=>m.kind==="task"),o=r.filter(m=>m.kind==="meeting"),c=r.filter(m=>m.kind==="project"),g=r.filter(m=>m.kind==="person"),l=r.filter(m=>m.kind==="property"),f=t.createDiv({cls:"rem-record-detail"}),k=f.createDiv({cls:"rem-task-detail-header"}),$=k.createDiv();$.createEl("div",{text:e.kind,cls:"rem-kicker"}),$.createEl("h3",{text:e.title});let u=$.createDiv({cls:"rem-task-meta"});e.status&&u.createSpan({text:e.status}),e.client&&u.createSpan({text:e.client}),e.property&&u.createSpan({text:e.property}),e.date&&u.createSpan({text:e.date}),k.createEl("button",{text:"Open file"}).addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file));let v=f.createDiv({cls:"rem-record-detail-grid"}),d=v.createDiv({cls:"rem-panel"});d.createEl("h4",{text:"Record"}),d.createDiv({text:e.body||"No body yet.",cls:e.body?"rem-description":"rem-empty"});let y=v.createDiv({cls:"rem-panel"});y.createEl("h4",{text:"Linked work"}),this.relatedGroup(y,"Tasks",a),this.relatedGroup(y,"Meetings",o),this.relatedGroup(y,"Projects",c),this.relatedGroup(y,"People",g),this.relatedGroup(y,"Properties",l),r.length||y.createDiv({text:"No linked records found yet.",cls:"rem-empty"});let h=v.createDiv({cls:"rem-panel rem-record-notes-panel"});h.createEl("h4",{text:"Notes"});let M=h.createDiv({cls:"rem-note-editor"}),P=M.createEl("textarea",{attr:{placeholder:`Add a ${e.kind} note... Enter to save, Shift+Enter for a new line`}});if(P.value=this.recordNoteDrafts[e.file.path]||"",P.addEventListener("input",()=>{this.recordNoteDrafts[e.file.path]=P.value}),P.addEventListener("keydown",async m=>{m.key==="Enter"&&!m.shiftKey&&(m.preventDefault(),await this.saveRecordNote(e))}),M.createEl("button",{text:"Add"}).addEventListener("click",()=>this.saveRecordNote(e)),!e.notes.length){h.createDiv({text:"No notes yet.",cls:"rem-empty"});return}let J=h.createDiv({cls:"rem-note-list"});for(let m of e.notes.slice().reverse().slice(0,12)){let G=J.createDiv({cls:"rem-note-card"});G.createDiv({text:m.date,cls:"rem-note-date"}),G.createDiv({text:m.text,cls:"rem-note-text"})}}relatedGroup(t,e,s){if(!s.length)return;let r=t.createDiv({cls:"rem-related-group"});r.createEl("h5",{text:`${e} (${s.length})`});let a=r.createDiv({cls:"rem-related-list"});for(let o of s.slice(0,8)){let c=a.createDiv({cls:"rem-related-row"});c.createSpan({text:o.title}),c.addEventListener("click",()=>{o.kind==="task"?(this.selectedTaskPath=o.file.path,this.selectedRecordPath=""):this.selectedRecordPath=o.file.path,this.render()})}}async saveRecordNote(t){let e=(this.recordNoteDrafts[t.file.path]||"").trim();e&&(await this.plugin.addRecordNote(t.file,e),this.recordNoteDrafts[t.file.path]="",await this.render())}dateControl(t,e,s,r){let a=t.createEl("label",{cls:"rem-date-control"});a.createSpan({text:e});let o=a.createEl("input",{type:"date"});o.value=s,o.addEventListener("change",()=>r(o.value))}async updateSelectedTask(t,e){await this.plugin.updateTaskFields(t.file,e),await this.render()}},_=class extends p.Modal{constructor(i,t,e){super(i),this.plugin=t,this.draft={kind:e,title:"",status:e==="task"?"open":"active",priority:"normal",due:"",scheduled:"",client:"",property:"",people:"",projects:"",tasks:"",body:""}}onOpen(){let{contentEl:i}=this;i.empty(),i.addClass("rem-modal"),i.createEl("h2",{text:`New ${this.draft.kind}`}),this.text("Title","Required","title"),this.draft.kind==="task"&&(this.text("Priority","normal, high, low","priority"),this.text("Due","YYYY-MM-DD","due"),this.text("Scheduled","YYYY-MM-DD","scheduled")),this.draft.kind!=="client"&&this.text("Client","Client note name","client"),["client","property"].includes(this.draft.kind)||this.text("Property","Property note name","property"),this.text("People","Comma-separated names","people"),this.draft.kind!=="project"&&this.text("Projects","Comma-separated project names","projects"),this.draft.kind==="meeting"&&this.text("Tasks","Comma-separated task names","tasks"),new p.Setting(i).setName(this.draft.kind==="task"?"Description":"Notes").addTextArea(t=>t.setPlaceholder("Write the starting body...").onChange(e=>{this.draft.body=e})),new p.Setting(i).addButton(t=>t.setButtonText("Create").setCta().onClick(async()=>{if(!this.draft.title.trim()){new p.Notice("Title is required.");return}await this.plugin.createRecord(this.draft),this.close()}))}text(i,t,e){new p.Setting(this.contentEl).setName(i).setDesc(t).addText(s=>s.setValue(String(this.draft[e]||"")).onChange(r=>{this.draft[e]=r}))}},Y=class extends p.PluginSettingTab{constructor(i,t){super(i,t),this.plugin=t}display(){let{containerEl:i}=this;i.empty(),i.createEl("h2",{text:"Real Estate Management settings"}),i.createEl("p",{text:"Set vault-relative folders for independent Real Estate Management records. Existing TaskNotes-style task files can still be read as legacy records."}),this.folderSetting("Tasks folder","Native task records.","tasksFolder"),this.folderSetting("Done folder","Optional completed task records.","doneFolder"),this.folderSetting("Clients folder","Client or organisation records.","clientsFolder"),this.folderSetting("Properties folder","Property records.","propertiesFolder"),this.folderSetting("People folder","People and contact records.","peopleFolder"),this.folderSetting("Projects folder","Project records.","projectsFolder"),this.folderSetting("Meetings folder","Meeting records.","meetingsFolder"),this.folderSetting("Daily logs folder","Daily logs and dashboard notes.","dailyFolder")}folderSetting(i,t,e){new p.Setting(this.containerEl).setName(i).setDesc(t).addText(s=>s.setPlaceholder(W[e]).setValue(this.plugin.settings[e]).onChange(async r=>{this.plugin.settings[e]=T(r),await this.plugin.saveSettings()}))}};
