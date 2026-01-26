# B4K PRE-MVP Analytics Manual
## Google Analytics 4 + Microsoft Clarity

> **Scope:** PRE-MVP testing  
> **Cost:** 100% Free  
> **Stack:** Next.js 15 (App Router) + Vercel

---

## 1. Purpose

This setup exists to validate:
- Overall user activity & engagement
- Time spent per page
- UX flow completion & drop-offs
- Repeat behavior
- Device, OS, geo, language
- Visual UX behavior (heatmaps, rage clicks, recordings)

**This is NOT a growth or revenue analytics setup.**

---

## 2. Tools Used (Locked)

### Google Analytics 4 (GA4)
- Behavioral analytics
- Funnels & drop-offs
- Engagement time
- Device / Geo / Language

### Microsoft Clarity
- Heatmaps (click, scroll, cursor)
- Session recordings
- Rage clicks / dead clicks

| Not Used | Reason |
|----------|--------|
| Mixpanel | Overkill for PRE-MVP |
| Amplitude | Overkill for PRE-MVP |
| Hotjar | Clarity is free & sufficient |
| Paid tiers | Not needed |

---

## 3. Environment Variables

Located in `.env.local`:

```env
NEXT_PUBLIC_GA_ID=G-MR3QTF6924
NEXT_PUBLIC_CLARITY_ID=v6bt097ypg
```

These are **public** tracking IDs (not sensitive).

---

## 4. File Structure

```
/lib/analytics.ts          # Analytics utility layer
/lib/hooks/useAnalytics.ts # Route change tracking hook
/app/layout.tsx            # Script injection
```

---

## 5. How It Works

### 5.1 Script Loading (`app/layout.tsx`)

Both GA4 and Clarity scripts load with `strategy="afterInteractive"` to avoid blocking page render.

**GA4 Configuration:**
```js
gtag('config', 'GA_ID', {
  send_page_view: false  // Disable auto page view
});
```

We disable auto page views because GA4's default doesn't reliably track client-side navigation in Next.js App Router.

### 5.2 Route Change Tracking (`AnalyticsTracker`)

The `<AnalyticsTracker />` component in layout.tsx:
- Listens for pathname changes via `usePathname()`
- Manually fires `pageview()` on each route change
- Wrapped in Suspense (required for `useSearchParams()`)

### 5.3 Analytics Utility (`/lib/analytics.ts`)

```typescript
import { pageview, trackEvent, analytics } from '@/lib/analytics'

// Manual page view (handled automatically by AnalyticsTracker)
pageview('/poi/123')

// Generic event
trackEvent('custom_event', { key: 'value' })

// Type-safe helpers
analytics.searchPerformed('seoul food')
analytics.poiViewed('poi_123', 'kfood')
analytics.favoriteCreated('poi_123')
```

---

## 6. PRE-MVP Event Contract

**Only these events are allowed:**

| Event | Parameters | When to fire |
|-------|------------|--------------|
| `search_performed` | `{ keyword: string }` | User submits search |
| `poi_viewed` | `{ poi_id: string, category?: string }` | User opens POI detail |
| `select_item` | `{ item_id: string, item_name?: string }` | User clicks an item |
| `favorite_created` | `{ poi_id: string }` | User saves a favorite |
| `folder_created` | `{ folder_name?: string }` | User creates a folder |
| `language_changed` | `{ language: string }` | User changes language |
| `map_opened` | `{}` | User opens map view |
| `contact_form_submitted` | `{}` | User submits contact form |

**Usage:**
```typescript
import { analytics } from '@/lib/analytics'

// In your component
analytics.searchPerformed(query)
analytics.poiViewed(poiId, 'kfood')
analytics.favoriteCreated(poiId)
```

---

## 7. Where to Find Data

### GA4 Dashboard

| What | Path |
|------|------|
| Active users | Reports → Engagement → Overview |
| Page engagement time | Reports → Engagement → Pages and screens |
| Device breakdown | Reports → Tech → Overview |
| Country/Language | Reports → User → Demographics |
| Funnel analysis | Explore → Funnel exploration |

### Clarity Dashboard

| What | Path |
|------|------|
| Click heatmaps | Heatmaps → Click |
| Scroll depth | Heatmaps → Scroll |
| Session recordings | Recordings |
| Rage clicks | Recordings → Filter: Rage clicks |
| Dead clicks | Recordings → Filter: Dead clicks |

---

## 8. GA4 Funnel Setup

Create a Funnel Exploration in GA4:

1. Go to **Explore** → **+ New exploration**
2. Select **Funnel exploration**
3. Add steps:
   - Step 1: `page_view` where page = `/`
   - Step 2: `search_performed`
   - Step 3: `poi_viewed`
   - Step 4: `favorite_created`

**Outputs:**
- Completion %
- Drop-off % at each step
- Time between steps

---

## 9. What Each Tool Answers

| Question | Tool |
|----------|------|
| Are users engaging? | GA4 |
| Which pages hold attention? | GA4 |
| Where do they click? | Clarity |
| How far do they scroll? | Clarity |
| Why did they leave? | Clarity recordings |
| What's the funnel drop-off? | GA4 |
| Mobile vs Desktop? | GA4 |
| Where are users from? | GA4 |

**GA4 = What happened**  
**Clarity = Why it happened**

---

## 10. Weekly PRE-MVP Review Loop

### GA4 (15-20 min)
- [ ] Check funnel completion %
- [ ] Identify drop-off step
- [ ] Review engagement per page
- [ ] Check device split

### Clarity (15-20 min)
- [ ] Watch 5-10 session recordings
- [ ] Check rage clicks report
- [ ] Review POI page heatmaps

### Output
- 1 UX fix
- 1 content fix
- 1 flow adjustment

---

## 11. Hard Rules

| Rule | Reason |
|------|--------|
| Do NOT add more events | Keep signal clean |
| Do NOT optimize for time spent | Vanity metric |
| Do NOT add paid tools | Not needed for PRE-MVP |
| Do NOT build dashboards | Use built-in reports |
| Do NOT over-watch recordings | 5-10 per week is enough |

---

## 12. Adding New Events (Future)

When you need to track something new:

1. Add to the event contract in `/lib/analytics.ts`
2. Create a type-safe helper in the `analytics` object
3. Document in this manual
4. **Get approval before adding** (keep signal clean)

---

## 13. Verification

### Check GA4 is working:
1. Open your site
2. Go to GA4 → Reports → Realtime
3. You should see your visit

### Check Clarity is working:
1. Open your site, click around
2. Go to Clarity dashboard
3. Within 5-10 min, you should see session data

### DevTools verification:
```js
// In browser console
typeof gtag    // Should return "function"
typeof clarity // Should return "function"
```

---

## 14. Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| No data in GA4 | Ad blocker | Test in incognito or different browser |
| `ERR_BLOCKED_BY_CLIENT` | Brave Shield / ad blocker | Expected, works for real users |
| No page views on navigation | `send_page_view: true` | We fixed this with `send_page_view: false` + `AnalyticsTracker` |
| Clarity not loading | Ad blocker | Same as GA4 |

---

## 15. Production Checklist

Before launch:
- [ ] Verify GA4 receives data from production URL
- [ ] Verify Clarity receives data from production URL
- [ ] Confirm Vercel env vars are set (if using different IDs)
- [ ] Test funnel flow end-to-end
- [ ] Watch at least one full session recording

---

## 16. Summary

This setup provides:
- 100% free analytics
- Full UX visibility
- PRE-MVP appropriate signal
- Zero infrastructure overhead
- Clean upgrade path post-PMF

**Do not add complexity until you've validated the core UX.**
