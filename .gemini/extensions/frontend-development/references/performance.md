# Performance

## Server Components (RSC)
```typescript
// Server (default): zero JS, direct DB
async function Products() {
  const data = await db.products.findMany();
  return <ul>{data.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// Client island: interactive
'use client';
function AddToCart({ id }) { return <button onClick={() => add(id)}>Add</button>; }
```

## Streaming
```typescript
<Suspense fallback={<Skeleton />}>
  <AsyncComponent />  {/* Streams when ready */}
</Suspense>
```

## useMemo
```typescript
const filtered = useMemo(() =>
  items.filter(i => i.name.includes(q)).sort((a,b) => a.name.localeCompare(b.name))
, [items, q]);
```
**When:** Filter/sort large arrays, complex calculations.

## useCallback
```typescript
const handleClick = useCallback((id: string) => {
  console.log(id);
}, []);
```
**When:** Functions passed to children, effect dependencies.

## React.memo
```typescript
export const Item = React.memo<Props>(({ item }) => <div>{item.name}</div>);
```
**When:** List items, DataGrid cells, frequent re-renders.

## Code Splitting
```typescript
const Page = lazy(() => import('./Page'));
const handlePdf = async () => { const { jsPDF } = await import('jspdf'); };
```

## Debounce
```typescript
const [search, setSearch] = useState('');
const [debounced] = useDebounce(search, 300);
```

## Cleanup Effects
```typescript
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

## List Keys
```typescript
{items.map(i => <Item key={i.id} />)}  // Use unique id, NOT index
```
