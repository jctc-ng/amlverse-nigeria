import {getLearningSequence,readLearningPath,modules,readScore} from './progress';
import {osintComplete} from './OsintSimulationLab';
import type {CourseKey} from './progress';
import {readWorldSections} from './WorldProgressOverview';

const OPEN_ALL='amlverse-town-open-v1';
const OPEN_WORLD='amlverse-town-unlocked-v1-';
export const learningPathOrder=['classic','hands','decision','expanded','trace'] as const;
export function allCoursesUnlocked(){return false}
export function setAllCoursesUnlocked(value:boolean){try{if(value)localStorage.setItem(OPEN_ALL,'yes');else localStorage.removeItem(OPEN_ALL)}catch{}}
export function isCourseUnlocked(_id:CourseKey){return false}
export function setCourseUnlocked(id:CourseKey,value:boolean){try{if(value)localStorage.setItem(OPEN_WORLD+id,'yes');else localStorage.removeItem(OPEN_WORLD+id)}catch{}}
export function worldMilestones(id:CourseKey){const parts=readWorldSections(id);return {parts,done:parts.reduce((n,s)=>n+s.done,0),total:parts.reduce((n,s)=>n+s.total,0)}}
export function worldAccessible(id:CourseKey){
 if(isCourseUnlocked(id))return true;
 const sequence=getLearningSequence();
 const index=sequence.indexOf(id);
 if(index<=0)return readLearningPath()!=='osint'||osintComplete();
 const previous=worldMilestones(sequence[index-1]);
 return previous.done===previous.total;
}
export function sectionAccessible(game:CourseKey,section:string){
 if(isCourseUnlocked(game))return true;
 if(!worldAccessible(game))return false;
 const parts=worldMilestones(game).parts;
 const currentIndex=learningPathOrder.indexOf(section as typeof learningPathOrder[number]);
 if(currentIndex<0)return false;
 for(let i=0;i<currentIndex;i++){
  const prerequisite=parts.find(p=>p.id===learningPathOrder[i]);
  if(prerequisite&&prerequisite.done<prerequisite.total)return false;
 }
 return !!parts.find(p=>p.id===section);
}
export function sectionUnlockReason(game:CourseKey,section:string){
 if(!worldAccessible(game)){const sequence=getLearningSequence();const i=sequence.indexOf(game);return i===0&&readLearningPath()==='osint'?'Complete the six practical OSINT missions first.':'Complete '+(modules.find(m=>m.id===sequence[i-1])?.title||'the previous world')+' to unlock this town.'}
 const parts=worldMilestones(game).parts;
 const index=learningPathOrder.indexOf(section as typeof learningPathOrder[number]);
 for(let i=0;i<index;i++){const step=parts.find(p=>p.id===learningPathOrder[i]);if(step&&step.done<step.total)return 'Complete '+step.name+' ('+step.done+'/'+step.total+') first.'}
 return '';
}
/** Remove only this world's learning results, not FATF, Capstone or progress in other worlds. */
export function resetCourseProgress(game:CourseKey){
 const score=modules.find(m=>m.id===game)?.scoreKey;
 const specific=[
 'amlverse-course-v1-'+game,
 'amlverse-world-champion-v1-'+game,
 'amlverse-world-interactions-v1-'+game,
 'amlverse-world-decisions-v1-'+game,
 'amlverse-guide-v1-'+game,
 ];
 if(score)specific.push(score);
 if(game==='risk')specific.push('amlverse-risklab-advanced-v1');
 if(game==='nigeria')specific.push('amlverse-nigeria-compliance-advanced-v1');
 if(game==='virtualassets')specific.push('amlverse-virtual-asset-advanced-v1','amlverse-interactive-tracing-v1');
 for(const key of specific){try{localStorage.removeItem(key)}catch{}}
 // Legacy tutorial achievements use an independent map. Clear only the matching world key.
 try{const old=localStorage.getItem('amlverse-v1');if(old){const parsed=JSON.parse(old) as Record<string,unknown>;if(Object.prototype.hasOwnProperty.call(parsed,game)){delete parsed[game];localStorage.setItem('amlverse-v1',JSON.stringify(parsed))}}}catch{}
}
