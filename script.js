// --- Firebase Integration ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBIf2KrSnS0xUEDvZaeESJ5ASliJw5mYEw",
    authDomain: "ffxiv-mentor-roulette-tracker.firebaseapp.com",
    projectId: "ffxiv-mentor-roulette-tracker",
    storageBucket: "ffxiv-mentor-roulette-tracker.firebasestorage.app",
    messagingSenderId: "90729014880",
    appId: "1:90729014880:web:54f894644a8cb1dc6e4505",
    measurementId: "G-ZJ4PETR0PM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
let isSyncPaused = false;
let pendingCloudData = null;

function signInWithGoogle() {
    setPersistence(auth, browserLocalPersistence)
        .then(() => {
            return signInWithPopup(auth, provider);
        })
        .catch(error => {
            console.error("Login failed:", error);
        });
}

function signOutUser() {
    signOut(auth).catch(error => {
        console.error("Logout failed:", error);
    });
}

function updateSyncUI(status) {
    const indicator = document.getElementById('syncIndicator');
    const text = document.getElementById('syncStatus');
    const icon = indicator.querySelector('img');

    if (!auth.currentUser) {
        indicator.classList.add('hidden');
        return;
    }

    indicator.classList.remove('hidden');
    indicator.classList.remove('syncing', 'synced', 'error');

    // Default to online icon
    icon.src = 'assets/online_icon.png';

    if (status === 'syncing') {
        indicator.classList.add('syncing');
        icon.src = 'assets/sync_Icon.png';
        text.innerText = t('syncing');
    } else if (status === 'synced') {
        indicator.classList.add('synced');
        text.innerText = t('synced');
        setTimeout(() => {
            if (indicator.classList.contains('synced')) {
                indicator.classList.remove('synced');
                text.innerText = "";
            }
        }, 3000);
    } else if (status === 'error') {
        indicator.classList.add('error');
        icon.src = 'assets/disconnected_Icon.png';
        text.innerText = t('syncError');
    } else if (status === 'paused') {
        indicator.classList.add('paused');
        icon.src = 'assets/disconnected_Icon.png';
        text.innerText = t('syncPaused');
    }
}

let syncTimeout;
function syncToCloud(data) {
    if (!auth.currentUser || isSyncPaused) return;

    updateSyncUI('syncing');
    clearTimeout(syncTimeout);

    syncTimeout = setTimeout(async () => {
        try {
            await setDoc(doc(db, "users", auth.currentUser.uid), {
                trackerData: data,
                lastUpdated: new Date().toISOString()
            }, { merge: true });
            updateSyncUI('synced');
        } catch (error) {
            console.error("Cloud sync failed:", error);
            updateSyncUI('error');
        }
    }, 2000); // 2 second debounce
}

onAuthStateChanged(auth, async (user) => {
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const syncIndicator = document.getElementById('syncIndicator');

    if (user) {
        loginBtn.classList.add('hidden');
        userProfile.classList.remove('hidden');
        userName.innerText = `${t('welcome')}${user.displayName}`;
        updateSyncUI(); // Initialize sync indicator icon/state

        // Load data from cloud on login
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().trackerData) {
                const cloudData = docSnap.data().trackerData;
                // Only load if cloud data is actually different or exists
                if (cloudData.length > 0) {
                    if (confirm(t('confirmOverwrite'))) {
                        loadFromData(cloudData);
                    } else {
                        // User declined overwrite, pause sync
                        isSyncPaused = true;
                        pendingCloudData = cloudData;
                        updateSyncUI('paused');
                    }
                }
            }
        } catch (error) {
            console.error("Error loading cloud data:", error);
        }
    } else {
        loginBtn.classList.remove('hidden'); // Show login button only when confirmed logged out
        userProfile.classList.add('hidden');
        syncIndicator.classList.add('hidden');
    }
});

function resolveSync() {
    if (!isSyncPaused || !pendingCloudData) return;

    const choice = prompt(`${t('syncResolutionTitle')}\n\n${t('syncResolutionDetail')}\n\n1. ${t('pullFromCloud')}\n2. ${t('pushToCloud')}\n3. ${t('cancel')}`);

    if (choice === "1") {
        if (confirm(t('confirmOverwrite'))) {
            loadFromData(pendingCloudData);
            isSyncPaused = false;
            pendingCloudData = null;
            updateSyncUI('synced');
        }
    } else if (choice === "2") {
        const localData = JSON.parse(localStorage.getItem("trackerData") || "[]");
        isSyncPaused = false; // Unpause so syncToCloud can work
        syncToCloud(localData);
        pendingCloudData = null;
    }
}

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
        list: ["Ihuykatumu", "Worqor Zormor", "The Skydeep Cenote", "Vanguard", "Origenics", "Alexandria", "Tender Valley", "The Strayborough Deadwalk", "Yuweyawata Field Station", "The Underkeep", "The Meso Terminal", "Mistwake", "The Clyteum"]
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
        list: ["The Bowl of Embers", "The Navel", "The Howling Eye", "Cape Westwind", "The Porta Decumana", "The Chrysalis", "The Steps of Faith", "A Relic Reborn: the Chimera", "A Relic Reborn: the Hydra", "Battle on the Big Bridge", "The Dragon's Neck", "Urth's Fount", "Battle in the Big Keep", "Kugane Ohashi", "The Bowl of Embers (Hard)", "The Howling Eye (Hard)", "The Navel (Hard)", "Thornmarch (Hard)", "The Whorleater (Hard)", "The Striking Tree (Hard)", "Akh Afah Amphitheatre (Hard)", "Thok ast Thok (Hard)", "The Limitless Blue (Hard)", "The Singularity Reactor", "Containment Bay S1T7", "The Final Steps of Faith", "Containment Bay P1T6", "Containment Bay Z1T9", "The Pool of Tribute", "Emanation", "The Royal Menagerie", "The Jade Stoa", "Castrum Fluminis", "The Great Hunt", "Hells' Kier", "The Wreath of Snakes", "The Dancing Plague", "The Crown of the Immaculate", "The Dying Gasp", "Cinder Drift", "The Seat of Sacrifice", "Castrum Marinum", "The Cloud Deck", "The Dark Inside", "The Mothercrystal", "The Final Day", "Storm's Crown", "Mount Ordeals", "The Voidcast Dais", "The Abyssal Fracture", "The Gilded Araya", "Worqor Lar Dor", "Everkeep", "The Interphos", "Recollection", "The Ageless Necropolis", "The Windward Wilds", "Hell on Rails", "The Unmaking"]
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
    "Alliance Raid - Dawntrail": { color: "#baf518", list: ["Jeuno: The First Walk", "San d'Oria: The Second Walk", "Windurst: The Third Walk"] },
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

let currentLanguage = localStorage.getItem('language') || 'en';

function t(key) {
    return (translations[currentLanguage] && translations[currentLanguage][key]) || key;
}

function updateUI() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.innerText = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });

    // Update selects already in table
    document.querySelectorAll('.type-select').forEach(sel => {
        const firstOpt = sel.options[0];
        if (firstOpt && firstOpt.value === "") firstOpt.textContent = t('placeholderType');
    });
    document.querySelectorAll('.name-select').forEach(sel => {
        const firstOpt = sel.options[0];
        if (firstOpt && firstOpt.value === "") firstOpt.textContent = t('placeholderName');
    });
    document.querySelectorAll('.job-select').forEach(sel => {
        const firstOpt = sel.options[0];
        if (firstOpt && firstOpt.value === "") firstOpt.textContent = t('placeholderJob');
    });
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateUI();
    // Re-render picker if open
    const menu = document.getElementById('pickerConfig');
    if (!menu.classList.contains('hidden')) {
        renderPickerConfig();
    }
}

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
function getFormattedTimestamp() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = String(now.getFullYear()).slice(-2);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes} ${day}/${month}/${year}`;
}

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
        <button class="delete-btn-overlay" title="${t('deleteConfirm')}" onclick="deleteRow(this)">×</button>
    </td>
        <td><input type="number" class="progress-input" value="${initialProgress}"></td>
        <td><select class="type-select" onchange="updateDutyNames(this)"><option value="">${t('placeholderType')}</option>${typeOptions.replace('<option value="">--Type--</option>', '')}</select></td>
        <td><select class="name-select" onchange="applyNameColor(this)"><option value="">${t('placeholderName')}</option></select></td>
        <td><select class="job-select" onchange="applyJobColor(this)"><option value="">${t('placeholderJob')}</option>${jobOptions.replace('<option value="">--Job--</option>', '')}</select></td>
        <td class="clear-cell" style="background-color: #c1f0c1;"><input type="checkbox" class="clear-checkbox" checked onchange="applyCheckColor(this)"></td>
        <td style="font-size: 0.8em; color: #666; white-space: nowrap;">${getFormattedTimestamp()}</td>
        <td><input type="text" class="note-input" placeholder="${t('placeholderNote')}"></td>
    `;

    tableBody.appendChild(row);
    if (!isLoading) autoSave(); // Only autosave if a USER added the row
}

function deleteRow(btn) {
    if (confirm(t('confirmDelete'))) {
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
        const numberSpan = row.querySelector('.run-number');
        if (numberSpan) {
            numberSpan.innerText = runCount;
        }
    });
}

// --- 3. COLOR & UI LOGIC ---
function updateDutyNames(typeElement) {
    const row = typeElement.closest('tr');
    const nameSelect = row.querySelector('.name-select');
    const selectedType = typeElement.value;

    const chosenColor = selectedType ? dutyLibrary[selectedType].color : "white";
    typeElement.style.backgroundColor = chosenColor;

    nameSelect.innerHTML = `<option value="">${t('placeholderName')}</option>`;
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

function togglePickerConfig(event) {
    if (event) event.stopPropagation();
    const menu = document.getElementById('pickerConfig');
    menu.classList.toggle('hidden');
    if (!menu.classList.contains('hidden')) {
        renderPickerConfig();
    }
}

function renderPickerConfig() {
    const container = document.getElementById('configGroups');
    container.innerHTML = "";

    // Load saved state (list of UNCHECKED jobs)
    const savedState = localStorage.getItem('pickerState');
    const uncheckedJobs = savedState ? JSON.parse(savedState) : [];

    for (const group in jobGroups) {
        const groupDiv = document.createElement('div');
        groupDiv.style.marginBottom = "10px";

        // Define Group Check Logic: specific check if all children are checked? 
        // For simplicity, we default group check to true, logic elsewhere handles the "check all" behavior visually

        // Group Header
        const groupLabel = group === "Tanks" ? t('roleTanks').replace(':', '') : (group === "Healers" ? t('roleHealers').replace(':', '') : t('roleDPS').replace(':', ''));
        groupDiv.innerHTML = `
            <label class="config-group-label">
                <input type="checkbox" checked class="group-toggle" data-group="${group}"> ${groupLabel}
            </label>
        `;

        // Individual Jobs
        jobGroups[group].jobs.forEach(job => {
            const isChecked = !uncheckedJobs.includes(job);
            const checkedAttr = isChecked ? 'checked' : '';

            const item = document.createElement('label');
            item.className = 'config-item';
            item.style.cursor = 'pointer';
            item.innerHTML = `
                <input type="checkbox" ${checkedAttr} class="job-toggle" data-group="${group}" data-job="${job}"> ${job}
            `;
            groupDiv.appendChild(item);
        });

        container.appendChild(groupDiv);
    }

    // Add listeners
    container.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', () => {
            savePickerState();
            // If group toggle, update children visually
            if (input.classList.contains('group-toggle')) {
                const groupName = input.dataset.group;
                const children = container.querySelectorAll(`.job-toggle[data-group="${groupName}"]`);
                children.forEach(cb => cb.checked = input.checked);
                savePickerState(); // Save again after children update
            }
        });
    });
}

function savePickerState() {
    const unchecked = [];
    document.querySelectorAll('.job-toggle').forEach(cb => {
        if (!cb.checked) {
            unchecked.push(cb.dataset.job);
        }
    });
    localStorage.setItem('pickerState', JSON.stringify(unchecked));
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
        document.getElementById('rollResult').innerText = t('rollPickOne');
        return;
    }

    const randomIndex = Math.floor(Math.random() * activeJobs.length);
    const selected = activeJobs[randomIndex];

    // Dynamic color and glow based on job category
    const resultDiv = document.getElementById('rollResult');
    let jobColor = "#fff";
    for (let group in jobGroups) {
        if (jobGroups[group].jobs.includes(selected)) {
            jobColor = jobGroups[group].color;
            break;
        }
    }

    resultDiv.style.color = jobColor;
    resultDiv.style.textShadow = `0 0 8px ${jobColor}, 0 0 15px ${jobColor}, 1px 1px 2px #000`;
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
    let percentage = ((maxProgress / goal) * 100).toFixed(1);

    // Prevent 1999/2000 rounding up to 100.0%
    if (maxProgress < goal && percentage === "100.0") {
        percentage = "99.9";
    }

    // Update the UI
    document.getElementById('progressText').innerText = `${maxProgress.toLocaleString()} / ${goal.toLocaleString()}`;
    document.getElementById('percentText').innerText = `${percentage}%`;

    // Update Bar Width (Cap the visual width at 100% so it doesn't break the layout, 
    // but the text still shows the real >100% number)
    const visualWidth = Math.min(percentage, 100);
    const bar = document.getElementById('progressBar');
    bar.style.width = visualWidth + "%";

    // Change color if over 100% (Limit Break!)
    if (percentage >= 100) {
        // Orange/Gold for Limit Break Ready
        bar.style.background = "linear-gradient(180deg, #ffcc00 0%, #ff6600 50%, #cc3300 100%)";
        bar.style.boxShadow = "0 0 10px #ff6600";
    } else {
        // Blue/Cyan for Charging
        bar.style.background = "linear-gradient(180deg, #88f1ff 0%, #00bfff 50%, #0077b3 100%)";
        bar.style.boxShadow = "0 0 10px #00bfff";
    }
}

function openStats() {
    const saved = localStorage.getItem("trackerData");
    const data = saved ? JSON.parse(saved) : [];

    if (data.length === 0) {
        alert(t('statsAlert'));
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

    // 5. ACTIVITY CHART MATH
    let hourlyCounts = Array(24).fill(0);
    data.forEach(entry => {
        if (entry.time) {
            const hourPart = entry.time.split(':')[0];
            const hour = parseInt(hourPart);
            if (!isNaN(hour)) hourlyCounts[hour]++;
        }
    });
    const maxHourCount = Math.max(...hourlyCounts, 1);

    // Build Activity Chart HTML
    let activityChartHtml = `
        <div class="stat-card">
            <h3 data-i18n="activityHeader">${t('activityHeader')}</h3>
            <div class="activity-chart-container">
                <div class="activity-chart">
                    ${hourlyCounts.map((count, hr) => `
                        <div class="activity-bar-shell">
                            <div class="activity-bar" 
                                 style="height: ${(count / maxHourCount * 100).toFixed(1)}%;" 
                                 title="${hr.toString().padStart(2, '0')}:00 - ${count}">
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="activity-labels">
                    <span>00</span><span>03</span><span>06</span><span>09</span><span>12</span><span>15</span><span>18</span><span>21</span><span>23</span>
                </div>
            </div>
        </div>
    `;

    // 6. THE FINAL INJECTION
    const statsBody = document.getElementById("statsBody");
    statsBody.innerHTML = `
    ${activityChartHtml}
    
    <div class="stat-tabs">
        <button class="tab-btn active" onclick="showTab('jobs')" data-i18n="tabJobs">${t('tabJobs')}</button>
        <button class="tab-btn" onclick="showTab('duties')" data-i18n="tabDuties">${t('tabDuties')}</button>
    </div>

    <div id="jobStats" class="tab-content">
        <div class="stat-card">
            <h3 data-i18n="roleBreakdown">${t('roleBreakdown')}</h3>
            <div class="stat-row"><span data-i18n="roleTanks">${t('roleTanks')}</span> <span>${roleCounts["Tanks"]}</span></div>
            <div class="stat-row"><span data-i18n="roleHealers">${t('roleHealers')}</span> <span>${roleCounts["Healers"]}</span></div>
            <div class="stat-row"><span data-i18n="roleDPS">${t('roleDPS')}</span> <span>${roleCounts["DPS"]}</span></div>
        </div>
        <div class="stat-card">
            <h3 data-i18n="jobUsage">${t('jobUsage')}</h3>
            ${jobRowsHtml || `<p data-i18n="noJobsTracked">${t('noJobsTracked')}</p>`}
        </div>
    </div>

    <div id="dutyStats" class="tab-content hidden">
        <div class="stat-card">
            <h3 data-i18n="expansionBreakdown">${t('expansionBreakdown')}</h3>
            ${typeRowsHtml || `<p data-i18n="noDutiesTracked">${t('noDutiesTracked')}</p>`}
        </div>
        <div class="stat-card">
            <h3 data-i18n="topDuties">${t('topDuties')}</h3>
            ${topDutiesHtml || `<p data-i18n="noDutiesRecorded">${t('noDutiesRecorded')}</p>`}
        </div>
        <div class="stat-card clear-rate-card">
            <h3 data-i18n="statsClearRate">${t('statsClearRate')}</h3>
            <div class="stat-row">
                <span>${clearCount} / ${data.length} ${t('statsTotalRuns')}</span>
                <strong>${clearRate}%</strong>
            </div>
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

function openDataModal() {
    document.getElementById("dataModal").classList.remove("hidden");
    document.body.classList.add("no-scroll");
}

function closeDataModal() {
    document.getElementById("dataModal").classList.add("hidden");
    document.body.classList.remove("no-scroll");
}

// 7. Click Outside to Close Logic
window.onclick = function (event) {
    // 1. Stats Modal Close (Click outside content)
    const statsModal = document.getElementById("statsModal");
    if (event.target === statsModal) {
        closeStats();
    }

    // 2. Data Management Modal Close (Click outside content)
    const dataModal = document.getElementById("dataModal");
    if (event.target === dataModal) {
        closeDataModal();
    }

    // 3. Feedback Modal Close (Click outside content)
    const feedbackModal = document.getElementById("feedbackModal");
    if (event.target === feedbackModal) {
        closeFeedbackModal();
    }

    // 2. Job Picker Close (Click outside button and menu)
    const pickerMenu = document.getElementById('pickerConfig');
    const pickerBtn = document.getElementById('jobPickerBtn');

    if (pickerMenu && !pickerMenu.classList.contains('hidden')) {
        // If the click is NOT inside the menu AND NOT on the trigger button (or its children like the icon)
        if (!pickerMenu.contains(event.target) && !pickerBtn.contains(event.target)) {
            pickerMenu.classList.add('hidden');
        }
    }

    // 4. Reset Progress Modal Close (Click outside content)
    const resetModal = document.getElementById("resetModal");
    if (event.target === resetModal) {
        closeResetModal();
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
    syncToCloud(data);
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

    localStorage.setItem("trackerData", JSON.stringify(data));
    updateOverallProgress();

    isLoading = false; // Loading finished!
}

// --- 5. INITIALIZATION ---
window.onload = () => {
    updateUI();

    const indicator = document.getElementById('syncIndicator');
    if (indicator) {
        indicator.onclick = resolveSync;
    }

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
        } catch (e) {
            alert("Invalid file format!");
        }
    };
    reader.readAsText(file);
}

function exportToString() {
    const data = localStorage.getItem("trackerData");
    if (!data) return alert(t('statsAlert'));

    try {
        // UTF-8 safe Base64 encoding
        const base64 = btoa(unescape(encodeURIComponent(data)));

        navigator.clipboard.writeText(base64).then(() => {
            const btn = document.getElementById('exportStringBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = `<img src="assets/MainIcon35-export.png" class="btn-icon"> ${t('dataCopied')}`;
            btn.classList.replace('btn-cyan', 'btn-green');

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.replace('btn-green', 'btn-cyan');
            }, 2000);
        });
    } catch (e) {
        console.error('Export error:', e);
        alert("Error creating export string.");
    }
}

function importFromString() {
    const code = prompt("Paste your sharing code here:");
    if (!code) return;

    try {
        // UTF-8 safe Base64 decoding
        const decoded = decodeURIComponent(escape(atob(code.trim())));
        const data = JSON.parse(decoded);

        if (Array.isArray(data)) {
            if (confirm(t('confirmOverwrite'))) {
                loadFromData(data);
                autoSave();

                // Visual feedback
                const btn = document.getElementById('importStringBtn');
                const originalText = btn.innerHTML;
                btn.innerHTML = `<img src="assets/MainIcon35-import.png" class="btn-icon"> ${t('dataImported')}`;
                btn.classList.replace('btn-gold', 'btn-green');
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('btn-green', 'btn-gold');
                }, 2000);
            }
        } else {
            alert(t('invalidCode'));
        }
    } catch (e) {
        console.error('Import error:', e);
        alert(t('invalidCode'));
    }
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

window.signInWithGoogle = signInWithGoogle;
window.signOutUser = signOutUser;
window.toggleLanguage = toggleLanguage;
window.addRow = addRow;
window.deleteRow = deleteRow;
window.updateDutyNames = updateDutyNames;
window.applyNameColor = applyNameColor;
window.applyJobColor = applyJobColor;
window.applyCheckColor = applyCheckColor;
window.togglePickerConfig = togglePickerConfig;
window.rollJob = rollJob;
window.openStats = openStats;
window.showTab = showTab;
window.closeStats = closeStats;
window.openDataModal = openDataModal;
window.closeDataModal = closeDataModal;
window.exportToFile = exportToFile;
window.importFromFile = importFromFile;
window.exportToString = exportToString;
window.importFromString = importFromString;
window.exportToCSV = exportToCSV;
window.autoSave = autoSave;

// --- 7. FEEDBACK LOGIC ---
function openFeedbackModal() {
    document.getElementById('feedbackModal').classList.remove('hidden');
    document.body.classList.add('no-scroll');
    // Note: feedbackText is NOT cleared here to persist text if accidentally closed
}

function closeFeedbackModal() {
    document.getElementById('feedbackModal').classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

async function submitFeedback() {
    const text = document.getElementById('feedbackText').value.trim();
    if (!text) return;

    const btn = document.getElementById('sendFeedbackBtn');
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "...";

    try {
        const response = await fetch('/api/send-feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: text,
                username: auth.currentUser?.displayName || 'Guest'
            })
        });

        if (response.ok) {
            alert(t('feedbackSuccess'));
            document.getElementById('feedbackText').value = ''; // Clear text ONLY on success
            closeFeedbackModal();
        } else {
            alert(t('feedbackError'));
        }
    } catch (err) {
        console.error(err);
        alert(t('feedbackError'));
    } finally {
        btn.disabled = false;
        btn.innerText = originalText;
    }
}

window.openFeedbackModal = openFeedbackModal;
window.closeFeedbackModal = closeFeedbackModal;
window.submitFeedback = submitFeedback;

// --- 6. SCROLL LOGIC ---
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToBottom() {
    window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
    });
}

window.scrollToTop = scrollToTop;
window.scrollToBottom = scrollToBottom;

// --- 8. RESET PROGRESS LOGIC ---
function openResetModal() {
    const btn = document.querySelector('.subtle-reset-btn');
    if (btn) {
        btn.classList.add('disabled');
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.3';
        
        setTimeout(() => {
            btn.classList.remove('disabled');
            btn.style.pointerEvents = 'auto';
            btn.style.opacity = '1';
        }, 500);
    }
    
    document.getElementById('resetModal').classList.remove('hidden');
    document.body.classList.add('no-scroll');
}

function closeResetModal() {
    document.getElementById('resetModal').classList.add('hidden');
    document.body.classList.remove('no-scroll');
}

function resetProgress() {
    // Only remove tracker data, keep settings!
    localStorage.removeItem("trackerData");
    
    // Reset internal state
    runCount = 0;
    
    // Clear the UI table
    document.getElementById("trackerBody").innerHTML = "";
    
    // Update progress bar/stats
    updateOverallProgress();
    
    // Close both modals
    closeResetModal();
    closeDataModal();
    
    // Optional: Sync empty data to cloud if logged in
    if (auth.currentUser) {
        syncToCloud([]);
    }
}

window.openResetModal = openResetModal;
window.closeResetModal = closeResetModal;
window.resetProgress = resetProgress;