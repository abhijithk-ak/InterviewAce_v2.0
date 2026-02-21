var script = document.createElement('script');
script.type = 'text/javascript';
script.onload = function() {
    // Check GitHub Wrap stats display
    setTimeout(function() {
        const cards = document.querySelectorAll('.github-stats .text-2xl');
        console.log('GitHub Stats Cards found:', cards.length);
        
        cards.forEach((card, index) => {
            const computedStyle = window.getComputedStyle(card);
            console.log(`Card ${index}:`, {
                content: card.textContent,
                color: computedStyle.color,
                backgroundColor: computedStyle.backgroundColor,
                visibility: computedStyle.visibility,
                display: computedStyle.display,
                opacity: computedStyle.opacity
            });
        });

        // Check parent containers
        const cardContainers = document.querySelectorAll('[class*="bg-neutral-800"]');
        console.log('Dark containers found:', cardContainers.length);
        
        cardContainers.forEach((container, index) => {
            const computedStyle = window.getComputedStyle(container);
            console.log(`Container ${index}:`, {
                backgroundColor: computedStyle.backgroundColor,
                color: computedStyle.color
            });
        });

    }, 2000);
};
script.src = 'about:blank';
document.head.appendChild(script);
console.log("Debug script loaded - checking GitHub Wrap visibility");