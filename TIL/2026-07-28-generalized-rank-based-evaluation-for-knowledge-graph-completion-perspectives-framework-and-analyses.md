---
title: "Generalized Rank-based Evaluation for Knowledge Graph Completion: Perspectives, Framework, and Analyses"
date: 2026-07-28
tags: ["워크샵"]
notion_url: https://app.notion.com/p/Generalized-Rank-based-Evaluation-for-Knowledge-Graph-Completion-Perspectives-Framework-and-Analy-3abb3408c4c5801d9974d3cfe9e35d07
last_edited_time: 2026-07-28T13:21:00.000Z
---

# 지식그래프완성(KGC) 평가지표 연구 요약


---


## 1. 배경: 지식그래프완성(KGC)이 뭔가요?


지식 그래프는 아래와 같은 사실들의 집합입니다.


$$
(h, r, t) \quad \text{예: (서울, 수도이다, 대한민국)}
$$

- $h$ = head entity
- $r$ = relation
- $t$ = tail entity

**문제**: 실제 지식 그래프는 항상 불완전합니다. 그래서 나온 태스크가 **KGC(Knowledge Graph Completion)**, 흔히 **link prediction**이라 불립니다.

- 예: $(h, r, ?)$ 처럼 tail이 빠져 있으면, 모델이 빈칸에 들어갈 entity를 예측
- 약 20년 가까이 연구되어 온 분야이며 다양한 접근 방식이 존재

---


## 2. 기존 평가 방법 (전통적인 3단계)

1. 테스트 triple의 head 또는 tail을 그래프의 **모든 entity로 바꿔치기**(corrupt)해서 각 후보에 점수를 매김
2. 정답 entity의 **순위(rank)**를 점수로 바꾸는 **변환 함수** 적용
    - 예: $\dfrac{1}{\text{rank}}$ (역수), 또는 threshold 방식 ("순위 1.5 이하면 1점, 넘으면 0점")
3. 전체 테스트셋에 대해 **평균**을 내어 하나의 숫자로 요약

→ 이것이 흔히 쓰이는 **MRR (Mean Reciprocal Rank)**, **Hits@k** 지표입니다.


---


## 3. Closed World vs Open World 가정

- **Closed World Assumption (닫힌세계 가정)**: 그래프에 없는 사실 = 거짓
- **Open World Assumption (열린세계 가정)**: 그래프에 없는 사실 = **모른다** (거짓 아님)
    - 예: "땅콩 알레르기가 없다"는 기록이 없다고 그게 증명된 건 아님 — 그냥 정보 부재
    - KGC는 그래프가 불완전하다는 전제이므로 **Open World 가정**을 사용 → 그래서 단순 precision/recall이 아닌 **순위 기반 평가**를 씀

---


## 4. 이 연구가 지적하는 문제 (두 가지 관점)


### (a) 정밀도–관대함 트레이드오프 조절 불가


기존 지표는 변환 함수가 고정되어 있어 "얼마나 엄격하게 채점할지"를 조절할 수 없음

- 임상시험처럼 검증 비용이 큰 도메인 → 1등만 정확한지가 중요 (precision 중시)
- 다른 도메인 → 비슷하게 맞춰도 어느 정도 점수를 주고 싶어함

### (b) 인기도 편향 (popularity bias)


같은 순위 5등을 맞혀도, 그게 **연결이 많은 인기 entity**인지 **연결이 적은 희귀 entity**인지에 따라 실제 가치가 다른데, 기존 지표는 이를 구분 못 함


---


## 5. 제안하는 방법: 파라미터로 조절 가능한 지표


### 변환 함수 강도 조절 — 파라미터 $\alpha$


$$
s_i = f_\alpha(\text{rank}_i)
$$


$\alpha$를 조절해 "엄격하게(정밀도 중심) ↔ 관대하게" 연속적으로 변경 가능


### 인기도 보정 — 가중치 $w_i$


희귀 entity를 맞히면 가중치 ↑, 인기 entity를 맞히면 가중치 ↓


### 최종 지표 = 두 벡터의 가중평균(내적)


$$
M = \frac{\sum_{i=1}^{n} w_i \cdot s_i}{\sum_{i=1}^{n} w_i}
$$


→ $\alpha$와 가중치를 특정 값으로 고정하면 기존 MRR, Hits@k도 이 식의 **특수한 경우**로 재현됨 (기존 지표를 일반화한 프레임워크)


---


## 6. 실험 결과 요약

- 6개 데이터셋 중 3개로 실험 진행
- $\alpha$ 값을 바꾸면 **모델 간 순위 자체가 변화** → 기존 단일 지표로는 안 보이던 차이 포착
- 인기도 가중치 적용 시, 특정 모델이 인기 entity에 유독 강한 편향이 드러남
- 기존 MRR 하나만으로는 이런 차이들이 가려져 있었음을 실험적으로 입증

---


## 7. 결론

- KGC 분야는 약 20년간 연구됐지만, 평가 방식은 특정 관점(변환 함수)에 고정
- "정밀도–관대함"과 "인기도 편향" 두 관점을 하나의 **파라미터화된 지표**로 통합
- 컨퍼런스 short/conclusion 트랙 accept, 실사용 가능한 웹 데모 도구 공개

---


