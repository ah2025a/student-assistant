// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة مستمعي الأحداث
    initEventListeners();
    
    // الحصول على عناصر النموذج
    const noteForm = document.getElementById('noteForm');
    const noteTitle = document.getElementById('noteTitle');
    const noteSubject = document.getElementById('noteSubject');
    const noteContent = document.getElementById('noteContent');
    const noteTags = document.getElementById('noteTags');
    const notesContainer = document.getElementById('notesContainer');
    const searchNotes = document.getElementById('searchNotes');
    const filterSubject = document.getElementById('filterSubject');

    // تحميل الملاحظات من التخزين المحلي
    loadNotes();

    // إضافة حدث إرسال النموذج
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
            modal.hide();
        }
    });

    // إضافة حدث البحث
    searchNotes.addEventListener('input', function() {
        filterNotes();
    });

    // إضافة حدث التصفية حسب المادة
    filterSubject.addEventListener('change', function() {
        filterNotes();
    });

    // دالة إضافة ملاحظة جديدة
    function addNote(title, subject, content, tags) {
        // إنشاء بطاقة الملاحظة
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-4 mb-4 note-card';
        colDiv.setAttribute('data-subject', subject);

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
        notesContainer.appendChild(colDiv);

        // إضافة معرف فريد للملاحظة
        const noteId = 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        colDiv.setAttribute('data-note-id', noteId);
        
        // إضافة أحداث الأزرار باستخدام تفويض الأحداث
        // سيتم التعامل مع هذه الأحداث في دالة initEventListeners

        // حفظ الملاحظات في التخزين المحلي
        saveNotes();

        // تحديث الرسم البياني
        updateNotesChart();
    }

    // دالة حفظ الملاحظات في التخزين المحلي
    function saveNotes() {
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
    }

    // دالة تهيئة مستمعي الأحداث
    function initEventListeners() {
        // استخدام تفويض الأحداث للتعامل مع أزرار التعديل
        document.addEventListener('click', function(e) {
            if (e.target.closest('.edit-note')) {
                const noteCard = e.target.closest('.note-card');
                if (noteCard) {
                    const noteId = noteCard.getAttribute('data-note-id');
                    editNote(noteId);
                }
            }
            
            // استخدام تفويض الأحداث للتعامل مع أزرار الحذف
            if (e.target.closest('.delete-note')) {
                const noteCard = e.target.closest('.note-card');
                if (noteCard) {
                    const noteId = noteCard.getAttribute('data-note-id');
                    deleteNote(noteId);
                }
            }
        });
    }
    
    // دالة تعديل ملاحظة
    function editNote(noteId) {
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
        noteTitle.value = title;
        noteSubject.value = subject;
        noteContent.value = content;
        noteTags.value = tags;
        
        // حذف الملاحظة الحالية
        noteCard.remove();
        saveNotes();
        updateNotesChart();
        
        // فتح النافذة المنبثقة
        const modal = new bootstrap.Modal(document.getElementById('addNoteModal'));
        modal.show();
    }
    
    // دالة حذف ملاحظة
    function deleteNote(noteId) {
        const noteCard = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
        if (!noteCard) return;
        
        if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
            noteCard.remove();
            saveNotes();
            updateNotesChart();
        }
    }
    
    // دالة تحميل الملاحظات من التخزين المحلي
    function loadNotes() {
        const savedNotes = localStorage.getItem('notes');

        if (savedNotes) {
            const notes = JSON.parse(savedNotes);

            // مسح الملاحظات الافتراضية
            notesContainer.innerHTML = '';

            // استعادة الملاحظات المحفوظة
            notes.forEach(note => {
                addNote(note.title, note.subject, note.content, note.tags);
            });

            // تحديث الرسم البياني
            updateNotesChart();
        }
    }

    // دالة تصفية الملاحظات
    function filterNotes() {
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
    }

    // دالة تحديث الرسم البياني للملاحظات
    function updateNotesChart() {
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
    }
    
    // دالة تهيئة مستمعي الأحداث
    function initEventListeners() {
        // استخدام تفويض الأحداث للتعامل مع أزرار التعديل
        document.addEventListener('click', function(e) {
            if (e.target.closest('.edit-note')) {
                const noteCard = e.target.closest('.note-card');
                if (noteCard) {
                    const noteId = noteCard.getAttribute('data-note-id');
                    editNote(noteId);
                }
            }
            
            // استخدام تفويض الأحداث للتعامل مع أزرار الحذف
            if (e.target.closest('.delete-note')) {
                const noteCard = e.target.closest('.note-card');
                if (noteCard) {
                    const noteId = noteCard.getAttribute('data-note-id');
                    deleteNote(noteId);
                }
            }
        });
    }
    
    // دالة تعديل ملاحظة
    function editNote(noteId) {
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
        noteTitle.value = title;
        noteSubject.value = subject;
        noteContent.value = content;
        noteTags.value = tags;
        
        // حذف الملاحظة الحالية
        noteCard.remove();
        saveNotes();
        updateNotesChart();
        
        // فتح النافذة المنبثقة
        const modal = new bootstrap.Modal(document.getElementById('addNoteModal'));
        modal.show();
    }
    
    // دالة حذف ملاحظة
    function deleteNote(noteId) {
        const noteCard = document.querySelector(`.note-card[data-note-id="${noteId}"]`);
        if (!noteCard) return;
        
        if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
            noteCard.remove();
            saveNotes();
            updateNotesChart();
        }
    }
});