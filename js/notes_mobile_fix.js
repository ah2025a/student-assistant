// تعريف متغيرات عامة لعناصر النموذج
let noteForm, noteTitle, noteSubject, noteContent, noteTags, notesContainer, searchNotes, filterSubject;

// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    try {
        // الحصول على عناصر النموذج
        noteForm = document.getElementById('noteForm');
        noteTitle = document.getElementById('noteTitle');
        noteSubject = document.getElementById('noteSubject');
        noteContent = document.getElementById('noteContent');
        noteTags = document.getElementById('noteTags');
        notesContainer = document.getElementById('notesContainer');
        searchNotes = document.getElementById('searchNotes');
        filterSubject = document.getElementById('filterSubject');

        // تحميل الملاحظات من التخزين المحلي
        loadNotes();

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
                    // إضافة الملاحظة
                    addNote(title, subject, content, tags);

                    // إعادة تعيين حقول الإدخال
                    noteForm.reset();

                    // إغلاق النافذة المنبثقة
                    const modal = bootstrap.Modal.getInstance(document.getElementById('addNoteModal'));
                    if (modal) modal.hide();
                }
            });
        }

        // إضافة حدث البحث
        if (searchNotes) {
            searchNotes.addEventListener('input', function() {
                filterNotes();
            });
        }

        // إضافة حدث التصفية حسب المادة
        if (filterSubject) {
            filterSubject.addEventListener('change', function() {
                filterNotes();
            });
        }

        // تهيئة مستمعي الأحداث
        initEventListeners();

    } catch (error) {
        console.error('Error initializing notes page:', error);
    }
});

// دالة تهيئة مستمعي الأحداث
function initEventListeners() {
    try {
        // استخدام تفويض الأحداث للتعامل مع أزرار التعديل والحذف
        document.addEventListener('click', function(e) {
            // التعامل مع زر التعديل
            if (e.target.closest('.edit-note')) {
                const noteCard = e.target.closest('.note-card');
                if (noteCard) {
                    const noteId = noteCard.getAttribute('data-note-id');
                    editNote(noteId);
                }
            }

            // التعامل مع زر الحذف
            if (e.target.closest('.delete-note')) {
                const noteCard = e.target.closest('.note-card');
                if (noteCard) {
                    const noteId = noteCard.getAttribute('data-note-id');
                    deleteNote(noteId);
                }
            }
        });
    } catch (error) {
        console.error('Error initializing event listeners:', error);
    }
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
        console.error('Error adding note:', error);
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
                updateNotesChart();
            }, 100);
        }
    } catch (error) {
        console.error('Error loading notes:', error);
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

        // حذف الملاحظة الحالية
        noteCard.remove();
        saveNotes();

        // فتح النافذة المنبثقة مع تأخير بسيط
        setTimeout(() => {
            const modal = new bootstrap.Modal(document.getElementById('addNoteModal'));
            modal.show();
        }, 100);
    } catch (error) {
        console.error('Error editing note:', error);
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
                updateNotesChart();
            }, 100);
        }
    } catch (error) {
        console.error('Error deleting note:', error);
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
    } catch (error) {
        console.error('Error filtering notes:', error);
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
        console.error('Error updating notes chart:', error);
    }
}
