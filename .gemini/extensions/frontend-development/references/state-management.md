# State Management

## State Types
| Type | Solution | Use Case |
|------|----------|----------|
| Server | TanStack Query | API data |
| Global | Zustand | App-wide |
| Atomic | Jotai | Fine-grained |
| Reactive | Signals | Real-time |
| Local | useState | Component |

## Zustand
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Store { theme: 'light'|'dark'; setTheme: (t: 'light'|'dark') => void; }

export const useStore = create<Store>()(persist(
  (set) => ({ theme: 'light', setTheme: (t) => set({ theme: t }) }),
  { name: 'app-storage' }
));

// Usage: const theme = useStore(s => s.theme);
```

## Jotai
```typescript
import { atom, useAtom } from 'jotai';

const countAtom = atom(0);
const doubledAtom = atom((get) => get(countAtom) * 2);

function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

## Signals
```typescript
import { signal, computed } from '@preact/signals-react';

const count = signal(0);
const doubled = computed(() => count.value * 2);

// Usage: count.value++; <span>{doubled}</span>
```

## When to Use
| Scenario | Use |
|----------|-----|
| API data | TanStack Query |
| Auth/theme | Zustand + persist |
| UI toggles | useState or Jotai |
| Counters | Signals |
| Forms | React Hook Form |

## Avoid
- Redux (boilerplate)
- Global state for server data
- Context for frequent updates
