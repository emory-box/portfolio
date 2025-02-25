document.getElementById("theme-switcher").addEventListener('click', function () {
    const currentTheme = document.documentElement.getAttribute("theme-color");
    console.log(currentTheme);
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("theme-color", newTheme);

    // Select the SVG icons
    const darkIcon = document.querySelector(".dark-theme-icon");
    const lightIcon = document.querySelector(".light-theme-icon");

    // Toggle the active class on icons
    darkIcon.classList.toggle("active");
    lightIcon.classList.toggle("active");

    // Re-trigger animations by re-applying the active class
    const activeIcon = newTheme === "dark" ? darkIcon : lightIcon;
    activeIcon.classList.remove("active");
    void activeIcon.offsetWidth; // Trigger a reflow to restart animations
    activeIcon.classList.add("active");
});

const recipientEmail = 'thanh.pham.work3112@gmail.com';
document.getElementById('email').innerText = recipientEmail;

document.getElementById('send-email').addEventListener('click', function (event) {
    event.preventDefault();

    // Get the subject and body values from the form
    const subject = document.getElementById('email-subject').value;
    const body = document.getElementById('email-body').value;

    // Encode the subject and body to be URL-safe
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    // Create the mailto link
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;

    // Open the mailto link
    window.location.href = mailtoLink;
});

document.getElementById('copy-button').addEventListener('click', function () {
    // Toggle visibility of copy and check icons
    var copyIcons = document.querySelectorAll('.copy-icon');
    var checkIcon = document.querySelector('.check-icon');

    copyIcons.forEach(function (icon) {
        icon.style.display = 'none';
    });

    checkIcon.style.display = 'block';

    // Revert back to the original copy icon after 2 seconds
    setTimeout(function () {
        copyIcons.forEach(function (icon) {
            icon.style.display = 'block';
        });
        checkIcon.style.display = 'none';
    }, 1000);
});

document.querySelector('.email-copy-button').addEventListener('click', function () {
    var copyIcons = document.querySelectorAll('.copy-icon');
    copyIcons.forEach(function (icon) {
        icon.style.display = 'none';
    });

    // Copy email to clipboard
    copyToClipboard(recipientEmail);

    // Show pop-up
    var popUp = document.querySelector('.copy-pop-up');
    popUp.classList.add('show-pop-up');

    // Hide pop-up after 1.5 seconds
    setTimeout(function () {
        popUp.classList.remove('show-pop-up');
    }, 1500);
});

async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            // Use modern Clipboard API
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for browsers that don't support Clipboard API
            await copyUsingExecCommand(text);
        }
        console.log('Text copied to clipboard');
    } catch (error) {
        console.error('Error copying to clipboard:', error);
    }
}

function copyUsingExecCommand(text) {
    var tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}