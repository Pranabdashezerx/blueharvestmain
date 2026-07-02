(function () {
    if (!window.matchMedia('(pointer: fine)').matches) {
        return;
    }

    // Loading screen is dark on every page — start with the white cursor immediately
    document.documentElement.classList.add('cursor-on-dark');
})();
