import {test,expect} from '@playwright/test';
import {course} from '../../content/course.mjs';
test.beforeEach(async({request})=>{await request.post('http://127.0.0.1:4179/__test/reset');});
async function onboard(page){await page.goto('./');await page.getByLabel('Your name (optional)',{exact:true}).fill('CI learner');await page.getByText('New to Spanish, or following a class?',{exact:true}).click();await page.getByLabel('Class position (optional)',{exact:true}).selectOption('9b');await page.getByRole('button',{name:'Begin with a lesson →',exact:true}).click();await expect(page.getByRole('button',{name:'Try a sentence →',exact:true})).toBeVisible();await page.getByText('Options',{exact:true}).click();await page.getByRole('button',{name:'Finish early',exact:true}).click();await expect(page.getByRole('heading',{name:'A good place to pause.',exact:true})).toBeVisible();}
async function openMenu(page){const menu=page.getByRole('navigation',{name:'Main navigation',exact:true});if(!await menu.isVisible())await page.getByRole('button',{name:'Menu',exact:true}).click();await expect(menu).toBeVisible();}
async function go(page,name){await openMenu(page);await page.getByRole('navigation',{name:'Main navigation',exact:true}).getByRole('link',{name,exact:true}).click();await expect(page.locator('#app-navigation')).toBeHidden();}
async function startWords(page){await go(page,'Words');await page.getByRole('button',{name:'Scheduled word review',exact:true}).click();}

test('9B scope, typed draft, scheduled commit and resumed cursor',async({page})=>{await onboard(page);await go(page,'Words');await expect(page.getByText('1–25 of 940 · 940 selected cards',{exact:true})).toBeVisible();await go(page,'Today');await startWords(page);const input=page.getByLabel('Your attempt (optional for self-graded vocabulary)',{exact:true});await input.fill('camión');await page.reload();await expect(input).toHaveValue('camión');await page.getByRole('button',{name:'Show answer →',exact:true}).click();await page.getByRole('button',{name:'I remembered',exact:true}).click();await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');await page.reload();await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');});
test('unsafe v1 import is atomic and cannot create markup',async({page})=>{await onboard(page);await go(page,'Settings & backup');await page.getByRole('button',{name:'↑ Import backup',exact:true}).click();await page.getByLabel('Or paste backup JSON',{exact:true}).fill(JSON.stringify({format:'palabra-backup',version:1,progress:{},history:[],settings:{sections:['1a'],direction:'es-en',limit:10,minutes:'<b id="injected">probe</b>'}}));await page.getByRole('button',{name:'Preview pasted backup',exact:true}).click();await expect(page.getByRole('alert')).toContainText('Nothing was changed');await expect(page.locator('#injected')).toHaveCount(0);});
test('assignment preview, guest isolation and prerequisite-first launch',async({page})=>{await page.goto('./#assignment?chapter=2b&skill=2b.estar&kind=all&minutes=10');await expect(page.getByText(/Your usual class position and preferences stay as they are/)).toBeVisible();await page.getByRole('button',{name:'Use a temporary guest',exact:true}).click();await page.getByRole('button',{name:'Start this practice →',exact:true}).click();await expect(page.getByText('Prerequisite quick check',{exact:true})).toBeVisible();await expect(page.locator('#save-state')).toContainText('Temporary guest');await expect(page.getByRole('button',{name:'Download backup',exact:true})).toBeVisible();await openMenu(page);await page.getByRole('button',{name:'End guest session',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'End guest session',exact:true}).click();await expect(page.getByRole('button',{name:'Start learning →',exact:true})).toBeVisible();});
test('offline reload keeps the curriculum, draft and selected chapter usable',async({page,context})=>{await onboard(page);await expect(page.locator('#delivery-state')).toContainText('Ready offline',{timeout:30000});await startWords(page);await page.getByLabel('Your attempt (optional for self-graded vocabulary)',{exact:true}).fill('está');await context.setOffline(true);await page.reload();await expect(page.getByLabel('Your attempt (optional for self-graded vocabulary)',{exact:true})).toHaveValue('está');await expect(page.locator('#delivery-state')).toContainText('Offline');await go(page,'Words');await expect(page.getByText('1–25 of 940 · 940 selected cards',{exact:true})).toBeVisible();});
test('waiting release updates only after consent and retains in-progress work',async({page,request})=>{await onboard(page);await expect(page.locator('#delivery-state')).toContainText('Ready offline',{timeout:30000});await startWords(page);await page.getByLabel('Your attempt (optional for self-graded vocabulary)',{exact:true}).fill('mañana');await request.post('http://127.0.0.1:4179/__test/release');await go(page,'Settings & backup');await page.getByRole('button',{name:'Check for app updates',exact:true}).click();await expect(page.locator('#app-update')).toBeVisible({timeout:30000});await go(page,'Today');await expect(page.getByLabel('Your attempt (optional for self-graded vocabulary)',{exact:true})).toHaveValue('mañana');await page.getByRole('button',{name:'Save & update',exact:true}).click();await expect(page.locator('meta[name=palabra-release]')).toHaveAttribute('content',/ci-update$/);await expect(page.getByLabel('Your attempt (optional for self-graded vocabulary)',{exact:true})).toHaveValue('mañana');});
test('320px reflow keeps Menu, settings and save state reachable',async({page})=>{await page.setViewportSize({width:320,height:800});await onboard(page);await expect(page.locator('#save-state')).toBeVisible();await go(page,'Settings & backup');await page.getByText('Adjust learning preferences',{exact:true}).click();await expect(page.getByLabel('Spanish voice',{exact:true})).toBeVisible();const width=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:window.innerWidth}));expect(width.document).toBeLessThanOrEqual(width.viewport);});

test('one-click entry, five saved questions and a recommended lesson without configuring preferences',async({page})=>{
 await page.setViewportSize({width:320,height:800});await page.goto('./');await expect(page.getByLabel('Class position (optional)',{exact:true})).not.toBeVisible();
 await expect(page.getByRole('button',{name:'Start learning →',exact:true})).toBeInViewport();
 await page.screenshot({path:'test-results/guided-welcome-mobile.png',fullPage:true});
 await page.getByRole('button',{name:'Start learning →',exact:true}).click();await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuemax','5');
 for(let i=0;i<5;i++){
  await page.getByRole('button',{name:'I don’t know',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Let’s look at the pattern.',exact:true})).toBeVisible();
  if(i===1){await page.reload();await expect(page.getByRole('heading',{name:'Let’s look at the pattern.',exact:true})).toBeVisible();}
  await page.getByRole('button',{name:i===4?'See your session summary →':'Next activity →',exact:true}).click();
  if(i<4)await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(i+1));
 }
 await expect(page.getByRole('heading',{name:'Your next lesson is ready.',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Continue my learning →',exact:true}).click();
 await expect(page.getByRole('button',{name:'Try a sentence →',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Try a sentence →',exact:true}).click();
 await expect(page.getByLabel('Your answer',{exact:true})).toBeVisible();
 await expect(page.getByText('Read the brief lesson',{exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Save & leave',exact:true}).click();
 await expect(page.getByRole('button',{name:'Continue learning →',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Continue learning →',exact:true}).click();await expect(page.getByLabel('Your answer',{exact:true})).toBeVisible();
});

test('guided completion offers a stopping point instead of another setup or compulsory session',async({page})=>{
 await page.goto('./');await page.getByText('New to Spanish, or following a class?',{exact:true}).click();
 await page.getByRole('button',{name:'Begin with a lesson →',exact:true}).click();
 await expect(page.getByRole('button',{name:'Try a sentence →',exact:true})).toBeVisible();
 for(let i=0;i<35;i++){
  if(await page.getByRole('button',{name:'Done for today →',exact:true}).isVisible())break;
  const lesson=page.getByRole('button',{name:'Try a sentence →',exact:true});
  if(await lesson.isVisible()){await lesson.click();await expect(page.locator('#answer')).toBeVisible();continue;}
  const reveal=page.getByRole('button',{name:'Show answer →',exact:true});
  if(await reveal.isVisible()){const cursor=Number(await page.getByRole('progressbar').getAttribute('aria-valuenow'));await reveal.click();await page.getByRole('button',{name:'I remembered',exact:true}).click();await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow',String(cursor+1));continue;}
  const continueButton=page.getByRole('button',{name:/^(Next activity|See your session summary) →$/});
  if(await continueButton.isVisible()){await continueButton.click();await expect(continueButton).not.toBeVisible();continue;}
  const prompt=await page.locator('.exercise h2').last().textContent(),item=course.exercises.find(e=>e.prompt===prompt);
  expect(item,'The visible question has a real authored exercise').toBeTruthy();
  if(item.kind==='listening')await page.getByRole('button',{name:'Use text fallback',exact:true}).click();
  const input=page.locator('#answer');
  if(item.options)await input.selectOption(item.acceptedAnswers[0]);else await input.fill(item.assessmentMode==='self'?item.model:item.acceptedAnswers[0]);
  await page.getByRole('button',{name:item.assessmentMode==='self'?'Compare with checklist →':'Check answer →',exact:true}).click();
  await expect(page.getByRole('button',{name:/^(Next activity|See your session summary) →$/})).toBeVisible();
 }
 await page.getByRole('button',{name:'Done for today →',exact:true}).click();
 await expect(page.getByRole('heading',{name:'You’re done for today',exact:true})).toBeVisible();
 await expect(page.getByRole('button',{name:'Start daily practice →',exact:true})).toHaveCount(0);
 await page.reload();await expect(page.getByRole('heading',{name:'You’re done for today',exact:true})).toBeVisible();
 await expect(page.locator('.daily-next strong')).toHaveText(course.objectives.find(o=>o.id==='pe.instructions').title);
 await page.screenshot({path:'test-results/guided-today-desktop.png',fullPage:true});
 await page.setViewportSize({width:320,height:800});await page.screenshot({path:'test-results/guided-today-mobile.png',fullPage:true});
 const width=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:window.innerWidth}));expect(width.document).toBeLessThanOrEqual(width.viewport);
});

test('learner picker resumes separate saved places without changing another learner',async({page})=>{
 await page.goto('./');await page.getByLabel('Your name (optional)',{exact:true}).fill('Ana');await page.getByRole('button',{name:'Start learning →',exact:true}).click();
 await page.getByRole('button',{name:'I don’t know',exact:true}).click();await page.getByRole('button',{name:'Next activity →',exact:true}).click();
 await openMenu(page);await page.getByRole('button',{name:'Choose learner',exact:true}).click();await page.getByRole('button',{name:'Add a learner',exact:true}).click();
 await page.getByLabel('Display name',{exact:true}).fill('Luis');await page.getByRole('button',{name:'Create local profile',exact:true}).click();
 await page.getByRole('button',{name:'Start learning →',exact:true}).click();await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','0');
 await openMenu(page);await page.getByRole('button',{name:'Choose learner',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Ana',exact:true}).click();
 await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow','1');await expect(page.locator('#profile-name')).toHaveText('Ana');
});

test('one daily action and an accessible menu preserve keyboard and outside-click navigation',async({page})=>{
 await page.goto('./');await page.getByText('New to Spanish, or following a class?',{exact:true}).click();
 await page.getByRole('button',{name:'Begin with a lesson →',exact:true}).click();await expect(page.getByRole('button',{name:'Try a sentence →',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Save & leave',exact:true}).click();
 await expect(page.getByRole('button',{name:'Continue learning →',exact:true})).toBeVisible();
 await expect(page.getByRole('main').getByRole('button')).toHaveCount(1);
 await expect(page.getByText('We’ll guide the session.',{exact:true})).toHaveCount(0);
 const toggle=page.getByRole('button',{name:'Menu',exact:true}),menu=page.getByRole('navigation',{name:'Main navigation',exact:true});
 await expect(menu).toBeHidden();await toggle.focus();await page.keyboard.press('Enter');await expect(menu).toBeVisible();await expect(toggle).toHaveAttribute('aria-expanded','true');
 await page.keyboard.press('Escape');await expect(menu).toBeHidden();await expect(toggle).toBeFocused();
 await openMenu(page);await page.locator('.daily-card').click();await expect(menu).toBeHidden();
 await go(page,'Progress');await expect(page.locator('.progress-summary')).toContainText('words ready for review');
 await page.setViewportSize({width:320,height:800});await go(page,'Today');
 await expect(page.getByRole('button',{name:'Continue learning →',exact:true})).toBeInViewport();
 await expect(page.locator('#save-state')).toBeVisible();await expect(page.locator('#save-state')).toHaveAttribute('aria-label','Saved in this browser');
 await page.screenshot({path:'test-results/quiet-today-mobile.png',fullPage:true});
 await page.setViewportSize({width:1280,height:800});await page.screenshot({path:'test-results/quiet-today-desktop.png',fullPage:true});
});
