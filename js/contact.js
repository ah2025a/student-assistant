// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على عناصر النموذج
    const contactForm = document.getElementById('contactForm');
    const fullName = document.getElementById('fullName');
    const phoneNumber = document.getElementById('phoneNumber');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const newsletter = document.getElementById('newsletter');

    // إضافة حدث إرسال النموذج
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // الحصول على قيم المدخلات
        const name = fullName.value.trim();
        const phone = phoneNumber.value.trim();
        const emailValue = email.value.trim();
        const subjectValue = subject.value;
        const messageValue = message.value.trim();
        const newsletterValue = newsletter.checked;

        // التحقق من وجود البيانات المطلوبة
        if (name && phone && messageValue) {
            // محاكاة إرسال النموذج
            submitForm(name, phone, emailValue, subjectValue, messageValue, newsletterValue);
        }
    });

    // دالة إرسال النموذج
    function submitForm(name, phone, email, subject, message, newsletter) {
        // إنشاء رسالة تأكيد
        let confirmationMessage = 'شكراً لتواصلك معنا!\n\n';
        confirmationMessage += `تم استلام رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.\n\n`;
        confirmationMessage += `تفاصيل الرسالة:\n`;
        confirmationMessage += `الاسم: ${name}\n`;
        confirmationMessage += `رقم الهاتف: ${phone}\n`;

        if (email) {
            confirmationMessage += `البريد الإلكتروني: ${email}\n`;
        }

        confirmationMessage += `الموضوع: ${getSubjectText(subject)}\n`;
        confirmationMessage += `الرسالة: ${message}\n\n`;

        if (newsletter) {
            confirmationMessage += `تم تسجيلك في نشرتنا الإخبارية بنجاح.`;
        }

        // عرض رسالة التأكيد
        alert(confirmationMessage);

        // إعادة تعيين النموذج
        contactForm.reset();
    }

    // دالة الحصول على نص الموضوع
    function getSubjectText(subjectValue) {
        switch(subjectValue) {
            case 'general':
                return 'استفسار عام';
            case 'technical':
                return 'مشكلة تقنية';
            case 'suggestion':
                return 'اقتراح';
            case 'cooperation':
                return 'طلب تعاون';
            case 'other':
                return 'أخرى';
            default:
                return 'غير محدد';
        }
    }

    // إضافة تأثيرات حركية لبطاقات التواصل
    const contactCards = document.querySelectorAll('.card');
    contactCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // إضافة تأثيرات حركية لأيقونات وسائل التواصل الاجتماعي
    const socialIcons = document.querySelectorAll('.fab');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2)';
            this.style.transition = 'transform 0.3s ease';
        });

        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // إضافة تأثيرات حركية لروابط الأسئلة الشائعة
    const accordionButtons = document.querySelectorAll('.accordion-button');
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إضافة تأثير انتقالي سلس
            const collapse = this.nextElementSibling;
            collapse.style.transition = 'all 0.3s ease';
        });
    });
});