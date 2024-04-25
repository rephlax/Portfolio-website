document.querySelector("#toggle-theme").addEventListener("click", () => {
    document.documentElement.classList.toggle("light-theme");
});

const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

if (prefersLight) {
    document.documentElement.classList.add("light-theme");
}

const button = document.getElementById('nav-button');
        const sections = document.querySelectorAll('section');
        let currentSectionIndex = 0;

        // Function to navigate to the next section
        function navigateToNextSection() {
            currentSectionIndex = (currentSectionIndex + 1) % sections.length;
            sections[currentSectionIndex].scrollIntoView({ behavior: 'smooth' });
            
            // Check if we are at the last section and rotate the button if so
            if (currentSectionIndex === sections.length - 1) {
                button.classList.add('rotate');
            } else {
                button.classList.remove('rotate');
            }
        }

        // Attach event listener to the button
        button.addEventListener('click', navigateToNextSection);

        // Check for the current section and update the currentSectionIndex
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    currentSectionIndex = Array.from(sections).findIndex(section => section.id === id);
                    
                    // Rotate the button if we are at the last section
                    if (currentSectionIndex === sections.length - 1) {
                        button.classList.add('rotate');
                    } else {
                        button.classList.remove('rotate');
                    }
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        });

        // Observe each section
        sections.forEach(section => observer.observe(section));