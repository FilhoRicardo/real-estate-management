/* Real Estate Management Obsidian plugin */
"use strict";var D=Object.defineProperty;var O=Object.getOwnPropertyDescriptor;var W=Object.getOwnPropertyNames;var V=Object.prototype.hasOwnProperty;var I=(n,r)=>{for(var e in r)D(n,e,{get:r[e],enumerable:!0})},K=(n,r,e,t)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of W(r))!V.call(n,s)&&s!==e&&D(n,s,{get:()=>r[s],enumerable:!(t=O(r,s))||t.enumerable});return n};var _=n=>K(D({},"__esModule",{value:!0}),n);var te={};I(te,{default:()=>M});module.exports=_(te);var l=require("obsidian");function T(n){let r=n.match(/^---\n([\s\S]*?)\n---/);if(!r)return{};let e={},t=null;for(let s of r[1].split(`
`))if(/^  - /.test(s)){let i=s.replace(/^  - /,"").trim().replace(/^["']|["']$/g,"");t&&Array.isArray(e[t])&&e[t].push(i)}else{let i=s.match(/^(\w+):\s*(.*)/);if(!i)continue;t=i[1];let a=i[2].trim();a?a[0]==="["?e[t]=a.slice(1,-1).split(",").map(o=>o.trim().replace(/^["']|["']$/g,"")):e[t]=a.replace(/^["']|["']$/g,""):e[t]=[]}return e}var R=n=>n?n.replace(/^\[\[|\]\]$/g,""):null,Y=n=>n.replace(/\\/g,"/").split("/").pop(),L=n=>Y(n).replace(/\.md$/i,"");var H=n=>{if(n.match(/^(\d{4})-(\d{2})-(\d{2})$/))return n;let e=n.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);if(!e)return null;let[,t,s,i]=e;return`${i}-${String(Number(s)).padStart(2,"0")}-${String(Number(t)).padStart(2,"0")}`};function q(n){let r=[],e=/(^|\n)### (?:\[\[)?(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})(?:\]\])?[ \t]*(?=\n|$)/g,t=[...n.matchAll(e)].map(s=>({date:H(s[2]),start:s.index+s[1].length,end:s.index+s[0].length})).filter(s=>s.date);return t.forEach((s,i)=>{var o,g;[...n.slice(s.end,(g=(o=t[i+1])==null?void 0:o.start)!=null?g:n.length).matchAll(/^Log:\s*([\s\S]*?)(?=\nLog:\s|\n---[ \t]*(?=\n|$)|$)/gm)].forEach(k=>{let u=k[1].trim();u&&r.push({date:s.date,text:u,order:r.length})})}),r.sort((s,i)=>s.date.localeCompare(i.date)||s.order-i.order),r.forEach(s=>{delete s.order}),r}function N(n,r){let e=T(r),t=e.title||L(n),s=[...r.matchAll(/- \[([ x])\] (.+)/g)].map(o=>({done:o[1]==="x",text:o[2]})),i=q(r),a=Array.isArray(e.tags)?e.tags:e.tags?[e.tags]:[];return{id:n,title:t,filename:L(n),priority:e.priority||"normal",status:e.status||"none",due:e.due||null,scheduled:e.scheduled||null,dateCreated:e.dateCreated||null,dateModified:e.dateModified||null,contexts:Array.isArray(e.contexts)?e.contexts:e.contexts?[e.contexts]:[],client:R(e.client),building:R(e.building),projects:Array.isArray(e.projects)?e.projects.map(R):e.projects?[R(e.projects)]:[],waitingfor:R(e.waitingfor),tags:a,archived:a.includes("archived"),recurrent:e.recurrent==="true"||e.Recurrent==="true"||a.includes("recurrent")||a.includes("recurring"),recurrence:e.recurrence||null,completeInstances:Array.isArray(e.complete_instances)?e.complete_instances:[],skippedInstances:Array.isArray(e.skipped_instances)?e.skipped_instances:[],completedDate:e.completedDate||null,checklist:s,checklistDone:s.filter(o=>o.done).length,checklistTotal:s.length,logs:i,raw:r}}var F="real-estate-management-view",v="real-estate-management",C={tasksFolder:"Real Estate Management/Tasks",clientsFolder:"Real Estate Management/Clients",propertiesFolder:"Real Estate Management/Properties",peopleFolder:"Real Estate Management/People",projectsFolder:"Real Estate Management/Projects",meetingsFolder:"Real Estate Management/Meetings",dailyFolder:"Real Estate Management/Daily Logs",doneFolder:"Real Estate Management/Done"};function w(){let n=new Date,r=e=>String(e).padStart(2,"0");return`${n.getFullYear()}-${r(n.getMonth()+1)}-${r(n.getDate())}`}function S(n){return n.replace(/\\/g,"/").replace(/^\/+|\/+$/g,"")}function G(n){return n.trim().replace(/[<>:"/\\|?*\x00-\x1F]/g,"-").replace(/\s+/g," ").replace(/[. ]+$/g,"").slice(0,180)||"Untitled"}function U(n){let r=n.basename.trim().toLowerCase();return r==="index"||r.startsWith("_")||n.name==="timetracker.md"}function p(n,r){let e=S(r);return e.length>0&&n.path.startsWith(`${e}/`)}function j(n){return Array.isArray(n)?n.map(String).filter(Boolean):n?[String(n)].filter(Boolean):[]}function b(n){let r=n.trim();return r?r.startsWith("[[")&&r.endsWith("]]")?r:`[[${r}]]`:""}function x(n){return n.split(",").map(r=>r.trim()).filter(Boolean).map(b)}function y(n){return Array.isArray(n)?String(n[0]||""):String(n||"")}function z(n,r){return r==="task"?n.tasksFolder:r==="client"?n.clientsFolder:r==="property"?n.propertiesFolder:r==="person"?n.peopleFolder:r==="project"?n.projectsFolder:r==="meeting"?n.meetingsFolder:n.dailyFolder}function X(n,r,e){let t=String(r.remType||"").toLowerCase();return["task","client","property","person","project","meeting","daily"].includes(t)?t:p(n,e.tasksFolder)||p(n,e.doneFolder)?"task":p(n,e.clientsFolder)?"client":p(n,e.propertiesFolder)?"property":p(n,e.peopleFolder)?"person":p(n,e.projectsFolder)?"project":p(n,e.meetingsFolder)?"meeting":p(n,e.dailyFolder)?"daily":null}function J(n,r,e){var s,i;let t=(i=(s=r.match(/^#\s+(.+)$/m))==null?void 0:s[1])==null?void 0:i.trim();return y(e.title||e.name||e.person||e.building)||t||n.basename}function Q(n,r,e){let t=T(r),s=X(n,t,e);if(!s)return null;if(s==="task"&&!t.remType){let i=N(n.path,r);return{kind:s,file:n,title:i.title,status:i.status,priority:i.priority,due:i.due,scheduled:i.scheduled,date:i.dateCreated,client:i.client,property:i.building,people:i.waitingfor?[i.waitingfor]:[],projects:i.projects||[],tasks:[],legacy:!0}}return{kind:s,file:n,title:J(n,r,t),status:y(t.status)||(s==="task"?"open":"active"),priority:y(t.priority)||"normal",due:y(t.due)||null,scheduled:y(t.scheduled)||null,date:y(t.date||t.created||t.dateCreated)||null,client:y(t.client)||null,property:y(t.property||t.building)||null,people:j(t.people||t.person),projects:j(t.projects||t.project),tasks:j(t.tasks||t.task),legacy:!t.remType}}function f(n){return n.length?`
${n.map(r=>`  - "${r.replace(/"/g,'\\"')}"`).join(`
`)}`:"[]"}function d(n){return`"${n.replace(/"/g,'\\"')}"`}function Z(n){let r=n.title.trim(),e=w(),t=b(n.client),s=b(n.property),i=x(n.people),a=x(n.projects),o=x(n.tasks),g=n.body.trim();if(n.kind==="task")return`---
remType: task
title: ${d(r)}
status: ${n.status||"open"}
priority: ${n.priority||"normal"}
due: ${n.due||""}
scheduled: ${n.scheduled||""}
created: ${e}
modified: ${e}
client: ${t?d(t):""}
property: ${s?d(s):""}
people: ${f(i)}
projects: ${f(a)}
tags:
  - ${v}
  - rem-task
---

# ${r}

## Description

${g||""}

---

## Notes

---
`;if(n.kind==="meeting")return`---
remType: meeting
title: ${d(r)}
date: ${e}
client: ${t?d(t):""}
property: ${s?d(s):""}
people: ${f(i)}
projects: ${f(a)}
tasks: ${f(o)}
tags:
  - ${v}
  - rem-meeting
---

# ${r}

## Notes

${g||""}

## Decisions

-

## Actions

-
`;let k=`rem-${n.kind}`,u=`client: ${t?d(t):""}
property: ${s?d(s):""}
people: ${f(i)}
projects: ${f(a)}
tasks: ${f(o)}`;return`---
remType: ${n.kind}
title: ${d(r)}
status: ${n.status||"active"}
created: ${e}
modified: ${e}
${u}
tags:
  - ${v}
  - ${k}
---

# ${r}

${g||""}

---

## Notes

---
`}function ee(n){return`---
remType: daily
title: ${d(n)}
date: ${n}
workStatus: workday
tags:
  - ${v}
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
`}var M=class extends l.Plugin{constructor(){super(...arguments);this.settings={...C}}async onload(){await this.loadSettings(),this.registerView(F,e=>new E(e,this)),this.addRibbonIcon("building-2","Real Estate Management",()=>{this.activateView()}),this.addCommand({id:"open-real-estate-management",name:"Open Real Estate Management",callback:()=>this.activateView()}),this.addCommand({id:"create-real-estate-task",name:"Create real estate task",callback:()=>this.openCreateModal("task")}),this.addCommand({id:"open-todays-real-estate-log",name:"Open today's real estate daily log",callback:()=>this.openDailyLog()}),this.addSettingTab(new A(this.app,this))}async activateView(){let e=this.app.workspace.getLeavesOfType(F);if(e.length){this.app.workspace.revealLeaf(e[0]);return}let t=this.app.workspace.getRightLeaf(!1);await(t==null?void 0:t.setViewState({type:F,active:!0})),t&&this.app.workspace.revealLeaf(t)}openCreateModal(e){new P(this.app,this,e).open()}async loadSettings(){this.settings=Object.assign({},C,await this.loadData())}async saveSettings(){await this.saveData(this.settings),this.refreshViews()}refreshViews(){this.app.workspace.getLeavesOfType(F).forEach(e=>{let t=e.view;t instanceof E&&t.render()})}async ensureFolder(e){let t=S(e);if(!t)return;let s=t.split("/"),i="";for(let a of s)i=i?`${i}/${a}`:a,this.app.vault.getAbstractFileByPath(i)||await this.app.vault.createFolder(i)}async uniquePath(e,t){let s=S(e),i=t.replace(/\.md$/i,""),a=`${s}/${i}.md`,o=2;for(;this.app.vault.getAbstractFileByPath(a);)a=`${s}/${i} ${o++}.md`;return a}async createRecord(e){let t=z(this.settings,e.kind);await this.ensureFolder(t);let s=await this.uniquePath(t,G(e.kind==="project"?`Project - ${e.title}`:e.title)),i=await this.app.vault.create(s,Z(e));new l.Notice(`Created ${e.kind}: ${e.title}`),this.refreshViews(),await this.app.workspace.getLeaf(!1).openFile(i)}async openDailyLog(e=w()){await this.ensureFolder(this.settings.dailyFolder);let t=`${S(this.settings.dailyFolder)}/${e}.md`,s=this.app.vault.getAbstractFileByPath(t),i=s instanceof l.TFile?s:await this.app.vault.create(t,ee(e));await this.app.workspace.getLeaf(!1).openFile(i),this.refreshViews()}async loadRecords(){let e=[];for(let t of this.app.vault.getMarkdownFiles())if(!U(t))try{let s=await this.app.vault.cachedRead(t),i=Q(t,s,this.settings);i&&e.push(i)}catch(s){console.warn(`Real Estate Management skipped ${t.path}`,s)}return e.sort((t,s)=>t.title.localeCompare(s.title))}},E=class extends l.ItemView{constructor(r,e){super(r),this.plugin=e}getViewType(){return F}getDisplayText(){return"Real Estate Management"}getIcon(){return"building-2"}async onOpen(){await this.render()}async render(){let r=this.containerEl.children[1];r.empty(),r.addClass("rem-plugin-root");let e=await this.plugin.loadRecords(),t=c=>e.filter(B=>B.kind===c),i=t("task").filter(c=>c.status!=="done"&&!p(c.file,this.plugin.settings.doneFolder)),a=i.filter(c=>c.due===w()||c.scheduled===w()),o=i.filter(c=>!!c.due&&c.due<w()),g=t("daily").find(c=>c.date===w()),k=r.createDiv({cls:"rem-header rem-hero"}),u=k.createDiv();u.createEl("div",{text:"Real Estate Management",cls:"rem-kicker"}),u.createEl("h2",{text:"Mission control"}),u.createEl("p",{text:"Independent Obsidian records for tasks, clients, properties, people, projects, meetings, and daily logs.",cls:"rem-subtitle"});let m=k.createDiv({cls:"rem-actions rem-action-grid"});this.action(m,"+ Task",()=>this.plugin.openCreateModal("task")),this.action(m,"+ Client",()=>this.plugin.openCreateModal("client")),this.action(m,"+ Property",()=>this.plugin.openCreateModal("property")),this.action(m,"+ Person",()=>this.plugin.openCreateModal("person")),this.action(m,"+ Project",()=>this.plugin.openCreateModal("project")),this.action(m,"+ Meeting",()=>this.plugin.openCreateModal("meeting")),this.action(m,g?"Open Daily Log":"Create Daily Log",()=>this.plugin.openDailyLog()),this.action(m,"Refresh",()=>this.render());let h=r.createDiv({cls:"rem-stats"});this.stat(h,"Open tasks",String(i.length)),this.stat(h,"Today",String(a.length)),this.stat(h,"Overdue",String(o.length)),this.stat(h,"Clients",String(t("client").length)),this.stat(h,"Properties",String(t("property").length)),this.stat(h,"People",String(t("person").length)),this.stat(h,"Projects",String(t("project").length)),this.stat(h,"Meetings",String(t("meeting").length));let $=r.createDiv({cls:"rem-dashboard-grid"});this.taskSection($,"Today",a,"No tasks due or scheduled today."),this.taskSection($,"Overdue",o,"No overdue tasks."),this.recordSection($,"Recent meetings",t("meeting").slice(-8).reverse(),"No meetings yet."),this.recordSection($,"Properties",t("property").slice(0,12),"No properties yet."),this.recordSection($,"People",t("person").slice(0,12),"No people yet."),this.recordSection($,"Projects",t("project").slice(0,12),"No projects yet.")}action(r,e,t){r.createEl("button",{text:e}).addEventListener("click",t)}stat(r,e,t){let s=r.createDiv({cls:"rem-stat"});s.createDiv({text:e,cls:"rem-stat-label"}),s.createDiv({text:t,cls:"rem-stat-value"})}taskSection(r,e,t,s){let i=r.createDiv({cls:"rem-section"});if(i.createEl("h3",{text:e}),!t.length){i.createDiv({text:s,cls:"rem-empty"});return}let a=i.createDiv({cls:"rem-task-list"});for(let o of t.slice(0,12))this.recordRow(a,o)}recordSection(r,e,t,s){let i=r.createDiv({cls:"rem-section"});if(i.createEl("h3",{text:e}),!t.length){i.createDiv({text:s,cls:"rem-empty"});return}let a=i.createDiv({cls:"rem-task-list"});for(let o of t)this.recordRow(a,o)}recordRow(r,e){let t=r.createDiv({cls:"rem-task-row"});t.addEventListener("click",()=>this.app.workspace.getLeaf(!1).openFile(e.file)),t.createDiv({text:e.title,cls:"rem-task-title"});let s=t.createDiv({cls:"rem-task-meta"});s.createSpan({text:e.kind}),e.legacy&&s.createSpan({text:"legacy"}),e.priority&&e.kind==="task"&&s.createSpan({text:e.priority}),e.status&&s.createSpan({text:e.status}),e.due&&s.createSpan({text:`due ${e.due}`}),e.scheduled&&s.createSpan({text:`scheduled ${e.scheduled}`}),e.client&&s.createSpan({text:e.client}),e.property&&s.createSpan({text:e.property})}},P=class extends l.Modal{constructor(r,e,t){super(r),this.plugin=e,this.draft={kind:t,title:"",status:t==="task"?"open":"active",priority:"normal",due:"",scheduled:"",client:"",property:"",people:"",projects:"",tasks:"",body:""}}onOpen(){let{contentEl:r}=this;r.empty(),r.addClass("rem-modal"),r.createEl("h2",{text:`New ${this.draft.kind}`}),this.text("Title","Required","title"),this.draft.kind==="task"&&(this.text("Priority","normal, high, low","priority"),this.text("Due","YYYY-MM-DD","due"),this.text("Scheduled","YYYY-MM-DD","scheduled")),this.draft.kind!=="client"&&this.text("Client","Client note name","client"),["client","property"].includes(this.draft.kind)||this.text("Property","Property note name","property"),this.text("People","Comma-separated names","people"),this.draft.kind!=="project"&&this.text("Projects","Comma-separated project names","projects"),this.draft.kind==="meeting"&&this.text("Tasks","Comma-separated task names","tasks"),new l.Setting(r).setName(this.draft.kind==="task"?"Description":"Notes").addTextArea(e=>e.setPlaceholder("Write the starting body...").onChange(t=>{this.draft.body=t})),new l.Setting(r).addButton(e=>e.setButtonText("Create").setCta().onClick(async()=>{if(!this.draft.title.trim()){new l.Notice("Title is required.");return}await this.plugin.createRecord(this.draft),this.close()}))}text(r,e,t){new l.Setting(this.contentEl).setName(r).setDesc(e).addText(s=>s.setValue(String(this.draft[t]||"")).onChange(i=>{this.draft[t]=i}))}},A=class extends l.PluginSettingTab{constructor(r,e){super(r,e),this.plugin=e}display(){let{containerEl:r}=this;r.empty(),r.createEl("h2",{text:"Real Estate Management settings"}),r.createEl("p",{text:"Set vault-relative folders for independent Real Estate Management records. Existing TaskNotes-style task files can still be read as legacy records."}),this.folderSetting("Tasks folder","Native task records.","tasksFolder"),this.folderSetting("Done folder","Optional completed task records.","doneFolder"),this.folderSetting("Clients folder","Client or organisation records.","clientsFolder"),this.folderSetting("Properties folder","Property records.","propertiesFolder"),this.folderSetting("People folder","People and contact records.","peopleFolder"),this.folderSetting("Projects folder","Project records.","projectsFolder"),this.folderSetting("Meetings folder","Meeting records.","meetingsFolder"),this.folderSetting("Daily logs folder","Daily logs and dashboard notes.","dailyFolder")}folderSetting(r,e,t){new l.Setting(this.containerEl).setName(r).setDesc(e).addText(s=>s.setPlaceholder(C[t]).setValue(this.plugin.settings[t]).onChange(async i=>{this.plugin.settings[t]=S(i),await this.plugin.saveSettings()}))}};
