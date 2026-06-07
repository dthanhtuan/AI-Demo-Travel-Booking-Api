# Architecture Decisions

Shared interface contracts locked before implementation. Both developers (or both AI models)
read this before touching `src/types.ts`.

---

## 2026-06-07 — VenueFilter (SCRUM-5)

**Interface:**
```ts
export interface VenueFilter {
  city?: string;
  maxPrice?: number;
}
```

**Owner:** SCRUM-5 implementer adds this to `src/types.ts`.  
**Usage:** `venue.repository.ts` `findAll(filter?)` → conditional WHERE clause in SQL.
