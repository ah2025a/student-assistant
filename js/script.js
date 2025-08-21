// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على عناصر النموذج وقائمة المهام
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const dateInput = document.getElementById('dateInput');
    const taskList = document.getElementById('taskList');

    // تعيين تاريخ اليوم كتاريخ افتراضي
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // تحميل المهام من التخزين المحلي
    loadTasks();

    // إضافة حدث إرسال النموذج
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // الحصول على قيم المدخلات
        const task = taskInput.value.trim();
        const priority = prioritySelect.value;
        const date = dateInput.value;

        // التحقق من وجود مهمة
        if (task) {
            // إنشاء عنصر المهمة
            addTask(task, priority, date);

            // إعادة تعيين حقول الإدخال
            taskInput.value = '';
            prioritySelect.value = 'medium';
            dateInput.value = today;

            // تحديث الإحصائيات
            updateStats();
        }
    });

    // دالة إضافة مهمة جديدة
    function addTask(task, priority, date) {
        // إنشاء عنصر القائمة
        const li = document.createElement('li');

        // تحديد فئة الأولوية
        let priorityClass = '';
        let priorityText = '';

        switch(priority) {
            case 'high':
                priorityClass = 'priority-high';
                priorityText = 'عالية';
                break;
            case 'medium':
                priorityClass = 'priority-medium';
                priorityText = 'متوسطة';
                break;
            case 'low':
                priorityClass = 'priority-low';
                priorityText = 'منخفضة';
                break;
        }

        // تنسيق التاريخ
        const taskDate = new Date(date);
        const formattedDate = taskDate.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // إضافة الفئات والمحتوى
        li.className = `list-group-item d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center ${priorityClass}`;
        li.innerHTML = `
            <div class="task-info flex-grow-1 w-100 w-sm-auto">
                <div class="task-title">${task}</div>
                <small class="text-muted d-block d-sm-inline">التاريخ: ${formattedDate} | الأولوية: ${priorityText}</small>
            </div>
            <div class="task-actions d-flex gap-1 mt-2 mt-sm-0">
                <button class="btn btn-sm btn-success complete-btn" aria-label="إتمام المهمة">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn" aria-label="حذف المهمة">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // إضافة العنصر إلى القائمة
        taskList.appendChild(li);

        // حفظ المهام في التخزين المحلي
        saveTasks();

        // إضافة أحداث الأزرار
        const completeBtn = li.querySelector('.complete-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        completeBtn.addEventListener('click', function() {
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                li.style.textDecoration = 'line-through';
                li.style.opacity = '0.7';
                completeBtn.innerHTML = '<i class="fas fa-undo"></i>';
                completeBtn.classList.remove('btn-success');
                completeBtn.classList.add('btn-warning');
            } else {
                li.style.textDecoration = '';
                li.style.opacity = '';
                completeBtn.innerHTML = '<i class="fas fa-check"></i>';
                completeBtn.classList.remove('btn-warning');
                completeBtn.classList.add('btn-success');
            }
            saveTasks();
            updateStats();
        });

        deleteBtn.addEventListener('click', function() {
            if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
                li.remove();
                saveTasks();
                updateStats();
            }
        });
    }

    // دالة حفظ المهام في التخزين المحلي
    function saveTasks() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll('li');

        taskItems.forEach(item => {
            const title = item.querySelector('.task-title').textContent;
            const details = item.querySelector('small').textContent;
            const isCompleted = item.classList.contains('completed');

            // استخراج التاريخ والأولوية من التفاصيل
            const dateMatch = details.match(/التاريخ: (.+) \|/);
            const priorityMatch = details.match(/الأولوية: (.+)/);

            tasks.push({
                title: title,
                date: dateMatch ? dateMatch[1] : '',
                priority: priorityMatch ? priorityMatch[1] : '',
                completed: isCompleted
            });
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // دالة تحميل المهام من التخزين المحلي
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');

        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);

            tasks.forEach(task => {
                // تحويل الأولوية إلى القيمة المناسبة
                let priorityValue = 'medium';
                if (task.priority === 'عالية') priorityValue = 'high';
                else if (task.priority === 'منخفضة') priorityValue = 'low';

                // تحويل التاريخ إلى صيغة YYYY-MM-DD
                let dateValue = '';
                if (task.date) {
                    const dateParts = task.date.split(' ');
                    if (dateParts.length >= 3) {
                        // تحويل التاريخ من الهجري إلى الميلادي (تبسيط)
                        const day = dateParts[0];
                        const month = dateParts[1];
                        const year = dateParts[2];

                        // هنا يمكن إضافة تحويل أكثر دقة من الهجري إلى الميلادي
                        dateValue = new Date().toISOString().split('T')[0];
                    }
                }

                addTask(task.title, priorityValue, dateValue);

                // إذا كانت المهمة مكتملة، تحديث حالتها
                if (task.completed) {
                    const lastTask = taskList.lastElementChild;
                    lastTask.classList.add('completed');
                    lastTask.style.textDecoration = 'line-through';
                    lastTask.style.opacity = '0.7';

                    const completeBtn = lastTask.querySelector('.complete-btn');
                    completeBtn.innerHTML = '<i class="fas fa-undo"></i>';
                    completeBtn.classList.remove('btn-success');
                    completeBtn.classList.add('btn-warning');
                }
            });

            updateStats();
        }
    }

    // دالة تحديث الإحصائيات
    function updateStats() {
        const allTasks = taskList.querySelectorAll('li');
        const completedTasks = taskList.querySelectorAll('.completed');
        const remainingTasks = allTasks.length - completedTasks.length;

        // تحديث العدادات
        document.getElementById('completedTasks').textContent = completedTasks.length;
        document.getElementById('remainingTasks').textContent = remainingTasks;

        // حساب نسبة الإنجاز
        let completionRate = 0;
        if (allTasks.length > 0) {
            completionRate = Math.round((completedTasks.length / allTasks.length) * 100);
        }

        document.getElementById('completionRate').textContent = completionRate + '%';

        // تحديث شريط التقدم
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = completionRate + '%';

        // تغيير لون شريط التقدم حسب نسبة الإنجاز
        progressBar.classList.remove('bg-danger', 'bg-warning', 'bg-success');
        if (completionRate < 30) {
            progressBar.classList.add('bg-danger');
        } else if (completionRate < 70) {
            progressBar.classList.add('bg-warning');
        } else {
            progressBar.classList.add('bg-success');
        }
    }
});