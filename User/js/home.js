let currentSlide = 0;
const slides = document.querySelectorAll('.slide-image');
const dotsContainer = document.getElementById('dotsContainer');
const totalSlides = slides.length;

function createDots() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            currentSlide = i;
            showSlide(currentSlide);
        });
        dotsContainer.appendChild(dot);
    }
}

function showSlide(index) {
    const dots = document.querySelectorAll('.dot');

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[index].classList.add('active');
    dots[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

let autoSlideInterval = setInterval(nextSlide, 4000);

const bannerContainer = document.querySelector('.banner-container');
bannerContainer.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
});

bannerContainer.addEventListener('mouseleave', () => {
    autoSlideInterval = setInterval(nextSlide, 4000);
});

createDots();