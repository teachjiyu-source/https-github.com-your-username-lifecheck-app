document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let currentPhotoData = null;
    let currentResult = null; // { score, classification, explanation, timestamp }
    
    // --- Elements ---
    const screens = {
        home: document.getElementById('screen-home'),
        scan: document.getElementById('screen-scan'),
        result: document.getElementById('screen-result'),
        logs: document.getElementById('screen-logs')
    };
    
    const btns = {
        startScan: document.getElementById('btn-start-scan'),
        viewLogs: document.getElementById('btn-view-logs'),
        backs: document.querySelectorAll('.btn-back'),
        homes: document.querySelectorAll('.btn-home'),
        saveLog: document.getElementById('btn-save-log')
    };

    const form = document.getElementById('scan-form');
    const photoInput = document.getElementById('scan-photo');
    const photoPreview = document.getElementById('photo-preview');
    const photoContainer = document.getElementById('photo-preview-container');
    const logsContainer = document.getElementById('logs-container');

    // --- Navigation ---
    function showScreen(screenName) {
        Object.values(screens).forEach(screen => screen.classList.add('hidden'));
        screens[screenName].classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    btns.startScan.addEventListener('click', () => {
        form.reset();
        currentPhotoData = null;
        photoContainer.classList.add('hidden');
        photoPreview.src = '';
        showScreen('scan');
    });

    btns.viewLogs.addEventListener('click', () => {
        renderLogs();
        showScreen('logs');
    });

    btns.backs.forEach(btn => btn.addEventListener('click', () => showScreen('home')));
    btns.homes.forEach(btn => btn.addEventListener('click', () => showScreen('home')));

    // --- Image Upload (Convert to DataURL for LocalStorage saving) ---
    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentPhotoData = event.target.result;
                photoPreview.src = currentPhotoData;
                photoContainer.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // --- Form Handling & Scoring Logic ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let score = 0;
        // Total of 6 questions
        for (let i = 1; i <= 6; i++) {
            const val = document.querySelector(`input[name="q${i}"]:checked`);
            if (val && val.value === "1") {
                score++;
            }
        }

        const notes = document.getElementById('scan-notes').value;

        // Logic based on score
        let classification = '';
        let explanation = '';
        let statusClass = '';

        if (score >= 0 && score <= 2) {
            classification = 'LIKELY NON-LIVING';
            explanation = 'The subject exhibits very few or no characteristics of life. It is most likely an inanimate object or chemical compound.';
            statusClass = 'status-non-living';
        } else if (score >= 3 && score <= 4) {
            classification = 'UNCERTAIN';
            explanation = 'The subject shows some properties of life or active chemistry. Proceed with caution and conduct further specialized testing.';
            statusClass = 'status-uncertain';
        } else {
            classification = 'POSSIBLY LIVING';
            explanation = 'High probability of organic life! The subject demonstrates movement, growth, or significant reaction to stimuli. Isolate and observe carefully.';
            statusClass = 'status-living';
        }

        // Generate timestamp
        const now = new Date();
        const timestamp = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

        // Save current result in state
        currentResult = {
            id: Date.now(),
            timestamp: timestamp,
            score: score,
            classification: classification,
            explanation: explanation,
            notes: notes,
            photoData: currentPhotoData,
            statusClass: statusClass
        };

        // Update UI in Result Screen
        document.getElementById('result-score').textContent = score;
        
        const resultClassEl = document.getElementById('result-classification');
        resultClassEl.textContent = classification;
        // Apply appropriate colors
        resultClassEl.className = `classification glow-text ${statusClass}`;
        
        const scoreCircle = document.querySelector('.score-circle');
        scoreCircle.className = `score-circle ${statusClass}`;

        document.getElementById('result-explanation').textContent = explanation;

        // Reset the Save button
        btns.saveLog.disabled = false;
        btns.saveLog.textContent = 'SAVE TO DATABANKS';

        // Move to result screen
        showScreen('result');
    });

    // --- Save to LocalStorage ---
    btns.saveLog.addEventListener('click', () => {
        if (!currentResult) return;

        const logs = JSON.parse(localStorage.getItem('lifecheck_logs') || '[]');
        // Place new log at the top of the array
        logs.unshift(currentResult);
        
        try {
            localStorage.setItem('lifecheck_logs', JSON.stringify(logs));
            btns.saveLog.textContent = 'SAVED ✓';
            btns.saveLog.disabled = true;
        } catch (e) {
            alert('Storage limit exceeded. This usually happens if you saved too many photos. Please clear some previous logs or do not attach photos.');
        }
    });

    // --- Rendering Logs UI ---
    window.deleteLog = function(id) {
        if(!confirm('Delete this record?')) return;
        let logs = JSON.parse(localStorage.getItem('lifecheck_logs') || '[]');
        logs = logs.filter(log => log.id !== id);
        localStorage.setItem('lifecheck_logs', JSON.stringify(logs));
        renderLogs();
    };

    const clearLogsBtn = document.getElementById('btn-clear-logs');
    if(clearLogsBtn) {
        clearLogsBtn.addEventListener('click', () => {
            if(confirm('Are you sure you want to PURGE all databanks? This cannot be undone.')) {
                localStorage.removeItem('lifecheck_logs');
                renderLogs();
            }
        });
    }

    function renderLogs() {
        const logs = JSON.parse(localStorage.getItem('lifecheck_logs') || '[]');
        
        if (logs.length === 0) {
            logsContainer.innerHTML = '<div class="empty-state">No observations recorded in databanks.</div>';
            return;
        }

        logsContainer.innerHTML = '';
        logs.forEach(log => {
            // Re-map the state class correctly
            const isNonLiving = log.classification === 'LIKELY NON-LIVING';
            const isUncertain = log.classification === 'UNCERTAIN';
            const isLiving = log.classification === 'POSSIBLY LIVING';
            
            let statusLogClass = log.statusClass || '';
            if(!statusLogClass) {
                if(isNonLiving) statusLogClass = 'status-non-living';
                if(isUncertain) statusLogClass = 'status-uncertain';
                if(isLiving) statusLogClass = 'status-living';
            }

            const photoHTML = log.photoData ? `<img src="${log.photoData}" class="log-photo" alt="Specimen photo">` : '';
            const notesHTML = log.notes ? `<div class="log-notes">"${log.notes}"</div>` : '<div class="log-notes">No additional notes provided.</div>';

            const logHTML = `
                <div class="log-item ${statusLogClass}">
                    <div class="log-header">
                        <div class="log-header-left">
                            <h4 class="${statusLogClass}">${log.classification}</h4>
                            <div class="log-timestamp">${log.timestamp}</div>
                        </div>
                        <div class="log-score ${statusLogClass}">
                            ${log.score}/6
                        </div>
                    </div>
                    <div class="log-body">
                        ${photoHTML}
                        ${notesHTML}
                    </div>
                    <div class="log-actions">
                        <button class="btn-delete-log" onclick="deleteLog(${log.id})">🗑️ Delete Record</button>
                    </div>
                </div>
            `;
            logsContainer.innerHTML += logHTML;
        });
    }
});
