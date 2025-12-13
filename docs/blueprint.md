# **App Name**: FenceSync

## Core Features:

- Real-time Status Display (Admin): Displays the current electric fence status (Legal/Illegal) on the Admin Panel, fetched in real-time from Firebase.
- Real-time Status Display (User): Displays the current electric fence status (Legal/Illegal) on the User Dashboard, updating in real-time based on changes in Firebase.
- Status Control: Provides two buttons on the Admin Panel to actively write the electric fence status (Legal/Illegal) to Firebase.
- Visual Alert: Displays a prominent visual alert (color change) on the User Dashboard that instantly reflects the fence status.
- Static Information Display: Displays pre-stored, static sensor information (e.g., temperature, smoke detection) on both Admin Panel and User Dashboard, fetched once from Firebase.
- Data synchronization: Use Firestore to synchronize database node across admin panel and user dashboard in real time.

## Style Guidelines:

- Primary color: Dark indigo (#4B0082) to evoke a sense of security and control.
- Background color: Light gray (#F0F0F0) for a clean and modern look on the Admin Panel; Dark gray (#333333) for a serious and attention-grabbing feel on the User Dashboard.
- Accent color: Bright lime green (#32CD32) for 'Legal' status and stark red (#FF0000) for 'Illegal' status.
- Headline font: 'Space Grotesk' (sans-serif) for a techy feel, used for titles and important status messages.
- Body font: 'Inter' (sans-serif) used for sensor information and button labels for a readable and neutral feel.
- Use simple, clear icons for the control buttons on the Admin Panel (e.g., a lock icon for 'Legal', an alert icon for 'Illegal').
- Admin Panel: Mobile-first design with prominent, easy-to-tap buttons. User Dashboard: Clear, full-screen status display for immediate awareness.