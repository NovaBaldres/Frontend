## Base URL Frontend: https://frontend-rouge-one-99.vercel.app/
## Base URL Backend: https://hotel-management-9-egfa.onrender.com

# 📋 Api Endpoints
```
GET    /api/guests        - Get all guests
POST   /api/guests        - Create new guest
GET    /api/guests/:id    - Get specific guest
PUT    /api/guests/:id    - Update guest
DELETE /api/guests/:id    - Delete guest

GET    /api/rooms         - Get all rooms
POST   /api/rooms         - Create new room
GET    /api/rooms/:id     - Get specific room
PUT    /api/rooms/:id     - Update room
DELETE /api/rooms/:id     - Delete room

GET    /api/bookings      - Get all bookings
POST   /api/bookings      - Create new booking
GET    /api/bookings/:id  - Get specific booking
PUT    /api/bookings/:id  - Update booking
DELETE /api/bookings/:id  - Delete booking
```
# 🔄 CRUD Operations
## 👥 Guests

* Create: guestForm submit → handleGuestSubmit()

* Read: loadGuests() → populates guestTableBody

* Update: editGuest(id) → showGuestForm() → handleGuestSubmit()

* Delete: confirmDeleteGuest(id) → removes from array

## 🛏️ Rooms

* Create: roomForm submit → handleRoomSubmit()

* Read: loadRooms() → populates roomTableBody

* Update: editRoom(id) → showRoomForm() → handleRoomSubmit()

* Delete: confirmDeleteRoom(id) → removes from array

## 📅 Bookings

* Create: bookingForm submit → handleBookingSubmit()

* Read: loadBookings() → populates bookingTableBody

* Update: editBooking(id) → showBookingForm() → handleBookingSubmit()

* Delete: confirmDeleteBooking(id) → removes from array


# 🎯 Features

* Responsive Design: Works on desktop, tablet, and mobile

* Real-time Validation: Form validation with user feedback

* Pagination: Handles large datasets efficiently

* Search & Filter: Find records quickly

* Toast Notifications: User feedback for actions

* Confirmation Dialogs: Prevent accidental deletions

# 📸 Screenshot Frontend
<img width="840" height="632" alt="Screenshot 2025-12-03 163229" src="https://github.com/user-attachments/assets/4c203dd2-2566-4324-9df6-b3e7f867e914" />
<img width="836" height="628" alt="Screenshot 2025-12-03 163033" src="https://github.com/user-attachments/assets/94dbf00b-c2eb-4131-842c-771d7301d9b7" />
<img width="840" height="619" alt="Screenshot 2025-12-03 162905" src="https://github.com/user-attachments/assets/0907088f-9244-442e-93f6-0daaa69541ab" />





