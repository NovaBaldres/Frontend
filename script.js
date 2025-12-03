// script.js
document.addEventListener('DOMContentLoaded', function() {
    // ====================
    // CONFIGURATION
    // ====================
    // Using localStorage as a mock database for demo purposes
    const STORAGE_KEYS = {
        GUESTS: 'hotel_guests',
        ROOMS: 'hotel_rooms',
        BOOKINGS: 'hotel_bookings'
    };
    
    // Mock data for initial setup
    const MOCK_DATA = {
        guests: [
            {
                _id: '1',
                name: 'John Smith',
                email: 'john@example.com',
                phone: '+1-555-123-4567',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    country: 'USA'
                }
            },
            {
                _id: '2',
                name: 'Emma Johnson',
                email: 'emma@example.com',
                phone: '+1-555-987-6543',
                address: {
                    street: '456 Oak Ave',
                    city: 'Los Angeles',
                    country: 'USA'
                }
            }
        ],
        rooms: [
            {
                _id: '101',
                number: '101',
                type: 'single',
                price: 120.00,
                capacity: 1,
                status: 'available',
                amenities: ['WiFi', 'TV', 'AC']
            },
            {
                _id: '102',
                number: '102',
                type: 'double',
                price: 180.00,
                capacity: 2,
                status: 'available',
                amenities: ['WiFi', 'TV', 'AC', 'Mini-bar']
            },
            {
                _id: '201',
                number: '201',
                type: 'suite',
                price: 300.00,
                capacity: 4,
                status: 'occupied',
                amenities: ['WiFi', 'TV', 'AC', 'Mini-bar', 'Jacuzzi']
            }
        ],
        bookings: [
            {
                _id: '1',
                guestId: '1',
                roomId: '201',
                checkIn: '2024-01-15',
                checkOut: '2024-01-20',
                status: 'checked-in',
                paymentStatus: 'paid',
                specialRequests: 'Extra pillows please',
                totalAmount: 1500.00
            }
        ]
    };
    
    // Initialize localStorage with mock data if empty
    function initializeStorage() {
        if (!localStorage.getItem(STORAGE_KEYS.GUESTS)) {
            localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(MOCK_DATA.guests));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ROOMS)) {
            localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(MOCK_DATA.rooms));
        }
        if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
            localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(MOCK_DATA.bookings));
        }
    }
    
    // State management
    let currentGuestPage = 1;
    let currentRoomPage = 1;
    let currentBookingPage = 1;
    const itemsPerPage = 5;
    let guests = [];
    let rooms = [];
    let bookings = [];
    let deleteCallback = null;
    let deleteId = null;
    let deleteType = null;
    
    // ====================
    // DOM ELEMENTS
    // ====================
    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Guests
    const guestTableBody = document.getElementById('guestTableBody');
    const guestForm = document.getElementById('guestForm');
    const guestFormTitle = document.getElementById('guestFormTitle');
    const guestIdInput = document.getElementById('guestId');
    const addGuestBtn = document.getElementById('addGuestBtn');
    const guestCancelBtn = document.getElementById('guestCancelBtn');
    const guestSearch = document.getElementById('guestSearch');
    const prevGuestsBtn = document.getElementById('prevGuests');
    const nextGuestsBtn = document.getElementById('nextGuests');
    const guestPageInfo = document.getElementById('guestPageInfo');
    
    // Rooms
    const roomTableBody = document.getElementById('roomTableBody');
    const roomForm = document.getElementById('roomForm');
    const roomFormTitle = document.getElementById('roomFormTitle');
    const roomIdInput = document.getElementById('roomId');
    const addRoomBtn = document.getElementById('addRoomBtn');
    const roomCancelBtn = document.getElementById('roomCancelBtn');
    const roomSearch = document.getElementById('roomSearch');
    const roomStatusFilter = document.getElementById('roomStatusFilter');
    const roomTypeFilter = document.getElementById('roomTypeFilter');
    const prevRoomsBtn = document.getElementById('prevRooms');
    const nextRoomsBtn = document.getElementById('nextRooms');
    const roomPageInfo = document.getElementById('roomPageInfo');
    
    // Bookings
    const bookingTableBody = document.getElementById('bookingTableBody');
    const bookingForm = document.getElementById('bookingForm');
    const bookingFormTitle = document.getElementById('bookingFormTitle');
    const bookingIdInput = document.getElementById('bookingId');
    const addBookingBtn = document.getElementById('addBookingBtn');
    const bookingCancelBtn = document.getElementById('bookingCancelBtn');
    const bookingSearch = document.getElementById('bookingSearch');
    const bookingStatusFilter = document.getElementById('bookingStatusFilter');
    const prevBookingsBtn = document.getElementById('prevBookings');
    const nextBookingsBtn = document.getElementById('nextBookings');
    const bookingPageInfo = document.getElementById('bookingPageInfo');
    
    // Booking form elements
    const bookingGuestSelect = document.getElementById('bookingGuest');
    const bookingRoomSelect = document.getElementById('bookingRoom');
    const checkInDate = document.getElementById('checkInDate');
    const checkOutDate = document.getElementById('checkOutDate');
    const roomInfo = document.getElementById('roomInfo');
    const roomPriceDisplay = document.getElementById('roomPriceDisplay');
    const nightsCount = document.getElementById('nightsCount');
    const totalAmount = document.getElementById('totalAmount');
    
    // Modal and Toast
    const toast = document.getElementById('toast');
    const deleteModal = document.getElementById('deleteModal');
    const deleteMessage = document.getElementById('deleteMessage');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    
    // ====================
    // EVENT LISTENERS SETUP
    // ====================
    
    function setupEventListeners() {
        // Navigation
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const sectionId = item.getAttribute('data-section');
                
                // Update active navigation item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Show corresponding section
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === sectionId) {
                        section.classList.add('active');
                    }
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                
                // Refresh data for the active section
                if (sectionId === 'guests') {
                    loadGuests(currentGuestPage);
                } else if (sectionId === 'rooms') {
                    loadRooms(currentRoomPage);
                } else if (sectionId === 'bookings') {
                    loadBookings(currentBookingPage);
                }
            });
        });
        
        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // Guest events
        addGuestBtn.addEventListener('click', () => showGuestForm());
        guestCancelBtn.addEventListener('click', () => resetGuestForm());
        guestForm.addEventListener('submit', handleGuestSubmit);
        guestSearch.addEventListener('input', searchGuests);
        prevGuestsBtn.addEventListener('click', () => changeGuestPage(-1));
        nextGuestsBtn.addEventListener('click', () => changeGuestPage(1));
        
        // Room events
        addRoomBtn.addEventListener('click', () => showRoomForm());
        roomCancelBtn.addEventListener('click', () => resetRoomForm());
        roomForm.addEventListener('submit', handleRoomSubmit);
        roomSearch.addEventListener('input', searchRooms);
        roomStatusFilter.addEventListener('change', filterRooms);
        roomTypeFilter.addEventListener('change', filterRooms);
        prevRoomsBtn.addEventListener('click', () => changeRoomPage(-1));
        nextRoomsBtn.addEventListener('click', () => changeRoomPage(1));
        
        // Booking events
        addBookingBtn.addEventListener('click', () => showBookingForm());
        bookingCancelBtn.addEventListener('click', () => resetBookingForm());
        bookingForm.addEventListener('submit', handleBookingSubmit);
        bookingSearch.addEventListener('input', searchBookings);
        bookingStatusFilter.addEventListener('change', filterBookings);
        prevBookingsBtn.addEventListener('click', () => changeBookingPage(-1));
        nextBookingsBtn.addEventListener('click', () => changeBookingPage(1));
        
        // Booking form dynamic updates
        bookingRoomSelect.addEventListener('change', updateRoomInfo);
        checkInDate.addEventListener('change', calculateBookingTotal);
        checkOutDate.addEventListener('change', calculateBookingTotal);
        
        // Modal events
        confirmDeleteBtn.addEventListener('click', handleDelete);
        cancelDeleteBtn.addEventListener('click', () => hideModal());
        
        // Set minimum date for check-in to today
        const today = new Date().toISOString().split('T')[0];
        checkInDate.min = today;
        
        // Set check-out to tomorrow by default
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        checkOutDate.value = tomorrow.toISOString().split('T')[0];
        checkOutDate.min = today;
    }
    
    // ====================
    // UTILITY FUNCTIONS
    // ====================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function showToast(message, type = 'success') {
        const toastIcon = toast.querySelector('.toast-icon');
        const toastMessage = toast.querySelector('.toast-message');
        
        // Update toast style based on type
        toast.classList.remove('success', 'error', 'warning');
        toast.classList.add(type);
        
        if (type === 'error') {
            toastIcon.className = 'fas fa-exclamation-circle toast-icon';
        } else if (type === 'warning') {
            toastIcon.className = 'fas fa-exclamation-triangle toast-icon';
        } else {
            toastIcon.className = 'fas fa-check-circle toast-icon';
        }
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    function showModal(message, callback, id, type) {
        deleteMessage.textContent = message;
        deleteCallback = callback;
        deleteId = id;
        deleteType = type;
        deleteModal.classList.add('show');
    }
    
    function hideModal() {
        deleteModal.classList.remove('show');
        deleteCallback = null;
        deleteId = null;
        deleteType = null;
    }
    
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // ====================
    // DATA STORAGE FUNCTIONS
    // ====================
    
    function getGuests() {
        const guestsData = localStorage.getItem(STORAGE_KEYS.GUESTS);
        return guestsData ? JSON.parse(guestsData) : [];
    }
    
    function saveGuests(guestsArray) {
        localStorage.setItem(STORAGE_KEYS.GUESTS, JSON.stringify(guestsArray));
    }
    
    function getRooms() {
        const roomsData = localStorage.getItem(STORAGE_KEYS.ROOMS);
        return roomsData ? JSON.parse(roomsData) : [];
    }
    
    function saveRooms(roomsArray) {
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(roomsArray));
    }
    
    function getBookings() {
        const bookingsData = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
        return bookingsData ? JSON.parse(bookingsData) : [];
    }
    
    function saveBookings(bookingsArray) {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookingsArray));
    }
    
    // ====================
    // GUEST MANAGEMENT
    // ====================
    
    function loadGuests(page = 1) {
        const allGuests = getGuests();
        const searchTerm = guestSearch.value.toLowerCase();
        
        // Filter guests based on search term
        let filteredGuests = allGuests;
        if (searchTerm) {
            filteredGuests = allGuests.filter(guest => 
                guest.name.toLowerCase().includes(searchTerm) ||
                guest.email.toLowerCase().includes(searchTerm) ||
                guest.phone.toLowerCase().includes(searchTerm)
            );
        }
        
        // Pagination
        const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        guests = filteredGuests.slice(startIndex, endIndex);
        
        currentGuestPage = page;
        guestPageInfo.textContent = `Page ${page} of ${totalPages || 1}`;
        prevGuestsBtn.disabled = page <= 1;
        nextGuestsBtn.disabled = page >= totalPages;
        
        renderGuests();
    }
    
    function renderGuests() {
        guestTableBody.innerHTML = '';
        
        if (guests.length === 0) {
            guestTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center">No guests found</td>
                </tr>
            `;
            return;
        }
        
        guests.forEach(guest => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${guest.name}</td>
                <td>${guest.email}</td>
                <td>${guest.phone}</td>
                <td>
                    <div class="actions">
                        <button class="action-btn edit-guest" data-id="${guest._id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-guest" data-id="${guest._id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            guestTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-guest').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                editGuest(btn.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.delete-guest').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const guestId = btn.getAttribute('data-id');
                const guestName = btn.closest('tr').querySelector('td:first-child').textContent;
                showModal(`Are you sure you want to delete guest "${guestName}"?`, 
                         confirmDeleteGuest, guestId, 'guest');
            });
        });
    }
    
    function searchGuests() {
        loadGuests(1);
    }
    
    function changeGuestPage(direction) {
        const newPage = currentGuestPage + direction;
        if (newPage >= 1) {
            loadGuests(newPage);
        }
    }
    
    function showGuestForm(guest = null) {
        guestFormTitle.textContent = guest ? 'Edit Guest' : 'Add New Guest';
        guestIdInput.value = guest ? guest._id : '';
        
        // Populate form fields if editing
        if (guest) {
            document.getElementById('guestName').value = guest.name || '';
            document.getElementById('guestEmail').value = guest.email || '';
            document.getElementById('guestPhone').value = guest.phone || '';
            document.getElementById('guestAddress').value = guest.address?.street || '';
            document.getElementById('guestCity').value = guest.address?.city || '';
            document.getElementById('guestCountry').value = guest.address?.country || '';
        } else {
            // Clear form for new guest
            guestForm.reset();
        }
        
        // Scroll to form
        document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function resetGuestForm() {
        guestForm.reset();
        guestIdInput.value = '';
        guestFormTitle.textContent = 'Add New Guest';
    }
    
    function editGuest(id) {
        const allGuests = getGuests();
        const guest = allGuests.find(g => g._id === id);
        if (guest) {
            showGuestForm(guest);
        } else {
            showToast('Guest not found', 'error');
        }
    }
    
    function handleGuestSubmit(e) {
        e.preventDefault();
        
        const guestData = {
            name: document.getElementById('guestName').value.trim(),
            email: document.getElementById('guestEmail').value.trim(),
            phone: document.getElementById('guestPhone').value.trim(),
            address: {
                street: document.getElementById('guestAddress').value.trim(),
                city: document.getElementById('guestCity').value.trim(),
                country: document.getElementById('guestCountry').value.trim()
            }
        };
        
        // Basic validation
        if (!guestData.name || !guestData.email || !guestData.phone) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        const guestId = guestIdInput.value;
        const allGuests = getGuests();
        
        try {
            if (guestId) {
                // Update existing guest
                const index = allGuests.findIndex(g => g._id === guestId);
                if (index !== -1) {
                    allGuests[index] = { ...allGuests[index], ...guestData };
                    saveGuests(allGuests);
                    showToast('Guest updated successfully!');
                }
            } else {
                // Create new guest
                const newGuest = {
                    _id: generateId(),
                    ...guestData
                };
                allGuests.push(newGuest);
                saveGuests(allGuests);
                showToast('Guest created successfully!');
            }
            
            resetGuestForm();
            loadGuests(currentGuestPage);
        } catch (error) {
            console.error('Error saving guest:', error);
            showToast('Failed to save guest. Please try again.', 'error');
        }
    }
    
    function confirmDeleteGuest() {
        try {
            const allGuests = getGuests();
            const filteredGuests = allGuests.filter(guest => guest._id !== deleteId);
            saveGuests(filteredGuests);
            
            showToast('Guest deleted successfully!');
            hideModal();
            loadGuests(currentGuestPage);
        } catch (error) {
            showToast('Failed to delete guest. Please try again.', 'error');
        }
    }
    
    // ====================
    // ROOM MANAGEMENT
    // ====================
    
    function loadRooms(page = 1) {
        const allRooms = getRooms();
        const searchTerm = roomSearch.value.toLowerCase();
        const statusFilter = roomStatusFilter.value;
        const typeFilter = roomTypeFilter.value;
        
        // Filter rooms based on search term and filters
        let filteredRooms = allRooms;
        
        if (searchTerm) {
            filteredRooms = filteredRooms.filter(room => 
                room.number.toLowerCase().includes(searchTerm) ||
                room.type.toLowerCase().includes(searchTerm)
            );
        }
        
        if (statusFilter) {
            filteredRooms = filteredRooms.filter(room => room.status === statusFilter);
        }
        
        if (typeFilter) {
            filteredRooms = filteredRooms.filter(room => room.type === typeFilter);
        }
        
        // Pagination
        const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        rooms = filteredRooms.slice(startIndex, endIndex);
        
        currentRoomPage = page;
        roomPageInfo.textContent = `Page ${page} of ${totalPages || 1}`;
        prevRoomsBtn.disabled = page <= 1;
        nextRoomsBtn.disabled = page >= totalPages;
        
        renderRooms();
    }
    
    function renderRooms() {
        roomTableBody.innerHTML = '';
        
        if (rooms.length === 0) {
            roomTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No rooms found</td>
                </tr>
            `;
            return;
        }
        
        rooms.forEach(room => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${room.number}</td>
                <td>${room.type}</td>
                <td>$${room.price.toFixed(2)}</td>
                <td><span class="status status-${room.status}">${room.status}</span></td>
                <td>${room.capacity}</td>
                <td>
                    <div class="actions">
                        <button class="action-btn edit-room" data-id="${room._id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-room" data-id="${room._id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            roomTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-room').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                editRoom(btn.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.delete-room').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const roomId = btn.getAttribute('data-id');
                const roomNumber = btn.closest('tr').querySelector('td:first-child').textContent;
                showModal(`Are you sure you want to delete room ${roomNumber}?`, 
                         confirmDeleteRoom, roomId, 'room');
            });
        });
    }
    
    function searchRooms() {
        loadRooms(1);
    }
    
    function filterRooms() {
        loadRooms(1);
    }
    
    function changeRoomPage(direction) {
        const newPage = currentRoomPage + direction;
        if (newPage >= 1) {
            loadRooms(newPage);
        }
    }
    
    function showRoomForm(room = null) {
        roomFormTitle.textContent = room ? 'Edit Room' : 'Add New Room';
        roomIdInput.value = room ? room._id : '';
        
        // Populate form fields if editing
        if (room) {
            document.getElementById('roomNumber').value = room.number || '';
            document.getElementById('roomType').value = room.type || '';
            document.getElementById('roomPrice').value = room.price || '';
            document.getElementById('roomCapacity').value = room.capacity || '';
            document.getElementById('roomStatus').value = room.status || 'available';
            document.getElementById('roomAmenities').value = room.amenities ? room.amenities.join(', ') : '';
        } else {
            // Clear form for new room
            roomForm.reset();
            document.getElementById('roomStatus').value = 'available';
        }
        
        // Scroll to form
        document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function resetRoomForm() {
        roomForm.reset();
        roomIdInput.value = '';
        roomFormTitle.textContent = 'Add New Room';
        document.getElementById('roomStatus').value = 'available';
    }
    
    function editRoom(id) {
        const allRooms = getRooms();
        const room = allRooms.find(r => r._id === id);
        if (room) {
            showRoomForm(room);
        } else {
            showToast('Room not found', 'error');
        }
    }
    
    function handleRoomSubmit(e) {
        e.preventDefault();
        
        const roomData = {
            number: document.getElementById('roomNumber').value.trim(),
            type: document.getElementById('roomType').value,
            price: parseFloat(document.getElementById('roomPrice').value),
            capacity: parseInt(document.getElementById('roomCapacity').value),
            status: document.getElementById('roomStatus').value,
            amenities: document.getElementById('roomAmenities').value 
                ? document.getElementById('roomAmenities').value.split(',').map(item => item.trim())
                : []
        };
        
        // Basic validation
        if (!roomData.number || !roomData.type || isNaN(roomData.price) || isNaN(roomData.capacity)) {
            showToast('Please fill in all required fields correctly', 'error');
            return;
        }
        
        const roomId = roomIdInput.value;
        const allRooms = getRooms();
        
        try {
            if (roomId) {
                // Update existing room
                const index = allRooms.findIndex(r => r._id === roomId);
                if (index !== -1) {
                    allRooms[index] = { ...allRooms[index], ...roomData };
                    saveRooms(allRooms);
                    showToast('Room updated successfully!');
                }
            } else {
                // Create new room
                const newRoom = {
                    _id: generateId(),
                    ...roomData
                };
                allRooms.push(newRoom);
                saveRooms(allRooms);
                showToast('Room created successfully!');
            }
            
            resetRoomForm();
            loadRooms(currentRoomPage);
            // Also refresh booking room dropdown
            loadRoomsForBooking();
        } catch (error) {
            console.error('Error saving room:', error);
            showToast('Failed to save room. Please try again.', 'error');
        }
    }
    
    function confirmDeleteRoom() {
        try {
            const allRooms = getRooms();
            const filteredRooms = allRooms.filter(room => room._id !== deleteId);
            saveRooms(filteredRooms);
            
            showToast('Room deleted successfully!');
            hideModal();
            loadRooms(currentRoomPage);
            loadRoomsForBooking();
        } catch (error) {
            showToast('Failed to delete room. Please try again.', 'error');
        }
    }
    
    // ====================
    // BOOKING MANAGEMENT
    // ====================
    
    function loadBookings(page = 1) {
        const allBookings = getBookings();
        const allGuests = getGuests();
        const allRooms = getRooms();
        const searchTerm = bookingSearch.value.toLowerCase();
        const statusFilter = bookingStatusFilter.value;
        
        // Enrich bookings with guest and room data
        const enrichedBookings = allBookings.map(booking => {
            const guest = allGuests.find(g => g._id === booking.guestId);
            const room = allRooms.find(r => r._id === booking.roomId);
            return {
                ...booking,
                guestId: guest || { _id: booking.guestId, name: 'Unknown Guest' },
                roomId: room || { _id: booking.roomId, number: 'Unknown Room' }
            };
        });
        
        // Filter bookings
        let filteredBookings = enrichedBookings;
        
        if (searchTerm) {
            filteredBookings = filteredBookings.filter(booking => 
                (booking.guestId.name || '').toLowerCase().includes(searchTerm) ||
                (booking.roomId.number || '').toLowerCase().includes(searchTerm)
            );
        }
        
        if (statusFilter) {
            filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
        }
        
        // Pagination
        const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        bookings = filteredBookings.slice(startIndex, endIndex);
        
        currentBookingPage = page;
        bookingPageInfo.textContent = `Page ${page} of ${totalPages || 1}`;
        prevBookingsBtn.disabled = page <= 1;
        nextBookingsBtn.disabled = page >= totalPages;
        
        renderBookings();
    }
    
    function renderBookings() {
        bookingTableBody.innerHTML = '';
        
        if (bookings.length === 0) {
            bookingTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No bookings found</td>
                </tr>
            `;
            return;
        }
        
        bookings.forEach(booking => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${booking.guestId?.name || 'N/A'}</td>
                <td>${booking.roomId?.number || 'N/A'}</td>
                <td>${formatDate(booking.checkIn)}</td>
                <td>${formatDate(booking.checkOut)}</td>
                <td><span class="status status-${booking.status}">${booking.status}</span></td>
                <td>
                    <div class="actions">
                        <button class="action-btn edit-booking" data-id="${booking._id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete-booking" data-id="${booking._id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            bookingTableBody.appendChild(row);
        });
        
        // Add event listeners to action buttons
        document.querySelectorAll('.edit-booking').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                editBooking(btn.getAttribute('data-id'));
            });
        });
        
        document.querySelectorAll('.delete-booking').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const bookingId = btn.getAttribute('data-id');
                const guestName = btn.closest('tr').querySelector('td:first-child').textContent;
                showModal(`Are you sure you want to delete booking for "${guestName}"?`, 
                         confirmDeleteBooking, bookingId, 'booking');
            });
        });
    }
    
    function searchBookings() {
        loadBookings(1);
    }
    
    function filterBookings() {
        loadBookings(1);
    }
    
    function changeBookingPage(direction) {
        const newPage = currentBookingPage + direction;
        if (newPage >= 1) {
            loadBookings(newPage);
        }
    }
    
    function loadGuestsForBooking() {
        const allGuests = getGuests();
        bookingGuestSelect.innerHTML = '<option value="">Select Guest</option>';
        
        allGuests.forEach(guest => {
            const option = document.createElement('option');
            option.value = guest._id;
            option.textContent = `${guest.name} (${guest.email})`;
            bookingGuestSelect.appendChild(option);
        });
    }
    
    function loadRoomsForBooking() {
        const allRooms = getRooms();
        bookingRoomSelect.innerHTML = '<option value="">Select Room</option>';
        
        // Only show available rooms for new bookings
        const availableRooms = allRooms.filter(room => room.status === 'available');
        
        availableRooms.forEach(room => {
            const option = document.createElement('option');
            option.value = room._id;
            option.textContent = `${room.number} - ${room.type} ($${room.price}/night)`;
            option.dataset.price = room.price;
            option.dataset.type = room.type;
            option.dataset.capacity = room.capacity;
            bookingRoomSelect.appendChild(option);
        });
    }
    
    function updateRoomInfo() {
        const selectedOption = bookingRoomSelect.options[bookingRoomSelect.selectedIndex];
        
        if (selectedOption.value) {
            const price = selectedOption.dataset.price;
            const type = selectedOption.dataset.type;
            const capacity = selectedOption.dataset.capacity;
            
            roomInfo.innerHTML = `
                <div><strong>Type:</strong> ${type}</div>
                <div><strong>Price per night:</strong> $${price}</div>
                <div><strong>Capacity:</strong> ${capacity} person(s)</div>
            `;
            
            roomPriceDisplay.textContent = `$${price}`;
            calculateBookingTotal();
        } else {
            roomInfo.innerHTML = '';
            roomPriceDisplay.textContent = '$0';
            totalAmount.textContent = '$0';
            nightsCount.textContent = '0';
        }
    }
    
    function calculateBookingTotal() {
        const selectedOption = bookingRoomSelect.options[bookingRoomSelect.selectedIndex];
        const checkIn = new Date(checkInDate.value);
        const checkOut = new Date(checkOutDate.value);
        
        if (selectedOption && selectedOption.value && checkInDate.value && checkOutDate.value && checkOut > checkIn) {
            const price = parseFloat(selectedOption.dataset.price);
            const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
            
            nightsCount.textContent = nights;
            totalAmount.textContent = `$${(price * nights).toFixed(2)}`;
        } else {
            nightsCount.textContent = '0';
            totalAmount.textContent = '$0';
        }
    }
    
    function showBookingForm(booking = null) {
        bookingFormTitle.textContent = booking ? 'Edit Booking' : 'Create New Booking';
        bookingIdInput.value = booking ? booking._id : '';
        
        // Load guests and rooms for dropdowns
        loadGuestsForBooking();
        loadRoomsForBooking();
        
        // Populate form fields if editing
        if (booking) {
            // Use setTimeout to ensure dropdowns are populated first
            setTimeout(() => {
                bookingGuestSelect.value = booking.guestId?._id || booking.guestId;
                
                // Load all rooms for editing (not just available ones)
                const allRooms = getRooms();
                bookingRoomSelect.innerHTML = '<option value="">Select Room</option>';
                allRooms.forEach(room => {
                    const option = document.createElement('option');
                    option.value = room._id;
                    option.textContent = `${room.number} - ${room.type} ($${room.price}/night)`;
                    option.dataset.price = room.price;
                    option.dataset.type = room.type;
                    option.dataset.capacity = room.capacity;
                    if (room._id === booking.roomId?._id || room._id === booking.roomId) {
                        option.selected = true;
                    }
                    bookingRoomSelect.appendChild(option);
                });
                
                // Update room info after selecting room
                setTimeout(() => {
                    updateRoomInfo();
                    
                    // Set dates
                    checkInDate.value = booking.checkIn ? new Date(booking.checkIn).toISOString().split('T')[0] : '';
                    checkOutDate.value = booking.checkOut ? new Date(booking.checkOut).toISOString().split('T')[0] : '';
                    
                    // Set other fields
                    document.getElementById('bookingStatus').value = booking.status || 'confirmed';
                    document.getElementById('paymentStatus').value = booking.paymentStatus || 'pending';
                    document.getElementById('specialRequests').value = booking.specialRequests || '';
                    
                    // Calculate total
                    calculateBookingTotal();
                }, 100);
            }, 100);
        } else {
            // Clear form for new booking
            bookingForm.reset();
            roomInfo.innerHTML = '';
            roomPriceDisplay.textContent = '$0';
            nightsCount.textContent = '0';
            totalAmount.textContent = '$0';
            document.getElementById('bookingStatus').value = 'confirmed';
            document.getElementById('paymentStatus').value = 'pending';
            
            // Set default dates
            const today = new Date().toISOString().split('T')[0];
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            checkInDate.value = today;
            checkOutDate.value = tomorrow.toISOString().split('T')[0];
        }
        
        // Scroll to form
        document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    function resetBookingForm() {
        bookingForm.reset();
        bookingIdInput.value = '';
        bookingFormTitle.textContent = 'Create New Booking';
        roomInfo.innerHTML = '';
        roomPriceDisplay.textContent = '$0';
        nightsCount.textContent = '0';
        totalAmount.textContent = '$0';
        document.getElementById('bookingStatus').value = 'confirmed';
        document.getElementById('paymentStatus').value = 'pending';
        
        // Reset dates to default
        const today = new Date().toISOString().split('T')[0];
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        checkInDate.value = today;
        checkOutDate.value = tomorrow.toISOString().split('T')[0];
        
        // Reload room dropdown with available rooms only
        loadRoomsForBooking();
    }
    
    function editBooking(id) {
        const allBookings = getBookings();
        const booking = allBookings.find(b => b._id === id);
        if (booking) {
            showBookingForm(booking);
        } else {
            showToast('Booking not found', 'error');
        }
    }
    
    function handleBookingSubmit(e) {
        e.preventDefault();
        
        const bookingData = {
            guestId: bookingGuestSelect.value,
            roomId: bookingRoomSelect.value,
            checkIn: checkInDate.value,
            checkOut: checkOutDate.value,
            status: document.getElementById('bookingStatus').value,
            paymentStatus: document.getElementById('paymentStatus').value,
            specialRequests: document.getElementById('specialRequests').value.trim(),
            totalAmount: parseFloat(totalAmount.textContent.replace('$', '')) || 0
        };
        
        // Basic validation
        if (!bookingData.guestId || !bookingData.roomId || !bookingData.checkIn || !bookingData.checkOut) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        const checkInDateObj = new Date(bookingData.checkIn);
        const checkOutDateObj = new Date(bookingData.checkOut);
        if (checkOutDateObj <= checkInDateObj) {
            showToast('Check-out date must be after check-in date', 'error');
            return;
        }
        
        const bookingId = bookingIdInput.value;
        const allBookings = getBookings();
        
        try {
            if (bookingId) {
                // Update existing booking
                const index = allBookings.findIndex(b => b._id === bookingId);
                if (index !== -1) {
                    allBookings[index] = { ...allBookings[index], ...bookingData };
                    saveBookings(allBookings);
                    showToast('Booking updated successfully!');
                }
            } else {
                // Create new booking
                const newBooking = {
                    _id: generateId(),
                    ...bookingData
                };
                allBookings.push(newBooking);
                saveBookings(allBookings);
                showToast('Booking created successfully!');
            }
            
            resetBookingForm();
            loadBookings(currentBookingPage);
        } catch (error) {
            console.error('Error saving booking:', error);
            showToast('Failed to save booking. Please try again.', 'error');
        }
    }
    
    function confirmDeleteBooking() {
        try {
            const allBookings = getBookings();
            const filteredBookings = allBookings.filter(booking => booking._id !== deleteId);
            saveBookings(filteredBookings);
            
            showToast('Booking deleted successfully!');
            hideModal();
            loadBookings(currentBookingPage);
        } catch (error) {
            showToast('Failed to delete booking. Please try again.', 'error');
        }
    }
    
    function handleDelete() {
        if (deleteCallback && deleteId) {
            if (deleteType === 'guest') {
                confirmDeleteGuest();
            } else if (deleteType === 'room') {
                confirmDeleteRoom();
            } else if (deleteType === 'booking') {
                confirmDeleteBooking();
            }
        }
    }
    
    // ====================
    // INITIALIZATION
    // ====================
    
    async function init() {
        // Initialize localStorage with mock data
        initializeStorage();
        
        // Setup all event listeners
        setupEventListeners();
        
        // Load initial data
        loadGuests();
        loadRooms();
        loadBookings();
        
        // Show welcome message
        setTimeout(() => {
            showToast('Hotel Management System loaded successfully! Click on any button to test functionality.');
        }, 500);
    }
    
    // Start the application
    init();
});