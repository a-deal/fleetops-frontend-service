# UI Development Guidelines

## Overview
This document establishes the UI development patterns for our analytics platform based on a strategic mixed approach that balances development speed, maintainability, and customization needs.

## Core Principle: Strategic Mixed Approach
We use a pragmatic combination of shadcn/ui components and custom HTML + Tailwind based on specific use cases.

## Decision Framework

### Use shadcn/ui Components When:
1. **Interactive/Stateful Elements**
   - Forms, inputs, selects, checkboxes
   - Modals, dialogs, popovers
   - Accordions, tabs, toggles
   - Date/time pickers

2. **Accessibility is Critical**
   - Any component requiring ARIA attributes
   - Elements needing keyboard navigation
   - Focus management scenarios

3. **Common UI Patterns**
   - Buttons, cards, alerts
   - Navigation menus
   - Data tables
   - Loading states

### Use HTML + Tailwind When:
1. **Layout & Structure**
   - Page layouts, grids
   - Sections, containers
   - Spacing, positioning

2. **Static Content**
   - Headers, paragraphs
   - Simple lists
   - Decorative elements

3. **Unique Brand Elements**
   - Custom visualizations
   - Specialized analytics displays
   - One-off design elements

## Implementation Examples

### ✅ Good: Using shadcn/ui for Interactive Elements
```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Complex interactive component
<Card>
  <CardHeader>
    <CardTitle>Member Analytics</CardTitle>
  </CardHeader>
  <CardContent>
    <Button onClick={handleAnalytics}>
      View Details
    </Button>
  </CardContent>
</Card>
```

### ✅ Good: Using HTML + Tailwind for Layout
```tsx
// Page layout structure
<div className="min-h-screen bg-gray-50">
  <header className="border-b bg-white px-6 py-4">
    <h1 className="text-2xl font-bold">Dashboard</h1>
  </header>
  <main className="container mx-auto p-6">
    {/* Content */}
  </main>
</div>
```

### ❌ Avoid: Building Complex Components from Scratch
```tsx
// Don't build your own date picker
<div className="custom-datepicker">
  {/* Complex logic for calendar, accessibility, etc */}
</div>

// Instead, use:
import { DatePicker } from "@/components/ui/date-picker";
```

## Component Customization

When shadcn/ui components need customization:

1. **Minor Style Changes**: Use Tailwind classes
   ```tsx
   <Button className="bg-purple-600 hover:bg-purple-700">
     Custom Styled
   </Button>
   ```

2. **Major Changes**: Copy and modify the component
   - shadcn/ui components are designed to be copied and owned
   - Create a variant in the component file
   - Document the customization

## Performance Considerations

1. **Bundle Size**: shadcn/ui components are tree-shakeable
2. **Only import what you use**: Components are individually imported
3. **Monitor bundle analysis**: Use `pnpm analyze` regularly

## Team Guidelines

1. **Check First**: Before building custom, check if shadcn/ui has it
2. **Document Decisions**: When choosing custom over library, document why
3. **Consistency**: Follow existing patterns in the codebase
4. **Review**: UI decisions should be part of code review

## Maintenance

1. **Regular Updates**: Keep shadcn/ui components updated
2. **Component Inventory**: Maintain a list of custom components
3. **Deprecation**: Remove unused custom components
4. **Testing**: Ensure all interactive components have tests

## Future Considerations

As the platform grows:
1. Consider creating a shared component library for custom analytics components
2. Evaluate if custom components should be contributed back to shadcn/ui
3. Monitor for new shadcn/ui components that could replace custom ones

---

Last Updated: 2025-07-04
Decision Rationale: Based on consensus analysis balancing development speed, accessibility, and customization needs for analytics platform.