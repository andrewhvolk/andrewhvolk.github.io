export type Outcome='correct'|'accent-or-orthography'|'incorrect'|'self-assessed';
export type ReviewStatus='draft'|'reviewed'|'needs-review';
export interface Objective {id:string;chapterId:string;title:string;skillType:string;prerequisites:string[];productionRequired:boolean;sourceRefs:string[]}
export interface Exercise {id:string;version:1;chapterId:string;objectiveIds:string[];kind:string;prompt:string;acceptedAnswers:string[];feedback:string;context:string;production:boolean;assessmentMode:'auto'|'self';reviewStatus:ReviewStatus;stimulusId?:string;verbEvidence?:{verb:string;tense:string;person:string;polarity?:string}}
export interface Schedule {box:number;reviews:number;correct:number;lastReview:number;due:number}
export interface Attempt {id:string;sessionId:string;exerciseId:string;objectiveIds:string[];answer:string;outcome:Outcome;timestamp:number;usedHint:boolean;revealed:boolean;retry:boolean;practiceOnly:boolean;diagnostic:boolean;production:boolean}
export interface Session {id:string;profileId:string;createdAt:number;queue:object[];cursor:number;committed:string[];drafts:Record<number,object>;completedAt:number|null;guided?:boolean;warmup?:boolean;policyVersion?:1;focusObjectiveId?:string}
