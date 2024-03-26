// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

// Function to toggle the drawer
function toggleDrawer(drawerId) {
  const drawer = document.getElementById(drawerId);
  drawer.classList.toggle('active');
  document.body.classList.toggle('active');
  
  // Adjust z-index of .drawer-content
  const drawerContent = document.querySelector('.drawer-container');
  if (drawer.classList.contains('active')) {
      drawerContent.style.zIndex = 0;
  } else {
      drawerContent.style.zIndex = -1; // Set z-index to -1 when inactive
  }
}
document.addEventListener("DOMContentLoaded", function() {
  // Find the Study Materials link element
  var studyMaterialsLink = document.getElementById("studymaterials-link");

  // Add a click event listener to it
  studyMaterialsLink.addEventListener("click", function(event) {
    // Prevent the default behavior of the link (i.e., navigating to the href)
    event.preventDefault();

    // Redirect the user to ref.html
    window.location.href = "ref.html";
  });
});


// Function to handle timetable navigation
function showTimeTable() {
  // Navigate to the timetable page
  window.location.href = 'timetable.html';
}

document.addEventListener('DOMContentLoaded', function() {
  const userEmail = localStorage.getItem('userEmail');
  
  // Check if userEmail is not found
  if (!userEmail) {
    // Redirect user to index.html
    window.location.href = 'index.html';
    return; // Stop further execution
  }

  // Attach click event listener to the time table link
  const timeTableLink = document.getElementById('timetable-link');
  timeTableLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    showTimeTable(); // Call function to show timetable
  });

  // Get the userinfo link element
  const userInfoLink = document.getElementById('userinfo-link');

  // Attach click event listener to the userinfo link
  userInfoLink.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default link behavior
    window.location.href = 'user_info.html'; // Navigate to user_info.html
  });

  const codeLink = document.getElementById('code-link');
  const codeInput = document.getElementById('code-input');

  codeLink.addEventListener('click', function(event) {
    event.preventDefault();
    codeInput.style.display = 'block'; // Show the input box and submit button
  });

  const submitButton = document.getElementById('submit-code');
  submitButton.addEventListener('click', function() {
    const codeValue = document.getElementById('code-text').value;
    // Store the code value in local storage
    localStorage.setItem('codeValue', codeValue);
    // Check if codeValue is "q" or "/q" to remove userEmail
    if (codeValue === 'q' || codeValue === '/q') {
        localStorage.removeItem('userEmail');
        window.location.reload();
    }
    // You can also hide the input box and submit button after submission
    codeInput.style.display = 'none';

    // Check if codeValue is "ivo" to display the drawer imgvid
    if (codeValue === 'ivo') {
      const imgVidLink = document.getElementById('imgvid-link');
      imgVidLink.classList.remove('hidden');
    }

    // Check if codeValue is "ip" to update user IP address in Firestore
    if (codeValue === 'ip') {
      // Update user IP address in the database
      const userEmail = localStorage.getItem('userEmail');
      const userIp = localStorage.getItem('userIp');

      if (!userEmail || !userIp) {
        console.error('User email or IP address not found');
        return;
      }

      const userDocRef = firestore.collection('users').doc(userEmail);
      userDocRef.update({
        ipAddress: userIp
      }).then(() => {
        console.log('User IP address updated successfully');
      }).catch((error) => {
        console.error('Error updating user IP address:', error);
      });
    }
    
  });

  // Get user IP address using a third-party service
  fetch('https://api.ipify.org?format=json')
  .then(response => response.json())
  .then(data => {
    const userIp = data.ip;
    // Do something with the user's IP address
    console.log('User IP Address:', userIp);
    // You can store this IP address in localStorage or use it as needed
    localStorage.setItem('userIp', userIp);
  })
  .catch(error => console.error('Error fetching IP address:', error));

  const imgVidLink = document.getElementById('imgvid-link');
  imgVidLink.addEventListener('click', function(event) {
    event.preventDefault();

    const userEmail = localStorage.getItem('userEmail');
    const userIp = localStorage.getItem('userIp');
    const codeValue = localStorage.getItem('codeValue');

  

    // Access Firestore collection and document
    const userDocRef = firestore.collection('users').doc(userEmail);
    userDocRef.get().then((doc) => {
      if (doc.exists) {
        const storedIpAddress = doc.data().ipAddress;
        if (storedIpAddress === userIp) {
          // IP address matches, navigate to img_vid.html
          window.location.href = 'img_vid.html';
          // Update codeValue to "eip"
          localStorage.setItem('codeValue', 'eip');
          localStorage.setItem('lastVisitTime', Date.now());
        } else {
          // IP address does not match, prompt to download img.akp
          window.location.href = 'img.apk';
        }
      } else {
        console.log('User document not found');
      }
    }).catch((error) => {
      console.log('Error getting user document:', error);
    });
  });

});
