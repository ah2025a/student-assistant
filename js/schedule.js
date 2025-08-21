// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على عناصر النموذج
    const scheduleForm = document.getElementById('scheduleForm');
    const subjectName = document.getElementById('subjectName');
    const daySelect = document.getElementById('daySelect');
    const timeSelect = document.getElementById('timeSelect');
    const classLocation = document.getElementById('classLocation');
    const classNotes = document.getElementById('classNotes');

    // الحصول على عنصر الجدول للشاشات الصغيرة
    const scheduleAccordion = document.getElementById('scheduleAccordion');

    // تحميل الجدول من التخزين المحلي
    loadSchedule();

    // تحديث عرض الجدول حسب حجم الشاشة
    updateScheduleView();
    window.addEventListener('resize', updateScheduleView);

    // إضافة حدث إرسال النموذج
    scheduleForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // الحصول على قيم المدخلات
        const subject = subjectName.value.trim();
        const day = daySelect.value;
        const time = timeSelect.value;
        const location = classLocation.value.trim();
        const notes = classNotes.value.trim();

        // التحقق من وجود مادة
        if (subject) {
            // إضافة الحصة إلى الجدول
            addClassToSchedule(subject, day, time, location, notes);

            // إعادة تعيين حقول الإدخال
            scheduleForm.reset();

            // إغلاق النافذة المنبثقة
            const modal = bootstrap.Modal.getInstance(document.getElementById('addScheduleModal'));
            modal.hide();
        }
    });

        // دالة تحديث عرض الجدول حسب حجم الشاشة
    function updateScheduleView() {
        const desktopView = document.querySelector('.table-responsive.schedule-table-container');
        const mobileView = document.querySelector('.schedule-mobile-view');

        if (window.innerWidth <= 576) {
            // عرض الجدول في الشكل المناسب للشاشات الصغيرة
            if (desktopView) desktopView.classList.add('d-none');
            if (mobileView) mobileView.classList.remove('d-none');
            renderMobileSchedule();
        } else {
            // عرض الجدول في الشكل المناسب للشاشات الكبيرة
            if (desktopView) desktopView.classList.remove('d-none');
            if (mobileView) mobileView.classList.add('d-none');
        }
    }

    // دالة عرض الجدول للشاشات الصغيرة
    function renderMobileSchedule() {
        // مسح المحتوى الحالي
        scheduleAccordion.innerHTML = '';

        // أيام الأسبوع
        const days = [
            { key: 'sat', name: 'السبت' },
            { key: 'sun', name: 'الأحد' },
            { key: 'mon', name: 'الإثنين' },
            { key: 'tue', name: 'الثلاثاء' },
            { key: 'wed', name: 'الأربعاء' },
            { key: 'thu', name: 'الخميس' }
        ];

        // أوقات الحصص
        const times = [
            { key: '8-10', name: '8:00 - 10:00' },
            { key: '10-12', name: '10:00 - 12:00' },
            { key: '12-2', name: '12:00 - 2:00' },
            { key: '2-4', name: '2:00 - 4:00' },
            { key: '4-6', name: '4:00 - 6:00' }
        ];

        // إنشاء عناصر الأكورديون لكل يوم
        days.forEach(day => {
            // إنشاء عنصر الأكورديون
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item';

            // إنشاء رأس الأكورديون
            const accordionHeader = document.createElement('h2');
            accordionHeader.className = 'accordion-header';
            accordionHeader.id = `heading-${day.key}`;

            const accordionButton = document.createElement('button');
            accordionButton.className = 'accordion-button collapsed';
            accordionButton.type = 'button';
            accordionButton.setAttribute('data-bs-toggle', 'collapse');
            accordionButton.setAttribute('data-bs-target', `#collapse-${day.key}`);
            accordionButton.setAttribute('aria-expanded', 'false');
            accordionButton.setAttribute('aria-controls', `collapse-${day.key}`);
            accordionButton.textContent = day.name;

            accordionHeader.appendChild(accordionButton);
            accordionItem.appendChild(accordionHeader);

            // إنشاء محتوى الأكورديون
            const accordionCollapse = document.createElement('div');
            accordionCollapse.id = `collapse-${day.key}`;
            accordionCollapse.className = 'accordion-collapse collapse';
            accordionCollapse.setAttribute('aria-labelledby', `heading-${day.key}`);

            const accordionBody = document.createElement('div');
            accordionBody.className = 'accordion-body';

            // إضافة الحصص لكل وقت
            times.forEach(time => {
                const timeSlot = document.createElement('div');
                timeSlot.className = 'time-slot-mobile';

                const timeLabel = document.createElement('div');
                timeLabel.className = 'time-label';
                timeLabel.textContent = time.name;
                timeSlot.appendChild(timeLabel);

                // الحصول على بيانات الحصة من الجدول الأصلي
                const cellId = `${day.key}-${time.key}`;
                const cell = document.getElementById(cellId);

                if (cell && cell.innerHTML.trim() !== '') {
                    const classElement = cell.querySelector('.class-item');
                    if (classElement) {
                        const classInfo = document.createElement('div');
                        classInfo.className = 'class-info';

                        const classTitle = document.createElement('div');
                        classTitle.className = 'class-title';
                        classTitle.textContent = classElement.querySelector('.class-subject')?.textContent || '';
                        classInfo.appendChild(classTitle);

                        const classLocation = document.createElement('div');
                        classLocation.className = 'class-location';
                        classLocation.textContent = classElement.querySelector('.class-location')?.textContent || '';
                        classInfo.appendChild(classLocation);

                        const classNotes = document.createElement('div');
                        classNotes.className = 'class-notes';
                        classNotes.textContent = classElement.querySelector('.class-notes')?.textContent || '';
                        classInfo.appendChild(classNotes);

                        timeSlot.appendChild(classInfo);

                        // إضافة زر الحذف
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'btn btn-sm btn-outline-danger delete-class mt-1';
                        deleteBtn.innerHTML = '<i class="fas fa-trash"></i> حذف';
                        deleteBtn.addEventListener('click', function() {
                            if (confirm('هل أنت متأكد من حذف هذه الحصة؟')) {
                                cell.innerHTML = '';
                                saveSchedule();
                                renderMobileSchedule(); // إعادة عرض الجدول للشاشات الصغيرة
                            }
                        });
                        timeSlot.appendChild(deleteBtn);
                    }
                } else {
                    const emptySlot = document.createElement('div');
                    emptySlot.className = 'text-muted';
                    emptySlot.textContent = 'لا توجد حصة';
                    timeSlot.appendChild(emptySlot);

                    // إضافة زر إضافة حصة
                    const addBtn = document.createElement('button');
                    addBtn.className = 'btn btn-sm btn-outline-primary mt-1';
                    addBtn.innerHTML = '<i class="fas fa-plus"></i> إضافة حصة';
                    addBtn.addEventListener('click', function() {
                        // فتح النافذة المنبثقة وتعبئة الحقول
                        daySelect.value = day.key;
                        timeSelect.value = time.key;

                        const modal = new bootstrap.Modal(document.getElementById('addScheduleModal'));
                        modal.show();
                    });
                    timeSlot.appendChild(addBtn);
                }

                accordionBody.appendChild(timeSlot);
            });

            accordionCollapse.appendChild(accordionBody);
            accordionItem.appendChild(accordionCollapse);

            scheduleAccordion.appendChild(accordionItem);
        });
    }

    // دالة إضافة حصة إلى الجدول
    function addClassToSchedule(subject, day, time, location, notes) {
        // الحصول على خلية الجدول المناسبة
        const cellId = `${day}-${time}`;
        const cell = document.getElementById(cellId);

        if (cell) {
            // إنشاء محتوى الخلية
            let cellContent = `<div class="class-item">`;
            cellContent += `<div class="class-subject">${subject}</div>`;

            if (location) {
                cellContent += `<div class="class-location"><i class="fas fa-map-marker-alt"></i> ${location}</div>`;
            }

            if (notes) {
                cellContent += `<div class="class-notes"><i class="fas fa-sticky-note"></i> ${notes}</div>`;
            }

            cellContent += `<button class="btn btn-sm btn-outline-danger delete-class mt-1">
                                <i class="fas fa-times"></i>
                            </button>`;
            cellContent += `</div>`;

            // إضافة المحتوى إلى الخلية
            cell.innerHTML = cellContent;

            // إضافة حدث حذف الحصة
            const deleteBtn = cell.querySelector('.delete-class');
            deleteBtn.addEventListener('click', function() {
                if (confirm('هل أنت متأكد من حذف هذه الحصة؟')) {
                    cell.innerHTML = '';
                    saveSchedule();
                    // تحديث العرض للشاشات الصغيرة
                    if (window.innerWidth <= 576) {
                        renderMobileSchedule();
                    }
                }
            });

            // حفظ الجدول في التخزين المحلي
            saveSchedule();

            // تحديث العرض للشاشات الصغيرة
            if (window.innerWidth <= 576) {
                renderMobileSchedule();
            }
        }
    }

    // دالة حفظ الجدول في التخزين المحلي
    function saveSchedule() {
        const scheduleData = {};
        const days = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu'];
        const times = ['8-10', '10-12', '12-2', '2-4', '4-6'];

        days.forEach(day => {
            scheduleData[day] = {};

            times.forEach(time => {
                const cellId = `${day}-${time}`;
                const cell = document.getElementById(cellId);

                if (cell && cell.innerHTML.trim() !== '') {
                    // استخراج البيانات من الخلية
                    const classElement = cell.querySelector('.class-item');
                    if (classElement) {
                        const subject = classElement.querySelector('.class-subject')?.textContent || '';
                        const location = classElement.querySelector('.class-location')?.textContent.replace(/\s+/g, ' ').trim() || '';
                        const notes = classElement.querySelector('.class-notes')?.textContent.replace(/\s+/g, ' ').trim() || '';

                        scheduleData[day][time] = {
                            subject: subject,
                            location: location,
                            notes: notes
                        };
                    }
                }
            });
        });

        localStorage.setItem('schedule', JSON.stringify(scheduleData));
    }

    // دالة تحميل الجدول من التخزين المحلي
    function loadSchedule() {
        const savedSchedule = localStorage.getItem('schedule');

        if (savedSchedule) {
            const scheduleData = JSON.parse(savedSchedule);

            // استعادة الحصص المحفوظة
            Object.keys(scheduleData).forEach(day => {
                Object.keys(scheduleData[day]).forEach(time => {
                    const classData = scheduleData[day][time];
                    if (classData.subject) {
                        addClassToSchedule(
                            classData.subject,
                            day,
                            time,
                            classData.location,
                            classData.notes
                        );
                    }
                });
            });

            // تحديث العرض للشاشات الصغيرة بعد تحميل البيانات
            setTimeout(() => {
                if (window.innerWidth <= 576) {
                    renderMobileSchedule();
                }
            }, 100);
        }
    }

    // إضافة أحداث للنقر المزدوج على الخلايا الفارغة
    const scheduleCells = document.querySelectorAll('tbody td[id]');
    scheduleCells.forEach(cell => {
        cell.addEventListener('dblclick', function() {
            // استخراج اليوم والوقت من معرف الخلية
            const cellId = cell.id;
            const [day, time] = cellId.split('-');

            // فتح النافذة المنبثقة وتعبئة الحقول
            daySelect.value = day;
            timeSelect.value = time;

            const modal = new bootstrap.Modal(document.getElementById('addScheduleModal'));
            modal.show();
        });
    });
});