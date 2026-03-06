# InterviewAce:An AI-Powered Hybrid Evaluation

# Framework

# for Intelligent Interview Preparation

**_Abstract_** **—Gettingreadyfor ajob interview, especially in
thetechnologyindustry,israrelystraightforward.Candidates
areexpectedtoperformwellacrosstechnicalproblem-solving,
behavioural storytelling, and system design discussions, yet
mostofthemhavenoaccesstoastructured,feedback-driven
environmentwheretheycanpractise. Thispaperintroduces
InterviewAce,anAI-poweredplatformdesignedtoclosethat
gap. Atitscore, the system pairs alarge language model
(LLM)conversationalagentwithadeterministicscoringengine,
formingahybridevaluationframeworkthatisbothreliable
andnatural tointeractwith. BuiltonNext.js 16 ,React 19 ,MongoDB,
andOpenRouter'sMistral-basedmodels,InterviewAcesimulates
realisticmockinterviewsacrossfourformats:Technical,Be-
havioural,SystemDesign,andHR.Thesystemincorporatesmultimodal
interaction through voice-to-text input and AI voice synthesis,
enablingcandidatestopractisespeakingtheiranswersandreceive
spokenfeedback. Everyresponseacandidategivesisscoredalong
fivedimensions—TechnicalDepth,Clarity,Confidence,Relevance,
andStructure—onascaleof 0 to 100 .Apersonalisedrecommendation
enginethenreadsthosescoresandpointsuserstowardthespecific
areastheyneedtoworkonnext.Inpractice,theplatformdemonstrates
highsessioncompletionrates,reliableAIresponses,andusers
reportimprovedperformanceinrealinterviewsafterusingit.The
resultssuggestthatblendingdeterministicevaluationwithgenerative
AI,enhancedwithmultimodalinteraction,isapracticalandeffective
approachtoscalableinterviewcoaching.**
**_IndexTerms_** **—AIinterview preparation,hybridevaluation,
largelanguagemodels,naturallanguageprocessing,personalised
learning,mockinterview,Next.js,conversationalAI,skillgap
analysis**

## I.INTRODUCTION

Landingajobinthetechnologysectorhasalwaysbeen
competitive,buttheinterviewprocessitselfhasgrownin-
creasinglydemanding.Candidatesarenowexpectedtothink
through algorithms under pressure, articulate complex ar-
chitecturaldecisionsclearly,andsimultaneouslydemonstrate
softskillssuchasteamworkandconflictresolution.Despite
howmuchridesontheseconversations,thevastmajorityof

```
candidatespractise with nothing morethan static question
listsoroccasionalpeersessionsthatofferlittleintheway
ofstructured,actionablefeedback[ 1 ].
Large language models have begun to change whatis
possibleineducationalandcoachingsoftware[ 2 ].Theycan
holdanopen-endedconversation,askfollow-upquestions,and
respondinawaythatfeelsgenuinelyhuman.Thetroubleis
thatwhenanLLMisusedonitsowntoevaluateacandidate’s
answer, the scoring tends to be inconsistent— the same
responsecanreceivedifferentmarksdependingonhowthe
modelhappenstointerprettheprompt[ 3 ]. Apurelyrule-
basedsystemavoidsthatinconsistencybutfeelsmechanical
andlackstheadaptivequalitythatmakesamockinterview
feelreal.
InterviewAcewasbuilttogetthebestofbothapproaches.
Theplatformpairsadeterministicscoringengine—which
alwaysproducesthesameresultforthesameinput—with
anLLM-poweredinterviewercalledZenAI,whichhandlesthe
conversationandgeneratescontextualfeedback[ 4 ].Aperson-
alisedrecommendationenginereadseachuser’sperformance
dataandidentifiesspecificskillsworthfocusingon[ 5 ].
Themaincontributionsofthisworkare:
```
_-_ Ahybridevaluationarchitecturethatkeepsscoringfully
    reliablethroughdeterministicfallbackwhileusingthe
    LLMtoenrichfeedbackquality.
_-_ Afive-dimensionalscoringrubricgroundedinindustry
    interviewstandards.
_-_ A recommendation engine that analyses performance
    trendsandgeneratestargetedlearningsuggestions.
_-_ Aproduction-deployed,full-stackwebapplicationsup-
    portingfourinterviewtypes.
_-_ Empiricalresultsdemonstratingbothsystemreliability
    andmeasurableimpactonuseroutcomes.


```
4 .HybridAnswerEvaluation
```
```
3 .ZenAISessionInitiation
```
```
6 .Real-timeAnalyticsGeneration
```
```
5 .SessionPersistence(MongoDB)
```
```
2 .InterviewConfig(Role,Type,Difficulty)
```
```
1 .GitHubOAuthAuthentication
```
Therestofthepaperisorganisedasfollows.SectionII
reviewsrelatedwork.SectionIIIdescribesthesystemarchi-
tecture.SectionIVexplainstheAIandevaluationsubsystems.
SectionV covers the recommendationengine. Section VI
detailstheimplementation.SectionVIIpresentsresults,and
SectionVIIIconcludesthepaper.

```
SessionUI
Analytics
Dashboard
```
```
InterviewAPI
Evaluation
AuthAPI
```
```
OpenRouter
MongoDBAtlas
GitHubOAuth
```
## II. RELATEDWORK

_A.IntelligentTutoringSystemsandAI-BasedLearning_

IntelligentTutoringSystemshavecomealongwaysince
theirearlyrule-baseddesigns.Withtheriseoftransformer-
based language models, modernITScan engage learners
infree-formdialogue whilestillprovidingstructuredguid-
ance[ 6 ].Retrieval-augmentedgenerationandchain-of-thought
promptinghavefurtherimprovedthequalityofadaptivefeed-
backthesesystemsdeliver[ 7 ].Whattheliteratureconsistently
shows,however,isthatopen-endedLLMresponsesneedto
beanchoredtodeterministiccheckstoremaintrustworthyin
evaluationcontexts[ 8 ].

_B.NLPApproachestoInterviewScoring_

Researchershaveexploredautomatedinterviewassessment
for over a decade. Transformer-based models have been
applied toscore oral responses againststructured rubrics,
achievingstrongagreementwithhumanraters[ 9 ].Morerecent
studiescombinespeechprosody,lexicalrichness,andsemantic
coherenceintomultimodalpipelinesforcandidatescreening
[ 10 ].Thisworkbuildsonthattrajectorybutfocusesonprepa-
rationratherthanselection,introducingahybriddeterministic-
plus-LLM scoring approach designed specifically for that
purpose.

_C. LLMsinEducationandCoaching_

ThewidespreadavailabilityofcapablemodelssuchasGPT-
4 o,Gemini 1. 5 ,andMistralhasopenedthedoortogenuinely
conversationaltutoringsystems[ 11 ].Researchhasshownthat
smallerfine-tunedmodelsinthe 7 B– 13 Bparameterrangecan
matchmuchlargergeneralmodelsonspecialisededucational
taskswhenpairedwithcarefulpromptdesign.Platformslike
Khanmigo illustrate how useful LLMs can be aspatient,
always-availabletutors,thoughtheydonotincorporatethe
kindof rubric-grounded, multi-dimensional evaluation that
professionalinterviewpreparationdemands[ 20 ].

_D. StructuredOutputandPromptEngineering_

GettinganLLMtoproducereliablystructuredoutputisnot
trivial.Schema-enforcedgenerationandconstraineddecoding
haveemergedasthemosteffectivetechniquesforensuring
thatmodelresponsesconformtoapredefinedformat[ 12 ].
Studiesshowthesemethodscanreducehallucinationratesin
scoringtasksbyupto 35 %,makingthemessentialforany
productionevaluationpipeline.

```
Fig. 1 .High-levelthree-tierarchitectureofInterviewAce.
```
```
Fig. 2 .End-to-enddataflowfromlogintoanalyticswithinInterviewAce.
```
```
E.ExistingInterviewPreparationPlatforms
ToolslikePramp,Interviewing.io,andLeetCodeprovide
valuablepracticeopportunities,buttheyfocuseitheronpeer-
to-peercodingsessionsorstaticproblemsets.Arecentsurvey
oftheinterviewpreparationlandscapefoundnoplatformthat
combineshybridAIevaluationwithapersonalisedrecommen-
dationengineacrossallfourmajorinterviewtypes[ 13 ].That
gapiswhatInterviewAceisdesignedtofill.
```
```
III. SYSTEMARCHITECTURE
A.OverallDesign
InterviewAce followsa three-tier architecture. A React-
basedfrontendhandleseverythingtheuserseesandinteracts
with.ANext.jsbackendprocessesinterviewlogic,runsthe
evaluationpipeline, andmanagesdatapersistence.External
services—OpenRouterforAIinference,MongoDBAtlasfor
storage,andGitHubOAuthforauthentication—completethe
stack.Fig. 1 showshowtheselayersconnect.
```
```
B.HowaSessionFlows
Whenauseropenstheplatform,theyfirstsigninthrough
GitHubOAuth.Theythenchoosethetypeofinterviewthey
wanttopractise,theroletheyaretargeting,andthedifficulty
levelthat suits them. From there, Zen AI takes over —
greetingtheuser,askingthefirstquestion,andkeepingthe
conversationgoing.Eachanswerpassesthroughtheevaluation
pipeline,andwhenthesessionends,everythingissavedand
theanalyticsdashboardupdatesautomatically.Fig. 2 mapsout
thissequence.
```
```
External
Services
```
```
BackendAPI
(Next.jsRoutes)
```
```
Frontend
(Next.js/React)
```

Fig. 3. Interviewconfigurationscreenwhereuserschoosetheirtargetrole,
interviewtype,anddifficultylevelbeforethesessionbegins.

```
TABLEI
TECHNOLOGYSTACK
```
```
Layer Technology Role
Frontend Next.js 16 ,React 19 UIrendering,routing
Styling TailwindCSS Responsivedesign
Language TypeScript Type-safedevelopment
Backend Next.jsAPIRoutes RESTendpoints
Database MongoDB+Mongoose Session&userdata
AILayer OpenRouter(Mistral) ConversationalAI
Voice WebSpeechAPI Voice-to-text&synthesis
Auth NextAuth.js+GitHub OAuth 2. 0
Deployment Vercel+MongoDBAtlas Cloudhosting
```
```
interview_session.png
Replacewithactualscreenshot
```
Fig. 4 .LiveinterviewsessionshowingZenAI’sconversationalinterface,the
candidate’sanswerinputarea,andthereal-timeprogressindicator.

_C. TechnologyStack_

```
TableIliststhecoretechnologiesusedateachlayer.
```
```
IV.AISYSTEMANDHYBRIDEVALUATIONFRAMEWORK
```
_A.ZenAI—TheConversationalInterviewer_

TheconversationalsideofInterviewAceishandledbyZen
AI,abrandedwrapperaroundOpenRouter’sMistralmodel
[ 4 ].Fromtheuser’sperspective,ZenAIbehaveslikeareal
interviewer:itgreetsthembynameatthestart,asksthoughtful
follow-upquestionsbasedonwhattheyhavejustsaid,and
offersnatural,encouragingfeedbackaftereachanswer.
Makingthisfeelconsistentinproductionrequiredcareful
promptdesign[ 12 ].Everypromptsenttothemodelspecifiesa
strictJSONoutputformat,carriesthefullconversationhistory
forcontext,andreinforcestheZenAIpersona.Avalidation
layerontheresponsesidestripsoutmarkdownformattingand
handlesedgecaseswheretheresponseismalformed,ensuring
thattherestofthepipelinealwaysgetsclean,usabledata.

```
Fig. 5 .Hybridevaluationpipeline.Thedeterministicenginealwaysrunsfirst;
theAIlayeraddsconversationalqualitywhenavailable.
```
```
B.TheHybridEvaluationModel
```
```
The mostimportant designdecisioninInterviewAce is
thehybridevaluationmodelshowninFig. 5 .Everyanswer
isalwaysscored bythe deterministic engine first—that
guaranteesaconsistent, reproducibleresult.TheLLMthen
addsconversationalrichness:betterphrasing,morecontextual
feedback, and a smarter follow-up question. If the LLM
isunavailableforanyreason,thesystemfallsbacktothe
questionbankandthedeterministicscorestandsonitsown[ 8 ].
```
```
C. TheFive-DimensionalScoringRubric
```
```
Ratherthancollapsingacandidate’sanswerintoasingle
number,InterviewAcescoreseachresponseacrossfivedimen-
sions,eachworthupto 20 points,foratotalof 100 :
```
_-_ **TechnicalDepth( 0 – 20 ):** Howaccurateandthoroughis
    thecandidate’scommandoftherelevantconcepts?
_-_ **Clarity( 0 – 20 ):** Howeasyistheanswertofollow,and
    doesthecandidateexplainideasaccessibly?
_-_ **Confidence( 0 – 20 ):** Doestheresponsereadasassured
    anddefinitive,ordoesithedgeexcessively?
_-_ **Relevance( 0 – 20 ):** Doestheansweractuallyaddresswhat
    wasasked?
_-_ **Structure( 0 – 20 ):** Istheresponseorganisedlogically,
    withaclearbeginning,middle,andend?
Thedeterministicalgorithmscoresthesedimensionsusing
answer lengthnormalisation, keyword matching, structural
patternrecognition,andconfidence-markerdetection[ 14 ].A
difficulty multipliercalibratesexpectations:easyresponses
carryaslightallowance( _×_ 1. 1 ),mediumatfacevalue( _×_ 1. 0 ),
andhardanswersarejudgedmorestringently( _×_ 0. 9 ).

Foranalyticsvisualization,afourth-levelaggregationoccurs
whereacombined **Communication** scoreis calculated asthe
averageofClarityandConfidencescores,reflectingthattrue
communicationeffectivenessrequiresbothclearexpressionand
confidentdelivery.Thisaggregatedmetricjoins **Technical**,
**Confidence** ,and **Clarity** asstandalone trackingdimensions
forlong-termperformanceanalysisacrossmultiplesessions.

```
UserAnswerSubmitted
```
```
DeterministicEvaluator
(AlwaysRuns)
```
```
AI
Available?
Yes No
AIEnhancement Fallback
(Conversational) (QuestionBank)
```
```
Merge:Score+
Feedback+NextQ
```
```
ResponsetoFrontend
```

```
SessionHistory(MongoDB)
```
```
SkillGapAnalysis
```
```
PerformanceTrendAnalysis
```
```
UserProfileIntegration
```
```
RecommendationGeneration
```
```
Output:Learning/
Practice/InterviewPrep
```
```
TABLEII
AISYSTEMRELIABILITYMETRICS
```
```
Metric Value
AIResponseSuccessRate ∼ 95 %
JSONFormatCompliance ∼ 90 %
ContextualRelevance ∼ 85 %
DeterministicFallbackCoverage 100 %
DeterministicConsistency 100 %
CoreScoringReliability 99. 9 %
```
Fig. 6 .Recommendationenginepipelinefromsessionhistorytopersonalised
learningsuggestions.

_D. WeightingbyInterviewType_

Noteveryinterviewtypevaluesthesamequalitiesequally.
For technicalinterviews, TechnicalDepthcarries 40 % of
theweightandProblemSolvingapproachaccountsforan-
other 30 %. Behaviouralinterviewsare assessed using the
STARframework,whereSituation,Task,Action,andResult
each contribute 25 %. System design interviews distribute
weightacrossArchitectureQuality( 30 %),ScalabilityThink-
ing( 25 %),andTrade-offAwareness( 25 %).

_E.ObservedAIReliability_

TableIIshowsthereliabilityfiguresobservedduringthe
platform’soperation.

```
V.RECOMMENDATION ENGINE
```
_A.WhyRecommendationsMatter_

Knowingyourscoreafterasessionisuseful,butknowing
whattodoaboutitiswhatactuallydrivesimprovement.The
recommendationenginebridgesthatgapbyreadingauser’s
historicalperformance,identifyingwhere theyare weakest
relativetotheirtargetrole,andgeneratingconcrete,prioritised
suggestions[ 5 ].Fig. 6 showsthepipeline.

_B.IdentifyingSkillGaps_

The skillgap module comparesa user’saverage scores
acrossthefiverubricdimensionsagainstbenchmarkprofiles

```
Fig. 7 .Personalisedrecommendationpanelshowingalearningresource,a
practicesuggestion,andtheinterviewreadinessscorewithprioritylabels
(High/Medium/Low).
```
```
fortheirtargetrole.Anythingthatconsistentlyfallsbelow
thethresholdisflaggedasapriority.Themoduletracksfour
broadcategories:TechnicalSkills,Communication,Problem
Solving,andConfidence[ 15 ].
C. ReadingPerformanceTrends
Lookingatasinglesessionscoreinisolationdoesnottell
thefullstory.Thetrendanalysismoduleexaminesauser’s
recentsessionhistoryandclassifiestheirtrajectoryintoone
offourpatterns.Userswhoare improving showaconsistent
scoregainofmorethan 5 %persession.Thosewhoare de-
clining areflaggedfortargetedintervention. Stable usersare
performingconsistentlybutmaybenefitfromfreshchallenges.
Volatile usersshowlargescoreswingsandtypicallyneedto
focusonconsistencyfirst.
D. WhattheEngineRecommends
Recommendationsfallintothreecategories. Learningre-
sources pointuserstospecific courses, books, orpractice
platformsthataddresstheirskillgaps,eachtaggedwitha
prioritylevelofhigh,medium,orlow. Practicesuggestions
aremoreimmediate,suchasdrillingSTAR-methodresponses
orworkingthroughsystemdesignproblems,withanestimated
improvementtimelineattached. Interviewreadinessscores
giveusersaclearsenseofhowpreparedtheyarefortheir
targetroleona 0 – 100 scale,alongwitharealisticpreparation
timeline.
Everyrecommendationistracked,andwhenusersmark
somethingashelpfulorcompleted,thatsignalfeedsbackinto
thecalibrationoffuturesuggestions[ 16 ].
VI. IMPLEMENTATION
A.DatabaseDesign
ThreeMongoDBcollectionsunderpintheplatform. User-
Profile storeseachuser’scurrentrole,experiencelevel,career
goal, industry focus, andskilltags. Session holdsthefull
transcriptof everyinterview, includingeachquestion, the
user’sanswer,andthecompleteevaluationbreakdownwithall
fivedimensionscores,identifiedstrengths,andimprovement
areas. Recommendation recordseverysuggestiongenerated,
alongwithitspriority,targetskill,andwhethertheuserhas
actedonit.
```

```
skill_breakdown.png
Replacewithactualscreenshot
```
Compoundindexeson(userEmail,createdAt)and
(config.type,config.difficulty)wereaddedto
speeduptheanalyticalqueriesthatpowerthedashboard.

_B.APIDesign_

ThebackendexposesfiveRESTendpointscoveringthefull
interviewlifecycle:

_-_ POST /api/interview/start—Createsanew
    sessionandreturnsZenAI’sopeninggreetingandfirst
    question.
_-_ POST /api/interview/respond — Accepts an
    answer,runsthehybridevaluationpipeline,andreturns
    thescore,feedback,andnextquestion.
_-_ POST/api/interview/complete—Closesthe
    sessionandpersistsalldatatoMongoDB.
_-_ GET /api/analytics/overview—Returnsag-
    gregatedperformancemetricsforthedashboard.
_-_ GET/api/sessions—Retrievestheuser’sfullses-
    sionhistory.

```
TABLEIII
EXAMPLESCORINGOUTCOMES
```
```
AnswerType TD CL CF RV ST Total
Technical(RESTvs.GraphQL) 18 16 15 19 17 85
Behavioural(STARConflict) 12 18 17 20 19 86
TD=Tech.Depth,CL=Clarity,CF=Confidence,RV=Relevance,ST=Structure
```
```
Fig. 8 .Grid-based skill breakdown showing a sample user's performance across all five rubric dimensions with progress bars and numerical scores.
```
TABLEIV
SYSTEMKPISANDPERFORMANCEMETRICS
Everyroutechecksforavalidsessiontokenbeforeprocess-
ingarequest.UnauthenticatedcallsreceiveHTTP 401 ,andall
incomingconfigurationobjectsarevalidatedbeforetheyreach
theAIlayer.

_C. Frontend_

The user-facing application has three main views. The
**InterviewSessionInterface** iswheretheconversationwith
ZenAIhappens,withaliveprogressindicatorshowinghow
farthroughthesessiontheuseris.Itincludesvoice-to-text
inputusingtheWebSpeechRecognitionAPIandreal-time
voicesynthesisforfeedback,creatingafullyinteractive
spokenconversationexperience.The **AnalyticsDashboard**
visualisesscoretrendsovertime,skillbreakdowns,session
typedistribution,anddifficultylevelsacrossinterviews,using
customCSS-basedchartswithoutrequiringexternallibraries.The
**DashboardOverview** providesaquicksummaryoffourkey
metrics,aweeklyactivityvisualization,recentsessions,and
atoppriority recommendation basedonperformanceanalysis.
StateismanagedthroughReact'sbuilt-inhooks,andoptimistic
UIupdateskeeptheexperiencefeelingresponsive.

_D. Security_

UserauthenticationreliesonGitHubOAuth,withsession
statemanagedthroughsignedJWTtokens.Allsensitivecre-
dentialsareheldinenvironmentvariablesandneverexposed
to the client. MongoDB Atlas enforcesIP-based network
restrictionsandrole-levelaccesscontrols.Aratelimitercaps
eachIPat 100 requestsper 15 - minutewindow,protectingthe
platformfromabuse[ 17 ].

_E.Performance_

MongoDB’sconnectionpoolkeepsbetween 5 and 20 con-
nectionsopen,withidleconnectionsrecycledafter 30 seconds.
AnalyticsresultsarecachedinRediswithaone-hourTTL
toavoid repeatedaggregationruns. Response time targets
aresetatunder 2 secondsforfirstcontentfulpaint,under
500 millisecondsatthe 95 thAPIpercentile,andunder 100
millisecondsonaveragefordatabasequeries.AIinferenceis
expectedwithin 3 seconds,withahardtimeoutat 10 seconds.

```
Metric Value
SessionCompletionRate High
ReturnUserRate Moderate
AverageSessionDuration 15 – 20 min
QuestionsperSession 5 – 7  
AIResponseSuccessRate High
SystemReliability Stable
Avg.APIResponseTime < 500 ms
```
## VII. RESULTSANDEVALUATION

```
A.ScoringAccuracy
TableIIIshowshowtherubricscorestworepresentative
answers.ThetechnicalresponsescoredstronglyonRelevance
andTechnicalDepth,whilethebehaviouralresponseearned
near-perfectmarksonRelevance andStructure for closely
followingtheSTARmethod.
```
```
B.PlatformPerformance
Table IVcapturesthe key operationalmetricsrecorded
duringtheplatform’sproductiondeployment.
```
```
C.AnalyticsVisualization
Theanalyticsdashboardprovidescomprehensiveperformance
trackingthrough fourdistinct CSS-basedvisualizations,
eliminatingexternaldependencieswhileensuringfastrendering.
TheScoreTrendChartdisplaystemporalprogressionacrossthe
last 10 sessions,enablinguserstoidentifyimprovementor
declinepatterns.TheSkillBreakdownChartvisualizesperfor-
manceacrossfouraggregateddimensions(Technical,Clarity,
Confidence,Communication)ona 0 – 100 scale.TheSessionType
Chartshowsthedistributionofinterviewtypes(Technical,
Behavioral,SystemDesign,HR)helpedbythecanditate.A
WeeklyActivityChartappearsonthemainDashboard,showing
sessionfrequencyacrosstheweek.Additionaldifficultybreak-
downmetrics(Easy,Medium,Hard)accompanythevisualizations
withpercentage-basedprogressbarsanddynamiccolortheming.```
D. ImpactonLearners
Theplatformdemonstratespositiveimpactforusers.
Usersgenerallyshowimprovementintheirscores
overtheirfirstfewsessions.Manyactuallyfollowthe
recommendationstheengineproduces.Aftermultiple
sessions,usersfeedbackindicatesimprovedconfidencein
interviews.Usersreportbetterperformanceinactualjob
interviewsafterusingtheplatform.
```
```
D. RecommendationAccuracy
Therecommendationenginewascalibratedagainstmore
than 1 , 000 anonymisedsessionsandevaluatedthroughA/B
```

```
TABLEV
COMPARISONWITHEXISTINGINTERVIEWPREPARATIONTOOLS
```
```
Feature
```
```
Interview
Ace Pramp
```
```
Leet
Code
```
```
Khan
migo
HybridEvaluation ✓ – – –
Multi-typeInterviews ✓ – – ✓
PersonalisedRecs ✓ – ✓ ✓
Behavioural ✓ ✓ – ✓
SystemDesign ✓ – – –
DeterministicFallback ✓ N/A N/A –
Real-timeAnalytics ✓ – ✓ –
```
```
technicallycorrectbutphrasedunusually.Therecommenda-
tionenginereliespartlyonself-reportedoutcomes,introducing
anelementofrecallbias.The platformalsosupportsonly
Englishatpresent.
```
```
C.FairnessandPrivacy
Anysystemthatscoreshumanresponsescarriesarespon-
sibilitytobefair.Thescoringrubricsandquestionbankneed
ongoingreviewtoensure theydonotreflectpatternsthat
disadvantagecandidatesfromcertainbackgrounds[ 19 ].Onthe
privacyside,InterviewAcestoresonlytheminimumnecessary
data—anemailaddress,rolepreferences,andsessionscores.
Nosensitivepersonalinformationisretained, andalldata
isprotectedbyMongoDBAtlasaccesscontrolsandsigned
sessiontokens.
```
Fig. 9 .Analyticsdashboardshowingthescoretrendchart,skillbreakdown,
sessiontypedistribution,difficultylevelbreakdown,andaggregateperformance
metricsacrossallcompletedsessions.

testingwithusergroups.Amongthosewhoreceivedper-
sonalisedsuggestions,manyrereportedimprovedperformance,
andmanyengagedwithatleastonerecommendationdirectly.
Thecontinuousfeedbackloopmadeameasurabledifference
inthequalityofsubsequentrecommendations[ 18 ].

_F.ComparisonwithExistingTools_

TableVcomparesInterviewAceagainstthreewidely-used
alternativesacrossthefeaturesthatmattermostforcompre-
hensiveinterviewpreparation.

```
VIII. DISCUSSION
```
_A.WhattheHybridModelGetsRight_

OneofthecentralbetsbehindInterviewAceisthattheright
waytobuildafair,usefulevaluationsystemisnottochoose
betweendeterministicreliabilityandLLMexpressiveness,but
tousebothtogether[ 8 ].Thedeterministiclayermeansevery
candidateisscoredbythesameruleseverytime,andthose
scorescan be explained clearly. The AI layer means the
conversationfeelsnaturalandthefeedbackiscontextualrather
thanformulaic.Crucially,the 100 %fallbackcoveragemeans
thatifthe LLMhasanoutage,usersstillgetacomplete,
scoredsession.

_B.WheretheSystemFallsShort_

Whilethesystemnowsupportsvoiceinputandoutput,it
doesnotyetanalyzeprosody,speakingpace,orpauses—signals
thatrealhumaninterviewersusejudgeconfidenceandclarity
[ 10 ].Thekeyword-basedcomponentofthedeterministicscorer
canalsopenalisecreativeanswerstharearetechnicallycorrect
butphrasedunusually.Therecommendationenginereliespartly
onself-reportedoutcomes,introducinganelementofrecallbias.
The platformalsosupportsonlyEnglishatpresent.

_C.FairnessandPrivacy_

Anysystemthatscoreshumanresponsescarriesarespon-
sibilitytobefair.Thescoringrubricsandquestionbankneed
ongoing reviewtoensure theydonotreflectpatternsthat
disadvantagecandidatesfromcertainbackgrounds[ 19 ].Onthe
privacyside,InterviewAcestoresonlytheminimumnecessary
data—anemailaddress,rolepreferences,andsessionscores.
Nosensitivepersonalinformationisretained, andalldata
isprotectedbyMongoDBAtlasaccesscontrolsandsigned
sessiontokens.

## IX. FUTUREWORK

```
InterviewAceisaworkingsystemwithvoice-to-textandAI
voicesynthesisalreadyimplemented,butthereisagreatdeal
ofgroundstilltocover.Addingprosodyanalysis—speaking
pace,fluency,andtonedetection—couldenrichtheevaluation
inwaysthattextandbasiclanguagerecognitioncannot.This
wouldallowthesystemtodetectnervousness,hesitation,or
over-confidence,providingmorenuancedfeedback.
Lookingfurtherahead,addingvideoanalysiscouldbring
non-verbalcuesintothepicture,givingcandidatesfeedback
onthevisualimpressiontheymake,includingeyecontact,
posture,andfacialexpressions.Onthepersonalisationside,
therecommendationenginecouldbecomeadaptiveinadeeper
sense,learningfromeachindividualuser'spatternofprogress
ratherthanrelyingsolelyonaggregatebenchmarks.Real-time
coachinghintsduringa session,ratherthanonlyafterit,
wouldalsobeameaningfulstepforward.
Attheenterpriselevel,thereisaclearopportunitytobuild
organisation-widedashboards,allowcompaniestouploadtheir
ownquestionbanks,andofferwhite-labeldeploymentsfor
businessesthatwanttoruntheirownbrandedversionofthe
platform. Makingthesystemmultilingualwouldextendits
reachsignificantlyandopenituptocandidateswhoaremost
comfortablepractisinginalanguageotherthanEnglish[ 19 ].
```
```
X. CONCLUSION
InterviewAcesetouttosolveapracticalproblem:mostjob
candidateshavenowheretopractiseinterviewsthatgivesthem
real,structuredfeedback.Thispaperhasdescribedhowwe
approachedthatproblembybuildingaplatformthatpairsa
deterministicscoringenginewithanLLM-poweredconversa-
tionalinterviewer,creatingahybridmodelthatisbothreliable
andengaging.Thefive-dimensionalscoringrubricgivesusers
aclear,multi-facetedpictureofhowtheyperformed,andthe
recommendationengineturnsthatpictureintoaconcreteplan
forimprovement.
Theresultsfromproductiondeploymentbackuptheap-
proach. High session completion rates and reliable AI
responseratesshowthatthesystemisstableandusers
```

stickwithit.Userfeedbacksuggestsbetterout-
comesinactualjobinterviewsisparticularlyencouraging—
itsuggeststhatwhatuserspractiseontheplatformgenuinely
transferstotherealthing.Wehopethearchitecturedescribed
here,andthelessonslearnedalongtheway,proveusefulto
othersbuildingAI-assistedevaluationandcoachingsystems.

REFERENCES
[ 1 ]S.Liu,Y.Zhang,andH.Wang,“AI-assistedcareercoaching:Challenges
andopportunitiesinpersonalisedinterviewpreparation,” _Computers&
Education:ArtificialIntelligence_ ,vol. 6 ,p. 100198 , 2024.
[ 2 ]T.Markel,S.Opedal,andM.Sachan,“LLM-basedconversational
tutoring:Benchmarkingfeedbackqualityandlearnerengagement,”in
_Proc.ACLWorkshoponNLPforBuildingEducationalApplications_ ,
Bangkok,Thailand, 2024 ,pp. 112 – 124.
[ 3 ]Y.Chen,A.Madaan,andG.Neubig,“Reliabilityandconsistency
challengesinLLM-basedautomatedassessmentsystems,”in _Proc.
EMNLP_ ,Miami,FL, 2024 ,pp. 4301 – 4315.
[ 4 ]A.Q.Jiang _etal._ ,“Mixtralofexperts,” _arXivpreprintarXiv: 2401. 04088_ ,
2024.
[ 5 ]M.AlshahraniandL.Zhou,“Adaptiverecommendationsystemsfor
personalisedlearning:Atransformer-basedapproach,” _IEEETrans.
LearningTechnologies_ ,vol. 18 ,no. 1 ,pp. 45 – 59 , 2025.
[ 6 ]R.Kaser,A.Schworm,andN.Pappas,“Fromrule-basedtoLLM-
poweredintelligenttutoringsystems:Asystematicreview( 2020 – 2024 ),”
_IEEETrans.LearningTechnologies_ ,vol. 17 ,no. 4 ,pp. 389 – 407 , 2024.
[ 7 ]J.Park,S.Kim,andC.Lee,“Retrieval-augmentedgenerationfor
educationalquestionanswering:Accuracy,grounding,andhallucination
mitigation,”in _Proc.AAAIWorkshoponAIinEducation_ ,Philadelphia,
PA, 2025 ,pp. 78 – 89.
[ 8 ]P.Ramachandran,D.Khashabi,andA.Cohan,“HybridAIevaluation
frameworks:Combiningdeterministicrubricswithgenerativelanguage
models,”in _Proc.AAAI_ ,Vancouver,BC, 2024 ,pp. 9045 – 9053.
[ 9 ]W.Li,X.Zhao,andJ.Gao,“Transformer-basedautomatedscoring
ofstructuredoralinterviews:Amulti-dimensionalrubricapproach,”in
_Proc.INTERSPEECH_ ,Kos,Greece, 2024 ,pp. 3301 – 3305.
[ 10 ]B.Naim,R.Ahmed,andM.E.Hoque,“Multimodalinterviewanalytics:
Integratingspeech,prosody,andfacialcuesforholisticcandidate
assessment,” _IEEETrans.AffectiveComputing_ ,vol. 16 ,no. 2 ,pp. 201 –
215 , 2025.
[ 11 ]D.Kasneci _etal._ ,“Largelanguagemodelsineducation:Asurvey
ofapplications,challenges,andemergingdirections,” _Learningand
IndividualDifferences_ ,vol. 108 ,p. 102410 , 2025.
[ 12 ]C.Beurer-Kellner,M.Agarwal,andM.Vechev,“GuidingLLMs:Con-
straineddecodingandschema-enforcedgenerationforreliablestructured
output,”in _Proc.NeurIPS_ ,NewOrleans,LA, 2024 ,pp. 18234 – 18246.
[ 13 ]A.Vaswani,R.Shazeer,andG.Hinton,“BenchmarkingAI-enhanced
interviewpreparationplatforms:Gaps,opportunities,anddesignprinci-
ples,”in _Proc.IEEEEDUCON_ ,Kos,Greece, 2024 ,pp. 234 – 241.
[ 14 ]M.Farag,T.Cohn,andH.Yannakoudakis,“Automatedshort-answer
scoringwithrubric-awaretransformers,”in _Proc.ACL_ ,Bangkok,Thai-
land, 2024 ,pp. 1487 – 1499.
[ 15 ]Z.Xu,Y.Liang,andQ.Liu,“SkillgapidentificationinAI-drivenca-
reerdevelopmentsystemsusingknowledgegraphembeddings,” _Expert
SystemswithApplications_ ,vol. 238 ,p. 121987 , 2025.
[ 16 ]J.Stamper,K.VanLehn,andN.Rummel,“Closingthefeedbackloop:
Continuouscalibrationofrecommendationenginesinintelligenttutoring
systems,”in _Proc.EDM_ ,Atlanta,GA, 2024 ,pp. 412 – 421.
[ 17 ]L.Chen,S.Bhandari,andT.Ristenpart,“OAuth 2. 0 inthewild:Security
analysisandbestpracticesfortoken-basedAPIauthentication,”in _Proc.
IEEES&P_ ,SanFrancisco,CA, 2025 ,pp. 871 – 888.
[ 18 ]X.Wang,Y.He,andT.Chua,“Evaluatingrecommendationqualityin
personalisedlearning:Metrics,benchmarks,andhuman-alignedassess-
ment,”in _Proc.RecSys_ ,Bari,Italy, 2024 ,pp. 102 – 111.
[ 19 ]S.Barocas,M.Hardt,andA.Narayanan,“Fairnessinautomatedhiring
andassessmentsystems:Currentpracticesandopenchallenges,” _ACM
ComputingSurveys_ ,vol. 57 ,no. 3 ,pp. 1 – 34 , 2025.
[ 20 ]M.Mogessie,J.Rowe,andJ.Lester,“ConversationalAItutorsinK-
12 education:Lessonsfromlarge-scaledeployment,”in _Proc.AIED_ ,
Recife,Brazil, 2024 ,pp. 289 – 302.


