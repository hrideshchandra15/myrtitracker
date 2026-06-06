import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBWGy8wfBYn9v6uZ3PK_VdaQ4Mo-KbDDvs", 
  authDomain: "rti-appeal-tracker-proje-8129e.firebaseapp.com",
  projectId: "rti-appeal-tracker-proje-8129e",
  storageBucket: "rti-appeal-tracker-proje-8129e.appspot.com",
  messagingSenderId: "794930577880",
  appId: "1:794930577880:web:04cfbfa5f6f8b063f172ad",
  measurementId: "G-L0NPNT7Y9D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('waitlistForm');
const input = document.getElementById('userEmail');
const msg = document.getElementById('msg');
const btn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 🔄 1. बटन दबाते ही तुरंत पुराना मैसेज साफ करें ताकि यूज़र को भ्रम न हो
  msg.innerText = "";
  msg.classList.add('hidden');

  const emailValue = input.value.trim().toLowerCase();
  if(!emailValue) return;

  btn.disabled = true;
  btn.innerText = "जमा हो रहा है...";

  try {
    const docRef = doc(db, "waitlist", emailValue);
    const docSnap = await getDoc(docRef);

    // 🛑 2. अगर ईमेल पहले से मौजूद है
    if (docSnap.exists()) {
      msg.innerText = "यह ईमेल आईडी पहले से दर्ज है! 😎";
      msg.className = "mt-3 text-sm font-semibold text-orange-500 text-center block";
      msg.classList.remove('hidden');
      // यहाँ फॉर्म रिसेट नहीं करेंगे ताकि यूज़र को दिखे कि उसने क्या टाइप किया था और वह उसे सुधार सके
      return;
    }

    // 📝 3. अगर नया ईमेल है, तो डेटाबेस में जोड़ें
    await setDoc(docRef, {
      email: emailValue,
      timestamp: serverTimestamp()
    });

    msg.innerText = "बधाई हो! आपकी RTI ईमेल आईडी वीआईपी वेटलिस्ट में दर्ज हो गई है। 🎉";
    msg.className = "mt-3 text-sm font-semibold text-green-600 text-center block";
    msg.classList.remove('hidden');
    form.reset(); // केवल सफलता पर ही फॉर्म का इनपुट बॉक्स साफ होगा

  } catch (error) {
    console.error("Firebase Error: ", error);
    msg.innerText = "ओह! कुछ गड़बड़ हुई। कृपया दोबारा प्रयास करें।";
    msg.className = "mt-3 text-sm font-semibold text-red-600 text-center block";
    msg.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.innerText = "जल्दी एक्सेस पाएं 🚀";
  }
});