# TODO: Fix Register and Login Logic to Connect to Home Page

## Completed Tasks
- [x] Wrap App with AuthProvider in main.jsx
- [x] Update AuthContext to dispatch 'auth:changed' event on login/logout
- [x] Update RegisterPage to use AuthContext's login function
- [x] Update LoginPage to use AuthContext's login function and fix email field
- [x] Update Navbar to use AuthContext instead of localStorage and events
- [x] Remove unnecessary useEffect from Navbar

## Followup Steps
- [ ] Test the registration flow: register -> should login and redirect to home
- [ ] Test the login flow: login -> should redirect to home and stay logged in
- [ ] Test logout: should clear auth state and redirect to home
- [ ] Verify navbar shows user info correctly after auth
