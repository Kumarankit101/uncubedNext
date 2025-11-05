# Lucide React Icon Map Solution

## Problem
The application uses wildcard imports for lucide-react icons in 2 files:
- `app/(protected)/startup/[id]/page.tsx`
- `app/components/dashboard/AgentSelector.tsx`

This prevents tree-shaking and includes all icons in the bundle (~200KB extra).

## Current Usage
Icons are loaded dynamically based on database `agent.icon` property:
```typescript
import * as Icons from 'lucide-react';
const Icon = (Icons as any)[agent.icon];
```

## Solution: Icon Registry

### Step 1: Create Icon Map
Create a centralized icon registry with only the icons actually used:

```typescript
// lib/icons/registry.ts
import {
  FileText,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  BarChart,
  Lightbulb,
  // ... add all icons used in your database
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export const ICON_REGISTRY: Record<string, LucideIcon> = {
  FileText,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  BarChart,
  Lightbulb,
  // ... map all your agent icons
};

// Helper to get icon safely
export function getIcon(iconName: string): LucideIcon {
  return ICON_REGISTRY[iconName] || FileText; // FileText as fallback
}
```

### Step 2: Query Database for All Icon Names
Run this SQL to get all unique icon names:
```sql
SELECT DISTINCT icon FROM agents WHERE icon IS NOT NULL;
```

### Step 3: Update Usage
Replace wildcard imports:

**Before:**
```typescript
import * as Icons from 'lucide-react';
const Icon = (Icons as any)[agent.icon];
```

**After:**
```typescript
import { getIcon } from '@/lib/icons/registry';
const Icon = getIcon(agent.icon);
```

### Step 4: Add Type Safety
```typescript
// lib/types/icons.ts
export type IconName = keyof typeof ICON_REGISTRY;

// Update agent type
export interface Agent {
  id: string;
  name: string;
  icon: IconName; // Now type-safe!
  // ...
}
```

## Benefits
- ✅ Reduces bundle size by ~150-200KB (only includes used icons)
- ✅ Type-safe icon names
- ✅ Centralized icon management
- ✅ Easy to add new icons
- ✅ Fallback handling for missing icons

## Implementation Checklist
- [ ] Query database for all unique icon names
- [ ] Create `lib/icons/registry.ts` with icon map
- [ ] Update `app/(protected)/startup/[id]/page.tsx`
- [ ] Update `app/components/dashboard/AgentSelector.tsx`
- [ ] Add type definitions
- [ ] Test with various agents
- [ ] Remove wildcard imports

## Estimated Impact
- Bundle size reduction: 150-200KB
- Build time improvement: Faster tree-shaking
- Developer experience: Type-safe icon selection
