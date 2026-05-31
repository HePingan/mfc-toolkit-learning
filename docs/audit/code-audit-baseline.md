# Code Audit Baseline

## Environment

```text
node v18.20.3
npm 10.7.0
commit a467bea
```

## npm run build

```text

> mfc-toolkit-learning@0.1.0 build
> tsc -b && vite build

vite v5.4.21 building for production...
transforming...
✓ 144 modules transformed.
rendering chunks...
computing gzip size...
dist/assets/favicon-BU8TNC4h.svg               0.53 kB │ gzip:  0.36 kB
dist/index.html                                0.98 kB │ gzip:  0.62 kB
dist/assets/index-DDVuuW2l.css                93.15 kB │ gzip: 16.41 kB
dist/assets/Card-DI2Gcal1.js                   0.16 kB │ gzip:  0.15 kB
dist/assets/Button-hGZGWquD.js                 0.17 kB │ gzip:  0.15 kB
dist/assets/CodeBlock-DxcuKNng.js              0.21 kB │ gzip:  0.17 kB
dist/assets/download-M1g7NrSK.js               0.46 kB │ gzip:  0.30 kB
dist/assets/NotFoundPage-Lv8AXUB9.js           0.57 kB │ gzip:  0.44 kB
dist/assets/Roadmap-M2GdY0mQ.js                1.39 kB │ gzip:  0.77 kB
dist/assets/evidence-nvg4nLp6.js               2.76 kB │ gzip:  1.64 kB
dist/assets/CapstonePage-GMpWZTGi.js           3.25 kB │ gzip:  1.80 kB
dist/assets/DiagramsPage-C0UzVSvl.js           3.47 kB │ gzip:  1.64 kB
dist/assets/GlossaryPage-CxkhhHDK.js           3.49 kB │ gzip:  1.69 kB
dist/assets/ModulePage-gyk78ZKS.js             3.66 kB │ gzip:  1.64 kB
dist/assets/ResourcesPage-BK1vDfbU.js          4.91 kB │ gzip:  2.10 kB
dist/assets/resources-4-s51JRW.js              5.17 kB │ gzip:  3.04 kB
dist/assets/EvidencePage-DH513dPl.js           5.42 kB │ gzip:  2.18 kB
dist/assets/SearchPage-DXZB2Cad.js             5.47 kB │ gzip:  2.48 kB
dist/assets/glossary-Ds2YK-Vi.js               5.78 kB │ gzip:  4.20 kB
dist/assets/QuizPage-CAanSifu.js               5.99 kB │ gzip:  2.92 kB
dist/assets/Home-Cmck33Ny.js                   6.07 kB │ gzip:  2.93 kB
dist/assets/NotesPage-v9RubBu-.js              6.70 kB │ gzip:  2.83 kB
dist/assets/ComicsPage-BWFCSeW_.js             6.77 kB │ gzip:  4.81 kB
dist/assets/BuildChecklistPage-DzLj8WzN.js     6.79 kB │ gzip:  3.93 kB
dist/assets/PracticePage-DD66pYt3.js           6.86 kB │ gzip:  2.80 kB
dist/assets/Diagrams-uwodaXxI.js               6.91 kB │ gzip:  3.12 kB
dist/assets/PortfolioPage-BbakGTuR.js          6.99 kB │ gzip:  3.69 kB
dist/assets/ExamPage-CVYQptf9.js               7.08 kB │ gzip:  3.42 kB
dist/assets/SubmitRehearsalPage-DkGFAo2Q.js    7.50 kB │ gzip:  3.53 kB
dist/assets/ReviewPage-CEmIRBxj.js             8.00 kB │ gzip:  3.18 kB
dist/assets/practice-D5GcIyBS.js               8.16 kB │ gzip:  5.45 kB
dist/assets/PlannerPage-ClelsysO.js            8.22 kB │ gzip:  3.99 kB
dist/assets/DesignerPage-mfOij39p.js           8.76 kB │ gzip:  3.76 kB
dist/assets/TroubleshootingPage-BQAjH98H.js    9.40 kB │ gzip:  6.00 kB
dist/assets/DashboardPage-AB-kjUDg.js         10.04 kB │ gzip:  3.89 kB
dist/assets/DemoScriptPage-Cmt0fN0w.js        10.51 kB │ gzip:  5.81 kB
dist/assets/ReportsPage-BQn9n-ef.js           10.85 kB │ gzip:  4.27 kB
dist/assets/IntegrationPage-ilBmzBuw.js       14.14 kB │ gzip:  7.00 kB
dist/assets/DeliveryPage-BvuqWrIv.js          16.14 kB │ gzip:  6.78 kB
dist/assets/LabsPage-BqPK0H5_.js              20.44 kB │ gzip:  7.61 kB
dist/assets/CodegenPage-crtngMU7.js          172.93 kB │ gzip: 53.22 kB
dist/assets/index-C7ejjXzh.js                277.70 kB │ gzip: 96.43 kB
✓ built in 5.19s
```

## npm run verify:routes

```text

> mfc-toolkit-learning@0.1.0 verify:routes
> node scripts/verify-routes.mjs

[verify:routes] OK 34 routes, 3 assets @ http://127.0.0.1:4174
```

## npm run verify:mobile

```text

> mfc-toolkit-learning@0.1.0 verify:mobile
> node scripts/verify-mobile.mjs

[mobile-qa-v7] FAIL index CSS asset not found
```
