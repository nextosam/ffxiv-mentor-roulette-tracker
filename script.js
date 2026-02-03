// --- 1. LIBRARIES ---
const dutyLibrary = {
    "Dungeon - A Realm Reborn": { 
        color: "#d496fd", 
        list: ["Sastasha", "The Tam-Tara Deepcroft", "Copperbell Mines", "Halatali", "The Thousand Maws of Toto-Rak", "Haukke Manor", "Brayflox's Longstop", "The Sunken Temple of Qarn", "Cutter's Cry", "The Stone Vigil", "Dzemael Darkhold", "The Aurum Vale", "The Wanderer's Palace", "Amdapor Keep", "Pharos Sirius", "Copperbell Mines (Hard)", "Haukke Manor (Hard)", "The Lost City of Amdapor", "Halatali (Hard)", "Braflox's Longstop (Hard)", "Hullbreaker Isle", "The Tam-Tara Deepcroft (Hard)", "The Stone Vigil (Hard)", "Snowcloak", "Sastasha (Hard)", "The Sunken Temple of Qarn (Hard)", "The Keeper of the Lake", "The Wanderer's Palace (Hard)", "Amdapor Keep (Hard)"] 
    },
    "Dungeon - Heavensward": { 
        color: "#e596fd", 
        list: ["The Dusk Vigil", "Sohm Al", "The Aery", "The Vault", "The Great Gubal Library", "The Aetherochemical Research Facility", "Neverreap", "The Fractal Continuum", "Saint Mocianne's Aboretum", "Pharos Sirius (Hard)", "The Antitower", "The Lost City of Amdapor (Hard)", "Sohr Khai", "Hullbreaker Isle (Hard)", "Xelphatol", "The Great Gubal Library (Hard)", "Baelsar's Wall", "Sohm Al (Hard)"] 
    },
    "Dungeon - Stormblood": { 
        color: "#f396fd", 
        list: ["The Sirensong Sea", "Shisui of the Violet Tides", "Bardam's Mettle", "Doma Castle", "Castrum Abania", "Ala Mhigo", "Kugane Castle", "The Temple of the Fist", "The Drowned City of Skalla", "Hells' Lid", "The Fractal Continuum (Hard)", "The Swallow's Compass", "The Burn", "Saint Mocianne's Arboretum (Hard)", "The Ghimlyt Dark"] 
    },
    "Dungeon - Shadowbringers": { 
        color: "#fd96f6", 
        list: ["Holminster Switch", "Dohn Mheg", "The Qitana Ravel", "Malikah's Well", "Mt. Gulg", "Amaurot", "The Twinning", "Akadaemia Anyder", "The Grand Cosmos", "Anamnesis Anyder", "The Heroes' Gauntlet", "Matoya's Relict", "Paglth'an"] 
    },
    "Dungeon - Endwalker": { 
        color: "#fd96e2", 
        list: ["The Tower of Zot", "The Tower of Babil", "Vanaspati", "Ktisis Hyperboreia", "The Aititascope", "The Dead Ends", "Smileton", "The Stigma Dreamscape", "Alzadaal's Legacy", "The Fell Court of Troia", "Lapis Manalis", "The Aetherfont", "The Lunar Subterrane"] 
    },
    "Dungeon - Dawntrail": { 
        color: "#fd96cf", 
        list: ["Ihuykatumu", "Worqor Zormor", "The Skydeep Cenote", "Vanguard", "Origenics", "Alexandria", "Tender Valley", "The Strayborough Deadwalk", "Yuweyawata Field Station", "The Underkeep", "The Meso Terminal", "Mistwake"] 
    },
    "Guildhest": { 
        color: "#96fdc8", 
        list: ["Basic Training: Enemy Parties", "Under the Armor", "Basic Training: Enemy Strongholds", "Hero on the Halfshell", "Pulling Poison Posies", "Stinging Back", "All's Well that Ends in the Well", "Flicking Sticks and Taking Names", "More than a Feeler", "Annoy the Void", "Shadow and Claw", "Long Live the Queen", "Ward Up", "Solemn Trinity"] 
    },
    "MSQ Roulette": { 
        color: "#ff1717", 
        list: ["Castrum Meridianum", "The Praetorium", "The Porta Decumana"] 
    },
    "Trial - Normal": { 
        color: "#23e615", 
        list: ["The Bowl of Embers", "The Navel", "The Howling Eye", "Cape Westwind", "The Porta Decumana", "The Chrysalis", "The Steps of Faith", "A Relic Reborn: the Chimera", "A Relic Reborn: the Hydra", "Battle on the Big Bridge", "The Dragon's Neck", "Urth's Fount", "Battle in the Big Keep", "Kugane Ohashi", "The Bowl of Embers (Hard)", "The Howling Eye (Hard)", "The Navel (Hard)", "Thornmarch (Hard)", "The Whorleater (Hard)", "The Striking Tree (Hard)", "Akh Afah Amphitheatre (Hard)", "Thok ast Thok (Hard)", "The Limitless Blue (Hard)", "The Singularity Reactor", "Containment Bay S1T7", "The Final Steps of Faith", "Containment Bay P1T6", "Containment Bay Z1T9", "The Pool of Tribute", "Emanation", "The Royal Menagerie", "The Jade Stoa", "Castrum Fluminis", "The Great Hunt", "Hells' Kier", "The Wreath of Snakes", "The Dancing Plague", "The Crown of the Immaculate", "The Dying Gasp", "Cinder Drift", "The Seat of Sacrifice", "Castrum Marinum", "The Cloud Deck", "The Dark Inside", "The Mothercrystal", "The Final Day", "Storm's Crown", "Mount Ordeals", "The Voidcast Dais", "The Abyssal Fracture", "The Gilded Araya", "Worqor Lar Dor", "Everkeep", "The Interphos", "Recollection", "The Ageless Necropolis", "The Windward Wilds", "Hell on Rails"] 
    },
    "Trial - Extreme": { 
        color: "#e32817", 
        list: ["The Howling Eye (Extreme)", "The Navel (Extreme)", "The Bowl of Embers (Extreme)", "Thornmarch (Extreme)", "The Whorleater (Extreme)", "The Striking Tree (Extreme)", "Akh Afah Amphitheatre (Extreme)", "The Minstrel's Ballad: Ultima's Bane", "The Limitless Blue (Extreme)", "Thok ast Thok (Extreme)", "The Minstrel's Ballad: Thordan's Reign", "The Minstrel's Ballad: Nidhogg's Rage", "Containment Bay S1T7 (Extreme)", "Containment Bay P1T6 (Extreme)", "Containment Bay Z1T9 (Extreme)", "The Pool of Tribute (Extreme)", "Emanation (Extreme)", "The Minstrel's Ballad: Shinryu's Domain", "The Minstrel's Ballad: Tsukuyomi's Pain", "The Great Hunt (Extreme)", "The Jade Stoa (Extreme)", "Hells' Kier (Extreme)", "The Wreath of Snakes (Extreme)", "The Dancing Plague (Extreme)", "The Crown of the Immaculate (Extreme)", "The Minstrel's Ballad: Hades's Elegy", "Cinder Drift (Extreme)", "Memoria Misera (Extreme)", "The Seat of Sacrifice (Extreme)", "Castrum Marinum (Extreme)", "The Cloud Deck (Extreme)", "The Minstrel's Ballad: Zodiark's Fall", "The Minstrel's Ballad: Hydaelyn's Call", "The Minstrel's Ballad: Endsinger's Aria", "Storm's Crown (Extreme)", "Mount Ordeals (Extreme)", "The Voidcast Dais (Extreme)", "The Abyssal Fracture (Extreme)"] 
    },
    "Alliance Raid - A Realm Reborn": { color: "#f5c118", list: ["The Labyrinth of the Ancients", "Syrcus Tower", "The World of Darkness"] },
    "Alliance Raid - Heavensward": { color: "#f5df18", list: ["The Void Ark", "The Weeping City of Mhach", "Dun Scaith"] },
    "Alliance Raid - Stormblood": { color: "#f5f518", list: ["The Royal City of Rabanastre", "The Ridorana Lighthouse", "The Orbonne Monastery"] },
    "Alliance Raid - Shadowbringers": { color: "#dff518", list: ["The Copied Factory", "The Puppets' Bunker", "The Tower at Paradigm's Breach"] },
    "Alliance Raid - Endwalker": { color: "#d0f518", list: ["Aglaia", "Euphrosyne", "Thaleia"] },
    "Alliance Raid - Dawntrail": { color: "#baf518", list: ["Jeuno: The First Walk", "San d'Oria: The Second Walk"] },
    "Normal Raid - Alexander": { 
        color: "#188ef5", 
        list: ["Alexander - The Fist of the Father", "Alexander - The Cuff of the Father", "Alexander - The Arm of the Father", "Alexander - The Burden of the Father", "Alexander - The Fist of the Son", "Alexander - The Cuff of the Son", "Alexander - The Arm of the Son", "Alexander - The Burden of the Son", "Alexander - The Eyes of the Creator", "Alexander - The Breath of the Creator", "Alexander - The Heart of the Creator", "Alexander - The Soul of the Creator"] 
    },
    "Normal Raid - Omega": { 
        color: "#1874f5", 
        list: ["Deltascape V1.0", "Deltascape V2.0", "Deltascape V3.0", "Deltascape V4.0", "Sigmascape V1.0", "Sigmascape V2.0", "Sigmascape V3.0", "Sigmascape V4.0", "Alphascape V1.0", "Alphascape V2.0", "Alphascape V3.0", "Alphascape V4.0"] 
    },
    "Normal Raid - Eden": { 
        color: "#1862f5", 
        list: ["Eden's Gate: Resurrection", "Eden's Gate: Descent", "Eden's Gate: Inundation", "Eden's Gate: Sepulture", "Eden's Verse: Fulmination", "Eden's Verse: Furor", "Eden's Verse: Iconoclasm", "Eden's Verse: Refulgence", "Eden's Promise: Umbra", "Eden's Promise: Litany", "Eden's Promise: Anamorphosis", "Eden's Promise: Eternity"] 
    },
    "Normal Raid - Pandaemonium": { 
        color: "#1835f5", 
        list: ["Asphodelos: The First Circle", "Asphodelos: The Second Circle", "Asphodelos: The Third Circle", "Asphodelos: The Fourth Circle", "Abyssos: The Fifth Circle", "Abyssos: The Sixth Circle", "Abyssos: The Seventh Circle", "Abyssos: The Eighth Circle", "Anabaseios: The Ninth Circle", "Anabaseios: The Tenth Circle", "Anabaseios: The Eleventh Circle", "Anabaseios: The Twelfth Circle"] 
    },
    "Normal Raid - The Arcadion": { 
        color: "#6218f5", 
        list: ["AAC Light-heavyweight M1", "AAC Light-heavyweight M2", "AAC Light-heavyweight M3", "AAC Light-heavyweight M4", "AAC Cruiserweight M1", "AAC Cruiserweight M2", "AAC Cruiserweight M3", "AAC Cruiserweight M4", "AAC Heavyweight M1", "AAC Heavyweight M2", "AAC Heavyweight M3", "AAC Heavyweight M4"] 
    }
};

const jobGroups = {
    "Tanks": {
        color: "#798ded",
        jobs: ["PLD", "WAR", "DRK", "GNB"]
    },
    "Healers": {
        color: "#93c47d",
        jobs: ["WHM", "SCH", "AST", "SGE"]
    },
    "DPS": {
        color: "#e06666",
        jobs: ["MNK", "DRG", "NIN", "SAM", "RPR", "VPR", "BRD", "MCH", "DNC", "BLM", "SMN", "RDM", "PCT"]
    }
};

let runCount = 0;
let isLoading = false; // Prevents autosave from firing while we are loading old data

// --- 2. CORE TABLE LOGIC ---
function addRow() {
    runCount++;
    const tableBody = document.getElementById("trackerBody");
    const lastRow = tableBody.lastElementChild;
    
    let initialProgress = 1; 
    if (lastRow) {
        const prevProgress = parseInt(lastRow.querySelector('.progress-input').value) || 0;
        const prevClear = lastRow.querySelector('.clear-checkbox').checked;
        initialProgress = prevClear ? prevProgress + 1 : prevProgress;
    }

    const row = document.createElement("tr");

    let typeOptions = `<option value="">--Type--</option>`;
    for (let type in dutyLibrary) {
        typeOptions += `<option value="${type}">${type}</option>`;
    }

    let jobOptions = `<option value="">--Job--</option>`;
    for (let group in jobGroups) {
        // This adds a non-clickable header in the dropdown for organization!
        jobOptions += `<optgroup label="${group}">`; 
        jobGroups[group].jobs.forEach(job => {
            jobOptions += `<option value="${job}">${job}</option>`;
        });
        jobOptions += `</optgroup>`;
    }

    row.innerHTML = `
        <td class="run-cell">
        <span class="run-number">${runCount}</span>
        <button class="delete-btn-overlay" onclick="deleteRow(this)">×</button>
    </td>
        <td><input type="number" class="progress-input" value="${initialProgress}"></td>
        <td><select class="type-select" onchange="updateDutyNames(this)">${typeOptions}</select></td>
        <td><select class="name-select" onchange="applyNameColor(this)"><option value="">--Name--</option></select></td>
        <td><select class="job-select" onchange="applyJobColor(this)">${jobOptions}</select></td>
        <td class="clear-cell"><input type="checkbox" class="clear-checkbox" onchange="applyCheckColor(this)"></td>
        <td style="font-size: 0.8em; color: #666;">${new Date().toLocaleTimeString()}</td>
        <td><input type="text" class="note-input" placeholder="Add a note..."></td>
    `;
    
    tableBody.appendChild(row);
    if (!isLoading) autoSave(); // Only autosave if a USER added the row
}

function deleteRow(btn) {
    if (confirm("Are you sure you want to delete this run?")) {
        const row = btn.closest('tr');
        row.remove();
        
        recalculateRuns();
        autoSave();
    }
}

function recalculateRuns() {
    const rows = document.querySelectorAll("#trackerBody tr");
    runCount = 0; // Reset the global counter
    
    rows.forEach((row, index) => {
        runCount++;
        row.cells[0].innerText = runCount; // Update the first cell to the new count
    });
}

// --- 3. COLOR & UI LOGIC ---
function updateDutyNames(typeElement) {
    const row = typeElement.closest('tr');
    const nameSelect = row.querySelector('.name-select');
    const selectedType = typeElement.value;
    
    const chosenColor = selectedType ? dutyLibrary[selectedType].color : "white";
    typeElement.style.backgroundColor = chosenColor;

    nameSelect.innerHTML = '<option value="">--Name--</option>';
    if (selectedType) {
        dutyLibrary[selectedType].list.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            nameSelect.appendChild(opt);
        });
        nameSelect.style.backgroundColor = chosenColor;
    } else {
        nameSelect.style.backgroundColor = "white";
    }
    autoSave();
}

// Missing function fix
function applyNameColor(el) {
    const row = el.closest('tr');
    const typeVal = row.querySelector('.type-select').value;
    if (typeVal && dutyLibrary[typeVal]) {
        el.style.backgroundColor = dutyLibrary[typeVal].color;
    }
    autoSave();
}

function applyJobColor(el) {
    const selectedJob = el.value;
    let foundColor = "white";

    // Look through each group to find the color
    for (let group in jobGroups) {
        if (jobGroups[group].jobs.includes(selectedJob)) {
            foundColor = jobGroups[group].color;
            break; 
        }
    }

    el.style.backgroundColor = foundColor;
    autoSave();
}

function applyCheckColor(el) {
    const cell = el.closest('td');
    cell.style.backgroundColor = el.checked ? "#c1f0c1" : "#ffcccc";
    autoSave();
}

//job picker i think

function togglePickerConfig() {
    const menu = document.getElementById('pickerConfig');
    menu.classList.toggle('hidden');
    if (!menu.classList.contains('hidden')) {
        renderPickerConfig();
    }
}

function renderPickerConfig() {
    const container = document.getElementById('configGroups');
    
    // Clear it out properly so it doesn't duplicate but ensures it runs
    container.innerHTML = ""; 

    for (const group in jobGroups) {
        const groupDiv = document.createElement('div');
        groupDiv.style.marginBottom = "10px";
        
        // Group Header
        groupDiv.innerHTML = `
            <label class="config-group-label">
                <input type="checkbox" checked class="group-toggle" data-group="${group}"> ${group}
            </label>
        `;

        // Individual Jobs
        jobGroups[group].jobs.forEach(job => {
            const item = document.createElement('div');
            item.className = 'config-item';
            item.innerHTML = `
                <input type="checkbox" checked class="job-toggle" data-group="${group}" data-job="${job}"> ${job}
            `;
            groupDiv.appendChild(item);
        });

        container.appendChild(groupDiv);
    }

    // Add a single listener for all group toggles
    container.querySelectorAll('.group-toggle').forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const groupName = e.target.dataset.group;
            const children = container.querySelectorAll(`.job-toggle[data-group="${groupName}"]`);
            children.forEach(cb => cb.checked = e.target.checked);
        });
    });
}

// When you toggle a Role (like "Tanks"), it checks/unchecks all jobs in that group
function toggleGroup(el) {
    const group = el.dataset.group;
    const jobChecks = document.querySelectorAll(`.job-toggle[data-group="${group}"]`);
    jobChecks.forEach(cb => cb.checked = el.checked);
}

function rollJob() {
    const activeJobs = [];
    const jobChecks = document.querySelectorAll('.job-toggle:checked');
    
    jobChecks.forEach(cb => activeJobs.push(cb.dataset.job));

    if (activeJobs.length === 0) {
        document.getElementById('rollResult').innerText = "Pick one!";
        return;
    }

    const randomIndex = Math.floor(Math.random() * activeJobs.length);
    const selected = activeJobs[randomIndex];

    // Simple animation effect
    const resultDiv = document.getElementById('rollResult');
    resultDiv.style.color = "#6f42c1";
    resultDiv.innerText = selected;
}

//progress tracker
function updateOverallProgress() {
    const progressInputs = document.querySelectorAll('.progress-input');
    const goal = 2000;
    let maxProgress = 0;

    // Find the largest number currently in the table
    progressInputs.forEach(input => {
        const val = parseInt(input.value) || 0;
        if (val > maxProgress) maxProgress = val;
    });

    // Calculations
    const percentage = ((maxProgress / goal) * 100).toFixed(1);
    
    // Update the UI
    document.getElementById('progressText').innerText = `${maxProgress.toLocaleString()} / ${goal.toLocaleString()}`;
    document.getElementById('percentText').innerText = `${percentage}%`;
    
    // Update Bar Width (Cap the visual width at 100% so it doesn't break the layout, 
    // but the text still shows the real >100% number)
    const visualWidth = Math.min(percentage, 100); 
    const bar = document.getElementById('progressBar');
    bar.style.width = visualWidth + "%";

    // Change color if over 100%
    if (percentage >= 100) {
        bar.style.background = "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)"; // Gold/Pink for overachievers
    } else {
        bar.style.background = "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)";
    }
}

function openStats() {
    const saved = localStorage.getItem("trackerData");
    const data = saved ? JSON.parse(saved) : [];
    
    if (data.length === 0) {
        alert("Add some entries to the table first to see stats!");
        return;
    }

    document.getElementById("statsModal").classList.remove("hidden");
    document.body.classList.add("no-scroll");

    // 1. DATA CRUNCHING (Do all math first!)
    let roleCounts = { "Tanks": 0, "Healers": 0, "DPS": 0 };
    let jobCounts = {};
    let typeCounts = {};
    let nameCounts = {};
    let clearCount = 0;

    data.forEach(entry => {
        // Job & Role Math
        const job = entry.job;
        if (job && job !== "") {
            jobCounts[job] = (jobCounts[job] || 0) + 1;
            for (let group in jobGroups) {
                if (jobGroups[group].jobs.includes(job)) {
                    roleCounts[group]++;
                }
            }
        }
        // Duty Math
        if (entry.type) typeCounts[entry.type] = (typeCounts[entry.type] || 0) + 1;
        if (entry.name) nameCounts[entry.name] = (nameCounts[entry.name] || 0) + 1;
        if (entry.clear) clearCount++;
    });

    // 2. BUILD JOB HTML
    let jobRowsHtml = "";
    const totalJobs = Object.values(jobCounts).reduce((a, b) => a + b, 0);
    const sortedJobs = Object.entries(jobCounts).sort((a, b) => b[1] - a[1]);
    const clearRate = ((clearCount / data.length) * 100).toFixed(1);
    
    sortedJobs.forEach(([job, count]) => {
        const percentage = ((count / totalJobs) * 100).toFixed(1);
        let jobColor = "#ccc"; 
        for (let group in jobGroups) {
            if (jobGroups[group].jobs.includes(job)) {
                jobColor = jobGroups[group].color;
                break;
            }
        }
        jobRowsHtml += `
            <div class="chart-row">
                <div class="chart-label">${job} (${count})</div>
                <div class="chart-bar-bg">
                    <div class="chart-bar-fill" style="width: ${percentage}%; background-color: ${jobColor};">
                        ${percentage}%
                    </div>
                </div>
            </div>`;
    });

    // 3. BUILD DUTY TYPE HTML
    let typeRowsHtml = "";
    const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
    sortedTypes.forEach(([type, count]) => {
        const percentage = ((count / data.length) * 100).toFixed(1);
        const color = dutyLibrary[type]?.color || "#ccc";
        typeRowsHtml += `
            <div class="chart-row">
                <div class="chart-label">${type} (${count})</div>
                <div class="chart-bar-bg">
                    <div class="chart-bar-fill" style="width: ${percentage}%; background-color: ${color}; color: #333;">
                        ${percentage}%
                    </div>
                </div>
            </div>`;
    });

    // 4. BUILD TOP 5 DUTIES HTML
    const topDuties = Object.entries(nameCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    let topDutiesHtml = topDuties.map(([name, count]) => 
        `<div class="stat-row"><span>${name}</span> <strong>${count}</strong></div>`
    ).join('');

    // 5. THE FINAL INJECTION (All variables are now ready!)
    const statsBody = document.getElementById("statsBody");
    statsBody.innerHTML = `
    <div class="overall-summary">
        <div class="stat-card clear-rate-card">
            <h3>Overall Clear Rate</h3>
            <div class="big-stat">${clearRate}%</div>
            <p>${clearCount} clears out of ${data.length} total runs</p>
        </div>
    </div>
    
    <div class="stat-tabs">
        <button class="tab-btn active" onclick="showTab('jobs')">Jobs</button>
        <button class="tab-btn" onclick="showTab('duties')">Duties</button>
    </div>

    <div id="jobStats" class="tab-content">
        <div class="stat-card">
            <h3>🛡️ Role Breakdown</h3>
            <div class="stat-row"><span>Tanks:</span> <span>${roleCounts["Tanks"]}</span></div>
            <div class="stat-row"><span>Healers:</span> <span>${roleCounts["Healers"]}</span></div>
            <div class="stat-row"><span>DPS:</span> <span>${roleCounts["DPS"]}</span></div>
        </div>
        <div class="stat-card">
            <h3>📈 Job Usage</h3>
            ${jobRowsHtml || "<p>No jobs tracked yet.</p>"}
        </div>
    </div>

    <div id="dutyStats" class="tab-content hidden">
        <div class="stat-card">
            <h3>🌍 Expansion Breakdown</h3>
            ${typeRowsHtml || "<p>No duties tracked yet.</p>"}
        </div>
        <div class="stat-card">
            <h3>🔥 Top 5 Most Run Duties</h3>
            ${topDutiesHtml || "<p>No duties recorded yet.</p>"}
        </div>
    </div>
    `;
}

function showTab(tabName) {
    // 1. Find all tab contents and buttons
    const contents = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');

    // 2. Hide all contents and remove active class from all buttons
    contents.forEach(content => content.classList.add('hidden'));
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. Show the specific tab and set its button to active
    if (tabName === 'jobs') {
        document.getElementById('jobStats').classList.remove('hidden');
        // Find the button that has the 'jobs' text and highlight it
        buttons[0].classList.add('active');
    } else if (tabName === 'duties') {
        document.getElementById('dutyStats').classList.remove('hidden');
        // Find the button that has the 'duties' text and highlight it
        buttons[1].classList.add('active');
    }
}

function closeStats() {
    document.getElementById("statsModal").classList.add("hidden");
    document.body.classList.remove("no-scroll"); // Unlock scroll
}

// 7. Click Outside to Close Logic
window.onclick = function(event) {
    const modal = document.getElementById("statsModal");
    if (event.target === modal) {
        closeStats();
    }
}
// --- 4. DATA LOGIC (SAVE/LOAD) ---
function autoSave() {
    if (isLoading) return; // Don't save while we are busy loading!

    const rows = document.querySelectorAll("#trackerBody tr");
    const data = [];

    rows.forEach(row => {
        data.push({
            run: row.cells[0].innerText,
            progress: row.querySelector(".progress-input").value,
            type: row.querySelector(".type-select").value,
            name: row.querySelector(".name-select").value,
            job: row.querySelector(".job-select").value,
            clear: row.querySelector(".clear-checkbox").checked,
            time: row.cells[6].innerText,
            note: row.querySelector(".note-input").value // This grabs the text from the note box
        });
    });

    updateOverallProgress();

    localStorage.setItem("trackerData", JSON.stringify(data));
}

function loadFromData(data) {
    isLoading = true; // Turn on "loading mode"
    const tableBody = document.getElementById("trackerBody");
    tableBody.innerHTML = ""; 
    runCount = 0;

    data.forEach(item => {
        addRow(); 
        const row = tableBody.lastElementChild;
        
        row.querySelector(".progress-input").value = item.progress;
        row.querySelector(".type-select").value = item.type;
        updateDutyNames(row.querySelector(".type-select"));
        row.querySelector(".name-select").value = item.name;
        applyNameColor(row.querySelector(".name-select"));
        row.querySelector(".job-select").value = item.job;
        applyJobColor(row.querySelector(".job-select"));
        row.querySelector(".clear-checkbox").checked = item.clear;
        applyCheckColor(row.querySelector(".clear-checkbox"));
        row.cells[6].innerText = item.time;
        row.querySelector(".note-input").value = item.note || ""; // Fix for notes

        
    });

    updateOverallProgress();

    isLoading = false; // Loading finished!
}

// --- 5. INITIALIZATION ---
window.onload = () => {
    const saved = localStorage.getItem("trackerData");
    if (saved) {
        try {
            loadFromData(JSON.parse(saved));
        } catch (e) {
            console.error("Error loading saved data", e);
        }
    }
};

// Listen for typing in the table to trigger autosave
document.getElementById("trackerBody").addEventListener("input", autoSave);

// --- 6. EXPORT/IMPORT ---
function exportToFile() {
    const data = localStorage.getItem("trackerData");
    if (!data) return alert("No data to export!");
    const blob = new Blob([data], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tracker_backup.txt";
    a.click();
}

function importFromFile(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const data = JSON.parse(reader.result);
            loadFromData(data);
            autoSave();
        } catch(e) {
            alert("Invalid file format!");
        }
    };
    reader.readAsText(file);
}

function exportToCSV() {
    const saved = localStorage.getItem("trackerData");
    if (!saved) return alert("No data to export!");

    const data = JSON.parse(saved);
    
    // 1. Define the headers for the top of the Excel sheet
    const headers = ["Run", "Progress", "Duty Type", "Duty Name", "Job", "Clear", "Timestamp", "Notes"];
    
    // 2. Map the data into rows
    // We use .replace(/,/g, "") on strings to ensure no accidental commas break the CSV structure
    const csvRows = data.map(item => [
        item.run,
        item.progress,
        `"${item.type}"`, // Quotes help handle names with special characters
        `"${item.name}"`,
        item.job,
        item.clear ? "YES" : "NO",
        item.time,
        `"${item.note.replace(/"/g, '""')}"` // Handles quotes inside notes
    ].join(","));

    // 3. Combine headers and rows
    const csvContent = [headers.join(","), ...csvRows].join("\n");

    // 4. Create the download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.setAttribute("href", url);
    link.setAttribute("download", `FFXIV_Tracker_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}