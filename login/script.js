const supabase = window.supabaseClient;

document.getElementById("signupForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value.trim();
    let username = document.getElementById("signupId").value.trim();
    const password = document.getElementById("signupPw").value;
    const passwordConfirm = document.getElementById("signupPwConfirm").value;
    const nickname = document.getElementById("signupName").value.trim();

    // username 필터링 (영문, 숫자, 밑줄만 허용)
    username = username.replace(/[^\w]/g, "");
    if (!username) {
        alert("아이디는 영문, 숫자, 밑줄(_)만 사용할 수 있습니다.");
        return;
    }

    if (password !== passwordConfirm) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
    }

    try {
        // 🔹 Step 1: 회원가입 (이메일 인증)
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: email,
            password: password
        });

        if (authError) {
            alert("회원가입 실패: " + authError.message);
            console.error(authError);
            return;
        }

        const userId = authData.user?.id;
        if (!userId) {
            alert("회원가입은 완료되었으나 user ID를 가져오지 못했습니다.");
            return;
        }

        // 🔹 Step 2: profiles 테이블에 정보 저장
        const { error: profileError } = await supabase.from("profiles").insert([
            {
                id: userId,
                email: email,
                username: username,
                nickname: nickname
            }
        ]);

        if (profileError) {
            console.error(profileError);
            alert("프로필 저장 실패: " + profileError.message);
            return;
        }

        // 🔹 Step 3: 가입 완료 안내
        alert("회원가입이 완료되었습니다! 이메일을 확인하고 로그인해주세요.");
        window.location.href = "login.html";

    } catch (err) {
        console.error("Unexpected error:", err);
        alert("회원가입 중 알 수 없는 오류가 발생했습니다.");
    }
});
