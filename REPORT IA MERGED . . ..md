# A PROJECT REPORT
Submitted by
```
ABHIJITH K (71812201003)
```
```
ADVAITH K (71812201009)
```
```
AKAASH R (71812201014)
```
In partial fulfilment for the award of the degree
of
BACHELOR OF ENGINEERING
in
DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
SRI RAMAKRISHNA ENGINEERING COLLEGE, COIMBATORE
ANNA UNIVERSITY : CHENNAI 600025
APRIL 2026
INTERVIEWACE
[Educational Service : SNR Sons Charitable Trust]
Vattamalaipalayam, N.G.G.O. Colony Post, www.srec.ac.in
Coimbatore – 641022. +917530089996
----------------------------------------------------------------------------------------------------------------------------------------------------------------------
DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING
VISION
 To be a pioneering hub in Computer Science & Engineering education and research, driving
technological advancements along with societal progress, through continuous innovation, multi-
disciplinary collaboration, with a commitment to excellence and sustainability.
MISSION
 To provide quality education in computer science and engineering with strong technical and problem-
solving skills.
 To promote collaborative research to solve real-world problems and build industry-ready skills.
 To foster ethics, professionalism, and social responsibility in students.
 To encourage lifelong learning, innovation, and entrepreneurship adapting with changing technologies.
```
PROGRAMME EDUCATIONAL OBJECTIVES (PEOs)
```
The graduates of this programme, within four to five years of graduation, will:
```
PEO1: Work productively as computer engineers by embracing emerging technologies and developing
```
sustainable solutions that enables success in a dynamic and diverse career landscape.
```
PEO2: Collaborate effectively in their profession while upholding high standards of social and ethical
```
responsibility.
```
PEO3: Adapt to evolving career opportunities and excel in industry, academia, public service, or
```
entrepreneurship, demonstrating global competitiveness through a commitment to lifelong learning.
```
PROGRAM SPECIFIC OUTCOMES (PSO)
```
Graduates of the Computer Science and Engineering program, at the time of graduation, will be able to:
```
PSO1: Apply knowledge of computing, mathematics, algorithmic principles, and theoretical
```
foundations to address complex computing problems.
```
PSO2: Design and develop reliable and scalable software systems using suitable programming
```
languages, development tools, and engineering methodologies.
```
PSO3: Solve real-world research problems adapting contemporary computing technologies such as
```
Artificial Intelligence, Data Science, AR/VR, and Cyber security.
[Educational Service : SNR Sons Charitable Trust]
Vattamalaipalayam, N.G.G.O. Colony Post, www.srec.ac.in
Coimbatore – 641022. +917530089996
ANNA UNIVERSITY: CHENNAI 600025
BONAFIDE CERTIFICATE
Certified that this project report entitled “InterviewAce” is the bonafide work
```
of ABHIJITH K (71812201003), ADVAITH K (71812201009), AKAASH
```
```
R (71812201014), who carried out the 20CS298 Project Work under my
```
supervision.
SIGNATURE
SUPERVISOR
SIGNATURE
HEAD OF THE DEPARTMENT
Dr. V. Saveetha , Dr. M. S. Geetha Devasena, Ph.D.,
```
Assistant Professor (Sl.Gr), Professor and Head,
```
Department of Computer Science and
Engineering,
Sri Ramakrishna Engineering College,
Coimbatore-641022.
Department of Computer Science and
Engineering,
Sri Ramakrishna Engineering College,
Coimbatore-641022.
Submitted for Project Work Viva Voce Examination held on .
Internal Examiner External Examiner
DECLARATION
We affirm that the Project titled “InterviewAce” being submitted in partial fulfillment for
the award of Bachelor of Engineering is the original work carried out by us. It has not
formed the part of any other project submitted for award of any degree or diploma, either
in this or any other University.
```
(Signature of the Candidates)
```
```
ABHIJITH K (71812201003)
```
```
ADVAITH K (71812201009)
```
```
AKAASH R (71812201014)
```
I certify that the declaration made above by the candidates is true.
```
(Signature of the guide)
```
Dr. V. Saveetha,
```
AssistantProfessor(Sl.Gr),
```
Department of CSE.
ACKNOWLEDGEMENT
We have immense pleasure in expressing our wholehearted thankfulness to
Dr. Sundar Ramakrishnan, Managing Trustee, SNR Sons Charitable Trust and
Shri. Narendran Soundararajan, Joint Managing Trustee, SNR Sons Charitable
Trust for giving us the opportunity to study in our esteemed college and for very
generously providing more than enough infrastructural facilities for us to get molded
as a complete engineer.
We wish to express our profound and sincere gratitude to Dr. A. Soundarrajan,
Principal, for inspiring us with his Engineering Wisdom. We also wish to record our
heartfelt thanks for motivating and guiding us to become Industry ready engineers with
inter-disciplinary knowledge and skillset with his multifaceted personality.
We extend our indebted thankfulness to Dr. M. S. Geetha Devasena,
Professor and Head, Department of Computer Science and Engineering for guiding and
helping us in all our activities to develop confidence and skills required to meet the
challenges of the industry. We also express our gratitude for giving us support and
guidance to complete the project duly.
We express our sincere thanks to our project coordinator Mrs. C. Padmavathy,
```
Assistant Professor(Sl.Gr), Department of Computer Science and Engineering for
```
providing valuable suggestions and improvements.
We owe our deep gratitude to our project supervisor Dr. V. Saveetha,
```
Assistant Professor(Sl.Gr), Department of Computer Science and Engineering who
```
took keen interest in our project work and guided us all along with all the necessary
inputs required to complete the project work.
We express our sincere thanks to evaluators and teaching faculty members of the
department for evaluating the project and providing valuable suggestions for
improvements. We also thank all the supporting staff members of our department for
their help in making this project a successful one.
TABLE OF CONTENTS
CHAPTER NO. TITLE PAGE NO.
ABSTRACT ix
சரக்கம் x
LIST OF FIGURES xii
LIST OF TABLES xiii
LIST OF ABBREVIATIONS xiv
1 INTRODUCTION 1
1.1 Need for Intelligent Interview Preparation 2
1.2 Overview of InterviewAce 4
1.3 Target Impact and Scope 6
2 LITERATURE SURVEY 8
2.1 Performance of Large Language Models as
Domain-Specific Evaluators
8
2.2 Artificial Intelligence in Education: LLM
Applications for Assessment
9
2.3 Capabilities and Limitations of Open-Weight
Large Language Models
10
2.4 Semantic Textual Similarity for Automated
Answer Assessment
10
2.5 Challenges And Opportunities of AI in Automated
Interview Screening
11
2.6 Evaluating Consistency and Accuracy of LLM-
Generated Assessments
12
2.7 Benchmark Evaluation of Sentence Embedding
Models
13
2.8 Multi-Dimensional Feedback Architectures for
Professional Skill Development
14
2.9 Robustness and Safety Constraints in Automated
Scoring Systems
15
2.10 User Adoption and Trust in AI - Assisted
Evaluation Tools
16
3 SYSTEM ANALYSIS 17
3.1 Existing System 17
3.2 Proposed System 19
4 SYSTEM SPECIFICATION 21
4.1 Hardware Requirements 21
4.2 Software Requirements 22
5 SOFTWARE DESCRIPTION 24
5.1 Frontend Description 24
5.2 Backend Description 25
5.3 Integration of External Services 26
5.4 Security Design 27
6 PROJECT DESCRIPTION 29
6.1 Problem Definition 29
6.2 Introduction to Proposed System 30
6.2.1 System Architecture 32
6.3 Module Description 34
6.3.1 Evaluation Pipeline Module 34
6.3.2 Interview Session Module 36
7 SYSTEM IMPLEMENTATION 38
7.1 Overview of the Implementation 38
7.1.1 Role-Based Access Control System 39
7.1.2 Interview Configuration and Question
Generation
39
7.1.3 Hybrid Evaluation Pipeline Implementation 40
7.1.4 Feedback Generation and Coach Summary 41
7.1.5 Session Persistence and Analytics 42
7.1.6 Settings and User Profile Management 43
7.1.7 Research Analytics Dashboard 43
7.2 System Testing 44
7.2.1 Functional Testing 44
7.2.2 Evaluation Pipeline Testing 46
7.2.3 Safety Constraint Validation 46
7.2.4 Authentication and API Security Testing 46
7.2.5 Integration Testing 48
7.2.6 Performance and Latency Testing 48
7.2.7 User-Level Testing 48
8 RESULTS AND DISCUSSION 50
8.1 Experimental Results 50
8.1.1 Hybrid Evaluation Pipeline - Score
Distribution
50
8.1.2 Score Distribution Histogram 51
8.1.3 Statistical Summary and Correlation
Analysis
52
8.1.4 Error Detection Effectiveness — Score
Separation by Answer Quality
53
8.1.5 Weighted Component Contribution Analysis 54
8.2 Efficiency of The Platform Workflow 55
8.3 Personal Analytics — User Performance Insights 56
8.4 Comparison of Expected and Observed Results 57
8.5 System Performance Analysis 58
9 CONCLUSION AND FUTURE ENHANCEMENTS 60
9.1 Conclusion 60
9.2 Future Enhancements 62
9.3 SDG Goals Addressed - Mapping 63
10 REFERENCES 66
Annexure I Source Code 68
Annexure II Snapshots 79
Annexure III Base Paper / Article 87
Annexure IV Project - Conference Published 88
Annexure V Plagiarism Report 89
IX
ABSTRACT
The world of employment is very competitive and, therefore, technical interviews have
been regarded as an essential process in the development of a career. Nevertheless, the
available preparation tools are still disjointed and not structured and analytical in their
feedback. To fill this gap, this project presents InterviewAce, a platform based on
artificial intelligence that supports the simulation of the interview process with an
assistant that also offers performance analytics. The platform has 13+ job categories,
such as frontend, backend, machine learning, data engineering, QA, DevOps, and
technical support, four interview types, such as Technical, Behavioral, System Design,
and HR, as well as three levels of difficulty. The major innovation is a hybrid pipeline
of evaluation that integrates three elements: an accuracy and reasoning LLM-based
concept evaluator, a semantic similarity component based on the all-MiniLM-L6-v2
model and a clarity on the quality of communication. An integrated score out of 100 is
```
created using a weighted formula (0.55 Concept, 0.30 Semantic, 0.15 Clarity) and a
```
safety limit of 40 in case of serious conceptual errors. InterviewAce has an adaptive
chat-based interface, which provides the generation of follow-up questions
dynamically. An AI Coach Summary is provided at the end of every session with
strengths, weaknesses, and improvement recommendations. MongoDB Atlas stores
data, and visually presents performance history and trends with dashboards, as well as
an administrative dashboard to examine the system. The system was developed in
Next.js 16, TypeScript, Tailwind CSS, and NextAuth and was tested on 36 labeled
```
responses with distinct score separation (71 correct, 60 partial, 34 incorrect) indicating
```
that it is reliable and effective.
X
சரக்கம்
வேலைோய்ப்ப உைகி் கடலமயாி வபா்் ிலய
மி்ின்் ட, தொாிை்ந்் ப வேர்மகொ் வொர்வகக் ஒர ேபரனி்
```
தொாிை் ேகர்ச்சிை் மக்கயமாி க்்் மாகம்;
```
இரப்் பம் ொற்வபாலொய ொயாரனப்ப கருகக் ஒழு்கற்ற
மற்றம் க்்் லமப்பற்றலேயாக இரே்் ஆழமாி
கரொ்ொகனப்் ை் கலறபாடகக் காணப்படகி்றி. இொலி
சமாகனக்க, InterviewAce எிப்படம் தசயற்லக நண்ணணவ
```
(AI) அிப்பல் ிைாி ேவி ொகம் மி்லேக்கப்படகற் ;
```
இ் மழலமயாி வேர்மகொ் வொர்வ மாதரனயாக்கம்,
ேல் மலற அபபே பிற்ச மற்றம்் ை்் யமாி
தசயை்தறி் மதப்்்் ல் ேழு்ககற் . இே்ொ ொகம் frontend,
backend, machine learning, data engineering, QA, DevOps, technical
support உக்கன்்் 13-க்கம் வமற்ப்்் வேலைோய்ப்ப
்ரனவகலகளம், Technical, Behavioral, System Design, HR எபம்
ோி்க ேலக வேர்மகு்கலகளம், மி்ற ேனலை
சரமு்கலகளம் ஆொரனக்கற் . அொி் மக்கய அம்சமாி
hybrid மதப்்்் ட மலற, LLM அிப்பல் ிைாி கரொ்்
```
மற்றம் ொர்க்க மதப்் ட (0.55), all-MiniLM-L6-v2 மைம் அர்ொ்ொ
```
```
ஒற்றலம பகப்பாய்வ (0.30), மற்றம் தொா் ர்ப தொகனவ
```
```
மதப்் ட (0.15) ஆகயேற்லற ஒரு்கலணொ்் 100
```
XI
```
மதப்தபண் கணக்கடகற் ; கடலமயாி் லழகக்
```
ஏற்ப்்் ாை் 40 மதப்தபண் safety cap அமை்படொ்ொப்படகற் .
வமலம் adaptive chat-based இல் மகம் பயிாகரனி்
பதை்ககனி் அிப்பல் ிை் தொா் ர்ச்ச வகக்ுகலக
```
ொாிாக உரோக்ககற் ; ஒே்தோர அமர்வ மிுலம் AI
```
Coach Summary மைம் பைம், பைவிம் மற்றம் வமம்பா்் ட
பகதகக் தொகனோக ேழு்கப்படகி்றி. MongoDB Atlas
ொரவ வசமப்ப, தசயை்தறி் ேரைாற மற்றம் மி்விற்றொ்
ொரவககக்காி dashboard கா்் சகக், ேனர்ோக
கண்காணனப்ப ேசதகக் ஆகயேற்ற் ி், Next.js 16, TypeScript,
Tailwind CSS மற்றம் NextAuth வபாி்ற ேவி
தொாிை்ந்் பு்கலகக் தகாண்ட இே்ொ அலமப்ப
உரோக்கப்ப்் டக்க் . 36 வை் க் தசய்யப்ப்்்
```
பதை்ககனை் (71 சரனயாிலே, 60 பகத சரனயாிலே, 34
```
```
ொேறாிலே) வமற்தகாக்கப்ப்்் வசாொலிிை்
```
தொகனோி மதப்தபண் வேறபாட காணப்ப்்் ொாை், இே்ொ
அலமப்ப ேம்பகமாி் , பயபக்க் மற்றம் தசயை்தறி்
மக்கொாக இரப்ப் உறதப்படொ்ொப்ப்் டக்க் .
XII
LIST OF FIGURES
FIGURE
NO.
FIGURE NAME PAGE
NO.
6.1 Overall System Architecture Diagram 33
6.2 Hybrid Evaluation Pipeline Data Flow Diagram 35
6.3 Interview Session Workflow Data Flow Diagram 37
10.1 Landing Page 79
10.2 Signup Page 79
10.3 New User Dashboard 80
10.4 New Session Page 80
10.5 Question Bank Page 81
10.6 Learning Hub Page 81
10.7 Notes Page 82
10.8 Analytics Page 82
10.9 GitHub Wrap Page 83
10.10 Settings Page 83
10.11 After Session Dashboard 84
10.12 Live Interview Session Page 84
10.13 End Interview Page 85
10.14 Research Analytics Dashboard - Admin View 85
10.15 Research Analytics Dashboard - Method
Performance Over Sessions
86
XIII
LIST OF TABLES
TABLE No. NAME OF TABLE PAGE No.
7.1 Functional Testing Summary 45
7.2 Security Testing Scenarios and Outcomes 47
8.1 Hybrid Evaluation Pipeline — Statistical Summary 53
8.2 Mean Final Score by Answer Quality Category 54
XIV
LIST OF ABBREVIATION
ABBREVIATION EXPANSION
AI Artificial Intelligence
API Application Programming Interface
CDN Content Delivery Network
HMAC Hash-based Message Authentication Code
HR Human Resources
HTTPS HyperText Transfer Protocol Secure
JSON JavaScript Object Notation
JWT JSON Web Token
LLM Large Language Model
```
MiniLM Minimal Language Model (Sentence Transformer)
```
ML Machine Learning
NLP Natural Language Processing
OAuth Open Authorization
ODM Object Document Mapper
QA Quality Assurance
REST Representational State Transfer
SDK Software Development Kit
SPA Single Page Application
SSR Server Side Rendering
TTS Text To Speech
TTL Time To Live
UI User Interface
URL Uniform Resource Locator
UX User Experience
1
CHAPTER 1
INTRODUCTION
The global labor market has been experiencing a massive change in the last
decade due to the fast development of artificial intelligence, the introduction of remote
hiring, and the constantly growing number of technologically skilled workers
competing over a limited amount of jobs in product-based technology firms. To the
students, fresh graduates and working professionals who want to progress their careers,
the technical interview has turned out to be one of the most significant and least
assisted phases in the whole employment process. In contrast to academic tests, which
are highly structured and highly-resourced, technical interviews require a special
combination of domain knowledge, communication skills, systematic thinking, and
pressurability. These skills do not naturally occur in a vacuum and need structured and
repeated practice in a situation that is closely mimetic of an actual interview setting.
Although the discussion around interview readiness is critical, the current tools
that can be offered to candidates are divided and inadequate. Older teaching
approaches are based on the use of fixed bank of questions, self study books, and the
use of infrequent mock exams with classmates or a tutor. Although these methods have
certain surface-value, they do not offer the type of consistent, personalized and
analytically based feedback that applicants require to make any meaningful
improvement. The candidate can practice the answers over and over without knowing
why a certain answer fails or which technical concepts are being tested or how their
style of communication is perceived with regard to what the interviewers actually need.
This lack of detailed, practical feedback is a critical flaw in the existing interview
preparation ecosystem.
2
Over the past few years, massive language model and transformer-based natural
language processing have created opportunities to evaluate human responses through
automation. Such technologies can comprehend sense, detect errors of thought and
produce valuable feedback in a more sophisticated fashion that had never been possible
before solely through rule-based systems. At the same time, progress in sentence
embedding systems has seen the possibility of measuring the semantic similarity
between the answer given by a candidate and a reference answer with high accuracy,
and this is a measurement of semantic similarity and not surface-level similarity
between the keywords in the answer. By combining such capabilities in a thoughtful
manner, they form the basis of smart systems able to evaluate interview responses on a
variety of dimensions and deliver advice which is both focused and meaningful in an
educational way.
One obstacle to automated assessment, however, is that no single approach to
scoring can be considered reliable when used alone. The systems based on the sole use
of keywords matching are more likely to favor candidates who know the correct
terminology but are not necessarily showing their actual knowledge. On the other
hand, systems that rely solely on large language models have variability due to model
stochasticity and unstable output representation, so scores are hard to reproduce and
interpret. Pure semantic similarity methods have a similar issue in that they may score
highly those answers which are topically similar to the correct answer but which are in
fact false or conceptually invalid. To resolve this issue, a more balanced and
methodologically sound approach to evaluation is needed that will take the advantages
of various methods and will offset their respective disadvantages.
1.1 NEED FOR INTELLIGENT INTERVIEW PREPARATION
The existing shortcomings of interview preparation instruments underscore the
need to have a smart, unified system that offers guided practice with explainable
3
feedback that is meaningful. There are three basic needs that such a system should
```
provide: realism, quality of assessment, and analytical continuity.
```
First, realism is essential to make practice effective. The candidates are in need
of a setting that is similar to the dynamic, turn based conversational format of a real
interview where every follow up question builds on the context created by the previous
answer. Practice in the form of question banks that are not adaptive and do not involve
active interaction with questions create a familiarity with isolated questions, as
opposed to the adaptive reasoning and communication skills that the interviewer is
actively assessed. The realistic simulation of an interview should be able to pose
questions as they arise, answer the text of each reply and keep the dialog going as in a
live interview.
Second, the most important distinguishing factor between tools that only give
practice and tools that lead to improvement is the quality of assessment. The
candidates must have feedback that not only informs them that their response was
acceptable but actually what, where, which technical concepts were overlooked or
incorrect, how their communication was organized, and what they should work on in
their next session. Single-score assessments and qualitative ratings that are not
explained are not educational. The type of specific, practical advice that transforms
practice into actual skill training is offered by multi-dimensional assessment that
disaggregates performance in terms of conceptual accuracy, semantic relevance, and
clarity of communication.
Third, repetitive practice requires analytical continuity to bring it into
significance. In the absence of the continuous session data and longitudinal
performance tracking, every practice session is in effect a vacuum and the summative
value of effort used over time is lost. The candidates should be capable of noticing
changes in scores, in which areas they are always scoring lowly, and whether they are
4
really improving session to session. An analytics preparation platform that offers such
```
analytics becomes more than a mere practice tool; it becomes a formalized coaching
```
tool.
All of these capabilities have become technically viable to a web-based platform
due to advancements in cloud computing, large language model API, and locally
deployable machine learning inference runtimes. The use of technologies like the
OpenRouter API to perform LLM inference, semantic similarity sentence embedding
models, serverless architecture to handle real-time responses, and MongoDB to persist
session data, allow platforms to provide intelligent and multi-dimensional interview
evaluation at a low cost and with reasonable latency. A combination of these
technologies into a single system can greatly decrease the discrepancy between the
requirements of the candidates and what the existing tools offer.
1.2 OVERVIEW OF INTERVIEWACE
In response to these difficulties, the current project proposes InterviewAce, an
AI-controlled mock interview training system, which recreates the conditions of a
technical interview and provides multi-dimensional and explainable evaluation of the
candidates. The platform has over thirteen domain-specific jobs such as frontend
development, backend engineering, machine learning engineering, data engineering,
quality assurance, DevOps, and technical support, among others. Interview sessions
may be set by type: Technical, Behavioral, System Design, and Human Resources and
by difficulty level: easy, medium, and hard. This flexibility allows the platform to be
applicable and valuable to a wide range of applicants, including undergraduate students
about to attend their first placement interview, and senior technical positions.
InterviewAce is primarily an innovation in its core innovation of a hybrid
answer evaluation engine, which integrates three mutually complementary scoring
5
channels under a deterministic weighted fusion process. The former is an LLM-based
concept evaluator that evaluates the factual accuracy and accuracy of reasoning in a
candidate answer based on a structured, rubric-based prompt. The second is a semantic
similarity module that uses an all-MiniLM-L6-v2 sentence transformer model to
compute the embedding-level similarity of an answer of the candidate and a curated
reference answer. The third channel is a clarity assessment layer which is used to
determine the quality of communication in terms of response structure and articulation.
A fixed weighted formula is used to combine these three elements with 55 percent
conceptual correctness weight, 30 percent semantic relevance weight and 15 percent
clarity weight giving a final score out of zero to a hundred.
In addition to scoring of answers on a case-by-case basis, InterviewAce provides
a comprehensive interview experience that replicates the dialogue of a technical
interview. The system runs sessions in a chat-based interface, dynamically creating
subsequent questions depending on the outcome of each candidate and the assessment.
At the end of a session, the platform generates an AI Coach Summary, which
summarizes strengths identified, areas that need improvement, and specific learning
suggestions based on the performance shown by the candidate. This coaching tier will
make every session a scoring activity, but a learning session in a structured manner
where the candidates can gain a clear picture of their current abilities and a roadmap to
achieve the desired results.
A complete analytics infrastructure to support longitudinal performance tracking
is also included in the platform. Data on individual sessions is stored in a MongoDB
Atlas database, and candidates have access to personal dashboards where they can see
trend of scores over time, dimensional skill breakdown by evaluation category, and
complete session history. To facilitate research and academic analysis, an
administrator-facing research dashboard will pack together all evaluation data on a
6
session-by-session basis and provide statistical comparisons of the single scoring
elements to aid in the formal analysis of the efficacy of the hybrid evaluation
framework.
1.3 TARGET IMPACT AND SCOPE
InterviewAce is mainly aimed at providing high-quality, structured and
analytically-founded interview preparation to every candidate without consideration of
institutional affiliation, geographic location, financial status or access to professional
networks. Students and early-career professionals in the tier-two and tier-three cities
that do not have access to formal coaching, institutional placement preparation
programmes, or professional networks that offer mock interview opportunity with
qualified reviewers are especially relevant to the platform.
InterviewAce focuses on a wide and heterogeneous group of candidates such as
undergraduate and postgraduate students on the verge of a placement interview, junior
and middle level engineers on the verge of technical assessment at product based firms
and professionals on the verge of role change into new technical areas. The fact that
the platform allows over thirteen domain-specific roles and four types of interviews
makes sure this diversity is represented in the richness and specificity of the practice
experience, not by using generic questions and evaluation criteria, which are equally
ineffective with all.
The platform will ultimately help advance practical candidate results and the
scholarly research arena in automated answer assessment, in the long run. The problem
of reliably assessing free-form human responses with automated processes is a current
research topic in the fields of natural language processing and education technology.
This project presents a tangible implementation of the behaviour of hybrid evaluation
systems by integrating concept evaluation, semantic similarity, and clarity scoring in a
7
controlled and reproducible system, showing the viability and effectiveness of multi-
channel evaluation of interviews, and generating experimental data that can be
analysed formally to support the formal analysis of hybrid evaluation system
behaviour.
The rest of this report is structured in the following way. Chapter 2 introduces a
literature review of the related work on automated answer assessment, natural language
processing, and AI-assisted learning systems. The chapter 3 evaluates the current
systems and justifies the solution proposed. Chapter 4 describes the system
specification such as hardware and software requirements. Chapter 5 explains the
software elements and design. Chapter 6 will give the complete description of the
project such as the system architecture and module descriptions. Chapter 7 deals with
the system implementation and testing methodology. Chapter 8 provides the discussion
and results of the experiment. Chapter 9 gives an overview of the report findings and
conclusions on future work.
8
CHAPTER 2
LITERATURE SURVEY
2.1 PERFORMANCE OF LARGE LANGUAGE MODELS AS DOMAIN-
SPECIFIC EVALUATORS
```
Chiang et al. (2024) proposed Chatbot Arena, an open evaluation platform that
```
aims to evaluate the abilities of large language models in direct human preference
contests across a broad spectrum of tasks such as technical question answering, open-
ended response evaluation, and structured reasoning problems. The research gathered
millions of human judgements that compared the performance of various models and
employed the data obtained to form a strong ranking of the performance of LLM
models across domains. The authors discovered that human judges always favored
answers that exhibited structured reasoning, factual basis and clear expression
compared to answers that were fluent but conceptual vague.
The study also discovered that there were significant differences in the
performance of models in different domains and models that performed well in general
language tasks did not necessarily perform equally well in technical or domain-specific
assessment tasks. The research also emphasized that the credibility of evaluations
made by LLM is highly dependent on the manner in which the evaluation task is
specified, with models that were prompted through the use of explicit rubrics and
systematic output requirements generating more credible and reliable evaluations
compared to models prompted through open-ended prompts. The identified gap was
the lack of systematic frameworks of implementing LLMs as assessors, in automated
assessment pipelines, especially in technical areas where factual correctness is
essential, rather than stylistic excellence. InterviewAce fills this gap by integrating an
9
evaluator of the LLM concept, which is driven by a rubric, but applies explicit scoring
criteria, numerical limits and structured output requirements in the prompt itself, so
that the output of the evaluator is machine-readable and tied to visible assessment
criteria.
2.2 ARTIFICIAL INTELLIGENCE IN EDUCATION: LLM APPLICATIONS
FOR ASSESSMENT
A systematic review of the application of large language models in educational
```
technology was carried out by Chen et al. (2024), with the particular focus on their
```
application in automated assessment and in the creation of personalised learner
feedback. The analysis of a wide variety of applications to academic institutions and
edtech platforms identified that the assessment systems based on LLM were effective
at scoring free-form written work, detecting conceptual gaps, and providing feedback
that was more practical and easier to interpret than traditional rubric scores.
The authors discovered that the most successful implementations did not rely on
LLMs as standalone scoring functions, but as a part of a bigger evaluation system, both
model-generated assessment and rule-based validation layers to identify instances
where the model generated implausible or inconsistent scores. The study also found
that personalised feedback, i.e. those comments which mentioned particular aspects of
the actual response of the learner instead of making general comments, had a
statistically significant larger effect in the context of future attempts. The identified gap
was the insufficient literature on the assessment with the use of LLM in non-academic
writing, especially in technical and professional skills. InterviewAce is based upon
these findings, generating per-response justifications that cite particular mistakes in the
candidate response, integrating both LLM analysis and semantic similarity scoring
with output validation logic.
10
2.3 CAPABILITIES AND LIMITATIONS OF OPEN-WEIGHT LARGE
LANGUAGE MODELS
```
Dubey et al. (2024) have published a detailed technical report on the Llama 3
```
family of open-weight large language models, including training methodology,
architectural design, and evaluation on a large set of reasoning, coding, and domain-
specific benchmarks. The paper has shown that open-weight models with the three-
billion and eight-billion parameter sizes can reach previously only accessible larger
proprietary model level of performance on technical benchmarks, and high-quality
LLM inference can now be made affordable by cost-sensitive applications.
The authors tested model behaviour on structured output tasks and discovered
that Llama 3 models closely conformed to the requirements of the JSON formatting
when given explicit prompts of the schema, an important property in applications that
require machine-readable LLM output. The models were also tested on technical
question answering tasks in software engineering, data structures, and system design,
and significant accuracy was observed in these areas of the research. The identified gap
was that there is still a gap in the literature on how open-weight models could be
applied as assessors of technical interview responses, and whether their domain
knowledge is adequate enough to determine conceptual errors with a large variety of
engineering fields. InterviewAce is powered by a three-billion parameter model of
Meta Llama 3.2 as its default concept evaluator, served via the open router API at no
current API cost, and its results are formatted via a carefully-designed JSON schema
prompt.
2.4 SEMANTIC TEXTUAL SIMILARITY FOR AUTOMATED ANSWER
ASSESSMENT
```
Mazrahi et al. (2024) explored the stability and reliability of natural language
```
processing evaluation systems under varying prompting strategies and similarity
11
metrics in a study that systematically examined the effect of different methods on
varying evaluation outcome based on the method of eliciting and comparing text
representations. The researchers discovered that embedding-based measures of
semantic similarity generate much more reliable results than prompt-based
comparisons of generative models, when considering responses to structured questions
with clear correct answers, as embedding computation is deterministic and not affected
by the sampling variability of generative model inference.
The authors showed that sentence embedding models that are trained on large-
scale natural language inference datasets represent important semantic relations among
paraphrases, synonyms and conceptually equivalent phrases that are resistant to
surface-level differences in the way applicants convey a given concept. The study also
established that embedding based similarity has the highest reliability advantage in
technical areas where the range of correct responses is narrower and the correlation
between vocabulary selection and conceptual accuracy are stiffer than in free tests. The
identified gap was that there was a requirement to have evaluation structures that
would integrate the consistency of embedding-based similarity with the reasoning
power of generative models. InterviewAce uses precisely such a hybrid strategy, where
the all-MiniLM-L6-v2 model serves as a deterministic semantic similarity channel and
the LLM concept evaluator is used in the hybrid pipeline.
2.5 CHALLENGES AND OPPORTUNITIES OF AI IN AUTOMATED
INTERVIEW SCREENING
```
Kasneci et al. (2023) explored the increasing use of artificial intelligence
```
technologies in education and professional assessment, considering both the potential
that is offered by these systems and the reliability and fairness issues that they raise.
The paper has examined numerous AI-assisted assessment systems used in
professional screening and education and has discovered that systems relying entirely
12
on large language models present a high degree of unfairness since the models trained
on general web data can introduce biases related to the style of communication or the
use of domain-specific vocabulary that disproportionately disadvantage specific groups
of candidates.
The authors discovered that hybrid evaluation architectures, where a
combination of multiple assessment signals is used and the evaluation process is not
delegated to a single model, are in a better position to reduce these risks as no one
source of bias dominates the resulting overall outcome. The study also found out that
AI-based assessment systems prove to be most beneficial when used as coaching and
developmental tools, as opposed to high-stakes gatekeeping. The identified gap was the
lack of practically implemented mechanisms that would unite multi-signal assessment
with organized feedback creation with specific regard to technical interview
preparations. InterviewAce is built with the coaching-first orientation that the authors
advocate, which places the platform as a practice and development aide that the hybrid
evaluation pipeline allocates the scoring to three complementary channels to minimise
the prevalence of the bias of a specific model.
2.6 EVALUATING CONSISTENCY AND ACCURACY OF LLM-GENERATED
ASSESSMENTS
```
Guo et al. (2023) carried out a systematic study of the relationship between
```
ChatGPT and other similar large language models and human expert judgements as
evaluators of free-form response scoring consistency across repeated scoring trials and
agreement with human annotators across different domains. The researchers have
discovered that the evaluations produced by LLM are highly correlated with human
evaluators regarding responses at the ends of the scale of quality, but that the scoring
consistency declines as the scale scores of intermediate quality and stochastic sampling
process by the model generates a large score variation that can have significant effects
13
on the ranking of candidates and the quality of feedback.
The study has shown that the provision of the model with a specific, rubric-
based assessment prompt greatly minimizes this variance by grounding the assessment
of the model to observable, concrete standards as opposed to using holistic impression.
The identified gap was the necessity of evaluation systems which maintain the
evaluative power of LLMs, but do so in a way that structurally limits their output to
suppress the effect of stochasticity on final scores. InterviewAce solves this by having
the concept evaluator prompt contain a detailed scoring rubric with specific criteria per
score range, and that the LLM evaluation score is used in a deterministic weighted
fusion formula with the embedding-based semantic score and clarity assessment, so
that variance in the LLM channel is shared by the stability of the other two channels.
2.7 BENCHMARK EVALUATION OF SENTENCE EMBEDDING MODELS
```
Bandarkar et al. (2024) introduced the Belebele benchmark, a large-scale
```
parallel evaluation dataset that can assess the language models and semantic
understanding systems Reading comprehension and semantic understanding
capabilities in a variety of languages and domains. The research compared a broad
spectrum of embedding structures and discovered that distilled sentence embedding
models can compete with even full-scale transformer inference in semantic similarity
on a fraction of the cost, which is why they are applicable in applications that are
sensitive to latency.
The authors discovered that all-MiniLM family of models performed especially
well based on the number of their parameters, keeping the ability to discriminate
semantically both in the general language and domain-specific text pairs. The study
also discovered that such embedding models can be generalised to technical text areas
without necessarily fine-tuning them with technical text. The identified gap was that
14
systematic assessment of lightweight embedding models in more structured assessment
tasks like automated answer grading was lacking. InterviewAce uses the all-MiniLM-
L6-v2 model in its semantic evaluation channel in fact on the basis of the performance
and efficiency properties that the authors report, loaded locally via the Xenova
Transformers runtime, so that evaluation is fast and is not subject to external API
availability.
2.8 MULTI-DIMENSIONAL FEEDBACK ARCHITECTURES FOR
PROFESSIONAL SKILL DEVELOPMENT
```
Wang et al. (2024) examined the impact of structure and dimensionality of
```
automated feedback on the results of learner engagement and the development of skills
on professional training platforms. The researchers have discovered that learners who
were provided with multi-dimensional feedback, i.e. separate ratings of various aspects
of their performance, were much more likely to engage with the feedback content, and
exhibit more targeted improvement across the dimensions in which they scored lowest,
than those who were provided with an overall rating or a holistic commentary.
The authors determined that the actionability of feedback is directly associated
with its specificity, that is, candidates who are aware that they perform well
conceptually, but poorly structurally to organise their ideas are in a better position to
channel their practice efforts compared to those who are merely aware that they are
performing averagely. The study also established that a feedback mechanism with
improvement suggestions and dimensional scores yields better behavioural change
compared to a feedback mechanism with scores. The identified gap was the dearth in
the application of truly multi-dimensional feedback in professional-interview-
preparation tools. InterviewAce uses multi-dimensional feedback as a fundamental
architectural feature, providing individual scores on conceptual correctness, semantic
relevance, and clarity and detected errors, natural language explanation, and an end-of-
15
session AI Coach Summary.
2.9 ROBUSTNESS AND SAFETY CONSTRAINTS IN AUTOMATED SCORING
SYSTEMS
```
Kung et al. (2023) reviewed the work of large language model-based evaluation
```
systems in high-stakes assessment situations, and analyzed any instances of
counterintuitive performance by automated scoring systems, that is, situations when
fluent, confidently-stated erroneous answers were scored higher than less polished, but
more factual answers. The research discovered that evaluators using LLM tend to be
prone to fluency bias, the propensity towards giving well-structured and linguistically
advanced responses even when such responses include factual inaccuracies or even
conceptually flawed arguments.
The study showed that this bias is greatest when the instructional prompt used to
drive the model does not specifically target the model to focus on factual accuracy
rather than the quality of communication, and that even rubric-based prompts may not
be effective enough in counterbalancing fluency bias when the errorous response is
given with a high degree of confidence. One suggestion that the authors made is the
introduction of structural safety constraints in automated scoring pipelines - hard rules,
which restrict the highest score that can be obtained by a response when a certain type
of conceptual errors is found, independent of the quality of language. InterviewAce
enforces the safety constraint architecture the authors suggest directly: the hybrid
evaluation engine makes use of a hard score cap to prevent the final score to go above
40 out of 100 whenever the concept evaluator provides a conceptual correctness score
of two or less, so that neither a high semantic similarity score nor a high clarity score
can increase the rating of a fundamentally incorrect response.
16
2.10 USER ADOPTION AND TRUST IN AI-ASSISTED EVALUATION TOOLS
```
Achiam et al. (2023) have conducted an in-depth overview of GPT-4,
```
considering its technical features in addition to how users engage with and establish
confidence in AI systems that can deliver detailed, domain specific evaluations and
advice. The researchers concluded that the users exhibit a much greater degree of trust
and continued interest in AI-generated assessments when the system can give clear
explanations as to why it has arrived at the alleged assessment instead of merely
delivering findings without explanation. The study determined that the main
distinguishing factor between the users who adopt and assimilate AI feedback and
those who dismiss it is whether the system can explain its scoring choices in an
unambiguous, comprehensible manner.
The authors discovered that systems that reveal their reasoning approach,
recognize definite aspects of user input into the evaluation, and express evaluations in
constructive and prospective language yield much greater feedback integration and
subsequent platform use. The study also discovered that the perceived competence of
an AI assessment system highly depends on the consistency of its results. The
identified gap was that the AI-assisted professional development platforms needed to
dedicate as much effort to the architecture of their feedback presentation and
explanation as to the model behind it. InterviewAce deals with such considerations of
adoption and trust by displaying the dimensional score breakdown, detected errors, and
a natural language description with each assessed response, and by presenting session-
level results as growth advice in the AI Coach Summary, as opposed to a final
performance judgment.
17
CHAPTER 3
SYSTEM ANALYSIS
3.1 EXISTING SYSTEM
The landscape of interview preparation has changed considerably in the last ten
years and now offers a variety of tools and platforms that assist the candidates in
rehearsing specific and professional interviews. All of these platforms can be generally
divided into a static question bank service, chatbot based practice tools through AI,
peer mock interview sites, and hybrid preparation services. Although both of these
cover part of the interview preparation requirements, all of them are incomplete as they
are not as structured, multi-dimensional, and analytically based along with explainable
feedback to satisfy the requirements of candidates.
Candidates are offered big collections of technical inquiries in domains of data
structures, algorithms, and the specific area, in static question bank platforms like
LeetCode, HackerRank, and GeeksforGeeks. They are useful in building problem-
solving skills and technical skills however, they do not replicate the conversational
format of an actual interview. They do not offer any means to assess how a candidate
justifies their thinking, presents technical ideas or organizes behavior or system design
answers. Even a candidate, who is able to solve algorithmic problems on paper, can fail
at an interview because he/she is unable to explain the reasoning process and sound
confident.
Some candidates have made use of generic AI chatbots like ChatGPT or others
as informal interview practice partners. Although they can support conversational
interchange and respond to technical questions, they do not offer structured assessment
of the candidates response, they lack session history to track performance
18
longitudinally, they do not generate role specific or difficulty based questions and they
cannot yield dimensional feedback to differentiate between conceptual accuracy,
semantic relevance and communication quality. These structured features are lacking,
which restricts the educational usefulness of using generic chatbots to prepare
interviews.
Peer mock interview systems like Pramp and interviewing.io form a connection
between interviewers and candidates, and allow them to receive a mock interview in
real-time. These platforms are very realistic and qualitative in human feedback, yet
they lack availability and scheduling. Sessions require the goodwill and presence of
human partners who have pertinent technical skills, so consistent and frequency of
practice is not easily maintained. The quality of feedback is also quite different
depending on the experience and ability to communicate by the reviewer.
More recently, specialised AI-based interview practice tools have been
developed, such as Interviewer.ai and HireVue practice modules. These sites provide a
certain level of automated assessment, normally through video or audio analysis of
interview answers. Nevertheless, they engage more on delivery aspects like tone,
speed, and facial expression as opposed to technical and conceptual content of the
answer. They also fail to give clear, explainable scoring breakdowns that the
candidates can utilize to know precisely what they should do to improve.
The most perennial constraints in all current categories are the lack of multi-
dimensional assessment to measure both content and communication quality, the lack
of explainable scoring that can identify individual errors and areas of improvement, the
lack of role-specific and difficulty-calibrated assessment criteria, the absence of
longitudinal analytics to monitor improvement over sessions, and the prohibitive cost
or accessability of human-based feedback. All these gaps are the motivators of the
proposed system.
19
3.2 PROPOSED SYSTEM
In order to address the shortcomings found in current systems, InterviewAce is
suggested as the single platform, which combines chat-based interview simulation,
multi-signal answer analysis, explainable dimensional feedback, role-specific
evaluation, and longitudinal analytics into one, easy-to-access web-based application.
The system aims to deliver candidates the quality and specificity of feedback which is
typically provided by expert human coaching, with consistency and availability of an
automated system.
The fundamental concept of InterviewAce is to offer candidates an all-in-one
interview preparation environment in which they can customize a session with their
desired position and interview format, have a realistic, conversation-based interview
with a dynamically evolving AI interviewer, get detailed feedback with dimensional
ratings and specific, response-specific feedback on how to improve on each answer,
and follow their progress in a sequence of sessions via a structured analytics
dashboard. All these capabilities are contained in one flow of the session, which
eradicates the discontinuity that defines current methods of preparation.
The platform guarantees reliability in the evaluation process by its hybrid
pipeline where three independent scoring mechanisms - LLM-based concept
assessment, sentence-embedding semantic similarity and clarity evaluation - are
integrated within a deterministic weighted fusion model. This multi-signal design
alleviates the failure modes of each of these evaluation techniques: keyword-only
systems that incentivize terminology and not understanding, LLM-only systems that
introduce non-deterministic variation, and similarity-only systems that incentivize
topical relevance in the presence of erroneous core reasoning. The safety constraint
mechanism also enhances reliability in that the mechanism eliminates the possibility of
20
fluency bias inflating scores on factually incorrect responses.
Role-specificity is considered with a configurable interview configuration that
enables the prospective employees to choose between over thirteen technical and
professional areas supported. Question generation and criteria used to assess the
candidates are set to match the role being assessed, so the evaluation does not use
generalized criteria but those that would be applicable to an individual domain.
All evaluation outputs are designed to be transparent and explainable. Each
evaluated answer provides individual concepts of conceptual correctness, semantic
relevance and clarity, with a list of detected factual inaccuracies and a natural language
description of the results of the evaluation. These signals are pulled together at the end
of the session into specific development advice by the AI Coach Summary produced
by the end of the session. The deterministic fusion formula guarantees that scores are
reproducible and consistent, and this gives trust to candidates in the scoring of the
system.
The system proposed is deployed on a state-of-the-art and scalable stack: Next.js
with the App Router pattern and TypeScript on the front and API layer, MongoDB
Atlas to store session data, the OpenRouter API to infer LLM, the Xenova
Transformers runtime to score semantically locally, and NextAuth to authenticate with
secure GitHub OAuth. This architecture provides an accessible deployment as a web
based application that does not require any specialised hardware and therefore the
platform is accessible to any candidate with a standard device and internet connection.
21
CHAPTER 4
SYSTEM SPECIFICATION
4.1 HARDWARE REQUIREMENTS
InterviewAce is developed as an online application and thus can be accessed on
a broad spectrum of devices without the need of a specialised or high-end hardware.
Because the processing of the system evaluation occurs on the server with the API
routes and the cloud-based database systems, the majority of the computational tasks
are not performed on the candidate device. Nonetheless, there is a set of minimum
hardware requirements that are needed to provide a seamless and responsive user
experience.
To use it in general such as browsing, conducting an interview session,
submitting answers and reviewing analytics, a dual-core processor with a minimum of
1.6 GHz would work. Applicants who will utilize the platform on a long-term basis
with optional video recording will enjoy the company of a quad-core processor like
Intel Core i5 or a similar AMD Ryzen processor since local video encoding and
decoding will require moderate CPU load. To develop the server-side or locally run the
application to develop it, it is recommended to have a system with a minimum of an
Intel Core i5 tenth-generation processor or similar.
Regarding memory, at least 4 GB RAM will suffice to use it normally in terms
of session operations and reviewing the analytics. Nevertheless, 8 GB RAM is
suggested to have a more enjoyable experience, especially when using several browser
tabs, local development tools or optional webcam preview features at the same time.
The 16 GB RAM will be useful in development environs that will operate the full
Next.js development server and a local MongoDB database.
The chat interface and analytics dashboards of the platform can only be
22
effectively used with a display of minimum resolution 1280 by 720 pixels without
content overflow or layout problems. It is suggested to have a resolution of 1920 by
1080 pixels which is the most comfortable resolution to view the multi-panel interview
session interface. The Tailwind CSS responsive layout of the platform provides the
proper display at the standard screen sizes.
Applicants wanting to use the optional video recording option will need a web
camera with a minimum of 720p recording capability. The majority of embedded
laptop cameras satisfy this need. The core platform functionality does not require a
microphone as response submission is text-based, although it can be supplemented
with the optional text-to-speech option of listening to interview questions being read
aloud.
Good internet connectivity is necessary because InterviewAce relies on the
cloud to perform the LLM inference using the OpenRouter API, storing session data in
MongoDB Atlas, and authentication using NextAuth and GitHub OAuth. Normal
usage only requires a minimum connection speed of 5 Mbps. The semantic similarity
module with the hybrid evaluation mode is recommended to be faster, since the first-
inference model loading would require the download of the all-MiniLM-L6-v2 model
weights of about 80 MB. The site is optimized to all major operating systems, such as
Windows, MacOS, Linux, Android, and iOS, and is compatible with all major modern
browsers.
4.2 SOFTWARE REQUIREMENTS
InterviewAce will be created on a current, full-layered web technology stack that
divides the user interface, application logic, evaluation processing, and data persistence
into well-defined layers. All layers are based on particular software frameworks and
services to perform their duty and collaborate with each other as a well-integrated
platform.
The application is created on the frontend with Next.js version 16 App Router
23
pattern, based on React 19. Next.js has server-side rendering, routing with filesystem
routing, and built-in API route support, so that it does not require a separate backend
server. It is written in TypeScript across to ensure compile-time type safety and
minimise runtime errors. Tailwind CSS version 4 has all the styling that is done by
utility classes to provide a consistent and responsive layout on various screen sizes and
devices. Lucide React presents the icon library that is used all over the interface. The
analytics dashboard visualisations are driven by the Recharts library, such as score
trend line charts and dimensional skill breakdown bar charts.
```
NextAuth version 4 (GitHub OAuth sign-in, encrypted JWT session
```
```
management, and middleware-based route protection) is used to authenticate users.
```
MongoDB Atlas is used as the database on the cloud, and it can be accessed by the
Mongoose ODM that offers schema validation and type safety and manages the
connection pools in the Next.js serverless execution environment. Four main models of
Mongoose that are used are: Session, UserSettings, UserProfile and Note.
Inference with AI is available via the OpenRouter API that offers access to the
Llama 3.2 three-billion parameter instruction model of Meta, at no continued API fee.
The local runtime of the all-MiniLM-L6-v2 sentence embedding model that is
employed in the semantic similarity evaluation channel is version 2.17.2 of the Xenova
Transformers library. This model is loaded gradually and kept in memory and a first
time download of about 80 MB takes place.
The app will be configured to run on Vercel, an optimised Next.js host with
automatic scaling, edge network delivery and serverless execution of functions. The
development environment should have Node.js 20 or above and pnpm package
```
manager (but also compatible with npm).
```
24
CHAPTER 5
SOFTWARE DESCRIPTION
5.1 FRONTEND DESCRIPTION
The frontend of InterviewAce is developed with Next.js 16 based on the App
Router pattern, React 19 and compiled with TypeScript as the main codebase. The
application has a server-side rendered architecture with client-side hydration, the
default behavior of page components being to execute them on the server and only
those that need browser-specific state or interaction being client components. This
architecture will result in quick first page loads, acceptable search engine support of
public pages, and seamless client-side navigation between authenticated routes.
The routing structure is based on Next.js App Router conventions, where route
groups are divided by an authenticated application routes and public authentication
routes. The use of authenticated routes is secured by NextAuth middleware, which
authenticated the JWT session on each request and sends the user to the log-in page in
case of nonauthentication. The most state-intensive part of the application is the
interview session page, which handles the state of the current question, the history of
responses so far, the evaluation results, the state of the session, the optional video
recording state, and the text-to-speech state by using React component state without a
global state management library.
The user interface is designed solely with Tailwind CSS utility classes, which
offers a responsive layout, which is properly adjusted to the screens of mobile devices
up to the desktop. Lucide React offers set of consistent icons that are used throughout
the interface in navigation, action buttons and status indicators. The analytics and
research dashboard pages use the Recharts library to visualise the score trends as line
25
charts, dimensional skills breakdowns as bar charts, and session distributions as
visualisation.
The most important frontend pages are the interview setup page where
candidates can set their role, type, and skill level and start an interview and the
interview session page that renders the chat-based interface with auto-scroll behaviour,
```
optional video preview, and per-response evaluation features; the dashboard page that
```
```
displays the recent sessions and global statistics; the analytics page with score trend
```
```
charts and skill breakdowns; the session history page with a list of sessions and review
```
links
5.2 BACKEND DESCRIPTION
InterviewAce uses the backend of Next.js as API route handlers in a serverless
execution environment running on Vercel. This architecture has the benefit of
removing the operational overhead of maintaining a persistent backend server and still
maintaining complete control over request handling, validation, external service
integration and database access. All API routes are modules in TypeScript that provide
a handler function, which gets called when a corresponding HTTP request is received.
NextAuth session validation is used to authenticate routes. All API routes that
require access to user-specific data or invoke evaluation processing will start by
making a call to NextAuth getServerSession, which authenticates the encrypted JWT
and returns the authenticated user session object. Unauthenticated requests are pure
requests that are declined with a 401 response prior to the business logic running.
The logics of interview orchestration are divided into three major API routes.
The start route provides initialisation of the session, loading persisted user settings of
the candidate in MongoDB, choosing or generating the opening question, and sending
the session identifier and the opening question to the frontend. The respond route is the
one that is involved in the main evaluation loop: The respond route receives the answer
26
of the candidate, retrieves the reference answer of the question bank where it is
available, runs the hybrid evaluation pipeline, builds the follow-up question prompt
using the session history and role-specific advice, and sends the evaluation breakdown
and the subsequent question. The entire path is involved in finalising sessions since it
retains all question-answer-evaluation entries to MongoDB and produces the AI Coach
Summary.
Other API routes are user settings retrieval and update, aggregated analytics data
to the personal dashboard, and an administrator-only endpoint to aggregate research
metrics. The Mongoose ODM and the MongoDB Atlas cloud-hosted database are used
to perform all database operations and are connected via a singleton connection
management pattern leveraging the reuse of existing connections across invocations of
serverless functions.
5.3 INTEGRATION OF EXTERNAL SERVICES
The main external service utilized in InterviewAce is the OpenRouter API,
which offers access to large language models to both the interview question generation
and concept evaluation channel of the hybrid scoring pipeline. The server-side respond
```
and complete route handlers (rather than the frontend) make the API requests, and API
```
credentials are never sent to the client. Every evaluation request contains a rubric-
based prompt that is well-constructed, specifying the question, the answer of the
candidate, the answer of reference, scoring guidelines for each score range, and a strict
JSON output structure. This response is decoded and authenticated, and then
incorporated into the fusion pipeline, with a fall back mechanism of re-trying to decode
failures and a deterministic fall back evaluation in the event the API is not available.
The runtime of the all-MiniLM-L6-v2 sentence embedding model in the
semantic similarity evaluation channel is offered by the Xenova Transformers library.
In contrast to the OpenRouter integration, this model fully operates locally in the
27
environment of the Node.js server and does not invoke any external API. When first
used, the model is lazily loaded and stored in memory to be used again in later
```
evaluations in the same server instance, so the overhead of loading the model (about
```
```
200 to 300 milliseconds) is one-time, rather than one-per-instance. Computation
```
Embedded on a pair of text inputs takes less than 100 milliseconds to boot the model.
MongoDB Atlas offers cloud-based service of storing session, user settings, and
managing user profiles. Mongoose ODM takes care of connecting the pool of
connection, schema validation, and query formulation of all the operations done on the
database. Connection management employs a singleton pattern and keeps the
connection state in a global variable of Node.js, so that instances of serverless
functions can still use the same database connection instead of having to make a new
connection on each API call, which would add a substantial latency penalty.
NextAuth can authenticate user via GitHub OAuth. Upon a user signing in, they
will be redirected to the OAuth authorisation page of GitHub, which sends back an
authorisation code to the NextAuth callback route. NextAuth replaces this code with an
access token, gets the user profile on GitHub and then uses the encrypted JWT session
to generate an HTTP-only cookie. This solution removes password management and
offers a safe, simple feel of signing in to the target technical candidate audience.
5.4 SECURITY DESIGN
InterviewAce provides security in several layers of the system architecture, the
authentication gateway all the way up to the database query layer. Every API route has
NextAuth session validation, such that at the authentication boundary, any request to
the system is rejected prior to running any business logic, unless it is authenticated.
The session JWT is ciphered with the environment variable NEXTAUTH_SECRET
and saved in an HTTP-only cookie, which cannot be accessed by the browser via
JavaScript.
28
At the database access layer, all the MongoDB queries are scoped explicitly to
the email or identifier of the authenticated user. It has no means by which the API
requests made by a user might access the session data, settings or profile records of
another user because all query predicates contain the authenticated user identifier as a
filter condition. This data isolation at the application level means that candidates will
not be able to get access to the session history and performance data of other
candidates via any API path.
The environment variables that hold sensitive credentials such as the MongoDB
connection string, NextAuth secret, OpenRouter API key, and GitHub OAuth
credentials are only revealed as environment variables on the server and are never
rendered to the frontend bundle. Next.js implements this separation by the use of its
build system that removes server-side environment variables in client-side code. All
client-server dialogues are made over HTTPS within the deployment environment in
production.
The safety constraint of the evaluation pipeline offers some form of output
```
integrity: it means that the scoring system is inaccessible to the candidates who are
```
prepared to respond with answers that will take advantage of the linguistic fluency bias
in the LLM or semantic similarity channels. The system restricts the ultimate score to
40 on responses containing severely incorrect conceptual content, preventing the
assessment integrity of the evaluation pipeline to adversarial input strategies.
29
CHAPTER 6
PROJECT DESCRIPTION
6.1 PROBLEM DEFINITION
Several real world and technological challenges confront the interview
preparation ecosystem and prevent the candidates to gain the organized competencies
and confidence to work successfully in the real interview settings. The key issues
brought about in the present picture are outlined below.
Absence of Conversational Simulation: The majority of current preparation aids
offer fixed banks of questions and already recorded model responses, but they do not
attempt to model the interactive nature of a real-life interview. Actual technical
interviews are interactive and dynamic in nature, and every question is based on the
situation created by the previous questions. Candidates that train on fixed tools learn to
be familiar with single questions, not with the turn-by-turn interaction that is a feature
of real sessions. It is one of the most important factors that lead to underperformance
of candidates despite proper technical knowledge because of the discrepancy between
the format of preparation and the format of interview.
Unreliability of Single-Method Evaluation Systems: The existing automated
evaluation tools are usually based on a single scoring scheme, all of which have well-
documented failure modes. Systems that match the keywords will reward the use of the
correct terms though not whether the candidate has a clear understanding of what is
behind the terminologies. Evaluators based on LLM only add a non-deterministic
scoring variance resulting in differences in results on repeated assessments of the same
responses. Semantic similarity systems reward topical relevance, but they are unable to
differentiate between a valid explanation and a fluent, but factually incorrect
explanation. There is no current system that integrates several evaluation signals to
30
offset these isolated weaknesses.
Lack of Multi-Dimensional, Explainable Feedback: Current platforms virtually
always offer outcome-level feedback, a score, a rating, or a binary pass or fail
evaluation, without giving a justification of how the evaluation was reached or what
exactly did the candidate get wrong in his or her response. Applicants who are given
such feedback cannot tell what about their response was lacking, whether it was a
conceptual, communicative or structural problem, or what specific improvement steps
they should take. Any feedback that lacks an explanation of what and why was wrong
is not very educational irrespective of how well the underlying score was calculated.
Absence of Longitudinal Performance Tracking: Current tools can seldom continue
to store candidate performance information across sessions in a tabular and queryable
format. With no history of sessions, trends of scores and dimensional skill breakdowns,
candidates will have nothing to base on to gauge improvement over time or to
determine areas that need long-term attention. This absence of continuity of analysis
diminishes the long term coaching value of repeated practice, where each session is in
effect initiated with an empty hand, without the added advantage of performance
intelligence.
High Cost and Availability Constraints of Human Feedback: Although offering
high-quality personalised feedback, human-based mock interview services are costly,
hard to schedule on a regular basis and rely on the presence of qualified reviewers who
possess domain knowledge applicable based on the role the candidate is targeting.
These limitations render the high-quality practice of mock interviews unavailable to
most applicants especially students and other professionals in the early stages who are
unable to afford high-quality coaching services.
6.2 INTRODUCTION TO PROPOSED SYSTEM
The increase in demand of technical interview preparation has made the
31
necessity of solutions with structured, intelligent and analytically based practice with
meaningful feedback at scale apparent. Although there are a few tools that fulfill
individual facets of this requirement, it is evident that a single system is lacking,
offering realistic conversational simulation, trustworthy multi-signal assessment,
explainable feedback, role-specific assessment, and longitudinal analytics in one
accessible system. The InterviewAce proposed system aims to fill this gap in a holistic
manner.
InterviewAce can make the interview preparation process easier by offering
candidates a practice and coaching experience that all happens on-end, with no need of
any technical setup, no need of scheduling with other humans and no need of a high-
end subscription. Every single step of the preparation process is managed within the
platform starting with the moment a candidate sets up their session up to the moment
they see their AI Coach Summary.
An important characteristic of the suggested system is the hybrid evaluation
engine that integrates the LLM-based concept evaluation system, the sentence-
embedding semantic similarity, and the clarity evaluation in a deterministic system of
weighted fusion. This architecture explicitly deals with the shortcomings of single-
method evaluation systems in reliability, through a combination of complementary
signals, whose respective failure modes are compensated by each other. The safety
constraint mechanism also enhances integrity of evaluation by avoiding fluency bias to
inflate scores of factually incorrect responses.
Role-specificity is a fundamental architectural attribute of the platform and not
an addition. Applicants are given over thirteen endorsed technical and professional
areas, and the question generation, reference answer selection, and assessment criterion
are adjusted to the job of choice, so that the practice experience corresponds to the real
demand of the interviews in the job area. The flexibility in terms of interview type and
32
level of difficulty also makes sure that the platform can accommodate the candidates of
the whole range of preparation needs.
All the facets of the feedback architecture are designed to be transparent and
explainable. The score breakdown identifies the input of each scoring channel towards
the overall outcome. A natural language explanation produced by the concept evaluator
is a human-readable explanation of the evaluation results These feedback layers
together make sure that the candidates get out of the session with a clear insight into
not only their current performance but also of the specific actions they require to take
to enhance the performance.
6.2.1 SYSTEM ARCHITECTURE
The architecture of the entire system of InterviewAce is built as a stratified
structure that distinctly separates the duties of the user interface, application logic,
evaluation pipeline, and data persistence layers to guarantee scalability,
maintainability, and evaluation reliability as the system scales.
The highest layer on the architecture is the Presentation Layer, which
encompasses all the elements of the interface presented to the user developed with
Next.js and React. This layer gives the interview set up page, the chat-style interview
session interface, the display of the evaluation feedback, the analytics dashboard, the
session history browser, the settings page, and the administrator research dashboard.
Role-based access control is used to assure interface rendered to a candidate and
interface rendered to an administrator have different capabilities and data.
Within the Application Layer is the Next.js API route handlers that are executed
in a serverless environment. All the important sessions such as session initialisation,
evaluation pipeline execution, follow-up question generation, session persistence, and
analytics aggregation are processed by these routes. NextAuth session validation is
used to enforce authentication on the edge of this layer, so that every operation is
33
authenticated by a verified user identity.
The main intelligence layer of the system is the Evaluation Pipeline. It
coordinates among three autonomous scoring modules, the LLM concept evaluator, the
MiniLM semantic similarity module, and the clarity assessment layer and synthesises
the result of the three modules using the deterministic weighted fusion formula with
the safety constraint imposed at the fusion stage.
MongoDB Atlas and Mongoose ODM are used to implement the Data Layer.
All the data of the platform is stored in four main collections: the sessions collection
that contains the records of the interview sessions, the usersettings collection that
contains per-user settings, the userprofiles collection that contains onboarding and
preference data, and the notes collection that contains notes related to candidate
preparation. At the application layer boundary, external services such as the
OpenRouter API, the Xenova Transformers runtime and the GitHub OAuth provider
are incorporated.
Fig.6.1 Overall System Architecture Diagram
34
6.3 MODULE DESCRIPTION
6.3.1 Evaluation Pipeline Module
The key technical contribution of InterviewAce, as well as the element that
contributed to the education value of the platform directly, is the evaluation pipeline
module. It is applied in the module of evaluation engine and coordinates three
complementary scoring channels via a deterministic weighted fusion process,
generating a credible and understandable evaluation of every candidate response.
A pipeline starts when a candidate enters a response via the interview interface
and gets the reference answer to a question in the question bank where it exists. With a
reference answer, the semantic similarity channel can compute the correspondence
with anticipated material, which offers a significant complement to the concept
evaluation. In case there is no reference answer, the pipeline would resort to providing
the concept score as a proxy of the semantic channel, which would guarantee the
continuity of the evaluation.
The LLM concept evaluator makes a question, the candidate answer, the
reference answer and a structured rubric based prompt to the configured language
model via the OpenRouter API. The prompt gives specific scoring requirements of
concept and clarity on a zero-to-ten scale, requests the model to recognize factual
errors within a special array field, requests a short natural language explanation, and
requires the response to be in a strict JSON format. The response will be parsed and
checked against the expected schema, and in case of a parsing failure, it will be retried
once and then will resort to a deterministic evaluation.
At the same time, the Xenova Transformers runtime calculates normalised
mean-pooled embeddings of the reference answer and the candidate answer with the
all-MiniLM-L6-v2 model. These embeddings are compared in terms of their cosine
similarity and converted to a zero-to-ten semantic score. It is a deterministic and
35
reproducible calculation that gives some stability that counterbalances the stochastic
variance of the LLM channel.
The combination of the three component scores is then achieved using weighted
```
fusion formula: Final Score = 10 × (0.55 × Concept + 0.30 × Semantic + 0.15 ×
```
```
Clarity). The outcome will be calculated as a whole number out of one-hundred. Safety
```
```
constraint is used before the final score is returned; in case the concept score is two or
```
less, then the final score is limited to forty, no matter what the semantic and clarity
values are. This eliminates the chances of well presented but essentially wrong answers
getting high marks that would mislead the candidate on the quality of their knowledge.
Fig.6.2 Hybrid Evaluation Pipeline Data Flow Diagram
36
6.3.2 Interview Session Module
The interview session module deals with the entire life cycle of an ongoing
interview since the candidate has submitted his or her configuration up to the end of
the session and generation of coach summary. It is applied in the main components of
the interview session page and the respective API routes, which is the interaction
between the user interface, the evaluation pipeline and the database persistence layer.
The API route that is used to start a session loads the persisted user settings of
the candidate to find out the configured AI model, temperature, interview length, and
scoring mode. It then picks a suitable opening question - defaulting to a standardised
opener - and sends the session identifier and opening question to the frontend. The
session page loads its state machine and starts the interview with the first question
being shown in the chat interface.
Each response the candidate makes is run through the evaluation pipeline by the
respond route, which forms a follow-up question prompt with the session history,
current evaluation scores, role-specific advice using prompts module, and the profile
context of the candidate, and posts this prompt to the LLM over the OpenRouter API.
The resulting interviewer response, with feedback commentary and the subsequent
question is sent back to the frontend and shown in the stream of chat. This will go on
until the set question limit has been met where one will mark the session as complete.
Upon completion, the entire route will sift the records of questions in the session
to maintain only the main interview questions, store all records in MongoDB with their
complete evaluation breakdowns and metrics, and call the AI Coach Summary
generator. The summary generator will create a formatted prompt with the data of the
evaluation of the session, and will ask a JSON response with the strengths,
improvement, and learning suggestions identified. In case of invalidity of the LLM
output, a fallback summary is obtained deterministically, based on session averages
37
and error patterns. The summary is saved in the session document and posted back to
the frontend to show up on the completion screen.
Fig.6.3 Interview Session Workflow Data Flow Diagram
38
CHAPTER 7
SYSTEM IMPLEMENTATION
7.1 OVERVIEW OF THE IMPLEMENTATION
InterviewAce implementation is aimed at creating a scalable, people-centric
system that lets people engage in structured mock interviewing and give high-quality,
explainable, multi-dimensional feedback on their answers without having to manually
schedule, get peers available, or subscribe to a service. The system is structured as a
modular Next.js application with each component having a defined functionality such
as authentication, organizing the interview, running evaluation pipeline, generating
feedback, session persistence, and performance analytics.
The core of the platform is a service-oriented architecture, where the
OpenRouter API running on the LLM to perform inference, the Xenova Transformers
library to run local semantic scoring, MongoDB Atlas to store data, and NextAuth to
authenticate users are integrated. The most architecturally important component is the
evaluation pipeline, which is a combination of three independent scoring channels via a
deterministic fusion mechanism that gives consistent and explainable scores despite the
input variability.
The system will guarantee the candidates a clear and transparent perspective of
their preparation process. Each session is maintained with its complete question-
answer-evaluation history, each score comes with a dimensional disaggregation and
natural language description, and each finished session creates a systematic coaching
report. These records are exposed during sessions via analytics dashboard to help track
longitudinal performance.
39
7.1.1 Role Based Access Control System
One of the major features of the implementation is role-based access control
system. The platform establishes two main categories of users, i.e., Candidate and
Administrator. Every role will be linked to the set of available features and data.
NextAuth generates an encrypted GitHub OAuth JWT session containing the
user email and profile when signing in via GitHub OAuth, which contains the email
and profile data of the user. A middleware, when validating this session on each
request to secured routes, forward unauthenticated users to the login page. The access
of administrators is based on a list of authenticated email against a pre-configured
administrator email list in the environment variables. The routes that are used to serve
the research analytics dashboard can service this check and send back a 403 response
in case of non-administrator requests.
Each route handler at the API layer starts with a call to getServerSession to
check the session and identify the authenticated user. Any further database queries are
limited to this identity, so that candidates can only see their own session records,
settings and profile data. This isolation at the application level will not allow cross-user
access to any data via an API endpoint.
7.1.2 Interview setup and question generation
The interview configuration system enables candidates to specifically build their
practice session corresponding to their preparation requirements. The setup page has
form controls to choose the target role among the over thirteen supported options, the
type of interview among the four available options and the level of difficulty. When
submitted, the start API route loads the persisted user settings of the candidate to
decide on the AI model, temperature, and length of the interview to use during the
session.
40
The two-path strategy is used in question generation. In case the configured role
and type combination contains a corresponding entry in the curated question bank, then
the bank is the first choice as a source of structured, reference-answer-supported
questions which support the semantic similarity evaluation channel. In the case of an
unmatched bank entry or when the AI generation path is activated, the start route via
the OpenRouter API provides a question generation prompt to the LLM with the role,
the type of interview, the difficulty, and the constraints of the context in which the
opening question should be generated.
The respond route is based on the generation of follow-up questions relying on
the entire session history, the current appraisal result, and a role-specific block of
guidance to create a prompt and advise the LLM to generate a question that is
contextually appropriate. The prompt identifies the stimulations of the interview type,
past quality of answers of the candidate and the context of the progress of the session
so that the follow up questions make sense relative to what the candidate has already
shown.
7.1.3 Implementation of Hybrid Evaluation Pipeline
The hybrid evaluation pipeline is applied into the evaluation engine module and
is the main technical contribution of the InterviewAce system. It is called on the
respond API route on each candidate answer and coordinates three independent scoring
channels and deterministic weighted fusion is applied.
The LLM concept evaluator constructs a rubric-based prompt that indicates the
question, the answer the candidate has, the reference answer in the presence of a
reference answer, explicit scoring instructions per score range, instructions to identify
factual errors and a strict JSON output requirement. This trigger is dispatched to the
configured model by the OpenRouter API client, which contains logic of exponential
backoff and a time limit of the initial throughput to prevent sluggish API reactions
41
from halting the assessment. Response is checked against the expected schema and a
fallback deterministic check is applied in case of failure to do so after the retry.
The semantic similarity module loads the Xenova Transformers runtime to load
all-MiniLM-L6-v2 model, which is cached upon initial loading. It calculates
normalised embeddings of the reference answer and the candidate response, computed
cosine similarity, clamped to the range of zero to one, and then remaps the range to a
range of zero to ten. This calculation is fully local and deterministic, and it introduces
stability to the pipeline that offsets stochasticity of the LLM.
The final score is computed as an integer by the weighted fusion step based on
```
the following formula Final Score = round(10 × (0.55 × concept + 0.30 × semantic +
```
```
0.15 × clarity)). The safety constraint check then checks whether the concept score is
```
two or less and in case it is, limits the final score to 40. The entire assessment outcome,
the total component scores, the errors detected, explanation and the final score are sent
back to the respond route to be part of the session record and the response feedback.
7.1.4 Feedback Generation and Coach Summary
The hybrid evaluation pipeline is applied into the evaluation engine module and
is the main technical contribution of the InterviewAce system. It is called on the
respond API route on each candidate answer and coordinates three independent scoring
channels and deterministic weighted fusion is applied.
The LLM concept evaluator constructs a rubric-based prompt that indicates the
question, the answer the candidate has, the reference answer in the presence of a
reference answer, explicit scoring instructions per score range, instructions to identify
factual errors and a strict JSON output requirement. This trigger is dispatched to the
configured model by the OpenRouter API client, which contains logic of exponential
backoff and a time limit of the initial throughput to prevent sluggish API reactions
from halting the assessment. Response is checked against the expected schema and a
42
fallback deterministic check is applied in case of failure to do so after the retry.
The semantic similarity module loads the Xenova Transformers runtime to load
all-MiniLM-L6-v2 model, which is cached upon initial loading. It calculates
normalised embeddings of the reference answer and the candidate response, computed
cosine similarity, clamped to the range of zero to one, and then remaps the range to a
range of zero to ten. This calculation is fully local and deterministic, and it introduces
stability to the pipeline that offsets stochasticity of the LLM.
The final score is computed as an integer by the weighted fusion step based on
```
the following formula Final Score = round(10 × (0.55 × concept + 0.30 × semantic +
```
```
0.15 × clarity)). The safety constraint check then checks whether the concept score is
```
two or less and in case it is, limits the final score to 40. The entire assessment outcome,
the total component scores, the errors detected, explanation and the final score are sent
back to the respond route to be part of the session record and the response feedback.
7.1.5 Session Persistence and Analytics.
The Mongoose Session model is used to store session data to MongoDB Atlas at
two stages of the session lifecycle. Per-question records are built up in frontend state
during active sessions. By placing the session into the entire API route, all question-
answer-evaluation records will be stored in one session document in MongoDB
together with the session configuration, overall score, evaluation method metadata, and
generated AI Coach Summary.
The analytics overview API route combines the session collection of the
authenticated user to generate the statistics on the personal analytics dashboard. The
aggregation calculates trends in scores as time goes by, dimensional averages across
the concept, semantic, and clarity channels, session distribution by interview type and
difficulty, and recent session summaries. The aggregations are carried out with
MongoDB aggregation pipelines, which are computed on the server side to accomplish
43
the computation efficiently.
The research analytics API pathway, which is only available to the
administrators, conducts wider aggregations on all sessions in the collection to
generate the statistical comparisons and visualisations on the research dashboard.
These aggregations are mean scores and standard deviation of each evaluation method,
histograms of scores distribution, correlation analysis among evaluation channels and
performance stratification by label of answer quality where research-tagged sessions
are present.
7.1.6 User Profile and Settings
The Mongoose UserSettings model stores user settings to MongoDB, with the
email of the authenticated user as a key. The settings document is where the selection
of the AI model, temperature, length of interview, mode of scoring, preference of voice
questions, preference of video recordings and preference of feedback display are stored.
Each time the session is initialised, the start route loads the settings document and sets
the values to the parameters of the LLM client and evaluation pipeline.
This user profile is stored in the UserProfile collection and filled in during the
onboarding flow first-time users go through on the first sign-in. The profile contains
the level of experience, the primary role, target roles and areas of focus of the
candidate as reported by the candidate. The AI Coach Summary uses this profile data
to personalise the prompts to follow-up questions and learning recommendations, so
that coaching advice can be delivered based on the context of the specific preparation
of the candidate.
7.1.7 Research Analytics Dashboard
The research analytics dashboard is an administrator-only tool that is meant to
facilitate the academic examination of the behaviour and scoring nature of the hybrid
44
evaluation pipeline. It is also availed via research path and secured by an administrator
email check in the server component which renders the page.
The dashboard summarizes assessment data by all the sessions in the MongoDB
collection and displays statistical differences between the concept, semantic and hybrid
scoring channels. Visualisations involve bar charts of mean scores, score distribution
histograms in five bins, a scatter plot of concept vs semantic scores using the colour-
coded labels of the answer quality, an effectiveness comparison chart with mean scores
per quality category and a weighted contribution stacked bar chart. The structured table
presents summary statistics such as mean, standard deviation and sample size of a
concept and a correlation coefficient of Pearson between concept and semantic scores.
7.2 SYSTEM TESTING
InterviewAce system testing was implemented with attention to the verification
of the correctness, consistency and reliability of the hybrid evaluation pipeline and the
performance of all platform features. The testing was conducted by combining
controlled unit-level testing of the evaluation pipeline components, end-to-end testing
of all the key user journeys, and a controlled experimental study with a balanced
synthetic dataset.
7.2.1 Functional Testing
Functional testing was conducted to ensure that all the key features of the
platform are acting as per their design. To ensure that GitHub OAuth sign-in works
properly to create sessions, that protected routes furnish unauthenticated requests with
proper redirects, and that administrator-only routes limit access to non-administrator
accounts, the authentication module was tested.
All combinations of supported role, interview type and difficulty selections were
tested, to ensure that session initialisation properly loads user settings, picks out the
45
right opening questions, and provides valid session identifiers. End-to-end testing of
the interview session module was done by providing responses of different quality and
ensuring that the evaluation pipeline provides structured breakdowns, that follow-up
questions make sense with the response to the prior answer, and that the session
appropriately ends when the desired number of questions has been reached.
Feature Test Scenario Expected Outcome Result
Authentication Sign in with
GitHub OAuth
Session created,
dashboard loaded
Pass
Session Config Select ML
Engineer,
Technical, Hard
Session initialised
with correct settings
Pass
Answer
Evaluation
Submit technically
correct answer
Concept score ≥ 7,
feedback generated
Pass
Safety Constraint Submit factually
incorrect answer
Final score capped at
≤ 40
Pass
Session
Completion
Complete 5-
question session
All records persisted,
summary generated
Pass
Analytics View score trends Charts render with
correct data
Pass
Settings Update AI model
selection
Settings persisted
across sessions
Pass
Admin Route Access research
dashboard as
candidate
403 response returned Pass
Table 7.1: Functional Testing Summary
46
7.2.2 Evaluation Pipeline Testing
The hybrid assessment system was experimented on the balanced synthetic
dataset containing 36 labelled responses in 12 technical, behavioral, system design and
HR questions. Each question had three variants of answers: one showing that the
respondent has full and perfect knowledge, another showing that she/he has only
partial knowledge or knowledge that is not so precise, and another showing that she/he
has false knowledge that is essentially flawed.
The findings supported the distinct and systematic score division in all three
quality categories with correct responses having a mean final score of about 71, partial
responses having about 60 and incorrect responses having about 34. This division
attests to the fact that the hybrid pipeline is a reliable way to differentiate between
high-quality, intermediate-quality, and poor-quality responses instead of generating a
thin-tailed undifferentiated distribution of scores.
7.2.3 Safety Constraint Validation
The safety constraint mechanism was also experimented by providing a series of
responses that attempted to capitalize on the vulnerability of the fluency bias namely,
responses that were linguistically well-constructed, used appropriate technical
vocabulary and were confidently expressed but with a deeply flawed underlying basic
reasoning.
The concept evaluator accurately detected the basic conceptual error and gave a
concept score of two or less, which activated the safety constraint in all test cases. All
```
test cases were rightly capped at 40; this proves that the constraint is working as
```
intended and that a high semantic similarity score and strong score on clarity cannot
override the cap in the presence of severe conceptual error.
7.2.4 API Security and Authentication Testing
47
Security testing was also done to ensure that the authentication and isolation of
data do the right job on the platform. The API routes were put to test by providing
requests without legitimate session tokens and ensuring that 401 responses were
received with no data being revealed. The administrator route was tested by trying to
access the route by using a non-administrator candidate account, and it was confirmed
that a 403 response was returned.
The validation of data scoping was done by ensuring that all session queries on
several test accounts returned only records of the authenticated user by email with no
cross-user data leakage by any API endpoint. All API routes were tested to input
validation with malformed payloads and ensure that schema validation did not accept
invalid inputs before any database operations can be performed.
Test Scenario Method Expected Behaviour Result
Unauthenticated API
request
No session token 401 Unauthorized
response
Pass
Admin route as
candidate
Valid non-admin
session
403 Forbidden
response
Pass
Cross-user session
access
Query another
user's sessions
No data returned Pass
Malformed
evaluation payload
Invalid JSON
body
400 Bad Request
response
Pass
Expired session Old JWT token Redirect to login page Pass
SQL injection in
settings
Malformed
query string
Sanitised, no error Pass
Table 7.2: Security Testing Scenarios and Outcomes
48
7.2.5 Integration Testing
To ensure proper communication between the platform and external services,
integration testing was performed. The integration of OpenRouter API was validated
by ensuring that evaluation prompts are properly structured and sent, structured JSON
responses are correctly decoded, and the fallback and retry logic correctly responds to
malformed or empty API responses. The Xenova Transformers semantic similarity
module was evaluated by ensuring that embeddings are computed at a variety of input
lengths, and that cosine similarity scores are consistently in the desired score range.
The MongoDB integration was verified by ascertaining that session documents
are properly written with all the necessary fields, aggregation queries can give accurate
results as compared to the original raw session data and that the connection pooling
provided by Mongoose can work under concurrent request conditions without a
connection exhaustion or a connection time out error.
7.2.6 Testing of Performance and Latency
The latency of evaluation was tested when scoring in deterministic-only mode
```
(when the semantic similarity module is not used) and hybrid mode (when the sentence
```
```
embedding computation is performed). Deterministic-only assessment took an average
```
of less than 100 milliseconds on average with all test inputs. Hybrid was about 200 300
milliseconds slower during the initial execution because of the cost of loading a model
at once, and subsequent executions took less than 150 milliseconds when the model
had been loaded into memory. The two latency profiles fall within acceptable ranges of
a conversational interview interface in which a short processing delay between
submission of answers and display of evaluations is normal and anticipated.
7.2.7 User-Level Testing
The user-level testing was performed at a basic level by providing a limited
49
number of participants with access to the platform and the opportunity to engage with
it and conduct entire interview sessions under various role configurations. The
participants were requested to complete some of the typical tasks which included the
```
following: signing in, setting up a session, answering questions, evaluation feedback
```
review and the analytics dashboard navigation. Noted that the chat-like interface was
easy to use and the feedback on evaluation was usually comprehensible. Certain
usability feedback was used to make slight adjustments to the display layout of the
feedback and the closing the session screen.
50
CHAPTER 8
RESULTS AND DISCUSSION
8.1 EXPERIMENTAL RESULTS
InterviewAce results were tested using actual session behaviour and a controlled
synthetic data experiment allowing the evaluation of the reliability and discrimination
power of the hybrid evaluation pipeline. The platform was subjected to realistic session
flows like user authentication, interview setup, answer-submission, evaluation-receipt,
coach-summary-generation, and reviewing analytics.
The goal of this assessment was to confirm that the platform provides a
seamless, consistent, and educationally valuable experience of interview preparation
and that the hybrid evaluation pipeline can reliably differentiate the levels of response
quality.
8.1.1 Hybrid Evaluation Pipeline - Score Distribution
The Dataset Overview panel is the first summary view of the research analytics
dashboard to display the total number of sessions completed, the total number of
individual answers assessed, the AI evaluation success rate, and the Pearson
correlation coefficient between the concept and the semantic scoring channels. All the
sessions have successfully evaluated successfully with a 100% AI success rate as
indicated in the dashboard, which confirms that the integration of the OpenRouter API,
the Xenova Transformers semantic module, and the fusion engine worked
continuously throughout all the answers recorded.
The Hybrid Score Components panel shows the three scoring channels
individually. The AI Concept Score channel, with a weight of 55% in the fusion
formula, had an average score of 48.3/100 on all of the answers assessed, and a
51
standard deviation of 27.80. This large standard deviation indicates the discriminative
behaviour desired of the scoring channel: the concept evaluator is actively trying to
draw a line between the factually correct, partially correct and incorrect answers by
scoring the different quality levels in a range of significantly different values, as
opposed to the scoring range scoring all responses in a small central range.
The weighted Semantic Similarity channel gave an average score of 52.5 out of
100 with a standard deviation of 23.50. This channel calculates the cosine similarity
between the candidate response embedding and reference answer embedding with all-
MiniLM-L6-v2 sentence transformer model. The small difference between the average
of the two channels is due to the fact that even partially correct answers usually
involve the use of vocabulary that is semantically close to the reference answer, but not
necessarily shows the correct underlying rationale.
The Final Hybrid Score, the combination of all the three channels by the formula
```
Score = 10x (0.55C + 0.30S + 0.15Cl), reported an average of 54.8 of 100 with a
```
significantly smaller standard deviation of 17.40. This decrease in variance, 37.4%
smaller than the concept channel’s variance, is a validation of one of the main design
objectives of the hybrid pipeline: the combination of three complementary signals
leads to a lower volatility of the output of any individual channel, resulting in a
smoother and more consistent final score. This reduction is specifically reported as a
major finding by the consistency analysis panel on the dashboard.
8.1.2 Score Distribution Histogram
The Distribution of Evaluation Scores chart of the research dashboard indicates
a grouped his- togram of all three channels in five score bins of 0 20, 21 40, 41 60, 61
80 and 81 100 to allow a visual comparison of the distribution of the scores across the
entire range.
52
The distribution of the AI Concept Score has the largest number of responses in
```
the 0-20 range (12 answers) indicating that the LLM concept evaluator scores very low
```
when it detects basic conceptual errors or erroneous core thinking. The distribution is
```
also significantly represented at 61-80 (10 answers) and moderately represented at 21-
```
```
40 and 41-60 (6 answers each), with just 2 answers in the 81-100 range. The spread
```
proves that the concept evaluator is very strict in the scoring criteria and does not
default score concentration at the upper range.
Semantic Similarity distribution is more centrally distributed with the highest
```
group of responses falling in the range of 21 40 (12 answers), the range of 61 80 (10
```
```
answers), 81100 (5 answers), and 4160 (6 answers). This trend is in line with the
```
proposed behaviour of embedding-based similarity: the answers with vocabulary
related to the domain are rated as moderate-to-good similarity scores despite having a
low conceptual accuracy, which is exactly what the concept channel fills in the hybrid
formula.
Final Hybrid Score distribution presents the most balanced and pedagogically
suitable distribution: 1 answer in 0-20, 11 in 21-40, 8 in 41-60, 13 in 61-80, 3 in 81-
100. This distribution underlies the fact that the fusion pipeline generates an outcome
that rewards truly great answers, correctly punishes bad ones, and concentrates most
middle-level-quality answers in the 41-80 range - precisely where they need to be in
order to be useful in coaching.
8.1.3 Statistical Summary and Correlation Analysis
The Statistical Summary panel presents mean scores, standard deviations, and
sample sizes for each evaluation method:
53
```
Method Mean (0–100) Std Dev (σ) Sample (n)
```
AI Concept Score 48.30 27.80 36
Semantic Similarity 52.50 23.50 36
Final Hybrid Score 54.80 17.40 36
Table 8.1 Hybrid Evaluation Pipeline — Statistical Summary
The Pearson correlation coefficient of the Concept Score and Semantic
Similarity channels is indicated on the dashboard as r = 0.020, which is within the
```
range of weak correlation (r≤ 0.5). This correlation is close to zero, which is a very
```
important and anticipated result: it proves that the two channels correlate significantly
different dimensions of answer quality. The concept evaluator checks factual accuracy
and structure of reasoning, and the semantic similarity module tests a surface-level and
vocabulary-level similarity of the answer to the reference. Such a high correlation
```
would be a sign of redundancy in the pipeline; the near-zero correlation that was
```
actually observed instead confirms that combining both channels would give
independent and complementary information that cannot be obtained by one channel.
The interpretation panel of the dashboard specifically points out that this low
correlation is an argument in favor of hybrid evaluation: semantic similarity by itself
does not represent conceptual correctness, and the combination of both is a better and
more reliable assessment than would be the case either individually.
8.1.4 Error Detection Effectiveness — Score Separation by Answer Quality
The research dashboard with the Error Detection Effectiveness chart shows the
mean score of the hybrid by the quality of answer category: Correct, Partial, and
Incorrect. This chart is the most straightforward test of whether the evaluation pipeline
54
is able to reliably differentiate between the responses of varying quality levels.
The results show clear and ordered separation across all three categories:
```
Answer Quality Mean Hybrid Score (0–100) Interpretation
```
Correct ≈ 71 Clearly above the pass threshold
Partial ≈ 60 Appropriately in the middle tier
Incorrect ≈ 34 Below the remediation threshold
Table 8.2 Mean Final Score by Answer Quality Category
The ranking μcorrect > μpartial > μincorrect remains consistently true with
significant differences between each level, as opposed to a continuous distribution that
would imply that the pipeline does not care about the quality of answers. Correct
answers would have a score of about 11 points above partial ones and partial answers
would have a score of about 26 points above incorrect ones. The bigger gap at the
lower end indicates the effect of the safety constraint: responses with the concept score
of two or less as returned by the LLM concept evaluator are limited in their maximum
final score to 40, so that the linguistically fluent but factually incorrect responses do
not get a rating that would mislead their holder about the quality of their knowledge.
8.1.5 Weighted Component Contribution Analysis
The Weighted Contribution of Evaluation Components chart further breaks
down the final hybrid score of each category of answer quality into its three weighted
```
component contributions: Concept Score (×0.55), Semantic similarity (×0.30) and
```
```
Clarity Score (×0.15). The stacked bar chart gives explicit insight into the contribution
```
of each channel towards the end product in relation to the levels of quality.
Under Correct answers, the concept contribution is the biggest segment, which
55
means that correct and complete answers are highly rated on the factual correctness
evaluation. The semantic contri- bution is also increasing proportionally, with correct
answers naturally containing a large amount of vocabulary with the reference answer.
Its contribution of clarity is small yet significant, as its weight is 15%.
In the case of Partial answers, concept contribution decreases in relation to
correct answers, but semantic contribution does not change much - indicating that
partially correct answers tend to make use of some of the correct terminology even
when the argument is not complete. This is the reason why the se- mantic similarity
would overestimate the partial answer quality compared to the hybrid score.
In the case of Incorrect answers, it results in the situation where the contribution
of concepts collapses under the impact of low concept scoring and safety constraint
cap. The semantic contribution also decreases although less drastically, which validates
that even wrong answers might have certain surface vocabulary in common with the
reference. The total cumulative height of the incorrect answers is significantly lower
than that of the other two categories, which validates the fact that the full hybrid
formula is able to identify and harshly punish bad responses.
8.2 EFFICIENCY OF THE PLATFORM WORKFLOW
The efficiency of the InterviewAce platform in its functioning was tested by
monitoring the re- responsiveness of all major user-facing operations when conducting
sessions using various role configurations and interview types.
Initialisation at the start of a session, including loading user settings in
MongoDB, choosing the question to open and show to the user, and relaying the
greeting and the first question back to the frontend took an average of two to four
seconds. Most of this latency can be ascribed to the response time of OpenRouter API
to greeting and question generation. This reaction time falls into the natural
56
conversational timing of an interview, and does not cause any obvious interruption to
the flow of the session.
Per-answer assessment and follow-up question generation - most
computationally demanding operations in the session workflow - took an average of
three to six seconds in hybrid evaluation mode. This is a variety of the LLM concept
evaluation API call, the local sentence embedding computation, the fusion formula
application, and the follow-up question generation. In deterministic-only mode of
evaluation, the evaluation step took less than 500 milliseconds, and the overall respond
route latency was mainly due to the API call to the follow-up question generation.
Initial loading cost of the all-MiniLM-L6-v2 sentence embedding model on one-
```
time loading added four to eight seconds to the initial evaluation in a session (cold
```
```
start) after which the model was loaded into memory and further evaluations took the
```
usual hybrid latency range. Average time to complete a session, such as AI Coach
Summary generation and MongoDB persist- tence was between three and five seconds.
Individual analytics dashboard visualization, comprising of session data
aggregation of Mon- goDB, was finished in a second. Settings are stored in less than
300 milliseconds. No time out errors, database connection failures and unhandled
evaluation exception were witnessed throughout the session conduct period.
8.3 PERSONAL ANALYTICS — USER PERFORMANCE INSIGHTS
```
The personal analytics dashboard (see Annexure II, Figure A.7) gives every
```
authenticated candidate a longitudinal overview of their performance in all the sessions
attended. Four major performance indicators are shown at the top of the dashboard:
total sessions completed, aver- age score throughout all the sessions, personal best
score, and percentage of improvement compared to the first session recorded.
57
Throughout the session data that is shown in the analytics dashboard, one
candidate that had 15 sessions had a mean score of 57%, a high score of 82, and an
upwards trend of improvement of +10% compared to the initial session. The score
progression chart indicates that there is an overall upward trend in the course of ten
sessions, and the normal variance demonstrates variations in questions difficulty and
the type of interview between the sessions. The skill radar chart is a visualisation of the
performance dimensional at a performance level of Knowledge Accuracy, Answer
Coverage, Communication Clarity and Overall performance, allowing candidates to
determine what dimension requires the most practice.
The panel of the session distribution displays the distribution of sessions by the
```
types of interviews: Technical (33%), Behavioral (27%), System Design (20%), and
```
```
HR (20%). This equal blend is an indication of the capabilities of the platform to cater
```
to candidates in all four interview categories as opposed to focusing the practice solely
in a single area. The difficulty levels panel divides difficulty of the session into easy,
medium and hard, and allows the candidate to follow their difficulty level progression.
The dashboard data shows that the session persistence is working properly in all
of the tested configurations, the aggregation queries get the right results in line with the
session records, and the chart display is properly reflecting the stored session data. The
Personal Analytics dashboard is both a user-facing coaching aid and a system-level
verification of the data pipeline, and ensures that the entire chain of submitting an
answer to evaluation, MongoDB persistence, and aggregation-based dashboard
rendering are all running correctly.
8.4 COMPARISON OF EXPECTED AND OBSERVED RESULTS
During the operation of the platform, all expected results were found and
proved. The sole mi- nor deviation observed was that there was occasional variation in
the specificity of natural language explanations of intermediate-quality responses - a
58
well-known behaviour of generative model behaviour in the mid-range of the quality
continuum. This variance is independent of the numerical score, which is
deterministically calculated as the weighted fusion equation, but could lead to a little
less targeted coaching commentary on borderline responses. The deterministic fusion
formula is an explicit alleviation of this limitation, and it guarantees that the final score
is pegged on the quantitative channel outputs, and not on the narrative output of the
LLM.
8.5 SYSTEM PERFORMANCE ANALYSIS
The system performance test confirms that InterviewAce can be used effectively
in the environment of individual use which is the main area of deployment of the
platform as per the current level of its development. All essential functions - session
initialisation, hybrid evaluation, session persistence and analytics aggregation - were
accomplished within a measured and controllable latency that is not inconsistent with
real-time interactive use.
There was no observed data integrity failures. All session records written to
MongoDB had full and properly typed in evaluation data in all necessary fields:
question text, candidate answer, concept score, semantic score, clarity score, final
hybrid score, error list identified, natural language explanation, and evaluation method
metadata. The results of the aggregation queries on the research and personal analytics
dashboards aligned with manual validation of the underlying session records in all the
tested cases.
The validation of the authentication tokens worked properly at every API
boundary. Correctly Rejected non-authenticated requests prior to any data being
accessed, and administrator-only routes prior to any aggregation data being provided.
None of the API endpoints tested had any cross-user data leaks.
The hybrid evaluation pipeline exhibited deterministic behaviour of the fusion
59
step and the safety constraint: with the same concept, semantic, and clarity scores, the
final score computation always yielded the same outcome. The source of output
variance that was presented by the LLM concept evaluator was, as it ought to be with
any generative model inference, yet was managed to be swallowed up by the
deterministic nature of the two other channels of the weighted fusion.
Overall, the findings substantiate the main design goal of InterviewAce, a
reliable, multi-dimensional, and explainable interview preparation system that
generates consistent evaluation results, ensures the integrity of data during the entire
lifecycle of the session, and provides actionable performance insights to applicants via
a longitudinal analytics inter- face.
60
CHAPTER 9
CONCLUSION AND FUTURE ENHANCEMENTS
9.1 CONCLUSION
InterviewAce was created to fix a type of problem that is easy to diagnose but
hard to do well: applicants who want to succeed in technical interviews need more than
just a set of questions to train on. They require a system that will assess the quality of
their responses on a variety of significant dimensions, describe what was good and bad
with sufficient specificity to direct them to improvement, and monitor their progress
over sessions so that practice can be translated into quantifiable changes. None of the
available candidate preparation tools offered all these features with reliability and in
one convenient and cost-effective platform.
This platform was designed as a full-stack Next.js app using TypeScript as the
codebase, and all major architectural decisions, such as the design of the hybrid
evaluation engine, the safety constraint mechanism, the architecture of the feedback
presentation, the schema of session persistence, and the analytics data model, were
designed with this core preparation requirement in mind. Not a consumer of lifeless
question content, not a user of a generic AI chatbot, but a candidate who will practice
purposefully and goal-oriented and will require a feedback that is both educationally
significant and technically correct.
The last implementation provides fulfillment of this aim in specific and
quantifiable terms. One can sign in and create a session in which they will take the
desired role and interview type, engage in a full conversational mock-interview with
dynamically-generated follow-up questions, receive multi-dimensional feedback with
precise error feedback and suggestion to improve each response, and view an AI Coach
Summary at the end of the session, and monitor performance trends across multiple
61
sessions, all in a single accessible platform that only requires a standard web browser
and an internet connection.
Technically, the project showed that a robust automated interview grading
system can be developed based on a hybrid multi-signal architecture of assessing
concepts using lisp machines, assessing semantic similarity using transformers and
assessing clarity using a deterministic fusion system, without the single-method
reliability issues that have plagued automated answer grading systems in the past. The
experimental findings of the balanced synthetic dataset validated distinct scores
separation in the correct, partial and incorrect answer quality categories, with the safety
constraint effectively avoiding the inflation of scores due to fluency bias with
fundamentally incorrect responses.
The functional implementations involving integrations with the OpenRouter API
to the LLM inference and Xenova Transformers runtime to the local semantic scoring
services interact with real services and generate real evaluation results. MongoDB
session persistence, NextAuth authentication, and analytics aggregation pipeline are
properly functioning with all the candidate workflows that have been tested. The
platform is a technically viable platform that can, over time, be used to help a
significant number of candidates preparing to have technical interviews in a wide
spectrum of jobs and fields.
The recognized drawbacks, such as the reliance on external LLM inference to
compute concept scores, the latency of semantic scoring of hybrid mode on a one-time
model load, the inability to adaptively change difficulty within-session, and the
inability to submit responses verbally, are candid admissions, but not failures. Any
production-grade system has constraints at any stage of its lifecycle of development. It
is only important that the evaluation basis is justified, the architecture is coherent and
extensible, and the way of filling all the gaps that may be identified is well-defined.
62
InterviewAce, in its simplest form, is a show that candidates training to be
interviewed by a technical interviewer should have an interview tool that takes their
practice seriously, assessing their answers rigorously, openly describing the
assessments it makes, and encouraging its users to develop their skills, not merely to
give them a list of questions and leave them to reflect on their own performance on
their own.
9.2 FUTURE ENHANCEMENTS
The existing implementation of InterviewAce offers a proven and scalable base,
and there are not a few clear directions of extending the capabilities of the platform.
Adaptive Difficulty Progression: The most educationally viable improvement would
be to have dynamic difficulty adjustment in the sessions. Instead of producing
questions with a consistent degree of difficulty, the system may add more complexity
to questions when performance is good and review the basics when large gaps are
identified. This would more closely emulate the adaptive calibration that practiced
human interviewers use and would realise the maximum coaching value of each
session.
Fine-Tuned Domain-Specific Evaluation Models: The evaluator in use is based on a
general-purpose language model. Refinement of a smaller, locally trainable model on a
hand-curated dataset of technical interview question-answer pairs with expert-labeled
evaluations would enhance the concept scoring accuracy, decrease evaluation latency,
remove the external API dependency, and enable the pipeline to operate in offline
settings. It would also be beneficial to the community at large to publish the fine-tuned
model as an open contribution.
Peer Mock Interview Scheduling: An option that enables the candidates to organize
mock sessions with other platform users, who can act as interviewers and the others as
interviewees, would be a nice addition to the AI-based experience with the human one.
63
The platform may support session matching, offer the hybrid evaluation pipeline, as an
optional scoring layer, when using peer session, and maintain peer session records in
the same analytics framework.
Mobile Application: A special custom React Native mobile application would provide
a much more satisfactory experience to those candidates who feel more at ease on their
phones and provide push notifications to remind them of a session, allow offline access
to session history, and a native keyboard and input experience that is mobile-friendly
in terms of submitting a response.
Community Contributions: Adding a system of community contributions of new
```
questions, reference answers and domain-specific additions (which must be reviewed
```
```
by the administrator) would enable the question library to expand itself without having
```
to focus significant curation effort on each new domain or specialisation.
Longitudinal Skill Gap Analysis and Study Plan Generation: The analytics layer
would be extended to run skill gap analysis that can determine the individual
dimensions of evaluation and areas of knowledge where a candidate has missed
opportunities to demonstrate the desired performance, and generate an effective study
plan with specific learning materials would turn the analytics dashboard into an active
coaching tool, rather than a passive review one.
9.3 SDG GOALS ADDRESSED – MAPPING
The suggested system, InterviewAce, helps to fulfill a number of Sustainable
Development Goals, established by the United Nations. It is meant to facilitate quality
education, economic empowerment, technological innovation, and decreased
inequality by intelligent digital infrastructure and available career preparation tooling.
SDG 4: QUALITY EDUCATION
InterviewAce facilitates convenient, organized, and independent learning
64
through allowing candidates to practice interview skills realistically and obtain
specific, educationally valuable feedback anytime and anywhere. The multi-
dimensional evaluation system available on the platform offers the type of concrete,
practical advice that can help candidates develop authentic technical and
communication skills instead of merely being familiar with the questions on the
surface, directly contributing to the objective of inclusive and quality education of all
learners irrespective of their ability to access institutional coaching opportunities or
formal mentorship.
SDG 8: DECENT WORK AND ECONOMIC GROWTH
The site directly aids the candidates in securing jobs in technical and
professional sectors by enhancing their interview preparation and making them more
competitive in the job market. InterviewAce helps to provide fairer access to decent
work by making high-quality interview preparation affordable to students and
professionals in early-career jobs, who cannot afford higher-priced coaching services,
and helps more of the overall population of candidates traditionally disadvantaged by
competitive hiring markets to participate in the economy.
SDG 9: INDUSTRY, INNOVATION AND INFRASTRUCTURE
InterviewAce uses the latest technologies such as large language models,
transformer-based sentence embeddings, serverless API architecture, and cloud-based
database infrastructure to create a scalable and technically novel evaluation platform.
The hybrid multi-signal scoring pipeline is a valuable addition to the applied research
product line in automated answer evaluation, which shows the potential of
65
deterministic fusion of complementary AI signals to generate more reliable evaluation
results than any single-method large-scale strategy. This project is contributing to the
larger aim of creating resilient, innovative, and inclusive technological infrastructure.
SDG 10: REDUCED INEQUALITIES
The platform also guarantees that every candidate, irrespective of institutional
affiliation, geographic location, or access to financial resources or professional
networks are offered equal quality in terms of interview preparation and feedback.
InterviewAce directly tackles the disparity in career preparation efforts by removing
the cost barrier of human coaching and by providing the platform to those with no
specialized hardware needs, only a standard web browser, and tier-two or tier-three city
applicants, first-generation graduates, and applicants who lack a strong professional
mentorship network.
66
CHAPTER 10
REFERENCES
[1] Achiam, J., Adler, S., Agarwal, S., Ahmad, L., Akkaya, I., Aleman, F. L., & OpenAI.
```
(2023). GPT-4 technical report. arXiv preprint arXiv:2303.08774.
```
[2] Bandarkar, L., Liang, D., Muller, B., Artetxe, M., Sheng, M. N., Sherif, D., &
```
Chaudhary, V. (2024). The Belebele benchmark: A parallel reading comprehension
```
dataset in 122 language variants. Proceedings of the 62nd Annual Meeting of the
Association for Computational Linguistics, 1, 749–775.
```
[3] Chen, L., Chen, P., & Lin, Z. (2024). Artificial intelligence in education: A systematic
```
review of large language model applications for personalized learning and assessment.
```
IEEE Transactions on Learning Technologies, 17(2), 312–329.
```
[4] Chiang, W. L., Zheng, L., Sheng, Y., Angelopoulos, A. N., Li, T., Li, D., & Stoica, I.
```
(2024). Chatbot Arena: An open platform for evaluating LLMs by human preference.
```
Proceedings of the 41st International Conference on Machine Learning, 235, 8287– 8315.
[5] Dubey, A., Jauhri, A., Pandey, A., Kadian, A., Al-Dahle, A., Letman, A., & Touvron,
H. (2024). The Llama 3 herd of models. arXiv preprint arXiv:2407.21783.
```
[6] Guo, B., Zhang, X., Wang, Z., Jiang, M., Nie, J., Ding, Y., & Wu, Y. (2023). How
```
close is ChatGPT to human experts? Comparison corpus, evaluation, and detection.
arXiv preprint arXiv:2301.07597.
[7] Kasneci, E., Sessler, K., Kuchemann, S., Bannert, M., Dementieva, D., Fischer, F., &
```
Kasneci, G. (2023). ChatGPT for good? On opportunities and challenges of large
```
language models for education. Learning and Individual Differences, 103, 102274.
[8] Kung, T. H., Cheatham, M., Medenilla, A., Sillos, C., De Leon, L., Elepano, C., &
```
Tseng, V. S. (2023). Performance of ChatGPT on USMLE: Potential for AI-assisted
```
67
```
medical education using large language models. PLOS Digital Health, 2(2), e0000198.
```
```
[9] Mizrahi, M., Kaplan, G., Malkin, D., Dagan, I., Shnarch, E., & Choshen, L. (2024).
```
State of what art? A call for multi-prompt LLM evaluation. Transactions of the
Association for Computational Linguistics, 12, 933–949.
```
[10] Wang, P., Li, L., Chen, L., Zhu, D., Lin, B., Cao, Y., & Liu, Z. (2024). Large
```
language models are not robust multiple choice selectors. Proceedings of the 12th
International Conference on Learning Representations.
[11] Kung, T. H., Cheatham, M., Medenilla, A., Sillos, C., De Leon, L., Elepano, C., &
```
Tseng,V. S. (2023). Performance of ChatGPT on USMLE: Potential for AI-assisted
```
```
medical education using large language models. PLOS Digital Health, 2(2), e0000198.
```
```
[12] Mizrahi, M., Kaplan, G., Malkin, D., Dagan, I., Shnarch, E., & Choshen, L. (2024).
```
State of what art? A call for multi-prompt LLM evaluation. Transactions of the
Association for Computational Linguistics, 12, 933–949.
```
[13] Reimers, N., & Gurevych, I. (2023). Sentence-BERT: Sentence embeddings using
```
Siamese BERT-networks. Proceedings of EMNLP 2023, 3982–3992.
[14] Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., &
```
Polosukhin,I. (2023). Attention is all you need. Advances in Neural Information
```
Processing Systems.
```
[15] Wang, P., Li, L., Chen, L., Zhu, D., Lin, B., Cao, Y., & Liu, Z. (2024). Large
```
language models are not robust multiple choice selectors. Proceedings of the 12th
International Conference on Learning Representations.
[16] Wei, J., Wang, X., Schuurmans, D., Bosma, M., Ichter, B., Xia, F., & Zhou, D.
```
(2023).Chain-of-thought prompting elicits reasoning in large language models.
```
Advances in Neural Information Processing Systems, 35, 24824–24837. 2201.11903
68
Annexure I
respond.ts
```
import { evaluateAnswer } from "@/lib/evaluation"
```
```
import { callAI } from "@/lib/ai/client"
```
```
import { buildResponsePrompt, validateResponsePrompt, type UserProfile } from
```
"@/lib/ai/prompts"
```
import { getNextQuestion, getReferenceAnswer } from "@/lib/questions"
```
```
export interface RespondParams {
```
```
question: string
```
```
answer: string
```
```
sessionHistory: Array<{ role: "user" | "assistant"; content: string }>
```
```
config: {
```
```
role: string
```
```
type: string
```
```
difficulty: string
```
```
}
```
```
}
```
```
export interface RespondResult {
```
```
score: number
```
```
overallScore: number
```
```
finalScore: number
```
```
breakdown: {
```
```
conceptScore: number
```
```
semanticScore: number
```
69
```
clarityScore: number
```
```
}
```
```
explanation: string
```
```
errors: string[]
```
```
evaluationMethod: "AI + MiniLM Hybrid"
```
```
feedback: string
```
```
strengths: string[]
```
```
improvements: string[]
```
```
metrics: {
```
```
overallScore: number
```
```
conceptScore: number
```
```
semanticScore: number
```
```
clarityScore: number
```
```
answerLength: number
```
```
responseTime: number
```
```
timestamp: string
```
```
}
```
```
nextQuestion: string | null
```
```
done: boolean
```
```
source: "ai" | "fallback"
```
```
debug?: {
```
```
aiAttempted: boolean
```
```
aiSuccess: boolean
```
aiError?: string
```
evaluationTime: number
```
```
referenceAnswerFound: boolean
```
70
```
}
```
```
}
```
```
export async function handleAnswer(params: RespondParams):
```
```
Promise<RespondResult> {
```
```
const startTime = Date.now()
```
```
const debug = {
```
```
aiAttempted: false,
```
```
aiSuccess: false,
```
```
aiError: undefined as string | undefined,
```
```
evaluationTime: 0,
```
```
referenceAnswerFound: false,
```
```
}
```
```
const referenceAnswer = getReferenceAnswer(params.question)
```
```
debug.referenceAnswerFound = Boolean(referenceAnswer)
```
```
const evaluationResult = await evaluateAnswer(
```
params.question,
params.answer,
```
{
```
```
role: params.config.role,
```
```
type: params.config.type,
```
```
difficulty: params.config.difficulty,
```
```
},
```
```
{
```
referenceAnswer,
```
aiModel: params.aiModel,
```
```
aiTemperature: params.aiTemperature,
```
71
```
}
```
```
)
```
```
const evaluationForPrompt = {
```
```
overallScore: evaluationResult.overallScore,
```
```
breakdown: evaluationResult.breakdown,
```
```
feedback: evaluationResult.explanation,
```
```
explanation: evaluationResult.explanation,
```
```
errors: evaluationResult.errors,
```
```
evaluationMethod: evaluationResult.evaluationMethod,
```
```
}
```
let feedback = evaluationResult.explanation
let nextQuestion: string | null = null
let done = false
let source: "ai" | "fallback" = "fallback"
```
export function validateRespondParams(params: any): params is RespondParams {
```
```
return (
```
typeof params === "object" &&
typeof params.question === "string" &&
typeof params.answer === "string" &&
```
Array.isArray(params.sessionHistory) &&
```
typeof params.config === "object" &&
typeof params.questionIndex === "number" &&
params.question.length > 0 &&
params.answer.length > 0
```
)
```
```
}
```
engine.ts
72
```
import { evaluateAnswerSync } from "@/lib/evaluation"
```
```
import { callAI } from "@/lib/ai/client"
```
```
import { selectQuestions } from "@/lib/questions/bank"
```
```
export interface InterviewConfig {
```
```
role: string
```
```
type: string
```
```
difficulty: string
```
```
}
```
```
export interface ProcessAnswerInput {
```
```
question: string
```
```
answer: string
```
```
history: Array<{ role: "user" | "assistant"; content: string }>
```
```
config: InterviewConfig
```
```
followUpCount: number
```
```
maxFollowUps: number
```
```
}
```
```
export interface InterviewResult {
```
```
evaluation: {
```
```
overall: number
```
```
breakdown: {
```
```
conceptScore: number
```
```
semanticScore: number
```
```
clarityScore: number
```
```
}
```
```
}
```
```
feedback: string
```
73
```
followUp: string | null
```
```
hasFollowUp: boolean
```
```
method: "hybrid" | "algorithmic" | "fallback"
```
```
confidence: number
```
```
debug: {
```
```
aiUsed: boolean
```
aiError?: string
```
decisionReason: string
```
```
processingTime: number
```
```
}
```
```
}
```
```
export async function processAnswer({
```
question,
answer,
history,
config,
followUpCount,
maxFollowUps
```
}: ProcessAnswerInput): Promise<InterviewResult> {
```
```
const startTime = Date.now()
```
```
const questions = selectQuestions(config)
```
```
if (questions.length > 0) {
```
const firstQuestion = questions[0]
```
return {
```
```
evaluation: {
```
```
overall: 100, // Greeting is always perfect
```
74
```
breakdown: { conceptScore: 10, semanticScore: 10, clarityScore: 10 }
```
```
},
```
```
feedback: "Welcome! Let's begin with your first question.",
```
```
followUp: firstQuestion.text,
```
```
hasFollowUp: true,
```
```
method: "hybrid",
```
```
confidence: 1.0,
```
```
debug: {
```
```
aiUsed: false,
```
```
decisionReason: "Initial greeting and first question",
```
```
processingTime: Date.now() - startTime
```
```
}
```
```
}
```
```
}
```
```
console.log("●◎’"´ Processing answer:", {
```
```
answerLength: answer.length,
```
followUpCount,
```
historyLength: history.length
```
```
})
```
```
const algorithmResult = evaluateAnswerSync(question, answer, {
```
```
role: config.role,
```
```
type: config.type,
```
```
difficulty: config.difficulty
```
```
})
```
```
export function getInterviewQuestion(config: InterviewConfig, usedQuestions: string[]
```
```
= []) {
```
75
```
const questions = selectQuestions(config)
```
```
return questions[0] || { id: "fallback", text: "Tell me about your experience.",
```
```
category: "general", role: "general", difficulty: "easy" }
```
```
}
```
```
export function debugInterviewSystem() {
```
```
const checks = {
```
```
aiKeyLoaded: !!process.env.OPENROUTER_API_KEY,
```
```
aiKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 10) + "...",
```
```
evaluationAvailable: typeof evaluateAnswerSync === 'function',
```
```
questionsAvailable: true
```
```
}
```
```
c o n s o l e . l o g ( " ˙•Q Interview System Debug:", checks)
```
return checks
```
}
```
semanticEvaluator.ts
```
import { pipeline, FeatureExtractionPipeline } from '@xenova/transformers'
```
let model: FeatureExtractionPipeline | null = null
let loading: Promise<FeatureExtractionPipeline> | null = null
```
export async function loadModel(): Promise<FeatureExtractionPipeline> {
```
```
if (model) return model
```
```
if (loading) return loading
```
```
loading = pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
```
```
.then((m) => {
```
```
model = m
```
```
loading = null
```
76
return m
```
})
```
```
.catch((err) => {
```
```
loading = null
```
throw err
```
})
```
return loading
```
}
```
```
export function cosineSimilarity(a: number[], b: number[]): number {
```
```
if (a.length !== b.length) throw new Error('Vector size mismatch')
```
let dot = 0, magA = 0, magB = 0
```
for (let i = 0; i < a.length; i++) {
```
dot += a[i] * b[i]
magA += a[i] ** 2
magB += b[i] ** 2
```
}
```
```
if (!magA || !magB) return 0
```
```
return dot / (Math.sqrt(magA) * Math.sqrt(magB))
```
```
}
```
```
async function embed(text: string): Promise<number[]> {
```
```
const m = await loadModel()
```
```
const output = await m(text, { pooling: 'mean', normalize: true })
```
```
return Array.from(output.data) as number[]
```
```
}
```
```
async function similarityScore(a: string, b: string): Promise<number> {
```
```
if (!a.trim() || !b.trim()) return 0
```
77
```
const [va, vb] = await Promise.all([embed(a), embed(b)])
```
```
const sim = cosineSimilarity(va, vb)
```
```
const clamped = Math.max(0, Math.min(1, sim))
```
```
return Math.round(clamped * 100) / 10
```
```
}
```
```
export async function semanticScore(
```
```
question: string,
```
```
answer: string
```
```
): Promise<number> {
```
```
return similarityScore(question, answer)
```
```
}
```
```
export async function semanticCorrectnessScore(
```
```
reference: string,
```
```
answer: string
```
```
): Promise<number> {
```
```
return similarityScore(reference, answer)
```
```
}
```
```
export interface SemanticEvaluation {
```
```
similarity: number
```
```
semanticScore: number
```
```
}
```
```
export async function evaluateSemanticSimilarity(
```
```
reference: string,
```
```
answer: string
```
```
): Promise<SemanticEvaluation> {
```
```
if (!reference.trim() || !answer.trim()) {
```
78
```
return { similarity: 0, semanticScore: 0 }
```
```
}
```
```
const [va, vb] = await Promise.all([embed(reference), embed(answer)])
```
```
const raw = cosineSimilarity(va, vb)
```
```
const similarity = Math.max(0, Math.min(1, raw))
```
```
return {
```
```
similarity: Math.round(similarity * 1000) / 1000,
```
```
semanticScore: Math.round(similarity * 100) / 10,
```
```
}
```
```
}
```
```
export const preloadModel = () => loadModel().then(() => {})
```
```
}
```
```
}
```
79
Annexure II
Fig. 10.1 Landing Page
Fig. 10.2 Signup Page
80
Fig. 10.3 New User Dashboard
Fig. 10.4 New Session Page
81
Fig. 10.5 Question Bank Page
Fig. 10.6 Learning Hub Page
82
Fig. 10.7 Notes Page
Fig. 10.8 Analytics Page
83
Fig. 10.9 GitHub Wrap Page
Fig. 10.10 Settings Page
84
Fig. 10.11 After Session Dashboard
Fig. 10.12 Live Interview Session Page
85
Fig. 10.13 End Interview Page
Fig. 10.14 Research Analytics Dashboard - Admin View
86
Fig. 10.15 Research Analytics Dashboard - Method Performance Over Sessions
87
Annexure III
```
Title: Sentence-BERT: Sentence Embeddings Using Siamese BERT-Networks
```
```
Authors: N. Reimers & I. Gurevych
```
Publication Year: 2023
```
Description:
```
The selected paper is used as a base reference because it presents some
modification of the BERT architecture resulting in semantically meaningful sentence
embeddings that are optimised to be used in tasks of comparison by cosine similarity.
It concentrates on how siamese and triplet network structures can be used to achieve
the same level of semantic matching between text pairs and the shortcomings of
standard BERT in scoring sentence-level similarities.
```
Summary:
```
```
Reimers and Gurevych (2023) show that Sentence-BERT generates embeddings
```
with reliable semantic capture, such that similarity-based scoring of similarity can be
automated and the cosine similarity output of similarity has a strong relationship with
human ratings of semantic similarity. The authors observe that embedding-based
scoring itself is insufficient to reflect the factual correctness or logical thinking because
semantically similar phrasing can still be an incomplete answer. The study also
determines like MiniLM do not compromise semantic alignment quality but instead
minimize computational costs, thus being viable to operate in the real-time context.
```
Conclusion:
```
The present system, InterviewAce, expands on this base by adding a semantic
similarity scorer based on MiniLM with 30% of the weighted final hybrid score,
complementing the LLM concept evaluator and clarity assessor to generate a more
robust and reproducible evaluation than any other channel individually.
88
Annexure IV
1. Paper Publication
89
Annexure V
```
Program Outcomes (POs)
```
```
(Program outcomes stated by NBA)
```
Engineering Graduates will be able to
```
PO1: Engineering Knowledge: Apply knowledge of mathematics, natural science, computing,
```
engineering fundamentals and an engineering specialization to develop to the solution of complex
engineering problems.
```
PO2: Problem Analysis: Identify, formulate, review research literature and analyze complex
```
engineering problems reaching substantiated conclusions with consideration for sustainable
development.
```
PO3: Design/Development of Solutions: Design creative solutions for complex engineering problems
```
and design/develop systems/components/processes to meet identified needs with consideration for the
public health and safety, whole-life cost, net zero carbon, culture, society and environment as required.
```
PO4: Conduct Investigations of Complex Problems: Conduct investigations of complex engineering
```
problems using research-based knowledge including design of experiments, modelling, analysis &
interpretation of data to provide valid conclusions.
```
PO5: Engineering Tool Usage: Create, select and apply appropriate techniques, resources and modern
```
engineering & IT tools, including prediction and modelling recognizing their limitations to solve
complex engineering problems.
```
PO6: The Engineer and The World: Analyze and evaluate societal and environmental aspects while
```
solving complex engineering problems for its impact on sustainability with reference to economy,
health, safety, legal framework, culture and environment.
```
PO7: Ethics: Apply ethical principles and commit to professional ethics, human values, diversity and
```
```
inclusion; adhere to national & international laws.
```
```
PO8: Individual and Collaborative Team work: Function effectively as an individual, and as a
```
member or leader in diverse/multi-disciplinary teams.
```
PO9: Communication: Communicate effectively and inclusively within the engineering community
```
and society at large, such as being able to comprehend and write effective reports and design
documentation, make effective presentations considering cultural, language, and learning differences.
```
PO10: Project Management and Finance: Apply knowledge and understanding of engineering
```
management principles and economic decision-making and apply these to one’s own work, as a
member and leader in a team, and to manage projects and in multidisciplinary environments.
```
PO11: Life-Long Learning: Recognize the need for, and have the preparation and ability for i)
```
```
independent and life-long learning ii) adaptability to new and emerging technologies and iii) critical
```
thinking in the broadest context of technological change.