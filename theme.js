const mobileNavMediaQuery = window.matchMedia('(max-width: 768px)');

const menuToggleLabel = (expanded) => expanded ? 'Close navigation menu' : 'Open navigation menu';
const submenuToggleLabel = (expanded) => expanded ? 'Close submenu' : 'Open submenu';

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
            event.preventDefault();
            const expanded = trigger.getAttribute('aria-expanded') === 'true';
            setDropdownExpanded(!expanded);
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
            if (mobileNavMediaQuery.matches) return;

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

const math130FallSchedule = [
    ['Week 1', 'Aug 24', 'Mon', 'Intro; initial knowledge check and ALEKS setup complete'],
    ['Week 1', 'Aug 26', 'Wed', 'Targeted Chapter R review'],
    ['Week 1', 'Aug 28', 'Fri', 'Chapter R review and paper practice'],
    ['Week 2', 'Aug 31', 'Mon', 'Chapter R review'],
    ['Week 2', 'Sep 2', 'Wed', '1.1-1.2; Canvas due 2:10 PM: R.1-R.3, R.4-R.5, Quiz 1'],
    ['Week 2', 'Sep 4', 'Fri', '1.2'],
    ['Week 3', 'Sep 7', 'Mon', '1.4'],
    ['Week 3', 'Sep 9', 'Wed', '2.1; Canvas due 2:10 PM: R.6, 1.1/1.2/1.4, Quiz 2'],
    ['Week 3', 'Sep 11', 'Fri', '2.2'],
    ['Week 4', 'Sep 14', 'Mon', '2.4'],
    ['Week 4', 'Sep 16', 'Wed', '2.5; Canvas due 2:10 PM: 2.1/2.2/2.4, Quiz 3'],
    ['Week 4', 'Sep 18', 'Fri', '3.1'],
    ['Week 5', 'Sep 21', 'Mon', 'Review; Canvas due 2:10 PM: Quiz 4'],
    ['Week 5', 'Sep 23', 'Wed', 'Canvas due 2:10 PM: 2.5/3.1, Test 1'],
    ['Week 5', 'Sep 25', 'Fri', '4.2'],
    ['Week 6', 'Sep 28', 'Mon', '4.2'],
    ['Week 6', 'Sep 30', 'Wed', '4.3; Canvas due 2:10 PM: 4.2, Quiz 5'],
    ['Week 6', 'Oct 2', 'Fri', '4.3'],
    ['Week 7', 'Oct 5', 'Mon', 'Geometry: Polygon'],
    ['Week 7', 'Oct 7', 'Wed', 'Geometry: Polygon; Canvas due 2:10 PM: 4.3, Quiz 6'],
    ['Week 7', 'Oct 9', 'Fri', 'Geometry: Polygon'],
    ['Week 8', 'Oct 12', 'Mon', 'Geometry: Polygon'],
    ['Week 8', 'Oct 14', 'Wed', 'Geometry: Circles; Canvas due 2:10 PM: Quiz 7'],
    ['Week 8', 'Oct 16', 'Fri', 'Fall Break'],
    ['Week 9', 'Oct 19', 'Mon', 'Geometry: Circles'],
    ['Week 9', 'Oct 21', 'Wed', 'Geometry: Circles; Canvas due 2:10 PM: Quiz 8'],
    ['Week 9', 'Oct 23', 'Fri', 'Geometry: Circles'],
    ['Week 10', 'Oct 26', 'Mon', 'Geometry: Circles'],
    ['Week 10', 'Oct 28', 'Wed', 'Test 2 review; Canvas due 2:10 PM: Quiz 9'],
    ['Week 10', 'Oct 30', 'Fri', 'Canvas due 2:10 PM: Geometry, Test 2'],
    ['Week 11', 'Nov 2', 'Mon', '5.1'],
    ['Week 11', 'Nov 4', 'Wed', '5.2'],
    ['Week 11', 'Nov 6', 'Fri', '5.2'],
    ['Week 12', 'Nov 9', 'Mon', '5.3'],
    ['Week 12', 'Nov 11', 'Wed', '5.3; Canvas due 2:10 PM: 5.1/5.2 and Quiz 10'],
    ['Week 12', 'Nov 13', 'Fri', '5.3'],
    ['Week 13', 'Nov 16', 'Mon', '5.7, 7.1'],
    ['Week 13', 'Nov 18', 'Wed', '7.1; Canvas due 2:10 PM: 5.3/5.7, Quiz 11'],
    ['Week 13', 'Nov 20', 'Fri', '7.1'],
    ['Break', 'Nov 23', 'Mon', 'Thanksgiving Break'],
    ['Break', 'Nov 25', 'Wed', 'Thanksgiving Break'],
    ['Break', 'Nov 27', 'Fri', 'Thanksgiving Break'],
    ['Week 14', 'Nov 30', 'Mon', '8.4; Canvas due 2:10 PM: 7.1'],
    ['Week 14', 'Dec 2', 'Wed', '8.4; Canvas due 2:10 PM: 8.4, Quiz 12'],
    ['Week 14', 'Dec 4', 'Fri', 'Applications'],
    ['Week 15', 'Dec 7', 'Mon', 'Review; Canvas due 2:10 PM: Quiz 13'],
    ['Week 15', 'Dec 9', 'Wed', 'Canvas due 2:10 PM: Test 3'],
    ['Week 15', 'Dec 11', 'Fri', 'Review'],
    ['Finals', 'Dec 14', 'Mon', 'Canvas due 1:00 PM: Final Exam']
];

const math130CanvasDueDates = [
    ['2026-09-02T14:10:00', 'Sep 2 at 2:10 PM', 'R.1-R.3, R.4-R.5, and Quiz 1'],
    ['2026-09-09T14:10:00', 'Sep 9 at 2:10 PM', 'R.6, 1.1/1.2/1.4, and Quiz 2'],
    ['2026-09-16T14:10:00', 'Sep 16 at 2:10 PM', '2.1/2.2/2.4 and Quiz 3'],
    ['2026-09-21T14:10:00', 'Sep 21 at 2:10 PM', 'Quiz 4'],
    ['2026-09-23T14:10:00', 'Sep 23 at 2:10 PM', '2.5/3.1 and Test 1'],
    ['2026-09-30T14:10:00', 'Sep 30 at 2:10 PM', '4.2 and Quiz 5'],
    ['2026-10-07T14:10:00', 'Oct 7 at 2:10 PM', '4.3 and Quiz 6'],
    ['2026-10-14T14:10:00', 'Oct 14 at 2:10 PM', 'Quiz 7'],
    ['2026-10-21T14:10:00', 'Oct 21 at 2:10 PM', 'Quiz 8'],
    ['2026-10-28T14:10:00', 'Oct 28 at 2:10 PM', 'Quiz 9'],
    ['2026-10-30T14:10:00', 'Oct 30 at 2:10 PM', 'Geometry and Test 2'],
    ['2026-11-11T14:10:00', 'Nov 11 at 2:10 PM', '5.1/5.2 and Quiz 10'],
    ['2026-11-18T14:10:00', 'Nov 18 at 2:10 PM', '5.3/5.7 and Quiz 11'],
    ['2026-11-30T14:10:00', 'Nov 30 at 2:10 PM', '7.1'],
    ['2026-12-02T14:10:00', 'Dec 2 at 2:10 PM', '8.4 and Quiz 12'],
    ['2026-12-07T14:10:00', 'Dec 7 at 2:10 PM', 'Quiz 13'],
    ['2026-12-09T14:10:00', 'Dec 9 at 2:10 PM', 'Test 3'],
    ['2026-12-14T13:00:00', 'Dec 14 at 1:00 PM', 'Final Exam']
];

const math130FallUnits = [
    {
        key: 'unit1',
        label: 'Unit 1 / Test 1',
        dates: 'Aug 24-Sep 23',
        assessment: 'Test 1: Sep 23',
        href: '/130Test1.html',
        title: 'Foundations, algebra, functions, and coordinate skills',
        topics: 'Intro; Chapter R review; 1.1-1.2; 1.4; 2.1; 2.2; 2.4; 2.5; 3.1; Quizzes 1-4; review.',
        range: [0, 13]
    },
    {
        key: 'unit2',
        label: 'Unit 2 / Test 2',
        dates: 'Sep 25-Oct 30',
        assessment: 'Test 2: Oct 30',
        href: '/130Test2.html',
        title: 'Interest, logarithms, polygons, and circles',
        topics: '4.2; 4.3; polygon geometry; circle geometry; Quizzes 5-9; review.',
        range: [14, 29]
    },
    {
        key: 'unit3',
        label: 'Unit 3 / Test 3',
        dates: 'Nov 2-Dec 9',
        assessment: 'Test 3: Dec 9',
        href: '/130Test3.html',
        title: 'Trigonometry, applications, and vectors',
        topics: '5.1; 5.2; 5.3; 5.7; 7.1; Thanksgiving break; 8.4; applications; Quizzes 10-13; review.',
        range: [30, 46]
    },
    {
        key: 'final',
        label: 'Final Exam Review',
        dates: 'Dec 11-Dec 14',
        assessment: 'Final Exam: Dec 14',
        href: '/130Test4.html',
        title: 'Cumulative final exam preparation',
        topics: 'Final review day, cumulative organization, formula recall, and targeted practice.',
        range: [47, 48]
    }
];

const math130FallPageMap = {
    '/courses/math130.html': { type: 'dashboard', key: 'dashboard', title: 'MATH 130 Dashboard' },
    '/130Test1.html': { type: 'unit', key: 'unit1', title: 'Test 1 Study Guide', prev: '/courses/math130.html', next: '/130Test2.html' },
    '/130Test2.html': { type: 'unit', key: 'unit2', title: 'Test 2 Review', prev: '/130Test1.html', next: '/130Test3.html' },
    '/130Test3.html': { type: 'unit', key: 'unit3', title: 'Test 3 Study Guide', prev: '/130Test2.html', next: '/130Test4.html' },
    '/130Test4.html': { type: 'unit', key: 'final', title: 'Final Exam Practice Lab', prev: '/130Test3.html', next: '/math130_final_lecture.html', finalPage: true },
    '/130Q10.html': { type: 'support', key: 'unit3', title: 'Quiz 10 Notes', prev: '/130Test3.html', next: '/130quiz10.html' },
    '/130quiz10.html': { type: 'support', key: 'unit3', title: 'Quiz 10 Practice', prev: '/130Q10.html', next: '/130Test3.html' },
    '/math130_final_lecture.html': { type: 'support', key: 'final', title: 'Final Exam Lecture Prep', prev: '/130Test4.html', next: '/courses/math130.html', finalPage: true }
};

function getMath130PageConfig() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    return math130FallPageMap[path] || null;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
    }[char]));
}

function replaceVisibleText(root, replacements) {
    const skipTags = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'KBD', 'SAMP']);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            const parent = node.parentElement;
            if (!parent || skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
            if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
        let text = node.nodeValue;
        replacements.forEach(([from, to]) => {
            text = text.split(from).join(to);
        });
        node.nodeValue = text;
    });
}

function showMathRuntimeWarning(message) {
    const existingWarning = document.querySelector('.math-runtime-warning');
    if (existingWarning) {
        existingWarning.textContent = message;
        return;
    }

    const warning = document.createElement('div');
    warning.className = 'math-runtime-warning';
    warning.setAttribute('role', 'status');
    warning.textContent = message;
    warning.style.cssText = [
        'margin: 1rem auto',
        'padding: 0.85rem 1rem',
        'max-width: min(100% - 2rem, 980px)',
        'border: 1px solid #f59e0b',
        'border-radius: 0.65rem',
        'background: #fff7ed',
        'color: #7c2d12',
        'font-weight: 700',
        'line-height: 1.4'
    ].join(';');

    const header = document.querySelector('.review-page-header, .page-shell-header, .course-header, .page-hero, .math-review-page > header, .page > header');
    if (header) {
        header.insertAdjacentElement('afterend', warning);
        return;
    }

    const target = document.querySelector('main, .math-review-page, .page, .container, #app-container');
    if (target) {
        target.prepend(warning);
        return;
    }

    document.body.prepend(warning);
}

window.showMathRuntimeWarning = window.showMathRuntimeWarning || showMathRuntimeWarning;

function ensureMath130FallStyles() {
    if (document.getElementById('math130-fall-2026-styles')) return;
    const style = document.createElement('style');
    style.id = 'math130-fall-2026-styles';
    style.textContent = `
        .math130-fall-flow {
            box-sizing: border-box;
            width: 100%;
            max-width: var(--site-content-width, min(1180px, calc(100vw - 2rem)));
            margin: clamp(1.5rem, 4vw, 2.5rem) auto;
            padding: clamp(1.1rem, 2.4vw, 1.6rem);
            border: 1px solid var(--border-subtle, #e2e8f0);
            border-radius: var(--site-card-radius, 0.75rem);
            background: linear-gradient(180deg, var(--bg-surface, #fff), color-mix(in srgb, var(--primary-main, #2563eb) 6%, var(--bg-surface, #fff)));
            box-shadow: var(--site-shadow-soft, 0 18px 40px rgba(15, 23, 42, 0.08));
            color: var(--text-main, #0f172a);
        }
        .math130-fall-flow--compact {
            margin-top: 1.25rem;
            margin-bottom: 1.25rem;
        }
        .math130-fall-flow__header {
            display: grid;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }
        .math130-fall-flow__kicker {
            margin: 0;
            color: var(--primary-main, #2563eb);
            font-family: var(--type-meta-family, inherit);
            font-size: 0.78rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
        }
        .math130-fall-flow h2,
        .math130-fall-flow h3 {
            margin-top: 0;
        }
        .math130-fall-flow__lede {
            margin: 0;
            color: var(--text-muted, #64748b);
            max-width: 76ch;
        }
        .math130-fall-flow__notice {
            display: grid;
            gap: 0.4rem;
            margin-bottom: 1rem;
            padding: 0.9rem 1rem;
            border-left: 4px solid var(--primary-main, #2563eb);
            border-radius: 0.6rem;
            background: color-mix(in srgb, var(--primary-main, #2563eb) 8%, var(--bg-surface, #fff));
        }
        .math130-fall-flow__notice p {
            margin: 0;
        }
        .math130-fall-flow__notice-label {
            color: var(--primary-main, #2563eb);
            font-size: 0.78rem;
            font-weight: 800;
            letter-spacing: 0.06em;
            text-transform: uppercase;
        }
        .math130-fall-flow__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr));
            gap: 1rem;
        }
        .math130-fall-flow__card {
            display: grid;
            gap: 0.55rem;
            padding: 1rem;
            border: 1px solid var(--border-subtle, #e2e8f0);
            border-radius: 0.75rem;
            background: var(--bg-surface, #fff);
        }
        .math130-fall-flow__meta,
        .math130-fall-flow__assessment {
            color: var(--text-muted, #64748b);
            font-size: 0.88rem;
            font-weight: 700;
        }
        .math130-fall-flow__topics {
            color: var(--text-muted, #64748b);
            line-height: 1.55;
        }
        .math130-fall-flow__actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.65rem;
            margin-top: 1rem;
        }
        .math130-fall-flow__link {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 42px;
            padding: 0.55rem 0.9rem;
            border-radius: 0.65rem;
            background: var(--primary-main, #2563eb);
            color: #fff;
            font-weight: 700;
            text-decoration: none;
        }
        .math130-fall-flow__link--secondary {
            background: transparent;
            color: var(--primary-main, #2563eb);
            border: 1px solid color-mix(in srgb, var(--primary-main, #2563eb) 45%, var(--border-subtle, #e2e8f0));
        }
        .math130-fall-flow details {
            margin-top: 1rem;
        }
        .math130-fall-flow summary {
            cursor: pointer;
            color: var(--primary-main, #2563eb);
            font-weight: 800;
        }
        .math130-fall-flow__table-wrap {
            overflow-x: auto;
            margin-top: 0.8rem;
            border: 1px solid var(--border-subtle, #e2e8f0);
            border-radius: 0.75rem;
        }
        .math130-fall-flow__table {
            width: 100%;
            border-collapse: collapse;
            min-width: 620px;
            background: var(--bg-surface, #fff);
        }
        .math130-fall-flow__table th,
        .math130-fall-flow__table td {
            padding: 0.65rem 0.8rem;
            border-bottom: 1px solid var(--border-subtle, #e2e8f0);
            text-align: left;
            vertical-align: top;
        }
        .math130-fall-flow__table th {
            font-size: 0.78rem;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: var(--text-muted, #64748b);
        }
        .math130-fall-flow__table tr:last-child td {
            border-bottom: 0;
        }
        .math130-fall-flow__table tr[data-assessment="true"] td {
            font-weight: 700;
        }
        .math130-fall-flow__table tr[data-quiz="true"] td {
            color: var(--primary-main, #2563eb);
        }
        .math130-fall-flow__table tr[data-major-assessment="true"] td {
            font-weight: 800;
            color: var(--danger-main, #b91c1c);
        }
        .math130-fall-flow__table tr[data-break="true"] td {
            color: var(--warning-main, #d97706);
            font-weight: 700;
        }
        .math130-fall-flow__mini-schedule {
            margin: 0.8rem 0 0;
            padding-left: 1.25rem;
            color: var(--text-muted, #64748b);
            line-height: 1.55;
        }
        @media (max-width: 720px) {
            .math130-fall-flow {
                width: min(100vw - 1rem, 100%);
                border-radius: 0.65rem;
            }
            .math130-fall-flow__actions {
                flex-direction: column;
            }
            .math130-fall-flow__link {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

function math130RowsForUnit(unit) {
    if (!unit.range) return [];
    return math130FallSchedule.slice(unit.range[0], unit.range[1] + 1);
}

function buildMath130UnitCard(unit) {
    return `
        <article class="math130-fall-flow__card">
            <div class="math130-fall-flow__meta">${escapeHtml(unit.label)} | ${escapeHtml(unit.dates)}</div>
            <h3>${escapeHtml(unit.title)}</h3>
            <p class="math130-fall-flow__assessment">${escapeHtml(unit.assessment)}</p>
            <p class="math130-fall-flow__topics">${escapeHtml(unit.topics)}</p>
            <a class="math130-fall-flow__link" href="${escapeHtml(unit.href)}">Open ${escapeHtml(unit.label)}</a>
        </article>`;
}

function buildMath130ScheduleTable(rows = math130FallSchedule) {
    const body = rows.map(([week, date, day, topic]) => {
        const quiz = /Quiz/.test(topic);
        const majorAssessment = /Canvas due.*(?:Test [123]|Final Exam)/.test(topic);
        const assessment = quiz || majorAssessment;
        const breakRow = /Break/.test(topic);
        return `<tr data-assessment="${assessment ? 'true' : 'false'}" data-quiz="${quiz ? 'true' : 'false'}" data-major-assessment="${majorAssessment ? 'true' : 'false'}" data-break="${breakRow ? 'true' : 'false'}"><td>${escapeHtml(week)}</td><td>${escapeHtml(date)}</td><td>${escapeHtml(day)}</td><td>${escapeHtml(topic)}</td></tr>`;
    }).join('');
    return `
        <div class="math130-fall-flow__table-wrap">
            <table class="math130-fall-flow__table">
                <thead><tr><th>Week</th><th>Date</th><th>Day</th><th>Topic / Assignment</th></tr></thead>
                <tbody>${body}</tbody>
            </table>
        </div>`;
}

function getMath130NextCanvasDue(now = new Date()) {
    return math130CanvasDueDates.find(([isoDate]) => new Date(isoDate) >= now) || null;
}

function buildMath130DashboardFlow() {
    const section = document.createElement('section');
    section.id = 'math130-fall-2026-flow';
    section.className = 'math130-fall-flow';
    section.setAttribute('aria-labelledby', 'math130-fall-2026-flow-title');
    const nextDue = getMath130NextCanvasDue();
    const nextDueCopy = nextDue
        ? `<strong>Next Canvas master deadline:</strong> ${escapeHtml(nextDue[1])} - ${escapeHtml(nextDue[2])}.`
        : '<strong>All listed Fall 2026 Canvas deadlines have passed.</strong>';
    section.innerHTML = `
        <div class="math130-fall-flow__header">
            <p class="math130-fall-flow__kicker">Fall 2026 Semester Flow</p>
            <h2 id="math130-fall-2026-flow-title">Follow the course by assessment window.</h2>
            <p class="math130-fall-flow__lede">Canvas supplies the master due dates and times. Quiz and test coverage remains subject to the current Canvas instructions and in-class announcements.</p>
        </div>
        <div class="math130-fall-flow__notice" role="status">
            <p class="math130-fall-flow__notice-label">Start here</p>
            <p><strong>Day one is complete:</strong> the class finished the initial knowledge check and set up modular ALEKS learning accounts.</p>
            <p>${nextDueCopy}</p>
        </div>
        <div class="math130-fall-flow__grid">
            ${math130FallUnits.map(buildMath130UnitCard).join('')}
        </div>
        <details>
            <summary>Show the full Fall 2026 meeting calendar</summary>
            ${buildMath130ScheduleTable()}
        </details>`;
    return section;
}

function buildMath130PageFlow(config) {
    const unit = math130FallUnits.find((entry) => entry.key === config.key);
    if (!unit) return null;
    const rows = math130RowsForUnit(unit);
    const section = document.createElement('section');
    section.id = 'math130-fall-2026-flow';
    section.className = 'math130-fall-flow math130-fall-flow--compact';
    section.setAttribute('aria-labelledby', 'math130-fall-2026-flow-title');
    const rowList = rows.map(([, date, day, topic]) => `<li><strong>${escapeHtml(date)} (${escapeHtml(day)}):</strong> ${escapeHtml(topic)}</li>`).join('');
    section.innerHTML = `
        <div class="math130-fall-flow__header">
            <p class="math130-fall-flow__kicker">Fall 2026 MATH 130 Flow</p>
            <h2 id="math130-fall-2026-flow-title">${escapeHtml(config.title)} fits in ${escapeHtml(unit.label)}.</h2>
            <p class="math130-fall-flow__lede"><strong>${escapeHtml(unit.dates)}:</strong> ${escapeHtml(unit.topics)} <strong>${escapeHtml(unit.assessment)}.</strong></p>
            <p class="math130-fall-flow__lede">Dates and times follow the Canvas assignment list. Confirm quiz and test coverage in Canvas or in class.</p>
        </div>
        <ul class="math130-fall-flow__mini-schedule">${rowList}</ul>
        <div class="math130-fall-flow__actions">
            <a class="math130-fall-flow__link" href="/courses/math130.html">Back to MATH 130 Dashboard</a>
            ${config.prev ? `<a class="math130-fall-flow__link math130-fall-flow__link--secondary" href="${escapeHtml(config.prev)}">Previous</a>` : ''}
            ${config.next ? `<a class="math130-fall-flow__link math130-fall-flow__link--secondary" href="${escapeHtml(config.next)}">Next</a>` : ''}
        </div>`;
    return section;
}

function insertMath130FallFlow(config) {
    if (document.getElementById('math130-fall-2026-flow')) return;
    const flow = config.type === 'dashboard' ? buildMath130DashboardFlow() : buildMath130PageFlow(config);
    if (!flow) return;

    if (config.type === 'dashboard') {
        const main = document.querySelector('main');
        const canvasSection = document.getElementById('canvas-title')?.closest('section');
        if (canvasSection) {
            canvasSection.insertAdjacentElement('afterend', flow);
        } else if (main) {
            main.prepend(flow);
        }
        return;
    }

    const header = document.querySelector('.review-page-header, .page-shell-header, .course-header, .page-hero');
    if (header) {
        header.insertAdjacentElement('afterend', flow);
        return;
    }

    const pageHeader = document.querySelector('.page > header');
    if (pageHeader) {
        pageHeader.insertAdjacentElement('afterend', flow);
        return;
    }

    const main = document.querySelector('main, .container, #app-container, .page');
    if (main) {
        main.prepend(flow);
        return;
    }

    const firstBodyChild = Array.from(document.body.children).find((element) => !element.matches('script, style'));
    if (firstBodyChild) {
        firstBodyChild.insertAdjacentElement('beforebegin', flow);
    } else {
        document.body.prepend(flow);
    }
}

function applyMath130FallTextUpdates(config) {
    const replacements = [
        ['Spring 2026', 'Fall 2026'],
        ['Functions, equations, graphing, and technical modeling.', 'Interest, logarithms, polygons, circles, and geometry review.'],
        ['Functions, equations, and graphing', 'Interest, logarithms, and geometry'],
        ['advanced functions, equations, graphing, and specialized applications', 'interest, logarithms, polygon geometry, circle geometry, and applications'],
        ['Trigonometry, vectors, and mid-course review.', 'Trigonometry, applications, vectors, and Test 3 review.'],
        ['Unit 4 / Final Exam', 'Final Exam Review'],
        ['Open Unit 4', 'Open Final Review'],
        ['View Unit 4 Resources', 'View Final Review Resources']
    ];
    if (config.finalPage) {
        replacements.push(['Test 4 + Quiz 13 Final Prep', 'Final Exam Prep']);
        replacements.push(['Test 4 Blueprint Practice Lab', 'Final Exam Blueprint Practice Lab']);
        replacements.push(['Test 4 Practice', 'Final Exam Practice']);
        replacements.push(['Test 4', 'Final Exam']);
        replacements.push(['Quiz 13', 'cumulative review']);
    }
    replaceVisibleText(document.body, replacements);
    document.title = document.title
        .replace('Spring 2026', 'Fall 2026')
        .replace('Test 4 Blueprint Practice Lab', 'Final Exam Blueprint Practice Lab')
        .replace('Test 4 + Quiz 13', 'Final Exam')
        .replace('Test 4', config.finalPage ? 'Final Exam' : 'Test 4');
}

function setupMath130Fall2026Flow() {
    const config = getMath130PageConfig();
    if (!config) return;
    document.body.classList.add('math130-fall-2026-enhanced');
    ensureMath130FallStyles();
    applyMath130FallTextUpdates(config);
    insertMath130FallFlow(config);
}

document.addEventListener('DOMContentLoaded', setupMath130Fall2026Flow);
