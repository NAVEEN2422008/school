// Initialize Firestore
const db = firebase.firestore();

// Get elements from the HTML document
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const messageDiv = document.getElementById('message');
const loginBtn = document.getElementById('loginBtn');

// Check if userEmail exists in localStorage
const userEmail = localStorage.getItem('userEmail');

// If userEmail exists, bypass login and update user data
if (userEmail) {
  const userId = userEmail;
  const userRef = db.collection('users').doc(userId);

  // Update lastLogin timestamp and loginCount
  userRef.update({
    lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
    loginCount: firebase.firestore.FieldValue.increment(1)
  })
  .then(() => {
    // Redirect to dashboard page after updating user data
    window.location.href = 'dashboard.html';
  })
  .catch((error) => {
    console.error("Error updating user data:", error);
    messageDiv.innerText = "Error updating user data";
  });
} else {
  // Attach click event listener to the login button
  loginBtn.addEventListener('click', () => {
    const email = emailInput.value;
    const password = passwordInput.value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Save user email to localStorage
        localStorage.setItem('userEmail', user.email);

        messageDiv.innerText = "Login successful! Redirecting...";

        // After a successful login, check if the user exists in the database
        const userId = user.email;
        const userRef = db.collection('users').doc(userId);

        userRef.get()
          .then((doc) => {
            if (doc.exists) {
              // User exists, update login timestamp and count
              userRef.update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                loginCount: firebase.firestore.FieldValue.increment(1)
              })
              .then(() => {
                // Redirect to dashboard page after updating user data
                window.location.href = 'dashboard.html';
              })
              .catch((error) => {
                console.error("Error updating user data:", error);
                messageDiv.innerText = "Error updating user data";
              });
            } else {
              // User does not exist, create a new document
              const ipAddressPromise = fetch('https://api.ipify.org?format=json')
                .then(response => response.json())
                .then(data => data.ip)
                .catch(error => {
                  console.error("Error retrieving IP address:", error);
                  return null;
                });

              ipAddressPromise.then(ipAddress => {
                db.collection('users').doc(userId).set({
                  loginCount: 1,
                  lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                  ipAddress: ipAddress // Include IP address in the document
                })
                .then(() => {
                  // Redirect to dashboard page after creating user data
                  window.location.href = 'dashboard.html';
                })
                .catch((error) => {
                  console.error("Error creating user data:", error);
                  messageDiv.innerText = "Error creating user data";
                });
              });
            }
          })
          .catch((error) => {
            console.error("Error checking user:", error);
            messageDiv.innerText = "Error checking user";
          });
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.error(errorMessage);
        messageDiv.innerText = errorMessage;
      });
  });
}
