// دالة لتحديث عرض الملاحظات
function updateNotesView() {
    if (window.innerWidth <= 576) {
        // عند الشاشات الصغيرة، عرض الملاحظات كأكورديون
        renderMobileNotes();
    }
}

// دالة لعرض الملاحظات في شكل أكورديون
function renderMobileNotes() {
    // الحصول على حاوية الملاحظات
    const notesContainer = document.getElementById('notesContainer');
    const notesAccordion = document.getElementById('notesAccordion');

    // مسح المحتوى الحالي
    notesAccordion.innerHTML = '';

    // الحصول على جميع بطاقات الملاحظات
    const noteCards = document.querySelectorAll('.note-card');

    // تكرار كل بطاقة ملاحظة
    noteCards.forEach((card, index) => {
        // استخراج بيانات الملاحظة
        const noteId = card.getAttribute('data-note-id');
        const subject = card.getAttribute('data-subject');
        const title = card.querySelector('.card-title').textContent;
        const content = card.querySelector('.card-text').textContent;
        const date = card.querySelector('.card-footer small').textContent;

        // تنسيق الوسوم
        let tagsHtml = '';
        const tagsElements = card.querySelectorAll('.badge.bg-light');
        if (tagsElements.length > 0) {
            tagsElements.forEach(tag => {
                tagsHtml += `<span class="badge bg-light text-dark me-1 notes-badge">${tag.textContent}</span>`;
            });
        }

        // تحديد اسم المادة ولونها
        let subjectText = '';
        let subjectClass = '';

        switch(subject) {
            case 'math':
                subjectText = 'الرياضيات';
                subjectClass = 'bg-primary';
                break;
            case 'science':
                subjectText = 'العلوم';
                subjectClass = 'bg-success';
                break;
            case 'arabic':
                subjectText = 'اللغة العربية';
                subjectClass = 'bg-warning text-dark';
                break;
            case 'english':
                subjectText = 'اللغة الإنجليزية';
                subjectClass = 'bg-info';
                break;
            case 'history':
                subjectText = 'التاريخ';
                subjectClass = 'bg-danger';
                break;
            default:
                subjectText = 'أخرى';
                subjectClass = 'bg-secondary';
        }

        // إنشاء عنصر الأكورديون
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item notes-accordion-item';

        // إنشاء رأس الأكورديون
        const accordionHeader = document.createElement('h2');
        accordionHeader.className = 'accordion-header';
        accordionHeader.id = `heading-${noteId}`;

        const accordionButton = document.createElement('button');
        accordionButton.className = 'accordion-button collapsed notes-accordion-button';
        accordionButton.type = 'button';
        accordionButton.setAttribute('data-bs-toggle', 'collapse');
        accordionButton.setAttribute('data-bs-target', `#collapse-${noteId}`);
        accordionButton.setAttribute('aria-expanded', 'false');
        accordionButton.setAttribute('aria-controls', `collapse-${noteId}`);

        // إضافة محتوى الزر
        accordionButton.innerHTML = `
            <div class="d-flex justify-content-between align-items-center w-100">
                <span>${title}</span>
                <span class="badge ${subjectClass} notes-badge">${subjectText}</span>
            </div>
        `;

        accordionHeader.appendChild(accordionButton);
        accordionItem.appendChild(accordionHeader);

        // إنشاء محتوى الأكورديون
        const accordionCollapse = document.createElement('div');
        accordionCollapse.id = `collapse-${noteId}`;
        accordionCollapse.className = 'accordion-collapse collapse';
        accordionCollapse.setAttribute('aria-labelledby', `heading-${noteId}`);

        const accordionBody = document.createElement('div');
        accordionBody.className = 'accordion-body notes-accordion-body';

        // إضافة محتوى الجسم
        accordionBody.innerHTML = `
            <p>${content}</p>
            ${tagsHtml ? `<div class="mt-2">${tagsHtml}</div>` : ''}
            <div class="text-muted mt-2">
                <small>${date}</small>
            </div>
            <div class="notes-actions">
                <button class="btn btn-sm btn-outline-secondary edit-note-mobile" data-note-id="${noteId}">
                    <i class="fas fa-edit"></i> تعديل
                </button>
                <button class="btn btn-sm btn-outline-danger delete-note-mobile" data-note-id="${noteId}">
                    <i class="fas fa-trash"></i> حذف
                </button>
            </div>
        `;

        accordionCollapse.appendChild(accordionBody);
        accordionItem.appendChild(accordionCollapse);

        notesAccordion.appendChild(accordionItem);
    });

    // إضافة مستمعي الأحداث
    document.querySelectorAll('.edit-note-mobile').forEach(btn => {
        btn.addEventListener('click', function() {
            const noteId = this.getAttribute('data-note-id');
            // استدعاء دالة التعديل الموجودة في الملف الرئيسي
            if (typeof editNote === 'function') {
                editNote(noteId);
            }
        });
    });

    document.querySelectorAll('.delete-note-mobile').forEach(btn => {
        btn.addEventListener('click', function() {
            const noteId = this.getAttribute('data-note-id');
            // استدعاء دالة الحذف الموجودة في الملف الرئيسي
            if (typeof deleteNote === 'function') {
                deleteNote(noteId);
            }
        });
    });
}

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحديث العرض عند تغيير حجم الشاشة
    updateNotesView();
    window.addEventListener('resize', updateNotesView);

    // مراقبة التغييرات في حاوية الملاحظات
    const notesContainer = document.getElementById('notesContainer');
    if (notesContainer) {
        const observer = new MutationObserver(function(mutations) {
            updateNotesView();
        });

        observer.observe(notesContainer, { 
            childList: true,
            subtree: true
        });
    }
});