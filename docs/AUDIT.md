# Portfolio audit

Audit date: 3 November 2026, Africa/Addis_Ababa. Branch: `audit/portfolio-resume-review`.

Phase 1 only. The current site source and supplied PDF are unchanged. No commit, push, deployment, resume rewrite, or redesign implementation was performed. Your final instruction forbidding commits overrides the earlier request for small commits.

## Sources, scope, and evidence

Read the repo before drafting: it contains `index.html`, `style.css`, `script.js`, two favicons, one local font, and the supplied PDF. There is no application framework, package manifest, build configuration, README, `postings/`, or existing `resume.json`. No applicable `AGENTS.md` was found in the repo or its ancestor directories.

You explicitly approved drafting the missing root `resume.json` from the new PDF. It is a review draft, not independent corroboration of that PDF. Comparisons below mean the existing site versus that transcription. Exact dates, titles, project links, education, awards, and volunteer details were preserved. Missing project dates remain null; year only dates remain year only. Raw source punctuation is preserved in JSON; public display copy can normalize punctuation without changing facts.

Evidence files:

| Evidence | What it establishes | Limit |
| --- | --- | --- |
| [`resume-extracted.txt`](evidence/resume-extracted.txt) | Full text extracted from the one page supplied PDF | Extraction is not a visual layout review |
| [`resume-links.json`](evidence/resume-links.json) | PDF hash and all 31 URI annotations with page coordinates | Duplicate text and icon annotations are included |
| [`link-audit.json`](evidence/link-audit.json) | All HTML `href` and `src` targets and all unique HTTP PDF targets checked with redirects | A success code alone does not establish profile ownership; bot blocks and timeouts remain unresolved |
| [`browser-audit.json`](evidence/browser-audit.json) | Playwright measurements and axe results at 390px and 1440px, both system themes; reduced motion and JavaScript disabled checks | Google Fonts requests were blocked after independent requests timed out, so these are diagnostic fallback font results |
| [`lighthouse-baseline.json`](evidence/lighthouse-baseline.json) | Attempted home page Lighthouse baseline | Failed with `NO_FCP`; all four category scores are null, not zero or passing |
| [`screenshots/baseline/`](screenshots/baseline/) | Existing home at 390px and 1440px, light and dark; open mobile menu in both themes | Existing site only, fallback fonts, viewport screenshots; not Phase 2 acceptance artifacts |

Public sources were read through the GitHub connector. ImmuStore's old name required following its redirect to the current name. Relevant references:

| Project | Read | Evidence boundary |
| --- | --- | --- |
| ImmuStore DB | [README](https://github.com/yabtesfu/immustore-db/blob/main/README.md), [architecture](https://github.com/yabtesfu/immustore-db/blob/main/docs/architecture.md) | Confirms database internals and learning scope, not production adoption or guaranteed recovery from every failure |
| GAN Observatory | [README](https://github.com/yabtesfu/gan-lab-tensorflow/blob/main/README.md), [session.py](https://github.com/yabtesfu/gan-lab-tensorflow/blob/main/src/gan_lab_tensorflow/live/session.py) | Confirms latest frame telemetry, background training, live controls, approximate cadence; this audit did not benchmark the application |
| pgxmock | [README](https://github.com/abelkm99/pgxmock/blob/master/README.md), [pgxmock.go](https://github.com/abelkm99/pgxmock/blob/master/pgxmock.go), [expectations.go](https://github.com/abelkm99/pgxmock/blob/master/expectations.go) | Confirms batch interfaces and expectations in the linked fork, not personal authorship or an upstream merge |
| Litestar | [README](https://github.com/litestar-org/litestar/blob/main/README.md) | Confirms framework context; the supplied resume remains the authority for personal tracing and exception capture work and July 2024 date |

No job postings were available, so the stated mid level remote backend audience is the sole targeting brief. Do not infer work authorization, availability, salary, remote employment history, new employers, or new accomplishments.

## Complete current inventory

Line numbers refer to the unchanged current source. Sections are the five existing `section` elements. This is one static page with fragment links, not five separate routes. There are no existing case study pages or reusable framework components.

| Item | Keep / merge / cut | Reason |
| --- | --- | --- |
| `/` and `/index.html`, entire document | Keep | Retain static delivery and the current HTML, CSS, vanilla JavaScript browser stack |
| `#home` | Keep | Recruiter entry point; replace broad positioning with the requested backend title |
| `#projects` | Keep | Replace dense cards with three selected case studies and one additional contribution |
| `#about` | Merge | Move evidence into hero, project stories, experience, and background; remove the standalone essay |
| Nested `#education` anchor | Merge | Education belongs in the proposed Background section |
| `#experience` | Keep | Correct every role and date from JSON; shorten the presentation |
| `#contact` | Keep | Clear email, resume, and GitHub actions |
| Document title and description, `index.html:6` | Merge | Replace Full Stack and Systems positioning and the AI/infrastructure slogan |
| Language, viewport, encoding, `index.html:2` | Keep | Correct basics already exist |
| Theme color metadata | Keep | Generate a theme appropriate value without blocking content |
| `favicon.svg`, `favicon.png`, Apple touch icon | Keep | Existing recognizable assets; inspect final icon sizing and contrast |
| External Anton and JetBrains Mono stylesheet | Cut | Conflicts with one font family and adds network dependencies |
| `fonts/Kitabisa.ttf` | Cut | Unused asset; current CSS does not reference it; not the requested font |
| Font Awesome stylesheet | Cut | Icon font payload unnecessary for a few links; use text and small local SVGs |
| Devicon stylesheet at `@latest` | Cut | Eighteen tech logos add visual noise and a mutable dependency |
| Inline theme initialization, `index.html:31` | Merge | Preserve system theme behavior; remove dependence on JavaScript for the default palette |
| Preloader container and live status, `index.html:48` | Cut | Artificial delay and screen reader chatter before recruiter content |
| Preloader YT tile, ring, name, role | Cut | Duplicate branding and role; no actual loading value |
| Preloader log, module count, percentage, progress bar | Cut | Simulated build telemetry unrelated to content readiness |
| Preloader Python, Rust, FastAPI, TensorFlow, Docker, Kubernetes, React, RISC V tags | Cut | Duplicate stack wall and distract before the page |
| Starfield canvas, `index.html:94` | Cut | Continuous decorative rendering; would compete with the selected signature element |
| Trailing cursor dot, `index.html:97` | Cut | Continuous pointer loop without recruiter value |
| Header and wordmark, `index.html:100` | Keep | Use readable name and stable mobile layout |
| Animated wordmark underline and clipped text reveal | Cut | Another signature effect and incomplete reduced motion behavior |
| Desktop nav shell and Home, Projects, About, Experience, Contact links | Merge | Four content links plus resume; wordmark already supplies home |
| Moving magnetic nav pill | Cut | Another motion motif and scroll measurement work |
| Theme cycling button | Cut | System preference meets the requirement and frees mobile header space |
| Mobile toggle, expanded state, Escape and outside close | Keep | Existing useful behavior, to be simplified and tested with progressive enhancement |
| Hero name, hidden Alemu reveal, `index.html:140` | Merge | PDF says Yabetse Tesfaye; use that name visibly and remove interactive heading behavior |
| Empty typed role, `index.html:145`, `script.js:9` | Merge | Render Backend Software Engineer directly in static HTML |
| Hero quote, `index.html:149` | Cut | Broad intelligence and scale claim replaces specific backend value with a slogan |
| View Projects action | Merge | Make selected work a secondary text action beneath three hiring actions |
| Download Resume action, `index.html:158` | Keep | Primary conversion action; repair the stale filename in Phase 2 |
| Hero LinkedIn button | Merge | Retain as a quieter text link using the PDF target |
| Hero and contact GitHub icons | Merge | Give GitHub a labelled primary button and contact link |
| Hero and contact email icons plus contact address | Merge | Use a portable `mailto:` link instead of Gmail web compose |
| Instagram, Telegram, WhatsApp in hero and contact | Cut | Personal channels distract from the specified resume, code, and email goals; absent from the supplied PDF links |
| Python, Rust, Java, TypeScript, JavaScript, Go logos | Merge | Use relevant supported languages in project context; remove standalone logo strip |
| React, Next.js, Node.js, FastAPI logos | Merge | Retain FastAPI in the relevant work and projects; other old stack claims do not belong in the new shortlist |
| NumPy, TensorFlow, Redis, SQLite logos | Merge | Mention only where case study sources support their use; avoid implying all are resume skill entries |
| Docker, Kubernetes, Git, Linux logos | Merge | Relevant delivery tools belong in experience context; Linux is not in the supplied skills list |
| Hero scroll cue | Cut | Extra bouncing control; use ordinary navigation and project introduction |
| Project section number, heading | Merge | Use Selected projects and a short explanatory sentence |
| Nodechain Lab card, `index.html:211` | Cut | Not in the new resume shortlist; valid code link does not make it a required selected project |
| Nodechain description and chips | Cut | Node.js, Express, socket.io, React, Docker content is outside the updated shortlist |
| Nodechain mining, retargeting, signing, fees, Merkle integrity bullet | Cut | Too much detail for a home card; not part of the approved resume data |
| Nodechain WebSocket gossip, discovery, consensus bullet | Cut | Same shortlist mismatch |
| Nodechain worker miner and cancellation bullet | Cut | Same shortlist mismatch |
| Nodechain SSE dashboard, signing, Docker demo bullet and GitHub action | Cut | Preserve in original source history; do not copy into the new selected work without changing the approved data scope |
| imuStore DB card, `index.html:230` | Keep | Correct casing to ImmuStore DB and link to a dedicated case study |
| ImmuStore description and Python, B+ Tree, MVCC, Raft, distributed systems chips | Merge | One short summary plus case study; state learning scope explicitly |
| ImmuStore append storage, recovery, snapshots, transactions, replication bullets | Merge | Supported technical detail belongs in case study narrative and architecture |
| ImmuStore RESP, changefeed, metrics, Docker, simulation bullet | Merge | Use precise repository backed detail, avoid production guarantees |
| ImmuStore GitHub action | Keep | Old URL redirects; propose canonical current URL in Phase 2 |
| Adwa Based Game card, `index.html:250` | Cut | Absent from the supplied new resume and less relevant to backend hiring |
| Adwa Unity, C#, modeling, cinematics, level design chips and description | Cut | Same selection decision |
| Adwa educational story, Wuchalé and Bahta Hagos cutscenes, models, levels, UI bullets | Cut | No new resume support and too much unrelated home page detail |
| Unity Project ghost button | Cut | Styled noninteractive span, no code or demo target |
| RustV OS Lab card, `index.html:270` | Cut | Not in the new resume shortlist |
| RustV Rust, RISC V, no_std, assembly, QEMU chips and description | Cut | Same selection decision |
| RustV scheduler, Sv39/syscalls, virtio/TinyFS/shell/CI bullets and GitHub action | Cut | Interesting systems work but would crowd the selected backend evidence |
| About heading and full depth of stack essay, `index.html:300` | Cut | Replace long multi domain story with concise source backed proof |
| About claims about marketplace recommendation engines and telemetry | Merge | Telemetry is supported by GAN Observatory; marketplace recommendation work is absent from the updated resume |
| ACT education card, degree, institution, GPA | Keep | Correct degree wording and dates; shorten to one compact entry |
| ACT foundation curriculum bullet | Cut | Not in updated resume; unnecessary detail for this audience |
| A2SV education card, institution, program | Keep | Correct program title and dates from the PDF |
| A2SV competition algorithm topics and interview claim | Merge | Source supports Data Structures and Algorithms, not that expanded syllabus or interview framing |
| Experience heading and timeline spine | Keep | Use semantic dated list; remove drawn animation and oversized cards |
| Revelo title, dates, 3 months badge | Merge | Replace with the new AI annotation and evaluation role and February to October 2026 dates |
| Revelo Amazon Nova Lite v2, IaC, Terraform, AWS CDK, validation bullets and tags | Cut | Not in the new resume; retaining these would materially misrepresent the role |
| Turing title, dates, 1 year badge, video/prompt/quality bullets and tags | Merge | Keep only the new resume scope and exact April 2025 to February 2026 range |
| Upwork title, dates, 4 months badge, UI/REST/client bullets and tags | Merge | New end date April 2025; compact API integration and remote client summary |
| Eskalate Full Stack Engineer, January 2021 to September 2024, duration | Merge | Replace merged period with distinct internal tooling and AfroChat roles |
| Eskalate 30% improvement, security/rate limits/audits, AI assistant bullets and tags | Cut | Not supported by the new resume; replace with migration, workflow automation, and delivery evidence |
| Eskalate junior title, dates, duration, authentication bullet | Keep | Dates match; derive them from JSON and drop duration badge |
| Eskalate junior third place team project bullet | Keep | Supported by PDF; remove extra Flutter, CI/CD, and containerization claims from this role |
| Contact heading, card, collaboration slogan, `index.html:490` | Merge | Direct hiring invitation plus clear hiring links |
| Footer full name, year, Engineered with intention | Merge | Use PDF name and current year; remove the slogan |
| `style.css` tokens and both palettes | Merge | Preserve blue accent and system theme intent; consolidate typography, spacing, color, motion tokens in one file |
| Global 62.5% root scale and mobile scale overrides | Cut | Current rem choices yield 10px desktop and about 11px mobile body copy |
| Fixed header and responsive breakpoints at 1100, 980, 768, 480 | Merge | Simplify layout rules and test around the mobile boundary, zoom, short landscape, and 320px |
| Tilted cards, perspective tracking, glow effects, scattered dots, scribble | Cut | Too many signature motifs; choose one from COPY.md |
| Reveal classes, split headings, stagger groups, animated timeline | Cut | Content should be visible without JavaScript or intersection callbacks |
| `script.js` preloader and typing handlers | Cut | Essential identity and navigation should be usable immediately |
| `script.js` theme handlers | Merge | Prefer CSS system theme; small script only if an approved override is needed |
| `script.js` navigation handlers | Keep | Retain accessible menu essentials; stop intercepting native hashes without updating navigation state |
| `script.js` cursor, canvas, parallax, card physics, observers | Cut | Reduces perpetual work and motion complexity |
| PDF download asset | Keep | New file exists; fix links after approval and preserve content unless a specific link correction is verified |
| `.gitignore`, ignored system files | Keep | Housekeeping, not public content |

## Content differences and omissions

No existing root JSON was available to compare independently. The following is the complete factual reconciliation of the site against the PDF derived draft, including stale copy and omitted categories. A claim absent from the new resume is marked unsupported here, not declared false.

| Item | Current site | New resume / draft JSON | Action after approval |
| --- | --- | --- | --- |
| Name | Yabetse Tesfaye Alemu, with interactive last name | Yabetse Tesfaye | Follow PDF display name |
| Positioning | Full Stack and Systems Engineer in metadata, loader, JavaScript role | Backend and Full Stack Software Engineer; brief requests Backend Software Engineer | Use requested headline; retain source label in data |
| Summary | AI, infrastructure, products, reliable systems that scale | Backend modernization, internal platforms, delivery automation, six engineers, 200+ employees, four time zones | Use specific supported value statement |
| Revelo dates | March 2026 to May 2026 | **February 2026 to October 2026** | Replace both bounds and remove 3 month badge |
| Revelo role and scope | AI Infrastructure and DevOps Training Engineer; Nova Lite v2, Terraform, AWS CDK, IaC | **LLM Trainer, AI Data Annotation and Model Evaluation**; video annotation and response evaluation | Replace role, all bullets, and tags |
| Turing dates | April 2025 to March 2026 | **April 2025 to February 2026** | Correct end; remove 1 year badge |
| Turing scope | Frame level video and targeted prompt claims | Multimodal data curation, temporal alignment, response review | Use the supplied scope; do not transfer Revelo responsibilities by accident |
| Upwork dates | December 2024 to March 2025 | **December 2024 to April 2025** | Correct end; remove 4 month badge |
| Upwork scope | Reusable UI, REST integration, remote clients | Same broad scope; explicit state management and validation | Shorten without losing backend integration evidence |
| AfroChat role | Missing as a separate role | **Backend Engineer and Project Co Lead, AfroChat, Eskalate; January 2023 to December 2024** | Add full entry and six engineer migration context |
| AfroChat details | Not stated | Flask/MongoDB to FastAPI/PostgreSQL, SQLAlchemy/asyncpg; Domain Driven Design, Test Driven Development; GitHub Actions/Python/Docker pipelines | Add, no invented latency or savings |
| Eskalate internal tooling dates | Rolled into January 2021 to September 2024 | **January 2021 to January 2023** | Restore distinct role |
| Eskalate internal tooling title and work | Full Stack Engineer, security and AI assistant focus | **Full Stack Developer, Internal Tooling**; Slack/Sheets automation for 200+ across four time zones, queued notifications, reporting/evaluations, Go/Kubernetes | Replace title and scope |
| Claimed 30% improvement | Explicit in current Eskalate bullet | Absent | Remove figure and associated unsupported outcome |
| Security details and AI assistant | Rate limiting, audit logs, FAQ assistant | Absent from updated role | Remove or obtain new source evidence before inclusion |
| Eskalate junior dates | November 2019 to January 2021 | Same | Preserve exactly |
| Eskalate junior extras | Flutter, CI/CD, containers | Not stated for this role | Keep auth/features and third place result only |
| ACT dates | September 2014 to July 2019 | **September 2018 to June 2022** | Replace both bounds |
| ACT degree | B.S.E. Software Engineering | **Bachelor of Software Engineering** | Use PDF wording; CGPA 3.82 matches |
| A2SV dates | April 2019 to September 2020 | **January 2022 to March 2023** | Replace both bounds |
| A2SV title | Data Structures and Algorithms Program | **Software Engineering Program**; Data Structures and Algorithms detail | Correct title and retain supported detail |
| ImmuStore name | imuStore DB | **ImmuStore DB** | Fix casing |
| ImmuStore scope | Database engine, zero dependencies, broad crash safe guarantee | Explicitly learning focused; recovery, replication, async server, deterministic fault injection | Retain supported implementation details, qualify scope and avoid universal guarantees |
| Nodechain Lab | Selected project | Absent from new resume | Cut from selected work |
| Adwa game | Selected project | Absent from new resume | Cut from selected work |
| RustV OS Lab | Selected project | Absent from new resume | Cut from selected work |
| GAN Observatory | Missing project; only generic telemetry in About | **FastAPI/WebSockets, approximately 20 FPS, controls, collapse detection** | Add case study; no invented date |
| Litestar | Missing | **Tracing and exception capture contribution, July 2024** | Add contribution and date |
| pgxmock | Missing | **Batch query mocking contribution, April 2024** | Add case study and date; label fork and contribution accurately |
| Marketplace recommendation engines | About paragraph claim | Absent | Remove pending evidence |
| Technical skill coverage | Eighteen icons, including unsupported standalone Rust/TypeScript/React/Next.js/Node.js/Linux claims relative to PDF skills | Explicit language, framework/database, delivery, testing categories in JSON | Use relevant supported skills in context; keep full authoritative inventory in JSON and PDF |
| ALX award | Missing | **First place, Ethiopian Competitive Programming Contest, January 2024** | Add |
| A2SV/Atrons award | Missing | **First place, September 2022, $8,000 team prize** | Add; do not imply personal prize amount |
| Innovation award | Missing | **UNDP and Ministry of Innovation and Technology COVID 19 Innovation Challenge winner, 2020** | Add; do not invent month |
| Robot hackathon award | Missing | **Alpha 1S Robot Bluetooth Control, April 2021** | Add reverse engineering detail |
| Volunteering | Missing | **Eagle Robotics instructor, 2021, 30 students, Python/Raspberry Pi** | Add; keep organization unlinked while URL is unresolved |
| Contact identity | Gmail address and WhatsApp number | Same email and phone; Addis Ababa stated explicitly | Prefer direct email; location may be visible without inferring availability |
| LinkedIn | `https://www.linkedin.com/in/yabetse-tesfaye/` | Identical URL in PDF | No new handle supplied; do not guess a changed profile |

Shared boundary months are not errors: December 2024 occurs in both AfroChat's end and Upwork's start; February 2026 occurs in Turing's end and Revelo's start. Do not infer overlap in days, silently move dates, or relabel a completed role as Present. Do not infer project dates from GitHub activity.

## Link findings

### Confirmed fault and required repair

`index.html:158` points at `Resume/My%20Resume(Yabetse%20Tesfaye).pdf`, which decodes to the missing old filename `My Resume(Yabetse Tesfaye).pdf`. The new supplied file is `Resume/MyResume(Yabetse Tesfaye).pdf`. Its existing Git deletion/addition was present before the audit and was preserved. Update the button target and download filename together in Phase 2.

### PDF annotation findings

All 31 annotations were enumerated, representing 17 unique URI destinations including email and telephone. The project and organization text often has an overlapping second link on its small icon. Duplicate same target annotations are redundant, not automatically broken. The email and telephone targets match the printed contact details and have valid `mailto:` and `tel:` shapes; no email or call was sent.

| URL or target | Where | Observed result | Assessment / proposed action |
| --- | --- | --- | --- |
| `mailto:yabtesfu@gmail.com` | PDF | Valid URI shape, matches text | Keep; deliverability not tested |
| `tel:+251966331110` | PDF | Valid URI shape, matches text | Keep; number ownership not tested |
| `https://www.linkedin.com/in/yabetse-tesfaye/` | PDF, site | HTTP 999 | Automated access blocked; not proven missing, no verified replacement |
| `https://ybalemu.vercel.app/` | PDF | HTTP 200 | Reachable; verify final deployment still uses this origin before metadata generation |
| `https://github.com/yabtesfu` | PDF, site | HTTP 200 | Reachable |
| `https://www.revelo.com/` | PDF, site | HTTP 200 | Reachable |
| `https://www.turing.com/` | PDF | HTTP 200 | Reachable |
| `https://upwork.com/` | PDF | HTTP 403 | Blocked automated request, not a confirmed missing page |
| `https://afrochat.app/en` | PDF | HTTP 200 | Reachable |
| `https://eskalate.io/` | PDF | HTTP 200, redirects to `www.eskalate.io` | Working redirect; optional canonical update |
| `https://github.com/yabtesfu/imustore-db-` | PDF, site | HTTP 200 after redirect to `https://github.com/yabtesfu/immustore-db` | Working old link, stale repository name; update verified destination in data, site, and PDF together after approval |
| `https://github.com/litestar-org/litestar` | PDF | HTTP 200 | Reachable; project home does not identify the specific contribution |
| `https://github.com/abelkm99/pgxmock` | PDF | HTTP 200 | Reachable fork of upstream; preserve intended contribution target, do not silently replace with upstream |
| `https://github.com/yabtesfu/gan-lab-tensorflow` | PDF | HTTP 200 | Reachable |
| `https://act.edu.et/` | PDF, site | HTTP 200 | Reachable |
| `https://a2sv.org/` | PDF | HTTP 200, redirects to `www.a2sv.org` | Working redirect |
| `https://eagle-code.com/` | PDF | DNS resolution failed | Unusable in this environment; intended replacement is unknown. Remove or repair the two annotations only after confirming destination; keep volunteer text |

### Remaining site destinations and resources

| URL or target | Result | Assessment |
| --- | --- | --- |
| `#home`, `#projects`, `#about`, `#experience`, `#contact` | All IDs exist | No missing current fragment targets |
| `favicon.svg`, `favicon.png`, `style.css`, `script.js` | All files exist | No missing local resources |
| Nodechain Lab GitHub repository | HTTP 200 | Valid but proposed cut for content scope |
| RustV OS Lab GitHub repository | HTTP 200 | Valid but proposed cut for content scope |
| `https://www.eskalate.io/` | HTTP 200 | Reachable |
| `https://www.a2sv.org/` | HTTP 200 | Reachable |
| `https://www.upwork.com/` | HTTP 403 | Automated block, unresolved |
| `https://www.instagram.com/yab_tesfu/` | HTTP 200 | Transport reachable; account content/ownership not independently verified |
| `https://t.me/This_is_yab` | HTTP 200 | Transport reachable; account ownership not independently verified |
| `https://wa.me/251966331110` | Timed out | Unresolved, not declared missing |
| Gmail compose URL with `to=yabtesfu@gmail.com` | HTTP 200, redirects to Google sign in | Works only through Google account flow; replace with `mailto:` for universal email action |
| Google Fonts CSS and its two preconnect origins | Timed out | External availability issue in this run; origins are resource hints, not public navigation links |
| Font Awesome 6.5.2 CSS | HTTP 200 | Reachable external render dependency |
| Devicon `@latest` CSS | HTTP 200 | Reachable mutable external render dependency |
| Unity Project | No anchor at all | Misleading button appearance, not an HTTP broken link |
| Hosted project demos | No supplied URLs | No demo destination to validate; never invent one |

External checks use GET with redirects. A zero broken links claim is not justified while the local resume is missing and blocked or failed destinations remain unresolved. Link verification during Phase 2 must include generated pages, diagrams, Open Graph assets, PDF annotations, and the final selected targets. Do not hide failures with blanket host exclusions or count a sign in response as proof that a profile is valid.

## Accessibility, responsive behavior, performance, and SEO

Severity is priority for this redesign, not a formal compliance classification. Static observations are separated from measured results.

| Finding | Evidence | Effect | Proposed change |
| --- | --- | --- | --- |
| Primary content lacks a main landmark | HTML; axe `landmark-one-main` plus `region` in all four runs | Harder landmark navigation; axe reports 12 region nodes | One semantic `main`, labelled sections, skip link |
| Wordmark visible label and accessible name differ | `Yabetse.T` versus full name label; axe `label-content-name-mismatch` | Voice command users cannot reliably use the visible label | Render source name and matching accessible name |
| Three axe rule types remain | Each closed menu run has 1 name mismatch, 1 missing main, 12 region nodes | Does not satisfy zero violations | Fix and scan home, case studies, and open menu in both themes |
| Body and project copy too small | Measured desktop 10px, mobile 10.88px; nav desktop 9.5px | Dense content, difficult recruiter scanning | 16px base text, one readable type scale |
| Tiny metadata | CSS tags at 0.8rem on 10px root | 8px desktop tags/dates | Use readable secondary text rather than shrinking the entire UI |
| Main actions undersized | Measured 30px desktop height, about 32.45px mobile | Below proposed 44px interaction target | Consistent minimum 44px controls and spacing |
| Desktop/mobile scale discontinuity | CSS switches root scale at 768px and 480px; desktop nav uses 0.95rem | Abrupt typography change near tablet size | Stable rem base and content driven breakpoints |
| Mobile menu exists and fits at 390px | 360px panel, five 44px links, Escape closes in light/dark | User reported awkwardness is not a missing hamburger or measured horizontal overflow at this width | Simplify chrome, preserve working keyboard behavior, test nearby widths and zoom |
| Mobile menu is JavaScript dependent | With JavaScript disabled, nav visibility is hidden and toggle has no handler | Navigation unavailable on failure | Native or progressively enhanced disclosure with useful fallback |
| Current global body clips horizontal overflow | `style.css:199` | Can conceal layout errors | Test actual overflowing elements, 320px, zoom and landscape; no new overflow was measured at 390/1440 |
| Heading behaves like a control | Focusable `h1`, click toggles last name, no explicit Enter/Space handler | Unnecessary tab stop and nonstandard interaction | Show source name directly |
| Essential role only exists after script runs | Empty `#role-typing`; JavaScript disabled result is empty | Backend identity missing until animation completes or forever if script fails | Static headline in HTML |
| Projects disappear without JavaScript | `.reveal` opacity zero; measured project opacity 0 with JS disabled | Content depends on observer callbacks despite being statically present | Render visible by default |
| No skip navigation link | HTML | Repeated header navigation for keyboard users | Add Skip to content |
| Active nav state is only visual | Class toggles; no `aria-current` | Screen reader misses active location | Native links plus appropriate current state |
| Smooth scroll overrides user preference | `script.js:384` always asks for smooth scrolling; global CSS smooth behavior | Reduced motion preference not fully respected | Native hashes; reduced motion uses immediate movement |
| Hash navigation intercepted without updating URL/focus | `script.js:377` | Back behavior and destination focus do not match normal fragment navigation | Preserve native hash behavior and test keyboard focus |
| Reduced motion incomplete | Runtime recorded signWrite, signRule, slideUp, blipPulse and loader transitions while reduced motion is enabled | Nonessential motion still runs | Disable all nonessential keyframes, transitions, smooth scrolling, and decorative loops under reduced motion |
| Long lived decorative motion | Starfield loop, cursor loop, scrolling parallax; canvas/pill/tilts/reveals | Competing attention and extra rendering work | Exactly one approved signature; ordinary restrained transitions only |
| Repeated layout reads during scrolling | `updateNav` reads each section geometry and nav bounds on every scroll; cursor reads offsetWidth every frame | Avoidable layout/render work | Remove moving pill and cursor; use a simple navigation model |
| Repeated style reads and canvas drawing | Starfield reads theme values about 25 times per second; rAF continues while idle | Unnecessary work for a text portfolio | Remove canvas |
| Card layers overused | Many `will-change` hints and 3D pointer transforms | Potential layer/memory overhead, not measured as a score | Remove physics and permanent will-change |
| Artificial loader | Script minimum 2.6s plus ready wait and dismiss delay, then typing; measured approximately 3.8 to 4.2s until body unlock on diagnostic runs | Spends most of the five second window before the role is fully readable | Remove loader and typed role |
| Loader progress is simulated | Percent and modules derived from elapsed time, not fetched content | Misleading wait and noisy live announcements | Render content immediately |
| Loader has failure dependency | Inline script applies preloading but external script removes it; no independent inline recovery | If script.js fails, overflow stays locked and overlay can remain | Remove loader entirely |
| Render blocking external fonts/icons | Three external CSS requests, with Google Fonts timeout observed | Network dependence and possible font swap shifts | Self host one approved variable font and inline/local SVG icons |
| Current document/CSS/script payload | About 27KB HTML, 47KB CSS, 21KB JavaScript before external assets | Most complexity supports decorative effects | Build compact static pages with only essential navigation JS |
| Font swap and expanding name can shift layout | Google font `display=swap`, measured text widths, max width name animation | Potential layout shift; CLS not successfully measured | Local font metrics, reserved dimensions, no expanding identity |
| No raster page images today | Only favicons; no project images to optimize yet | No existing unoptimized hero photo issue | If images are added, use explicit dimensions and optimized formats |
| Multiple fonts and arbitrary spacing | Three font roles and rem values outside an 8pt scale | Inconsistent design relative to requested system | One Inter or Geist family, one type scale, 8px spacing tokens |
| No no-JS system dark palette | Dark CSS requires a data attribute set by script | With JS off system preference is not reflected | CSS `prefers-color-scheme` default |
| Missing Open Graph/Twitter image metadata | HTML head | Weak preview on sharing | Generate OG image and complete metadata |
| No canonical link | HTML head | Preferred origin unspecified | Use confirmed public origin from JSON/config |
| No sitemap or robots file | File inventory | Requested crawl assets absent | Generate routes into sitemap and robots |
| No Person structured data | HTML head | Requested identity metadata absent | Generate JSON LD from canonical data |
| No case study routes or MDX pipeline | File inventory | Required content format unavailable | Add build time MDX to static HTML compilation while preserving browser stack |
| No verification tooling | No package/config/tests | No protection from future content drift or dash characters | Add the specific acceptance checks below in Phase 2 |

The diagnostic browser runs recorded no uncaught page JavaScript exceptions. Axe did not report color contrast violations in the closed menu fallback font runs; this does not prove every hover/open menu state passes. Mobile horizontal overflow was not measured at 390px; additional widths, landscape, zoom, and final fonts remain to be tested.

The Lighthouse CLI run did not produce valid scores: `NO_FCP` and null performance, accessibility, best practices, and SEO categories. This is a failed measurement, not evidence of a numerical baseline or a diagnosis that the preloader caused the error. Final Lighthouse CI runs must be successful, unmodified measurements of the built site.

## Proposed structure and implementation boundary

| Section | Purpose | Source and treatment |
| --- | --- | --- |
| Hero | Name and Backend Software Engineer immediately, specific one sentence value, resume/GitHub/email | JSON basics plus approved editorial statement; secondary LinkedIn link |
| Selected projects | Three case studies: ImmuStore, GAN Observatory, pgxmock; Litestar contribution remains visible | JSON project records and approved source backed MDX detail |
| Experience | Six short dated entries with AfroChat and internal tooling distinct | Generate all identity/date fields from JSON; one concise summary per role |
| Background | Education, four awards, robotics volunteering | Compact JSON generated lists, year precision preserved |
| Contact | Direct email and hiring links | JSON basics and profiles; no form |

Detailed visible copy and both signature proposals are in [`COPY.md`](COPY.md). Option A is a compact request path diagram. Option B is a versioned storage record illustration. Select exactly one; all existing competing decorative effects are removed in the proposed design.

Keep the existing static browser stack. There is no framework to migrate or retain beyond HTML, CSS, and vanilla JavaScript. Proposed tooling is a small Node build step to read `resume.json`, compile MDX into static case study HTML, render Mermaid into local SVGs, and generate metadata and crawl assets. Do not add a client framework or client content fetching. If this implementation choice is approved, confirm the exact build dependencies against official documentation before introducing them.

Use one local Inter or Geist family, blue as the one accent hue, system light/dark palettes, readable line length near 70ch, one type scale, and an 8px spacing scale. Put tokens in one file. Essential content is visible before JavaScript runs. Explicit dimensions for fonts, diagrams, images, and controls prevent avoidable layout movement. Mobile header layout prioritizes name, resume, and a clearly labelled menu.

The JSON draft intentionally contains source facts only, including original URLs and uncertain link review notes. During Phase 2, store approved editorial summaries and case study fact/tag fields alongside stable record IDs in JSON where appropriate. MDX must reference those records, not repeat employers, dates, titles, project names, URLs, and metrics as separately maintained facts. Build output may contain generated copies; hand authored content must not create another fact source.

## Required Phase 2 acceptance plan

| Gate | Required result | How to establish it |
| --- | --- | --- |
| Source consistency | Test fails on site data differing from JSON | Parse generated home and case study facts by stable record ID; compare names, dates, employers, links, summaries, and project selection to canonical records; demonstrate failure with a deliberate fixture mismatch |
| Copy punctuation | No rendered dash characters | Scan rendered DOM text, SVG text, image alternative text, accessible control labels, and generated metadata on every route, in both menu states; include ASCII hyphen, soft/nonbreaking hyphens, Unicode dash punctuation and minus variants. Test a failing fixture; exclude URL attributes and source code syntax, not visible labels |
| Lighthouse CI | Each category at least 95 on home and one case study | Successful CI assertions for performance, accessibility, best practices, SEO against built static output; record reports, versions and run conditions. Do not turn failed measurements into pass scores |
| axe via Playwright | Zero violations | Home and selected case study, mobile/desktop, both themes, open/closed navigation and keyboard use |
| Link checker | Zero broken selected site links | Local routes/assets/fragments plus external selected targets and PDF URI annotations; document verification of blocked targets rather than silently ignoring them |
| Responsive screenshots | 390px and 1440px, light/dark | Save final home and representative case study screenshots under `docs/screenshots`, plus open mobile menu; visually inspect them |
| Navigation | No clipping; keyboard, Escape, native anchors work | Test 320px, 390px, tablet breakpoint boundaries, 1440px, zoom, short landscape, JS failure, reduced motion |
| Static output | All content present without client fetching | Inspect built HTML; no runtime JSON/content requests, MDX or Mermaid runtime downloads |
| PDF repairs | Correct verified destinations and unchanged readable resume content | Edit only agreed URI annotations, reextract all links, compare page text, render and inspect pages after edits |
| Handoff | Reviewable local changes and suggested commit message | No commit or push; provide measured results and screenshot paths after build approval |

Current Phase 1 status: PDF transcription and source reconciliation complete, link audit complete with unresolved external statuses documented, four viewport/theme axe baselines complete, screenshots saved, Lighthouse measurement failed. No Phase 2 acceptance gate has been claimed as complete.

## Approval and remaining factual decisions

1. Approve the five section structure, PDF derived JSON, and visible copy proposal.
2. Choose signature A or B.
3. Confirm the pgxmock tradeoff explanation, since engineering context must not be presented as an undocumented personal decision.
4. Eagle Robotics has no verified replacement URL. Default proposal is to retain the volunteer entry without a website link and remove the unresolved PDF annotations in Phase 2, unless you supply the intended target.
5. The PDF and current site have the same LinkedIn URL. It is preserved pending manual verification, not silently changed. Exact contribution PR links may be added if supplied; no upstream merge claim is proposed.

Stop here for approval. Suggested eventual Phase 1 commit message, for you to use yourself: `docs: audit portfolio and draft resume based content plan`.
