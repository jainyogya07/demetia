Yes. This problem statement is much broader than “make some memory games.” For SIH, the winning solution should look like a complete AI-assisted dementia-care ecosystem for the NER, where games are only one component.

I went through the problem statement, current dementia evidence, existing digital solutions, NER-specific data, Indian healthcare infrastructure, and the research around cognitive stimulation. There is a very strong opportunity here.

1. First: Deep Analysis of the Problem Statement

1.1 What is the actual problem?

The PS is essentially asking you to solve five connected problems:

Problem 1 — Cognitive decline

A dementia patient can experience:

* Short-term memory loss
* Difficulty recognizing people/objects
* Reduced attention
* Confusion
* Difficulty solving simple problems
* Difficulty following routines
* Loss of orientation
* Communication difficulties

WHO specifically lists forgetting recent events, getting lost, confusion, difficulty solving problems, difficulty following conversations and difficulty performing familiar tasks among common symptoms.  

So your platform needs to address multiple cognitive domains, not only memory.

⸻

Problem 2 — Lack of continuous cognitive engagement

Traditional dementia care often depends heavily on:

* family members
* caregivers
* doctors
* therapists
* physical cognitive activities

But a doctor cannot continuously interact with the patient.

This is where your platform becomes a daily cognitive companion.

Instead of:

Patient → visits doctor → assessment → goes home

you want:

Patient → interacts daily → system observes performance → adapts activities → caregiver receives meaningful progress information → doctor can review trends.

That is a much stronger architecture.

⸻

2. The Most Important Insight: Don’t Build a “Dementia Game App”

This is where I think your team can differentiate itself.

There are already platforms doing cognitive games.

For example, CogniFit already provides personalized cognitive training, assessments, adaptive difficulty and tracking across 20+ cognitive abilities.  

MindMate already combines brain games, physical activities, nutrition and social engagement for people with cognitive decline.  

And research supports cognitive stimulation as a useful non-pharmacological intervention, particularly for mild-to-moderate dementia. A Cochrane review of 36 studies involving 2,704 participants found a small cognitive benefit from cognitive stimulation, along with some benefits in communication, social interaction, quality of life and mood.  

So:

“We made AI memory games” is not enough for SIH.

Your innovation needs to be:

AI + dementia-specific cognitive assessment + personalized reminiscence + NER cultural context + caregiver intelligence + offline-first healthcare + longitudinal patient modelling.

That’s where the real opportunity is.

⸻

3. Understanding the Indian Dementia Situation

The national numbers are already significant.

A nationally representative LASI/LASI-DAD study estimated dementia prevalence among Indians aged 60+ at 7.43%, corresponding to approximately 8.8 million people.  

The study also found:

Group	Dementia prevalence
60–64	2.94%
65–69	4.01%
70–74	10.30%
75–79	13.34%
80–84	16.25%
85+	25.41%

This is extremely important for your AI model.

Why?

Because age should be part of the patient’s baseline model.

A 65-year-old getting 60% on a memory game shouldn’t automatically be compared with an 85-year-old.

You need:

Age-adjusted + education-adjusted + language-adjusted + baseline-adjusted cognitive trajectories.

⸻

4. Rural vs Urban Is Extremely Important

The same study found:

Population	Dementia prevalence
Urban	5.34%
Rural	8.35%

And education makes an even bigger difference:

Education	Prevalence
No formal education	10.29%
Primary school or less	4.52%
Middle school or higher	1.54%

This is directly relevant to NER.

A game based on:

alphabet recognition → English words → abstract mathematical puzzles

could perform badly for someone who simply didn’t receive formal education.

That doesn’t necessarily mean cognitive decline.

Therefore, your system needs to distinguish:

cognitive difficulty

from

education/language/interface difficulty.

This can become one of your strongest AI innovations.

⸻

5. Female Elderly Population

The national study reported:

* Male: 5.77%
* Female: 9.03%

But the authors found that much of this difference is associated with age and education differences rather than sex itself after adjustment.  

Therefore don’t build a simplistic:

Female = higher risk

model.

Instead:

Age + education + cognitive performance + health factors + functional ability + longitudinal change.

That’s scientifically much stronger.

⸻

6. The NER Is Where Your Problem Becomes Interesting

The nationally representative study provides a particularly useful finding:

Assam

Estimated dementia prevalence among 60+:

8.47%

Estimated people with dementia:

* ~201,000 in 2016
* projected ~456,000 in 2036 if prevalence remains constant.  

That’s a huge number for one state.

For the other NER states collectively excluding Assam, the study estimated:

7.35%

with an estimated:

* ~83,000 people in 2016
* ~199,000 projected in 2036.  

However, there’s an important methodological caveat:

The study does not provide equally reliable state-specific estimates for every NER state.

The authors explicitly say the LASI-DAD sample provides national representation but not state-level representation; state estimates rely partly on imputation.  

This is actually an opportunity for your project.

⸻

7. NER State-by-State Situation

There are 8 NER states:

1. Assam
2. Arunachal Pradesh
3. Manipur
4. Meghalaya
5. Mizoram
6. Nagaland
7. Tripura
8. Sikkim

But don’t claim that we have equally strong dementia epidemiological data for each.

Instead, use available estimates + elderly population + healthcare accessibility + cognitive-care infrastructure.

AI/ML-based estimates

A separate machine-learning study using LASI data produced the following state estimates:

State	Estimated dementia prevalence*
Arunachal Pradesh	~6–8% range
Assam	~8–9%
Manipur	5.11%
Meghalaya	8.43%
Mizoram	8.89%
Nagaland	4.54%
Tripura	9.05%
Sikkim	Data limitations

*These are model-based estimates and should not be presented as definitive clinical prevalence measurements. The ML study itself is an estimation exercise.  

The much safer headline for your SIH presentation is:

“Available national datasets indicate substantial cognitive-health burden across the NER, but state-level evidence remains limited and uneven.”

That statement is defensible.

⸻

8. Assam Should Probably Be Your Initial Pilot State

There is a very good reason.

Assam has:

* the largest population among NER states
* substantial rural population
* an estimated dementia prevalence of around 8.5% among 60+
* existing geriatric infrastructure
* Guwahati Medical College as an important regional healthcare centre.

The Ministry of Health has previously documented NPHCE geriatric services in Assam, including geriatric OPDs, wards and community-level clinics.  

There is also direct evidence from rural Assam showing a substantial burden of cognitive impairment among elderly populations. A recent geriatric study reported 35% mild cognitive impairment, 30.7% moderate impairment and 1% severe impairment among its study population in rural Assam, although these figures describe cognitive impairment in that particular study population and should not be interpreted as dementia prevalence for Assam as a whole.  

That distinction will make your research much more credible.

⸻

9. NER Is Not Just About Dementia

This is another major insight.

Older adults in NER have significant non-communicable disease burden.

A study using LASI data reported the following proportion of older adults with at least one NCD:

State	Any NCD among 60+
Sikkim	65.89%
Tripura	51.25%
Assam	48.00%
Manipur	46.72%
Mizoram	46.48%
Meghalaya	39.28%
Arunachal Pradesh	37.46%
Nagaland	21.29%

This matters because dementia doesn’t exist in isolation.

WHO identifies hypertension, diabetes, obesity, depression, hearing/vision impairment, poor sleep, stroke, smoking, harmful alcohol use, physical inactivity, social isolation and low educational attainment among dementia risk factors.  

Therefore your platform can eventually become:

Cognitive + Functional + Lifestyle + Caregiver platform

rather than simply:

Cognitive game platform.

⸻

10. Existing Solutions — Where They Already Solve the Problem

Let’s map the current ecosystem.

Existing solution type	What it does	Your opportunity
Brain-training apps	Games & cognitive exercises	Make them dementia-specific
Adaptive cognitive platforms	Difficulty adjustment	Add longitudinal patient modelling
Reminders	Medicines/tasks	Connect reminders to cognitive state
Telemedicine	Doctor access	Integrate cognitive trend reports
Caregiver apps	Patient monitoring	Add AI-generated insights
Memory/reminiscence apps	Photos/music/stories	Make them culturally NER-specific
Cognitive assessment tools	MMSE/MoCA-style testing	Continuous passive assessment
Wearables	Activity/sleep monitoring	Combine with cognitive trajectory

CogniFit, for example, already dynamically adjusts training based on user performance.  

MindMate combines games with physical activity, nutrition and social engagement.  

So don’t try to compete simply on number of games.

⸻

11. Your Biggest Innovation: “Memory From Life”

This is where I think your team could build something genuinely impressive.

Instead of generic:

“Remember these 5 objects.”

Create:

Personal Memory Bank

The caregiver uploads:

* patient’s name
* family members
* photographs
* hometown
* occupation
* favourite songs
* favourite foods
* important places
* festivals
* childhood memories
* spouse/children
* daily routine

Then AI converts these into games.

Example:

Patient:

Born in Shillong
Former school teacher
Loves traditional music
Daughter = Anjali
Favourite food = rice + fish
Married in 1975

The platform could generate:

Game:

“Who is this?”

Show family photograph.

“What is your daughter’s name?”

Then:

Reminiscence game

“You lived in Shillong. Which place do you remember?”

Then:

Audio memory

Play familiar music.

Ask:

“Do you remember this song?”

This is far more dementia-centric than generic Sudoku.

⸻

12. NER Cultural Memory Engine

This could become your signature feature.

Instead of generic games, create a:

NER Cultural Cognitive Library

Potential content categories:

Assam

* Bihu
* Assamese music
* local foods
* Assamese names
* tea gardens
* traditional objects
* local landmarks

Meghalaya

* Khasi/Garo cultural elements
* local landscapes
* traditional music
* festivals

Manipur

* Manipuri cultural elements
* traditional music/dance
* local landmarks

Mizoram

* Mizo cultural elements
* songs
* local traditions

And similarly for:

* Nagaland
* Tripura
* Arunachal Pradesh
* Sikkim

The key is not merely translation.

It’s:

Cultural familiarity → better engagement → better participation → better longitudinal data.

You should validate that hypothesis with clinicians/users rather than claiming it automatically improves cognition.

⸻

13. Multilingual AI Should Be Deeper Than Translation

Don’t just put:

English → Hindi → Assamese

button.

Build:

Voice-first interaction

Patient says:

“আজিৰ ঔষধটো খালোঁ নে?”

The system understands:

“Did I take today’s medicine?”

Then responds verbally.

This is particularly important because the national dementia study itself used trained interviewers fluent in English plus local languages during cognitive assessments.  

That tells us language is not a trivial UI issue in cognitive assessment.

⸻

14. Your AI Cognitive Engine

This should be the brain of the platform.

Instead of storing:

Game score = 72

store:

Patient Cognitive Profile
Memory                 62
Attention              71
Processing Speed       55
Recognition            76
Orientation             60
Problem Solving         58
Language                69
Emotional Engagement    73

Then track:

Week 1
Week 2
Week 3
Week 4
...

The important variable becomes:

Rate of change

not simply:

Current score

⸻

15. AI Should Detect Patterns

For example:

Patient scores:

Memory:
78 → 76 → 74 → 70 → 66
Attention:
72 → 74 → 73 → 72 → 71
Recognition:
81 → 82 → 80 → 81 → 80

The system could flag:

Potential decline in memory performance

But importantly:

It should NOT say:

“Patient has dementia.”

Instead:

“A sustained decline in memory-game performance has been observed over the last 4 weeks. Consider caregiver/clinical review.”

This distinction is extremely important medically.

Your platform should be positioned as:

support + monitoring + screening assistance

rather than:

AI diagnosis of dementia.

⸻

16. A Much Better AI Model

You could build a:

Cognitive Digital Phenotype

Inputs:

Cognitive

* game accuracy
* reaction time
* mistakes
* completion time
* hints requested
* difficulty level

Behavioural

* missed sessions
* session duration
* frustration
* abandonment
* repeated errors

Functional

* medication adherence
* hydration
* daily routine
* appointments

Voice

* response latency
* speech rate
* pauses
* word retrieval difficulty

Optional wearable

* sleep
* steps
* activity
* heart rate

Then:

AI produces

Cognitive Trend Score

not a diagnosis.

⸻

17. One Very Strong Innovation: “Explainable AI”

Don’t just show:

Cognitive Score = 63

Show:

Why did the score change?

↓ Memory
   - 18% lower recall accuracy
   - 12% slower response
   - 3 additional hints required
→ Attention
   - stable
↑ Recognition
   - improved 9%

Then caregiver understands what is actually happening.

⸻

18. Another Strong Innovation: Adaptive Difficulty

Suppose patient succeeds:

90%
95%
92%

AI increases difficulty.

If:

45%
40%
38%

AI decreases difficulty.

But make it more intelligent:

Don’t immediately reduce difficulty.

First determine whether the problem is:

* cognitive decline
* fatigue
* hearing problem
* vision problem
* language mismatch
* device difficulty
* frustration
* environmental distraction

This makes your AI considerably more sophisticated.

⸻

19. “Mood-Aware Gaming”

Another potential innovation.

Before the game:

Voice interaction:

“How are you feeling today?”

Patient answers.

AI analyses:

* speech
* response
* self-reported mood

Then selects appropriate activities.

Low mood

→ music + reminiscence

High anxiety

→ familiar/simple activity

Good mood

→ challenging cognitive game

Fatigue

→ shorter session

This follows the broader evidence that dementia care should address mood, social engagement and wellbeing—not just cognitive scores.  

⸻

20. “Memory Rescue Mode”

This could be another standout feature.

Suppose patient is confused.

The app can display:

Good Morning, Mr. Sharma

Then:

Today is Monday.

Your daughter Anjali will visit you today.

Your medicine is at 8 PM.

You are currently at home.

Your next appointment is Thursday.

This becomes a:

Digital Orientation Assistant

It directly targets orientation difficulties that are common in dementia.  

⸻

21. “Daily Life Training”

Don’t restrict cognitive training to games.

Create simulations:

Grocery game

Buy ₹100 worth of items.

Medicine game

Which medicine should you take at 8 PM?

Calendar game

Doctor appointment is Thursday. What day is tomorrow?

Kitchen safety

Which item should not be left on?

Route memory

Where is the clinic?

This moves your solution toward cognitive rehabilitation, which focuses on helping people manage meaningful everyday activities.  

⸻

22. Social Cognitive Gaming

Dementia isn’t only an individual problem.

WHO highlights social isolation and the effects on carers and families.  

So build:

Family Mode

Grandchild + grandparent

can play together.

Example:

“Grandma’s Memory Challenge”

The child uploads:

* family photos
* old songs
* family stories

The grandparent answers questions.

This turns cognitive training into:

family interaction.

That is a powerful emotional component.

⸻

23. Caregiver Dashboard

The caregiver shouldn’t see 50 graphs.

They should see:

Today’s Summary

🧠 Cognitive status       Stable
💊 Medication             100%
💧 Hydration              80%
🎮 Engagement             High
😊 Mood                   Positive
😴 Sleep                  Normal
⚠️ Attention              Slight decline

Then:

AI Insight

“Memory performance has declined for three consecutive sessions. Attention and recognition remain stable.”

That is useful.

⸻

24. Caregiver Burnout Should Also Be Addressed

This is an important part of the problem that many teams will miss.

A 2024 scoping review identified caregiver burden, stress, poor health, insufficient respite care and lack of information as major issues in Indian dementia caregiving.  

A newer nationally representative analysis of LASI-DAD data also found that caregivers/informants of people with cognitive impairment experienced higher stress and poorer mental health, with greater caregiving responsibility worsening the impact.  

So your platform can include:

Caregiver Mode

* daily care checklist
* medication status
* patient behaviour
* educational material
* emergency contact
* caregiver workload
* simple self-care reminders

⸻

25. Offline-First Architecture Is Critical

This is explicitly in the PS.

Don’t build:

App → API → server → AI → response

for every interaction.

Instead:

                 INTERNET
                    ↓
             Cloud AI Server
                    ↓
             Model Updates
                    ↓
        ┌─────────────────────┐
        │     MOBILE/TABLET   │
        │                     │
        │ Offline Game Engine │
        │ Local Patient Data  │
        │ Local AI Model      │
        │ Voice Model         │
        │ Reminder Engine     │
        └─────────────────────┘
                    ↓
              Sync when online

This is a major differentiator for remote NER.

⸻

26. Store-and-Forward Healthcare

If the patient is offline:

Patient plays 5 games
        ↓
Results stored locally
        ↓
No internet
        ↓
Patient continues
        ↓
Internet returns
        ↓
Encrypted sync
        ↓
Caregiver dashboard updated

This is much more realistic than assuming continuous connectivity.

⸻

27. You Can Integrate Existing Indian Digital Healthcare Infrastructure

India already has large digital-health infrastructure.

For example, eSanjeevani has been deployed nationally as India’s telemedicine service and had crossed hundreds of millions of consultations by 2024.  

The National Tele-Mental Health Programme, Tele-MANAS, is also designed to provide accessible tele-mental-health services with links to specialist and in-person care.  

Therefore your platform should not try to replace the healthcare system.

Instead:

Patient
   ↓
Cognitive Platform
   ↓
AI monitoring
   ↓
Caregiver
   ↓
Healthcare Worker
   ↓
Doctor / Specialist
   ↓
Telemedicine referral

That makes your project much more scalable.

⸻

28. Data Privacy Must Be a Core Feature

You are dealing with:

* medical information
* cognitive scores
* voice recordings
* family information
* photographs
* medication information
* potentially location data.

So security should be part of the architecture.

ABDM’s privacy framework emphasizes consent-based collection/use of personal data, purpose limitation and restrictions on transferring data without consent.  

Your system should therefore include:

Security

* encryption at rest
* encryption in transit
* role-based access
* caregiver consent
* patient consent/assent where appropriate
* audit logs
* minimal data collection
* local encrypted storage
* secure synchronization

⸻

29. The Most Interesting Dataset You Could Create

This could become a long-term research asset.

Build:

NER Cognitive Health Dataset

With consent, collect anonymized:

Age
Gender
Education
Language
Location type
Cognitive scores
Game performance
Response time
Voice features
Daily routine adherence
Mood
Sleep/activity
Caregiver observations
Clinical assessment where available

Over time you could build:

India/NER-specific longitudinal cognitive dataset

This is significantly more valuable than just building an app.

⸻

30. Your AI Training Strategy

Don’t immediately try to train a huge deep-learning model.

Start with:

Phase 1

Rule-based + statistical adaptive engine.

Example:

if accuracy > 85%:
    difficulty += 1
if accuracy < 50%:
    difficulty -= 1

Then:

Phase 2

Machine learning:

* Random Forest
* XGBoost
* Logistic Regression
* LightGBM

for:

cognitive trend classification

Then:

Phase 3

Sequence modelling:

* LSTM
* Temporal Transformer

for:

longitudinal cognitive trajectory.

⸻

31. One Very Important Scientific Point

You should not claim:

“Our games cure dementia.”

or:

“Our AI diagnoses dementia.”

Current evidence does not support such claims.

The Alzheimer’s Society notes that brain-training activities can improve memory/thinking in some contexts, but evidence that generic brain training prevents dementia is not strong.  

Cognitive stimulation has stronger evidence for modest short-term benefits, particularly in mild-to-moderate dementia.  

Therefore your language should be:

Good

“supports cognitive stimulation”

“assists monitoring”

“identifies changes in cognitive performance”

“supports caregiver decision-making”

“facilitates early screening and referral”

Avoid

“cures dementia”

“diagnoses Alzheimer’s”

“prevents dementia”

⸻

32. What I Think Your Final Product Should Look Like

I’d structure the entire product as:

AI Dementia Companion

                    ┌──────────────────────┐
                    │      PATIENT         │
                    └──────────┬───────────┘
                               │
                    Voice / Touch Interface
                               │
          ┌────────────────────┼────────────────────┐
          ↓                    ↓                    ↓
   Cognitive Games       Memory Assistant      Daily Assistant
          │                    │                    │
          ↓                    ↓                    ↓
    AI Adaptation       Personal Memory      Medicines/Routine
          │                    │                    │
          └────────────────────┼────────────────────┘
                               ↓
                    Cognitive AI Engine
                               │
          ┌────────────────────┼────────────────────┐
          ↓                    ↓                    ↓
    Trend Analysis        Mood/Engagement      Risk Signals
          │                    │                    │
          └────────────────────┼────────────────────┘
                               ↓
                    CAREGIVER DASHBOARD
                               │
                               ↓
                    HEALTHCARE WORKER
                               │
                               ↓
                     DOCTOR / SPECIALIST

⸻

33. Your Five Core Innovation Pillars

If I were presenting this at SIH, I’d reduce the innovation to these five pillars:

1. 🧠 Adaptive Cognitive Engine

AI continuously adjusts games based on:

* accuracy
* response time
* cognitive domain
* fatigue
* baseline
* longitudinal performance.

⸻

2. 🏡 Personal Memory + Reminiscence Engine

The platform learns the patient’s:

* family
* places
* photographs
* music
* occupation
* stories
* routine.

Then generates personalized cognitive activities.

⸻

3. 🌄 NER Cultural Intelligence Layer

Games and interactions adapt to:

* regional language
* culture
* festivals
* music
* food
* geography
* familiar objects
* local stories.

⸻

4. 📊 Cognitive Digital Twin

Maintain a longitudinal representation:

Patient
   ↓
Cognitive profile
   ↓
Daily observations
   ↓
Trend
   ↓
Deviation
   ↓
Caregiver alert

This is much more sophisticated than a simple dashboard.

⸻

5. 📡 Offline-First Healthcare Network

Designed for:

* villages
* low bandwidth
* intermittent internet
* low-end Android devices
* tablets at healthcare centres.

Local data → encrypted → synchronization → cloud.

⸻

34. Future Expansion Roadmap

This is where you can make your SIH proposal look much bigger than a hackathon prototype.

Phase 1 — 0–6 Months

Assam pilot

Build:

* Android app
* 5–8 cognitive games
* Assamese + English voice
* caregiver dashboard
* reminders
* offline mode
* basic AI adaptation.

⸻

Phase 2 — 6–12 Months

Expand to:

All 8 NER states

Add:

* Assamese
* Khasi
* Garo
* Manipuri
* Mizo
* Nagamese/local language support
* Kokborok
* Nepali/Sikkimese context
* Hindi/English fallback.

Don’t promise full language support immediately; develop it incrementally with native speakers and clinical validation.

⸻

Phase 3 — 1–2 Years

Healthcare integration

Connect:

* PHCs
* CHCs
* geriatric centres
* neurologists
* psychiatrists
* psychologists
* occupational therapists.

Government already operates geriatric-care infrastructure in NER, so the platform could augment—not replace—these services.  

⸻

Phase 4 — 2–3 Years

AI cognitive screening

Develop models capable of identifying:

Normal cognitive trajectory
        ↓
Possible concern
        ↓
Needs assessment
        ↓
Clinical referral

Again:

AI flag ≠ diagnosis.

⸻

Phase 5 — 3–5 Years

Expand outside NER:

NER
 ↓
North India
 ↓
India
 ↓
South Asia
 ↓
Other LMIC regions

The architecture can be adapted to different cultural contexts.

⸻

35. The Long-Term Vision

Your ultimate vision shouldn’t be:

“An app for dementia patients.”

It should be:

A Digital Cognitive Care Infrastructure for Ageing India

Think:

              DIGITAL COGNITIVE CARE
                       │
       ┌───────────────┼────────────────┐
       ↓               ↓                ↓
   PATIENT          CAREGIVER        CLINICIAN
       │               │                │
       └───────────────┼────────────────┘
                       ↓
                AI COGNITIVE ENGINE
                       │
        ┌──────────────┼───────────────┐
        ↓              ↓               ↓
    Assessment      Monitoring      Intervention
        │              │               │
        └──────────────┼───────────────┘
                       ↓
                 HEALTH NETWORK

⸻

36. And There Is One Huge Opportunity I Would Add

“Cognitive Baseline Before Dementia”

Don’t wait until someone is diagnosed.

When a person is 55–60:

Create baseline
      ↓
Annual/weekly monitoring
      ↓
Personal cognitive trajectory
      ↓
Detect meaningful deviation
      ↓
Early clinical evaluation

This fits the PS’s requirement for early cognitive intervention much better.

And it creates a completely different product category:

continuous cognitive health monitoring

rather than just dementia therapy.

⸻

37. The SIH-Level Problem → Solution Statement

I would eventually frame your project like this:

The problem is not simply that dementia patients lack cognitive games. The real challenge is the absence of a continuous, personalized and culturally relevant cognitive-care ecosystem for elderly people in remote and underserved regions.

Our platform combines adaptive cognitive stimulation, personalized reminiscence, multilingual voice interaction, daily-life assistance, caregiver monitoring and offline-first AI to create a continuous cognitive-care loop connecting the elderly patient, caregiver and healthcare worker.

That is far stronger than:

“We made an AI game for dementia.”

⸻

38. The Numbers I Would Put in Your SIH Research Deck

These are the strongest statistics:

Statistic	Number
Global people living with dementia (2021)	57 million
New cases globally/year	~10 million
India’s dementia prevalence, 60+	7.43%
Indians 60+ living with dementia	~8.8 million
India’s projected dementia cases, 2036*	~16.9 million
Assam prevalence, 60+	8.47%
NE states excluding Assam	7.35%
Rural India 60+	8.35%
Urban India 60+	5.34%
No formal education	10.29%
Age 85+	25.41%

*Projection assuming prevalence remains constant.  

And one especially powerful number:

85+ population: ~25.4% dementia prevalence in the LASI-based estimate.  

That immediately communicates why ageing makes this problem increasingly important.

⸻

39. One More Important Finding for Your “Why NER?” Slide

The problem isn’t simply “NER has dementia.”

The stronger argument is:

NER combines several difficult conditions:

Ageing population
+
Rural/remote communities
+
limited specialist access
+
linguistic diversity
+
cultural diversity
+
uneven digital connectivity
+
caregiver dependence
+
limited dementia-specific infrastructure

That combination makes NER an ideal environment for an offline, multilingual, culturally adaptive cognitive-care platform.

And India’s existing telemedicine infrastructure gives you a realistic path to connect remote patients to specialists rather than trying to replace specialist care.  

⸻

40. My Recommended Product Differentiation

If there are 100 teams solving this PS, many will probably make:

Games + AI difficulty + dashboard + reminders.

You need to go one level deeper:

Their product

AI Cognitive Games

Your product

AI-Powered Personalized Cognitive Care Ecosystem

with:

Adaptive AI
→ Personal Memory
→ NER Culture
→ Voice
→ Offline
→ Caregiver
→ Longitudinal Cognitive Twin
→ Healthcare Referral

That is the direction I would take for SIH WINNERS 2026. 🏆

Key research sources

* LASI national/state dementia estimates:  
* India dementia ML prevalence study:  
* WHO Dementia — updated July 2026:  
* Cognitive stimulation evidence — Cochrane:  
* Indian dementia caregiver burden:  
* NER elderly NCD burden:  
* Indian telemedicine infrastructure:  
* Tele-MANAS:  

Next, the most useful step is to turn this research into your actual SIH solution architecture: exactly what modules you should build, what AI/ML models to use, what database/schema to create, what screens the app should have, and what your “killer innovation” should be for the final demo.