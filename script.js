import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// हमने doc, getDoc, और setDoc का उपयोग किया है
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
  
  const emailValue = input.value.trim().toLowerCase(); // ईमेल को लोअरकेस में सिंक किया
  if(!emailValue) return;

  btn.disabled = true;
  btn.innerText = "जमा हो रहा है...";

  try {
    // 🔍 ईमेल आईडी को ही सीधा Document Reference बना दिया
    const docRef = doc(db, "waitlist", emailValue);
    const docSnap = await getDoc(docRef);

    // 🛑 अगर इस ईमेल नाम का डॉक्यूमेंट पहले से मौजूद है
    if (docSnap.exists()) {
      msg.innerText = "यह ईमेल आईडी पहले से दर्ज है! 😎";
      msg.className = "mt-3 text-sm font-semibold text-orange-500 text-center block";
      msg.classList.remove('hidden');
      form.reset();
      return;
    }

    // 📝 अगर नया ईमेल है, तो ईमेल को ही ID बनाकर डेटा सेव करें
    await setDoc(docRef, {
      email: emailValue,
      timestamp: serverTimestamp()
    });

    msg.innerText = "बधाई हो! आपकी RTI ईमेल आईडी वीआईपी वेटलिस्ट में दर्ज हो गई है। 🎉";
    msg.className = "mt-3 text-sm font-semibold text-green-600 text-center block";
    msg.classList.remove('hidden');
    form.reset();

  } catch (error) {
    console.error("Error configuration: ", error);
    msg.innerText = "ओह! कुछ गड़बड़ हुई। कृपया दोबारा प्रयास करें।";
    msg.className = "mt-3 text-sm font-semibold text-red-600 text-center block";
    msg.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.innerText = "जल्दी एक्सेस पाएं 🚀";
  }
});