# External Component Bank

Third-party component saves, NOT harvested from SISO-built apps. Already plug-and-play.

---

## Structure

```
_external/
  21st-dev/   # 52 components from 21st.dev
  shadcn/     # Future: shadcn primitives if added
```

---

## 21st.dev Collection

- **Source:** [https://21st.dev](https://21st.dev)
- **Count:** 52 components
- **Catalog:** `_external/21st-dev/catalog.json`
- **Status:** Already plug-and-play (zero app dependencies)

---

## Usage Rules

1. **External components skip `_raw/`.** They are already standalone — no broken imports to fix.
2. **Can go directly to `primitives/` or `composites/`** if promoted for SISO use.
3. **New saves go here.** Any new 21st.dev or shadcn component gets saved in the appropriate subfolder.
4. **Check catalog.json** for the full list before adding duplicates.

---

## Adding New Components

1. Save to `_external/{source}/`
2. Add entry to `_external/{source}/catalog.json`
3. Update `PROVENANCE.md` Table 2
