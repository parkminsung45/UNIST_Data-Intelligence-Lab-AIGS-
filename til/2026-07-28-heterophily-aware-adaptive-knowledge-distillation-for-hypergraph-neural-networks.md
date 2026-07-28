---
title: "Heterophily-Aware Adaptive Knowledge Distillation for Hypergraph Neural Networks"
date: 2026-07-28
tags: ["워크샵"]
notion_url: https://app.notion.com/p/Heterophily-Aware-Adaptive-Knowledge-Distillation-for-Hypergraph-Neural-Networks-3abb3408c4c580d29537fabb5d0af5a0
last_edited_time: 2026-07-28T13:21:00.000Z
---

## 📌 연구 주제


**Heterophily-Aware Adaptive Knowledge Distillation for Hypergraph Neural Networks**


(하이퍼그래프 신경망을 위한, 이질성을 인식하는 적응형 지식 증류)


### 1. 배경 — 기존 방법의 한계

- **하이퍼그래프(Hypergraph)**: 일반 그래프는 두 노드 간 관계(pairwise)만 표현하지만, 하이퍼그래프는 **여러 노드 간의 집합적 관계(group-wise relation)** 를 하나의 하이퍼엣지로 표현
    - 예: 같은 논문의 공저자들 = 하나의 하이퍼엣지로 묶임
- **문제점**
    - 단순 임베딩 기반 방법(예: 사전학습 임베딩)은 겉보기에 비슷한 단어/키워드를 가진 노드를 잘못 같은 그룹으로 묶는 오류 발생 가능
    - 하이퍼그래프 신경망(HGNN)은 이런 집합 관계를 정확히 반영해서 **정확도는 높지만, 연산량이 많아 속도가 느림**
    - 반대로 MLP 같은 단순 모델은 **빠르지만 관계 정보를 활용 못해 정확도가 낮음**

### 2. 아이디어 — Knowledge Distillation (지식 증류)

- **Teacher**: Hypergraph 모델 (느리지만 정확)
- **Student**: MLP 모델 (빠르지만 정확도 낮음)
- Teacher가 학습한 관계 정보를 Student에게 전달(distill) → **Student가 빠르면서도 더 정확한 예측**을 하도록 함

하지만 핵심 질문

> "Teacher(하이퍼그래프)가 항상 Student(MLP)보다 나은가?"
- **아니다.** 주변 노드들이 서로 다른 클래스로 이루어진 경우(=**이질성, heterophily**가 높은 경우), 하이퍼그래프 모델이 주변 정보를 끌어와 오히려 예측을 헷갈리게 만들 수 있음
- 반대로 이런 상황에서는 주변 정보 의존도가 낮은 MLP가 더 안정적일 수 있음

### 3. 제안 방법 — Heterophily-Aware Adaptive Distillation

- **핵심 아이디어**: 노드(혹은 하이퍼엣지)별로 "이질성 정도"를 측정해서, Teacher를 얼마나 신뢰할지 **동적으로 조절**

(1) 이질성 측정 — 엔트로피 기반


이웃 노드들의 클래스 분포를 바탕으로 엔트로피를 계산:


$H(v)=-\sum_{c} p_c \log p_c$

- $p_c$ : 노드 v의 이웃 중 클래스 c에 속하는 비율
- 엔트로피가 **낮음** → 이웃들이 비슷한 클래스 (homophily) → Teacher(하이퍼그래프) 신뢰
- 엔트로피가 **높음** → 이웃들이 서로 다른 클래스 (heterophily) → Student(MLP) 쪽에 더 무게

(2) 노드 → 하이퍼엣지 단위 확장


하나의 노드는 여러 하이퍼엣지에 동시에 속할 수 있으므로, 각 하이퍼엣지의 엔트로피를 구한 뒤 노드 단위로 집계(예: 평균)해서 최종 신뢰도 산출


(3) 최종 손실 함수 (개념적 형태)


$$
L= \lambda(v)\,\mathcal{L}_{\text{KD}} + \big(1-\lambda(v)\big)\,\mathcal{L}_{\text{task}}
$$

- $\mathcal{L}_{\text{KD}} $: Teacher → Student 지식 증류 손실 (임베딩 단 + 로짓 단 결합)
- $\mathcal{L}_{\text{task}}$ : 실제 라벨 예측(분류) 손실
- $\lambda(v)$ : 노드별 엔트로피 기반 가중치 (이질성이 높을수록 작아짐 → Teacher 의존도 감소)

### 4. 실험

- 벤치마크 데이터셋 4종에서 노드 분류(classification) 태스크로 검증
- **결과 요약**
    - 제안 방법(엔트로피 기반 적응형 증류)을 적용하면, 기존 하이퍼그래프 모델과 **동등하거나 더 나은 정확도**
    - **속도는 약 3~6배 향상**, 일부 세팅에서는 최대 10배 이상 향상
    - 특히 **이질성이 높은 데이터셋**에서 성능 개선 폭이 큼
- **추가 분석**: 단순히 하이퍼엣지 크기로만 가중치를 주는 방식보다, 엔트로피 기반 가중치가 더 효과적임을 확인 (크기 ≠ 정보량)

### 5. 결론

- Teacher(하이퍼그래프)를 무조건 신뢰하지 않고, **이질성 정도에 따라 적응적으로 증류 비중을 조절**하는 프레임워크 제안
- 속도와 정확도를 동시에 확보, 특히 이질적인 그래프 구조에서 강건함(robust)을 입증

