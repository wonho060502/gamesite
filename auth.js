/* auth.js - 공통 로그인/세션 처리 파일
   사용법:
   1) 모든 페이지의 <head>에 Supabase SDK 추가:
      <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   2) body 끝에 이 파일 포함:
      <script src="/auth.js"></script>
   (auth.js가 DOMContentLoaded에서 loginArea를 찾으므로 body 끝이든 head든 상관없지만,
    SDK는 항상 먼저 로드되어야 함.)
*/

/* -------------------------
   1) Supabase 클라이언트 안전하게 생성 (중복 방지)
   ------------------------- */
if (!window.supabaseClient) {
  window.supabaseClient = window.supabase.createClient(
    "https://sayfpvdocukafwetgsms.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNheWZwdmRvY3VrYWZ3ZXRnc21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwMjE1MTcsImV4cCI6MjA3OTU5NzUxN30.O6XxpBntdKb8mYIW3E94YeR6eaGtNxxzO3vs4u6t32g"
  );
}

/* 전역 상태(다른 스크립트에서 사용 가능) */
window.isLoggedIn = false;

/* -------------------------
   유틸: 세션 조회 및 프로필(nickname) 가져오기
   반환: { isLoggedIn: boolean, nickname: string|null }
   ------------------------- */
async function getUserSession() {
  try {
    // supabaseClient 사용 (auth.js에서 생성됨)
    const { data: { session } } = await window.supabaseClient.auth.getSession();

    if (!session) {
      return { isLoggedIn: false, nickname: null };
    }

    // profiles 테이블에서 nickname 가져오기 (있으면 사용, 없으면 이메일)
    const { data, error } = await window.supabaseClient
      .from("profiles")
      .select("nickname")
      .eq("id", session.user.id)
      .single();

    const nickname = data?.nickname ?? session.user.email ?? null;
    return { isLoggedIn: true, nickname };
  } catch (err) {
    console.error("세션 오류:", err);
    return { isLoggedIn: false, nickname: null };
  }
}

/* -------------------------
   로그아웃
   ------------------------- */
async function logout() {
  try {
    await window.supabaseClient.auth.signOut();
  } catch (err) {
    console.error("로그아웃 실패:", err);
  }
  // 로그아웃 후 UI 갱신
  await updateLoginArea();
}

/* -------------------------
   로그인 영역 업데이트
   - 페이지에 id="loginArea" 요소가 있어야 함
   ------------------------- */
async function updateLoginArea() {
  const loginArea = document.getElementById("loginArea");
  if (!loginArea) return; // 해당 페이지에 loginArea가 없으면 무시

  const userData = await getUserSession();
  window.isLoggedIn = userData.isLoggedIn; // 전역 상태 반영

  if (userData.isLoggedIn) {
    loginArea.innerHTML = `
      <span class="username">${escapeHtml(userData.nickname)}</span>
      <button id="logoutBtn" class="logout-btn">로그아웃</button>
    `;
    const btn = document.getElementById("logoutBtn");
    if (btn) btn.addEventListener("click", logout);
  } else {
    loginArea.innerHTML = `
      <a href="/login/login.html" class="login-btn">로그인</a>
      <a href="/login/signup.html" class="login-btn">회원가입</a>
    `;
  }
}


function escapeHtml(unsafe) {
  if (!unsafe && unsafe !== 0) return "";
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


document.addEventListener("DOMContentLoaded", () => {
  updateLoginArea();
});


window.getUserSession = getUserSession;
window.updateLoginArea = updateLoginArea;
window.logout = logout;
