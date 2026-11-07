import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

test('Academy Overview and My Progress share a full milestone summary',async({page})=>{
 await page.goto('./');
 await expect(page.getByRole('heading',{name:'Academy overview'})).toBeVisible();
 await expect(page.getByText(/Version 0\.31/)).toBeVisible();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByRole('heading',{name:/My Progress/})).toBeVisible();
 await expect(page.getByText(/learning activities completed/)).toBeVisible();
 await expect(page.getByRole('heading',{name:/Learning worlds — complete activity tracking/})).toBeVisible();
});

test('Resume opens unfinished expanded course without awarding an unrelated lesson',async({page})=>{
 await page.addInitScript(()=>{
   localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
   localStorage.setItem('amlverse-arcade-risk','75');
 });
 await page.goto('./');
 await expect(page.getByText('Your next recommended mission')).toBeVisible();
 await page.getByRole('button',{name:/Resume next unfinished activity/}).click();
 await expect(page.getByRole('heading',{name:/RiskLab Academy 2\.0/}).first()).toBeVisible();
 const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('amlverse-course-v1-risk')||'{}'));
 expect(progress.lessons).toEqual([0,1,2]);
});

test('Deep resume to decision lab does not add an introductory lesson visit',async({page})=>{
 await page.addInitScript(()=>{
   localStorage.setItem('amlverse-world-interactions-v1-team',JSON.stringify({completed:[0,1,2],best:100}));
 });
 await page.goto('./');
 await page.getByRole('button',{name:/Teamwork Arcade/}).last().click();
 await page.getByRole('button',{name:/Evidence dossier & three-stage decision lab/}).click();
 await expect(page.getByText('Joint Investigation: Assign Competent Roles')).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('amlverse-course-v1-team')||'{}'));
 expect(saved.lessons??[]).toEqual([]);
});

test('CSV exports all activity types and can be downloaded',async({page})=>{
 await page.addInitScript(()=>{
   localStorage.setItem('amlverse-world-interactions-v1-nigeria',JSON.stringify({completed:[0,1],best:93}));
   localStorage.setItem('amlverse-world-decisions-v1-nigeria',JSON.stringify({passed:true,best:100}));
   localStorage.setItem('amlverse-capstone-v1',JSON.stringify({best:87,passed:true}));
 });
 await page.goto('./');
 await page.getByRole('button',{name:/My Progress/}).first().click();
 const [download]=await Promise.all([
   page.waitForEvent('download'),
   page.getByRole('button',{name:/Export all activities/}).click(),
 ]);
 expect(download.suggestedFilename()).toBe('amlverse-complete-learning-record.csv');
 const path=await download.path();
 expect(path).toBeTruthy();
 const csv=await readFile(path!,'utf8');
 for(const marker of ['RiskLab Academy 2.0','Nigeria Compliance Academy 2.0','Virtual Asset Academy 2.0','Interactive evidence challenges','Evidence dossier','FATF Quest','Integrated Capstone'])
   expect(csv).toContain(marker);
 expect(csv).toContain('"2"'); // seeded Nigeria evidence milestones
});

test('Complete an interactive timeline and retain it across navigation',async({page})=>{
 await page.addInitScript(()=>{
   localStorage.setItem('amlverse-world-interactions-v1-team',JSON.stringify({completed:[0,1],best:88}));
 });
 await page.goto('./');
 await page.getByRole('button',{name:/Teamwork Arcade/}).last().click();
 await page.getByRole('button',{name:/Open interactive challenges/}).click();
 await expect(page.getByRole('heading',{name:/Construct the investigation timeline/})).toBeVisible();
 for(const step of ['FIU analyses relevant reports','Investigators pursue corroboration under their authority','Prosecutors assess admissible case material']){
   await page.getByRole('button',{name:new RegExp(step)}).click();
 }
 await page.getByRole('button',{name:/Complete this case/}).click();
 await expect(page.getByText(/All three interactive cases complete/)).toBeVisible();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('amlverse-world-interactions-v1-team')||'{}'));
 expect(saved.completed).toEqual(expect.arrayContaining([0,1,2]));
});

test('Mobile page offers usable navigation without horizontal scrolling',async({page,isMobile})=>{
 test.skip(!isMobile,'This check targets the mobile viewport');
 await page.goto('./');
 await expect(page.getByRole('heading',{name:'Academy overview'})).toBeVisible();
 const viewportOkay=await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3);
 expect(viewportOkay).toBe(true);
 await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByRole('heading',{name:/My Progress/})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3)).toBe(true);
});
