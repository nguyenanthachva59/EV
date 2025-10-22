
let currentEvent = null;


function init() {
    renderEvents(); 
    showSection('home');
}

async function renderEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = 'Đang tải sự kiện...'; 

    try {
        const snapshot = await db.collection('events').get();
        
        if (snapshot.empty) {
            eventsGrid.innerHTML = 'Hiện chưa có sự kiện nào.';
            return;
        }

        eventsGrid.innerHTML = ''; 

        snapshot.forEach(doc => {
            const event = doc.data(); 
            const eventId = doc.id;
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <div class="event-image">${event.icon}</div>
                <div class="event-content">
                    <h3 class="event-title">${event.name}</h3>
                    <div class="event-details">
                        <div class="event-detail">
                            <span>📅</span>
                            <span>${formatDate(event.date)} - ${event.time}</span>
                        </div>
                        <div class="event-detail">
                            <span>📍</span>
                            <span>${event.location}</span>
                        </div>
                    </div>
                    <button class="register-btn" onclick="registerForEvent('${eventId}')">
                        Đăng ký ngay
                    </button>
                </div>
            `;
            eventsGrid.appendChild(eventCard);
        });

    } catch (error) {
        console.error("Lỗi khi tải sự kiện: ", error);
        eventsGrid.innerHTML = 'Không thể tải danh sách sự kiện.';
    }
}

async function registerForEvent(eventId) {
    try {
        const doc = await db.collection('events').doc(eventId).get();
        
        if (!doc.exists) {
            console.error("Lỗi: Không tìm thấy sự kiện!");
            return;
        }

        currentEvent = doc.data(); 
        showEventInfo(currentEvent);
        showSection('registration');

    } catch (error) {
        console.error("Lỗi khi lấy thông tin sự kiện: ", error);
    }
}

document.getElementById('registrationForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 
    
    const formData = new FormData(e.target);
    const registrationData = {
        eventName: currentEvent.name, 
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        tickets: parseInt(formData.get('tickets')),
        registeredAt: new Date() 
    };

    try {
       
        const docRef = await db.collection('registrations').add(registrationData);
        console.log("Đăng ký thành công với ID: ", docRef.id);

       
        const templateParams = {
            to_name: registrationData.fullName,
            to_email: registrationData.email,
            event_name: registrationData.eventName,
            tickets: registrationData.tickets,
            phone: registrationData.phone,
           
            eventLink: window.location.origin, 
            websiteLink: window.location.origin
        };

       
        await emailjs.send("service_bq163c9", "template_gfrrpqw", templateParams);

        console.log("Đã gửi email xác nhận tới:", registrationData.email);

        
        document.getElementById('successMessage').style.display = 'block';
        e.target.reset();
        document.getElementById('tickets').value = '1';
        
        setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
        }, 3000);

    } catch (error) {
        console.error("Lỗi khi gửi đăng ký hoặc email: ", error);
        alert("Đã xảy ra lỗi khi đăng ký hoặc gửi email. Vui lòng thử lại.");
    }
});


async function renderRegistrations() {
    const tableBody = document.getElementById('registrationsTable');
    
    tableBody.innerHTML = '<tr><td colspan="6">Đang tải dữ liệu...</td></tr>';

    try {
        const snapshot = await db.collection('registrations').orderBy('registeredAt', 'desc').get();

        if (snapshot.empty) {
            
            tableBody.innerHTML = '<tr><td colspan="6">Chưa có ai đăng ký.</td></tr>';
            return;
        }

        tableBody.innerHTML = ''; 
        
        snapshot.forEach(doc => {
            const reg = doc.data();
            const registrationId = doc.id; 
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${reg.eventName}</td>
                <td>${reg.fullName}</td>
                <td>${reg.email}</td>
                <td>${reg.phone}</td>
                <td>${reg.tickets}</td>
                <td>
                    <button class="btn-edit" onclick="editTicketCount('${registrationId}', ${reg.tickets})">Sửa vé</button>
                    <button class="btn-delete" onclick="deleteRegistration('${registrationId}')">Xóa</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Lỗi khi tải danh sách đăng ký: ", error);
        // Cập nhật colspan="6"
        tableBody.innerHTML = '<tr><td colspan="6">Không thể tải dữ liệu.</td></tr>';
    }
}



/**
 * Xóa một lượt đăng ký khỏi Firestore
 * @param {string} registrationId ID của tài liệu cần xóa
 */
async function deleteRegistration(registrationId) {
    // Hỏi xác nhận trước khi xóa
    if (confirm('Bạn có chắc chắn muốn xóa lượt đăng ký này?')) {
        try {
            await db.collection('registrations').doc(registrationId).delete();
            console.log('Đã xóa đăng ký thành công!');
            renderRegistrations(); // Tải lại bảng sau khi xóa
        } catch (error) {
            console.error("Lỗi khi xóa đăng ký: ", error);
            alert('Đã xảy ra lỗi khi xóa.');
        }
    }
}

/**
 * Sửa số lượng vé (dùng prompt cho đơn giản)
 * @param {string} registrationId 
 * @param {number} currentTickets 
 */
async function editTicketCount(registrationId, currentTickets) {
    const newTickets = prompt('Cập nhật số lượng vé:', currentTickets);
    
    
    if (newTickets === null || newTickets.trim() === '') {
        return; 
    }
    
    const numTickets = parseInt(newTickets);
    
    
    if (isNaN(numTickets) || numTickets <= 0) {
        alert('Vui lòng nhập một số vé hợp lệ (lớn hơn 0).');
        return;
    }

    try {
       
        await db.collection('registrations').doc(registrationId).update({
            tickets: numTickets
        });
        console.log('Đã cập nhật số vé!');
        renderRegistrations(); 
    } catch (error) {
        console.error("Lỗi khi cập nhật vé: ", error);
        alert('Đã xảy ra lỗi khi cập nhật.');
    }
}



function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function showEventInfo(event) {
    const eventDetails = document.getElementById('eventDetails');
    eventDetails.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">${event.icon}</div>
            <h4 style="color: #0A2540; margin-bottom: 1rem;">${event.name}</h4>
            <div style="color: #666; margin-bottom: 0.5rem;">
                <span>📅</span> ${formatDate(event.date)} - ${event.time}
            </div>
            <div style="color: #666;">
                <span>📍</span> ${event.location}
            </div>
        </div>
    `;
}

document.getElementById('searchBox').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#registrationsTable tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

function showSection(sectionName) {
    document.getElementById('homeSection').style.display = 'none';
    document.getElementById('registrationSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'none';

    switch(sectionName) {
        case 'home':
        case 'events':
            document.getElementById('homeSection').style.display = 'block';
            if (sectionName === 'events') {
                document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
            }
            break;
        case 'registration':
            document.getElementById('registrationSection').style.display = 'block';
            break;
        case 'dashboard':
            document.getElementById('dashboardSection').style.display = 'block';
            renderRegistrations(); 
            break;
    }
    document.getElementById('navMenu').classList.remove('active');
}

function toggleMenu() {
    document.getElementById('navMenu').classList.toggle('active');
}


init();