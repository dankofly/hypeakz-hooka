
import { GoogleGenAI, Type } from "@google/genai";
import { neon } from '@netlify/neon';
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import Stripe from 'stripe';

// Stripe Setup
const getStripe = (): Stripe | null => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
  return new Stripe(secretKey);
};

const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || 'price_1StvVa037lod7PW0V0iiLRCe';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Firebase Admin Singleton
let firebaseAdminApp: App | null = null;

const initFirebaseAdmin = (): App | null => {
  if (firebaseAdminApp) return firebaseAdminApp;
  if (getApps().length > 0) {
    firebaseAdminApp = getApps()[0];
    return firebaseAdminApp;
  }

  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccount) {
    console.warn('Firebase Admin not configured - FIREBASE_SERVICE_ACCOUNT_KEY missing');
    return null;
  }

  try {
    firebaseAdminApp = initializeApp({
      credential: cert(JSON.parse(serviceAccount))
    });
    return firebaseAdminApp;
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
    return null;
  }
};

// Token verification helper
const verifyFirebaseToken = async (authHeader: string | undefined): Promise<string | null> => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const app = initFirebaseAdmin();
  if (!app) return null;

  try {
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth(app).verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

const headers = {
  "Access-Control-Allow-Origin": "*", // Note: In production, strict specific origins are recommended
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// SECURITY: Use Environment Variable or fallback only for local dev to avoid build breaks
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "377oub377";

const getSql = () => {
  const url = process.env.NETLIFY_DATABASE_URL;
  if (!url) return null;
  return neon(url);
};

// Optimization: Cached Table Initialization Promise to avoid redundant queries per cold start
let tablesInitPromise: Promise<any> | null = null;

const ensureTables = async (sql: any) => {
  if (tablesInitPromise) return tablesInitPromise;

  tablesInitPromise = (async () => {
    // Create tables if they don't exist
    await Promise.all([
      sql`CREATE TABLE IF NOT EXISTS hypeakz_users (id TEXT PRIMARY KEY, name TEXT, brand TEXT, email TEXT, phone TEXT, created_at BIGINT, unlimited_status BOOLEAN DEFAULT FALSE, generation_count INT DEFAULT 0)`,
      sql`CREATE TABLE IF NOT EXISTS hypeakz_history (id TEXT PRIMARY KEY, timestamp BIGINT, brief JSONB, concepts JSONB)`,
      sql`CREATE TABLE IF NOT EXISTS hypeakz_profiles (id TEXT PRIMARY KEY, name TEXT, brief JSONB)`,
      sql`CREATE TABLE IF NOT EXISTS hypeakz_analytics (id TEXT PRIMARY KEY, event_name TEXT, timestamp BIGINT, metadata JSONB)`,
      sql`CREATE TABLE IF NOT EXISTS hypeakz_settings (key TEXT PRIMARY KEY, value TEXT)`,
      sql`CREATE TABLE IF NOT EXISTS hypeakz_promo_codes (id TEXT PRIMARY KEY, code TEXT UNIQUE NOT NULL, created_at BIGINT, used_by TEXT, used_at BIGINT)`
    ]);

    // Add Stripe columns if they don't exist (migration for existing tables)
    // Use function call syntax for DDL statements
    const migrations = [
      'ALTER TABLE hypeakz_users ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT FALSE',
      'ALTER TABLE hypeakz_users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT',
      'ALTER TABLE hypeakz_users ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT',
      'ALTER TABLE hypeakz_users ADD COLUMN IF NOT EXISTS subscription_status TEXT'
    ];

    for (const migration of migrations) {
      try {
        await sql(migration);
      } catch (e: any) {
        // Ignore "already exists" errors, log others
        if (!e.message?.includes('already exists')) {
          console.log('Migration error:', e.message);
        }
      }
    }
  })().catch(e => {
    console.error("Table init error:", e);
    tablesInitPromise = null;
  });

  return tablesInitPromise;
};

// Helper: Generate unique promo code
const generatePromoCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'HYPEAKZ-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const fetchUrlContent = async (targetUrl: string): Promise<string | null> => {
  try {
    const controller = new AbortController();
    // OPTIMIZED TIMEOUT: 7 seconds. 
    // Gives Jina enough time to render JS-heavy sites, but leaves 3s for Gemini (in a 10s Netlify Function limit).
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    let urlToScrape = targetUrl.trim();
    if (!urlToScrape.startsWith('http')) {
        urlToScrape = 'https://' + urlToScrape;
    }

    // Jina AI Reader URL (The Bridge)
    const scrapeUrl = `https://r.jina.ai/${urlToScrape}`;

    const response = await fetch(scrapeUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'text/plain', // Request clean text/markdown
        'X-Return-Format': 'markdown',
        'X-With-Generated-Alt': 'true', // Get alt text for images to understand context
        'User-Agent': 'Hypeakz-Scanner/1.0'
      }
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) return null;
    
    const text = await response.text();
    
    // Validation: Filter out Jina error pages or empty results
    if (text.length < 100 || (text.includes("Jina Reader") && text.includes("Error"))) return null;
    if (text.includes("Cloudflare") || text.includes("Verify you are human") || text.includes("Access denied")) return null;

    return text.substring(0, 35000); // Increased buffer to capture more context
  } catch (e) {
    // Fail silently so fallback (Google Search) can take over
    return null; 
  }
};

const getSystemInstruction = (language: string, customTuning: string = "") => `
ROLE: Du agierst als einer der weltweit besten Marketingexperten, spezialisiert auf Neuro-Marketing, NLP und virale Psychologie. 
MISSION: Erstelle Video-Skripte, die den kritischen Faktor des Gehirns umgehen und direkt das limbische System ansprechen.
TONE: Autoritär, direkt, hoch-konvertierend.
SPRACHE: ${language === 'DE' ? 'Deutsch' : 'Englisch'}.
${customTuning ? `\nADMIN OVERRIDE:\n${customTuning}` : ''}
`;

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: "Method Not Allowed" };

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const sql = getSql();
    
    if (!apiKey && !sql) return { statusCode: 500, headers, body: JSON.stringify({ error: "Configuration Error" }) };

    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (e) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
    }

    const { action, payload } = body;
    let result: any = { success: true };

    // Protected actions that require authentication
    const protectedActions = ['save-user', 'get-user', 'save-history', 'get-history', 'save-profile', 'get-profiles', 'delete-profile'];

    if (protectedActions.includes(action)) {
      const userId = await verifyFirebaseToken(event.headers.authorization || event.headers.Authorization);
      if (!userId) {
        // Allow fallback for users without Firebase configured (backwards compatibility)
        console.debug('No valid Firebase token - proceeding without auth verification');
      } else {
        // Inject verified userId into payload for user-specific operations
        payload.verifiedUserId = userId;
      }
    }

    if (sql && ['log-analytics', 'save-user', 'save-history', 'save-profile', 'save-admin-prompt', 'generate-hooks', 'create-checkout-session'].includes(action)) {
      await ensureTables(sql);
    }

    switch (action) {
      // --- DB OPERATIONS (Standard) ---
      case 'init-db': { if (sql) await ensureTables(sql); break; }
      case 'log-analytics': {
        if (!sql) break;
        const { id, eventName, timestamp, metadata } = payload;
        await sql`INSERT INTO hypeakz_analytics (id, event_name, timestamp, metadata) VALUES (${id}, ${eventName}, ${timestamp}, ${metadata})`;
        break;
      }
      case 'save-user': {
        if (!sql) break;
        const u = payload;
        if (!u.id || !u.name) break;
        await ensureTables(sql);
        await sql`INSERT INTO hypeakz_users (id, name, brand, email, phone, created_at, unlimited_status) VALUES (${u.id}, ${u.name}, ${u.brand}, ${u.email}, ${u.phone || null}, ${u.createdAt}, ${u.unlimitedStatus || false}) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, brand = EXCLUDED.brand, email = EXCLUDED.email, phone = EXCLUDED.phone, unlimited_status = EXCLUDED.unlimited_status`;
        break;
      }
      case 'get-user': {
        if (!sql) { result = null; break; }
        await ensureTables(sql);
        const rows = await sql`SELECT * FROM hypeakz_users WHERE id = ${payload.id} LIMIT 1`;
        result = rows.length === 0 ? null : {
          id: rows[0].id, name: rows[0].name, brand: rows[0].brand, email: rows[0].email, phone: rows[0].phone, createdAt: Number(rows[0].created_at), unlimitedStatus: rows[0].unlimited_status || false, generationCount: rows[0].generation_count || 0
        };
        break;
      }
      case 'save-history': {
        if (!sql) break;
        const h = payload;
        await sql`INSERT INTO hypeakz_history (id, timestamp, brief, concepts) VALUES (${h.id}, ${h.timestamp}, ${h.brief}, ${h.concepts}) ON CONFLICT (id) DO UPDATE SET timestamp = EXCLUDED.timestamp, brief = EXCLUDED.brief, concepts = EXCLUDED.concepts`;
        break;
      }
      case 'get-history': {
        if (!sql) { result = []; break; }
        const rows = await sql`SELECT id, timestamp, brief, concepts FROM hypeakz_history ORDER BY timestamp DESC LIMIT 20`;
        result = rows.map((r: any) => ({ id: r.id, timestamp: Number(r.timestamp), brief: r.brief, concepts: r.concepts }));
        break;
      }
      case 'save-profile': {
        if (!sql) break;
        const p = payload;
        await sql`INSERT INTO hypeakz_profiles (id, name, brief) VALUES (${p.id}, ${p.name}, ${p.brief}) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, brief = EXCLUDED.brief`;
        break;
      }
      case 'get-profiles': {
        if (!sql) { result = []; break; }
        result = await sql`SELECT id, name, brief FROM hypeakz_profiles ORDER BY name ASC`;
        break;
      }
      case 'delete-profile': {
        if (!sql) break;
        await sql`DELETE FROM hypeakz_profiles WHERE id = ${payload.id}`;
        break;
      }

      // --- ADMIN OPERATIONS ---
      case 'verify-admin': {
        const isValid = payload.password === ADMIN_PASS;
        await new Promise(r => setTimeout(r, 300));
        result = { success: isValid };
        break;
      }
      case 'get-admin-stats': {
         if (payload.password !== ADMIN_PASS) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
         if (!sql) { result = { userCount: 0, historyCount: 0, apiCalls: 0, tokenCount: 0 }; break; }
         try {
           const [u, h, a, t] = await Promise.all([
             sql`SELECT COUNT(*) FROM hypeakz_users`, 
             sql`SELECT COUNT(*) FROM hypeakz_history`, 
             sql`SELECT COUNT(*) FROM hypeakz_analytics`,
             sql`SELECT SUM((metadata->>'tokens')::int) as total FROM hypeakz_analytics WHERE event_name = 'ai_cost'`
           ]);
           result = { userCount: parseInt(u[0].count), historyCount: parseInt(h[0].count) * 4, apiCalls: parseInt(a[0].count), tokenCount: t[0].total ? parseInt(t[0].total) : 0 };
         } catch (e) { result = { userCount: 0, historyCount: 0, apiCalls: 0, tokenCount: 0 }; }
         break;
      }
      case 'get-admin-prompt': {
        if (!sql) { result = { prompt: "" }; break; }
        const rows = await sql`SELECT value FROM hypeakz_settings WHERE key = 'system_prompt' LIMIT 1`;
        result = { prompt: rows.length ? rows[0].value : "" };
        break;
      }
      case 'save-admin-prompt': {
        if (payload.password !== ADMIN_PASS) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
        if (!sql) throw new Error("No Database");
        await sql`INSERT INTO hypeakz_settings (key, value) VALUES ('system_prompt', ${payload.prompt}) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`;
        result = { success: true };
        break;
      }

      // --- ADMIN USER MANAGEMENT ---
      case 'admin-get-users': {
        if (payload.password !== ADMIN_PASS) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
        if (!sql) { result = []; break; }
        await ensureTables(sql);
        const users = await sql`SELECT id, name, email, brand, created_at, unlimited_status, generation_count, paid FROM hypeakz_users ORDER BY created_at DESC`;
        result = users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          brand: u.brand,
          createdAt: Number(u.created_at),
          unlimitedStatus: u.unlimited_status || false,
          generationCount: u.generation_count || 0,
          paid: u.paid || false
        }));
        break;
      }

      case 'admin-toggle-paid': {
        if (payload.password !== ADMIN_PASS) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
        if (!sql) throw new Error("No Database");
        await sql`UPDATE hypeakz_users SET paid = NOT COALESCE(paid, false) WHERE id = ${payload.userId}`;
        result = { success: true };
        break;
      }

      case 'admin-toggle-unlimited': {
        if (payload.password !== ADMIN_PASS) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
        if (!sql) throw new Error("No Database");
        await sql`UPDATE hypeakz_users SET unlimited_status = NOT COALESCE(unlimited_status, false) WHERE id = ${payload.userId}`;
        result = { success: true };
        break;
      }

      // --- PROMO CODE MANAGEMENT ---
      case 'admin-generate-promo': {
        if (payload.password !== ADMIN_PASS) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
        if (!sql) throw new Error("No Database");
        await ensureTables(sql);

        const code = generatePromoCode();
        const id = Date.now().toString() + Math.random().toString(36).substring(7);
        await sql`INSERT INTO hypeakz_promo_codes (id, code, created_at) VALUES (${id}, ${code}, ${Date.now()})`;
        result = { code };
        break;
      }

      case 'admin-get-promo-codes': {
        if (payload.password !== ADMIN_PASS) return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
        if (!sql) { result = []; break; }
        await ensureTables(sql);
        const codes = await sql`SELECT id, code, created_at, used_by, used_at FROM hypeakz_promo_codes ORDER BY created_at DESC`;
        result = codes.map((c: any) => ({
          id: c.id,
          code: c.code,
          createdAt: Number(c.created_at),
          usedBy: c.used_by || null,
          usedAt: c.used_at ? Number(c.used_at) : null
        }));
        break;
      }

      case 'validate-promo-code': {
        if (!sql) { result = { valid: false, error: 'No database' }; break; }
        await ensureTables(sql);

        const { code, userId } = payload;
        if (!code || !userId) { result = { valid: false, error: 'Missing data' }; break; }

        // Check if code exists and is not used
        const codeRows = await sql`SELECT * FROM hypeakz_promo_codes WHERE LOWER(code) = LOWER(${code.trim()}) LIMIT 1`;

        if (codeRows.length === 0) {
          // Also check for the hardcoded legacy code
          if (code.trim().toLowerCase() === 'hooka007unlim') {
            // Legacy code - always valid, activate unlimited
            await sql`UPDATE hypeakz_users SET unlimited_status = true WHERE id = ${userId}`;
            result = { valid: true, unlimited: true };
          } else {
            result = { valid: false, error: 'Invalid code' };
          }
          break;
        }

        const promoCode = codeRows[0];

        if (promoCode.used_by) {
          result = { valid: false, error: 'Code already used' };
          break;
        }

        // Mark code as used and activate unlimited for user
        await sql`UPDATE hypeakz_promo_codes SET used_by = ${userId}, used_at = ${Date.now()} WHERE id = ${promoCode.id}`;
        await sql`UPDATE hypeakz_users SET unlimited_status = true WHERE id = ${userId}`;

        result = { valid: true, unlimited: true };
        break;
      }

      case 'increment-generation': {
        if (!sql) break;
        const { userId } = payload;
        if (!userId) break;
        await sql`UPDATE hypeakz_users SET generation_count = COALESCE(generation_count, 0) + 1 WHERE id = ${userId}`;
        break;
      }

      // --- STRIPE CHECKOUT ---
      case 'create-checkout-session': {
        console.log('[STRIPE] Starting checkout session creation');
        console.log('[STRIPE] STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY);
        console.log('[STRIPE] STRIPE_PRICE_ID:', STRIPE_PRICE_ID);

        const stripe = getStripe();
        if (!stripe) {
          console.error('[STRIPE] Stripe not configured - missing STRIPE_SECRET_KEY');
          result = { error: 'Stripe not configured - missing secret key' };
          break;
        }

        const { userId, email } = payload;
        console.log('[STRIPE] userId:', userId, 'email:', email);

        if (!userId || !email) {
          result = { error: 'Missing userId or email' };
          break;
        }

        // Get or create Stripe customer
        let customerId: string;
        if (sql) {
          await ensureTables(sql);
          const userRows = await sql`SELECT stripe_customer_id FROM hypeakz_users WHERE id = ${userId} LIMIT 1`;
          if (userRows.length > 0 && userRows[0].stripe_customer_id) {
            customerId = userRows[0].stripe_customer_id;
          } else {
            // Create new Stripe customer
            const customer = await stripe.customers.create({
              email: email,
              metadata: { userId: userId }
            });
            customerId = customer.id;
            // Save customer ID to database
            await sql`UPDATE hypeakz_users SET stripe_customer_id = ${customerId} WHERE id = ${userId}`;
          }
        } else {
          // No DB - create customer without saving
          const customer = await stripe.customers.create({
            email: email,
            metadata: { userId: userId }
          });
          customerId = customer.id;
        }

        // Create checkout session
        const baseUrl = process.env.URL || 'https://hooka.hypeakz.io';
        console.log('[STRIPE] Creating checkout session with baseUrl:', baseUrl);

        try {
          const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [{
              price: STRIPE_PRICE_ID,
              quantity: 1
            }],
            mode: 'subscription',
            success_url: `${baseUrl}?checkout=success`,
            cancel_url: `${baseUrl}?checkout=cancelled`,
            metadata: {
              userId: userId
            },
            subscription_data: {
              metadata: {
                userId: userId
              }
            }
          });

          console.log('[STRIPE] Checkout session created:', session.id);
          result = { url: session.url };
        } catch (stripeError: any) {
          console.error('[STRIPE] Checkout session creation failed:', stripeError.message);
          result = { error: `Stripe error: ${stripeError.message}` };
        }
        break;
      }

      // --- STRIPE WEBHOOK ---
      case 'stripe-webhook': {
        const stripe = getStripe();
        if (!stripe || !sql) {
          return { statusCode: 400, headers, body: 'Stripe or DB not configured' };
        }

        // Verify webhook signature
        const sig = event.headers['stripe-signature'];
        if (!sig || !STRIPE_WEBHOOK_SECRET) {
          console.error('Missing stripe signature or webhook secret');
          return { statusCode: 400, headers, body: 'Missing signature' };
        }

        let stripeEvent: Stripe.Event;
        try {
          stripeEvent = stripe.webhooks.constructEvent(
            event.body,
            sig,
            STRIPE_WEBHOOK_SECRET
          );
        } catch (err: any) {
          console.error('Webhook signature verification failed:', err.message);
          return { statusCode: 400, headers, body: `Webhook Error: ${err.message}` };
        }

        await ensureTables(sql);

        // Handle the event
        switch (stripeEvent.type) {
          case 'checkout.session.completed': {
            const session = stripeEvent.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;
            const subscriptionId = session.subscription as string;
            const customerId = session.customer as string;

            if (userId && subscriptionId) {
              await sql`UPDATE hypeakz_users SET
                unlimited_status = true,
                paid = true,
                stripe_subscription_id = ${subscriptionId},
                stripe_customer_id = ${customerId},
                subscription_status = 'active'
                WHERE id = ${userId}`;
              console.log(`User ${userId} upgraded to premium via checkout`);
            }
            break;
          }

          case 'customer.subscription.updated': {
            const subscription = stripeEvent.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.userId;
            const status = subscription.status;

            if (userId) {
              const isActive = status === 'active' || status === 'trialing';
              await sql`UPDATE hypeakz_users SET
                unlimited_status = ${isActive},
                paid = ${isActive},
                subscription_status = ${status}
                WHERE id = ${userId}`;
              console.log(`User ${userId} subscription updated: ${status}`);
            }
            break;
          }

          case 'customer.subscription.deleted': {
            const subscription = stripeEvent.data.object as Stripe.Subscription;
            const userId = subscription.metadata?.userId;

            if (userId) {
              await sql`UPDATE hypeakz_users SET
                unlimited_status = false,
                paid = false,
                subscription_status = 'cancelled'
                WHERE id = ${userId}`;
              console.log(`User ${userId} subscription cancelled`);
            }
            break;
          }

          case 'invoice.payment_failed': {
            const invoice = stripeEvent.data.object as any;
            const subscriptionId = typeof invoice.subscription === 'string'
              ? invoice.subscription
              : invoice.subscription?.id || invoice.parent?.subscription_details?.subscription;

            if (subscriptionId) {
              // Find user by subscription ID and mark as payment failed
              await sql`UPDATE hypeakz_users SET
                subscription_status = 'payment_failed'
                WHERE stripe_subscription_id = ${subscriptionId}`;
              console.log(`Payment failed for subscription ${subscriptionId}`);
            }
            break;
          }

          default:
            console.log(`Unhandled event type: ${stripeEvent.type}`);
        }

        result = { received: true };
        break;
      }

      // --- RESEARCH ---
      case 'research': {
        if (!apiKey) throw new Error("Missing API Key");
        const ai = new GoogleGenAI({ apiKey });
        const { url, language } = payload;
        
        if (!url) throw new Error("URL Required");

        // 1. Try Jina AI Scrape (The Bridge)
        const scrapedMarkdown = await fetchUrlContent(url);
        
        let prompt = "";
        let useSearchTool = false;
        
        if (scrapedMarkdown && scrapedMarkdown.length > 200) {
           // Scenario A: Scrape Successful (High Quality)
           prompt = `
           ANALYZE THIS WEBSITE CONTENT (Source: Jina AI Bridge):
           ---
           ${scrapedMarkdown}
           ---
           TASK: Extract 4 specific marketing insights to build a brief.
           
           Required JSON Output:
           { 
             "productContext": "Detailed description of product/service", 
             "targetAudience": "Specific avatar description", 
             "goal": "Primary conversion goal", 
             "speaker": "Brand tone of voice" 
           }
           Language: ${language === 'DE' ? 'German' : 'English'}`;
        } else {
           // Scenario B: Scrape Failed/Timeout -> Google Search Tool (Fallback)
           useSearchTool = true;
           prompt = `
           PERFORM A DEEP GOOGLE SEARCH FOR: "${url}"
           
           TASK: Create a professional marketing brief.
           
           STRICT RULES FOR FALLBACK:
           1. If the website is offline or unknown, INFER the business model from the domain name, but prefix with "[Inferred]".
           2. DO NOT INVENT fake products. If unsure, output general marketing best practices for that industry.
           
           Required JSON Output:
           1. productContext: What is likely being sold?
           2. targetAudience: Who is the customer?
           3. goal: Likely conversion goal (Leads/Sales).
           4. speaker: Professional brand voice.
           
           OUTPUT JSON ONLY.
           Language: ${language === 'DE' ? 'German' : 'English'}`;
        }

        const config: any = { 
            responseMimeType: "application/json" 
        };

        if (useSearchTool) {
            config.tools = [{googleSearch: {}}];
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: config,
        });

        // Robust JSON Parsing
        let jsonData: any = {};
        const responseText = response.text || "";
        
        try {
          jsonData = JSON.parse(responseText);
        } catch (e) {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
             try { jsonData = JSON.parse(jsonMatch[0]); } catch(e2) {}
          }
        }

        const sources = scrapedMarkdown 
          ? [{ title: "Jina AI Direct Scan", uri: url }] 
          : [{ title: "AI Search Retrieval", uri: url }];

        if (useSearchTool && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
             response.candidates[0].groundingMetadata.groundingChunks.forEach((chunk: any) => {
                 if (chunk.web?.uri && chunk.web?.title) {
                     sources.push({ title: chunk.web.title, uri: chunk.web.uri });
                 }
             });
        }

        result = {
          productContext: jsonData.productContext || "",
          targetAudience: jsonData.targetAudience || "",
          goal: jsonData.goal || "",
          speaker: jsonData.speaker || "",
          sources: sources.slice(0, 5)
        };
        break;
      }

      // --- GENERATE HOOKS ---
      case 'generate-hooks': {
        if (!apiKey) throw new Error("Missing API Key");
        const ai = new GoogleGenAI({ apiKey });
        const { brief } = payload;
        
        let customTuning = "";
        if (sql) {
          try {
             const rows = await sql`SELECT value FROM hypeakz_settings WHERE key = 'system_prompt' LIMIT 1`;
             if (rows.length) customTuning = rows[0].value;
          } catch (e) {}
        }

        const scores = brief.targetScores || { patternInterrupt: 70, emotionalIntensity: 70, curiosityGap: 70, scarcity: 50 };
        const nlpConstraints = [
          brief.contentContext ? `- Content Format: ${brief.contentContext}` : '',
          brief.limbicType ? `- Limbic® Target Profile (Emotional System): ${brief.limbicType}` : '',
          brief.focusKeyword ? `- Focus Keyword (Must be included): ${brief.focusKeyword}` : '',
          brief.patternType ? `- Specific Pattern Interrupt: ${brief.patternType}` : '',
          brief.repSystem ? `- Sensory Modality (VAK): ${brief.repSystem}` : '',
          brief.motivation ? `- Meta-Program (Motivation): ${brief.motivation}` : '',
          brief.decisionStyle ? `- Meta-Program (Decision): ${brief.decisionStyle}` : '',
          brief.presupposition ? `- Presupposition: ${brief.presupposition}` : '',
          brief.chunking ? `- Chunking Level: ${brief.chunking}` : '',
          brief.triggerWords && brief.triggerWords.length > 0 ? `- Mandatory Trigger Words: ${brief.triggerWords.join(', ')}` : ''
        ].filter(Boolean).join('\n');

        // Helper to interpret score levels
        const interpretScore = (score: number, metricName: string): string => {
          if (score === 0) return `COMPLETELY AVOID ${metricName} - do NOT use this tactic at all`;
          if (score <= 20) return `MINIMAL ${metricName} (${score}%) - barely noticeable, very subtle`;
          if (score <= 40) return `LOW ${metricName} (${score}%) - light touch, understated`;
          if (score <= 60) return `MODERATE ${metricName} (${score}%) - balanced approach`;
          if (score <= 80) return `HIGH ${metricName} (${score}%) - strong presence`;
          return `MAXIMUM ${metricName} (${score}%) - extremely aggressive, dominant`;
        };

        const prompt = `Erstelle 4 virale Video-Konzepte.
        Context: ${brief.productContext}.
        Goal: ${brief.goal}.
        Audience: ${brief.targetAudience}.
        Speaker Style: ${brief.speaker}.

        NLP & STRUCTURAL CONSTRAINTS (Apply these strictly):
        ${nlpConstraints || "No specific NLP constraints selected. Optimize for maximum retention."}

        MANDATORY NEURO METRIC CALIBRATION (STRICTLY FOLLOW THESE LEVELS - your output scores MUST match these targets):
        1. ${interpretScore(scores.patternInterrupt, 'PATTERN INTERRUPT')} - Controls how shocking/unexpected the opening is
        2. ${interpretScore(scores.emotionalIntensity, 'EMOTIONAL INTENSITY')} - Controls depth of feelings evoked
        3. ${interpretScore(scores.curiosityGap, 'CURIOSITY GAP')} - Controls use of open loops and cliffhangers
        4. ${interpretScore(scores.scarcity, 'SCARCITY/FOMO')} - Controls urgency and fear of missing out

        IMPORTANT: Your generated scripts MUST reflect these exact metric levels. If a metric is 0%, do NOT use that tactic. If a metric is 100%, make it the dominant force in the script. The scores you return in your response should be within ±10% of these target values.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview', 
          contents: prompt,
          config: {
            systemInstruction: getSystemInstruction(brief.language, customTuning),
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY, 
              items: {
                type: Type.OBJECT,
                properties: {
                  hook: { type: Type.STRING },
                  script: { type: Type.STRING },
                  strategy: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING },
                  scores: {
                    type: Type.OBJECT,
                    properties: {
                      patternInterrupt: { type: Type.INTEGER },
                      emotionalIntensity: { type: Type.INTEGER },
                      curiosityGap: { type: Type.INTEGER },
                      scarcity: { type: Type.INTEGER },
                    },
                    required: ["patternInterrupt", "emotionalIntensity", "curiosityGap", "scarcity"]
                  }
                },
                required: ["hook", "script", "strategy", "visualPrompt", "scores"]
              },
            },
          },
        });

        if (sql && response.usageMetadata) {
          const totalTokens = response.usageMetadata.totalTokenCount || 0;
          const logId = Date.now().toString() + Math.random().toString(36).substring(7);
          sql`INSERT INTO hypeakz_analytics (id, event_name, timestamp, metadata) VALUES (${logId}, 'ai_cost', ${Date.now()}, ${{ tokens: totalTokens, model: 'gemini-3-flash' }})`.catch(console.error);
        }

        try {
          const parsed = JSON.parse(response.text || "[]");

          // Post-process: Override AI-generated scores with EXACT target scores
          // The AI generates content based on targets, but ignores them in self-assessment
          // We force the displayed scores to match what the user requested
          console.log('[NEURO-DEBUG] Target scores from brief:', JSON.stringify(scores));

          result = parsed.map((concept: any) => {
            console.log('[NEURO-DEBUG] AI generated scores:', JSON.stringify(concept.scores));
            return {
              ...concept,
              scores: {
                patternInterrupt: scores.patternInterrupt,
                emotionalIntensity: scores.emotionalIntensity,
                curiosityGap: scores.curiosityGap,
                scarcity: scores.scarcity
              }
            };
          });

          console.log('[NEURO-DEBUG] Final result scores:', JSON.stringify(result.map((c: any) => c.scores)));
        } catch(e) {
          console.error('[NEURO-DEBUG] Parse error:', e);
          result = [];
        }
        break;
      }

      default: return { statusCode: 400, headers, body: "Unknown Action" };
    }

    return { statusCode: 200, headers, body: JSON.stringify(result) };

  } catch (error: any) {
    console.error("API Error:", error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message || "Server Error" }) };
  }
};
