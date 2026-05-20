const app = (() => {
  const pagesRequiringAuth = ['dashboard', 'orders', 'fleet', 'inventory', 'reports', 'role-selection'];

  function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  function getUserEmail() {
    return localStorage.getItem('userEmail') || 'User';
  }

  function getUserRole() {
    return localStorage.getItem('userRole') || '';
  }

  function getUserInitial() {
    const email = getUserEmail();
    return email.charAt(0).toUpperCase();
  }

  function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
  }

  function protectPage(pageName) {
    if (!isLoggedIn()) {
      window.location.href = 'index.html';
      return;
    }

    if (pageName === 'role-selection') {
      return;
    }

    if (!getUserRole()) {
      window.location.href = 'role-selection.html';
      return;
    }
  }

  function pageTitle(title) {
    const el = document.querySelector('.page-title');
    if (el) {
      el.textContent = title;
    }
  }

  function renderHeader() {
    const emailNode = document.querySelector('.user-email');
    const roleNode = document.querySelector('.user-role');
    const avatar = document.querySelector('.profile-avatar');
    if (emailNode) emailNode.textContent = getUserEmail();
    if (roleNode) roleNode.textContent = getUserRole();
    if (avatar) avatar.textContent = getUserInitial();
  }

  function highlightNav() {
    const page = document.body.dataset.page;
    if (!page) return;
    const item = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (item) item.classList.add('active');
  }

  function bindLogout() {
    const logoutBtn = document.querySelectorAll('.logout-btn');
    logoutBtn.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
    });
  }

  function init() {
    const page = document.body.dataset.page;
    if (!page) return;
    protectPage(page);
    renderHeader();
    highlightNav();
    bindLogout();
  }

  return { init };
})();

window.addEventListener('DOMContentLoaded', () => app.init());
