document.addEventListener('DOMContentLoaded', async () => {
    const scriptElement = document.currentScript || document.querySelector('script[data-site-root][src*="nav-include.js"], script[src$="nav-include.js"], script[src*="/nav-include.js"]');
    const siteRoot = scriptElement?.dataset.siteRoot ?? './';
    const navHost = document.querySelector('[data-site-nav]');

    if (!navHost) {
        return;
    }

    try {
        const response = await fetch(`${siteRoot}partials/site-nav.html`);
        if (!response.ok) {
            throw new Error(`Failed to load nav partial: ${response.status}`);
        }

        const navMarkup = (await response.text()).replaceAll('{{ROOT}}', siteRoot);
        navHost.innerHTML = navMarkup;
        document.dispatchEvent(new CustomEvent('siteNavLoaded'));
    } catch (error) {
        console.warn('Unable to load global site navigation.', error);
    }
});
