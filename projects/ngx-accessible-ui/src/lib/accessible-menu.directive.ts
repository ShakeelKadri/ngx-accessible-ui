import { Directive, ElementRef, HostListener, AfterViewInit, Renderer2, Input, OnInit, Output, EventEmitter } from '@angular/core';

/**
 * # Angular Directive: `accessibleMenu`
 *
 * ## Overview
 * The accessibleMenu directive is designed to create or convert any existing menu into fully accessible menus and submenus that comply with **WCAG 2.1 Level AA** and the **European Accessibility Act 2025**. It ensures seamless navigation via keyboard, mouse, and touch, while providing advanced features like dynamic ARIA attributes, multi-level menu support, and customizable search functionality.
 *
 * ## Key Features
 * ### 1. Accessibility Compliance
 * - **WCAG 2.1 Level AA & European Accessibility Act 2025 Compliant**: Ensures menus are fully accessible via keyboard and meet modern accessibility standards.
 *
 * - **Dynamic ARIA Attributes**: Automatically assigns aria-haspopup, role, aria-controls, and aria-expanded attributes for proper screen reader support.
 *
 * - **Assistive Technology Compatibility**: Works seamlessly with screen readers and other assistive technologies.
 *
 * ### 2. Navigation
 * - **Keyboard, Mouse, and Touch Support**: Enables navigation using all input methods.
 *
 * - **Restricted Focus for Keyboard Users**: Keeps focus within the current menu or submenu until the Escape key (for main menu) or Left Arrow/Escape key (for submenu) is pressed.
 *
 * - **All-Direction Navigation**: Allows navigation in all directions using arrow keys, regardless of menu structure (grid, table, float, etc.).
 *
 * - **Numpad Support for Touch Users**: Enables touch users to navigate or input using a numpad without activating the native keyboard.
 *
 * ### 3. Dynamic Menu Behavior
 * - **Multi-Level Menu Support**: Handles infinite levels of nested menus.
 *
 * - **Auto Close**: Closes other menus when a new menu is opened or when clicking outside the menu.
 *
 * - **Dynamic Open/Close Control**: Supports submenus and items that remain always open or dynamically open based on data attributes.
 *
 * ### 4. Search Functionality
 * - **Advanced Two-Level Search**: Allows menu-wise and item-wise search using a single input field.
 *
 * - **Numpad Search**: Enables search using numpad keys (touch, mouse, or number keys).
 *
 * - **Direct Search**: If no search field or numpad is present, direct search is performed using any key.
 *
 * ### 5. Customization
 * - **Custom Navigation Keys**: Override default navigation keys per menu using (navUp), (navDown), (navOpenMenu), (navExitMenu), (navLeft), and (navRight).
 *
 * - **Template Variables**: Use template variables for conditional rendering (e.g., showing different icons based on menu state).
 *
 * - **Shortcut Keys**: Open the main menu using a specific key combination (e.g., Ctrl+Alt+X).
 *
 * ## Requirements
 * To ensure the directive works as intended, follow these rules:
 *
 * 1. Apply the accessibleMenu directive to the menu-opening element (e.g., <button>, <div>).
 *
 * 2. Use the mainMenu input to designate the main menu button:
 *    ```html
 *    <button accessibleMenu [mainMenu]="true">Open Main Menu</button>
 *    ```
 *
 * 3. The menu container must be the next sibling (nextElementSibling) of the menu-opening element.
 *
 * 4. Assign role="menuitem" to all menu items, regardless of their position in the menu container.
 *
 * ## Basic Structure
 *    ```html
 *    <button accessibleMenu [mainMenu]="true">Open Main Menu</button>
 *    <ul>
 *      <li role="menuitem">Item 1</li>
 *      <button role="menuitem" accessibleMenu>Item 2 Submenu Level 1</button>
 *      <ul>
 *        <li role="menuitem">Sub-item Level 1.1</li>
 *        <li role="menuitem">Sub-item Level 1.2</li>
 *      </ul>
 *    </ul>
 *    ```
 *
 * ## Optional Features
 * ### 1. All-Direction Navigation
 * Enable navigation in all directions using arrow keys:
 *    ```html
 *    <button accessibleMenu [allDirectionNavigation]="true">Open Menu</button>
 *    ```
 *
 * ### 2. Advanced Two-Level Search
 * Enable search functionality using an input field:
 * ```html
 * <input type="text" role="menuitem" data-use-search="true" placeholder="Search...">
 * ```
 *
 * ### 3. Keep Submenu Open
 * Keep a submenu open using the data-keep-submenu-open attribute:
 * ```html
 * <button role="menuitem" accessibleMenu data-keep-submenu-open="true">Open Submenu</button>
 * ```
 *
 * ### 4. Always Open Submenu Item
 * Keep specific submenu items always open:
 *   - Simple Example:
 *    ```html
 *     <li role = "menuitem" data-always-open = "true">Sub-item Level 2.2</li>
 *    ```
 *   - Conditional Example: 
 *    ```html
 *    <li role = "menuitem" [attr.data-always-open] = "(author === 'Default') ? 'true' : 'false'">
 *      Sub-item Level 2.2
 *    </li>
 *    ```
 *
 * ### 5. Remember Last Menu Item
 * Remember the last selected menu item for the next menu open:
 * ```html
 * <button accessibleMenu [rememberLastMenuitem]="true">Open Menu</button>
 * ```
 *
 * ### 6. Close Menu Upon Selection
 * Close the menu upon selecting a menu item:
 * ```html
 * <button accessibleMenu [closeMenuUponSelection]="true">Open Menu</button>
 * ```
 *
 * ### 7. Custom Navigation Keys
 * Customize navigation keys for each menu:
 * ```html
 * <button accessibleMenu (navUp)="['ArrowUp', 'W']" (navDown)="['ArrowDown', 'S']">Open Menu</button>
 * ```
 * 
 * ### 8. Template variables: 
 * Use template variables for conditional rendering to show different icons based on the menu state:
 *    ```html
 *    <button accessibleMenu #templateVar = "accessibleMenu">
 *       <svg *ngIf = "templateVar.menuState === 'Close'" ...>Left Arrow Icon</svg>
 *       <svg *ngIf = "templateVar.menuState === 'Open'" ...>Down Arrow Icon</svg>
 *    </button>
 *    ```
 * 
 * ### 9. Numpad Support
 * Add a numpad for touch users:
 * ```html
 * <button accessibleMenu [mainMenu] = "true">
 *  Open Main Menu
 * </button>
 * <ul>
 *  <li role = "menuitem">Item 1</li>
 *  <li role = "menuitem">Item 1</li> 
 * <aside role="menuitem" data-use-numpad="true">
 *   <div role="status">Enter Number</div>
 *   <div class="numpad">
 *     <button *ngFor="let button of ['1','2','3','4','5','6','7','8','9']" 
 *              role="button" data-button-type="number">{{ button }}</button>
 *     <button role="button" data-button-type="backspace">&#x232B;</button>
 *     <button role="button" data-button-type="number">0</button>
 *     <button role="button" data-button-type="enter">&#x21B5;</button>
 *   </div>
 * </aside>
 * ```
 *
 * ### 10. Standalone Numpad
 * Use a standalone numpad for input:
 * ```html
 * <button accessibleMenu [mainMenu]="true" [useNumpadOnly]="true">Open Numpad</button>
 * <ul role="menuitem" data-use-numpad="true">
 *   <div role="status">Enter Number</div>
 *   <div class="numpad">
 *     <button *ngFor="let button of ['1','2','3','4','5','6','7','8','9']" role="button" 
 *             (click)="onNumberClick(+button)" data-button-type="number">{{ button }}</button>
 *     <button role="button" data-button-type="backspace" (click)="onNumberClick('backspace')">&#x232B;</button>
 *     <button role="button" data-button-type="number" (click)="onNumberClick(0)">0</button>
 *     <button role="button" data-button-type="enter" (click)="onNumberClick('enter')">&#x21B5;</button>
 *   </div>
 * </ul>
 * ```
 *
 * ### 11. Shortcut Key
 * Open the main menu using a specific key combination:
 * ```html
 * <button accessibleMenu [shortcutKey]="'M'">Open Main Menu</button>
 * ```
 * 
 * ### 12 Other Configuration Options:
 * | Input                          | Default Values                      | Description |
 * |--------------------------------|------------------------------------|-------------|
 * | `inputTypesToIgnoreOnKeypress`   | `['text', 'search', 'range','additionalInputTypeHere']`       | Input types to ignore keypress events, Additional input types can be specified |
 * | `navKeysToExitInputElement`       | `['Tab', 'Escape', 'ArrowDown', 'ArrowUp']` | Configure keys to exit an input element |
 * | `navUp`                        | `['ArrowUp']`                      | Keys for navigating up |
 * | `navDown`                      | `['ArrowDown', 'Tab']`             | Keys for navigating down |
 * | `navLeft`                      | `['ArrowLeft']`                    | Keys for navigating left |
 * | `navRight`                     | `['ArrowRight']`                   | Keys for navigating right |
 * | `navOpenMenu`                  | `[' ', 'Enter']`                   | Keys for opening a menu |
 * | `navExitMenu`                  | `['Escape']`                       | Keys for closing a menu |

 * ## Example Usage
 * ### 1. Typical Menu Structure
 * ```html
 * <button accessibleMenu>
 *   Open Main Menu
 * </button>
 * 
 * <ul>
 *   <li role = "menuitem">Item 1</li>
 *   <button role = "menuitem" accessibleMenu>
 *     Item 2 Submenu Level 1
 *   </button>
 *   <ul>
 *       <li role = "menuitem">Sub-item Level 1.1</li>
 *       <li role = "menuitem">Sub-item Level 1.2</li>
 *   </ul>
 *   <button role = "menuitem" accessibleMenu data-keep-submenu-open = "true" 
 *           #subMenu = "accessibleMenu">
 *     Item 3 Submenu Level 1
 *     <svg *ngIf = "subMenu.menuState  ===  'Close'"> <!-- Right Arrow SVG --> </svg>
 *     <svg *ngIf = "subMenu.menuState === 'Open'"> <!-- Down Arrow SVG --> </svg>
 *   </button>
 *   <ul role = "menu">
 *     <input type = "text" role = "menuitem" data-use-search = "true" placeholder = "Search...">
 *     <li role = "menuitem">Sub-item 1</li>
 *     <button accessibleMenu>
 *       Submenu Level 2
 *     </button>
 *     <ul>
 *       <li role = "menuitem">Sub-item Level 2.1</li>
 *       <li role = "menuitem" data-always-open="true">Sub-item Level 2.2</li>
 *     </ul>
 *   </ul>
 * </ul>
 * ```
 *
 * ## Notes
 * - Fully supports Angular's *ngIf for dynamic rendering.
 * - Works seamlessly with custom templates and dynamic DOM changes.
 * - Available as accessibleMenu via exportAs for dynamic focus handling.
 */

@Directive({
  selector: '[accessibleMenu]',
  exportAs: 'accessibleMenu',
})
export class AccessibleMenuDirective implements OnInit, AfterViewInit {

  //#region Inputs and outputs
  // EventEmitter to emit the click event of the menu opening buton
  @Output() Click = new EventEmitter<string>();

  @Input() navLeft: string[] = ['ArrowLeft']; @Input() navRight: string[] = ['ArrowRight'];
  @Input() navKeysToExitInputElement: string[] = ['Tab', 'Escape', 'ArrowDown', 'ArrowUp'];
  @Input() inputTypesToIgnoreKeypress: string[] = ['text', 'search', 'range'];
  @Input() navOpenMenu = [' ', 'Enter']; @Input() navExitMenu = ['Escape'];
  @Input() navUp = ['ArrowUp']; @Input() navDown = ['ArrowDown', 'Tab'];
  @Input() allDirectionNavigation: boolean = false;
  @Input() closeMenuUponSelection: boolean = false;
  @Input() rememberLastMenuitem: boolean = false;
  @Input() shortcutKey: string | null = null;
  @Input() useNumpadOnly: boolean = false;
  @Input() mainMenu: boolean = false;
  //#endregion

  //#region Internal variables
  alwaysOpenItems: [HTMLElement | null, ParentNode | null, Node | null][] = [];
  useNumpad: boolean = false; numpadElement: HTMLElement | null = null;
  alwaysOpenContainer: HTMLElement | null = null;
  searchElement: HTMLInputElement | null = null;
  lastActiveMenuitem: HTMLElement | null = null;
  numpadStatus: HTMLElement | null = null;
  numpadStatusStartText: string = '';
  menuItems: HTMLElement[] = [];
  useSearch: boolean = false;
  searchText: string = '';
  lastMenuitemIndex = 0;
  searchTimeout: any;
  searchBuffer = '';
  resetRequiredMenuItems: boolean = false;

  private _defaultMenuItemId?: string;
  @Input() set defaultMenuItemId(value: string) {
    this._defaultMenuItemId = value;
    if (this.menuItems.length > 0) {
      const defaultMenuItem = this.menuItems.find((menuItem) => menuItem.id === value);
      if (defaultMenuItem) this.lastMenuitemIndex = this.menuItems.indexOf(defaultMenuItem);
    }
  }

  get defaultMenuItemId(): string | undefined { return this._defaultMenuItemId; }

  private static allAlwaysOpenItems: [HTMLElement | null, HTMLElement | null][] = []

  private static allMenuState = "Close"
  private _state = "Close";
  get state(): string {
    return this._state;
  }
  set state(value: string) {
    this._state = value;
    AccessibleMenuDirective.allMenuState = value;
  }
  //#endregion

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    try {
      this.setupShortcutKeyListener();
      this.setMenuState('false', 'none', 'Close');
    } catch (error) {
      console.warn('AccessibleMenuDirective On Initialization Error:', error);
    }
  }

  ngAfterViewInit() {
    try {
      this.setCoreAriaAttributes(this.el.nativeElement);
      this.refreshMenuItems();
      this.enableFocusablity();
      this.enableTwoLevelSearch();
      this.enableNumpad();
      this.renderer.listen(this.el.nativeElement.nextElementSibling, 'keydown', (event: KeyboardEvent) => {
        this.handleKeyboardNavigation(event, true);
      });
    } catch (error) {
      console.warn('AccessibleMenuDirective AfterView Initialization Error:', error);
    }
  }

  get menuState(): string { return this.state; }

  // Setup shortcut key listener
  private setupShortcutKeyListener() {
    if (this.shortcutKey) {
      this.renderer.listen('document', 'keydown', (event) => {
        if (this.shouldIgnoreKeypress(event)) return;
        if (this.isShortcutKeyPressed(event)) {
          this.el.nativeElement.click();
          event.preventDefault();
        }
      });
    }
  }

  // Check if the keypress should be ignored, 
  private shouldIgnoreKeypress(event: KeyboardEvent): boolean {
    return (
      // When the focus is on an input field
      (document.activeElement instanceof HTMLInputElement &&
        this.inputTypesToIgnoreKeypress.includes((document.activeElement as HTMLInputElement).type)) ||
      // When menu is already open
      this.state === 'Open' ||
      // When any other menu is open
      AccessibleMenuDirective.allMenuState === 'Open'
    );
  }

  // Check if the shortcut key is pressed
  private isShortcutKeyPressed(event: KeyboardEvent): boolean {
    const key = this.shortcutKey?.toLowerCase() ?? '';
    const ctrlRequired = key.includes('ctrl+');
    const altRequired = key.includes('alt+');
    const shiftRequired = key.includes('shift+');
    const metaRequired = key.includes('meta+');
    const mainKey = key.replace(/ctrl\+|alt\+|shift\+|meta\+/g, '').toLowerCase();
    const expectedCode = `Key${mainKey.toUpperCase()}`;

    return (
      ctrlRequired === event.ctrlKey &&
      altRequired === event.altKey &&
      shiftRequired === event.shiftKey &&
      metaRequired === event.metaKey &&
      (mainKey === event.key.toLowerCase() || event.code === expectedCode)
    );
  }

  // Set ARIA attributes for menu opening element and its next sibling i.e menu container
  private setCoreAriaAttributes(element: HTMLElement) {
    this.renderer.setAttribute(element, 'aria-haspopup', 'menu');
    if (element.nextElementSibling)
      this.renderer.setAttribute(element, 'aria-controls', element.nextElementSibling.id);
    if (!element.getAttribute('aria-label')) {
      this.renderer.setAttribute(element, 'aria-label', 'Opens menu');
    }
    // If orphan menuitems has no direct parent with role menu then apply role group
    // Check if previousElementSibling has directive applied, if not then change role of menu to group
    this.el.nativeElement.nextElementSibling?.querySelectorAll('[role="menu"]').forEach((menu: any) => {
      if (menu.previousElementSibling) {
        if (!menu.previousElementSibling.hasAttribute('accessibleMenu'))
          this.renderer.setAttribute(menu, 'role', 'group');
      }
      else this.renderer.setAttribute(menu, 'role', 'group');
    })
    if (element.nextElementSibling?.getAttribute('role') !== 'menu') {
      this.renderer.setAttribute(element.nextElementSibling, 'role', 'menu');
    }
  }

  private enableFocusablity() {
    if (this.el.nativeElement.tabIndex === -1) this.renderer.setAttribute(this.el.nativeElement, 'tabindex', '0')
    for (const menuItem of this.menuItems) {
      const menuItemElement = menuItem as HTMLElement;
      if (menuItemElement.tabIndex === -1) {
        this.renderer.setAttribute(menuItemElement, 'tabindex', '0');
        this.renderer.listen(menuItemElement, 'click', () => {
          if (!this.closeMenuUponSelection) {
            menuItemElement.focus();
            setTimeout(() => {
              if (document.activeElement !== menuItemElement) menuItemElement.focus();
            }, 100);
          }
        });
      }
    }
  }

  private enableTwoLevelSearch() {
    for (const menuItem of this.menuItems) {
      const menuItemElement = menuItem as HTMLElement;
      if (menuItemElement instanceof HTMLInputElement &&
        this.inputTypesToIgnoreKeypress.includes(menuItemElement.type) &&
        menuItem.getAttribute('data-use-search') === 'true') {
        this.useSearch = true; this.searchElement = menuItemElement
      }
    }
  }

  private enableNumpad() {
    for (const menuItem of this.menuItems) {
      const menuItemElement = menuItem as HTMLElement;
      if (menuItem.getAttribute('data-use-numpad') === 'true' && !this.useNumpadOnly) {
        this.numpadElement = menuItemElement;
        this.renderer.setAttribute(this.numpadElement, 'role', ''); this.useNumpad = true;
        this.numpadStatus = this.numpadElement.querySelector('[role="status"]')
        this.numpadStatusStartText = this.numpadStatus?.textContent ? this.numpadStatus.textContent : ''
        this.numpadElement.querySelectorAll('[role="button"]').forEach((button) => {
          const buttonType = button.getAttribute('data-button-type');
          if (buttonType) {
            const label = buttonType === 'number' ? button.textContent : buttonType;
            if (label) this.renderer.setAttribute(button, 'aria-label', label);
            this.renderer.listen(button, 'click', () => {
              this.numpadSearch(label);
            });
          }
        });
      }
    }
    if (this.el.nativeElement.nextElementSibling.getAttribute('data-use-numpad') === 'true' && this.useNumpadOnly) {
      this.numpadElement = this.el.nativeElement.nextElementSibling as HTMLElement;
      this.renderer.setAttribute(this.numpadElement, 'role', 'menu');
      this.useNumpad = true;
      this.numpadElement.querySelectorAll('[data-button-type]').forEach((button) => {
        this.renderer.setAttribute(button, 'role', 'menuitem');
        this.renderer.setAttribute(button, 'tabindex', '0');
      });
    }
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {//menu/submenu buttons and menuitems are always siblings, not containing other as child
    //If the click is on main menu opening button, toggle the main menu and stop further propagation of the event.    
    if (this.mainMenu && this.el.nativeElement.contains(event.target)) {
      this.toggleMenu()
      event.stopPropagation()
      return
    }
    //If the click is outside the main menu button and mainmenu i.e its next sibling i.e menu container, then close the menu. 
    if (!this.el.nativeElement.nextElementSibling.contains(event.target as Node) && this.mainMenu) {
      if (this.state === 'Open') this.closeMenu(false)
      return
    }
    // If element is an input field of type 'text' or 'search', do nothing to allow user interactions with the input field.    
    if (document.activeElement instanceof HTMLInputElement &&
      this.inputTypesToIgnoreKeypress.includes(document.activeElement.type)) return
    // If the click is outside sub-menu opening button & submenu i.e its next sibling i.e menu container, then close the menu.
    if (!this.el.nativeElement.contains(event.target as Node) && !this.el.nativeElement.nextElementSibling.contains(event.target as Node)) {
      // and if the submenu is marked with 'data-keep-submenu-open', keep it open.
      if (this.el.nativeElement.getAttribute('data-keep-submenu-open') !== 'true')
        if (this.state === 'Open') this.closeMenu(false);
      return
    }

    // If the click is on submenu button, toggle the submenu.
    if (this.el.nativeElement.contains(event.target)) {
      this.toggleMenu(); return
    }

    // Handle clicks on menu items: If the clicked target is not a direct menu item, check if its closest ancestor
    // has a 'role="menuitem"' attribute. If it does, update the `menuitem` reference.    
    let menuitem = event.target as HTMLElement
    if (this.menuItems.indexOf(menuitem) === -1) menuitem = menuitem.closest('[role="menuitem"]') as HTMLElement;

    // If the `menuitem` is found in the list of menu items, take further actions:
    // Remember the last selected menu item if enabled. Close the menu upon selection if the option is enabled.    
    if (menuitem && this.menuItems.indexOf(menuitem) !== -1) {
      if (this.rememberLastMenuitem) {
        this.lastMenuitemIndex = this.menuItems.indexOf(menuitem);
      }
      if (this.closeMenuUponSelection) this.closeMenu();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent, eventFromMenu = false) {
    try {
      if (this.isOpenMainMenu(event)) return;
      if (this.isOpenSubmenu(event, eventFromMenu)) return;
      if (this.isIgnoreKeypressInInputElement(event)) return;

      this.refreshMenuItems();
      if (!this.menuItems?.length) return;

      const activeIndex = this.getActiveIndex();
      if (activeIndex === -1) return;

      event.preventDefault();
      this.handleKeyPress(event, activeIndex);
    } catch (error) {
      console.warn('Error handling keyboard navigation:', error);
    }
  }

  private isOpenMainMenu(event: KeyboardEvent): boolean {
    if (!this.mainMenu || event.target !== this.el.nativeElement) return false;

    //if button which open MAIN MENU is pressed with space or enter
    if (this.navOpenMenu.includes(event.key)) {
      this.el.nativeElement.click();
      event.preventDefault();
      return true;
    }
    return false;
  }

  private isOpenSubmenu(event: KeyboardEvent, eventFromMenu: boolean): boolean {
    if (document.activeElement !== this.el.nativeElement || eventFromMenu) return false;

    //if button which open SUB MENU is pressed with keys in navOpenMenu array
    if (this.navOpenMenu.includes(event.key)) {
      this.el.nativeElement.click();
    }

    //do not react to any other keys, it will be dealt with menu KeyboardNavigation when event from menu true
    event.preventDefault();
    return true;
  }

  private isIgnoreKeypressInInputElement(event: KeyboardEvent): boolean {
    const activeElement = document.activeElement as HTMLInputElement;
    if (!activeElement || !this.inputTypesToIgnoreKeypress.includes(activeElement.type)) return false;

    if (this.useSearch && !this.navKeysToExitInputElement.includes(event.key)) {
      //if use inbuilt search & not navkeys not include key to exit it
      setTimeout(() => this.refreshMenuItems(), 50); // Delay the search to allow the input to update its value after key press
      return true;
    }
    return false;
  }

  private getActiveIndex(): number {
    let activeIndex = this.menuItems.indexOf(document.activeElement as HTMLElement);

    //if active element is not menuitem, then check if it is inside numpad element
    if (activeIndex === -1 && this.useNumpad && this.numpadElement && !this.useNumpadOnly) {
      activeIndex = this.lastActiveMenuitem
        ? this.menuItems.indexOf(this.lastActiveMenuitem)
        : this.lastMenuitemIndex;
    }
    return activeIndex;
  }

  private handleKeyPress(event: KeyboardEvent, activeIndex: number) {
    const currentItem = this.menuItems[activeIndex];
    event.preventDefault();

    switch (true) {
      case this.navOpenMenu.includes(event.key):
        this.handleOpenMenuKey(event, currentItem, activeIndex);
        break;
      case this.navRight.includes(event.key):
        this.handleRightKey(currentItem, activeIndex);
        break;
      case this.navDown.includes(event.key):
        this.handleDownKey(event, currentItem, activeIndex);
        break;
      case this.navUp.includes(event.key):
        this.handleUpKey(currentItem, activeIndex);
        break;
      case this.navLeft.includes(event.key):
        this.handleLeftKey(currentItem, activeIndex);
        break;
      case this.navExitMenu.includes(event.key):
        this.closeMenu();
        break;
      default:
        this.handleDefaultCase(event, currentItem);
    }
  }

  private handleOpenMenuKey(event: KeyboardEvent, currentItem: HTMLElement, activeIndex: number) {
    if (this.useNumpad && this.numpadElement && this.useNumpadOnly) {
      this.pressNumpad(event.key, currentItem);
      return;
    }

    if (this.rememberLastMenuitem) {
      this.lastMenuitemIndex = activeIndex;
    }

    currentItem.click();
    if (this.closeMenuUponSelection) this.closeMenu();
  }

  private handleRightKey(currentItem: HTMLElement, activeIndex: number) {
    //if allDirectionNavigation is enabled then go right and not open submenu
    if (this.allDirectionNavigation) {
      const nextElement = this.findNextElementInAnyDirection(currentItem, "right");
      nextElement ? this.focusItem(0, nextElement) : this.focusNextItem(activeIndex);
    } else if (currentItem.getAttribute('aria-haspopup') === 'menu') {
      currentItem.click();
    }
  }

  private handleDownKey(event: KeyboardEvent, currentItem: HTMLElement, activeIndex: number) {
    if (event.shiftKey) {
      this.handleShiftedDownKey(currentItem, activeIndex);
    } else {
      this.handleRegularDownKey(currentItem, activeIndex);
    }
  }

  private handleShiftedDownKey(currentItem: HTMLElement, activeIndex: number) {
    if (this.allDirectionNavigation) {
      const nextElement = this.findNextElementInAnyDirection(currentItem, "top");
      nextElement ? this.focusItem(0, nextElement) : this.focusPreviousItem(activeIndex);
    } else {
      this.focusPreviousItem(activeIndex);
    }
  }

  private handleRegularDownKey(currentItem: HTMLElement, activeIndex: number) {
    if (this.allDirectionNavigation) {
      const nextElement = this.findNextElementInAnyDirection(currentItem, "bottom");
      nextElement ? this.focusItem(0, nextElement) : this.focusNextItem(activeIndex);
    } else {
      this.focusNextItem(activeIndex);
    }
  }

  private handleUpKey(currentItem: HTMLElement, activeIndex: number) {
    if (this.allDirectionNavigation) {
      const nextElement = this.findNextElementInAnyDirection(currentItem, "top");
      nextElement ? this.focusItem(0, nextElement) : this.focusPreviousItem(activeIndex);
    } else {
      this.focusPreviousItem(activeIndex);
    }
  }

  private handleLeftKey(currentItem: HTMLElement, activeIndex: number) {
    if (this.allDirectionNavigation) {
      const nextElement = this.findNextElementInAnyDirection(currentItem, "left");
      nextElement ? this.focusItem(0, nextElement) : this.focusPreviousItem(activeIndex);
    } else if (!this.mainMenu) {
      this.closeMenu();
    }
  }

  private handleDefaultCase(event: KeyboardEvent, currentItem: HTMLElement) {
    if (this.useNumpad && this.numpadElement) {
      if (this.useNumpadOnly) {
        //match numpad key text contain with event.key
        this.pressNumpad(event.key, currentItem);
      } else {
        this.numpadSearch(event.key);
      }
    } else {
      this.directSearch(event.key);
    }
  }
  pressNumpad(key: any, currentItem: HTMLElement) {
    for (let i = 0; i < this.menuItems.length; i++) {
      const buttonType = this.menuItems[i].getAttribute('data-button-type')?.trim().toLowerCase();
      if ((buttonType === 'enter' && this.navOpenMenu.includes(key))) {
        if (key === ' ') currentItem.click();
        else this.menuItems[i].click();
      }
      else if (buttonType === 'backspace' && key.trim().toLowerCase() === 'backspace') {
        this.menuItems[i].click(); break
      }
      else if (this.menuItems[i].textContent!.trim().toLowerCase() === key.trim().toLowerCase()) {
        this.menuItems[i].click(); break
      }
    }
  }

  private numpadSearch(key: any) {
    key = key.trim()
    if (key.toLowerCase() === 'backspace') {
      this.searchText = this.searchText.slice(0, -1);
      if (this.searchText === '') {
        if (this.numpadStatus) this.numpadStatus.textContent = this.numpadStatusStartText;
        return
      }
    }
    else if (key.toLowerCase() === 'enter') {
      if (this.searchText !== '' && this.searchText !== this.numpadStatusStartText)
        this.searchMenu(this.searchText, key); return
    }
    else this.searchText += key.trim();
    if (this.numpadStatus) this.numpadStatus.textContent = this.searchText;
    this.searchMenu(this.searchText);
  }

  directSearch(key: any) {
    key = key.trim()
    // Build search buffer
    this.searchBuffer += key;
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => (this.searchBuffer = ''), 500);
    this.searchMenu(this.searchBuffer);
  }

  searchMenu(searchText: any, key = '') {
    let match = this.menuItems.find((menuItem: HTMLElement) => {
      return menuItem.textContent!.trim().toLowerCase().startsWith(searchText.trim().toLowerCase());
    })
    if (!match) {
      match = this.menuItems.find((menuItem: HTMLElement) => {
        return menuItem.textContent!.trim().toLowerCase().includes(searchText.trim().toLowerCase());
      })
    }
    if (match) {
      if (key.toLowerCase() === 'enter') { match.click(); if (this.closeMenuUponSelection) this.closeMenu(); return }
      match.scrollIntoView({ block: 'nearest' }); this.focusItem(0, match);
      setTimeout(() => { this.focusItem(0, match); }, 100);
    }
  }

  toggleMenu() { if (this.state === 'Close') this.openMenu(); else this.closeMenu() }

  private refreshMenuItems(isOpeningMenu = false) {
    try {
      if (this.doTwoLevelSearch()) return;
      if (isOpeningMenu) this.reinsertAlwaysOpenItems();
      this.updateMenuItems();
      this.manageAlwaysOpenItems();
    } catch (error) {
      console.warn('Error refreshing menu items:', error);
    }
  }

  private doTwoLevelSearch() {
    if (!this.useSearch) return false;

    if (this.searchElement && this.searchElement.value) {
      this.search(this.searchElement.value);
      this.resetRequiredMenuItems = true;
      return true;
    }

    if (this.resetRequiredMenuItems) this.resetMenuItems();
    return false;
  }

  private resetMenuItems() {
    const selector = '[role="forsearchDisabled"],[role="searchitem"]';
    this.menuItems = Array.from(
      this.el.nativeElement.nextElementSibling.querySelectorAll(selector) as NodeListOf<HTMLElement>
    );

    this.menuItems.forEach(item => {
      this.setMenuItemRole(item);
      this.closeSubmenus(item);
      //reset display of menuitem
      item.style.display = '';
    });

    this.resetRequiredMenuItems = false;
  }

  private setMenuItemRole(item: HTMLElement) {
    let role = 'menuitem';
    if (item instanceof HTMLInputElement) {
      role = item.type === 'radio' ? 'menuitemradio'
        : item.type === 'checkbox' ? 'menuitemcheckbox'
          : role;
    }
    this.renderer.setAttribute(item, 'role', role);
  }

  private closeSubmenus(item: HTMLElement) {
    if (item.getAttribute('aria-expanded') === 'false' &&
      item.getAttribute('aria-haspopup') === 'menu') {
      const submenu = item.nextElementSibling as HTMLElement;
      if (submenu) submenu.style.display = 'none';
    }
  }

  private updateMenuItems() {
    const selector = this.useSearch
      ? '[role^="menuitem"],[role="searchitem"]'
      : '[role^="menuitem"]';

    this.menuItems = Array.from(
      this.el.nativeElement.nextElementSibling.querySelectorAll(selector)
    ).filter(item => this.isMenuItemVisibleAndNative(item as HTMLElement)) as HTMLElement[];
  }

  private isMenuItemVisibleAndNative(item: HTMLElement): boolean {
    const styles = window.getComputedStyle(item);
    const isMenuitemOfThisMenu = item.closest('[role="menu"]') === this.el.nativeElement.nextElementSibling;

    return isMenuitemOfThisMenu &&
      !item.hasAttribute('disabled') &&
      styles.display !== 'none' &&
      styles.visibility !== 'hidden' &&
      styles.opacity !== '0';
  }

  private manageAlwaysOpenItems() {
    //if always open item inside menu, create container div if not exist and move always open item to that container
    const shouldHandleAlwaysOpen = this.menuItems.some(item =>
      item.getAttribute('data-always-open') === 'true'
    ) && this.menuState === 'Close'
      && document.activeElement !== this.el.nativeElement;

    if (!shouldHandleAlwaysOpen) return;

    this.createAlwaysOpenContainer();
    this.moveAlwaysOpenItems();
  }

  private createAlwaysOpenContainer() {
    if (!this.alwaysOpenContainer) {
      this.alwaysOpenContainer = this.renderer.createElement('div');
    }

    //Insert container as menu container's nextsiblings  
    const menu = this.el.nativeElement.nextElementSibling;
    if (menu.nextSibling) {
      menu.parentNode?.insertBefore(this.alwaysOpenContainer, menu.nextSibling);
    } else {
      menu.parentNode?.appendChild(this.alwaysOpenContainer);
    }
  }

  private moveAlwaysOpenItems() {
    this.menuItems.forEach(item => {
      //Insert all always open item to that contnr and set always open false
      if (item.getAttribute('data-always-open') !== 'true') return;

      const parent = item.parentNode;
      const sibling = item.nextSibling;
      const menuButton = item.closest('[role="menu"]')?.previousElementSibling as HTMLElement;

      if (!this.isTrackedItem(item)) {
        this.alwaysOpenItems.push([item, parent, sibling]);
      }
      if (!this.isTrackedInGlobal(item)) {
        AccessibleMenuDirective.allAlwaysOpenItems.push([item, menuButton]);
      }

      this.renderer.setAttribute(item, 'data-always-open', 'false');
      this.renderer.appendChild(this.alwaysOpenContainer, item);
    });
  }

  private isTrackedItem(item: HTMLElement): boolean {
    return this.alwaysOpenItems.some(([existing]) => existing === item);
  }

  private isTrackedInGlobal(item: HTMLElement): boolean {
    return AccessibleMenuDirective.allAlwaysOpenItems.some(([existing]) => existing === item);
  }

  private reinsertAlwaysOpenItems() {
    if (this.alwaysOpenItems.length === 0) return;

    this.alwaysOpenItems.forEach(([item, parent, sibling]) => {
      this.renderer.setAttribute(item, 'data-always-open', 'true');
      item && sibling ? parent?.insertBefore(item, sibling) : item ? parent?.appendChild(item) : null;
    });
  }

  private focusNextItem(currentIndex: number) {
    if (!this.menuItems || this.menuItems.length === 0) return;
    const nextIndex = (currentIndex + 1) % this.menuItems.length;
    this.focusItem(nextIndex);
  }

  private focusPreviousItem(currentIndex: number) {
    if (!this.menuItems || this.menuItems.length === 0) return;
    const prevIndex = (currentIndex - 1 + this.menuItems.length) % this.menuItems.length;
    this.focusItem(prevIndex);
  }

  private focusItem(index: number, element: HTMLElement | null = null) {
    let menuitem = this.menuItems[index]
    if (element != null) { menuitem = element; index = this.menuItems.indexOf(element as HTMLElement) }
    const parent = menuitem.closest('[role="menu"]') as HTMLElement
    if (parent.getAttribute('aria-hidden') === 'true') {
      this.renderer.setAttribute(parent, 'aria-hidden', 'false');
    }
    if (menuitem.tabIndex == -1 || !menuitem.matches('a[href]'))
      this.renderer.setAttribute(menuitem, 'tabindex', '0');
    menuitem?.focus();
    this.lastActiveMenuitem = menuitem
  }

  private openMenu() {
    this.resetSearches()
    this.refreshMenuItems(true);
    this.setMenuState('true', '', 'Open');

    //Execute Click funtion in html code specified by user after open menu for menu size etc.    
    this.Click.emit(this.searchText)

    if (this.menuItems.length === 0) return;
    this.focusInitialMenuItem();
    this.openSubmenus();
  }

  private closeMenu(applyFocus = true) {
    this.setMenuState('false', 'none', 'Close', applyFocus)
    this.alwaysOpenItems.forEach((openItem) => {
      const element = openItem[0] as HTMLElement;
      if (!this.alwaysOpenContainer?.contains(element)) {
        this.renderer.appendChild(this.alwaysOpenContainer, element);
        this.renderer.setAttribute(element, 'data-always-open', 'false');
      }
    })
  }

  private resetSearches() {
    if (this.useSearch && this.searchElement) this.searchElement.value = ''
    if (this.useNumpad && this.numpadElement) {
      this.searchText = '';
      if (this.numpadStatus) this.numpadStatus.textContent = this.numpadStatusStartText
    }
  }

  private focusInitialMenuItem() {
    let index = 0;
    //then if use defaultMenuElement then set index to defaultMenuElement index
    if (this.defaultMenuItemId && document.getElementById(this.defaultMenuItemId))
      index = this.menuItems.indexOf(document.getElementById(this.defaultMenuItemId) as HTMLElement)

    //if rememberLastMenuitem is enabled then set to lastMenuitemIndex which also get updated with defaultMenuItemId
    if (this.rememberLastMenuitem && this.lastMenuitemIndex != 0) index = Number(this.lastMenuitemIndex)

    //if menuitem is of text or search field then set next menuitem
    if (this.menuItems[index] instanceof HTMLInputElement &&
      this.inputTypesToIgnoreKeypress.includes((this.menuItems[index] as HTMLInputElement).type)) {
      this.focusNextItem(index)
    } else {
      this.focusItem(index)
    }
  }

  private openSubmenus() {
    this.menuItems.forEach((item) => {
      if (item.style.display = 'none') item.style.display = ''
      if (item.getAttribute('data-keep-submenu-open') === 'true') {
        if (item.getAttribute('aria-expanded') === 'false') { item.click() } else {
          item.click(); setTimeout(() => {
            item.click()
          }, 10);
        }
      }
    })
  }

  private setMenuState(expandedState: any, displayState: any, menustate: any, applyFocus = true) {
    this.renderer.setAttribute(this.el.nativeElement, 'aria-expanded', expandedState);
    if (menustate == 'Close') setTimeout(() => {
      if (applyFocus) this.el.nativeElement.focus();
    }, 10);
    this.el.nativeElement.nextElementSibling.style.display = displayState;
    this.state = menustate
  }

  private search(value: any) {
    this.resetAndFilterAllMenuItemsForSearchText(value.toLowerCase());
    const twoLevelSearchResult = this.createtwoLevelSearchResult();

    //assign two level serch result to menuitems to navigate through search result
    this.menuItems = twoLevelSearchResult
  }

  private createtwoLevelSearchResult(): HTMLElement[] {
    const results: HTMLElement[] = [];
    this.menuItems.forEach(menuItem => {
      if (this.isSubmenu(menuItem)) {
        //Add submenu and all its menuitems to search result
        this.processSubmenu(menuItem, results);
      } else {
        this.processRegularMenuItem(menuItem, results);
      }
    });

    //display two level search result and set role as searchitem
    results.forEach((searchItem) => {
      this.renderer.setAttribute(searchItem, 'role', 'searchitem');
      (searchItem as HTMLElement).style.display = ''
    })
    return results;
  }

  private resetAndFilterAllMenuItemsForSearchText(value: any) {
    this.menuItems = Array.from(
      this.el.nativeElement.nextElementSibling.querySelectorAll(
        '[role^="menuitem"],[role="forsearchDisabled"],[role="searchitem"]'
      )
    ).map((menuItem) => {
      this.renderer.setAttribute(menuItem, 'role', 'forsearchDisabled');
      if (menuItem !== this.searchElement) (menuItem as HTMLElement).style.display = 'none'
      return menuItem
    }).filter((item) => {
      if (item === this.searchElement) return true//keep search box visible too
      //get all menuitem that matches with search value
      return (item as HTMLElement).innerText.toLowerCase().includes(value) && !(item as HTMLElement).hasAttribute('disabled');
    }) as HTMLElement[];
  }

  private isSubmenu(menuItem: HTMLElement): boolean {
    return menuItem.getAttribute('aria-haspopup') === 'menu';
  }

  private processSubmenu(menuItem: HTMLElement, results: HTMLElement[]) {
    //first add menu button itself which match search value
    results.push(menuItem)
    //then all item in menu add to search result
    let tempMenuItems: HTMLElement[] = []
    const nextSiblingOfMenuItem = menuItem.nextElementSibling as HTMLElement | null;
    if (nextSiblingOfMenuItem) {
      nextSiblingOfMenuItem.style.display = ''
      tempMenuItems = Array.from(
        nextSiblingOfMenuItem.querySelectorAll('[role="forsearchDisabled"]')
      );
    }
    else {
      // Handle the case where nextSiblingOfMenuItem is null
      tempMenuItems = [];
    }
    results.push(...tempMenuItems);

    //then add all always open item to result which belongs to this submenu but are in always open container
    AccessibleMenuDirective.allAlwaysOpenItems.forEach((item) => {
      //if menubutton match with menubutton of always open item
      if (item[1] === menuItem) {
        if (item[0]) item[0].style.display = '';
        results.push(item[0] as HTMLElement);
      }
    })
  }

  private processRegularMenuItem(menuItem: HTMLElement, results: HTMLElement[]) {
    //if always open menuitem match with search value, make visible its menu button
    AccessibleMenuDirective.allAlwaysOpenItems.forEach((item) => {
      //if always open menuitem match with search value
      if (item[0] === menuItem) {
        if (item[1]) item[1].style.display = '';
      }
    })
    //Now if menuitem is not menu button and normal menuitem then show menu container itself i.e. parent of menuitem
    const parent = menuItem.closest('[role="menu"]') as HTMLElement | null;
    if (parent?.style.display === 'none') {
      (parent as HTMLElement).style.display = '';
    }
    //First add menu button cum heading i.e previousSibling of menu container which contain this menuitem
    const previousSibling = (parent as HTMLElement).previousSibling as HTMLElement | null;
    if (previousSibling && previousSibling != this.el.nativeElement) {
      //check if it is already added so not add again
      if (!results.includes(previousSibling)) results.push(previousSibling)
    }
    //Now addd menuitem 
    if (!results.includes(menuItem)) results.push(menuItem)
  }


  private findNextElementInAnyDirection(currentElement: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom'): HTMLElement | null {
    const currentRect = currentElement.getBoundingClientRect();
    let nextElement: HTMLElement | null = null;
    let minDistance = Infinity;

    this.menuItems.forEach((element) => {
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

  private getCenter(rect: DOMRect): { x: number; y: number } {
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  }
}
