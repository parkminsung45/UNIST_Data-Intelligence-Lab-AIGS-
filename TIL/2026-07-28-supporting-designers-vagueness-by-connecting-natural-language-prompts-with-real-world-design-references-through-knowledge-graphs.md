---
title: "Supporting Designers' Vagueness by Connecting Natural Language Prompts with Real-World Design References through Knowledge Graphs"
date: 2026-07-28
tags: ["워크샵"]
notion_url: https://app.notion.com/p/Supporting-Designers-Vagueness-by-Connecting-Natural-Language-Prompts-with-Real-World-Design-Refere-3abb3408c4c5803aa703fed07e72b577
last_edited_time: 2026-07-28T13:21:00.000Z
---

## 📌 연구 주제


**Supporting Designers' Vagueness by Connecting Natural Language Prompts with Real-World Design References through Knowledge Graphs**


(자연어 프롬프트 ↔ 실제 디자인 레퍼런스를 지식 그래프로 연결해, 디자이너의 "모호함(vagueness)"을 도와주는 시스템)


### 1. 문제 정의

- 디자인 초기 단계는 원래 **추상적이고 모호함(vague)** — 아직 명확히 정의되지 않은 상태에서 출발하는 게 자연스러움
- 이 모호함 자체가 새로운 아이디어 발견에 중요한 역할을 함
- 그런데 기존 text-to-image 생성 도구는 디자인 과정의 두 단계를 잘 못 다룸
    - **발산(Divergence) 단계**: 다양하고 창의적인 탐색이 필요한 시기
    - **수렴(Convergence) 단계**: 아이디어를 점점 좁혀 구체화하는 시기 → 프롬프트가 너무 구체적이면 "글자 그대로"만 생성되어 오히려 창의성이 떨어짐

### 2. 제안 방법의 핵심

- **계층적 키워드(hierarchical keywords)** 구조 사용
    - 발산 단계 → 넓은 컨셉 키워드
    - 수렴 단계 → 구체적 키워드
- 대화(chat) 흐름을 통해 사용자가 지금 발산 중인지 수렴 중인지 파악하고, 그 단계에 맞는 정보를 자연스럽게 제시
- **기존 시스템의 한계**: 최근 대화만 반영 → 디자인 여정 전체(발산→수렴 전환)를 못 따라감
- 이를 보완하기 위해 **지식 그래프**로 이전 디자인 히스토리 간 관계, 사용자의 "스타일"을 파악

### 3. 시스템 주요 기능

- **탐색(Explore) 기능**: 사용자 반응에 따라 검색 범위를 넓히거나 좁힘
- **포커스(Focus) 기능**: 특정 요소에 집중해서 디자인 발전
- **밸런스 모드**: 다양성(diversity) ↔ 일관성(consistency) 조절 컨트롤
- 텍스트 + 이미지 결합 추천 (패션 스타일링 전문가와 협업해 검증한 예시)
    - 예: "블라우스, 화이트" + "페미닌 스타일" 키워드 → 관련 이미지 세트 추천
- **2단계 생성 프로세스**: 1차 추출 → 2차 검증 → 최종 추천
- 사용자가 마음에 드는 이미지를 저장 → 그 피드백 기반으로 추천 갱신 (선호도 누적 학습)

### 4. 평가 / 향후 계획

- 현재 **영어권 사용자 대상 user study 진행 중**
- 평가 지표: **다양성(diversity)**, **일관성(consistency)**
- 목표: 효율성과 창의적 탐색을 동시에 지원하는 **LLM 기반 디자인 툴** 개발

### 5. Q&A 요약

- **질문**: 발산→수렴 전환 시점에서 "새로움(novelty)"을 어떻게 측정하는가?
- **답변**: 다양성·일관성 지표를 활용하고, 패션 디자인 실무자와 협업한 사용자 스터디로 검증. 인지 부담(cognitive load) 관련 지표도 함께 평가 중.

