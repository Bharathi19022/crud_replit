# CRM Application Design Guidelines

## Design Approach
**Selected System:** Modern SaaS Design Pattern (inspired by Linear, Notion, and Stripe Dashboard)  
**Rationale:** This is a utility-focused, data-intensive application requiring clean, professional aesthetics that prioritize efficiency and clarity over visual flair.

**Core Principles:**
- Information clarity and scanability
- Efficient workflows with minimal friction
- Professional, trustworthy aesthetic for business users
- Consistent, predictable interactions

---

## Typography
**Font Stack:** Inter via Google Fonts CDN  
**Hierarchy:**
- Page Titles: `text-2xl font-semibold` (32px)
- Section Headers: `text-lg font-semibold` (20px)
- Table Headers: `text-sm font-medium uppercase tracking-wide` (14px)
- Body Text: `text-base` (16px)
- Labels: `text-sm font-medium` (14px)
- Secondary Text: `text-sm text-gray-600` (14px)

---

## Layout System
**Spacing Units:** Use Tailwind units of `2, 3, 4, 6, 8, 12, 16` for consistent rhythm
- Component padding: `p-4` or `p-6`
- Section spacing: `space-y-6` or `space-y-8`
- Card padding: `p-6`
- Form field spacing: `space-y-4`

**Container Strategy:**
- Sidebar: Fixed `w-64` on desktop, collapsible on mobile
- Main content area: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Forms/Modals: `max-w-2xl` centered

---

## Component Library

### Sidebar Navigation
- Full-height fixed sidebar with logo at top
- Navigation items with icons (Heroicons) and labels
- Active state: subtle background highlight
- User profile/logout at bottom
- Mobile: Collapsible hamburger menu

### Dashboard Cards
- Grid layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Stat cards showing: Total Customers, Active, Leads, Inactive
- Each card: Large number, label, optional trend indicator
- Border style with subtle shadow

### Customer Table
- Full-width responsive table with horizontal scroll on mobile
- Striped rows for readability: `odd:bg-gray-50`
- Column headers: sticky, sortable with arrow indicators
- Columns: Name, Email, Phone, Company, Status, Actions
- Status badges: Pill-shaped with status-specific styling
- Action buttons: Edit (pencil icon), Delete (trash icon)
- Search bar above table: `w-full md:w-96` with search icon
- Pagination controls at bottom

### Forms (Add/Edit Customer)
- Modal overlay: Semi-transparent backdrop
- Modal content: Centered `max-w-2xl` card with close button
- Form layout: Single column, `space-y-4`
- Input fields: Full-width with floating labels or top labels
- Status dropdown: Custom select with current value displayed
- Action buttons: Primary (Save) and Secondary (Cancel) at bottom right
- Validation: Inline error messages below fields in red

### Buttons
- Primary: Solid background, medium weight
- Secondary: Border outline style
- Danger: For delete actions
- Icon buttons: Square, centered icon only
- All buttons: Rounded corners `rounded-md`

### Status Badges
- Lead: Light blue background
- Active: Light green background  
- Inactive: Light gray background
- Pill-shaped: `rounded-full px-3 py-1 text-xs font-medium`

### Modals
- Confirmation modal for delete: Title, message, Cancel/Delete buttons
- Toast notifications: Fixed top-right, auto-dismiss after 3s
- Toast types: Success (green), Error (red), Info (blue)

### Empty States
- When no customers exist: Centered icon, message, "Add Customer" CTA
- Friendly, encouraging copy

---

## Authentication Pages
- Centered card layout on plain background
- Replit Auth button prominently displayed
- Logo and welcome message above auth button
- Minimal distractions, focus on login action

---

## Images
**No hero images needed** - This is a functional application, not a marketing site.

**Icons Only:**
- Use Heroicons via CDN throughout
- Navigation icons: Home, Users, LogOut
- Action icons: Plus, Pencil, Trash, Search, X
- Status indicators: CheckCircle, XCircle, Clock

---

## Responsive Behavior
- **Mobile (< 768px):** Collapsed sidebar, table horizontal scroll, single-column stats
- **Tablet (768-1024px):** Visible sidebar, 2-column stat grid
- **Desktop (> 1024px):** Full layout, 4-column stat grid, spacious table

---

## Accessibility
- All form inputs with associated labels
- Keyboard navigation for modals and forms
- Focus states on all interactive elements: `focus:ring-2 focus:ring-offset-2`
- ARIA labels for icon-only buttons
- Sufficient contrast ratios throughout