// --- STATE MANAGEMENT ---
let state = {
    user: {
        username: "John Doe",
        major: "Computer Science",
        targetAttendance: 75,
        dailyStudyGoal: 3
    },
    timetable: [],
    tasks: [],
    attendance: [],
    placement: [],
    uploadedDoc: {
        name: "",
        size: "",
        text: "",
        summary: "",
        studyPlan: null
    },
    chatHistory: []
};

// Default initial data for demo purposes
const DEFAULT_TIMETABLE = [
    { id: "1", name: "Data Structures & Algorithms", day: "Monday", start: "09:00", end: "10:30", room: "Room 302" },
    { id: "2", name: "Database Management Systems", day: "Monday", start: "11:00", end: "12:30", room: "Lab 2" },
    { id: "3", name: "Operating Systems", day: "Tuesday", start: "09:00", end: "10:30", room: "Room 105" },
    { id: "4", name: "Web Development", day: "Wednesday", start: "10:00", end: "11:30", room: "Room 302" },
    { id: "5", name: "Machine Learning", day: "Thursday", start: "14:00", end: "15:30", room: "Room 201" },
    { id: "6", name: "Computer Networks", day: "Friday", start: "09:00", end: "10:30", room: "Lab 3" }
];

const DEFAULT_TASKS = [
    { id: "101", title: "Complete ML Project Phase 1", category: "Project", priority: "High", deadline: new Date(Date.now() + 86400000 * 1.5).toISOString().slice(0, 16), status: "todo" },
    { id: "102", title: "DBMS Assignment 3 (SQL Joins)", category: "Assignment", priority: "Medium", deadline: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 16), status: "todo" },
    { id: "103", title: "Solve 5 LeetCode DP Problems", category: "Placement", priority: "High", deadline: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16), status: "in-progress" },
    { id: "104", title: "Register for Google Hash Code", category: "Club", priority: "Low", deadline: new Date(Date.now() + 86400000 * 6).toISOString().slice(0, 16), status: "todo" },
    { id: "105", title: "Revise OS Process Synchronization", category: "Exam", priority: "Medium", deadline: new Date(Date.now() - 86400000 * 0.5).toISOString().slice(0, 16), status: "completed" },
    { id: "106", title: "Algorithms Midterm Exam", category: "Exam", priority: "High", deadline: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16), status: "todo" }
];

const DEFAULT_ATTENDANCE = [
    { id: "201", name: "Data Structures & Algorithms", attended: 12, total: 14 },
    { id: "202", name: "Database Management Systems", attended: 6, total: 10 },
    { id: "203", name: "Operating Systems", attended: 9, total: 12 },
    { id: "204", name: "Web Development", attended: 15, total: 16 },
    { id: "205", name: "Machine Learning", attended: 8, total: 9 },
    { id: "206", name: "Computer Networks", attended: 7, total: 11 }
];

const DEFAULT_PLACEMENT = [
    {
        id: "p1",
        name: "Arrays & Hashing",
        problems: [
            { name: "Two Sum", solved: true },
            { name: "Contains Duplicate", solved: true },
            { name: "Valid Anagram", solved: true },
            { name: "Group Anagrams", solved: false },
            { name: "Top K Frequent Elements", solved: false }
        ]
    },
    {
        id: "p2",
        name: "Trees & Graphs",
        problems: [
            { name: "Invert Binary Tree", solved: true },
            { name: "Maximum Depth of Binary Tree", solved: true },
            { name: "Same Tree", solved: false },
            { name: "Course Schedule", solved: false },
            { name: "Number of Islands", solved: false }
        ]
    },
    {
        id: "p3",
        name: "Dynamic Programming",
        problems: [
            { name: "Climbing Stairs", solved: true },
            { name: "Min Cost Climbing Stairs", solved: false },
            { name: "House Robber", solved: false },
            { name: "Longest Common Subsequence", solved: false }
        ]
    }
];

// Initialize State
function initStore() {
    const savedState = localStorage.getItem("campus_copilot_state");
    if (savedState) {
        try {
            state = JSON.parse(savedState);
            // Ensure compatibility if new fields added
            if (!state.placement || state.placement.length === 0) state.placement = DEFAULT_PLACEMENT;
        } catch (e) {
            console.error("Error loading state, using defaults", e);
            loadDefaults();
        }
    } else {
        loadDefaults();
    }
}

function loadDefaults() {
    state.user = {
        username: "John Doe",
        major: "Computer Science",
        targetAttendance: 75,
        dailyStudyGoal: 3
    };
    state.timetable = [...DEFAULT_TIMETABLE];
    state.tasks = [...DEFAULT_TASKS];
    state.attendance = [...DEFAULT_ATTENDANCE];
    state.placement = [...DEFAULT_PLACEMENT];
    state.chatHistory = [
        { sender: "agent", text: "Hello! I'm your Copilot. Upload your lecture notes or PDF, and I can summarize it, answer questions from its content, or build a study plan for you." }
    ];
    saveState();
}

function saveState() {
    localStorage.setItem("campus_copilot_state", JSON.stringify(state));
}

// --- TAB NAVIGATION ---
function initNavigation() {
    const navItems = document.querySelectorAll(".nav-item");
    const tabContents = document.querySelectorAll(".tab-content");

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const tabId = item.getAttribute("data-tab");
            switchTab(tabId);
        });
    });

    // Handle cross-links on dashboard
    document.querySelectorAll("[data-tab-link]").forEach(btn => {
        btn.addEventListener("click", () => {
            const dest = btn.getAttribute("data-tab-link");
            switchTab(dest);
        });
    });
}

function switchTab(tabId) {
    const navItems = document.querySelectorAll(".nav-item");
    const tabContents = document.querySelectorAll(".tab-content");

    navItems.forEach(nav => {
        if (nav.getAttribute("data-tab") === tabId) {
            nav.classList.add("active");
        } else {
            nav.classList.remove("active");
        }
    });

    tabContents.forEach(tab => {
        if (tab.id === `tab-${tabId}`) {
            tab.classList.add("active");
        } else {
            tab.classList.remove("active");
        }
    });

    // Hook to refresh tab-specific rendering
    if (tabId === "dashboard") renderDashboard();
    if (tabId === "timetable") renderTimetable();
    if (tabId === "tasks") renderTasks();
    if (tabId === "attendance") renderAttendance();
    if (tabId === "placement") renderPlacement();
    if (tabId === "profile") renderProfile();

    // Re-initialize Lucide Icons for dynamic contents
    lucide.createIcons();
}

// --- AUDIO AMBIENT SYNTHESIS ---
let audioCtx = null;
let noiseNode = null;
let filterNode = null;
let gainNode = null;
let lfoNode = null;
let birdChirpInterval = null;

function initAudioContext() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function startAmbientSound(type) {
    try {
        if (!audioCtx) initAudioContext();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        stopAmbientSound();

        // Buffer size (2 seconds of audio)
        const bufferSize = 2 * audioCtx.sampleRate;
        const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        
        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        noiseNode = audioCtx.createBufferSource();
        noiseNode.buffer = noiseBuffer;
        noiseNode.loop = true;

        filterNode = audioCtx.createBiquadFilter();
        gainNode = audioCtx.createGain();

        if (type === "rain") {
            filterNode.type = "lowpass";
            filterNode.frequency.value = 850;
            gainNode.gain.value = 0.18;

            noiseNode.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        } 
        else if (type === "waves") {
            filterNode.type = "lowpass";
            filterNode.frequency.value = 350;
            gainNode.gain.value = 0.08;

            // LFO to modulate volume slowly for wave swells
            const lfo = audioCtx.createOscillator();
            lfo.type = "sine";
            lfo.frequency.value = 0.1; // 10 second wave cycle

            const lfoGain = audioCtx.createGain();
            lfoGain.gain.value = 0.06;

            lfo.connect(lfoGain);
            lfoGain.connect(gainNode.gain);

            noiseNode.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            lfo.start();
            lfoNode = lfo;
        } 
        else if (type === "forest") {
            // High frequency bandpass for leaf rustling/breeze
            filterNode.type = "bandpass";
            filterNode.frequency.value = 600;
            filterNode.Q.value = 1.5;
            gainNode.gain.value = 0.06;

            noiseNode.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            // Bird chirping timer
            startForestBirds();
        }

        noiseNode.start();
    } catch (e) {
        console.error("Audio Synthesis error", e);
    }
}

function stopAmbientSound() {
    if (noiseNode) {
        try { noiseNode.stop(); } catch(e){}
        noiseNode.disconnect();
        noiseNode = null;
    }
    if (lfoNode) {
        try { lfoNode.stop(); } catch(e){}
        lfoNode.disconnect();
        lfoNode = null;
    }
    if (gainNode) {
        gainNode.disconnect();
        gainNode = null;
    }
    if (birdChirpInterval) {
        clearInterval(birdChirpInterval);
        birdChirpInterval = null;
    }
}

function startForestBirds() {
    birdChirpInterval = setInterval(() => {
        if (!audioCtx || audioCtx.state === 'suspended') return;
        
        // Synthesize a quick little bird chirp (frequency sweep)
        const osc = audioCtx.createOscillator();
        const chirpGain = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(1200 + Math.random() * 400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2200 + Math.random() * 300, audioCtx.currentTime + 0.15);
        
        chirpGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        chirpGain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.05);
        chirpGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
        
        osc.connect(chirpGain);
        chirpGain.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    }, 4000 + Math.random() * 3000);
}

// --- POMODORO TIMER WORK ---
let timerState = {
    duration: 25 * 60,
    timeLeft: 25 * 60,
    timerId: null,
    isPlaying: false,
    mode: "work" // "work" or "break"
};

function initFocusTimer() {
    const playBtn = document.getElementById("btn-timer-play");
    const resetBtn = document.getElementById("btn-timer-reset");
    const musicBtn = document.getElementById("btn-timer-music");
    const ambientContainer = document.getElementById("ambient-container");
    const ambientBtns = document.querySelectorAll(".ambient-btn");

    playBtn.addEventListener("click", () => {
        if (timerState.isPlaying) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    resetBtn.addEventListener("click", resetTimer);

    musicBtn.addEventListener("click", () => {
        ambientContainer.classList.toggle("hidden");
    });

    ambientBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const sound = btn.getAttribute("data-sound");
            if (btn.classList.contains("active")) {
                btn.classList.remove("active");
                stopAmbientSound();
            } else {
                ambientBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                startAmbientSound(sound);
            }
        });
    });

    updateTimerDisplay();
}

function startTimer() {
    if (timerState.isPlaying) return;
    timerState.isPlaying = true;
    document.getElementById("btn-timer-play").innerHTML = '<i data-lucide="pause"></i>';
    lucide.createIcons();

    timerState.timerId = setInterval(() => {
        timerState.timeLeft--;
        updateTimerDisplay();

        if (timerState.timeLeft <= 0) {
            clearInterval(timerState.timerId);
            timerState.isPlaying = false;
            // Switch mode
            if (timerState.mode === "work") {
                timerState.mode = "break";
                timerState.duration = 5 * 60;
                timerState.timeLeft = 5 * 60;
                alert("Great work! Time for a short 5-minute break.");
            } else {
                timerState.mode = "work";
                timerState.duration = 25 * 60;
                timerState.timeLeft = 25 * 60;
                alert("Break is over! Time to focus.");
            }
            document.getElementById("btn-timer-play").innerHTML = '<i data-lucide="play"></i>';
            lucide.createIcons();
            updateTimerDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    if (!timerState.isPlaying) return;
    timerState.isPlaying = false;
    clearInterval(timerState.timerId);
    document.getElementById("btn-timer-play").innerHTML = '<i data-lucide="play"></i>';
    lucide.createIcons();
}

function resetTimer() {
    pauseTimer();
    timerState.mode = "work";
    timerState.duration = 25 * 60;
    timerState.timeLeft = 25 * 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerState.timeLeft / 60);
    const seconds = timerState.timeLeft % 60;
    document.getElementById("timer-time").textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update SVG progress ring
    const circle = document.getElementById("timer-progress-bar");
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    
    const offset = circumference - (timerState.timeLeft / timerState.duration) * circumference;
    circle.style.strokeDashoffset = offset;
}

// --- RECOMMENDATION & SUGGESTIONS LOGIC ---
function generateDailySuggestion() {
    const suggestionEl = document.getElementById("ai-daily-suggestion");
    if (!suggestionEl) return;

    // Check attendance warnings first
    const lowAttendance = state.attendance.find(sub => {
        const pct = (sub.attended / (sub.total || 1)) * 100;
        return pct < state.user.targetAttendance;
    });

    if (lowAttendance) {
        const currentPct = Math.round((lowAttendance.attended / lowAttendance.total) * 100);
        suggestionEl.innerHTML = `⚠️ Your attendance in <strong>${lowAttendance.name}</strong> is currently at <strong>${currentPct}%</strong>, which is below your ${state.user.targetAttendance}% target. I recommend attending today's lectures and reviewing the lecture notes in the Notes Hub to catch up.`;
        return;
    }

    // Check high priority tasks due soon
    const dueTasks = state.tasks.filter(t => t.status !== "completed").sort((a,b) => new Date(a.deadline) - new Date(b.deadline));
    if (dueTasks.length > 0) {
        const urgentTask = dueTasks[0];
        const daysLeft = Math.round((new Date(urgentTask.deadline) - Date.now()) / 86400000);
        
        if (daysLeft <= 1) {
            suggestionEl.innerHTML = `🔥 Urgent Task: <strong>${urgentTask.title}</strong> is due ${daysLeft === 0 ? 'today' : 'tomorrow'}! Spend your focus session on this right away.`;
            return;
        }
    }

    // Default suggestion: Placement DSA practice
    suggestionEl.innerHTML = `🌟 You are on track today! Let's boost your placement readiness. Solve the <strong>${DEFAULT_PLACEMENT[0].problems[3].name}</strong> problem under <em>${DEFAULT_PLACEMENT[0].name}</em> in the Placement Prep track.`;
}

// --- TIMETABLE INTERACTIVE PANEL ---
function renderTimetable() {
    const grid = document.getElementById("timetable-grid");
    if (!grid) return;

    grid.innerHTML = "";

    // Header cells
    const days = ["Time", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    days.forEach(day => {
        const cell = document.createElement("div");
        cell.className = "timetable-cell timetable-header";
        if (day === "Time") cell.classList.add("time-col-header");
        cell.textContent = day;
        grid.appendChild(cell);
    });

    // Generate Hourly Time Slots: 09:00, 10:00, 11:00, 12:00, 13:00, 14:00, 15:00
    const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"];

    timeSlots.forEach(time => {
        // Time label column
        const timeCell = document.createElement("div");
        timeCell.className = "timetable-cell timetable-time-label";
        timeCell.textContent = time;
        grid.appendChild(timeCell);

        // Day columns
        for (let d = 1; d <= 5; d++) {
            const currentDay = days[d];
            const cell = document.createElement("div");
            cell.className = "timetable-cell";

            // Find matching classes starting at this hour
            const matches = state.timetable.filter(c => c.day === currentDay && c.start.startsWith(time.split(":")[0]));

            matches.forEach(cls => {
                const card = document.createElement("div");
                card.className = "class-slot-card";
                card.innerHTML = `
                    <div class="class-slot-title">${cls.name}</div>
                    <div class="class-slot-room"><i data-lucide="map-pin" style="width:10px;height:10px"></i> ${cls.room}</div>
                    <div class="class-slot-time">${cls.start} - ${cls.end}</div>
                    <button class="btn-delete-class" data-id="${cls.id}" title="Delete class"><i data-lucide="trash-2"></i></button>
                `;
                cell.appendChild(card);
            });

            grid.appendChild(cell);
        }
    });

    // Delete Event handlers
    document.querySelectorAll(".btn-delete-class").forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const classId = btn.getAttribute("data-id");
            state.timetable = state.timetable.filter(c => c.id !== classId);
            saveState();
            renderTimetable();
        });
    });

    lucide.createIcons();
}

// Add Class Modal handlers
function initTimetableModal() {
    const addBtn = document.getElementById("btn-add-class");
    const modal = document.getElementById("modal-add-class");
    const closeBtn = document.getElementById("btn-close-class-modal");
    const cancelBtn = document.getElementById("btn-cancel-class-modal");
    const saveBtn = document.getElementById("btn-save-class");

    addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    [closeBtn, cancelBtn].forEach(b => b.addEventListener("click", () => modal.classList.add("hidden")));

    saveBtn.addEventListener("click", () => {
        const name = document.getElementById("class-name").value.trim();
        const day = document.getElementById("class-day").value;
        const start = document.getElementById("class-start").value;
        const end = document.getElementById("class-end").value;
        const room = document.getElementById("class-room").value.trim();

        if (!name || !start || !end) {
            alert("Please fill in Subject Name, Start and End time.");
            return;
        }

        const newClass = {
            id: Date.now().toString(),
            name,
            day,
            start,
            end,
            room: room || "Online / TBA"
        };

        state.timetable.push(newClass);
        saveState();
        modal.classList.add("hidden");
        
        // Reset Inputs
        document.getElementById("class-name").value = "";
        document.getElementById("class-room").value = "";

        renderTimetable();
    });
}

// --- TASKS PANEL WORK ---
function renderTasks() {
    const todoList = document.getElementById("list-todo");
    const inProgressList = document.getElementById("list-in-progress");
    const completedList = document.getElementById("list-completed");

    if (!todoList) return;

    // Reset columns
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    completedList.innerHTML = "";

    const counts = { todo: 0, "in-progress": 0, completed: 0 };

    state.tasks.forEach(task => {
        counts[task.status]++;

        const card = document.createElement("div");
        card.className = "task-card";
        card.draggable = true;
        card.setAttribute("data-id", task.id);

        const daysLeft = Math.round((new Date(task.deadline) - Date.now()) / 86400000);
        let dateHtml = "";
        if (task.status !== "completed") {
            const isOverdue = daysLeft < 0;
            const style = isOverdue ? "color: var(--color-danger); font-weight: bold;" : "";
            dateHtml = `<span class="task-date" style="${style}"><i data-lucide="clock"></i> ${isOverdue ? "Overdue" : daysLeft === 0 ? "Today" : daysLeft + "d left"}</span>`;
        } else {
            dateHtml = `<span class="task-date"><i data-lucide="check-circle-2" style="color:var(--color-success)"></i> Completed</span>`;
        }

        card.innerHTML = `
            <div class="task-card-header">
                <span class="task-card-title">${task.title}</span>
                <div class="task-card-actions">
                    ${task.status !== 'todo' ? `<button class="btn-task-action move-prev" data-id="${task.id}" title="Move left"><i data-lucide="arrow-left"></i></button>` : ''}
                    ${task.status !== 'completed' ? `<button class="btn-task-action move-next" data-id="${task.id}" title="Move right"><i data-lucide="arrow-right"></i></button>` : ''}
                    <button class="btn-task-action delete" data-id="${task.id}" title="Delete"><i data-lucide="trash-2"></i></button>
                </div>
            </div>
            <div class="task-card-footer">
                <span class="badge badge-indigo">${task.category}</span>
                <span class="task-priority-badge priority-${task.priority.toLowerCase()}-bg">${task.priority}</span>
            </div>
            <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                ${dateHtml}
            </div>
        `;

        if (task.status === "todo") todoList.appendChild(card);
        else if (task.status === "in-progress") inProgressList.appendChild(card);
        else if (task.status === "completed") completedList.appendChild(card);
    });

    // Update Counts
    document.getElementById("count-todo").textContent = counts.todo;
    document.getElementById("count-in-progress").textContent = counts["in-progress"];
    document.getElementById("count-completed").textContent = counts.completed;

    // Attach Event Listeners for actions
    document.querySelectorAll(".btn-task-action.move-next").forEach(btn => {
        btn.addEventListener("click", () => {
            const taskId = btn.getAttribute("data-id");
            moveTask(taskId, 1);
        });
    });

    document.querySelectorAll(".btn-task-action.move-prev").forEach(btn => {
        btn.addEventListener("click", () => {
            const taskId = btn.getAttribute("data-id");
            moveTask(taskId, -1);
        });
    });

    document.querySelectorAll(".btn-task-action.delete").forEach(btn => {
        btn.addEventListener("click", () => {
            const taskId = btn.getAttribute("data-id");
            state.tasks = state.tasks.filter(t => t.id !== taskId);
            saveState();
            renderTasks();
            generateDailySuggestion();
        });
    });

    // HTML5 Drag and Drop Handlers
    initDragAndDrop();
    lucide.createIcons();
}

function moveTask(taskId, direction) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const statuses = ["todo", "in-progress", "completed"];
    let currIdx = statuses.indexOf(task.status);
    let nextIdx = currIdx + direction;

    if (nextIdx >= 0 && nextIdx < statuses.length) {
        task.status = statuses[nextIdx];
        saveState();
        renderTasks();
    }
}

function initDragAndDrop() {
    const cards = document.querySelectorAll(".task-card");
    const columns = document.querySelectorAll(".task-column");

    cards.forEach(card => {
        card.addEventListener("dragstart", () => {
            card.classList.add("dragging");
        });
        card.addEventListener("dragend", () => {
            card.classList.remove("dragging");
        });
    });

    columns.forEach(col => {
        col.addEventListener("dragover", (e) => {
            e.preventDefault();
            const draggingCard = document.querySelector(".dragging");
            if (draggingCard) {
                col.querySelector(".task-list").appendChild(draggingCard);
            }
        });

        col.addEventListener("drop", () => {
            const draggingCard = document.querySelector(".dragging");
            if (draggingCard) {
                const taskId = draggingCard.getAttribute("data-id");
                const newStatus = col.getAttribute("data-status");
                const task = state.tasks.find(t => t.id === taskId);
                if (task) {
                    task.status = newStatus;
                    saveState();
                }
                renderTasks();
            }
        });
    });
}

function initTasksModal() {
    const addBtn = document.getElementById("btn-add-task");
    const modal = document.getElementById("modal-add-task");
    const closeBtn = document.getElementById("btn-close-task-modal");
    const cancelBtn = document.getElementById("btn-cancel-task-modal");
    const saveBtn = document.getElementById("btn-save-task");

    addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    [closeBtn, cancelBtn].forEach(b => b.addEventListener("click", () => modal.classList.add("hidden")));

    saveBtn.addEventListener("click", () => {
        const title = document.getElementById("task-title").value.trim();
        const category = document.getElementById("task-category").value;
        const priority = document.getElementById("task-priority").value;
        const deadline = document.getElementById("task-deadline").value;

        if (!title || !deadline) {
            alert("Please fill in task description and deadline.");
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            title,
            category,
            priority,
            deadline,
            status: "todo"
        };

        state.tasks.push(newTask);
        saveState();
        modal.classList.add("hidden");

        // Reset inputs
        document.getElementById("task-title").value = "";
        document.getElementById("task-deadline").value = "";

        renderTasks();
        generateDailySuggestion();
    });
}

// --- ATTENDANCE TRACKER WORK ---
function renderAttendance() {
    const grid = document.getElementById("attendance-subjects-grid");
    if (!grid) return;

    grid.innerHTML = "";

    state.attendance.forEach(sub => {
        const percent = sub.total > 0 ? (sub.attended / sub.total) * 100 : 0;
        const roundedPercent = Math.round(percent);
        const target = state.user.targetAttendance;
        
        let statusClass = "";
        let barClass = "";
        let tipText = "";

        if (roundedPercent < target) {
            statusClass = "danger-status";
            barClass = "danger-bar";
            
            // Calculate lectures needed to reach target
            let needed = 0;
            let tempAttended = sub.attended;
            let tempTotal = sub.total;
            while ((tempAttended / tempTotal) * 100 < target) {
                needed++;
                tempAttended++;
                tempTotal++;
            }
            tipText = `⚠️ Attend <strong>${needed}</strong> more classes consecutively to reach ${target}%`;
        } else {
            // Calculate how many lectures the student can afford to miss
            let safeMiss = 0;
            let tempTotal = sub.total;
            while (((sub.attended) / (tempTotal + 1)) * 100 >= target) {
                safeMiss++;
                tempTotal++;
            }
            if (safeMiss > 0) {
                statusClass = "";
                barClass = "";
                tipText = `🟢 You can afford to miss <strong>${safeMiss}</strong> class${safeMiss > 1 ? 'es' : ''}`;
            } else {
                statusClass = "warning-status";
                barClass = "warning-bar";
                tipText = `🟡 Borderline! Do not miss the next class.`;
            }
        }

        const card = document.createElement("div");
        card.className = "subject-card glass-card";
        card.innerHTML = `
            <div class="subject-header">
                <span class="subject-title">${sub.name}</span>
                <span class="subject-percent ${statusClass}">${roundedPercent}%</span>
            </div>
            <div class="subject-progress-bg">
                <div class="subject-progress-bar ${barClass}" style="width: ${roundedPercent}%"></div>
            </div>
            <div class="subject-stats-row">
                <span>Attended: <strong>${sub.attended}</strong> / <strong>${sub.total}</strong></span>
                <span>Target: <strong>${target}%</strong></span>
            </div>
            <div class="subject-controls">
                <button class="btn btn-outline btn-attendance present" data-id="${sub.id}">➕ Attended</button>
                <button class="btn btn-outline btn-attendance absent" data-id="${sub.id}">➖ Absent</button>
            </div>
            <div class="subject-alert-tip">${tipText}</div>
        `;

        grid.appendChild(card);
    });

    // Button event listeners
    document.querySelectorAll(".btn-attendance.present").forEach(btn => {
        btn.addEventListener("click", () => {
            const subId = btn.getAttribute("data-id");
            const sub = state.attendance.find(s => s.id === subId);
            if (sub) {
                sub.attended++;
                sub.total++;
                saveState();
                renderAttendance();
                generateDailySuggestion();
            }
        });
    });

    document.querySelectorAll(".btn-attendance.absent").forEach(btn => {
        btn.addEventListener("click", () => {
            const subId = btn.getAttribute("data-id");
            const sub = state.attendance.find(s => s.id === subId);
            if (sub) {
                sub.total++;
                saveState();
                renderAttendance();
                generateDailySuggestion();
            }
        });
    });
}

function initAttendanceModal() {
    const addBtn = document.getElementById("btn-add-subject");
    const modal = document.getElementById("modal-add-subject");
    const closeBtn = document.getElementById("btn-close-subject-modal");
    const cancelBtn = document.getElementById("btn-cancel-subject-modal");
    const saveBtn = document.getElementById("btn-save-subject");

    addBtn.addEventListener("click", () => modal.classList.remove("hidden"));
    [closeBtn, cancelBtn].forEach(b => b.addEventListener("click", () => modal.classList.add("hidden")));

    saveBtn.addEventListener("click", () => {
        const name = document.getElementById("subject-name").value.trim();
        const attended = parseInt(document.getElementById("subject-attended").value) || 0;
        const total = parseInt(document.getElementById("subject-total").value) || 0;

        if (!name || total < 0 || attended < 0 || attended > total) {
            alert("Please enter a valid subject name. Total lectures must be greater than or equal to attended.");
            return;
        }

        const newSubject = {
            id: Date.now().toString(),
            name,
            attended,
            total
        };

        state.attendance.push(newSubject);
        saveState();
        modal.classList.add("hidden");

        // Reset Inputs
        document.getElementById("subject-name").value = "";
        document.getElementById("subject-attended").value = 0;
        document.getElementById("subject-total").value = 0;

        renderAttendance();
    });
}

// --- PLACEMENT PRACTICE WORK ---
function renderPlacement() {
    const container = document.getElementById("placement-topics-container");
    if (!container) return;

    container.innerHTML = "";
    let totalSolved = 0;
    let totalProblems = 0;

    state.placement.forEach((topic, tIdx) => {
        const topicSolved = topic.problems.filter(p => p.solved).length;
        totalSolved += topicSolved;
        totalProblems += topic.problems.length;
        
        const pct = Math.round((topicSolved / topic.problems.length) * 100);

        const topicDiv = document.createElement("div");
        topicDiv.className = "topic-section";
        
        let problemsChips = "";
        topic.problems.forEach((prob, pIdx) => {
            problemsChips += `
                <span class="problem-chip ${prob.solved ? 'solved' : ''}" data-topic="${tIdx}" data-prob="${pIdx}">
                    <i data-lucide="${prob.solved ? 'check' : 'circle'}" style="width:12px;height:12px"></i>
                    ${prob.name}
                </span>
            `;
        });

        topicDiv.innerHTML = `
            <div class="topic-header">
                <span class="topic-title">${topic.name}</span>
                <span class="topic-progress-text">${topicSolved} / ${topic.problems.length} Solved (${pct}%)</span>
            </div>
            <div class="topic-progress-bg">
                <div class="topic-progress-bar" style="width: ${pct}%; background-color: var(--accent-indigo)"></div>
            </div>
            <div class="topic-problems">
                ${problemsChips}
            </div>
        `;

        container.appendChild(topicDiv);
    });

    // Update Placement overall counter
    document.getElementById("placement-solved-count").textContent = `${totalSolved} / ${totalProblems}`;

    // Click Problem Chips to toggle solved state
    document.querySelectorAll(".problem-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const tIdx = parseInt(chip.getAttribute("data-topic"));
            const pIdx = parseInt(chip.getAttribute("data-prob"));
            
            const prob = state.placement[tIdx].problems[pIdx];
            prob.solved = !prob.solved;
            
            saveState();
            renderPlacement();
        });
    });

    // Load Resume Checklist checkboxes
    const checkedList = JSON.parse(localStorage.getItem("placement_resume_check") || "[false, false, false, false]");
    document.querySelectorAll(".resume-chk").forEach((chk, idx) => {
        chk.checked = checkedList[idx];
        chk.addEventListener("change", () => {
            checkedList[idx] = chk.checked;
            localStorage.setItem("placement_resume_check", JSON.stringify(checkedList));
        });
    });

    lucide.createIcons();
}

// --- PROFILE SETTINGS WORK ---
function renderProfile() {
    document.getElementById("input-username").value = state.user.username;
    document.getElementById("input-major").value = state.user.major;
    document.getElementById("input-target-attendance").value = state.user.targetAttendance;
    document.getElementById("input-pref-study").value = state.user.dailyStudyGoal;
}

function initProfileSave() {
    const btn = document.getElementById("btn-save-profile");
    const resetBtn = document.getElementById("btn-reset-data");
    
    if (btn) {
        btn.addEventListener("click", () => {
            const username = document.getElementById("input-username").value.trim();
            const major = document.getElementById("input-major").value.trim();
            const target = parseInt(document.getElementById("input-target-attendance").value) || 75;
            const studyGoal = parseInt(document.getElementById("input-pref-study").value) || 3;

            if (!username || !major) {
                alert("Name and Major cannot be empty.");
                return;
            }

            state.user.username = username;
            state.user.major = major;
            state.user.targetAttendance = target;
            state.user.dailyStudyGoal = studyGoal;

            saveState();
            updateProfileBindings();
            alert("Settings saved successfully!");
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to reset all data to default settings? This will clear custom classes, tasks, and notes.")) {
                loadDefaults();
                renderProfile();
                updateProfileBindings();
                alert("Database reset to defaults!");
                location.reload();
            }
        });
    }
}

function updateProfileBindings() {
    // Sync UI elements across application
    document.getElementById("nav-username").textContent = state.user.username;
    document.getElementById("nav-major").textContent = state.user.major;
    document.getElementById("header-username").textContent = state.user.username.split(" ")[0];
    
    // Quick avatar
    const initials = state.user.username.split(" ").map(w => w[0]).join("").toUpperCase();
    document.getElementById("nav-avatar").textContent = initials.slice(0, 2);
}

// --- DOCUMENTS PDF PARSER & NOTES LOGIC ---
pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

function initNotesHub() {
    const dropZone = document.getElementById("file-drop-zone");
    const fileInput = document.getElementById("file-input");
    const removeBtn = document.getElementById("btn-remove-doc");
    const studyPlanBtn = document.getElementById("btn-generate-study-plan");
    const chatInput = document.getElementById("chat-input");
    const chatSendBtn = document.getElementById("btn-send-message");
    const clearChatBtn = document.getElementById("btn-clear-chat");

    dropZone.addEventListener("click", () => fileInput.click());

    // Drag-over styling
    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "var(--accent-indigo)";
        dropZone.style.background = "rgba(99, 102, 241, 0.05)";
    });

    dropZone.addEventListener("dragleave", () => {
        dropZone.style.borderColor = "rgba(255, 255, 255, 0.08)";
        dropZone.style.background = "rgba(255, 255, 255, 0.01)";
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.style.borderColor = "rgba(255, 255, 255, 0.08)";
        dropZone.style.background = "rgba(255, 255, 255, 0.01)";
        if (e.dataTransfer.files.length > 0) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    removeBtn.addEventListener("click", () => {
        state.uploadedDoc = { name: "", size: "", text: "", summary: "", studyPlan: null };
        saveState();
        renderNotesHubView();
        
        // Add chat feedback
        appendChatMessage("agent", "Document removed. Let me know if you want to upload another one!");
    });

    studyPlanBtn.addEventListener("click", generateCustomStudyPlan);

    // Chat events
    chatSendBtn.addEventListener("click", handleUserChatMessage);
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            handleUserChatMessage();
        }
    });

    clearChatBtn.addEventListener("click", () => {
        state.chatHistory = [
            { sender: "agent", text: "Chat history cleared. How can I help you study today?" }
        ];
        saveState();
        renderChatHistory();
    });

    renderNotesHubView();
    renderChatHistory();
}

async function handleFileUpload(file) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    
    appendChatMessage("system", `Reading "${file.name}" (${sizeMB} MB)...`);
    
    try {
        let extractedText = "";
        
        if (file.name.endsWith(".pdf")) {
            extractedText = await extractTextFromPDF(file);
        } else {
            extractedText = await file.text();
        }

        if (!extractedText || extractedText.trim() === "") {
            throw new Error("No text content could be extracted from this file.");
        }

        state.uploadedDoc.name = file.name;
        state.uploadedDoc.size = `${sizeMB} MB`;
        state.uploadedDoc.text = extractedText;

        // Perform mock summarization
        state.uploadedDoc.summary = analyzeAndSummarizeText(extractedText, file.name);
        
        saveState();
        renderNotesHubView();
        
        appendChatMessage("agent", `Successfully analyzed **${file.name}**! You can now ask questions about it, or click **"Create Study Plan"** to get a 5-day learning schedule.`);
    } catch (err) {
        console.error(err);
        appendChatMessage("agent", `❌ Error reading file: ${err.message || err}. Please try a standard text file or readable PDF.`);
    }
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    const maxPages = Math.min(pdf.numPages, 12); // Process up to 12 pages for safety in client browser
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(" ");
        fullText += pageText + "\n";
    }

    return fullText;
}

function analyzeAndSummarizeText(text, filename) {
    // Generate key concepts based on word analysis
    const clean = text.toLowerCase().replace(/[^a-zA-Z\s]/g, "");
    const words = clean.split(/\s+/).filter(w => w.length > 5);
    
    // Simple frequency count, excluding standard stop words
    const stopWords = new Set(["about", "before", "should", "would", "could", "their", "there", "these", "those", "which", "where", "through", "between", "under", "above"]);
    const counts = {};
    words.forEach(w => {
        if (!stopWords.has(w)) {
            counts[w] = (counts[w] || 0) + 1;
        }
    });

    const sortedWords = Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 5);
    const capitalizedConcepts = sortedWords.map(w => w.charAt(0).toUpperCase() + w.slice(1));

    // Formulate a summary block
    let summaryHtml = `
        <p><strong>Core concepts identified:</strong> ${capitalizedConcepts.join(", ") || "General Lecture Topics"}</p>
        <ul style="margin-top: 10px; padding-left: 16px;">
            <li><strong>Summary:</strong> This lecture discusses key mechanisms of ${capitalizedConcepts[0] || "the topic"} and relates them to general theory and structures.</li>
            <li><strong>Key Definition:</strong> Look out for crucial exam definitions relating to <em>${capitalizedConcepts[1] || "core structures"}</em>.</li>
            <li><strong>Action Items:</strong> Review formulas/examples on ${capitalizedConcepts[2] || "practical calculations"}, solve practice problems, and study placement-related questions.</li>
        </ul>
    `;
    return summaryHtml;
}

function renderNotesHubView() {
    const docInfo = document.getElementById("doc-info-container");
    const dropZone = document.getElementById("file-drop-zone");
    const summaryContainer = document.getElementById("doc-summary-container");
    const summaryContent = document.getElementById("doc-summary-content");
    const studyPlanBtn = document.getElementById("btn-generate-study-plan");
    const activeContext = document.getElementById("agent-active-context");

    if (state.uploadedDoc.name) {
        dropZone.classList.add("hidden");
        docInfo.classList.remove("hidden");
        document.getElementById("doc-name-text").textContent = state.uploadedDoc.name;
        document.getElementById("doc-size-text").textContent = state.uploadedDoc.size;

        summaryContainer.classList.remove("hidden");
        summaryContent.innerHTML = state.uploadedDoc.summary;
        studyPlanBtn.removeAttribute("disabled");
        activeContext.textContent = `Reading: ${state.uploadedDoc.name}`;
    } else {
        dropZone.classList.remove("hidden");
        docInfo.classList.add("hidden");
        summaryContainer.classList.add("hidden");
        studyPlanBtn.setAttribute("disabled", "true");
        activeContext.textContent = "Ready to chat";
    }
}

// Generate study plan from note content
function generateCustomStudyPlan() {
    if (!state.uploadedDoc.text) return;
    
    // Extract concepts
    const docName = state.uploadedDoc.name.replace(/\.[^/.]+$/, ""); // strip extension
    
    const studyPlan = {
        title: `${docName} study schedule`,
        days: [
            { day: "Day 1", topic: "Introductory Concepts & Definitions", time: "45 mins", tasks: "Read summary notes and outline key terms." },
            { day: "Day 2", topic: "Deep Dive into Theoretical Frameworks", time: "60 mins", tasks: "Complete text exercises and answer basic quiz questions." },
            { day: "Day 3", topic: "Practical Calculations & Formula Application", time: "75 mins", tasks: "Solve mathematical practice cases and review code samples." },
            { day: "Day 4", topic: "Exam Preparation & Past Papers Qs", time: "90 mins", tasks: "Simulate a mock test environment with notes questions." },
            { day: "Day 5", topic: "Placement Interview Scenario", time: "60 mins", tasks: "Explain core principles out loud using STAR format." }
        ]
    };

    state.uploadedDoc.studyPlan = studyPlan;
    saveState();

    // Send Plan as message chat card
    let chatPlan = `📅 **I've created a custom study plan for: ${docName}**\n\n`;
    studyPlan.days.forEach(d => {
        chatPlan += `🔹 **${d.day}**: *${d.topic}* (${d.time})\n👉 Task: ${d.tasks}\n\n`;
    });
    chatPlan += `Would you like me to add these study sessions to your schedule?`;
    
    appendChatMessage("agent", chatPlan);
}

// Chat interface
function handleUserChatMessage() {
    const input = document.getElementById("chat-input");
    const query = input.value.trim();
    if (!query) return;

    appendChatMessage("user", query);
    input.value = "";

    // Simulate Agent Thinking
    setTimeout(() => {
        let response = processAgentQuery(query);
        appendChatMessage("agent", response);
    }, 600);
}

function appendChatMessage(sender, text) {
    state.chatHistory.push({ sender, text });
    saveState();
    renderChatHistory();
}

function renderChatHistory() {
    const container = document.getElementById("chat-messages-container");
    if (!container) return;

    container.innerHTML = "";

    state.chatHistory.forEach(msg => {
        const msgDiv = document.createElement("div");
        if (msg.sender === "system") {
            msgDiv.className = "message system-message";
            msgDiv.textContent = msg.text;
        } else {
            msgDiv.className = `message ${msg.sender}`;
            // Basic markdown converter (just bold, code and bullet points)
            let formatted = msg.text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code>$1</code>')
                .replace(/\n/g, '<br>');
            msgDiv.innerHTML = formatted;
        }
        container.appendChild(msgDiv);
    });

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function processAgentQuery(query) {
    const lower = query.toLowerCase();

    // Case 1: Active Document Query
    if (state.uploadedDoc.text) {
        // Simple search heuristic
        const sentences = state.uploadedDoc.text.split(/[.!?]+/);
        const matches = [];
        
        // Extract words from query
        const queryWords = lower.replace(/[^a-zA-Z\s]/g, "").split(/\s+/).filter(w => w.length > 4);
        
        if (queryWords.length > 0) {
            sentences.forEach(s => {
                let matchCount = 0;
                queryWords.forEach(w => {
                    if (s.toLowerCase().includes(w)) {
                        matchCount++;
                    }
                });
                if (matchCount > 0) {
                    matches.push({ text: s.trim(), weight: matchCount });
                }
            });
        }

        if (matches.length > 0) {
            // Sort by relevance weight
            matches.sort((a, b) => b.weight - a.weight);
            const context = matches.slice(0, 2).map(m => `"...${m.text}..."`).join("<br><br>");
            return `Based on your note **${state.uploadedDoc.name}**, here is the most relevant snippet:\n\n${context}\n\n*Would you like me to elaborate on this concept?*`;
        }
    }

    // Case 2: General schedule & tasks inquiries
    if (lower.includes("attendance") || lower.includes("percent")) {
        const lowSubjects = state.attendance.filter(s => (s.attended / s.total * 100) < state.user.targetAttendance);
        if (lowSubjects.length > 0) {
            return `You are lagging in attendance for: **${lowSubjects.map(s => s.name).join(", ")}**. Make sure to attend the upcoming sessions.`;
        }
        return `Your attendance looks solid! All subjects are currently above your target of **${state.user.targetAttendance}%**. Keep it up!`;
    }

    if (lower.includes("exam") || lower.includes("due") || lower.includes("deadline")) {
        const soon = state.tasks.filter(t => t.status !== "completed");
        if (soon.length > 0) {
            let list = soon.slice(0, 3).map(t => `- **${t.title}** (${t.category})`).join("\n");
            return `Here are your top upcoming tasks:\n${list}`;
        }
        return `You have no pending deadlines at the moment. Enjoy the break!`;
    }

    if (lower.includes("study") || lower.includes("schedule") || lower.includes("timetable")) {
        const today = getTodayName();
        const classes = state.timetable.filter(c => c.day === today);
        if (classes.length > 0) {
            let list = classes.map(c => `- **${c.name}** at *${c.start}* (${c.room})`).join("\n");
            return `Here is your schedule for today (${today}):\n${list}`;
        }
        return `No classes scheduled for today (${today}). You can use this free time to work on placement preparation!`;
    }

    // Default conversational responses
    if (lower.includes("hello") || lower.includes("hi")) {
        return `Hello **${state.user.username.split(" ")[0]}**! How can I assist you today? You can ask about your schedule, attendance warnings, or upload a note PDF to begin summarizing.`;
    }

    return `I'm here as your Copilot. I can search through your uploaded files for specific answers, calculate how many classes you can miss, list your deadlines, or start a Pomodoro session for you. What would you like to do?`;
}

function getTodayName() {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date().getDay()];
}

// --- DASHBOARD REALTIME WORK ---
function renderDashboard() {
    updateProfileBindings();
    generateDailySuggestion();

    // 1. Render Classes Today list
    const classesList = document.getElementById("dashboard-classes-list");
    const nextAlert = document.getElementById("next-class-alert");
    const nextDetails = document.getElementById("next-class-details");
    
    if (classesList) {
        classesList.innerHTML = "";
        const today = getTodayName();
        const todayClasses = state.timetable.filter(c => c.day === today).sort((a,b) => a.start.localeCompare(b.start));

        if (todayClasses.length === 0) {
            classesList.innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:12px;padding:20px;">No classes scheduled for today.</div>`;
            nextAlert.classList.add("hidden");
        } else {
            nextAlert.classList.add("hidden"); // Default
            
            // Check if there is an upcoming class starting soon
            const now = new Date();
            const nowTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            let nextClass = null;
            todayClasses.forEach(cls => {
                const item = document.createElement("div");
                item.className = "today-class-item";
                
                // Highlight currently ongoing or next class
                let highlightStyle = "";
                if (nowTimeStr >= cls.start && nowTimeStr <= cls.end) {
                    highlightStyle = "border-color: var(--accent-indigo); background: rgba(99, 102, 241, 0.05);";
                }

                item.style = highlightStyle;
                item.innerHTML = `
                    <div>
                        <div class="class-title-text">${cls.name}</div>
                        <div class="class-duration">${cls.start} - ${cls.end}</div>
                    </div>
                    <div class="class-time-indicator">
                        <div class="time">${cls.room}</div>
                    </div>
                `;
                classesList.appendChild(item);

                if (cls.start > nowTimeStr && !nextClass) {
                    nextClass = cls;
                }
            });

            if (nextClass) {
                nextAlert.classList.remove("hidden");
                nextDetails.innerHTML = `<strong>${nextClass.name}</strong> starts at <strong>${nextClass.start}</strong> (${nextClass.room})`;
            }
        }
    }

    // 2. Render Upcoming Deadlines List
    const tasksList = document.getElementById("dashboard-tasks-list");
    const nextExamAlert = document.getElementById("next-exam-alert");
    const nextExamDetails = document.getElementById("next-exam-details");
    
    if (nextExamAlert) {
        const exams = state.tasks
            .filter(t => t.category === "Exam" && t.status !== "completed")
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
            
        if (exams.length > 0) {
            const nextExam = exams[0];
            const msLeft = new Date(nextExam.deadline) - Date.now();
            const daysLeft = Math.round(msLeft / 86400000);
            
            if (daysLeft >= -1 && daysLeft <= 7) {
                nextExamAlert.classList.remove("hidden");
                let label = "";
                if (daysLeft < 0) {
                    label = "is ongoing/overdue today!";
                } else if (daysLeft === 0) {
                    label = "is TODAY!";
                } else if (daysLeft === 1) {
                    label = "is TOMORROW!";
                } else {
                    label = `is in ${daysLeft} days!`;
                }
                nextExamDetails.innerHTML = `<strong>${nextExam.title}</strong> ${label}`;
            } else {
                nextExamAlert.classList.add("hidden");
            }
        } else {
            nextExamAlert.classList.add("hidden");
        }
    }

    if (tasksList) {
        tasksList.innerHTML = "";
        const activeTasks = state.tasks
            .filter(t => t.status !== "completed")
            .sort((a,b) => new Date(a.deadline) - new Date(b.deadline))
            .slice(0, 3); // top 3

        if (activeTasks.length === 0) {
            tasksList.innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:12px;padding:20px;">No upcoming deadlines.</div>`;
        } else {
            activeTasks.forEach(task => {
                const daysLeft = Math.round((new Date(task.deadline) - Date.now()) / 86400000);
                const isOverdue = daysLeft < 0;
                
                const item = document.createElement("div");
                item.className = `deadline-item priority-${task.priority.toLowerCase()}`;
                item.innerHTML = `
                    <div class="deadline-left">
                        <span class="deadline-title">${task.title}</span>
                        <div class="deadline-meta">
                            <span class="badge badge-indigo">${task.category}</span>
                            <span>Due: ${new Date(task.deadline).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="deadline-days ${isOverdue || daysLeft <= 1 ? 'urgent' : ''}">
                        ${isOverdue ? 'Overdue' : daysLeft === 0 ? 'Today' : daysLeft + 'd left'}
                    </div>
                `;
                tasksList.appendChild(item);
            });
        }
    }

    // 3. Render Attendance Circular Chart & Details
    const circle = document.getElementById("dashboard-attendance-circle");
    const percentEl = document.getElementById("dashboard-attendance-percent");
    const statDetails = document.getElementById("dashboard-total-attendance-details");
    const statusDetails = document.getElementById("dashboard-attendance-status");

    if (circle) {
        let totalAttended = 0;
        let totalLectures = 0;
        state.attendance.forEach(s => {
            totalAttended += s.attended;
            totalLectures += s.total;
        });

        const percent = totalLectures > 0 ? (totalAttended / totalLectures) * 100 : 0;
        const roundedPercent = Math.round(percent);
        
        percentEl.textContent = `${roundedPercent}%`;
        statDetails.textContent = `${totalAttended} / ${totalLectures} lectures`;
        
        // Progress animation
        circle.style.strokeDasharray = `${roundedPercent}, 100`;

        if (roundedPercent >= state.user.targetAttendance) {
            circle.style.stroke = "var(--accent-cyan)";
            statusDetails.innerHTML = `<span style="color:var(--color-success)">Good (Above ${state.user.targetAttendance}%)</span>`;
        } else {
            circle.style.stroke = "var(--color-danger)";
            statusDetails.innerHTML = `<span style="color:var(--color-danger)">Low (Below ${state.user.targetAttendance}%)</span>`;
        }
    }
}

// Initial Hookups
window.addEventListener("DOMContentLoaded", () => {
    initStore();
    initNavigation();
    
    // Views
    renderDashboard();
    
    // Component modules
    initFocusTimer();
    initTimetableModal();
    initTasksModal();
    initAttendanceModal();
    initNotesHub();
    initProfileSave();

    // Sync header dates
    const dateEl = document.getElementById("current-date");
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Connect recommended task action on dashboard card
    document.getElementById("btn-start-recommended-task").addEventListener("click", () => {
        switchTab("tasks");
    });
    document.getElementById("btn-show-notes-copilot").addEventListener("click", () => {
        switchTab("notes");
    });
    
    // Quick layout check
    lucide.createIcons();
});
