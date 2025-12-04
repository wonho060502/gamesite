// ================= 로그인 상태 확인 + 로그아웃 기능 =================
async function getUserSession() {
    // 실제 서버 API 호출 필요
    // 예: return await fetch('/api/session', { credentials: 'include' }).then(res => res.json());
    return {
        isLoggedIn: true,
        nickname: "홍길동"
    };
}

async function logout() {
    try {
        // 서버 로그아웃 호출
        // 예: await fetch('/api/logout', { method: 'POST', credentials: 'include' });
        console.log("로그아웃 완료"); 
    } catch(err) {
        console.error("로그아웃 실패:", err);
    }
}

async function updateLoginArea() {
    const user = await getUserSession();
    const loginArea = document.getElementById("loginArea");

    if(user.isLoggedIn) {
        loginArea.innerHTML = `
            <span class="nickname">안녕하세요, ${user.nickname}님</span>
            <button id="logoutBtn" class="login-btn">로그아웃</button>
        `;
        document.getElementById("logoutBtn").addEventListener("click", async () => {
            await logout();
            updateLoginArea();
        });
    } else {
        loginArea.innerHTML = `
            <a href="login/login.html" class="login-btn">로그인</a>
            <a href="login/signup.html" class="login-btn">회원가입</a>
        `;
    }
}

updateLoginArea();

// ================= 이벤트 슬라이더 =================
function scrollSlider(direction) {
    const slider = document.getElementById('eventSlider');
    const scrollAmount = 340;
    slider.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// ================= Hero 비디오 슬라이드 =================
const slides = [
    { video: "img/god.mp4", title: "5번 째 월즈 우승", desc: "2025 월즈 우승 T1" },
    { video: "img/zaen.mp4", title: "신캐 갓 자헨", desc: "대단한" },
    { video: "img/slice3.mp4", title: "직접 등장한 그녀의 정체", desc: "레전드 of 레전드" },  
];

let currentIndex = 0;
const videoElement = document.getElementById("heroVideo");
const heroCount = document.getElementById("heroCount");
const heroTitle = document.getElementById("heroTitle");
const heroDesc = document.getElementById("heroDesc");

function updateHero() {
    const slide = slides[currentIndex];
    videoElement.classList.add("fade-out");
    setTimeout(() => {
        videoElement.querySelector("source").src = slide.video;
        videoElement.load();
        videoElement.play();
        heroTitle.textContent = slide.title;
        heroDesc.textContent = slide.desc;
        heroCount.textContent = `${currentIndex + 1} / ${slides.length}`;
        videoElement.classList.remove("fade-out");
        currentIndex = (currentIndex + 1) % slides.length;
    }, 1000); 
}

setInterval(updateHero, 5000);
