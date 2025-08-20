import vertexai
from vertexai.generative_models import GenerativeModel, Part

# --- 설정 (이 부분을 사용자 환경에 맞게 수정하세요) ---
project_id = "shum-469607"  # 본인의 Google Cloud 프로젝트 ID로 변경
location = "us-central1"        # Gemini 모델이 지원되는 리전 (예: us-central1, asia-southeast1)

# GCS에 업로드된 PDF 파일의 URI (실제 파일 경로로 변경)
pdf_gcs_uri = "gs://shum/problem.pdf"  # 수정된 부분: problem.pdf만 사용

# --- Vertex AI 초기화 및 모델 로드 ---
vertexai.init(project=project_id, location=location)
model = GenerativeModel("gemini-2.5-flash")  # 또는 "gemini-1.5-flash" 모델 사용 가능

# --- GCS 파일 Part 객체 생성 ---
contents = []

# problem.pdf 파일 로드 시도
try:
    pdf_part = Part.from_uri(pdf_gcs_uri, mime_type="application/pdf")
    contents.append(pdf_part)
    print(f"PDF 파일 로드 성공: {pdf_gcs_uri}")
except Exception as e:
    print(f"PDF 파일을 로드하는 데 실패했습니다. URI를 확인하세요: {pdf_gcs_uri} 오류: {e}")

# --- Gemini 모델에 전달할 내용 (프롬프트 + 파일) ---
# 사용자 프롬프트 추가
if contents:  # PDF 파일이 성공적으로 로드되었다면 프롬프트 추가
    user_prompt = "이 문서를 참고하여 문제당 분량이 두 줄 이상인 서비스디자인기사자격증 문제를 100문제 만들어주세요"
    contents.append(user_prompt)
    print(f"\n사용자 프롬프트: {user_prompt}")
else:
    print("로드된 PDF 파일이 없어 Gemini API 호출을 위한 입력이 충분하지 않습니다.")

# --- Gemini API 호출 및 응답 생성 ---
if len(contents) > 1:  # 최소한 프롬프트와 하나의 PDF 파일이 있어야 함
    print("\nGemini 모델 호출 중...")
    try:
        response = model.generate_content(contents)
        print("\n--- Gemini 모델 응답 ---")
        
        # 결과를 파일로 저장
        with open("output.txt", "w", encoding="utf-8") as f:
            f.write(response.text)
        print("응답이 output.txt 파일에 저장되었습니다.")
        
    except Exception as e:
        print(f"Gemini API 호출 중 오류 발생: {e}")
else:
    print("Gemini API를 호출하기에 충분한 입력이 없습니다. 파일 경로와 프롬프트를 확인하세요.")
