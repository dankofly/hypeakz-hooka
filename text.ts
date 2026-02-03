
const COMMON = {
  company: {
    name: "HYPEAKZ.IO",
    owner: "Daniel Kofler",
    address: ["Thal-Aue 95", "9911 Assling", "Österreich"],
    email: "mail@danielkofler.com",
    phone: "+43 676 7293888",
    uid: "ATU77537202",
    authority: "Bezirkshauptmannschaft: Lienz",
    copyright: "© 2026 HYPEAKZ.IO | AI UNLOCKED"
  }
};

export const TRANSLATIONS = {
  EN: {
    ...COMMON,
    nav: {
      logoText: "HYPEAKZ.IO",
      editProfile: "Edit Profile",
      logout: "Logout",
      vaultAccess: "Vault Access",
      impressum: "Impressum",
      privacy: "Privacy",
      pricing: "Pricing",
      whyHooka: "Why Hooka"
    },
    hero: {
      badge: "Neuro-Hook Generator",
      titleLine1: "STOP THE",
      titleLine2: "SCROLL.",
      subtitleLine1: "HOOKA is the AI video hook generator that massively increases",
      subtitleLine2: "your conversion rate through neuro-psychological triggers."
    },
    tutorial: {
      headline: "The Viral Workflow",
      step1: { title: "1. Brand Scan", desc: "Scan your URL (Optional) to let the AI learn your brand DNA." },
      step2: { title: "2. Define Goal", desc: "Fill out the parameters. Be specific about your target audience." },
      step3: { title: "3. NLP Tuning", desc: "Use Pro Mode to inject psychological triggers and stop the scroll." }
    },
    briefing: {
      headline: "Setup Parameters",
      subline: "Fine-tune the output",
      outputLang: "Output Language",
      setupMode: "Setup Mode",
      mode: {
        auto: "Auto",
        pro: "Pro"
      },
      scout: {
        label: "Identity Node Extraction (Optional)",
        placeholder: "Enter brand URL to auto-brief...",
        buttonIdle: "Scan Brand",
        buttonActive: "Extracting...",
        sourcesTitle: "Neural Sources"
      },
      fields: {
        context: { 
          label: "Identity Context", 
          placeholder: "What is the product/offer?",
          help: "Describe your offer precisely. What is the core problem you solve and what is the unique selling point?"
        },
        goal: { 
          label: "Primary Goal", 
          placeholder: "What is the desired reaction (Sales, Leads)?",
          help: "Define the specific conversion goal. Do you want sales, newsletter signups, or more profile visits?"
        },
        audience: { 
          label: "Target Persona", 
          placeholder: "Who are we interrupting?",
          help: "Describe your ideal customer avatar. What keeps them awake at night? What are their deepest desires?"
        },
        speaker: { 
          label: "Authority Speaker", 
          placeholder: "Tone of voice / Brand Persona",
          help: "Who is the 'Character' in the video? A scientific expert, a funny friend, or a high-performance coach?"
        }
      },
      nlp: {
        headline: "Advanced Configuration",
        sections: {
          seo: "SEO & Content Context",
          limbic: "Limbic® Emotional Profiling",
          nlp: "Neuro-Linguistic Architecture"
        },
        labels: {
          contentContext: "Content Format",
          limbicType: "Limbic® Type",
          focusKeyword: "Focus Keyword",
          patternType: "Pattern Interrupt Style",
          repSystem: "Sensory Modality (VAK)",
          motivation: "Meta-Program: Motivation",
          decisionStyle: "Meta-Program: Decision",
          presupposition: "Presupposition Type",
          chunking: "Chunking Level",
          triggerWords: "Trigger Word Set (Max 3)",
          customTrigger: "Custom Trigger"
        },
        placeholders: {
          focusKeyword: "Main Topic / Keyword...",
          customTrigger: "Add specific word..."
        },
        tooltips: {
          focusKeyword: "Defines the semantic anchor for the AI. This keyword is integrated naturally into the script to signal thematic relevance to algorithms (SEO) and the viewer (Interest) immediately.",
          contentContext: "Frames the output format. 'Instagram Reel' prioritizes fast cuts and visual descriptions. 'Ad Headline' forces extreme compression. 'E-Mail' uses a subject-line specific structure.",
          limbicType: "Based on the Limbic® Map. \n• Harmonizer: Needs safety, care, belonging (Oxytocin). \n• Performer: Needs status, efficiency, victory (Testosterone). \n• Hedonist: Needs fun, novelty, kick (Dopamine). \nSets the emotional frequency of the copy.",
          patternType: "The psychological mechanism to stop the scroll. \n• Contradiction: States the opposite of belief. \n• Paradox: A logical impossibility that intrigues. \n• Denial: 'Don't watch this'. \nForces the brain out of autopilot.",
          repSystem: "Neuro-Linguistic Programming (VAK). \n• Visual: 'See', 'Focus', 'Bright'. \n• Auditory: 'Hear', 'Resonate', 'Loud'. \n• Kinesthetic: 'Grasp', 'Feel', 'Heavy'. \nMatches the primary processing channel of the persona.",
          motivation: "Meta-Program 'Direction'. \n• Towards: Motivated by goals and gains (Greed). \n• Away-From: Motivated by solving problems and avoiding pain (Fear).",
          decisionStyle: "Meta-Program 'Reasoning'. \n• Options: Wants choices, possibilities, and freedom. \n• Procedures: Wants a step-by-step 'How-To' guide and clear structure.",
          presupposition: "Hypnotic language patterns. Implies a truth without stating it directly. Example: 'When you earn more...' presupposes that you WILL earn more. Bypasses critical resistance.",
          chunking: "Information Hierarchy. \n• Chunk Down: Specific details, data, distinct facts. Good for logic types. \n• Chunk Up: Abstract concepts, big picture, visions. Good for emotional types.",
          triggerWords: "Signal Detection Theory. Specific words that act as 'Power Words'. The AI is forced to weave these exact terms into the hook to maximize impact.",
          customTrigger: "Manual injection of specific vocabulary. Useful for slogans, insider terms, or branding elements that must appear verbatim in the output."
        },
        options: {
          contentContext: [
            "Instagram Reel", "TikTok", "YouTube Shorts", "Ad Headline", "Landingpage Hero", "E-Mail Subject"
          ],
          limbicType: [
            "Harmonizer (Balance/Care)", 
            "Open-Minded (Fantasy/Enjoyment)", 
            "Hedonist (Fun/Novelty)", 
            "Adventurer (Risk/Freedom)", 
            "Performer (Status/Dominance)", 
            "Disciplined (Logic/Precision)", 
            "Traditionalist (Safety/Order)"
          ],
          patternType: [
            "Contradiction", "Paradox Reversal", "Provocative Denial", "Unexpected Truth", "Rule Breaking"
          ],
          repSystem: [
            "Visual (see, clear, picture)", "Auditory (hear, say, sound)", "Kinesthetic (feel, pressure, heavy)"
          ],
          motivation: [
            "Towards (Goal, Gain, Improvement)", "Away-from (Avoidance, Loss, Pain)"
          ],
          decisionStyle: [
            "Options (Freedom, Possibilities, Choice)", "Procedures (Steps, Structure, Process)"
          ],
          presupposition: [
            "Temporal (when, as soon as, after)", "Causal (because, therefore, due to)", "Identity (People who..., real...)", "Possession (your, what you lack)"
          ],
          chunking: [
            "Chunk Down (Specific, Concrete, Measurable)", "Chunk Up (Abstract, Principle, Perspective)"
          ],
          triggerWords: [
            "finally", "most people don't realize", "unnoticed", "hidden", "immediately", "hardly anyone", "right now"
          ]
        }
      },
      generateButton: {
        idle: "GENERATE VIRAL HOOKS",
        loading: "Decoding Pathways..."
      }
    },
    neuroHelp: {
      helpBtn: "Help",
      limbic: {
        title: "Limbic® Types",
        desc: "Based on the Limbic Map (Häusel). Defines the emotional driver of the user: Balance (Harmonizer), Dominance (Performer), or Stimulance (Hedonist/Adventurer). Tunes the script's emotional resonance."
      },
      pattern: {
        title: "Pattern Interrupt",
        desc: "Breaks cognitive routines and the user's 'autopilot'. Unexpected visual or auditory stimuli force the brain to pay immediate attention."
      },
      intensity: {
        title: "Emotional Intensity",
        desc: "Controls the depth of limbic activation. High values use strong emotions (shock, humor, anger) to increase message retention."
      },
      gap: {
        title: "Zeigarnik Gap",
        desc: "Creates an information vacuum ('Open Loop'). The brain instinctively demands the resolution of a started story or question."
      },
      fomo: {
        title: "FOMO Pressure",
        desc: "'Fear Of Missing Out'. Creates psychological pressure to act (Urgency) through scarcity or exclusivity to overcome passivity."
      }
    },
    results: {
      headline: "Neuro Concepts",
      copySuccess: "Copied!",
      labels: {
        hook: "The Viral Hook",
        script: "Video Script",
        pattern: "Pattern-Interrupt",
        intensity: "Intensity",
        gap: "Zeigarnik Gap",
        fomo: "FOMO Pressure"
      }
    },
    history: {
      title: "Timeline",
      empty: "New Generation"
    },
    profileManager: {
      label: "Briefing Vault",
      sublabel: "Secure your current setup",
      empty: "Vault is empty",
      addButton: "SAVE SETUP",
      placeholder: "NAME SETUP..."
    },
    auth: {
      modalTitle: "Enter the Vault",
      modalSubtitle: "Select your identity node",
      authenticatingTitle: "Authenticating...",
      connecting: "Connecting to identity node",
      continueWith: "Continue with",
      synchronizing: "Synchronizing...",
      // Email/Password specific
      emailLabel: "Email Address",
      passwordLabel: "Password",
      loginButton: "Sign In",
      registerButton: "Register",
      orContinueWith: "Or continue with",
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      noAccount: "No account yet?",
      backToOptions: "Back",
      // Verification
      verificationSent: "Verification email sent! Please check your inbox.",
      emailNotVerified: "Please verify your email first. A new verification email has been sent.",
      resendVerification: "Resend Email",
      checkingVerification: "Checking verification..."
    },
    profileEdit: {
      title: "Identity",
      subtitle: "Customize your node parameters",
      fields: {
        name: "Full Identity Name",
        brand: "Brand / Agency Authority",
        email: "Email Address",
        phone: "Neural Hotline (Phone)"
      },
      cancel: "Cancel",
      save: "Sync Profile",
      saving: "Syncing...",
      saved: "Synced",
      promoCode: {
        label: "Promo Code",
        placeholder: "Enter code...",
        activate: "Activate",
        unlimited: "Unlimited",
        activeMessage: "You have unlimited access to all features.",
        invalid: "Invalid promo code",
        success: "Promo code activated! Save to apply."
      }
    },
    legal: {
      consent: {
        title: "Privacy Settings",
        text: "HYPEAKZ.IO uses LocalStorage and external APIs (Google Gemini) to generate viral hooks. By using the app, you agree to the processing of your inputs for AI generation.",
        button: "Agree"
      },
      impressum: {
        title: "Imprint",
        h5: "Information according to § 5 TMG",
        hContact: "Contact",
        hAuthority: "Supervisory Authority",
        hUid: "VAT ID",
        hCompany: "Company Details",
        companyText: "Business Purpose: AI Automation and Marketing Services",
        memberText: "Membership: Austrian Economic Chambers (WKO)",
        hLaw: "Legal Regulations",
        hOdr: "Online Dispute Resolution",
        odrText: "The EU Commission provides a platform for online dispute resolution, which can be found at:",
        hDispute: "Dispute Resolution",
        disputeText: "We are generally not obliged and not willing to participate in dispute resolution proceedings before a consumer arbitration board."
      },
      privacy: {
        title: "Privacy Policy",
        lastUpdate: "Last updated: February 2026",
        h1: "1. Privacy at a Glance",
        t1: "We take the protection of your personal data very seriously. This privacy policy explains what data we collect when you use HYPEAKZ.IO (\"Hooka\"), how we use it, and what rights you have under the General Data Protection Regulation (GDPR) and the Austrian Data Protection Act (DSG).",
        h2: "2. Responsible Party (Controller)",
        h3: "3. Legal Basis for Processing",
        t3: "We process your personal data on the following legal bases:",
        t3a: "Art. 6(1)(a) GDPR – Consent: For the use of AI services and optional features",
        t3b: "Art. 6(1)(b) GDPR – Contract: For the provision of our services and payment processing",
        t3c: "Art. 6(1)(f) GDPR – Legitimate Interest: For security, fraud prevention, and service improvement",
        h4: "4. Data We Collect",
        t4: "We collect and process the following data:",
        h4a: "Account Data",
        t4a: "When you register, we collect: Name, email address, optional phone number. This data is necessary to create and manage your account.",
        h4b: "Usage Data",
        t4b: "We collect data about your use of the app: Generated hooks, saved briefings, history entries. This data is used to provide and improve our service.",
        h4c: "Payment Data",
        t4c: "For premium subscriptions, payment is processed by Stripe. We only store your Stripe Customer ID and subscription status – never credit card details.",
        h5: "5. Third-Party Services (Data Processors)",
        t5: "We use the following third-party services to operate our app. These providers process data on our behalf under data processing agreements:",
        firebase: {
          title: "Google Firebase (Authentication)",
          desc: "We use Firebase for user authentication (Google Sign-In, Email/Password). Firebase is operated by Google LLC.",
          data: "Data processed: Email, name, profile picture (for Google Sign-In), IP address",
          link: "Firebase Privacy Policy →"
        },
        gemini: {
          title: "Google Gemini AI (Content Generation)",
          desc: "Your briefing inputs are sent to Google's Gemini AI to generate viral hooks. Do not enter sensitive personal data of third parties.",
          data: "Data processed: Briefing text, product descriptions, target audience information",
          link: "Google Privacy Policy →"
        },
        stripe: {
          title: "Stripe (Payment Processing)",
          desc: "Premium subscriptions are processed by Stripe Inc. Stripe is PCI DSS certified for secure payment processing.",
          data: "Data processed: Email, payment details (processed directly by Stripe), subscription status",
          link: "Stripe Privacy Policy →"
        },
        netlify: {
          title: "Netlify (Hosting)",
          desc: "Our app is hosted on Netlify. Netlify may process IP addresses and technical metadata for security and performance.",
          data: "Data processed: IP address, browser information, access logs",
          link: "Netlify Privacy Policy →"
        },
        neon: {
          title: "Neon (Database)",
          desc: "User data, profiles, and generated content are stored in a PostgreSQL database hosted by Neon. Servers are located in the EU.",
          data: "Data processed: Account data, briefings, generated hooks, usage history",
          link: "Neon Privacy Policy →"
        },
        h6: "6. International Data Transfers",
        t6: "Some of our service providers (Google, Stripe) are based in the USA. These transfers are protected by EU Standard Contractual Clauses (SCCs) and, where applicable, additional safeguards. Google and Stripe are certified under the EU-US Data Privacy Framework.",
        h7: "7. Cookies & LocalStorage",
        t7: "We use browser storage technologies for essential app functionality. We do NOT use tracking cookies or third-party advertising cookies.",
        t7a: "Theme preference (dark/light mode) – stored locally",
        t7b: "Language preference – stored locally",
        t7c: "Session data – for authentication purposes",
        h8: "8. Data Retention",
        t8: "Your data is retained as long as your account is active. You can delete your account and all associated data at any time by contacting us. After account deletion, data is removed within 30 days. For legal reasons (e.g., tax records for payments), some data may be retained for up to 7 years.",
        h9: "9. Your Rights under GDPR",
        t9: "Under the GDPR, you have the following rights regarding your personal data:",
        t9a: "Right of Access (Art. 15 GDPR) – Obtain confirmation and a copy of your data",
        t9b: "Right to Rectification (Art. 16 GDPR) – Correct inaccurate data",
        t9c: "Right to Erasure (Art. 17 GDPR) – Delete your data (\"right to be forgotten\")",
        t9d: "Right to Restriction (Art. 18 GDPR) – Restrict processing of your data",
        t9e: "Right to Data Portability (Art. 20 GDPR) – Receive your data in a portable format",
        t9f: "Right to Object (Art. 21 GDPR) – Object to processing based on legitimate interests",
        t9g: "Right to Withdraw Consent – Withdraw consent at any time without affecting prior lawfulness",
        h10: "10. Supervisory Authority",
        t10: "You have the right to lodge a complaint with a data protection authority. The responsible authority for Austria is:",
        h11: "11. Changes to this Policy",
        t11: "We may update this privacy policy to reflect changes in our practices or legal requirements. Significant changes will be communicated via email or in-app notification. The current version is always available in the app."
      }
    },
    admin: {
      title: "HYPEAKZ_CORE",
      subtitle: "Neural Algorithm Control Center v2.0",
      disconnect: "DISCONNECT",
      authReq: "AUTHENTICATION REQUIRED",
      accessKey: "ACCESS KEY",
      decrypting: "DECRYPTING...",
      initiate: "INITIATE SESSION",
      metrics: "SYSTEM METRICS",
      users: "Total Users",
      hooks: "Generated Hooks",
      throughput: "API Throughput",
      tokens: "Token Consumption",
      neuralAct: "NEURAL ACTIVITY",
      editMode: "EDIT_MODE",
      instructions: "Algorithm Fine-Tuning Instructions",
      live: "LIVE",
      compiling: "COMPILING...",
      commit: "COMMIT CHANGES",
      placeholder: "// Enter system override instructions here..."
    },
    errors: {
      authFailed: "Authentication failed.",
      engineError: "AI-Engine Error.",
      profileSyncFailed: "Profile sync failed. Please try again.",
      missingKey: "SERVER ERROR: API Key Missing.\n\nPlease ensure 'GEMINI_API_KEY' is set in Netlify Environment Variables (WITHOUT VITE_ prefix).",
      invalidProviderOpenAI: "CONFIG ERROR: Wrong API Key type.\n\nYou're using an OpenAI Key (sk-...). This app requires a GOOGLE GEMINI Key (AIza...).\nPlease create one in Google AI Studio.",
      scoutError: "Error analyzing website.",
      // Firebase-specific errors
      emailInUse: "This email is already in use",
      invalidEmail: "Invalid email address",
      weakPassword: "Password must be at least 6 characters",
      userNotFound: "No account found with this email",
      wrongPassword: "Incorrect password",
      tooManyRequests: "Too many attempts. Please wait.",
      popupClosed: "Sign-in was cancelled"
    },
    pricing: {
      navTitle: "Hooka Pricing",
      title: "Pricing",
      badge: "Simple Pricing",
      headline: "Choose Your Plan",
      subheadline: "Start free with 10 generations. Upgrade for unlimited access.",
      freePlan: "Free",
      premiumPlan: "Premium",
      forever: "forever",
      month: "month",
      popular: "Popular",
      ctaPremium: "Upgrade Now",
      loginToUpgrade: "Login to Upgrade",
      activeSubscription: "Active Subscription",
      feature1Free: "10 Generations (Lifetime)",
      feature2Free: "4 Hook Variants per Generation",
      feature3Free: "All NLP Parameters",
      feature4Free: "Brand Scanner",
      feature1Premium: "Unlimited Generations",
      feature2Premium: "4 Hook Variants per Generation",
      feature3Premium: "All NLP Parameters",
      feature4Premium: "Brand Scanner",
      feature5Premium: "Priority Support",
      feature6Premium: "Early Access to New Features",
      faqTitle: "Frequently Asked Questions",
      faq1Q: "What happens after 10 free generations?",
      faq1A: "You can still view all generated hooks. For new generations, you need a Premium subscription.",
      faq2Q: "Can I cancel anytime?",
      faq2A: "Yes, you can cancel your subscription anytime. It will remain active until the end of the billing period.",
      faq3Q: "Which payment methods are accepted?",
      faq3A: "We accept all major credit cards via Stripe (Visa, Mastercard, American Express).",
      questions: "Still have questions?"
    },
    quota: {
      remaining: "left",
      used: "used",
      limitReached: "Limit Reached",
      upgradeTitle: "Upgrade to Premium",
      upgradeText: "You have used all 10 free generations.",
      upgradeSubtext: "Unlock unlimited viral hooks with Premium access.",
      contactUs: "Contact us for Premium Access",
      contactEmail: "mail@danielkofler.com",
      checkoutButton: "Upgrade Now - €10/month",
      loginFirst: "Login First",
      orContact: "Or contact us directly",
      checkoutSuccess: "Welcome to Premium!",
      checkoutCancelled: "Checkout cancelled",
      upgradeCta: "Upgrade for unlimited generations"
    },
    whyHooka: {
      navTitle: "Why Hooka",
      badge: "The Difference",
      headline: "Why Hooka?",
      subheadline: "Generic hooks don't convert. Hooka is the first hook generator that combines neuromarketing, NLP techniques, and SEO optimization to create highly personalized, high-converting content.",
      hooksIntroTitle: "What are Hooks?",
      hooksIntroText: "A Hook is the first sentence, the first 3 seconds, the first impression of your content. It's the make-or-break moment that decides whether your audience stays or scrolls. In a world where attention spans are shorter than ever, hooks are not just important – they are EVERYTHING.",
      hooksIntroText2: "Without a powerful hook, even the best content dies unnoticed. With the right hook, average content can go viral. It's that simple – and that critical.",
      hooksWhereTitle: "Where You Need Hooks",
      hooksWhere1Title: "Social Media Videos",
      hooksWhere1Desc: "TikTok, Reels, Shorts – the first 1-3 seconds decide everything. A strong hook means watch time, a weak hook means scroll.",
      hooksWhere2Title: "Ads & Commercials",
      hooksWhere2Desc: "Every ad dollar is wasted if the first frame doesn't capture. CPM goes down, ROAS goes up – with the right hook.",
      hooksWhere3Title: "Podcasts & YouTube",
      hooksWhere3Desc: "The intro decides the retention rate. A hook that creates curiosity keeps listeners from skipping.",
      hooksWhere4Title: "Email Marketing",
      hooksWhere4Desc: "Subject line = Hook. First sentence = Hook. Open rates live and die by the hook.",
      hooksWhere5Title: "Sales Pages & Landing Pages",
      hooksWhere5Desc: "The headline is your hook. It decides bounce rate and conversion. One sentence, infinite impact.",
      hooksWhere6Title: "Presentations & Pitches",
      hooksWhere6Desc: "Investors, clients, audiences – you have 10 seconds to win attention. The hook opens that door.",
      problemTitle: "The Problem",
      problemText: "Most AI-generated hooks are generic and interchangeable. They lack the psychological depth needed to truly stop the scroll and trigger action. Without personalization and proven persuasion techniques, your content gets lost in the endless feed.",
      solutionTitle: "The Hooka Solution",
      solutionText: "Hooka is the first hook generator that integrates neuromarketing techniques, NLP patterns, and SEO adjustments to create highly customized hooks and texts. Every output is tailored to your specific audience, platform, and conversion goal.",
      tag1: "Neuromarketing",
      tag2: "NLP Patterns",
      tag3: "SEO Optimized",
      featuresTitle: "Key Features",
      feature1Title: "Limbic Profiling",
      feature1Desc: "Target the emotional driver of your audience based on the scientific Limbic Map model.",
      feature2Title: "Pattern Interrupts",
      feature2Desc: "Break through the scroll autopilot with proven psychological techniques like paradox, denial, and contradiction.",
      feature3Title: "NLP Architecture",
      feature3Desc: "Leverage meta-programs, presuppositions, and sensory language to speak directly to your audience's subconscious.",
      autoBriefingTitle: "Auto-Briefing",
      autoBriefingText: "Don't know where to start? Use our automatic Brand Scanner to fill in the briefing fields automatically. Simply enter your URL, let the AI analyze your brand DNA, and then fine-tune the briefing to your needs. It's that simple.",
      ctaTitle: "Ready to Stop the Scroll?",
      ctaSubtitle: "Create your first neuro-optimized hook now.",
      ctaButton: "Start Generating"
    }
  },

  DE: {
    ...COMMON,
    nav: {
      logoText: "HYPEAKZ.IO",
      editProfile: "Profil",
      logout: "Abmelden",
      vaultAccess: "Vault Login",
      impressum: "Impressum",
      privacy: "Datenschutz",
      pricing: "Preise",
      whyHooka: "Warum Hooka"
    },
    hero: {
      badge: "Neuro-Hook Generator",
      titleLine1: "STOP THE",
      titleLine2: "SCROLL.",
      subtitleLine1: "HOOKA ist der AI Video-Hook-Generator, der durch neuro-psychologische",
      subtitleLine2: "Trigger deine Conversion-Rate massiv steigert."
    },
    tutorial: {
      headline: "The Viral Workflow",
      step1: { title: "1. Brand Scan", desc: "URL scannen (Optional), damit die KI deine Marken-DNA versteht." },
      step2: { title: "2. Briefing", desc: "Parameter ausfüllen. Sei spezifisch bei Zielgruppe und Kontext." },
      step3: { title: "3. NLP Tuning", desc: "Nutze den Pro-Modus für psychologische Trigger & Pattern Interrupts." }
    },
    briefing: {
      headline: "Briefing Parameter",
      subline: "Fine-tune the output",
      outputLang: "Ausgabesprache",
      setupMode: "Setup Modus",
      mode: {
        auto: "Auto",
        pro: "Pro"
      },
      scout: {
        label: "Identity Node Extraction (Optional)",
        placeholder: "Marken-URL eingeben (z.B. hypeakz.io)...",
        buttonIdle: "Analysieren",
        buttonActive: "Analysiere...",
        sourcesTitle: "Gefundene Quellen"
      },
      fields: {
        context: { 
          label: "Produkt & Angebot", 
          placeholder: "Was wird beworben? (Kontext)",
          help: "Beschreibe dein Angebot so präzise wie möglich. Was ist das Kernproblem, das du löst und was ist das Alleinstellungsmerkmal?"
        },
        goal: { 
          label: "Kampagnenziel", 
          placeholder: "Was ist die gewünschte Reaktion (Sales, Leads)?",
          help: "Definiere das konkrete Conversion-Ziel. Willst du Verkäufe, Newsletter-Anmeldungen oder mehr Profilaufrufe?"
        },
        audience: { 
          label: "Zielgruppe (Avatar)", 
          placeholder: "Wen unterbrechen wir?",
          help: "Beschreibe deinen idealen Kunden-Avatar. Was lässt ihn nachts nicht schlafen? Was sind seine tiefsten Wünsche?"
        },
        speaker: { 
          label: "Sprecher / Tonalität", 
          placeholder: "Tone of Voice / Markenpersönlichkeit",
          help: "Wer ist der 'Charakter' im Video? Ein wissenschaftlicher Experte, ein kumpelhafter Freund oder ein High-Performance Coach?"
        }
      },
      nlp: {
        headline: "Erweiterte Konfiguration",
        sections: {
          seo: "SEO & Content Kontext",
          limbic: "Limbic® Emotional Profiling",
          nlp: "Neuro-Linguistische Architektur"
        },
        labels: {
          contentContext: "Format / Plattform",
          limbicType: "Limbic® Typ",
          focusKeyword: "Fokus Keyword",
          patternType: "Pattern Interrupt",
          repSystem: "Wahrnehmungskanal (VAK)",
          motivation: "Meta-Programm: Motivation",
          decisionStyle: "Meta-Programm: Entscheidungsstil",
          presupposition: "Presupposition (Vorannahme)",
          chunking: "Detail-Tiefe (Chunking)",
          triggerWords: "Power-Wörter (Max 3)",
          customTrigger: "Eigenes Power-Wort"
        },
        placeholders: {
          focusKeyword: "Haupt-Keyword / Thema...",
          customTrigger: "Wort hinzufügen..."
        },
        tooltips: {
          focusKeyword: "Der semantische Anker für die KI. Dieses Wort wird organisch ins Skript integriert, um Algorithmen (SEO) und dem Zuschauer (Interesse) sofortige Relevanz zu signalisieren.",
          contentContext: "Rahmt das Ausgabeformat. 'Instagram Reel' priorisiert schnelle Schnitte und visuelle Beschreibungen. 'Ad Headline' erzwingt extreme Verdichtung.",
          limbicType: "Basiert auf der Limbic® Map. \n• Harmoniser: Braucht Sicherheit, Geborgenheit (Oxytocin). \n• Performer: Braucht Status, Effizienz, Sieg (Testosteron). \n• Hedonist: Braucht Spaß, Neues, Kicks (Dopamin). \nSetzt die emotionale Frequenz der Copy.",
          patternType: "Der psychologische Mechanismus, um den Scroll zu stoppen. \n• Widerspruch: Behauptet das Gegenteil des Glaubens. \n• Paradox: Eine logische Unmöglichkeit. \n• Verneinung: 'Schau das nicht'. \nZwingt das Gehirn aus dem Autopiloten.",
          repSystem: "Neuro-Linguistisches Programmieren (VAK). \n• Visuell: 'Sehen', 'Klar', 'Bild'. \n• Auditiv: 'Hören', 'Klingen'. \n• Kinästhetisch: 'Greifen', 'Fühlen', 'Schwer'. \nMatcht den primären Wahrnehmungskanal der Persona.",
          motivation: "Meta-Programm 'Richtung'. \n• Hin-zu: Motiviert durch Ziele und Gewinn (Gier). \n• Weg-von: Motiviert durch Problemlösung und Schmerzvermeidung (Angst).",
          decisionStyle: "Meta-Programm 'Entscheidung'. \n• Optionen: Will Auswahl, Möglichkeiten und Freiheit. \n• Prozeduren: Will eine Schritt-für-Schritt Anleitung und klare Struktur.",
          presupposition: "Hypnotische Sprachmuster. Impliziert eine Wahrheit, ohne sie direkt zu behaupten. Beispiel: 'Wenn du mehr verdienst...' setzt voraus, DASS du mehr verdienen wirst. Umgeht kritischen Widerstand.",
          chunking: "Informations-Hierarchie. \n• Chunk Down: Spezifische Details, Daten, Fakten. Gut für Logiker. \n• Chunk Up: Abstrakte Konzepte, Big Picture, Visionen. Gut für emotionale Typen.",
          triggerWords: "Signal Detection Theory. Spezifische Wörter, die als 'Power Words' fungieren. Die KI wird gezwungen, diese exakten Begriffe in den Hook einzuweben, um maximale Resonanz zu erzeugen.",
          customTrigger: "Manuelle Injektion spezifischer Vokabeln. Nützlich für Slogans, Insider-Begriffe oder Branding-Elemente, die zwingend im Output erscheinen müssen."
        },
        options: {
          contentContext: [
            "Instagram Reel", "TikTok", "YouTube Shorts", "Ad Headline", "Landingpage Hero", "E-Mail Subject"
          ],
          limbicType: [
            "Harmoniser (Balance & Fürsorge)", 
            "Offener (Genuss & Fantasie)", 
            "Hedonist (Spaß & Impuls)", 
            "Abenteurer (Risiko & Freiheit)", 
            "Performer (Erfolg & Status)", 
            "Disziplinierter (Logik & Präzision)", 
            "Traditionalist (Sicherheit & Ordnung)"
          ],
          patternType: [
            "Widerspruch", "Paradoxe Umkehr", "Provokative Verneinung", "Unerwartete Wahrheit", "Regelbruch"
          ],
          repSystem: [
            "Visuell (sehen, sichtbar, klar, Bild)", "Auditiv (hören, sagen, klingen, Stimme)", "Kinästhetisch (fühlen, Druck, leicht, schwer)"
          ],
          motivation: [
            "Hin-zu (Ziel, Gewinn, Verbesserung)", "Weg-von (Vermeidung, Verlust, Schmerz)"
          ],
          decisionStyle: [
            "Optionen (Freiheit, Möglichkeiten, Auswahl)", "Prozesse (Schritte, Struktur, Ablauf)"
          ],
          presupposition: [
            "Zeitlich („wenn“, „sobald“, „nachdem“)", "Kausal („weil“, „dadurch“, „deshalb“)", "Identität („Menschen, die...“, „wer wirklich...“)", "Besitz („dein“, „deine“, „was dir fehlt“)"
          ],
          chunking: [
            "Chunk Down (konkret, spezifisch, messbar)", "Chunk Up (abstrakt, Prinzip, Perspektive)"
          ],
          triggerWords: [
            "endlich", "die meisten merken nicht", "unbemerkt", "versteckt", "sofort", "kaum jemand", "genau jetzt"
          ]
        }
      },
      generateButton: {
        idle: "VIRALE HOOKS GENERIEREN",
        loading: "Decoding Pathways..."
      }
    },
    neuroHelp: {
      helpBtn: "Hilfe",
      limbic: {
        title: "Limbic® Types",
        desc: "Basiert auf der Limbic Map (Häusel). Definiert den emotionalen Treiber: Balance (Harmoniser), Dominanz (Performer) oder Stimulanz (Hedonist/Abenteurer). Bestimmt die emotionale Tonalität des Skripts."
      },
      pattern: {
        title: "Pattern Interrupt",
        desc: "Durchbricht kognitive Routinen und den 'Autopiloten' des Nutzers. Unerwartete visuelle oder auditive Reize zwingen das Gehirn zur sofortigen Aufmerksamkeit."
      },
      intensity: {
        title: "Emotional Intensity",
        desc: "Steuert die Tiefe der limbischen Aktivierung. Hohe Werte nutzen starke Emotionen (Schock, Humor, Wut), um die Merkfähigkeit der Botschaft zu erhöhen."
      },
      gap: {
        title: "Zeigarnik Gap",
        desc: "Erzeugt ein Informationsvakuum ('Open Loop'). Das Gehirn verlangt instinktiv nach der Auflösung einer angefangenen Geschichte oder Frage."
      },
      fomo: {
        title: "FOMO Pressure",
        desc: "'Fear Of Missing Out'. Erzeugt durch Verknappung oder Exklusivität einen psychologischen Handlungsdruck (Urgency), um Passivität zu überwinden."
      }
    },
    results: {
      headline: "Neuro Concepts",
      copySuccess: "Kopiert!",
      labels: {
        hook: "Der Viral Hook",
        script: "Video Skript",
        pattern: "Pattern-Interrupt",
        intensity: "Intensität",
        gap: "Zeigarnik Gap",
        fomo: "FOMO Druck"
      }
    },
    history: {
      title: "Verlauf",
      empty: "Neue Generierung"
    },
    profileManager: {
      label: "Briefing Vault",
      sublabel: "Aktuelles Setup sichern",
      empty: "Dein Vault ist leer",
      addButton: "SETUP SICHERN",
      placeholder: "SETUP NAME..."
    },
    auth: {
      modalTitle: "Enter the Vault",
      modalSubtitle: "Wähle deinen Identity Node",
      authenticatingTitle: "Authenticating...",
      connecting: "Verbinde zu Identity Node",
      continueWith: "Weiter mit",
      synchronizing: "Synchronisiere...",
      // Email/Password specific
      emailLabel: "E-Mail Adresse",
      passwordLabel: "Passwort",
      loginButton: "Anmelden",
      registerButton: "Registrieren",
      orContinueWith: "Oder fortfahren mit",
      createAccount: "Konto erstellen",
      alreadyHaveAccount: "Bereits ein Konto?",
      noAccount: "Noch kein Konto?",
      backToOptions: "Zurück",
      // Verification
      verificationSent: "Verifizierungs-E-Mail gesendet! Bitte prüfe deinen Posteingang.",
      emailNotVerified: "Bitte bestätige zuerst deine E-Mail. Eine neue E-Mail wurde gesendet.",
      resendVerification: "Erneut senden",
      checkingVerification: "Verifizierung wird geprüft..."
    },
    profileEdit: {
      title: "Identität",
      subtitle: "Node Parameter anpassen",
      fields: {
        name: "Voller Name",
        brand: "Marke / Agentur",
        email: "E-Mail Adresse",
        phone: "Neural Hotline (Telefon)"
      },
      cancel: "Abbrechen",
      save: "Profil Syncen",
      saving: "Syncing...",
      saved: "Gesynced",
      promoCode: {
        label: "Promo Code",
        placeholder: "Code eingeben...",
        activate: "Aktivieren",
        unlimited: "Unlimited",
        activeMessage: "Du hast unbegrenzten Zugang zu allen Features.",
        invalid: "Ungültiger Promo Code",
        success: "Promo Code aktiviert! Speichern um anzuwenden."
      }
    },
    legal: {
      consent: {
        title: "Datenschutz-Einstellungen",
        text: "HYPEAKZ.IO nutzt LocalStorage und externe APIs (Google Gemini), um virale Hooks zu generieren. Durch die Nutzung der App erklären Sie sich mit der Verarbeitung Ihrer Eingaben zur KI-Generierung einverstanden.",
        button: "Einverstanden"
      },
      impressum: {
        title: "Impressum",
        h5: "Angaben gemäß § 5 TMG",
        hContact: "Kontakt",
        hAuthority: "Aufsichtsbehörde",
        hUid: "Umsatzsteuer-ID",
        hCompany: "Unternehmensangaben",
        companyText: "Unternehmensgegenstand: AI Automation und Marketingdienstleistungen",
        memberText: "Mitgliedschaft: Wirtschaftskammer Österreich (WKO)",
        hLaw: "Rechtsvorschriften",
        hOdr: "Online-Streitbeilegung",
        odrText: "Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit, die du unter folgendem Link findest:",
        hDispute: "Streitbeilegung",
        disputeText: "Wir sind grundsätzlich nicht verpflichtet und nicht bereit an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen."
      },
      privacy: {
        title: "Datenschutzerklärung",
        lastUpdate: "Stand: Februar 2026",
        h1: "1. Datenschutz auf einen Blick",
        t1: "Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung erläutert, welche Daten wir bei der Nutzung von HYPEAKZ.IO (\"Hooka\") erheben, wie wir sie verwenden und welche Rechte Sie gemäß der Datenschutz-Grundverordnung (DSGVO) und dem österreichischen Datenschutzgesetz (DSG) haben.",
        h2: "2. Verantwortliche Stelle",
        h3: "3. Rechtsgrundlagen der Verarbeitung",
        t3: "Wir verarbeiten Ihre personenbezogenen Daten auf folgenden Rechtsgrundlagen:",
        t3a: "Art. 6 Abs. 1 lit. a DSGVO – Einwilligung: Für die Nutzung von KI-Diensten und optionalen Funktionen",
        t3b: "Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung: Für die Bereitstellung unserer Dienste und Zahlungsabwicklung",
        t3c: "Art. 6 Abs. 1 lit. f DSGVO – Berechtigtes Interesse: Für Sicherheit, Betrugsprävention und Serviceverbesserung",
        h4: "4. Erhobene Daten",
        t4: "Wir erheben und verarbeiten folgende Daten:",
        h4a: "Kontodaten",
        t4a: "Bei der Registrierung erheben wir: Name, E-Mail-Adresse, optional Telefonnummer. Diese Daten sind für die Erstellung und Verwaltung Ihres Kontos erforderlich.",
        h4b: "Nutzungsdaten",
        t4b: "Wir erheben Daten über Ihre App-Nutzung: Generierte Hooks, gespeicherte Briefings, Verlaufseinträge. Diese Daten dienen der Bereitstellung und Verbesserung unseres Dienstes.",
        h4c: "Zahlungsdaten",
        t4c: "Für Premium-Abonnements wird die Zahlung über Stripe abgewickelt. Wir speichern nur Ihre Stripe-Kunden-ID und den Abonnementstatus – niemals Kreditkartendaten.",
        h5: "5. Drittanbieter (Auftragsverarbeiter)",
        t5: "Wir nutzen folgende Drittanbieter zum Betrieb unserer App. Diese Anbieter verarbeiten Daten in unserem Auftrag auf Grundlage von Auftragsverarbeitungsverträgen:",
        firebase: {
          title: "Google Firebase (Authentifizierung)",
          desc: "Wir nutzen Firebase für die Benutzerauthentifizierung (Google-Anmeldung, E-Mail/Passwort). Firebase wird von Google LLC betrieben.",
          data: "Verarbeitete Daten: E-Mail, Name, Profilbild (bei Google-Anmeldung), IP-Adresse",
          link: "Firebase Datenschutz →"
        },
        gemini: {
          title: "Google Gemini AI (Content-Generierung)",
          desc: "Ihre Briefing-Eingaben werden an Googles Gemini AI gesendet, um virale Hooks zu generieren. Geben Sie keine sensiblen personenbezogenen Daten Dritter ein.",
          data: "Verarbeitete Daten: Briefing-Text, Produktbeschreibungen, Zielgruppeninformationen",
          link: "Google Datenschutz →"
        },
        stripe: {
          title: "Stripe (Zahlungsabwicklung)",
          desc: "Premium-Abonnements werden über Stripe Inc. abgewickelt. Stripe ist PCI DSS zertifiziert für sichere Zahlungsverarbeitung.",
          data: "Verarbeitete Daten: E-Mail, Zahlungsdaten (direkt bei Stripe verarbeitet), Abonnementstatus",
          link: "Stripe Datenschutz →"
        },
        netlify: {
          title: "Netlify (Hosting)",
          desc: "Unsere App wird auf Netlify gehostet. Netlify kann IP-Adressen und technische Metadaten für Sicherheit und Performance verarbeiten.",
          data: "Verarbeitete Daten: IP-Adresse, Browser-Informationen, Zugriffsprotokolle",
          link: "Netlify Datenschutz →"
        },
        neon: {
          title: "Neon (Datenbank)",
          desc: "Benutzerdaten, Profile und generierte Inhalte werden in einer PostgreSQL-Datenbank bei Neon gespeichert. Die Server befinden sich in der EU.",
          data: "Verarbeitete Daten: Kontodaten, Briefings, generierte Hooks, Nutzungsverlauf",
          link: "Neon Datenschutz →"
        },
        h6: "6. Internationale Datenübertragungen",
        t6: "Einige unserer Dienstleister (Google, Stripe) haben ihren Sitz in den USA. Diese Übertragungen sind durch EU-Standardvertragsklauseln (SCCs) und ggf. zusätzliche Schutzmaßnahmen abgesichert. Google und Stripe sind unter dem EU-US Data Privacy Framework zertifiziert.",
        h7: "7. Cookies & LocalStorage",
        t7: "Wir nutzen Browser-Speichertechnologien für wesentliche App-Funktionen. Wir verwenden KEINE Tracking-Cookies oder Werbe-Cookies von Drittanbietern.",
        t7a: "Theme-Einstellung (Dark/Light Mode) – lokal gespeichert",
        t7b: "Spracheinstellung – lokal gespeichert",
        t7c: "Session-Daten – für Authentifizierungszwecke",
        h8: "8. Datenspeicherung",
        t8: "Ihre Daten werden gespeichert, solange Ihr Konto aktiv ist. Sie können Ihr Konto und alle zugehörigen Daten jederzeit durch Kontaktaufnahme löschen lassen. Nach Kontolöschung werden Daten innerhalb von 30 Tagen entfernt. Aus rechtlichen Gründen (z.B. Steuerunterlagen für Zahlungen) können einige Daten bis zu 7 Jahre aufbewahrt werden.",
        h9: "9. Ihre Rechte nach DSGVO",
        t9: "Nach der DSGVO haben Sie folgende Rechte bezüglich Ihrer personenbezogenen Daten:",
        t9a: "Auskunftsrecht (Art. 15 DSGVO) – Bestätigung und Kopie Ihrer Daten erhalten",
        t9b: "Recht auf Berichtigung (Art. 16 DSGVO) – Unrichtige Daten korrigieren",
        t9c: "Recht auf Löschung (Art. 17 DSGVO) – Ihre Daten löschen (\"Recht auf Vergessenwerden\")",
        t9d: "Recht auf Einschränkung (Art. 18 DSGVO) – Verarbeitung Ihrer Daten einschränken",
        t9e: "Recht auf Datenübertragbarkeit (Art. 20 DSGVO) – Ihre Daten in portablem Format erhalten",
        t9f: "Widerspruchsrecht (Art. 21 DSGVO) – Verarbeitung auf Basis berechtigter Interessen widersprechen",
        t9g: "Recht auf Widerruf der Einwilligung – Einwilligung jederzeit widerrufen, ohne die Rechtmäßigkeit der bisherigen Verarbeitung zu berühren",
        h10: "10. Aufsichtsbehörde",
        t10: "Sie haben das Recht, Beschwerde bei einer Datenschutzbehörde einzulegen. Die zuständige Behörde für Österreich ist:",
        h11: "11. Änderungen dieser Erklärung",
        t11: "Wir können diese Datenschutzerklärung aktualisieren, um Änderungen unserer Praktiken oder rechtlicher Anforderungen widerzuspiegeln. Wesentliche Änderungen werden per E-Mail oder In-App-Benachrichtigung mitgeteilt. Die aktuelle Version ist jederzeit in der App verfügbar."
      }
    },
    admin: {
      title: "HYPEAKZ_CORE",
      subtitle: "Neural Algorithm Control Center v2.0",
      disconnect: "DISCONNECT",
      authReq: "AUTHENTICATION REQUIRED",
      accessKey: "ACCESS KEY",
      decrypting: "DECRYPTING...",
      initiate: "INITIATE SESSION",
      metrics: "SYSTEM METRICS",
      users: "Total Users",
      hooks: "Generated Hooks",
      throughput: "API Throughput",
      tokens: "Token Consumption",
      neuralAct: "NEURAL ACTIVITY",
      editMode: "EDIT_MODE",
      instructions: "Algorithm Fine-Tuning Instructions",
      live: "LIVE",
      compiling: "COMPILING...",
      commit: "COMMIT CHANGES",
      placeholder: "// System Override Anweisungen hier eingeben..."
    },
    errors: {
      authFailed: "Authentifizierung fehlgeschlagen.",
      engineError: "AI-Engine Error.",
      profileSyncFailed: "Fehler beim Profil-Sync. Bitte erneut versuchen.",
      missingKey: "SERVER ERROR: API Key Missing.\n\nBitte stelle sicher, dass 'GEMINI_API_KEY' in den Netlify Environment Variables gesetzt ist (OHNE VITE_ Prefix).",
      invalidProviderOpenAI: "CONFIG ERROR: Falscher API Key Typ.\n\nDu verwendest einen OpenAI Key (sk-...). Diese App benötigt einen GOOGLE GEMINI Key (AIza...).\nBitte erstelle einen Key im Google AI Studio.",
      scoutError: "Fehler bei der Website-Analyse.",
      // Firebase-specific errors
      emailInUse: "Diese E-Mail wird bereits verwendet",
      invalidEmail: "Ungültige E-Mail-Adresse",
      weakPassword: "Passwort muss mindestens 6 Zeichen haben",
      userNotFound: "Kein Konto mit dieser E-Mail gefunden",
      wrongPassword: "Falsches Passwort",
      tooManyRequests: "Zu viele Versuche. Bitte warten.",
      popupClosed: "Anmeldung abgebrochen"
    },
    pricing: {
      navTitle: "Hooka Preise",
      title: "Preise",
      badge: "Simple Preise",
      headline: "Wähle deinen Plan",
      subheadline: "Starte kostenlos mit 10 Generierungen. Upgrade für unbegrenzten Zugang.",
      freePlan: "Free",
      premiumPlan: "Premium",
      forever: "für immer",
      month: "Monat",
      popular: "Beliebt",
      ctaPremium: "Jetzt upgraden",
      loginToUpgrade: "Einloggen zum Upgraden",
      activeSubscription: "Aktives Abo",
      feature1Free: "10 Generierungen (Lifetime)",
      feature2Free: "4 Hook-Varianten pro Generation",
      feature3Free: "Alle NLP-Parameter",
      feature4Free: "Brand Scanner",
      feature1Premium: "Unbegrenzte Generierungen",
      feature2Premium: "4 Hook-Varianten pro Generation",
      feature3Premium: "Alle NLP-Parameter",
      feature4Premium: "Brand Scanner",
      feature5Premium: "Prioritäts-Support",
      feature6Premium: "Früher Zugang zu neuen Features",
      faqTitle: "Häufige Fragen",
      faq1Q: "Was passiert nach den 10 Gratis-Generierungen?",
      faq1A: "Du kannst weiterhin alle generierten Hooks ansehen. Für neue Generierungen benötigst du ein Premium-Abo.",
      faq2Q: "Kann ich jederzeit kündigen?",
      faq2A: "Ja, du kannst dein Abo jederzeit kündigen. Es läuft dann zum Ende der Abrechnungsperiode aus.",
      faq3Q: "Welche Zahlungsmethoden werden akzeptiert?",
      faq3A: "Wir akzeptieren alle gängigen Kreditkarten über Stripe (Visa, Mastercard, American Express).",
      questions: "Noch Fragen?"
    },
    quota: {
      remaining: "übrig",
      used: "verwendet",
      limitReached: "Limit erreicht",
      upgradeTitle: "Upgrade auf Premium",
      upgradeText: "Du hast alle 10 Gratis-Generierungen aufgebraucht.",
      upgradeSubtext: "Schalte unbegrenzte virale Hooks mit Premium-Zugang frei.",
      contactUs: "Kontaktiere uns für Premium-Zugang",
      contactEmail: "mail@danielkofler.com",
      checkoutButton: "Jetzt upgraden - €10/Monat",
      loginFirst: "Erst einloggen",
      orContact: "Oder kontaktiere uns direkt",
      checkoutSuccess: "Willkommen bei Premium!",
      checkoutCancelled: "Checkout abgebrochen",
      upgradeCta: "Upgrade für unbegrenzte Generierungen"
    },
    whyHooka: {
      navTitle: "Warum Hooka",
      badge: "Der Unterschied",
      headline: "Warum Hooka?",
      subheadline: "Generische Hooks konvertieren nicht. Hooka ist der erste Hook-Generator, der Neuromarketing, NLP-Techniken und SEO-Optimierung kombiniert, um hochpersonalisierte, konvertierende Inhalte zu erstellen.",
      hooksIntroTitle: "Was sind Hooks?",
      hooksIntroText: "Ein Hook ist der erste Satz, die ersten 3 Sekunden, der erste Eindruck deines Contents. Es ist der entscheidende Moment, der bestimmt, ob dein Publikum bleibt oder weiterscrollt. In einer Welt, in der die Aufmerksamkeitsspanne kürzer ist als je zuvor, sind Hooks nicht nur wichtig – sie sind ALLES.",
      hooksIntroText2: "Ohne einen starken Hook stirbt selbst der beste Content unbemerkt. Mit dem richtigen Hook kann durchschnittlicher Content viral gehen. So einfach – und so entscheidend.",
      hooksWhereTitle: "Wo du Hooks brauchst",
      hooksWhere1Title: "Social Media Videos",
      hooksWhere1Desc: "TikTok, Reels, Shorts – die ersten 1-3 Sekunden entscheiden alles. Ein starker Hook bedeutet Watch Time, ein schwacher Hook bedeutet Scroll.",
      hooksWhere2Title: "Ads & Werbung",
      hooksWhere2Desc: "Jeder Werbe-Euro ist verschwendet, wenn der erste Frame nicht fesselt. CPM sinkt, ROAS steigt – mit dem richtigen Hook.",
      hooksWhere3Title: "Podcasts & YouTube",
      hooksWhere3Desc: "Das Intro entscheidet die Retention Rate. Ein Hook, der Neugier weckt, hält Zuhörer vom Skippen ab.",
      hooksWhere4Title: "E-Mail-Marketing",
      hooksWhere4Desc: "Betreffzeile = Hook. Erster Satz = Hook. Öffnungsraten leben und sterben mit dem Hook.",
      hooksWhere5Title: "Sales Pages & Landing Pages",
      hooksWhere5Desc: "Die Headline ist dein Hook. Sie entscheidet über Bounce Rate und Conversion. Ein Satz, unendliche Wirkung.",
      hooksWhere6Title: "Präsentationen & Pitches",
      hooksWhere6Desc: "Investoren, Kunden, Publikum – du hast 10 Sekunden, um Aufmerksamkeit zu gewinnen. Der Hook öffnet diese Tür.",
      problemTitle: "Das Problem",
      problemText: "Die meisten KI-generierten Hooks sind generisch und austauschbar. Ihnen fehlt die psychologische Tiefe, um wirklich den Scroll zu stoppen und Handlung auszulösen. Ohne Personalisierung und bewährte Überzeugungstechniken geht dein Content im endlosen Feed unter.",
      solutionTitle: "Die Hooka Lösung",
      solutionText: "Hooka ist der erste Hook-Generator, der Neuromarketing-Techniken, NLP-Muster und SEO-Anpassungen integriert, um hochindividualisierte Hooks und Texte zu erstellen. Jeder Output ist auf deine spezifische Zielgruppe, Plattform und dein Conversion-Ziel zugeschnitten.",
      tag1: "Neuromarketing",
      tag2: "NLP-Muster",
      tag3: "SEO-optimiert",
      featuresTitle: "Hauptfunktionen",
      feature1Title: "Limbic Profiling",
      feature1Desc: "Ziele auf den emotionalen Treiber deiner Zielgruppe basierend auf dem wissenschaftlichen Limbic Map Modell.",
      feature2Title: "Pattern Interrupts",
      feature2Desc: "Durchbrich den Scroll-Autopiloten mit bewährten psychologischen Techniken wie Paradox, Verneinung und Widerspruch.",
      feature3Title: "NLP-Architektur",
      feature3Desc: "Nutze Meta-Programme, Präsuppositionen und sensorische Sprache, um direkt zum Unterbewusstsein deiner Zielgruppe zu sprechen.",
      autoBriefingTitle: "Auto-Briefing",
      autoBriefingText: "Weißt du nicht, wo du anfangen sollst? Nutze unseren automatischen Brand Scanner, um die Briefing-Felder automatisch auszufüllen. Gib einfach deine URL ein, lass die KI deine Marken-DNA analysieren und passe dann das Briefing nach deinen Bedürfnissen an. So einfach ist das.",
      ctaTitle: "Bereit, den Scroll zu stoppen?",
      ctaSubtitle: "Erstelle jetzt deinen ersten neuro-optimierten Hook.",
      ctaButton: "Jetzt generieren"
    }
  }
};
