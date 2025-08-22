// تأثيرات خاصة بأسلوب ناسا

document.addEventListener('DOMContentLoaded', function() {
    // إنشاء تأثير النجوم المتحركة
    createStars();

    // إضافة تأثير التوهج للعناوين الرئيسية
    addGlowEffect();
});

// إنشاء تأثير النجوم المتحركة
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    // إنشاء 100 نجمة
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        // تحديد حجم النجمة بشكل عشوائي
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        // تحديد موقع النجمة بشكل عشوائي
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // تحديد تأثير التوهج بشكل عشوائي
        const delay = Math.random() * 3;
        star.style.animationDelay = delay + 's';

        starsContainer.appendChild(star);
    }
}

// إضافة تأثير التوهج للعناوين الرئيسية
function addGlowEffect() {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
        heading.classList.add('glow');
    });
}

// تحسين تأثيرات التمرير
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.main-bg');
    const speed = scrolled * 0.5;

    if (parallax) {
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// إضافة تأثير النبض للأزرار الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    const mainButtons = document.querySelectorAll('.btn-primary, .btn-success, .btn-info');
    mainButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 1.5s infinite';
        });

        button.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });
});

// إضافة نمط النبض
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(100, 150, 255, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(100, 150, 255, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(100, 150, 255, 0);
        }
    }
`;
document.head.appendChild(style);
