const supabase = window.supabaseClient;

document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPw").value;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            // 이메일 미확인, 비밀번호 틀림 등
            if (error.message.includes("Email not confirmed")) {
                alert("이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.");
            } else {
                alert("이메일 또는 비밀번호가 올바르지 않습니다.");
            }
            console.error(error);
            return;
        }

        // 로그인 성공
        alert("로그인 성공!");
        window.location.href = "../wn.html";
         

    } catch (err) {
        console.error("Unexpected error:", err);
        alert("로그인 중 알 수 없는 오류가 발생했습니다.");
    }
});
