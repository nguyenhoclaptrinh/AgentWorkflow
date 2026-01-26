# Styling (MUI v7)

## sx Prop
```typescript
<Box sx={{ p: 2, display: 'flex', gap: 2 }}>
  <Paper sx={{ p: 3, borderRadius: 2 }}>Content</Paper>
</Box>
```

## Theme Access
```typescript
<Box sx={{
  color: 'primary.main',
  bgcolor: 'background.paper',
  p: (theme) => theme.spacing(2),
}} />
```

## Styles Object
```typescript
const styles: Record<string, SxProps<Theme>> = {
  container: { p: 2, display: 'flex' },
  header: { mb: 2, justifyContent: 'space-between' },
};
// Inline if <100 lines, separate .styles.ts if >100
```

## MUI v7 Grid
```typescript
<Grid size={{ xs: 12, md: 6 }}>Content</Grid>  // v7
// NOT: <Grid xs={12} md={6}>  // deprecated
```

## Responsive
```typescript
<Box sx={{
  width: { xs: '100%', md: '50%' },
  p: { xs: 1, md: 3 },
}} />
```

## Common Patterns
```typescript
// Flex center
{ display: 'flex', alignItems: 'center', justifyContent: 'center' }

// Hover effect
{ transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 3 } }

// Text truncate
{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
```

## Spacing
| Value | Pixels |
|-------|--------|
| 1 | 8px |
| 2 | 16px |
| 3 | 24px |
| 4 | 32px |
