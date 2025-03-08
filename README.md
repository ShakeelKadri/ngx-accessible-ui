# **Accessible Navigation & Menu Directives for Angular**  

# Overview  
Two powerful Angular directives to create or convert any website fully accessible with `keyboard`, touch and mouse with ease:  

1. **`accessibleNavigation`** – Create or Converts any webpage accessible with keyboard across sections of a web page.  
2. **`accessibleMenu`** – Create or Converts any menu a fully accessible keyboard-navigable menu.  

Both directives comply with **WCAG 2.1 Level AA** and the **European Accessibility Act 2025**, ensuring a highly inclusive web experience.

# Installation  
To install the directives in your Angular project, use:  

```sh
npm i ngx-accessible-ui
```

or  

```sh
yarn add ngx-accessible-ui
```

# Usage  
Import the directives into your Angular module:  

```typescript
import { NgxAccessibleUiModule } from 'ngx-accessible-ui';

@NgModule({
  imports: [NgxAccessibleUiModule],
})
export class AppModule {}
```

Now, you can use them in your HTML as described below.  

Learn with basic live demo [accessibleMenu Basic Live Demo For Angular 19](#accessibleMenu-Basic-Live-Demo-For-Angular-19) 

Learn with advance live demo [accessibleMenu Advance Live Demo For Angular 19](#accessibleMenu-Advance-Live-Demo-For-Angular-19)  
---

# `accessibleNavigation` Directive  

```html
<div id="header" accessibleNavigation [navMap]="{ page: 1, section: 1 }">
  <button data-item="navigationitem">Item 1</button>
  <button data-item="navigationitem">Item 2</button>
</div>

<div id="main" accessibleNavigation [navMap]="{ page: 1, section: 2 }">
  <button data-item="navigationitem">Item 1</button>
  <button data-item="navigationitem">Item 2</button>
</div>
```

## accessibleNavigation Basic Live Demo For Angular 19    
[![View on StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/ngx-accessible-ui-accessible-navigation-basic?file=src%2Fmain.ts)

For detailed documentation, refer to [Full Documentation](#full-documentation).  

---

# `accessibleMenu` Directive  

```html
<button accessibleMenu [mainMenu]="true">Open Main Menu</button>
<ul>
  <li role="menuitem">Item 1</li>
  <button role="menuitem" accessibleMenu>Item 2 Submenu Level 1</button>
  <ul>
    <li role="menuitem">Sub-item Level 1.1</li>
    <li role="menuitem">Sub-item Level 1.2</li>
  </ul>
</ul>
```

## accessibleMenu Basic Live Demo For Angular 19 
[![View on StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/ngx-accessible-ui-accessible-menu-basic?file=src%2Fmain.ts)

## accessibleMenu Advance Live Demo For Angular 19  
[![View on StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/ngx-accessible-ui-accessible-menu-advance?file=src%2FfoodMenu.html)

For detailed documentation, refer to [Full Documentation](#full-documentation).  


---

# Full Documentation 
1 [Angular Directive `accessibleNavigation`](#angular-directive-accessibleNavigation)
2 [Angular Directive `accessibleMenu`](#angular-directive-accessibleMenu)

[View on NPM](https://www.npmjs.com/package/ngx-accessible-ui)

<details>
<summary> <strong> accessibleNavigation </strong> </summary>

# Angular Directive accessibleNavigation

The `accessibleNavigation` directive, combined with the `accessibleMenu` directive, enables seamless navigation using all input methods and all directional navigation in any Angular website adhering to WCAG 2.1 Level AA standards and the European Accessibility Act 2025. The directive provides advanced keyboard navigation and focus management between different sections of pages to enhance accessibility in web applications. It dynamically manages focusable elements within a container or section and integrates modern web APIs like `IntersectionObserver` and `MutationObserver` to adapt to DOM element changes and element visibility.

## Key Features

### Advanced Keyboard Navigation & Focus Management
- Default navigation: Tab, Shift+Tab for sections like header, footer, main, aside, etc.; Arrow keys for elements in sections.
- Supports all directional navigation, irrespective of grid, table, float, or any other structure.
- Automatically manages focus between navigable pages (i.e., components or child components) when they open or close and remembers the last navigated section on every page and sets focus to the last active element in that section.

### Dynamic Navigation Map
- Maintains a static navigation map that tracks page and section information.
- Automatically updates the navigation map as items are added, removed, or modified.

### Observer Integration for Responsive Updates
- Utilizes **IntersectionObserver** to detect when a page becomes visible and adjust focus accordingly.
- Employs **MutationObserver** to watch for DOM changes (child list) to refresh navigation items dynamically (supports `*ngIf`/`*ngFor`). Also, includes a fallback for browsers that do not support `IntersectionObserver` and `MutationObserver`.

### Customizable Navigation Inputs
- Offers several `@Input()` properties (e.g., `sectionNavKey`, `navUp`, `navDown`, `navLeft`, `navRight`, `navKeys`) for tailoring navigation behavior.
- Supports setting a default focus item of a section via the `defaultNavItemId` input.
- If space and enter do not work on a button or anchor tag, use `[navOpenKeys]="[' ', 'Enter']"` to enable click behavior on space and enter keypress. The default is `['']`.

### Lock Focus and Scrollable Container Support
- Allows focus to lock on popups or modal-like components and child components (i.e., pages).
- Allows specifying a scrollable container (using `scrollableContainerId`) to handle scrolling with keys such as `PageUp`, `PageDown`, `Home`, and `End` in scrollable components or pages while maintaining locked focus and navigation.

### Accessibility Compliance
- Ensures that navigation items are focusable by automatically assigning `tabindex` where needed.
- Designed to work seamlessly with assistive technologies by managing focus order and element visibility.

### Lifecycle Handling
- Automatically cleans up observers on directive destruction.
- Handles edge cases for hidden/removed elements.

## Requirements

To ensure the directive works as intended, follow these key rules:
1. Apply the `accessibleNavigation` directive to each container element (header, main, footer, etc.) that wraps all navigable items on a page.
2. Provide page and section numbers using `[navMap]="{ page: 1, section: 1 }"` (section `1` for header, `2` for main, `3` for footer, etc.; page `2` for "About Us," `3` for "Contact Us," etc.). Ensure page and section numbers start from `1`.
3. Assign the attribute `data-item="navigationitem"` to all child elements intended for navigation, regardless of their position within the container or section.

## Basic Structure

```html
<div id="header" accessibleNavigation [navMap]="{ page: 1, section: 1 }">
  <button data-item="navigationitem">Item 1</button>
  <button data-item="navigationitem">Item 2</button>
</div>
<div id="main" accessibleNavigation [navMap]="{ page: 1, section: 2 }">
  <button data-item="navigationitem">Item 1</button>
  <button data-item="navigationitem">Item 2</button>
</div>
```

## Optional Features

### Default Navigation Element
Specify the ID of the element to be focused by default. If not specified or unavailable, focus will automatically shift to the first visible element in the viewport. Automatically detects changes to the default navigation item when the bound variable specifying its ID updates and shifts focus accordingly when navigating to that section.

```html
<div accessibleNavigation [defaultNavItemId]="'linkNameId' + numberVariable">
  <button id="link1" data-item="navigationitem">Item 1</button>
  <button id="link2" data-item="navigationitem">Item 2</button>
</div>
```

### Custom Navigation Keys
Override default navigation key arrays:

```html
<div accessibleNavigation
     [navUp]="['W', 'ArrowUp']"
     [navDown]="['S', 'ArrowDown']"
     [navLeft]="['A', 'ArrowLeft']"
     [navRight]="['D', 'ArrowRight']">
  <!-- Navigation items -->
</div>
```

### Scrollable Container
If your container is scrollable but is a popup or modal-like page, and scrolling is happening in the background instead of the current page, set the container ID to enable proper handling of scrolling keys: `PageUp`, `PageDown`, `Home`, and `End` to scroll only the current page scrollable container.

```html
<div id="scrollableContainer" style="height: 400px; overflow-y: auto;">
  <div accessibleNavigation [scrollableContainerId]="'scrollableContainer'">
    <!-- Navigation items -->
  </div>
</div>
```

### Subtree Option
Watches for changes in the `descendants` of direct child elements within the container (default: `true`). Set `[subtree]="false"` if change in direct child elements is enough for mutation observer to refresh navigation items and there are many items in that section.

### Ignoring Keypress in Inputs
By default, keypress events are ignored in `['text', 'search', 'range']` input types. Additional input types can be specified:

```html
[inputTypesToIgnoreOnKeypress]="['text', 'search', 'range', 'additionalInputType']"
```

### Always Refresh Navigation Items
Enable `[alwaysRefreshNavItems]="true"` to update navigation items dynamically on every keypress if items are few but keep changing.

### Lock Focus
Set `[lockFocus]="true"` to lock focus within a popup or modal-like page, if focus or scrolling is happening in the background instead of the current page, by applying `event.preventDefault()` on each keypress as long as focus is inside that page. Limit scrolling with PageUp, PageDown, Home, and End keys to the specified scrollable container if an ID is specified with `[scrollableContainerId] = "'scrollableContainerId'"`.

### NavKeysToExitInputElement
Configure keys to exit an input element (default: `['Tab', 'Escape', 'ArrowDown', 'ArrowUp']`).

### NavOpenKeys
Define keys to open a navigation item with click (default: `['']`). Use `[navOpenKeys]="[' ', 'Enter']"` when space or enter does not trigger a click event.

## Other Configuration Options

| Input                          | Default Values                      | Description |
|--------------------------------|------------------------------------|-------------|
| `navMap`                       | `{ page: null, section: null }`   | Page and section number for navigation map |
| `sectionNavKey`                | `['Tab']`                          | Keys for section navigation |

## Notes
- Uses Angular lifecycle hooks (`AfterViewInit`, `OnDestroy`) to manage observers.
- Available as `accessibleNavigation` via `exportAs` for dynamic focus handling.

</details>

<details>
<summary> <strong> accessibleMenu </strong> </summary>

# Angular Directive accessibleMenu 

## Overview
The `accessibleMenu` directive is designed to create or convert any existing menu into fully accessible menus and submenus that comply with **WCAG 2.1 Level AA** and the **European Accessibility Act 2025**. It ensures seamless navigation via keyboard, mouse, and touch while providing advanced features like dynamic ARIA attributes, multi-level menu support, and customizable search functionality.

## Key Features

### 1. Accessibility Compliance
- **WCAG 2.1 Level AA & European Accessibility Act 2025 Compliant**: Ensures menus are fully accessible via keyboard and meet modern accessibility standards.
- **Dynamic ARIA Attributes**: Automatically assigns `aria-haspopup`, `role`, `aria-controls`, and `aria-expanded` attributes for proper screen reader support.
- **Assistive Technology Compatibility**: Works seamlessly with screen readers and other assistive technologies.

### 2. Navigation
- **Keyboard, Mouse, and Touch Support**: Enables navigation using all input methods.
- **Restricted Focus for Keyboard Users**: Keeps focus within the current menu or submenu until the Escape key (for main menu) or Left Arrow/Escape key (for submenu) is pressed.
- **All-Direction Navigation**: Allows navigation in all directions using arrow keys, regardless of menu structure (grid, table, float, etc.).
- **Numpad Support for Touch Users**: Enables touch users to navigate or input using a numpad without activating the native keyboard.

### 3. Dynamic Menu Behavior
- **Multi-Level Menu Support**: Handles infinite levels of nested menus.
- **Auto Close**: Closes other menus when a new menu is opened or when clicking outside the menu.
- **Dynamic Open/Close Control**: Supports submenus and items that remain always open or dynamically open based on data attributes.

### 4. Search Functionality
- **Advanced Two-Level Search**: Allows menu-wise and item-wise search using a single input field.
- **Numpad Search**: Enables search using numpad keys (touch, mouse, or number keys).
- **Direct Search**: If no search field or numpad is present, direct search is performed using any key.

### 5. Customization
- **Custom Navigation Keys**: Override default navigation keys per menu using `(navUp)`, `(navDown)`, `(navOpenMenu)`, `(navExitMenu)`, `(navLeft)`, and `(navRight)`.
- **Template Variables**: Use template variables for conditional rendering (e.g., showing different icons based on menu state).
- **Shortcut Keys**: Open the main menu using a specific key combination (e.g., `Ctrl+Alt+X`).

## Requirements
To ensure the directive works as intended, follow these rules:

1. Apply the `accessibleMenu` directive to the menu-opening element (e.g., `<button>`, `<div>`).
2. Use the `mainMenu` input to designate the main menu button:
   ```html
   <button accessibleMenu [mainMenu]="true">Open Main Menu</button>
   ```
3. The menu container must be the next sibling (`nextElementSibling`) of the menu-opening element.
4. Assign `role="menuitem"` to all menu items, regardless of their position in the menu container.

## Basic Structure
```html
<button accessibleMenu [mainMenu]="true">Open Main Menu</button>
<ul>
  <li role="menuitem">Item 1</li>
  <button role="menuitem" accessibleMenu>Item 2 Submenu Level 1</button>
  <ul>
    <li role="menuitem">Sub-item Level 1.1</li>
    <li role="menuitem">Sub-item Level 1.2</li>
  </ul>
</ul>
```

## Optional Features

### 1. All-Direction Navigation
Enable navigation in all directions using arrow keys:
```html
<button accessibleMenu [allDirectionNavigation]="true">Open Menu</button>
```

### 2. Advanced Two-Level Search
Enable search functionality using an input field: Menu-wise and item-wise search using the same input field. Example: Searching "Italian" shows all items under the "Italian" menu and any matching items like "Italian Dressing" or "Italian Soda" across other menus.
```html
<input type="text" role="menuitem" data-use-search="true" placeholder="Search...">
```

### 3. Keep Submenu Open
Keep a submenu open using the `data-keep-submenu-open` attribute:
```html
<button role="menuitem" accessibleMenu data-keep-submenu-open="true">Open Submenu</button>
```

### 4. Always Open Submenu Item
- Simple Example:
```html
<li role="menuitem" data-always-open="true">Sub-item Level 2.2</li>
```
- Conditional Example:
```html
<li role="menuitem" [attr.data-always-open]="(author === 'Default') ? 'true' : 'false'">
  Sub-item Level 2.2
</li>
```

### 5. Remember Last Menu Item
```html
<button accessibleMenu [rememberLastMenuitem]="true">Open Menu</button>
```

### 6. Close Menu Upon Selection
```html
<button accessibleMenu [closeMenuUponSelection]="true">Open Menu</button>
```

### 7. Custom Navigation Keys
```html
<button accessibleMenu (navUp)="['ArrowUp', 'W']" (navDown)="['ArrowDown', 'S']">Open Menu</button>
```

### 8. Template Variables
```html
<button accessibleMenu #templateVar="accessibleMenu">
  <svg *ngIf="templateVar.menuState === 'Close'">Left Arrow Icon</svg>
  <svg *ngIf="templateVar.menuState === 'Open'">Down Arrow Icon</svg>
</button>
```

### 9. Numpad Support
```html
<button accessibleMenu [mainMenu]="true">Open Main Menu</button>
<ul>
  <li role="menuitem">Item 1</li>
  <li role="menuitem">Item 2</li>
  <aside role="menuitem" data-use-numpad="true">
    <div role="status">Enter Number</div>
    <div class="numpad">
      <button *ngFor="let button of ['1','2','3','4','5','6','7','8','9']" role="button" data-button-type="number">{{ button }}</button>
      <button role="button" data-button-type="backspace">&#x232B;</button>
      <button role="button" data-button-type="number">0</button>
      <button role="button" data-button-type="enter">&#x21B5;</button>
    </div>
  </aside>
</ul>
```

### 10. Shortcut Key
```html
<button accessibleMenu [shortcutKey]="'M'">Open Main Menu</button>
```

## Configuration Options
| Input                          | Default Values                      | Description |
|--------------------------------|------------------------------------|-------------|
| `inputTypesToIgnoreOnKeypress` | `['text', 'search', 'range']`       | Input types to ignore keypress events |
| `navKeysToExitInputElement`    | `['Tab', 'Escape', 'ArrowDown', 'ArrowUp']` | Keys to exit an input element |
| `navUp`                        | `['ArrowUp']`                      | Keys for navigating up |
| `navDown`                      | `['ArrowDown', 'Tab']`             | Keys for navigating down |
| `navLeft`                      | `['ArrowLeft']`                    | Keys for navigating left |
| `navRight`                     | `['ArrowRight']`                   | Keys for navigating right |
| `navOpenMenu`                  | `[' ', 'Enter']`                   | Keys for opening a menu |
| `navExitMenu`                  | `['Escape']`                       | Keys for closing a menu |

## Notes
- Fully supports Angular's `*ngIf` for dynamic rendering.
- Works seamlessly with custom templates and dynamic DOM changes.
- Available as `accessibleMenu` via `exportAs` for dynamic focus handling.
---

</details>

# Contributing  

We welcome contributions! If you find an issue or want to improve this package:  

1. Fork the repository  
2. Create a new branch (`feature/my-feature`)  
3. Commit your changes  
4. Open a pull request  

# License  
This project is licensed under the MIT License.  

---

**Maintained by:** [Shakeel Kadri]  
