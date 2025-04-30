// Import Firebase modules using ES6 modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCSSt-CYX1fDM6cU-hxOW97W6TB4jKlvDQ",
    authDomain: "sajidmk-cc516.firebaseapp.com",
    projectId: "sajidmk-cc516",
    storageBucket: "sajidmk-cc516.firebasestorage.app",
    messagingSenderId: "412939132425",
    appId: "1:412939132425:web:400930d43c660acde762d8",
    measurementId: "G-K14MHTXYY1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to toggle edit mode
document.addEventListener("DOMContentLoaded", function () {
    const editToggle = document.getElementById('edit-mode-toggle');
    const dateInput = document.getElementById('meeting-date');
    const timeInput = document.getElementById('meeting-time');
    const notesInput = document.getElementById('meeting-notes');
    const addButton = document.getElementById('add-meeting-button');
    const resetButton = document.getElementById('reset-history-button');

    if (editToggle && dateInput && timeInput && notesInput && addButton && resetButton) {
        editToggle.addEventListener('click', function () {
            const isDisabled = dateInput.disabled;
            dateInput.disabled = timeInput.disabled = notesInput.disabled = addButton.disabled = resetButton.disabled = !isDisabled;
            editToggle.textContent = isDisabled ? 'Disable Edit Mode' : 'Enable Edit Mode';
        });
    }
});

// Function to add a meeting to Firestore
async function addMeeting() {
    const date = document.getElementById('meeting-date').value;
    const time = document.getElementById('meeting-time').value;
    const notes = document.getElementById('meeting-notes').value;

    if (!date || !time) {
        alert('Please enter both date and time.');
        return;
    }

    try {
        await addDoc(collection(db, 'meetings'), { date, time, notes });
        alert('Meeting saved successfully!');
        displayMeetings();
    } catch (error) {
        console.error('Error saving meeting: ', error);
    }

    document.getElementById('meeting-date').value = '';
    document.getElementById('meeting-time').value = '';
    document.getElementById('meeting-notes').value = '';
}

// Function to reset meeting history in Firestore
async function resetHistory() {
    if (!confirm('Are you sure you want to reset the meeting history?')) return;

    try {
        const querySnapshot = await getDocs(collection(db, 'meetings'));
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
        displayMeetings();
    } catch (error) {
        console.error('Error resetting history: ', error);
    }
}

// Function to display meetings from Firestore
async function displayMeetings() {
    const meetingLog = document.getElementById('meeting-log');
    if (!meetingLog) return;

    meetingLog.innerHTML = '';

    try {
        const querySnapshot = await getDocs(collection(db, 'meetings'));
        querySnapshot.forEach((doc, index) => {
            const data = doc.data();
            const li = document.createElement('li');
            li.textContent = `Meeting ${index + 1}: Date - ${data.date}, Time - ${data.time}, Notes - ${data.notes}`;
            meetingLog.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching meetings: ', error);
    }
}

// Function to handle the mobile menu toggle
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");

            // Ensure menu opens fully by setting display block
            if (navLinks.classList.contains("active")) {
                navLinks.style.display = "flex";
            } else {
                navLinks.style.display = "none";
            }
        });
    }
});

// Ensure elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", function () {
    const dateInput = document.getElementById("meeting-date");
    const timeInput = document.getElementById("meeting-time");
    const notesInput = document.getElementById("meeting-notes");
    const addButton = document.getElementById("add-meeting-button");
    const resetButton = document.getElementById("reset-history-button");
    const meetingLog = document.getElementById("meeting-log");

    if (dateInput && timeInput && notesInput && addButton && resetButton && meetingLog) {
        addButton.addEventListener("click", addMeeting);
        resetButton.addEventListener("click", resetHistory);
        displayMeetings();
    } else {
        console.error("One or more elements are missing from the DOM.");
    }

    // Dropdown functionality for the blog section
    const blogLink = document.getElementById('blogLink');
    const blogDropdown = document.getElementById('blogDropdown');

    if (blogLink && blogDropdown) {
        blogLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            blogDropdown.classList.toggle('active'); // Toggle dropdown visibility
            blogLink.classList.toggle('active'); // Toggle active class on link
        });

        // Close dropdown when clicking outside of it
        document.addEventListener('click', function(event) {
            if (!blogLink.contains(event.target) && !blogDropdown.contains(event.target)) {
                blogDropdown.classList.remove('active');
                blogLink.classList.remove('active'); // Remove active class from the link
            }
        });
    } else {
        console.error("Blog link or dropdown elements are missing from the DOM.");
    }
});
