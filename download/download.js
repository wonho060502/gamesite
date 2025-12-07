// 로그인 상태를 추적하는 변수
let isLoggedIn = false;

// 모달 요소 가져오기
const modal = document.getElementById("downloadModal");
const fileNameToDownload = document.getElementById("fileNameToDownload");
const actionConfirm = document.getElementById("actionConfirm");
const actionCancel = document.getElementById("actionCancel");

// 다운로드 버튼 UI 업데이트 함수
function updateDownloadUI() {
  const loginBtn = document.querySelector(".login-btn");
  const downloadBtn = document.getElementById("downloadBtn");

  // 로그인 버튼 상태 업데이트
  if (loginBtn) {
    loginBtn.textContent = isLoggedIn ? "로그아웃" : "로그인";
  }

  // 다운로드 버튼 상태 업데이트
  if (downloadBtn) {
    downloadBtn.style.backgroundColor = isLoggedIn ? "#556df7" : "gray";
    downloadBtn.style.color = "white";
    downloadBtn.disabled = !isLoggedIn;
  }
}

// 모달을 열어 파일명 설정
function openModal(fileName) {
  fileNameToDownload.textContent = `다운로드할 파일: ${fileName}`;
  modal.style.display = "block";
}

// 모달 닫기
function closeModal() {
  modal.style.display = "none";
}

// 다운로드 버튼 클릭 시
const downloadBtn = document.getElementById("downloadBtn");
if (downloadBtn) {
  downloadBtn.addEventListener("click", function () {
    if (!isLoggedIn) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }

    openModal("ex 웹사이트 디자인.zip");
  });
}

// 확인 버튼 클릭 시 파일 다운로드
actionConfirm.addEventListener("click", function () {
  const link = document.createElement("a");
  link.href = "/File/테스트파일.zip";
  link.download = "테스트파일.zip";
  link.click();
  closeModal();
});

// 취소 버튼 클릭 시 모달 닫기
actionCancel.addEventListener("click", closeModal);

/* ------------------------------
   🎯 Supabase 로그인 연동
--------------------------------*/
async function getUserSession() {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      return { isLoggedIn: false, nickname: null };
    }

    const user = data.user;

    return {
      isLoggedIn: true,
      nickname: user.email || "사용자",
    };
  } catch (err) {
    console.error("세션 조회 실패:", err);
    return { isLoggedIn: false, nickname: null };
  }
}

async function logout() {
  await supabase.auth.signOut();
  updateLoginArea();
}

/* ----------------------------------
   🎯 로그인 영역 UI 동기화 (핵심 수정)
------------------------------------*/
async function updateLoginArea() {
  const userData = await getUserSession();
  const loginArea = document.getElementById("loginArea");
  if (!loginArea) return;

  // ⭐ Supabase 로그인 상태 → isLoggedIn에 반영 (가장 중요)
  isLoggedIn = userData.isLoggedIn;

  // ⭐ 다운로드 버튼도 즉시 반영
  updateDownloadUI();

  if (userData.isLoggedIn) {
    loginArea.innerHTML = `
      <span class="nickname">안녕하세요, ${userData.nickname}님</span>
      <button id="logoutBtn" class="login-btn">로그아웃</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click", logout);

  } else {
    loginArea.innerHTML = `
      <a href="login/login.html" class="login-btn">로그인</a>
      <a href="login/signup.html" class="login-btn">회원가입</a>
    `;
  }
}

/* -------------------------------------------------------------------------
   🎯 페이지 로딩 시 Supabase 세션 기반으로 UI 전체 초기화 (핵심 수정)
---------------------------------------------------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  updateLoginArea(); // Supabase 로그인 상태 가져와 전체 UI 동기화
});
