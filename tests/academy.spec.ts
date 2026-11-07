import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

test('Academy Overview and My Progress share a full milestone summary',async({page})=>{
 await page.goto('./');
 await expect(page.getByRole('heading',{name:'Academy overview'})).toBeVisible();
 await expect(page.getByText(/Version 0\.35/)).toBeVisible();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByRole('heading',{name:/My Progress/})).toBeVisible();
 await expect(page.getByText(/learning activities completed/)).toBeVisible();
 await expect(page.getByRole('heading',{name:/Learning worlds — complete activity tracking/})).toBeVisible();
});

test('Resume opens first incomplete guided activity without awarding an unrelated lesson',async({page})=>{
 await page.addInitScript(()=>{
   localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
   localStorage.setItem('amlverse-arcade-risk','75');
 });
 await page.goto('./');
 await expect(page.getByText('Your next recommended mission')).toBeVisible();
 await page.getByRole('button',{name:/Resume next unfinished activity/}).click();
 await expect(page.getByRole('heading',{name:/RiskLab.*Interactive Cases/}).first()).toBeVisible();
 const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('amlverse-course-v1-risk')||'{}'));
 expect(progress.lessons).toEqual([0,1,2]);
});

test('Deep resume to decision lab does not add an introductory lesson visit',async({page})=>{
 await page.addInitScript(()=>{
   localStorage.setItem('amlverse-town-unlocked-v1-team','yes');
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
   localStorage.setItem('amlverse-town-unlocked-v1-team','yes');
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


test('FATF Quest catalogue contains all forty recommendations and seven categories',async({page})=>{
 await page.goto('./');
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await expect(page.getByRole('heading',{name:'All 40 FATF Recommendations'})).toBeVisible();
 await expect(page.locator('.fatf40tile')).toHaveCount(40);
 await expect(page.locator('.fatf40groupbuttons button')).toHaveCount(8);
 await page.getByLabel('Find a recommendation').fill('beneficial ownership');
 await expect(page.locator('.fatf40tile').first()).toBeVisible();
});
test('FATF 40 provides implementation and analogous learning for new recommendations',async({page})=>{
 await page.goto('./');
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await page.getByRole('button',{name:/Unlock FATF course/}).click();
 await page.locator('.fatf40tile').filter({hasText:'R.24'}).click();
 await expect(page.getByRole('heading',{name:'Understand through an analogy'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Implementation process'})).toBeVisible();
 await expect(page.locator('.fatf40steps button')).toHaveCount(4);
 await page.getByRole('button',{name:/Complete study & start 3-question practice/}).click();
 await expect(page.getByText('Question 1 / 3')).toBeVisible();
});
test('FATF Recommendation 6 humanitarian safeguards and Recommendation 16 transition notes',async({page})=>{
 await page.goto('./');
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await page.getByRole('button',{name:/Unlock FATF course/}).click();
 await page.locator('.fatf40tile').filter({hasText:'R.6'}).click();
 await expect(page.getByText(/humanitarian exemptions and basic-needs safeguards/i).first()).toBeVisible();
 await page.getByRole('button',{name:/All forty Recommendations/}).click();
 await page.locator('.fatf40tile').filter({hasText:'R.16'}).click();
 await expect(page.getByText(/end of 2030/i).first()).toBeVisible();
});
test('FATF Quest preserves previous R1–R10 achievements and progress is shown in dashboard',async({page})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('amlverse-fatf-ch1',JSON.stringify({'1':{score:2,total:2},'2':{score:1,total:2}}));
 });
 await page.goto('./');
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await expect(page.getByText('1 / 40')).toBeVisible();
 await page.getByRole('button',{name:/All forty Recommendations/}).count().then(async count=>{if(count)await page.getByRole('button',{name:/All forty Recommendations/}).click()});
 await page.getByRole('button',{name:/Academy overview/}).first().click();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 await expect(page.getByText('Recommendations 1–40')).toBeVisible();
});

test('Mobile expanded academy keeps Continue below the course information and opens the relevant lesson',async({page,isMobile})=>{
 test.skip(!isMobile,'Reading-first layout applies to mobile viewport');
 await page.addInitScript(()=>localStorage.setItem('amlverse-town-unlocked-v1-risk','yes'));
 await page.goto('./');
 await page.getByRole('button',{name:/RiskLab Arcade/}).last().click();
 await page.getByRole('button',{name:/Enter expanded RiskLab/}).click();
 const footer=page.locator('.mobilelessonfooter');
 await expect(footer).toBeVisible();
 expect(await page.evaluate(()=>{
  const previous=document.querySelector('.riskadvancedwelcome');
  const footer=document.querySelector('.mobilelessonfooter');
  return !!previous&&!!footer&&!!(previous.compareDocumentPosition(footer)&Node.DOCUMENT_POSITION_FOLLOWING);
 })).toBe(true);
 await expect(footer.locator('.nextstepbar')).toHaveCSS('position','static');
 await footer.getByRole('button',{name:/Resume next required activity/}).click();
 await expect(page.locator('.riskadvancedlesson')).toBeVisible();
 await expect.poll(()=>page.locator('.riskadvancedlesson').evaluate(el=>Math.round(el.getBoundingClientRect().top))).toBeLessThan(140);
});
test('Mobile lesson Continue reaches knowledge checker and checker advances question by question',async({page,isMobile})=>{
 test.skip(!isMobile,'Exercise scroll and checker transition on mobile');
 await page.addInitScript(()=>localStorage.setItem('amlverse-town-unlocked-v1-risk','yes'));
 await page.goto('./');
 await page.getByRole('button',{name:/RiskLab Arcade/}).last().click();
 await page.getByRole('button',{name:/Enter expanded RiskLab/}).click();
 await page.locator('.mobilelessonfooter').getByRole('button',{name:/Resume next required activity/}).click();
 for(let i=0;i<3;i++){
   await page.locator('.riskadvancedlesson').getByRole('button',{name:/Continue/}).click();
 }
 await page.locator('.riskadvancedlesson').getByRole('button',{name:/Continue to Foundations knowledge check/}).click();
 await expect(page.locator('.riskadvancedassessment')).toBeVisible();
 await expect(page.getByText('Question 1 / 10')).toBeVisible();
 await page.locator('.riskadvancedassessment .choice').first().click();
 await page.locator('.riskadvancedassessment').getByRole('button',{name:/Check answer/}).click();
 await expect(page.locator('.riskadvancedassessment .feedback')).toBeVisible();
 await page.locator('.riskadvancedassessment').getByRole('button',{name:/Next question/}).click();
 await expect(page.getByText('Question 2 / 10')).toBeVisible();
 await expect.poll(()=>page.locator('.riskadvancedassessment').evaluate(el=>Math.round(el.getBoundingClientRect().top))).toBeLessThan(140);
});


test('Learning Town is locked by default after the first district',async({page})=>{
 await page.goto('./');
 await expect(page.getByRole('heading',{name:/Follow the pathway, unlock each district/})).toBeVisible();
 await expect(page.locator('.townstop')).toHaveCount(9);
 await expect(page.locator('.townstop').nth(0)).toContainText(/AVAILABLE/i);
 await expect(page.locator('.townstop').nth(1)).toContainText(/LOCKED/i);
 await expect(page.locator('.academyworldcard').nth(1)).toBeDisabled();
 await expect(page.locator('.townstop').nth(1).getByRole('button',{name:/Unlock this course/})).toBeVisible();
});
test('Individual manual unlock grants access to a locked world without manufacturing completion',async({page})=>{
 await page.goto('./');
 await page.locator('.townstop').nth(1).getByRole('button',{name:/Unlock this course/}).click();
 await expect(page.locator('.townstop').nth(1)).toContainText(/UNLOCKED BY LEARNER/i);
 await page.locator('.townstop').nth(1).getByRole('button',{name:/Enter district/}).click();
 await expect(page.getByRole('heading',{name:'Who Does What?'})).toBeVisible();
 const unlock=await page.evaluate(()=>localStorage.getItem('amlverse-town-unlocked-v1-team'));
 expect(unlock).toBe('yes');
 const progress=await page.evaluate(()=>JSON.parse(localStorage.getItem('amlverse-course-v1-team')||'{}'));
 expect(progress.lessons||[]).toEqual([]);
});
test('Guided RiskLab locks future lessons and checker until preceding lessons completed',async({page})=>{
 await page.goto('./');
 await page.locator('.townstop').first().getByRole('button',{name:/Enter district/}).click();
 await expect(page.getByRole('button',{name:/Quick check/})).toBeDisabled();
 await expect(page.locator('.knowledgetabs button').nth(1)).toBeDisabled();
 await page.getByRole('button',{name:/Next lesson/}).click();
 await expect(page.locator('.knowledgetabs button').nth(1)).toBeEnabled();
 await page.getByRole('button',{name:/Next lesson/}).click();
 await page.getByRole('button',{name:/Continue to Quick Check/}).click();
 await expect(page.getByRole('button',{name:/Quick check/})).toBeEnabled();
 await expect(page.getByRole('button',{name:/③ Play/})).toBeDisabled();
});
test('Reset Course requires RESET and deletes only that course progress',async({page})=>{
 await page.goto('./');
 await page.evaluate(()=>{
  localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:4,lastVisited:''}));
  localStorage.setItem('amlverse-arcade-risk','80');
  localStorage.setItem('amlverse-risklab-advanced-v1',JSON.stringify({visited:[0,1]}));
  localStorage.setItem('amlverse-world-champion-v1-risk','yes');
  localStorage.setItem('amlverse-course-v1-team',JSON.stringify({lessons:[0],checkPassed:false,checkAttempts:0,lastVisited:''}));
  localStorage.setItem('amlverse-fatf-ch1',JSON.stringify({'1':{score:2,total:2}}));
 });
 await page.reload();
 await page.locator('.townstop').first().getByRole('button',{name:/Resume journey/}).click();
 await page.getByRole('button',{name:/Back to RiskLab/}).click();
 await page.getByRole('button',{name:/Reset course progress/}).click();
 await expect(page.getByRole('button',{name:'Delete this course progress'})).toBeDisabled();
 await page.getByLabel(/Type RESET/).fill('RESET');
 await page.getByRole('button',{name:'Delete this course progress'}).click();
 await page.waitForLoadState('domcontentloaded');
 const values=await page.evaluate(()=>({
  risk:localStorage.getItem('amlverse-course-v1-risk'),
  score:localStorage.getItem('amlverse-arcade-risk'),
  advanced:localStorage.getItem('amlverse-risklab-advanced-v1'),
  champion:localStorage.getItem('amlverse-world-champion-v1-risk'),
  team:localStorage.getItem('amlverse-course-v1-team'),
  fatf:localStorage.getItem('amlverse-fatf-ch1')
 }));
 expect(values.risk).toBeNull();
 expect(values.score).toBeNull();
 expect(values.advanced).toBeNull();
 expect(values.champion).toBeNull();
 expect(values.team).not.toBeNull();
 expect(values.fatf).not.toBeNull();
});

test('Unlock all courses exposes all districts and restores guided mode',async({page})=>{
 await page.goto('./');
 await page.getByRole('button',{name:/Unlock all courses/}).click();
 await expect(page.locator('.townstop.locked')).toHaveCount(0);
 await page.getByRole('button',{name:/Restore guided course locks/}).click();
 await expect(page.locator('.townstop.locked')).toHaveCount(8);
});


test('FATF Quest locks future recommendations until the preceding one is mastered',async({page})=>{
 await page.goto('./');
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await expect(page.locator('.fatf40tile').nth(0)).toBeEnabled();
 await expect(page.locator('.fatf40tile').nth(1)).toBeDisabled();
 await page.getByRole('button',{name:/Unlock FATF course/}).click();
 await expect(page.locator('.fatf40tile').nth(39)).toBeEnabled();
 await page.getByRole('button',{name:/Restore guided FATF locks/}).click();
 await expect(page.locator('.fatf40tile').nth(39)).toBeDisabled();
});
test('FATF reset requires confirmation and preserves other worlds',async({page})=>{
 await page.goto('./');
 await page.evaluate(()=>{
  localStorage.setItem('amlverse-fatf-ch1',JSON.stringify({'1':{score:2,total:2}}));
  localStorage.setItem('amlverse-fatf-40-v2',JSON.stringify({studied:[1,2],outcomes:{'2':{score:3,total:3}}}));
  localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0],checkPassed:false,checkAttempts:0,lastVisited:''}));
 });
 await page.reload();
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await page.getByRole('button',{name:/Reset FATF course/}).click();
 await expect(page.getByRole('button',{name:/Delete FATF course progress/})).toBeDisabled();
 await page.getByLabel(/Type RESET/).fill('RESET');
 await page.getByRole('button',{name:/Delete FATF course progress/}).click();
 await expect(page.getByText('0 / 40').first()).toBeVisible();
 const data=await page.evaluate(()=>({
  legacy:localStorage.getItem('amlverse-fatf-ch1'),
  expanded:localStorage.getItem('amlverse-fatf-40-v2'),
  risk:localStorage.getItem('amlverse-course-v1-risk')
 }));
 expect(data.legacy).toBeNull();
 expect(data.expanded).toBeNull();
 expect(data.risk).not.toBeNull();
});

test('Locked district opens an informative card instead of browser alert',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Egmont Exchange',exact:true}).first().click();
 const card=page.getByRole('dialog',{name:/Egmont Exchange is locked/});
 await expect(card).toBeVisible();
 await expect(card.getByText(/Mutual Evaluation Arena/).first()).toBeVisible();
 await expect(card.getByText(/0 of 9 milestones/)).toBeVisible();
 await expect(card.getByRole('button',{name:/Continue RiskLab Arcade/})).toBeVisible();
 await card.getByRole('button',{name:/Not now/}).click();
 await expect(card).toHaveCount(0);
});
test('Locked district modal can unlock selected course without awarding completion',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Egmont Exchange',exact:true}).first().click();
 const card=page.getByRole('dialog',{name:/Egmont Exchange is locked/});
 await card.getByRole('button',{name:/Unlock this course anyway/}).click();
 await expect(card).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Secure FIU Cooperation'}).first()).toBeVisible();
 expect(await page.evaluate(()=>localStorage.getItem('amlverse-town-unlocked-v1-egmont'))).toBe('yes');
 expect(await page.evaluate(()=>localStorage.getItem('amlverse-course-v1-egmont'))).toBeNull();
});
test('Locked district message can be dismissed with Escape',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Egmont Exchange',exact:true}).first().click();
 await expect(page.getByRole('dialog',{name:/Egmont Exchange is locked/})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('Project & Research names the independent creator and accurately limits endorsement claims',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Project & Research',exact:true}).click();
 await expect(page.getByRole('heading',{name:/Building better financial investigations/})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Muzammil Adamu'})).toBeVisible();
 await expect(page.getByText(/not an official NFIU, FATF, Egmont Group, UNODC/)).toBeVisible();
 await expect(page.getByText('Real investigation records required')).toBeVisible();
 await page.getByRole('tab',{name:'Evidence & review policy'}).click();
 await expect(page.getByText(/No agency endorsement, peer review, formal impact study/)).toBeVisible();
});
test('Research sections and official references are accessible on desktop and mobile',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Project & Research',exact:true}).click();
 await expect(page.getByRole('tab',{name:'Learning methodology'})).toHaveAttribute('aria-selected','true');
 await page.getByRole('tab',{name:'Evidence & review policy'}).click();
 await expect(page.getByRole('heading',{name:/What is verified/})).toBeVisible();
 await page.getByRole('tab',{name:'International pilot protocol'}).click();
 await expect(page.getByText(/This is a proposed evaluation protocol, not a completed study/)).toBeVisible();
 await expect(page.locator('.researchsourcesgrid article')).toHaveCount(4);
 await expect(page.locator('.researchengageactions a')).toHaveCount(2);
 if(isMobile)expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3)).toBe(true);
});
test('Project page offers copyable professional citation and returns to the learning town',async({page})=>{
 await page.goto('./');
 await page.getByRole('button',{name:'Project & Research',exact:true}).click();
 await expect(page.getByText(/Adamu, M. \(2026\)/)).toBeVisible();
 await page.getByRole('button',{name:/Academy overview/}).click();
 await expect(page.getByRole('heading',{name:'Academy overview'})).toBeVisible();
});
