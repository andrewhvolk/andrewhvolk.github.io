// 1. Check local storage safely
let savedTheme = null;
try {
    savedTheme = localStorage.getItem('theme');
} catch (error) {
    console.warn("localStorage is unavailable, defaulting to system preference.");
}

const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const mobileNavMediaQuery = window.matchMedia('(max-width: 768px)');

// Set the theme before the DOM fully loads
if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
} else {
    document.documentElement.setAttribute('data-theme', 'light');
}

const menuToggleLabel = (expanded) => expanded ? 'Close navigation menu' : 'Open navigation menu';
const submenuToggleLabel = (expanded) => expanded ? 'Close Courses submenu' : 'Open Courses submenu';

function getFocusableElements(container) {
    if (!container) return [];

    return Array.from(
        container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    ).filter((element) => !element.hasAttribute('hidden') && !element.closest('[hidden]'));
}

function closeOtherDropdowns(currentDropdown, navRoot) {
    navRoot.querySelectorAll('.dropdown[data-mobile-open="true"]').forEach((dropdown) => {
        if (dropdown !== currentDropdown) {
            dropdown.dataset.mobileOpen = 'false';
            const trigger = dropdown.querySelector('.dropdown-trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
                trigger.setAttribute('aria-label', submenuToggleLabel(false));
            }
        }
    });
}

function setupGlobalNav(navRoot, index) {
    const menuGroups = Array.from(navRoot.querySelectorAll(':scope .top-nav-links, :scope .top-nav-utilities, :scope .nav-links'));
    if (menuGroups.length === 0) return;

    const primaryMenu = menuGroups[0];
    const navId = primaryMenu.id || `global-nav-menu-${index + 1}`;
    primaryMenu.id = navId;
    menuGroups.forEach((group) => {
        group.dataset.navMenu = 'true';
    });

    const existingToggle = navRoot.querySelector(':scope .menu-toggle, :scope .nav-toggle');
    const toggleButton = existingToggle || document.createElement('button');

    if (!existingToggle) {
        toggleButton.type = 'button';
        toggleButton.className = 'menu-toggle global-nav-toggle';
        toggleButton.innerHTML = '<span class="menu-toggle__label">Menu</span><span class="menu-toggle__icon" aria-hidden="true"></span>';

        const topNavActions = navRoot.querySelector(':scope .top-nav-actions');
        const navContainer = navRoot.querySelector(':scope .nav-container, :scope .top-nav-inner');
        if (topNavActions) {
            topNavActions.insertBefore(toggleButton, primaryMenu);
        } else if (navContainer) {
            navContainer.insertBefore(toggleButton, primaryMenu);
        }
    }

    toggleButton.setAttribute('aria-controls', navId);
    toggleButton.setAttribute('aria-expanded', 'false');
    toggleButton.setAttribute('aria-label', menuToggleLabel(false));

    const closeOpenDropdowns = () => {
        navRoot.querySelectorAll('.dropdown[data-mobile-open="true"], .dropdown[data-desktop-open="true"]').forEach((dropdown) => {
            dropdown.dataset.mobileOpen = 'false';
            dropdown.dataset.desktopOpen = 'false';
            const trigger = dropdown.querySelector('.dropdown-trigger');
            if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
                trigger.setAttribute('aria-label', submenuToggleLabel(false));
            }
        });
    };

    const setMenuExpanded = (expanded, { focusTarget } = {}) => {
        menuGroups.forEach((group) => {
            group.dataset.open = expanded ? 'true' : 'false';
        });
        navRoot.dataset.menuOpen = expanded ? 'true' : 'false';
        toggleButton.setAttribute('aria-expanded', String(expanded));
        toggleButton.setAttribute('aria-label', menuToggleLabel(expanded));

        if (!expanded) {
            closeOpenDropdowns();
        }

        if (focusTarget === 'first') {
            const firstFocusable = menuGroups.flatMap((group) => getFocusableElements(group))[0];
            firstFocusable?.focus();
        } else if (focusTarget === 'toggle') {
            toggleButton.focus();
        }
    };

    toggleButton.addEventListener('click', () => {
        const expanded = toggleButton.getAttribute('aria-expanded') === 'true';
        setMenuExpanded(!expanded, { focusTarget: !expanded ? 'first' : 'toggle' });
    });

    menuGroups.forEach((group) => {
        group.addEventListener('keydown', (event) => {
            if (event.key !== 'Escape') return;

            const openDropdown = event.target.closest('.dropdown[data-mobile-open="true"], .dropdown[data-desktop-open="true"]');
            if (openDropdown) {
                event.preventDefault();
                openDropdown.dataset.mobileOpen = 'false';
                openDropdown.dataset.desktopOpen = 'false';
                const trigger = openDropdown.querySelector('.dropdown-trigger');
                if (trigger) {
                    trigger.setAttribute('aria-expanded', 'false');
                    trigger.setAttribute('aria-label', submenuToggleLabel(false));
                    trigger.focus();
                }
                return;
            }

            if (toggleButton.getAttribute('aria-expanded') === 'true') {
                event.preventDefault();
                setMenuExpanded(false, { focusTarget: 'toggle' });
            }
        });
    });

    document.addEventListener('click', (event) => {
        if (!navRoot.contains(event.target)) {
            setMenuExpanded(false);
        }
    });

    navRoot.querySelectorAll('.dropdown').forEach((dropdown, dropdownIndex) => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (!trigger || !menu) return;

        const menuId = menu.id || `${navId}-submenu-${dropdownIndex + 1}`;
        menu.id = menuId;
        dropdown.dataset.mobileOpen = 'false';
        dropdown.dataset.desktopOpen = 'false';
        trigger.setAttribute('aria-controls', menuId);
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-label', submenuToggleLabel(false));

        const setDropdownExpanded = (expanded, { focusFirstItem = false, returnFocus = false } = {}) => {
            if (mobileNavMediaQuery.matches) {
                closeOtherDropdowns(dropdown, navRoot);
                dropdown.dataset.mobileOpen = expanded ? 'true' : 'false';
            } else {
                dropdown.dataset.desktopOpen = expanded ? 'true' : 'false';
            }
            trigger.setAttribute('aria-expanded', String(expanded));
            trigger.setAttribute('aria-label', submenuToggleLabel(expanded));

            if (focusFirstItem && expanded) {
                const [firstItem] = getFocusableElements(menu);
                firstItem?.focus();
            }

            if (returnFocus) {
                trigger.focus();
            }
        };

        trigger.addEventListener('click', (event) => {
            if (!mobileNavMediaQuery.matches) {
                const expanded = trigger.getAttribute('aria-expanded') === 'true';
                setDropdownExpanded(!expanded, { focusFirstItem: !expanded });
                event.preventDefault();
                return;
            }

            event.preventDefault();
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            setDropdownExpanded(!expanded, { focusFirstItem: !expanded });
        });

        trigger.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setDropdownExpanded(true, { focusFirstItem: true });
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                setDropdownExpanded(false, { returnFocus: true });
            }
        });

        dropdown.addEventListener('mouseenter', () => {
            if (!mobileNavMediaQuery.matches) {
                setDropdownExpanded(true);
            }
        });

        dropdown.addEventListener('mouseleave', () => {
            if (!mobileNavMediaQuery.matches) {
                setDropdownExpanded(false);
            }
        });

        dropdown.addEventListener('focusout', (event) => {
            if (!dropdown.contains(event.relatedTarget)) {
                setDropdownExpanded(false);
            }
        });

        menu.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                setDropdownExpanded(false, { returnFocus: true });
            }
        });

        menu.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                if (mobileNavMediaQuery.matches) {
                    setDropdownExpanded(false);
                    setMenuExpanded(false);
                }
            });
        });
    });

    const handleViewportChange = () => {
        if (!mobileNavMediaQuery.matches) {
            menuGroups.forEach((group) => {
                group.dataset.open = 'true';
            });
            navRoot.dataset.menuOpen = 'false';
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.setAttribute('aria-label', menuToggleLabel(false));
            closeOpenDropdowns();
        } else {
            menuGroups.forEach((group) => {
                group.dataset.open = 'false';
            });
            navRoot.dataset.menuOpen = 'false';
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.setAttribute('aria-label', menuToggleLabel(false));
            closeOpenDropdowns();
        }
    };

    handleViewportChange();
    if (typeof mobileNavMediaQuery.addEventListener === 'function') {
        mobileNavMediaQuery.addEventListener('change', handleViewportChange);
    } else {
        mobileNavMediaQuery.addListener(handleViewportChange);
    }
}

// 2. Wait for the page to load, then attach the button click logic
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle-btn');

    // Bridge data-theme to the review-page .light class used by review pages
    const syncReviewTheme = (theme) => {
        if (document.body.classList.contains('review-page')) {
            document.body.classList.toggle('light', theme === 'light');
        }
    };

    // Sync on load
    syncReviewTheme(document.documentElement.getAttribute('data-theme'));

    if (toggleBtn) {
        // Function to update the emoji icon
        const updateIcon = () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            toggleBtn.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
            toggleBtn.setAttribute('aria-label', currentTheme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
        };

        // Set initial icon
        updateIcon();

        // Listen for clicks
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // Apply new theme
            document.documentElement.setAttribute('data-theme', newTheme);

            // Bridge to review-page light class
            syncReviewTheme(newTheme);

            // Dispatch event so page-specific JS can react (e.g. refresh lucide icons)
            document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: newTheme } }));

            // Save to local storage safely
            try {
                localStorage.setItem('theme', newTheme);
            } catch (error) {
                console.warn("Could not save theme to localStorage.");
            }

            // Update the button icon
            updateIcon();
        });
    }

    document.querySelectorAll('.top-nav, nav.navbar').forEach(setupGlobalNav);
});
