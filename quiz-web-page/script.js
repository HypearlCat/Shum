document.addEventListener('DOMContentLoaded', function() {
    const quizContainer = document.getElementById('quiz-container');
    fetch('../Both/gemini_questions.json')
    .then(response => response.json())
    .then(data => {
        const quizDiv = document.getElementById("quiz");
        data.forEach((item, index) => {
            let html = `<div class="question-card">`;
            // 문제 헤더 (문제 번호)
            html += `<div class="question-header">문제 ${index + 1}</div>`;
            // 문제 본문
            if(item.question) {
                html += `<div class="question-text">${item.question}</div>`;
            }
            // 선택지 (options)
            if(item.options) {
                html += `<ul class="options">`;
                for (const [key, value] of Object.entries(item.options)) {
                    html += `<li><strong>${key}.</strong> ${value}</li>`;
                }
                html += `</ul>`;
            }
            // 해설/정답/출처 영역 (초기엔 숨김)
            html += `<div class="answer-info hidden">
                        ${item.answer ? `<p><strong>정답:</strong> ${item.answer}</p>` : ''}
                        ${item.explanation ? `<p><strong>해설:</strong> ${item.explanation}</p>` : ''}
                        ${item.source ? `<p><strong>출처:</strong> ${item.source}</p>` : ''}
                     </div>`;
            // 해설 보기 버튼
            html += `<div class="button-container">
                        <button class="button reveal-btn" onclick="toggleAnswer(this)">해설 보기</button>
                     </div>`;
            html += `</div>`;
            quizDiv.innerHTML += html;
        });
    })
    .catch(error => {
        document.getElementById("quiz").innerText = "문제를 불러오지 못했습니다.";
        console.error(error);
    });
});

// 해설 영역의 표시/숨김 전환 함수
function toggleAnswer(button) {
    const answerInfo = button.parentElement.previousElementSibling;
    if(answerInfo.classList.contains('hidden')){
        answerInfo.classList.remove('hidden');
        button.innerText = "해설 숨기기";
    } else {
        answerInfo.classList.add('hidden');
        button.innerText = "해설 보기";
    }
}