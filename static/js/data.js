// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// --- Cấu hình Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyD5cwtNLXKZ-IgWg3qfZJGAiJLAs7om4_c",
  authDomain: "evticket-dae78.firebaseapp.com",
  projectId: "evticket-dae78",
  storageBucket: "evticket-dae78.appspot.com",
  messagingSenderId: "341869841907",
  appId: "1:341869841907:web:0a258120019c89c3239686",
  measurementId: "G-M7YDKEK7VB"
};

// --- Khởi tạo Firestore ---
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- Danh sách sự kiện mẫu ---
const events = [
  {
    name: "Đêm nhạc Trịnh Công Sơn",
    date: "2024-12-25",
    time: "19:30",
    location: "Nhà hát Lớn Hà Nội",
    icon: "🎵"
  },
  {
    name: "Countdown Party 2025",
    date: "2024-12-31",
    time: "23:00",
    location: "Phố đi bộ Nguyễn Huệ, TP.HCM",
    icon: "🎉"
  },
  {
    name: "Triển lãm công nghệ TechFuture 2025",
    date: "2025-01-15",
    time: "09:00",
    location: "Trung tâm Hội nghị Quốc Gia, Hà Nội",
    icon: "💡"
  },
  {
    name: "Lễ hội Ẩm thực Quốc tế",
    date: "2025-03-10",
    time: "10:00",
    location: "Công viên Thống Nhất",
    icon: "🍜"
  },
  {
    name: "Giải chạy Marathon TP.HCM 2025",
    date: "2025-04-05",
    time: "06:00",
    location: "Phú Mỹ Hưng, Quận 7",
    icon: "🏃‍♂️"
  },
  {
    name: "Festival Âm nhạc Quốc tế",
    date: "2025-05-20",
    time: "18:30",
    location: "Sân vận động Mỹ Đình",
    icon: "🎤"
  },
  {
    name: "Ngày hội khởi nghiệp Việt Nam",
    date: "2025-06-01",
    time: "08:00",
    location: "TP. Đà Nẵng",
    icon: "🚀"
  },
  {
    name: "Triển lãm tranh nghệ thuật đương đại",
    date: "2025-07-12",
    time: "09:30",
    location: "Bảo tàng Mỹ thuật TP.HCM",
    icon: "🎨"
  },
  {
    name: "Tuần lễ phim châu Âu",
    date: "2025-08-25",
    time: "19:00",
    location: "CGV Vincom Bà Triệu",
    icon: "🎬"
  },
  {
    name: "Chương trình Từ thiện Mùa Yêu Thương",
    date: "2025-12-20",
    time: "14:00",
    location: "Nhà Văn hóa Thanh Niên",
    icon: "❤️"
  }
];

// --- Thêm toàn bộ data vào Firestore ---
async function addEvents() {
  for (const event of events) {
    try {
      await addDoc(collection(db, "events"), event);
      console.log("✅ Đã thêm:", event.name);
    } catch (error) {
      console.error("❌ Lỗi khi thêm:", event.name, error);
    }
  }
  console.log("🎯 Đã thêm toàn bộ sự kiện!");
}

// Gọi hàm khi file chạy
addEvents();
