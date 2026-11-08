import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';

test('Completing one world reveals its course certificate within that world',async({page,isMobile})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
  localStorage.setItem('amlverse-arcade-risk','100');
  localStorage.setItem('amlverse-world-interactions-v1-risk',JSON.stringify({completed:[0,1,2],best:100}));
  localStorage.setItem('amlverse-world-decisions-v1-risk',JSON.stringify({passed:true,best:100}));
  localStorage.setItem('amlverse-risklab-advanced-v1',JSON.stringify({visited:Array.from({length:12},(_,i)=>i),quizPass:{Foundations:true,Intermediate:true,Advanced:true},simPass:{Foundations:true,Intermediate:true,Advanced:true}}));
 });
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.townstop').first().getByRole('button',{name:/Review district/}).click();
 const section=page.locator('.coursecertificatefinish, .knowledgepath .certificates');
 await expect(section.first()).toBeVisible();
 await expect(page.locator('.certificate-tile.earned')).toHaveCount(1);
 await expect(page.locator('.certificate-tile.earned')).toContainText('RiskLab Arcade');
 await expect(page.getByRole('button',{name:'View certificate'})).toBeVisible();
});
test('Certificates start locked until a game or course is actually completed',async({page})=>{
 await page.goto('./');
 await page.getByRole('button',{name:/My Progress/}).first().click();
 const gallery=page.locator('.certificates');
 await expect(gallery.getByRole('heading',{name:'Certificates of completion'})).toBeVisible();
 await expect(gallery.locator('.certificate-tile')).toHaveCount(21);
 await expect(gallery.locator('.certificate-tile.earned')).toHaveCount(0);
 await expect(gallery.locator('.certificate-tile.locked button').first()).toBeDisabled();
});
test('Finished game unlocks printable certificate but not the full-course certificate',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('amlverse-arcade-risk','85'));
 await page.goto('./');
 await page.getByRole('button',{name:/My Progress/}).first().click();
 const gallery=page.locator('.certificates');
 const game=gallery.locator('.certificate-tile').filter({hasText:'GAME COMPLETION'}).filter({hasText:'RiskLab Arcade'});
 const course=gallery.locator('.certificate-tile').filter({hasText:'FULL COURSE COMPLETION'}).filter({hasText:'RiskLab Arcade'});
 await expect(game).toHaveClass(/earned/);
 await expect(course).toHaveClass(/locked/);
 await game.getByRole('button',{name:'View certificate'}).click();
 await expect(page.getByRole('dialog',{name:'Certificate preview'})).toBeVisible();
 await expect(page.getByRole('button',{name:'Print / Save as PDF'})).toBeDisabled();
 await page.getByRole('button',{name:'Close certificate preview'}).click();
 await gallery.getByLabel('Learner name for your certificates').fill('Training Learner');
 await game.getByRole('button',{name:'View certificate'}).click();
 await expect(page.locator('.certificate-recipient')).toHaveText('Training Learner');
 await expect(page.getByRole('button',{name:'Print / Save as PDF'})).toBeEnabled();
 await expect(page.getByText(/not an accredited qualification/i).first()).toBeVisible();
});
test('Learning world card badges and locked labels remain legible on white',async({page})=>{
 await page.goto('./');
 const cards=page.locator('.academyworldcard');
 await expect(cards).toHaveCount(9);
 await expect(cards.nth(2)).toBeDisabled();
 const measurements=await cards.evaluateAll(nodes=>{
  function rgb(value:string){
   const numbers=(value.match(/\d+(?:\.\d+)?/g)||[]).slice(0,3).map(Number);
   if(numbers.length!==3)throw new Error('Bad CSS color: '+value);
   return numbers.map(v=>{const c=v/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});
  }
  function luminance(color:string){const [r,g,b]=rgb(color);return r*.2126+g*.7152+b*.0722}
  function ratio(foreground:string,background:string){
   const a=luminance(foreground),b=luminance(background);
   return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  }
  return nodes.slice(0,3).map(node=>{
   const badge=node.querySelector('.academyworldmeta span')!;
   const title=node.querySelector('.academyworldbody h4')!;
   const description=node.querySelector('.academyworldbody p')!;
   const meta=getComputedStyle(badge);
   return {disabled:(node as HTMLButtonElement).disabled,
    opacity:Number(getComputedStyle(node).opacity),
    badgeContrast:ratio(meta.color,meta.backgroundColor),
    titleContrast:ratio(getComputedStyle(title).color,getComputedStyle(node).backgroundColor),
    descriptionContrast:ratio(getComputedStyle(description).color,getComputedStyle(node).backgroundColor),
    badgeFont:parseFloat(meta.fontSize)};
  });
 });
 for(const result of measurements){
  expect(result.opacity).toBeGreaterThanOrEqual(0.99);
  expect(result.badgeContrast).toBeGreaterThanOrEqual(4.5);
  expect(result.titleContrast).toBeGreaterThanOrEqual(4.5);
  expect(result.descriptionContrast).toBeGreaterThanOrEqual(4.5);
  expect(result.badgeFont).toBeGreaterThanOrEqual(13);
 }
});
test('Guided FATF panel and interactive challenge promo use accessible colors',async({page,isMobile})=>{
 const audit=async (surface:string,foreground:string)=>{
  const colors=await page.evaluate(({surface,foreground})=>{
   const b=document.querySelector(surface),f=document.querySelector(foreground);
   if(!b||!f)throw new Error('Missing audited element '+surface+' '+foreground);
   const parse=(v:string)=>Array.from(v.matchAll(/\d+(?:\.\d+)?/g),m=>Number(m[0])).slice(0,3).map(n=>{const x=n/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});
   const lum=(v:string)=>{const [r,g,b]=parse(v);return r*.2126+g*.7152+b*.0722};
   const bg=getComputedStyle(b).backgroundColor,fg=getComputedStyle(f).color;
   const a=lum(bg),c=lum(fg);
   return {contrast:(Math.max(a,c)+.05)/(Math.min(a,c)+.05),bg,fg};
  },{surface,foreground});
  expect(colors.contrast,foreground+' on '+surface+': '+JSON.stringify(colors)).toBeGreaterThanOrEqual(4.5);
 };
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await expect(page.locator('.fatftowncontrols')).toBeVisible();
 await audit('.fatftowncontrols','.fatftowncontrols>div:first-child strong');
 await audit('.fatftowncontrols','.fatftowncontrols>div:first-child p');
 await page.getByRole('button',{name:/Academy overview/}).first().click();
 await page.locator('.townstop').first().getByRole('button',{name:/Enter district/}).click();
 await expect(page.locator('.worldinteractivepromo')).toBeVisible();
 await audit('.worldinteractivepromo','.worldinteractivepromo h2');
 await audit('.worldinteractivepromo','.worldinteractivepromo p');
 await audit('.worldinteractivepromo','.worldinteractivepromo .worldmeterline strong');
});
test('Mutual Evaluation Assessor game stays readable across introduction, sorting and interview',async({page,isMobile})=>{
 await page.addInitScript(()=>{
  const ids=['risk','team','evaluation'];
  const scores=['amlverse-arcade-risk','amlverse-arcade-team','amlverse-evaluation-arena-best'];
  for(let i=0;i<ids.length;i++){
   const id=ids[i];
   localStorage.setItem('amlverse-course-v1-'+id,JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
   localStorage.setItem(scores[i],'100');
   localStorage.setItem('amlverse-world-interactions-v1-'+id,JSON.stringify({completed:[0,1,2],best:100}));
   localStorage.setItem('amlverse-world-decisions-v1-'+id,JSON.stringify({passed:true,best:100}));
  }
  const advanced={visited:Array.from({length:12},(_,i)=>i),quizPass:{Foundations:true,Intermediate:true,Advanced:true},simPass:{Foundations:true,Intermediate:true,Advanced:true}};
  localStorage.setItem('amlverse-risklab-advanced-v1',JSON.stringify(advanced));
  localStorage.setItem('amlverse-guide-v1-evaluation','yes');
  localStorage.setItem('amlverse-world-champion-v1-evaluation','yes');
 });
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.anavitem').filter({hasText:'Mutual Evaluation'}).click();
 await page.getByRole('button',{name:/③ Play/}).click();
 await page.getByRole('button',{name:/Skip tutorial and play/}).click();
 const game=page.locator('.evaluationgame');
 await expect(game.getByRole('heading',{name:"The Assessor's Challenge"})).toBeVisible();
 const check=async(pairs:{foreground:string;background:string}[])=>{
  const values=await page.evaluate(pairs=>{
   const lum=(value:string)=>{
    const rgb=Array.from(value.matchAll(/\d+(?:\.\d+)?/g),x=>Number(x[0])).slice(0,3);
    if(rgb.length!==3)throw Error('Unparseable color '+value);
    const [r,g,b]=rgb.map(n=>{const x=n/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});
    return .2126*r+.7152*g+.0722*b;
   };
   return pairs.map(({foreground,background})=>{
    const text=document.querySelector(foreground),surface=document.querySelector(background);
    if(!text||!surface)throw Error('Missing '+foreground+' or '+background);
    const fg=lum(getComputedStyle(text).color),bg=lum(getComputedStyle(surface).backgroundColor);
    return {selector:foreground,ratio:(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)};
   });
  },pairs);
  for(const item of values)expect(item.ratio,item.selector).toBeGreaterThanOrEqual(4.5);
 };
 await check([
  {foreground:'.evaluationgame .evalscene h2',background:'.evaluationgame .evalscene'},
  {foreground:'.evaluationgame .evalscene p',background:'.evaluationgame .evalscene'},
  {foreground:'.evaluationgame .evalscene .eyebrow',background:'.evaluationgame .evalscene'},
  {foreground:'.evaluationgame .evalhud>span',background:'.evaluationgame .evalhud'}
 ]);
 await game.getByRole('button',{name:/Start sorting evidence/}).click();
 await check([
  {foreground:'.evaluationgame .arcadeinstruction p',background:'.evaluationgame .arcadeinstruction'},
  {foreground:'.evaluationgame .arcadecards .arcadecard>span',background:'.evaluationgame .arcadecards .arcadecard'},
  {foreground:'.evaluationgame .evalbins .arcadebin b',background:'.evaluationgame .evalbins .arcadebin'}
 ]);
 const pairs=[
  ['AML/CFT legislation','Technical compliance'],
  ['Financial intelligence outcomes','Effectiveness'],
  ['Written cooperation procedure','Technical compliance'],
  ['Dissemination and use records','Effectiveness'],
  ['Agency publicity poster','Needs evidence'],
  ['Unverified success story','Needs evidence']
 ];
 for(const [card,bin] of pairs){
  await game.locator('.arcadecards .arcadecard').filter({hasText:card}).click();
  await game.locator('.evalbins .arcadebin').filter({hasText:bin}).click();
 }
 await game.getByRole('button',{name:/Enter assessor interview/}).click();
 await check([
  {foreground:'.evaluationgame .evaldialog p',background:'.evaluationgame .evaldialog'},
  {foreground:'.evaluationgame .arcadeinstruction p',background:'.evaluationgame .arcadeinstruction'}
 ]);
 await game.locator('.choices .choice').nth(1).click();
 await game.getByRole('button',{name:/Check my answer/}).click();
 await check([
  {foreground:'.evaluationgame .feedback strong',background:'.evaluationgame .feedback'},
  {foreground:'.evaluationgame .feedback p',background:'.evaluationgame .feedback'}
 ]);
});
test('Expanded academy lesson examples, takeaway and quiz question cards have readable contrast',async({page,isMobile})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
  localStorage.setItem('amlverse-arcade-risk','100');
  localStorage.setItem('amlverse-world-interactions-v1-risk',JSON.stringify({completed:[0,1,2],best:100}));
  localStorage.setItem('amlverse-world-decisions-v1-risk',JSON.stringify({passed:true,best:100}));
  localStorage.setItem('amlverse-risklab-advanced-v1',JSON.stringify({visited:[0,1,2,3]}));
 });
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.townstop').first().getByRole('button',{name:/Resume journey/}).click();
 const academy=page.locator('main.riskadvanced');
 await expect(academy).toBeVisible();
 const audit=async(pairs:{text:string;surface:string}[])=>{
  const results=await page.evaluate(pairs=>{
   const luminance=(css:string)=>{
    const rgb=Array.from(css.matchAll(/\d+(?:\.\d+)?/g),v=>Number(v[0])).slice(0,3);
    if(rgb.length!==3)throw new Error('Invalid color '+css);
    const [r,g,b]=rgb.map(x=>{const n=x/255;return n<=.04045?n/12.92:((n+.055)/1.055)**2.4});
    return r*.2126+g*.7152+b*.0722;
   };
   return pairs.map(pair=>{
    const a=document.querySelector(pair.text),b=document.querySelector(pair.surface);
    if(!a||!b)throw new Error('Selector not found: '+JSON.stringify(pair));
    const fg=luminance(getComputedStyle(a).color),bg=luminance(getComputedStyle(b).backgroundColor);
    return {selector:pair.text,contrast:(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05)};
   });
  },pairs);
  for(const item of results)expect(item.contrast,item.selector).toBeGreaterThanOrEqual(4.5);
 };
 await academy.locator('.riskadvancedlessons button').first().click();
 await expect(academy.locator('.riskadvancedlesson')).toBeVisible();
 await audit([
  {text:'.riskadvancedlesson .knowledgeexample b',surface:'.riskadvancedlesson .knowledgeexample'},
  {text:'.riskadvancedlesson .knowledgeexample p',surface:'.riskadvancedlesson .knowledgeexample'},
  {text:'.riskadvancedlesson .knowledgetakeaway b',surface:'.riskadvancedlesson .knowledgetakeaway'},
  {text:'.riskadvancedlesson .riskadvancedstep>span',surface:'.riskadvancedlesson'}
 ]);
 await academy.getByRole('button',{name:'All lessons'}).click();
 await academy.locator('.riskadvancedtieractions button').first().click();
 await expect(academy.locator('.riskadvancedassessment')).toBeVisible();
 await audit([
  {text:'.riskadvancedassessment .riskadvancedprompt',surface:'.riskadvancedassessment .riskadvancedprompt'},
  {text:'.riskadvancedassessment .choices>.choice',surface:'.riskadvancedassessment .choices>.choice'},
  {text:'.riskadvancedassessment .choices>.choice .letter',surface:'.riskadvancedassessment .choices>.choice .letter'},
  {text:'.riskadvancedassessment .riskadvancedstep>span',surface:'.riskadvancedassessment'}
 ]);
 const button=academy.getByRole('button',{name:/Check answer/});
 await expect(button).toBeDisabled();
 await academy.locator('.riskadvancedassessment .choices>.choice').first().click();
 await expect(button).toBeEnabled();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+4)).toBe(true);
});
test('Learners may select blockchain-first while preserving the foundations pathway and records',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await expect(page.locator('.townstop').first()).toContainText('Risk Academy');
 const start=page.getByRole('button',{name:/Start with Virtual Assets & Blockchain/});
 await expect(start).toBeVisible();
 await start.click();
 await expect(page.getByRole('heading',{name:/Virtual Asset Investigation/})).toBeVisible();
 await page.getByRole('button',{name:/Academy overview/}).click();
 await expect(page.locator('.townstop').first()).toContainText('Blockchain Harbour');
 await expect(page.locator('.townstop').nth(1)).toContainText('Tracing Laboratory');
 await expect(page.locator('.townstop').nth(1)).toContainText('LOCKED');
 await expect(page.getByText('Current pathway: Virtual Assets & Blockchain first')).toBeVisible();
 await page.getByRole('button',{name:/Start with Foundations & Standards/}).click();
 await expect(page.getByRole('heading',{name:/RiskLab Arcade/})).toBeVisible();
 await page.getByRole('button',{name:/Academy overview/}).click();
 await expect(page.locator('.townstop').first()).toContainText('Risk Academy');
 await expect(page.getByText('Current pathway: Foundations & Standards first')).toBeVisible();
});
test('Clickable fictional crypto route reveals readable evidence limitations',async({page,isMobile})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('amlverse-learning-path-v1','blockchain');
  localStorage.setItem('amlverse-course-v1-virtualassets',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
  localStorage.setItem('amlverse-guide-v1-virtualassets','yes');
 });
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.townstop').first().getByRole('button',{name:/Resume journey/}).click();
 await page.getByRole('button',{name:/③ Play/}).click();
 await page.getByRole('button',{name:/Skip tutorial and play/}).click();
 await page.getByRole('button',{name:/View fictional transfer route/}).click();
 const map=page.locator('main.virtualassetgame .chaincase');
 await expect(map.getByRole('heading',{name:'Two linked transactions'})).toBeVisible();
 await map.getByRole('button',{name:/WAL-B/}).click();
 await expect(map.getByRole('status')).toContainText('intermediary received 12 units');
 const styles=await map.locator('.chainnode.inspected').evaluate(node=>{
  const parent=getComputedStyle(node),name=node.querySelector('strong')!;
  const vals=(str:string)=>Array.from(str.matchAll(/\d+(?:\.\d+)?/g),m=>Number(m[0])).slice(0,3);
  const lum=(str:string)=>{const [r,g,b]=vals(str).map(x=>{const v=x/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return r*.2126+g*.7152+b*.0722};
  const a=lum(getComputedStyle(name).color),b=lum(parent.backgroundColor);
  return {contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),radius:parseFloat(parent.borderTopLeftRadius)};
 });
 expect(styles.contrast).toBeGreaterThanOrEqual(4.5);
 expect(styles.radius).toBeGreaterThanOrEqual(12);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+4)).toBe(true);
});
test('Original learning world meter remains readable in every course',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.townstop').first().getByRole('button',{name:/Enter district/}).click();
 const meter=page.locator('.worldclassicmeter');
 await expect(meter).toBeVisible();
 await expect(meter).toContainText('Original lessons, Quick Check and game');
 const result=await meter.evaluate(el=>{
  const lum=(v:string)=>{
   const channels=Array.from(v.matchAll(/\d+(?:\.\d+)?/g),x=>Number(x[0])).slice(0,3);
   if(channels.length!==3)throw Error('Cannot parse color '+v);
   const [r,g,b]=channels.map(x=>{const c=x/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});
   return .2126*r+.7152*g+.0722*b;
  };
  const bg=lum(getComputedStyle(el).backgroundColor);
  return [...el.querySelectorAll('.worldmeterline>span,.worldmeterline>strong')].map(node=>{
   const fg=lum(getComputedStyle(node).color);
   return {contrast:(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05),fontSize:parseFloat(getComputedStyle(node).fontSize)};
  });
 });
 expect(result).toHaveLength(2);
 for(const label of result){
  expect(label.contrast).toBeGreaterThanOrEqual(4.5);
  expect(label.fontSize).toBeGreaterThanOrEqual(14);
 }
});
test('Decision Lab meters, controls and post-answer explanation meet readable contrast',async({page,isMobile})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
  localStorage.setItem('amlverse-arcade-risk','100');
  localStorage.setItem('amlverse-world-interactions-v1-risk',JSON.stringify({completed:[0,1,2],best:100}));
 });
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.townstop').first().getByRole('button',{name:/Resume journey/}).click();
 const decision=page.locator('.worlddecision');
 await expect(decision).toBeVisible();
 const audit=async(pairs:{text:string;surface:string}[])=>{
  const values=await page.evaluate((pairs)=>{
   const luminance=(raw:string)=>{
    const channels=Array.from(raw.matchAll(/\d+(?:\.\d+)?/g),v=>Number(v[0])).slice(0,3);
    if(channels.length!==3)throw Error('Invalid CSS color '+raw);
    const [r,g,b]=channels.map(n=>{const v=n/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});
    return .2126*r+.7152*g+.0722*b;
   };
   return pairs.map(({text,surface})=>{
    const a=document.querySelector(text),b=document.querySelector(surface);
    if(!a||!b)throw Error('Missing selector '+text+' '+surface);
    const x=luminance(getComputedStyle(a).color),y=luminance(getComputedStyle(b).backgroundColor);
    return {text,surface,ratio:(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
   });
  },pairs);
  for(const item of values)expect(item.ratio,JSON.stringify(item)).toBeGreaterThanOrEqual(4.5);
 };
 await audit([
  {text:'.worlddecision .worldmeterline>span',surface:'body'},
  {text:'.worlddecision .worldmeterline>strong',surface:'body'},
  {text:'.worlddecisionanalogy p',surface:'.worlddecisionanalogy'},
  {text:'.worlddecisionrecords article p',surface:'.worlddecisionrecords article'},
  {text:'.worlddecisionstages>div.active small',surface:'.worlddecisionstages>div.active'},
  {text:'.worlddecision .nextstepbar>span',surface:'.worlddecision .nextstepbar'},
  {text:'.worlddecision .nextstepbar .primary',surface:'.worlddecision .nextstepbar .primary'}
 ]);
 await expect(decision.getByRole('button',{name:/Evaluate decision/})).toBeDisabled();
 await decision.locator('.worlddecisionoptions button').first().click();
 await expect(decision.getByRole('button',{name:/Evaluate decision/})).toBeEnabled();
 await decision.getByRole('button',{name:/Evaluate decision/}).click();
 await expect(decision.locator('.itracefeedback')).toBeVisible();
 await audit([
  {text:'.worlddecision .itracefeedback strong',surface:'.worlddecision .itracefeedback'},
  {text:'.worlddecision .itracefeedback p',surface:'.worlddecision .itracefeedback'},
  {text:'.worlddecision .nextstepbar>span',surface:'.worlddecision .nextstepbar'}
 ]);
 await expect(decision.getByRole('button',{name:/Continue to next stage/})).toBeVisible();
});
test('Correct and incorrect classification feedback remains readable after answering',async({page,isMobile})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
  localStorage.setItem('amlverse-arcade-risk','100');
 });
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.townstop').first().getByRole('button',{name:/Resume journey/}).click();
 await expect(page.locator('.wcinteractive')).toBeVisible();
 const verify=async(expected:'right'|'wrong')=>{
  const element=page.locator('.wcinteractive .itracefeedback.'+expected);
  await expect(element).toBeVisible();
  return element.evaluate(el=>{
   const luminance=(raw:string)=>{
    const values=Array.from(raw.matchAll(/\d+(?:\.\d+)?/g),x=>Number(x[0])).slice(0,3);
    if(values.length!==3)throw Error('Cannot parse '+raw);
    const [r,g,b]=values.map(v=>{const c=v/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});
    return .2126*r+.7152*g+.0722*b;
   };
   const bg=luminance(getComputedStyle(el).backgroundColor);
   return Array.from(el.querySelectorAll('strong,p')).map(node=>{
    const fg=luminance(getComputedStyle(node).color);
    return (Math.max(bg,fg)+.05)/(Math.min(bg,fg)+.05);
   });
  });
 };
 await page.locator('.wcinteractiveclue').first().click();
 await page.locator('.wcinteractivetargets button').filter({hasText:'Vulnerability'}).click();
 for(const contrast of await verify('wrong'))expect(contrast).toBeGreaterThanOrEqual(4.5);
 await page.locator('.wcinteractivetargets button').filter({hasText:'Threat'}).click();
 for(const contrast of await verify('right'))expect(contrast).toBeGreaterThanOrEqual(4.5);
 await expect(page.locator('.wcinteractivelog')).toContainText('A fraud network attempts to use accounts');
});
test('All interactive evidence challenge panels are legible in classification and timeline cases',async({page,isMobile})=>{
 await page.addInitScript(()=>{
   localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
   localStorage.setItem('amlverse-arcade-risk','100');
 });
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.townstop').first().getByRole('button',{name:/Resume journey/}).click();
 await expect(page.locator('.wcinteractive')).toBeVisible();
 const audit=async (pairs:{fg:string,bg:string}[])=>{
  return page.evaluate((pairs)=>{
   const lum=(value:string)=>{
    const nums=Array.from(value.matchAll(/\d+(?:\.\d+)?/g),m=>Number(m[0])).slice(0,3);
    if(nums.length!==3)throw Error('Unreadable color data: '+value);
    const [r,g,b]=nums.map(c=>{const x=c/255;return x<=.04045?x/12.92:((x+.055)/1.055)**2.4});
    return r*.2126+g*.7152+b*.0722;
   };
   return pairs.map(pair=>{
    const fg=document.querySelector(pair.fg),bg=document.querySelector(pair.bg);
    if(!fg||!bg)throw Error('Missing '+pair.fg+' '+pair.bg);
    const a=lum(getComputedStyle(fg).color),b=lum(getComputedStyle(bg).backgroundColor);
    return {selector:pair.fg,contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),font:parseFloat(getComputedStyle(fg).fontSize)};
   });
  },pairs);
 };
 const standard=await audit([
  {fg:'.wcinteractiveanalogy strong',bg:'.wcinteractiveanalogy'},
  {fg:'.wcinteractiveanalogy p',bg:'.wcinteractiveanalogy'},
  {fg:'.wcinteractiveworkshop h3',bg:'.wcinteractiveworkshop>section'},
  {fg:'.wcinteractiveworkshop>section>p',bg:'.wcinteractiveworkshop>section'},
  {fg:'.wcinteractiveclue>span:last-child',bg:'.wcinteractiveclue'},
  {fg:'.wcinteractivetargets button>strong',bg:'.wcinteractivetargets button'},
  {fg:'.wcinteractivetargets button>small',bg:'.wcinteractivetargets button'},
  {fg:'.wcinteractivelog>strong',bg:'.wcinteractivelog'},
  {fg:'.wcinteractivelog>p',bg:'.wcinteractivelog'},
  {fg:'.wcinteractive .worldmeterline strong',bg:'body'}
 ]);
 for(const result of standard)expect(result.contrast,result.selector).toBeGreaterThanOrEqual(4.5);
 await page.locator('.wcinteractivetabs button').nth(2).click();
 const timeline=await audit([
  {fg:'.wcinteractivetimeline h3',bg:'.wcinteractivetimeline>section'},
  {fg:'.wcinteractivetimeline>section>p',bg:'.wcinteractivetimeline>section'},
  {fg:'.wcinteractivetimelinecards button',bg:'.wcinteractivetimelinecards button'},
  {fg:'.wcinteractivetimelinesteps strong',bg:'.wcinteractivetimelinesteps>div'}
 ]);
 for(const result of timeline)expect(result.contrast,result.selector).toBeGreaterThanOrEqual(4.5);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+4)).toBe(true);
});
test('Crypto tracing practice is interactive, touch-friendly and preserves scored missions',async({page,isMobile})=>{
 await page.addInitScript(()=>{
  const ids=['risk','team','evaluation','egmont','typologies','nigeria','virtualassets'];
  const scores=['amlverse-arcade-risk','amlverse-arcade-team','amlverse-evaluation-arena-best','amlverse-egmont-best','amlverse-typology-best','amlverse-nigeria-compliance-best','amlverse-virtual-asset-best'];
  ids.forEach((id,i)=>{
   localStorage.setItem('amlverse-course-v1-'+id,JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
   localStorage.setItem(scores[i],'100');
   localStorage.setItem('amlverse-world-interactions-v1-'+id,JSON.stringify({completed:[0,1,2],best:100}));
   localStorage.setItem('amlverse-world-decisions-v1-'+id,JSON.stringify({passed:true,best:100}));
  });
  const advanced={visited:Array.from({length:12},(_,i)=>i),quizPass:{Foundations:true,Intermediate:true,Advanced:true},simPass:{Foundations:true,Intermediate:true,Advanced:true}};
  localStorage.setItem('amlverse-risklab-advanced-v1',JSON.stringify(advanced));
  localStorage.setItem('amlverse-nigeria-compliance-advanced-v1',JSON.stringify(advanced));
 });
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 const virtual=page.locator('.townstop').nth(6);
 await virtual.getByRole('button',{name:/Resume journey/}).click();
 await page.getByRole('button',{name:/Open interactive graph missions/}).click();
 const practice=page.locator('.itracepractice');
 await practice.getByRole('button',{name:/Try guided tracing/}).click();
 await expect(practice.getByText(/Step 1 of 3/)).toBeVisible();
 await practice.getByRole('button',{name:'Sample source wallet A'}).click();
 await expect(practice.getByText(/Step 2 of 3/)).toBeVisible();
 await practice.getByRole('button',{name:'Follow sample confirmed transaction TX-01'}).click();
 await expect(practice.getByText(/Step 3 of 3/)).toBeVisible();
 await practice.getByRole('button',{name:'Sample receiving wallet B'}).click();
 await expect(practice.getByText('✓ Practice complete',{exact:true})).toBeVisible();
 await practice.getByRole('button',{name:/Start investigation/}).click();
 await expect(page.locator('.itracegraphpanel')).toBeVisible();
 await expect(page.locator('.itraceevidenceitem').first()).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+4)).toBe(true);
});
test('Arcade clue card descriptions remain readable and clue selections animate',async({page,isMobile})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
 });
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.townstop').first().getByRole('button',{name:/Resume journey/}).click();
 await page.getByRole('button',{name:/③ Play/}).click();
 const clue=page.locator('.miniclue');
 await expect(clue).toBeVisible();
 await clue.click();
 await expect(clue).toHaveClass(/selected/);
 const anim=await clue.evaluate(el=>({name:getComputedStyle(el).animationName,duration:getComputedStyle(el).animationDuration}));
 expect(anim.name).toContain('aml-clue-confirm');
 await page.getByRole('button',{name:/Skip tutorial and play/}).click();
 const cards=page.locator('.arcadecards>.arcadecard');
 await expect(cards.first()).toBeVisible();
 const info=await cards.first().evaluate(el=>{
  const text=el.querySelector('span')!;
  const rgb=(v:string)=>{const parts=Array.from(v.matchAll(/\d+(?:\.\d+)?/g),m=>Number(m[0])).slice(0,3);if(parts.length!==3)throw Error('Invalid color '+v);const [r,g,b]=parts.map(k=>{const a=k/255;return a<=.04045?a/12.92:((a+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};
  const a=rgb(getComputedStyle(text).color),b=rgb(getComputedStyle(el).backgroundColor);
  return {contrast:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),font:parseFloat(getComputedStyle(text).fontSize)};
 });
 expect(info.contrast).toBeGreaterThanOrEqual(4.5);
 expect(info.font).toBeGreaterThanOrEqual(14);
 await cards.first().click();
 await expect(cards.first()).toHaveClass(/selected/);
});
test('RiskLab practice and How to Play tutorial require genuine interaction',async({page,isMobile})=>{
 await page.addInitScript(()=>{
  localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0,1,2],checkPassed:true,checkAttempts:1,lastVisited:''}));
 });
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.townstop').first().getByRole('button',{name:/Resume journey/}).click();
 await page.getByRole('button',{name:/③ Play/}).click();
 await expect(page.getByRole('heading',{name:'Practice a move before your mission'})).toBeVisible();
 const next=page.getByRole('button',{name:'Next: place the card →'});
 await expect(next).toBeDisabled();
 await page.locator('.miniclue').click();
 await expect(next).toBeEnabled();
 await next.click();
 await page.locator('.minidrop').click();
 await page.getByRole('button',{name:'Next: launch mission →'}).click();
 await page.getByRole('button',{name:/Start the game/}).click();
 await page.getByRole('button',{name:/How to play RiskLab Arcade/}).click();
 const guide=page.getByRole('dialog',{name:'How to play RiskLab Arcade'});
 await expect(guide).toBeVisible();
 await expect(guide.getByRole('heading',{name:'Step 1 — Pick a clue'})).toBeVisible();
 await expect(guide.getByRole('button',{name:/Next: match the clue/})).toBeDisabled();
 await guide.getByRole('button',{name:/Unknown company owners/}).click();
 await guide.getByRole('button',{name:/Next: match the clue/}).click();
 await guide.getByRole('button',{name:'Ignore this evidence'}).click();
 await expect(guide.getByText(/Try again/)).toBeVisible();
 await guide.getByRole('button',{name:/Weakness/}).click();
 await expect(guide.getByRole('button',{name:/Next: finish practice/})).toBeEnabled();
 await guide.getByRole('button',{name:/Next: finish practice/}).click();
 await expect(guide.getByText(/PRACTICE COMPLETED/)).toBeVisible();
 await guide.getByRole('button',{name:/Play the game/}).click();
 await expect(guide).toHaveCount(0);
});
test('Achievements, certificates, and expanded progress labels use readable cards',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 const result=await page.evaluate(()=>{
  const color=(value:string)=>{
   const nums=Array.from(value.matchAll(/\d+(?:\.\d+)?/g),m=>Number(m[0])).slice(0,3);
   if(nums.length!==3)throw Error('Unexpected color '+value);
   const [r,g,b]=nums.map(n=>{const c=n/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});
   return .2126*r+.7152*g+.0722*b;
  };
  const check=(fgSelector:string,bgSelector:string)=>{
   const f=document.querySelector(fgSelector),b=document.querySelector(bgSelector);
   if(!f||!b)throw Error('Missing '+fgSelector+' or '+bgSelector);
   const fg=color(getComputedStyle(f).color),bg=color(getComputedStyle(b).backgroundColor);
   return (Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);
  };
  const radius=(selector:string)=>{const el=document.querySelector(selector);if(!el)throw Error('Missing '+selector);return parseFloat(getComputedStyle(el).borderTopLeftRadius)};
  return {
   badgeContrast:check('.achievementprogress','.achievementprogress'),
   achievementTitle:check('.achievement b','.achievement'),
   certificateTitle:check('.certificate-tile h3','.certificate-tile'),
   certificateMeta:check('.certificate-tile small','.certificate-tile'),
   achievementRadius:radius('.achievement'),
   certificateRadius:radius('.certificate-tile'),
   certificateSectionRadius:radius('.certificates')
  };
 });
 expect(result.badgeContrast).toBeGreaterThanOrEqual(4.5);
 expect(result.achievementTitle).toBeGreaterThanOrEqual(4.5);
 expect(result.certificateTitle).toBeGreaterThanOrEqual(4.5);
 expect(result.certificateMeta).toBeGreaterThanOrEqual(4.5);
 expect(result.achievementRadius).toBeGreaterThanOrEqual(14);
 expect(result.certificateRadius).toBeGreaterThanOrEqual(15);
 expect(result.certificateSectionRadius).toBeGreaterThanOrEqual(18);
 await page.locator('.progress31details').first().locator('summary').click();
 await expect(page.locator('.progress31details').first()).toHaveAttribute('open','');
 const rows=page.locator('.progress31details').first().locator('.progress31sections>div');
 await expect(rows.first()).toBeVisible();
 const rowRadius=await rows.first().evaluate(el=>parseFloat(getComputedStyle(el).borderTopLeftRadius));
 expect(rowRadius).toBeGreaterThanOrEqual(11);
});
test('Learning world tracker disclosure is formatted and completion details have contrast',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.locator('.townstop').first().getByRole('button',{name:/Enter district/}).click();
 const drawer=page.locator('.worldprogressdrawer');
 await expect(drawer.locator('summary')).toContainText('World completion tracker');
 await expect(drawer.locator('summary')).toContainText('View progress');
 await drawer.locator('summary').click();
 await expect(drawer).toHaveAttribute('open','');
 const results=await drawer.evaluate(el=>{
  const rgb=(value:string)=>{
   const numbers=Array.from(value.matchAll(/\d+(?:\.\d+)?/g),m=>Number(m[0])).slice(0,3);
   if(numbers.length!==3)throw Error('Invalid color '+value);
   const [r,g,b]=numbers.map(n=>{const c=n/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4});
   return r*.2126+g*.7152+b*.0722;
  };
  const contrast=(text:string,background:string)=>{const a=rgb(text),b=rgb(background);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)};
  const label=el.querySelector('.worldprogresssectionhead strong')!;
  const tile=el.querySelector('.worldprogresssection')!;
  const progress=el.querySelector('.worldmeterline strong')!;
  const panel=el.querySelector('.worldprogresspanel')!;
  return {tileContrast:contrast(getComputedStyle(label).color,getComputedStyle(tile).backgroundColor),
   meterContrast:contrast(getComputedStyle(progress).color,getComputedStyle(panel).backgroundColor),
   tileRadius:parseFloat(getComputedStyle(tile).borderTopLeftRadius),
   drawerRadius:parseFloat(getComputedStyle(el).borderTopLeftRadius)};
 });
 expect(results.tileContrast).toBeGreaterThanOrEqual(4.5);
 expect(results.meterContrast).toBeGreaterThanOrEqual(4.5);
 expect(results.tileRadius).toBeGreaterThanOrEqual(12);
 expect(results.drawerRadius).toBeGreaterThanOrEqual(16);
});
test('My Progress sections use rounded institutional cards on desktop and mobile',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 const cards=page.locator('.progressdash>.progresssection');
 await expect(cards.first()).toBeVisible();
 await expect(page.locator('.progressdash .impactdashboardstats>div')).toHaveCount(3);
 const radii=await page.evaluate(()=>{
  function radius(selector:string){const node=document.querySelector(selector);if(!node)throw new Error('Missing '+selector);return parseFloat(getComputedStyle(node).borderTopLeftRadius)}
  return {section:radius('.progressdash>.progresssection'),impactCard:radius('.progressdash .impactdashboardstats>div'),world:radius('.progressdash .progressworld')};
 });
 expect(radii.section).toBeGreaterThanOrEqual(18);
 expect(radii.impactCard).toBeGreaterThanOrEqual(14);
 expect(radii.world).toBeGreaterThanOrEqual(15);
});
test('Global accessibility fixes keep FATF study, progress chips and impact scores readable',async({page,isMobile})=>{
 const inspect=async (parent:string,pairs:{foreground:string;background:string}[])=>page.evaluate(({parent,pairs})=>{
  function channels(c:string){const values=Array.from(c.matchAll(/\d+(?:\.\d+)?/g),m=>Number(m[0])).slice(0,3);if(values.length!==3)throw Error('Unparseable CSS color '+c);return values.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4})}
  function lum(c:string){const [r,g,b]=channels(c);return .2126*r+.7152*g+.0722*b}
  const root=document.querySelector(parent);
  if(!root)throw Error('Missing section '+parent);
  return pairs.map(pair=>{
   const f=root.querySelector(pair.foreground),b=root.querySelector(pair.background);
   if(!f||!b)throw Error('Missing '+JSON.stringify(pair));
   const fl=lum(getComputedStyle(f).color),bl=lum(getComputedStyle(b).backgroundColor);
   return {foreground:pair.foreground,background:pair.background,ratio:(Math.max(fl,bl)+.05)/(Math.min(fl,bl)+.05),text:getComputedStyle(f).color,bg:getComputedStyle(b).backgroundColor};
  });
 },{parent,pairs});
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await page.getByRole('button',{name:'Open Recommendation 1',exact:true}).click();
 const fatf=await inspect('.fatf40page',[
  {foreground:'.fatf40study>p',background:'.fatf40study'},
  {foreground:'.fatf40why p',background:'.fatf40why'},
  {foreground:'.fatf40studyheading h2',background:'.fatf40study'}
 ]);
 for(const item of fatf)expect(item.ratio,'FATF contrast '+JSON.stringify(item)).toBeGreaterThanOrEqual(4.5);
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:/My Progress/}).first().click();
 const progress=await inspect('.progressdash',[
  {foreground:'.academy31headline strong',background:'.academy31headline'},
  {foreground:'.progressmarks>span',background:'.progressmarks>span'},
  {foreground:'.progress31details summary',background:'.progress31details summary'},
  {foreground:'.impactdashboardstats strong',background:'.impactdashboardstats>div'}
 ]);
 for(const item of progress)expect(item.ratio,'Progress contrast '+JSON.stringify(item)).toBeGreaterThanOrEqual(4.5);
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:/Competency & Impact Lab/}).first().click();
 const impact=await inspect('.impactpage',[
  {foreground:'.impactstatrow strong',background:'.impactstatrow>div'},
  {foreground:'.impactstatrow small',background:'.impactstatrow>div'}
 ]);
 for(const item of impact)expect(item.ratio,'Impact contrast '+JSON.stringify(item)).toBeGreaterThanOrEqual(4.5);
});
test('Institutional theme has legible dark text on white surfaces on desktop and mobile',async({page})=>{
 await page.goto('./');
 const measured=await page.evaluate(()=>{
  function color(selector:string,property:'color'|'backgroundColor'){
   const el=document.querySelector(selector);
   if(!el)throw new Error('Theme element missing: '+selector);
   const raw=getComputedStyle(el)[property];
   const rgb=Array.from(raw.matchAll(/\d+(?:\.\d+)?/g),match=>Number(match[0])).slice(0,3);
   if(rgb.length!==3||rgb.some(x=>!Number.isFinite(x)))throw new Error('Unparseable color '+selector+' '+raw);
   const linear=rgb.map(x=>{const v=x/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});
   return .2126*linear[0]+.7152*linear[1]+.0722*linear[2];
  }
  return {
   body:color('body','backgroundColor'),
   stats:color('.academystat','backgroundColor'),
   heading:color('.academyhero h1','color'),
   statText:color('.academystat strong','color'),
   town:color('.townbuilding','backgroundColor'),
   townText:color('.townbuildingbody h3','color'),
   card:color('.academyworldcard','backgroundColor'),
   cardText:color('.academyworldbody h4','color'),
   side:color('.academynavigation.sidebar','backgroundColor')
  };
 });
 for(const key of ['body','stats','town','card','side'] as const)expect(measured[key],key+' surface').toBeGreaterThan(.82);
 for(const key of ['heading','statText','townText','cardText'] as const)expect(measured[key],key+' text').toBeLessThan(.22);
 await page.getByRole('button',{name:'Launch Capstone Challenge →',exact:true}).click();
 await expect(page.locator('.capstonelockdialog')).toBeVisible();
 const dialog=await page.locator('.capstonelockdialog').evaluate(el=>{
  const styles=getComputedStyle(el);
  return {background:styles.backgroundColor,title:getComputedStyle(el.querySelector('h2')!).color};
 });
 expect(dialog.background).toMatch(/rgb\(255, 255, 255\)/);
 expect(dialog.title).not.toBe(dialog.background);
});
test('Academy Overview and My Progress share a full milestone summary',async({page})=>{
 await page.goto('./');
 await expect(page.getByRole('heading',{name:'Academy overview'})).toBeVisible();
 await expect(page.getByText(/Version 0\.38/)).toBeVisible();
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

test('Legacy manual unlock flags cannot bypass the learning path',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('amlverse-town-unlocked-v1-team','yes'));
 await page.goto('./');
 await expect(page.locator('.townstop').nth(1)).toContainText(/LOCKED/i);
 await expect(page.locator('.townstop').nth(1).getByRole('button',{name:/Unlock/})).toHaveCount(0);
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

test('Course lesson controls progress automatically without manual unlock',async({page})=>{
 await page.goto('./');
 await page.locator('.townstop').first().getByRole('button',{name:/Enter district/}).click();
 await expect(page.locator('.knowledgetabs button').nth(1)).toBeDisabled();
 await page.getByRole('button',{name:/Next lesson/}).click();
 await expect(page.locator('.knowledgetabs button').nth(1)).toBeEnabled();
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
test('FATF 40 provides implementation and analogous learning for unlocked recommendations',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('amlverse-fatf-ch1',JSON.stringify(Object.fromEntries(Array.from({length:23},(_,i)=>[String(i+1),{score:3,total:3}])))));
 await page.goto('./');
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await page.getByRole('button',{name:'Open Recommendation 24',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Understand through an analogy'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Implementation process'})).toBeVisible();
 await expect(page.locator('.fatf40steps button')).toHaveCount(4);
});
test('FATF Recommendation 6 humanitarian safeguards and Recommendation 16 transition notes',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('amlverse-fatf-ch1',JSON.stringify(Object.fromEntries(Array.from({length:15},(_,i)=>[String(i+1),{score:3,total:3}])))));
 await page.goto('./');
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await page.getByRole('button',{name:'Open Recommendation 6',exact:true}).click();
 await expect(page.getByText(/humanitarian exemptions and basic-needs safeguards/i).first()).toBeVisible();
 await page.getByRole('button',{name:/All forty Recommendations/}).click();
 await page.getByRole('button',{name:'Open Recommendation 16',exact:true}).click();
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

test('Mobile keeps lesson navigation and progress drawer after the lesson',async({page,isMobile})=>{
 test.skip(!isMobile,'Mobile only');
 await page.goto('./');
 await page.locator('.townstop').first().getByRole('button',{name:/Enter district/}).click();
 await expect(page.locator('.worldprogressdrawer')).toBeVisible();
 await expect(page.locator('.worldprogressdrawer')).not.toHaveAttribute('open','');
 await expect(page.locator('.knowledgecard')).toBeVisible();
 const after=await page.evaluate(()=>{
  const lesson=document.querySelector('.knowledgecard');
  const drawer=document.querySelector('.worldprogressdrawer');
  return !!lesson&&!!drawer&&!!(lesson.compareDocumentPosition(drawer)&Node.DOCUMENT_POSITION_FOLLOWING);
 });
 expect(after).toBe(true);
 await page.locator('.worldprogressdrawer summary').click();
 await expect(page.getByRole('heading',{name:'World completion tracker'})).toBeVisible();
});
test('Mobile lesson flow reveals the Quick Check only after all three lessons',async({page,isMobile})=>{
 test.skip(!isMobile,'Mobile only');
 await page.goto('./');
 await page.locator('.townstop').first().getByRole('button',{name:/Enter district/}).click();
 await expect(page.getByRole('button',{name:/Quick check/})).toBeDisabled();
 await page.getByRole('button',{name:/Next lesson/}).click();
 await page.getByRole('button',{name:/Next lesson/}).click();
 await page.getByRole('button',{name:/Continue to Quick Check/}).click();
 await expect(page.locator('.knowledgecheck')).toBeVisible();
 await expect(page.getByRole('button',{name:/Quick check/})).toBeEnabled();
});
test('Learning Town is locked by default after the first district',async({page})=>{
 await page.goto('./');
 await expect(page.getByRole('heading',{name:/Follow the pathway, unlock each district/})).toBeVisible();
 await expect(page.locator('.townstop')).toHaveCount(9);
 await expect(page.locator('.townstop').nth(0)).toContainText(/AVAILABLE/i);
 await expect(page.locator('.townstop').nth(1)).toContainText(/LOCKED/i);
 await expect(page.locator('.academyworldcard').nth(1)).toBeDisabled();
 await expect(page.locator('.townstop').nth(1).getByRole('button',{name:/Unlock this course/})).toHaveCount(0);
});
test('Manual course unlock is not available to learners',async({page})=>{
 await page.goto('./');
 await expect(page.getByRole('button',{name:/Unlock all courses/})).toHaveCount(0);
 await expect(page.getByRole('button',{name:/Unlock this course/})).toHaveCount(0);
 await expect(page.locator('.townstop.locked')).toHaveCount(8);
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

test('A previously saved unlock-all flag is ignored in guided mode',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('amlverse-town-open-v1','yes'));
 await page.goto('./');
 await expect(page.locator('.townstop.locked')).toHaveCount(8);
});
test('FATF Quest ignores legacy free-exploration flags',async({page})=>{
 await page.addInitScript(()=>localStorage.setItem('amlverse-fatf-free-v1','yes'));
 await page.goto('./');
 await page.getByRole('button',{name:/FATF Quest/}).first().click();
 await expect(page.locator('.fatf40tile').nth(0)).toBeEnabled();
 await expect(page.locator('.fatf40tile').nth(1)).toBeDisabled();
 await expect(page.getByRole('button',{name:/Unlock FATF course/})).toHaveCount(0);
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

test('Locked Capstone shows a professional progress dialog and guided resume',async({page})=>{
 await page.goto('./');
 await page.getByRole('button',{name:'Launch Capstone Challenge →',exact:true}).click();
 const dialog=page.locator('.capstonelockdialog');
 await expect(dialog).toBeVisible();
 await expect(dialog).toContainText('0 of 9 worlds');
 await expect(dialog).toContainText('9 districts remaining');
 await expect(dialog.getByRole('progressbar',{name:'Completed learning worlds'})).toHaveAttribute('aria-valuenow','0');
 await dialog.getByRole('button',{name:/Continue learning: RiskLab Arcade/}).click();
 await expect(dialog).toHaveCount(0);
 await expect(page.getByRole('heading',{name:/RiskLab Learning Room/})).toBeVisible();
});
test('Capstone dialog closes with Escape without changing the current page',async({page})=>{
 await page.goto('./');
 await page.getByRole('button',{name:'Launch Capstone Challenge →',exact:true}).click();
 await expect(page.locator('.capstonelockdialog')).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.locator('.capstonelockdialog')).toHaveCount(0);
 await expect(page.getByRole('heading',{name:'Academy overview'})).toBeVisible();
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
test('Locked district modal cannot bypass its prerequisite',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Egmont Exchange',exact:true}).first().click();
 const card=page.getByRole('dialog',{name:/Egmont Exchange is locked/});
 await expect(card.getByRole('button',{name:/Unlock/})).toHaveCount(0);
 await expect(card.getByText(/unlocks automatically/)).toBeVisible();
});
test('Locked district message can be dismissed with Escape',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Egmont Exchange',exact:true}).first().click();
 await expect(page.getByRole('dialog',{name:/Egmont Exchange is locked/})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('Professional credentials gallery shows three badges on desktop and mobile',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Project & Research',exact:true}).click();
 const gallery=page.locator('.researchcredentialgrid');
 await expect(gallery.locator('.researchcredential')).toHaveCount(3);
 await expect(gallery.locator('img')).toHaveCount(3);
 await expect(page.getByRole('heading',{name:'TRM Crypto Compliance Specialist'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'Certified Fraud Examiner'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'TRM Advanced Crypto Investigator'})).toBeVisible();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3)).toBe(true);
});
test('Project research shows current academic citation and creator LinkedIn profile',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Project & Research',exact:true}).click();
 const citation=page.locator('.researchcite');
 await expect(citation).toContainText('https://m-analyst.github.io/amlverse-nigeria/');
 await expect(citation).not.toContainText('jctc-ng.github.io');
 const profile=page.getByRole('link',{name:/View Muzammil Adamu on LinkedIn/});
 await expect(profile).toHaveAttribute('href','https://www.linkedin.com/in/muzammil-adamu-cfe-411747172');
 await expect(page.getByRole('link',{name:/View project repository/})).toHaveAttribute('href','https://github.com/m-analyst/amlverse-nigeria');
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
 await expect(page.locator('.researchengageactions a')).toHaveCount(3);
 if(isMobile)expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3)).toBe(true);
});
test('Project page offers copyable professional citation and returns to the learning town',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Project & Research',exact:true}).click();
 await expect(page.getByText(/Adamu, M. \(2026\)/)).toBeVisible();
 await page.getByRole('button',{name:/Academy overview/}).click();
 await expect(page.getByRole('heading',{name:'Academy overview'})).toBeVisible();
});

test('Competency Lab baseline assesses twelve decisions and stores a private result',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Competency & Impact Lab',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Competency & Learning Impact Lab'})).toBeVisible();
 await expect(page.getByRole('button',{name:/Complete baseline first/})).toBeDisabled();
 await page.getByRole('button',{name:/Start baseline/}).click();
 await expect(page.getByText('Question 1 of 12')).toBeVisible();
 await expect(page.getByText(/Best response/)).toHaveCount(0);
 for(let i=0;i<12;i++){
  await page.locator('.impactoptions button').first().click();
  await page.getByRole('radio',{name:'Low'}).check();
  await page.getByRole('button',{name:i===11?/Submit completed assessment/:/Save decision & continue/}).click();
 }
 await expect(page.getByText(/Baseline recorded/)).toBeVisible();
 await expect(page.getByRole('button',{name:'Baseline saved'})).toBeDisabled();
 const result=await page.evaluate(()=>JSON.parse(localStorage.getItem('amlverse-competency-impact-v1')||'{}'));
 expect(result.baseline.answers).toHaveLength(12);
 expect(result.baseline.correct).toBeGreaterThanOrEqual(0);
 expect(result.baseline.correct).toBeLessThanOrEqual(12);
 expect(result.followup).toBeUndefined();
});
test('Competency Lab compares twelve different follow-up items, exposes rubric and downloads anonymous reports',async({page,isMobile})=>{
 await page.goto('./');
 await page.evaluate(()=>{
  const domains=['risk','ownership','evidence','cooperation','virtualassets','reporting'];
  const baselineAnswers=domains.flatMap(id=>[1,2].map(i=>({itemId:id+'-b'+i,selected:0,confidence:2})));
  const baseline={phase:'baseline',completedAt:'2026-11-01T12:00:00.000Z',answers:baselineAnswers,overall:33,correct:4,domainScores:Object.fromEntries(domains.map(id=>[id,50])),learningMilestones:1,learningMilestoneTotal:153};
  localStorage.setItem('amlverse-competency-impact-v1',JSON.stringify({version:'impact-paired-v1',baseline}));
 });
 await page.reload();
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Competency & Impact Lab',exact:true}).click();
 await page.getByRole('button',{name:/Start follow-up/}).click();
 for(let i=0;i<12;i++){
  await page.locator('.impactoptions button').first().click();
  await page.getByRole('radio',{name:'High'}).check();
  await page.getByRole('button',{name:i===11?/Submit completed assessment/:/Save decision & continue/}).click();
 }
 await expect(page.getByRole('heading',{name:'Six-domain learning profile'})).toBeVisible();
 await expect(page.locator('.impactdomains article')).toHaveCount(6);
 await expect(page.getByText(/not proof.*caused|does not establish/i).first()).toBeVisible();
 await page.getByRole('button',{name:/Review answers and rationale/}).click();
 await expect(page.getByText(/Best response:/).first()).toBeVisible();
 const [json]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:/Download methodology JSON/}).click()]);
 const jsonText=await readFile((await json.path())!,'utf8');
 const report=JSON.parse(jsonText);
 expect(report.report_type).toContain('formative');
 expect(report.domains).toHaveLength(6);
 expect(report.overall.baseline_percentage).toBe(33);
 expect(report.overall.followup_percentage).toEqual(expect.any(Number));
 expect(JSON.stringify(report)).not.toContain('example.com');
 const [csv]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:/Download summary CSV/}).click()]);
 const csvText=await readFile((await csv.path())!,'utf8');
 expect(csvText).toContain('Change in percentage points');
 expect(csvText).toContain('Risk-based assessment');
 if(isMobile)expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+3)).toBe(true);
});
test('Evaluation reset confirmation is accessible and preserves results on cancellation',async({page,isMobile})=>{
 await page.goto('./');
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Competency & Impact Lab',exact:true}).click();
 await page.getByRole('button',{name:/Reset evaluation/}).click();
 const confirmation=page.locator('.impactpage .townresetconfirm');
 await expect(confirmation.getByRole('heading',{name:'Confirm evaluation reset'})).toBeVisible();
 const colors=await confirmation.evaluate(el=>{
  const luminance=(css:string)=>{
   const rgb=Array.from(css.matchAll(/\d+(?:\.\d+)?/g),m=>Number(m[0])).slice(0,3);
   if(rgb.length!==3)throw new Error('Unable to read '+css);
   const [r,g,b]=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});
   return .2126*r+.7152*g+.0722*b;
  };
  function contrast(fg:Element,bg:Element){
   const a=luminance(getComputedStyle(fg).color),b=luminance(getComputedStyle(bg).backgroundColor);
   return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
  }
  const title=el.querySelector('h3')!,instruction=el.querySelector('label')!,input=el.querySelector('input')!;
  const reset=el.querySelector('.townresetdanger')!,cancel=el.querySelector('.secondary')!;
  return {
   title:contrast(title,el),
   instruction:contrast(instruction,el),
   input:contrast(input,input),
   disabled:contrast(reset,reset),
   cancel:contrast(cancel,cancel),
   radius:parseFloat(getComputedStyle(el).borderTopLeftRadius)
  };
 });
 for(const key of ['title','instruction','input','disabled','cancel'] as const)expect(colors[key],key).toBeGreaterThanOrEqual(4.5);
 expect(colors.radius).toBeGreaterThanOrEqual(14);
 const deleteButton=confirmation.getByRole('button',{name:'Delete evaluation results'});
 await expect(deleteButton).toBeDisabled();
 await confirmation.getByRole('button',{name:'Keep my results'}).click();
 await expect(confirmation).toHaveCount(0);
 await page.getByRole('button',{name:/Reset evaluation/}).click();
 await page.getByLabel(/Type RESET/).fill('RESET');
 await expect(deleteButton).toBeEnabled();
});
test('Competency evaluation reset requires typed confirmation and preserves unrelated academy results',async({page,isMobile})=>{
 await page.goto('./');
 await page.evaluate(()=>{
  const domains=['risk','ownership','evidence','cooperation','virtualassets','reporting'];
  const answers=domains.flatMap(id=>[1,2].map(i=>({itemId:id+'-b'+i,selected:0,confidence:2})));
  const baseline={phase:'baseline',completedAt:'2026-11-01T12:00:00.000Z',answers,overall:33,correct:4,domainScores:Object.fromEntries(domains.map(id=>[id,50])),learningMilestones:1,learningMilestoneTotal:153};
  localStorage.setItem('amlverse-competency-impact-v1',JSON.stringify({version:'impact-paired-v1',baseline}));
  localStorage.setItem('amlverse-course-v1-risk',JSON.stringify({lessons:[0],checkPassed:false,checkAttempts:0,lastVisited:''}));
 });
 await page.reload();
 if(isMobile)await page.getByRole('button',{name:/Explore academy/}).click();
 await page.getByRole('button',{name:'Competency & Impact Lab',exact:true}).click();
 await page.getByRole('button',{name:/Reset evaluation/}).click();
 await expect(page.getByRole('button',{name:'Delete evaluation results'})).toBeDisabled();
 await page.getByLabel(/Type RESET/).fill('RESET');
 await page.getByRole('button',{name:'Delete evaluation results'}).click();
 expect(await page.evaluate(()=>localStorage.getItem('amlverse-competency-impact-v1'))).toBeNull();
 expect(await page.evaluate(()=>localStorage.getItem('amlverse-course-v1-risk'))).not.toBeNull();
 await expect(page.getByRole('button',{name:/Start baseline/})).toBeEnabled();
});
