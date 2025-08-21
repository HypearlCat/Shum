import vertexai
from vertexai.generative_models import GenerativeModel, Part
import json
import random # 다양성을 위해 random 라이브러리 추가

# --- 설정 (이 부분을 사용자 환경에 맞게 수정하세요) ---
project_id = "shum-469607"  # 본인의 Google Cloud 프로젝트 ID로 변경
location = "us-central1"        # Gemini 모델이 지원되는 리전 (예: us-central1, asia-southeast1)

# GCS에 업로드된 PDF 파일들의 URI (실제 파일 경로로 변경)
pdf1_gcs_uri = "gs://shum/problem.pdf"
pdf2_gcs_uri = "gs://shum/theory.pdf"

vertexai.init(project=project_id, location=location)
model = GenerativeModel("gemini-2.5-flash")  # 또는 "gemini-1.5-flash" 모델 사용 가능

# --- GCS 파일 Part 객체 생성 ---
contents = []
pdf_files_loaded = 0

# PDF 파일 로드 시도
for uri in [pdf1_gcs_uri, pdf2_gcs_uri]:
    try:
        pdf_part = Part.from_uri(uri, mime_type="application/pdf")
        contents.append(pdf_part)
        print(f"PDF 파일 로드 성공: {uri}")
        pdf_files_loaded += 1
    except Exception as e:
        print(f"PDF 파일을 로드하는 데 실패했습니다. URI를 확인하세요: {uri} 오류: {e}")

# --- Gemini 모델에 전달할 프롬프트 엔지니어링 ---
if pdf_files_loaded > 0:
    # 매번 다른 문제를 생성하기 위해 프롬프트에 약간의 변화를 줍니다.
    random_seed_word = random.choice(["혁신적인", "심층적인", "응용적인", "창의적인", "실무적인", "통합적인"])

    # JSON 구조와 다양성을 강조하는 프롬프트 (영문 키로 수정)
    user_prompt = f"""
    당신은 서비스디자인기사 자격증의 전문 출제위원입니다.
    제공된 2개의 PDF 문서를 깊이 있게 분석하고 참고하여, 수험생의 사고력을 평가할 수 있는 '{random_seed_word}' 문제 100개를 생성해 주세요.

    **[생성 규칙]**
    1.  **다양성**: 이전에 생성했던 문제들과는 다른, 완전히 새로운 시나리오와 개념을 바탕으로 문제를 만들어야 합니다. 단순한 단어 변경이나 순서 변경은 허용되지 않습니다.
    2.  **분량**: '문제' 본문은 반드시 2줄 이상으로 구성하여, 수험생이 상황을 명확히 이해할 수 있도록 구체적인 맥락을 제공해야 합니다.
    3.  **출력 형식**: 전체 결과는 반드시 하나의 유효한 JSON 배열(Array) 형식이어야 합니다. 배열의 각 요소(Element)는 아래에 명시된 5개의 키를 가진 JSON 객체(Object)여야 합니다.

    **[JSON 객체 구조]**
    -   `"question"`: (String) 문제의 내용.
    -   `"options"`: (Object) 4개의 선택지. 예: {{"1": "답변1", "2": "답변2", "3": "답변3", "4": "답변4"}}
    -   `"explanation"`: (String) 정답에 대한 상세하고 친절한 설명.
    -   `"answer"`: (String) 정답 번호. 예: "3"
    -   `"source"`: (String) 문제의 근거가 된 문서와 페이지. 예: "theory.pdf, p.25"

    **[JSON 출력 예시]**
    ```json
    [
      {{
        "question": "한 지자체에서 노인들을 위한 디지털 정보 격차 해소 서비스를 기획하고 있습니다. 서비스 디자인의 '더블 다이아몬드' 모델을 적용할 때, '정의(Define)' 단계에서 가장 우선적으로 수행해야 할 활동은 무엇이며 그 이유는 무엇입니까?",
        "options": {{
          "1": "다양한 아이디어를 브레인스토밍하여 해결책을 구체화한다.",
          "2": "사용자 리서치 결과를 분석하여 핵심 문제와 인사이트를 도출한다.",
          "3": "프로토타입을 제작하여 사용자로부터 피드백을 수렴한다.",
          "4": "최종 서비스의 컨셉을 시각적으로 디자인하고 개발 계획을 수립한다."
        }},
        "explanation": "'정의(Define)' 단계는 '발견(Discover)' 단계에서 수집한 방대한 데이터를 종합하고 분석하여 해결해야 할 명확한 문제를 정의하는 과정입니다. 따라서 사용자 리서치 결과를 분석하여 핵심 문제를 도출하는 것이 가장 중요한 활동입니다.",
        "answer": "2",
        "source": "problem.pdf, p.12"
      }}
    ]
    ```
    위 예시를 참고하여, 30개의 문제 객체를 포함하는 완전한 JSON 배열을 생성해 주세요.
    """
    contents.append(user_prompt)
    print("\n강화된 사용자 프롬프트가 준비되었습니다. (JSON 키 영문으로 변경)")
else:
    print("로드된 PDF 파일이 없어 Gemini API 호출을 위한 입력이 충분하지 않습니다.")

# --- Gemini API 호출 및 응답 생성 ---
if len(contents) > 1:
    print("\nGemini 모델 호출 중... (100개의 복잡한 문제를 생성하는 데 시간이 걸릴 수 있습니다)")
    try:
        response = model.generate_content(contents)
        print("\n--- Gemini 모델 응답 수신 완료 ---")

        # 응답 텍스트에서 JSON 부분만 추출 (마크다운 코드 블록 제거)
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]

        # 텍스트를 JSON으로 파싱
        try:
            questions_json = json.loads(response_text)
            
            # JSON을 파일로 저장 (utf-8 인코딩, 들여쓰기 적용)
            output_file_path = "./Both/gemini_questions.json"
            with open(output_file_path, "w", encoding="utf-8") as f:
                json.dump(questions_json, f, ensure_ascii=False, indent=4)
            
            print(f"\n성공! {len(questions_json)}개의 문제를 '{output_file_path}' 파일로 저장했습니다.")

        except json.JSONDecodeError as e:
            print(f"\n오류: 모델의 응답을 JSON으로 파싱하는 데 실패했습니다. 오류: {e}")
            print("--- 모델의 원본 응답 (에러 확인용) ---")
            print(response.text)
            # 실패 시 원본 텍스트라도 저장
            with open("gemini_response_error.txt", "w", encoding="utf-8") as f:
                f.write(response.text)
            print("\n원본 응답을 'gemini_response_error.txt'에 저장했습니다.")

    except Exception as e:
        print(f"Gemini API 호출 중 오류 발생: {e}")
else:
    print("Gemini API를 호출하기에 충분한 입력이 없습니다. 파일 경로와 프롬프트를 확인하세요.")