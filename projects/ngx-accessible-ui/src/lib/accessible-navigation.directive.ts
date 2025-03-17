import { Directive, ElementRef, Renderer2, Input, HostListener, AfterViewInit, OnDestroy } from '@angular/core';

/**
 * # Angular Directive: `accessibleNavigation`
 * The `accessibleNavigation` directive, combined with the `accessibleMenu` directive, enables seamless navigation using all input methods and all directional navigation in any Angular website adhering to WCAG 2.1 Level AA standards and the European Accessibility Act 2025. The directive provides advanced keyboard navigation and focus management between different sections of pages to enhance accessibility in web applications. It dynamically manages focusable elements within a container or section and integrates modern web APIs like `IntersectionObserver` and `MutationObserver` to adapt to DOM element changes and element visibility.
 * 
 * ### Key Features:
 * - **Advanced Keyboard Navigation & Focus Management**:
 *   - Default navigation: Tab, Shift+Tab for sections like header, footer, main, aside, etc.; Arrow keys for elements in sections.
 *   - Supports all directional navigation, irrespective of grid, table, float, or any other structure.
 *   - Automatically manages focus between navigable pages (i.e., components or child components) when they open or close and remembers the last navigated section on every page and sets focus to the last active element in that section
 *
 * - **Dynamic Navigation Map**:
 *   - Maintains a static navigation map that tracks page and section information.
 *   - Automatically updates the navigation map as items are added, removed, or modified.
 *
 * - **Observer Integration for Responsive Updates**:
 *   - Utilizes **IntersectionObserver** to detect when a page becomes visible and adjust focus accordingly.
 *   - Employs **MutationObserver** to watch for DOM changes (child list) to refresh navigation items dynamically (supports `*ngIf`/`*ngFor`). Also, includes a fallback for browsers that do not support `IntersectionObserver` and `MutationObserver`.
 *
 * - **Customizable Navigation Inputs**:
 *   - Offers several `@Input()` properties (e.g., `sectionNavKey`, `navUp`, `navDown`, `navLeft`, `navRight`, `navKeys`) for tailoring navigation behavior.
 *   - Supports setting a default focus item of a section via the `defaultNavItemId` input.
 *   - If space and enter do not work on a button or anchor tag, use `[navOpenKeys]="[' ', 'Enter']"` to enable click behavior on space and enter keypress. The default is `['']`.
 *
 * - **Lock Focus and Scrollable Container Support**:
 *   - Allows focus to lock on popups or modal-like components and child components (i.e., pages).
 *   - Allows specifying a scrollable container (using `scrollableContainerId`) to handle scrolling with keys such as `PageUp`, `PageDown`, `Home`, and `End` in scrollable components or pages while maintaining locked focus and navigation.
 *
 * - **Accessibility Compliance**:
 *   - Ensures that navigation items are focusable by automatically assigning `tabindex` where needed.
 *   - Designed to work seamlessly with assistive technologies by managing focus order and element visibility.
 * 
 * - **Lifecycle Handling:**
 *   - Automatically cleans up observers on directive destruction.
 *   - Handles edge cases for hidden/removed elements.
 * 
 * ### Requirements:
 * To ensure the directive works as intended, follow these key rules:
 * - 1. Apply the `accessibleNavigation` directive to each container element (header, main, footer, etc.) that wraps all navigable items on a page.
 * - 2. Provide page and section numbers using `[navMap]="{ page: 1, section: 1 }"` (section `1` for header, `2` for main, `3` for footer, etc.; page `2` for "About Us," `3` for "Contact Us," etc.). Ensure page and section numbers start from `1`.
 * - 3. Assign the attribute `data-item="navigationitem"` to all child elements intended for navigation, regardless of their position within the container or section.
 * 
 * ### Basic Structure:
 * ```html
 * <div id="header" accessibleNavigation [navMap]="{ page: 1, section: 1 }">
 *   <button data-item="navigationitem">Item 1</button>
 *   <button data-item="navigationitem">Item 2</button>
 * </div>
 * <div id="main" accessibleNavigation [navMap]="{ page: 1, section: 2 }">
 *   <button data-item="navigationitem">Item 1</button>
 *   <button data-item="navigationitem">Item 2</button>
 * </div>
 * ```
 * 
 * ### Optional Features:
 * - **Default Navigation Element**:
 *   - Specify the ID of the element to be focused by default. If not specified or unavailable, focus will automatically shift to the first visible element in the viewport.
 *   - Automatically detects changes to the default navigation item when the bound variable specifying its ID updates and shifts focus accordingly when navigate to that section.
 *   ```html
 *   <div accessibleNavigation [defaultNavItemId]="'linkNameId' + numberVariable">
 *     <button id="link1" data-item="navigationitem">Item 1</button>
 *     <button id="link2" data-item="navigationitem">Item 2</button>
 *   </div>
 *   ```
 * 
 * - **Custom Navigation Keys**:  
 *   - Override default navigation key arrays:
 *   ```html
 *   <div accessibleNavigation
 *        [navUp]="['W', 'ArrowUp']"
 *        [navDown]="['S', 'ArrowDown']"
 *        [navLeft]="['A', 'ArrowLeft']"
 *        [navRight]="['D', 'ArrowRight']">
 *     <!-- Navigation items -->
 *   </div>
 *   ```
 * 
 * - **Scrollable Container**: 
 *   - If your container scrollable but it is popup or modal-like page, if scrolling is happening in background instead of current page, set the container ID to enable proper handling of scrolling keys: `PageUp`, `PageDown`, `Home`, and `End` to scroll only current page scrollable container.
 *   ```html
 *   <div id="scrollableContainer" style="height: 400px; overflow-y: auto;">
 *     <div accessibleNavigation [scrollableContainerId]="'scrollableContainer'">
 *       <!-- Navigation items -->
 *     </div>
 *   </div> 
 *   ```
 * 
 * - **Subtree Option**:
 *   - Watches for changes in the `descendants` of direct child elements within the container (default: `true`). Set `[subtree]="false"` if change in direct child elements is enough for mutuation observer to refresh navigation items and there are many items in that section.
 * 
 * - **Ignoring Keypress in Inputs**:
 *   - By default, keypress events are ignored in `['text', 'search', 'range']` input types. Additional input types can be specified:
 *   ```html
 *   [inputTypesToIgnoreOnKeypress]="['text', 'search', 'range', 'additionalInputType']"
 *   ```
 * 
 * - **Always Refresh Navigation Items**:
 *   - Enable `[alwaysRefreshNavItems]="true"` to update navigation items dynamically on every keypress if items are few but keeps changing.
 * 
 * - **Lock Focus**:
 *   - Set `[lockFocus]="true"` to lock focus within a popup or modal-like page, if focus or scrolling is happening in background instead of current page, by appyling `event.preventDefault()` on each keypress as long as focus is inside that page and limit scrolling with pageUp, pageDown, Home and End keys to the specified scrollable container if id specified with `[scrollableContainerId] = "'scrollableContainerId'"`.
 * 
 * - **NavKeysToExitInputElement**: 
 *   - Configure keys to exit an input element (default: `['Tab', 'Escape', 'ArrowDown', 'ArrowUp']`).
 * 
 * - **NavOpenKeys**:
 *   - Define keys to open navigation item with click (default: `['']`). Use `[navOpenKeys]="[' ', 'Enter']"` when space or enter does not trigger a click event.
 * 
 * ### Other Configuration Options:
 * | Input                          | Default Values                      | Description |
 * |--------------------------------|------------------------------------|-------------|
 * | `navMap`                       | `{ page: null, section: null }`   | Page and section number for navigation map |
 * | `sectionNavKey`                | `['Tab']`                          | Keys for section navigation |
 * 
 * ### Notes:
 * - Uses Angular lifecycle hooks (`AfterViewInit`, `OnDestroy`) to manage observers.
 * - Available as `accessibleNavigation` via `exportAs` for dynamic focus handling.
 */

@Directive({
  selector: '[accessibleNavigation]',
  exportAs: 'accessibleNavigation',
})
export class AccessibleNavigationDirective implements AfterViewInit, OnDestroy {
  // Static navigation map to store page and index information
  private static navigationMap: { page: number; section: number; element: HTMLElement; nativeElement: HTMLElement }[] = [];
  private static isOnClickListenerOnDocument: boolean = false;
  private static lastNavigatedSectionInEveryPage: { [key: number]: { lastSection: number; lastElement: HTMLElement } } = {};

  // Input properties for customization
  @Input() navMap: { page: number | null; section: number | null } = { page: null, section: null };
  @Input() sectionNavKey = ['Tab'];
  @Input() navOpenKeys = [''];
  @Input() navUp = ['ArrowUp'];
  @Input() navDown = ['ArrowDown', 'Tab'];
  @Input() navLeft: string[] = ['ArrowLeft'];
  @Input() navRight: string[] = ['ArrowRight'];
  @Input() navKeysToExitInputElement: string[] = ['Tab', 'Escape', 'ArrowDown', 'ArrowUp'];
  @Input() inputTypesToIgnoreKeypress: string[] = ['text', 'search', 'range'];
  @Input() lockFocus = false;
  @Input() scrollableContainerId?: string;
  @Input() subtree = true;
  @Input() alwaysRefreshNavItems = false;
  private _defaultNavItemId?: string;
  @Input() set defaultNavItemId(value: string) {
    this._defaultNavItemId = value;
  }
  get defaultNavItemId(): string | undefined {
    return this._defaultNavItemId;
  }

  // Internal state
  direction: 'forward' | 'backward' = 'forward';
  navigationItems: HTMLElement[] = [];
  mutationObserverAvailable = 'MutationObserver' in window;
  private intersectionObserver!: IntersectionObserver;
  private mutationObserver!: MutationObserver;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    if (this.navMap.section == 1) this.initializeIntersectionObserver();
    this.initializeMutationObserver();
    this.initializeNavigation();
  }

  ngOnDestroy() {
    this.cleanupIntersectionObserver();
    this.cleanupMutationObserver();
  }

  // Helper methods

  /**
   * Initialize IntersectionObserver to handle element visibility.
   */
  private initializeIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.handleElementVisible();
          }
        });
      });
      this.intersectionObserver.observe(this.el.nativeElement);
    } else {
      this.fallbackVisibilityCheck();
    }
  }

  /**
   * Initialize MutationObserver to handle navigation items changes.
   */
  private initializeMutationObserver() {
    if (this.mutationObserverAvailable) {
      this.mutationObserver = new MutationObserver(() => {
        this.refreshNavigationItems();
      });
      this.mutationObserver.observe(this.el.nativeElement, {
        childList: true,
        subtree: this.subtree,
      });
    }
  }

  /**
   * Fallback for browsers that do not support IntersectionObserver.
   */
  private fallbackVisibilityCheck() {
    let changed = false;
    setInterval(() => {
      if (this.isElementVisible(this.el.nativeElement)) {
        if (!changed) {
          changed = true;
          this.handleElementVisible();
        }
      } else {
        if (changed) {
          changed = false; // Reset if the element becomes hidden again
        }
      }
    }, 250);
  }

  /**
   * Clean up IntersectionObserver on directive destruction.
   */
  private cleanupIntersectionObserver() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  /**
   * Clean up MutationObserver on directive destruction.
   */
  private cleanupMutationObserver() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
  }

  /**
   * Handle element visibility changes.
   */
  private handleElementVisible() {
    this.handleFocus()
  }

  /**
   * Initialize navigation by refreshing menu items and setting up focus.
   */
  private initializeNavigation() {
    this.refreshNavigationItems();
    if (this.navigationItems.length === 0) {
      this.navigationItems = [this.el.nativeElement];
    }
    this.initializeNavigationMap();
    if (!AccessibleNavigationDirective.isOnClickListenerOnDocument) {
      AccessibleNavigationDirective.isOnClickListenerOnDocument = true;
      document.addEventListener('click', () => {
        setTimeout(() => {
          this.fixFocus();
        }, 100);
      })
    }
    //add event listerner for focus on native element to refreshnavigationItems and focus on first element
    this.el.nativeElement.addEventListener('focus', () => this.handleFocus());
  }

  /**
   * Handle focus event to refresh menu items and set focus.
   */
  private handleFocus() {
    this.refreshNavigationItems();
    if (this.navigationItems.length > 0) {
      let focusItem = this.getFocusItemInSection()
      if (focusItem) {
        this.focusItem(0, focusItem);
        //if focus moved then set focus back to defaultNavItem
        setTimeout(() => {
          if (document.activeElement !== focusItem) {
            focusItem?.focus();
          }
        }, 150);
        //update navigationMap with defaultNavItem
        this.initializeNavigationMap();
      }
    }
    else {
      //if no navigationItems then skip and navigate to next section of page
      this.navigationItems = [this.el.nativeElement];
      this.navigate(this.direction);
    }
  }

  /**
   * Get focus item for navigation in section
   */
  private getFocusItemInSection(): HTMLElement | null {
    let focusItem = document.getElementById(this.defaultNavItemId || '');
    if (focusItem && this.isElementVisible(focusItem)) return focusItem
    else focusItem = this.getFirstVisibleElementInViewport();
    if (focusItem) return focusItem;
    return (this.navigationItems.length > 0 && this.isElementVisible(this.navigationItems[0])) ? this.navigationItems[0] : null;
  }

  /**
   * Fix focus on body when focus is on body and set focus to last active element of last active section of last active page.
   */
  private fixFocus() {
    if (document.activeElement === document.body) {
      let lastIndex = AccessibleNavigationDirective.navigationMap.length - 1
      let lastPage = AccessibleNavigationDirective.navigationMap[lastIndex].page;
      let lstNavSectInEvPage = AccessibleNavigationDirective.lastNavigatedSectionInEveryPage
      for (let i = lastPage; i >= 1; i--) {
        let tempPageNavigationMap = this.createCurrentPageNavigationMap(i).filter((item) => (this.isElementVisible(item.element)));
        if (tempPageNavigationMap.length > 0 && this.isElementOnTop(tempPageNavigationMap[0].element)) {
          //find last section active in page and set focus to last element of that section
          for (let i = tempPageNavigationMap.length - 1; i >= 0; i--) {
            if (lstNavSectInEvPage[tempPageNavigationMap[i].page].lastSection && tempPageNavigationMap[i].section === lstNavSectInEvPage[tempPageNavigationMap[i].page].lastSection) {
              if (this.isElementVisible(lstNavSectInEvPage[tempPageNavigationMap[i].page].lastElement)) {
                this.focusItem(0, lstNavSectInEvPage[tempPageNavigationMap[i].page].lastElement);
              }
              else {
                this.focusItem(0, tempPageNavigationMap[0].element);
              }
              break
            }
          }
          break
        }
      }
    }
  }

  /**
   * Initialize the navigation map with the current element.
   */
  private initializeNavigationMap() {
    if (this.navMap.page !== null && this.navMap.section !== null) {
      //if page number and section number already exist in navigationMap then replace navMap.element with current and native element
      const existingItem = AccessibleNavigationDirective.navigationMap.find(
        (item) => item.page === this.navMap.page && item.section === this.navMap.section
      );
      let focusItem = this.getFocusItemInSection();
      if (existingItem) {
        // if navigationItem is in document and visible then set focus element to navigationItem
        if (focusItem) {
          existingItem.element = focusItem;
        }
        else existingItem.element = this.el.nativeElement;
        existingItem.nativeElement = this.el.nativeElement;
      } else {
        AccessibleNavigationDirective.navigationMap.push({
          page: this.navMap.page,
          section: this.navMap.section,
          element: focusItem ? focusItem : this.el.nativeElement,
          nativeElement: this.el.nativeElement,
        });
        AccessibleNavigationDirective.navigationMap.sort((a, b) =>
          a.page === b.page ? a.section - b.section : a.page - b.page
        );
      }
    }
  }

  /**
   * Handle keyboard navigation events.
   */
  @HostListener('keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent) {
    if (!this.mutationObserverAvailable || this.alwaysRefreshNavItems) this.refreshNavigationItems();
    if (!this.navigationItems || this.navigationItems.length === 0) return;
    //if keypress is in search field then return
    if (!this.navKeysToExitInputElement.includes(event.key) && document.activeElement instanceof HTMLInputElement &&
      this.inputTypesToIgnoreKeypress.includes(document.activeElement.type)) return; //if keypres in search field or range etc.

    let activeIndex = this.navigationItems.indexOf(document.activeElement as HTMLElement);
    if (activeIndex === -1) return;

    if (this.lockFocus) event.preventDefault();

    const container = this.getScrollableContainer();
    const currentItem = this.navigationItems[activeIndex];

    switch (true) {
      case event.key == 'PageUp':
        if (this.lockFocus || this.scrollableContainerId) this.scrollContainer(event, 'up', container);
        break;
      case event.key == 'PageDown':
        if (this.lockFocus || this.scrollableContainerId) this.scrollContainer(event, 'down', container);
        break;
      case event.key == 'Home':
        if (this.lockFocus || this.scrollableContainerId) this.scrollToStart(event, container);
        break;
      case event.key == 'End':
        if (this.lockFocus || this.scrollableContainerId) this.scrollToEnd(event, container);
        break;
      case this.sectionNavKey.includes(event.key) && this.navMap.page !== null && this.navMap.section !== null:
        this.handleTabNavigation(event);
        break;
      case this.navUp.includes(event.key):
        this.handleArrowUpNavigation(event, currentItem);
        break;
      case this.navDown.includes(event.key):
        this.handleArrowDownNavigation(event, currentItem);
        break;
      case this.navLeft.includes(event.key):
        this.handleArrowLeftNavigation(event, currentItem);
        break;
      case this.navRight.includes(event.key):
        this.handleArrowRightNavigation(event, currentItem);
        break;
      default:
        if (this.navOpenKeys.includes(event.key)) {
          event.preventDefault();
          currentItem.click();
          setTimeout(() => {
            if (document.activeElement && (document.activeElement == document.body || !this.isElementOnTop(document.activeElement))) {
              if (this.isElementVisible(currentItem) && this.isElementOnTop(currentItem)) this.focusItem(0, currentItem)
              else if (this.navigationItems.length > 0 && this.isElementVisible(this.navigationItems[0]) && this.isElementOnTop(this.navigationItems[0])) this.focusItem(0, this.navigationItems[0]);
              else if (this.navMap.page) {
                for (let i = this.navMap.page; i >= 1; i--) {
                  let tempPageNavigationMap = this.createCurrentPageNavigationMap(i).filter((item) => (this.isElementVisible(item.element)));
                  if (tempPageNavigationMap.length > 0 && this.isElementOnTop(tempPageNavigationMap[0].element)) {
                    this.focusItem(0, tempPageNavigationMap[0].element);
                    break
                  }
                }
              }
            }
          }, 100);
        }
        break;
    }
  }

  /**
   * Handle Tab key navigation.
   */
  private handleTabNavigation(event: KeyboardEvent) {
    event.preventDefault();
    this.navigate(event.shiftKey ? 'backward' : 'forward');
  }

  /**
   * Navigate forward or backward in the navigation map in different section of webpage.
   */
  private navigate(direction: 'forward' | 'backward') {
    if (direction === 'backward') this.direction = 'backward';
    else this.direction = 'forward';
    let focusItem = this.getFocusItemInSection();
    let currentPageNavigationMap = this.createCurrentPageNavigationMap();
    let currentIndex = currentPageNavigationMap.findIndex(
      (item) => item.element === focusItem
    );

    if (currentIndex === -1) {
      this.initializeNavigationMap();
      currentPageNavigationMap = this.createCurrentPageNavigationMap();
      currentIndex = currentPageNavigationMap.findIndex(
        (item) => item.element === focusItem
      );
    }

    const mapLength = currentPageNavigationMap.length;
    if (mapLength <= 1) return;

    let targetIndex: number;
    if (direction === 'forward') {
      targetIndex = (currentIndex + 1) % mapLength;
    } else {
      targetIndex = (currentIndex - 1 + mapLength) % mapLength;
    }

    const targetElement = currentPageNavigationMap[targetIndex].element;
    let section = currentPageNavigationMap[targetIndex].section;
    this.focusItem(0, targetElement, section);
  }

  /**
   * Create a navigation map for the current page.
   */
  private createCurrentPageNavigationMap(pageNumber: number | null = null) {
    if (!pageNumber) pageNumber = this.navMap.page;
    return AccessibleNavigationDirective.navigationMap.filter((item) => {
      //if item of current page
      if (item.page === pageNumber) {
        //if navigationItems is not in document but native element is, then set focus element to native element
        if (!document.contains(item.element)) {
          if (document.contains(item.nativeElement)) {
            item.element = item.nativeElement;
          } else {
            return false;
          }
        }
        //if navigationItem is hidden then set focus element to native element
        if (!this.isElementVisible(item.element)) {
          //if native element is also hidden then return false
          if (!this.isElementVisible(item.nativeElement, true)) {
            return false;
          }
          item.element = item.nativeElement;
        }
        return true; //if document contains navigationItem or native element
      }
      return false; //if item not of current page
    });
  }

  /**
   * Handle ArrowUp key navigation.
   */
  private handleArrowUpNavigation(event: KeyboardEvent, currentItem: HTMLElement) {
    event.preventDefault();
    const nextElement = this.findNextElementInAnyDirection(currentItem, 'top');
    if (nextElement) {
      this.focusItem(0, nextElement);
    } else {
      this.focusPreviousItem(this.navigationItems.indexOf(currentItem));
    }
  }

  /**
   * Handle ArrowDown key navigation.
   */
  private handleArrowDownNavigation(event: KeyboardEvent, currentItem: HTMLElement) {
    event.preventDefault();
    const nextElement = this.findNextElementInAnyDirection(currentItem, 'bottom');
    if (nextElement) {
      this.focusItem(0, nextElement);
    } else {
      this.focusNextItem(this.navigationItems.indexOf(currentItem));
    }
  }

  /**
   * Handle ArrowLeft key navigation.
   */
  private handleArrowLeftNavigation(event: KeyboardEvent, currentItem: HTMLElement) {
    event.preventDefault();
    const nextElement = this.findNextElementInAnyDirection(currentItem, 'left');
    if (nextElement) {
      this.focusItem(0, nextElement);
    } else {
      this.focusPreviousItem(this.navigationItems.indexOf(currentItem));
    }
  }

  /**
   * Handle ArrowRight key navigation.
   */
  private handleArrowRightNavigation(event: KeyboardEvent, currentItem: HTMLElement) {
    event.preventDefault();
    const nextElement = this.findNextElementInAnyDirection(currentItem, 'right');
    if (nextElement) {
      this.focusItem(0, nextElement);
    } else {
      this.focusNextItem(this.navigationItems.indexOf(currentItem));
    }
  }

  /**
   * Refresh the list of menu items.
   */
  private refreshNavigationItems() {
    try {
      this.navigationItems = Array.from(this.el.nativeElement.querySelectorAll('[data-item="navigationitem"]') as NodeListOf<HTMLElement>);
      this.navigationItems = this.navigationItems.filter((navigationItem) => {
        //set tabindex if not focusable element
        if (navigationItem.tabIndex === -1 || !navigationItem.matches('a[href]')) {
          this.renderer.setAttribute(navigationItem, 'tabindex', '0');
        }
        // Filter out disabled or hidden items
        return !navigationItem.hasAttribute('disabled') && this.isElementVisible(navigationItem);
      });
    } catch (error) {
      console.error('Error in refreshNavigationItems', error);
    }
  }

  /**
   * Focus on the next item in the menu.
   */
  private focusNextItem(currentIndex: number) {
    if (!this.navigationItems || this.navigationItems.length === 0) return;
    const nextIndex = (currentIndex + 1) % this.navigationItems.length;
    this.focusItem(nextIndex);
  }

  /**
   * Focus on the previous item in the menu.
   */
  private focusPreviousItem(currentIndex: number) {
    if (!this.navigationItems || this.navigationItems.length === 0) return;
    const prevIndex = (currentIndex - 1 + this.navigationItems.length) % this.navigationItems.length;
    this.focusItem(prevIndex);
  }

  /**
   * Focus on a specific item in the menu.
   */
  private focusItem(index: number, element: HTMLElement | null = null, section: number | null = null) {
    let navigationItem = element ? element : this.navigationItems[index];
    let lSection = section ? section : this.navMap.section;
    if (navigationItem.tabIndex === -1 || !navigationItem.matches('a[href]')) {
      this.renderer.setAttribute(navigationItem, 'tabindex', '0');
    }
    navigationItem?.focus();
    if (this.navMap.page !== null && this.navMap.section !== null && lSection !== null) {
      AccessibleNavigationDirective.lastNavigatedSectionInEveryPage[this.navMap.page] = { lastSection: lSection, lastElement: navigationItem };
    }
    return navigationItem
  }

  /**
   * Find the next element in a specific direction.
   */
  private findNextElementInAnyDirection(currentElement: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom'): HTMLElement | null {
    const currentRect = currentElement.getBoundingClientRect();
    let nextElement: HTMLElement | null = null;
    let minDistance = Infinity;

    this.navigationItems.forEach((element) => {
      if (element === currentElement) return;

      const rect = element.getBoundingClientRect();
      const currentCenter = this.getCenter(currentRect);
      const targetCenter = this.getCenter(rect);

      const isNext = this.isElementInDirection(direction, currentRect, rect, currentCenter, targetCenter);
      if (isNext) {
        const distance = this.calculateDistance(direction, currentRect, targetCenter);
        if (distance < minDistance) {
          minDistance = distance;
          nextElement = element;
        }
      }
    });

    return nextElement;
  }

  /**
   * Check if an element is in the specified direction.
   */
  private isElementInDirection(
    direction: 'left' | 'right' | 'top' | 'bottom',
    currentRect: DOMRect,
    targetRect: DOMRect,
    currentCenter: { x: number; y: number },
    targetCenter: { x: number; y: number }
  ): boolean {
    switch (direction) {
      case 'right':
        return targetCenter.x > currentCenter.x &&
          targetRect.y + targetRect.height > currentRect.y &&
          targetRect.y < currentRect.y + currentRect.height;
      case 'left':
        return targetCenter.x < currentCenter.x &&
          targetRect.y + targetRect.height > currentRect.y &&
          targetRect.y < currentRect.y + currentRect.height;
      case 'top':
        return targetCenter.y < currentCenter.y &&
          targetRect.x + targetRect.width > currentRect.x &&
          targetRect.x < currentRect.x + currentRect.width;
      case 'bottom':
        return targetCenter.y > currentCenter.y &&
          targetRect.x + targetRect.width > currentRect.x &&
          targetRect.x < currentRect.x + currentRect.width;
      default:
        return false;
    }
  }

  /**
   * Calculate the distance between two points based on direction.
   */
  private calculateDistance(direction: 'left' | 'right' | 'top' | 'bottom', currentRect: DOMRect, targetCenter: { x: number; y: number }): number {
    switch (direction) {
      case 'right':
        return targetCenter.x - currentRect.x;
      case 'left':
        return currentRect.x - targetCenter.x;
      case 'top':
        return currentRect.y - targetCenter.y;
      case 'bottom':
        return targetCenter.y - currentRect.y;
      default:
        return Infinity;
    }
  }

  /**
   * Get the center coordinates of a DOMRect.
   */
  private getCenter(rect: DOMRect): { x: number; y: number } {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }

  /**
   * Check if an element is visible.
   */
  private isElementVisible(element: HTMLElement, nativeElement: boolean = false): boolean {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    if (nativeElement) {
      return (
        style.visibility !== 'hidden' &&
        style.display !== 'none' &&
        style.opacity !== '0'
      );
    }
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== 'hidden' &&
      style.display !== 'none' &&
      style.opacity !== '0'
    );
  }

  /**
   * Check if an element is first and visible in viewport.
   */
  private getFirstVisibleElementInViewport() {
    let firstVisible = null;
    let minTop = Infinity;
    let viewportBottom = this.scrollableContainerId ? document.getElementById(this.scrollableContainerId)?.getBoundingClientRect().bottom : window.innerHeight;
    this.navigationItems.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= (viewportBottom || window.innerHeight)) {
        if (rect.top < minTop) {
          minTop = rect.top;
          firstVisible = el;
        }
      }
    });
    return firstVisible;
  }

  /**
   * Get the scrollable container element.
   */
  private getScrollableContainer(): HTMLElement {
    if (this.scrollableContainerId) {
      const container = document.getElementById(this.scrollableContainerId);
      if (container) return container;
      else return this.el.nativeElement
    }
    return this.el.nativeElement;
  }

  /**
   * Scroll the container in a specific direction.
   */
  private scrollContainer(event: KeyboardEvent, direction: 'up' | 'down', container: HTMLElement) {
    event.preventDefault();
    const scrollAmount = container.clientHeight; // Scroll by the container's height
    container.scrollTop += direction === 'up' ? -scrollAmount : scrollAmount;
  }

  /**
   * Scroll to the start of the container.
   */
  private scrollToStart(event: KeyboardEvent, container: HTMLElement) {
    event.preventDefault();
    container.scrollTop = 0;
  }

  /**
   * Scroll to the end of the container.
   */
  private scrollToEnd(event: KeyboardEvent, container: HTMLElement) {
    event.preventDefault();
    container.scrollTop = container.scrollHeight;
  }

  private isElementOnTop(element: Element): boolean {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    const elementsAtPoint = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
    return elementsAtPoint.length > 0 && (elementsAtPoint[0] === element || element.contains(elementsAtPoint[0]));
  }
}