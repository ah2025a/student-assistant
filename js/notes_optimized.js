// تعريف متغيرات عامة لعناصر النموذج
let noteForm, noteTitle, noteSubject, noteContent, noteTags, notesContainer, searchNotes, filterSubject, notesMobileView, notesAccordion;

// دالة لتحديث عرض الملاحظات بناءً على حجم الشاشة
function updateNotesView() {
    try {
        if (window.innerWidth <= 576) {
            // عرض الملاحظات في شكل أكورديون للشاشات الصغيرة
            if (notesContainer) notesContainer.classList.add('d-none');
            if (notesMobileView) notesMobileView.classList.remove('d-none');
            renderMobileNotes();
        } else {
            // عرض الملاحظات في شكل بطاقات للشاشات الكبيرة
            if (notesContainer) notesContainer.classList.remove('d-none');
            if (notesMobileView) notesMobileView.classList.add('d-none');
        }
    } catch (error) {
        console.error('Error in updateNotesView:', error);
    }
}

// دالة لعرض الملاحظات في شكل أكورديون (للهاتف المحمول)
function renderMobileNotes() {
    if (!notesAccordion) return; // تأكد من وجود العنصر

    try {
        // مسح المحتوى الحالي
        notesAccordion.innerHTML = '';

        // الحصول على جميع بطاقات الملاحظات المرئية (غير المخفية بواسطة الفلترة)
        const noteCards = document.querySelectorAll('#notesContainer .note-card:not([style*="display: none"])');

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
    } catch (error) {
        console.error('Error in renderMobileNotes:', error);
    }
}

// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة مستمعي الأحداث
    initEventListeners();

    // الحصول على عناصر النموذج
    noteForm = document.getElementById('noteForm');
    noteTitle = document.getElementById('noteTitle');
    noteSubject = document.getElementById('noteSubject');
    noteContent = document.getElementById('noteContent');
    noteTags = document.getElementById('noteTags');
    notesContainer = document.getElementById('notesContainer');
    notesMobileView = document.getElementById('notesMobileView'); // Get mobile view container
    notesAccordion = document.getElementById('notesAccordion'); // Get mobile accordion container
    searchNotes = document.getElementById('searchNotes');
    filterSubject = document.getElementById('filterSubject');

    // تحميل الملاحظات من التخزين المحلي
    loadNotes();

    // تحديث عرض الملاحظات عند تحميل الصفحة وتغيير حجمها
    updateNotesView();
    window.addEventListener('resize', debounce(updateNotesView, 200));

    // إضافة حدث زر الإلغاء
    const cancelBtn = document.getElementById('cancelEdit');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // التحقق إذا كنا في وضع التعديل
            const isEditing = noteForm.getAttribute('data-editing') === 'true';
            const noteId = noteForm.getAttribute('data-note-id');

            if (isEditing && noteId) {
                // إظهار الملاحظة المخفية
                const noteCard = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
                if (noteCard) {
                    noteCard.style.display = '';
                }

                // إعادة تعيين حالة النموذج
                noteForm.removeAttribute('data-editing');
                noteForm.removeAttribute('data-note-id');
            }

            // إعادة تعيين النموذج
            noteForm.reset();

            // إغلاق النافذة المنبثقة
            const modal = bootstrap.Modal.getInstance(document.getElementById('addNoteModal'));
            if (modal) modal.hide();
        });
    }

    // إضافة حدث إرسال النموذج
    if (noteForm) {
        noteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // الحصول على قيم المدخلات
            const title = noteTitle.value.trim();
            const subject = noteSubject.value;
            const content = noteContent.value.trim();
            const tags = noteTags.value.trim();

            // التحقق من وجود عنوان ومحتوى
            if (title && content) {
                // التحقق إذا كنا في وضع التعديل
                const isEditing = noteForm.getAttribute('data-editing') === 'true';
                const noteId = noteForm.getAttribute('data-note-id');

                if (isEditing && noteId) {
                    // تحديث الملاحظة الموجودة
                    const noteCard = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
                    if (noteCard) {
                        // تحديث محتوى الملاحظة
                        noteCard.querySelector('.card-title').textContent = title;
                        noteCard.setAttribute('data-subject', subject);
                        noteCard.querySelector('.card-text').textContent = content;

                        // تحديث الوسوم
                        const tagsContainer = noteCard.querySelector('.card-body .mt-2');
                        if (tagsContainer) {
                            tagsContainer.remove();
                        }

                        if (tags) {
                            const tagsArray = tags.split(',');
                            let tagsHtml = '<div class="mt-2">';
                            tagsArray.forEach(tag => {
                                const trimmedTag = tag.trim();
                                if (trimmedTag) {
                                    tagsHtml += `<span class="badge bg-light text-dark me-1">${trimmedTag}</span>`;
                                }
                            });
                            tagsHtml += '</div>';

                            const cardBody = noteCard.querySelector('.card-body');
                            cardBody.insertAdjacentHTML('beforeend', tagsHtml);
                        }

                        // تحديث شارة المادة
                        const subjectBadge = noteCard.querySelector('.card-header .badge');
                        if (subjectBadge) {
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

                            subjectBadge.textContent = subjectText;
                            subjectBadge.className = `badge ${subjectClass}`;
                        }

                        // إظهار الملاحظة
                        noteCard.style.display = '';
                    } else {
                        // إذا لم يتم العثور على الملاحظة، قم بإضافة ملاحظة جديدة
                        addNote(title, subject, content, tags);
                    }

                    // إعادة تعيين حالة النموذج
                    noteForm.removeAttribute('data-editing');
                    noteForm.removeAttribute('data-note-id');
                } else {
                    // إضافة ملاحظة جديدة
                    addNote(title, subject, content, tags);
                }

                // إعادة تعيين حقول الإدخال
                noteForm.reset();

                // حفظ التغييرات
                saveNotes();

                // تحديث الواجهة مع تأخير لمنع التعليق
                setTimeout(() => {
                    try {
                        updateNotesChart();
                        updateNotesView();
                    } catch (updateError) {
                        console.error('Error updating views after save:', updateError);
                    }
                }, 100);

                // إغلاق النافذة المنبثقة
                const modal = bootstrap.Modal.getInstance(document.getElementById('addNoteModal'));
                if (modal) modal.hide();
            }
        });
    }

    // إضافة حدث البحث
    if (searchNotes) {
        searchNotes.addEventListener('input', debounce(function() {
            filterNotes();
        }, 300));
    }

    // إضافة حدث التصفية حسب المادة
    if (filterSubject) {
        filterSubject.addEventListener('change', function() {
            filterNotes();
        });
    }
});

// دالة لمنع تكرار استدعاء الدوال بشكل متكرر
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// دالة تهيئة مستمعي الأحداث
function initEventListeners() {
    // استخدام تفويض الأحداث للتعامل مع أزرار التعديل والحذف في عرض البطاقات
    document.addEventListener('click', function(e) {
        try {
            if (e.target.closest('.edit-note')) {
                const noteCard = e.target.closest('.note-card');
                if (noteCard) {
                    const noteId = noteCard.getAttribute('data-note-id');
                    editNote(noteId);
                }
            }

            if (e.target.closest('.delete-note')) {
                const noteCard = e.target.closest('.note-card');
                if (noteCard) {
                    const noteId = noteCard.getAttribute('data-note-id');
                    deleteNote(noteId);
                }
            }

            // استخدام تفويض الأحداث للتعامل مع أزرار التعديل والحذف في عرض الهاتف المحمول (الأكورديون)
            if (e.target.closest('.edit-note-mobile')) {
                const noteId = e.target.closest('.edit-note-mobile').getAttribute('data-note-id');
                if (typeof editNote === 'function') {
                    editNote(noteId);
                }
            }

            if (e.target.closest('.delete-note-mobile')) {
                const noteId = e.target.closest('.delete-note-mobile').getAttribute('data-note-id');
                if (typeof deleteNote === 'function') {
                    deleteNote(noteId);
                }
            }
        } catch (error) {
            console.error('Error in event listener:', error);
        }
    });
}

// دالة إضافة ملاحظة جديدة
function addNote(title, subject, content, tags) {
    try {
        // إنشاء بطاقة الملاحظة
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-4 mb-4 note-card';
        colDiv.setAttribute('data-subject', subject);

        // إضافة معرف فريد للملاحظة
        const noteId = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        colDiv.setAttribute('data-note-id', noteId);

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

        // تنسيق الوسوم
        let tagsHtml = '';
        if (tags) {
            const tagsArray = tags.split(',');
            tagsHtml = '<div class="mt-2">';
            tagsArray.forEach(tag => {
                const trimmedTag = tag.trim();
                if (trimmedTag) {
                    tagsHtml += `<span class="badge bg-light text-dark me-1">${trimmedTag}</span>`;
                }
            });
            tagsHtml += '</div>';
        }

        // الحصول على التاريخ الحالي
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // إنشاء محتوى البطاقة
        colDiv.innerHTML = `
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span class="badge ${subjectClass}">${subjectText}</span>
                    <div>
                        <button class="btn btn-sm btn-outline-secondary edit-note">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-note">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${content}</p>
                    ${tagsHtml}
                </div>
                <div class="card-footer text-muted">
                    <small>تاريخ الإضافة: ${formattedDate}</small>
                </div>
            </div>
        `;

        // إضافة البطاقة إلى الحاوية
        if (notesContainer) {
            notesContainer.appendChild(colDiv);
        }

        // حفظ الملاحظات في التخزين المحلي
        saveNotes();

        // تحديث الرسم البياني
        updateNotesChart();
    } catch (error) {
        console.error('Error in addNote:', error);
    }
}

// دالة حفظ الملاحظات في التخزين المحلي
function saveNotes() {
    try {
        const notes = [];
        const noteCards = document.querySelectorAll('.note-card');

        noteCards.forEach(card => {
            const subject = card.getAttribute('data-subject');
            const title = card.querySelector('.card-title').textContent;
            const content = card.querySelector('.card-text').textContent;

            // استخراج الوسوم
            let tags = '';
            const tagsElements = card.querySelectorAll('.badge.bg-light');
            if (tagsElements.length > 0) {
                const tagsArray = [];
                tagsElements.forEach(tag => {
                    tagsArray.push(tag.textContent);
                });
                tags = tagsArray.join(',');
            }

            notes.push({
                title: title,
                subject: subject,
                content: content,
                tags: tags
            });
        });

        localStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
        console.error('Error saving notes:', error);
    }
}

// دالة تحميل الملاحظات من التخزين المحلي
function loadNotes() {
    try {
        const savedNotes = localStorage.getItem('notes');

        if (savedNotes && notesContainer) {
            const notes = JSON.parse(savedNotes);

            // مسح الملاحظات الافتراضية
            notesContainer.innerHTML = '';

            // استعادة الملاحظات المحفوظة
            notes.forEach(note => {
                addNote(note.title, note.subject, note.content, note.tags);
            });

            // تحديث الرسم البياني
            setTimeout(() => {
                try {
                    updateNotesChart();
                } catch (chartError) {
                    console.error('Error updating chart:', chartError);
                }
            }, 100);
        }
    } catch (error) {
        console.error('Error loading notes:', error);
    }
}

// دالة تصفية الملاحظات
function filterNotes() {
    try {
        if (!searchNotes || !filterSubject) return;

        const searchTerm = searchNotes.value.toLowerCase();
        const subjectFilter = filterSubject.value;

        const noteCards = document.querySelectorAll('.note-card');

        noteCards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const content = card.querySelector('.card-text').textContent.toLowerCase();
            const subject = card.getAttribute('data-subject');

            // التحقق من تطابق البحث والتصفية
            const matchesSearch = title.includes(searchTerm) || content.includes(searchTerm);
            const matchesSubject = subjectFilter === 'all' || subject === subjectFilter;

            // إظهار أو إخفاء البطاقة
            if (matchesSearch && matchesSubject) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        // تحديث عرض الهاتف المحمول بعد الفلترة
        if (window.innerWidth <= 576) {
            renderMobileNotes();
        }
    } catch (error) {
        console.error('Error in filterNotes:', error);
    }
}

// دالة تعديل ملاحظة
function editNote(noteId) {
    try {
        const noteCard = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
        if (!noteCard) return;

        const title = noteCard.querySelector('.card-title').textContent;
        const subject = noteCard.getAttribute('data-subject');
        const content = noteCard.querySelector('.card-text').textContent;

        // استخراج الوسوم
        let tags = '';
        const tagsElements = noteCard.querySelectorAll('.badge.bg-light');
        if (tagsElements.length > 0) {
            const tagsArray = [];
            tagsElements.forEach(tag => {
                tagsArray.push(tag.textContent);
            });
            tags = tagsArray.join(',');
        }

        // تعبئة النموذج ببيانات الملاحظة
        if (noteTitle) noteTitle.value = title;
        if (noteSubject) noteSubject.value = subject;
        if (noteContent) noteContent.value = content;
        if (noteTags) noteTags.value = tags;

        // تعيين خاصية للنموذج للإشارة إلى أننا في وضع التعديل
        if (noteForm) {
            noteForm.setAttribute('data-editing', 'true');
            noteForm.setAttribute('data-note-id', noteId);

            // إخفاء الملاحظة مؤقتاً (سيتم استعادتها إذا تم إلغاء التعديل)
            noteCard.style.display = 'none';

            // فتح النافذة المنبثقة مع تأخير بسيط لضمان تحديث الواجهة
            setTimeout(() => {
                try {
                    const modal = new bootstrap.Modal(document.getElementById('addNoteModal'));
                    modal.show();
                } catch (modalError) {
                    console.error('Error showing modal:', modalError);
                }
            }, 100);
        }
    } catch (error) {
        console.error('Error in editNote:', error);
    }
}

// دالة حذف ملاحظة
function deleteNote(noteId) {
    try {
        const noteCard = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
        if (!noteCard) return;

        if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
            noteCard.remove();
            saveNotes();
            setTimeout(() => {
                try {
                    updateNotesChart();
                    updateNotesView();
                } catch (updateError) {
                    console.error('Error updating views after delete:', updateError);
                }
            }, 100);
        }
    } catch (error) {
        console.error('Error in deleteNote:', error);
    }
}

// دالة تحديث الرسم البياني للملاحظات
function updateNotesChart() {
    try {
        // حساب عدد الملاحظات حسب المادة
        const subjectsCount = {
            math: 0,
            science: 0,
            arabic: 0,
            english: 0,
            history: 0,
            other: 0
        };

        const noteCards = document.querySelectorAll('.note-card');

        noteCards.forEach(card => {
            const subject = card.getAttribute('data-subject');
            if (subjectsCount.hasOwnProperty(subject)) {
                subjectsCount[subject]++;
            } else {
                subjectsCount.other++;
            }
        });

        // الحصول على عنصر الرسم البياني
        const ctx = document.getElementById('notesChart');
        if (!ctx) return;

        // التحقق من وجود رسم بياني سابق وتدميره
        if (window.notesChartInstance) {
            window.notesChartInstance.destroy();
        }

        // إنشاء رسم بياني جديد
        window.notesChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['الرياضيات', 'العلوم', 'اللغة العربية', 'اللغة الإنجليزية', 'التاريخ', 'أخرى'],
                datasets: [{
                    label: 'عدد الملاحظات',
                    data: [
                        subjectsCount.math,
                        subjectsCount.science,
                        subjectsCount.arabic,
                        subjectsCount.english,
                        subjectsCount.history,
                        subjectsCount.other
                    ],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'توزيع الملاحظات حسب المادة'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error in updateNotesChart:', error);
    }
}
