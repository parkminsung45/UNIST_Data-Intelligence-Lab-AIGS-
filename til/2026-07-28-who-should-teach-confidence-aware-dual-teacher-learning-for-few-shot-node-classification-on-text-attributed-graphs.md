---
title: "Who Should Teach? Confidence-Aware Dual-Teacher Learning for Few-Shot Node Classification on Text-Attributed Graphs"
date: 2026-07-28
tags: ["워크샵"]
notion_url: https://app.notion.com/p/Who-Should-Teach-Confidence-Aware-Dual-Teacher-Learning-for-Few-Shot-Node-Classification-on-Text-At-3abb3408c4c5805cbc8fc439fd9078de
last_edited_time: 2026-07-28T13:21:00.000Z
---

# Who Should Teach? Confidence-Aware Dual-Teacher Learning for Few-Shot Node Classification on Text-Attributed Graphs


## 1. 배경: 왜 이 문제가 중요한가

- **Text-Attributed Graph (TAG)**: 각 노드가 텍스트(예: 논문 제목+초록)와 그래프 구조(인용 관계 등)를 동시에 가진 데이터.
- **Few-shot node classification**: 클래스당 라벨이 몇 개(예: 3개, 5개, 10개)만 있는 상황에서 나머지 대다수 노드의 라벨을 예측하는 문제.
- 라벨이 매우 부족하기 때문에, GNN만 쓰거나 LLM만 써서는 성능이 잘 안 나옴 → 최근 연구들은 **GNN + LLM을 함께 활용**하려는 시도를 하고 있음.

## 2. 기존 LLM 활용 방식 3가지 (녹취록 기준 재구성)


| 방식                   | 핵심 아이디어                                                                        |
| -------------------- | ------------------------------------------------------------------------------ |
| **LLM-as-Enhancer**  | LLM으로 노드 텍스트에 설명(explanation)이나 추가 지식을 덧붙여, GNN이 사용할 입력 특징(feature)을 더 풍부하게 만듦 |
| **LLM-as-Predictor** | LLM 자체를 분류기로 사용 (텍스트 생성 문제로 노드 분류를 프레이밍)                                       |
| **LLM-as-Annotator** | LLM이 라벨 없는 노드에 대해 pseudo-label(가짜 라벨)을 생성해서 GNN 학습에 추가 지도신호(supervision)로 사용   |


## 3. 발표자가 지적한 기존 방법의 한계 2가지


**문제 1. LLM 예측의 신뢰성(reliability) 문제**
LLM이 생성하는 라벨/설명이 항상 맞는 것은 아님. 그런데 기존 방법들은 이 pseudo-label을 충분히 검증하지 않고 그대로 지도신호로 써서, 잘못된 정보가 학습에 노이즈로 섞여 들어갈 위험이 있음.


**문제 2. 그래프 구조 정보의 과소 활용**
기존 방법들은 성능 향상에 집중한 나머지, 그래프의 구조적 정보(topology)를 supervision 설계에 충분히 반영하지 않음. 결과적으로 구조적으로는 이미 답이 꽤 명확한 노드에도 굳이 (상대적으로 불확실할 수 있는) LLM 라벨을 쓰게 되는 비효율이 생김.


## 4. 제안 방법: Confidence-Aware Dual-Teacher 프레임워크


핵심 아이디어는 다음과 같이 정리됩니다:

- 텍스트 기반 LLM 예측은 불안정할 수 있지만, **그래프 구조 정보(GNN이 보는 이웃 관계)는 상대적으로 명확한 신호**를 줄 수 있는 경우가 많음.
- 따라서 모든 노드를 하나의 teacher(LLM 또는 GNN)에게 맡기지 말고, **노드별로 어느 쪽이 더 신뢰할 만한지 확인 후 teacher를 선택**하자는 것.

### 4.1 두 개의 teacher 역할 분담

1. **GNN (구조 기반 teacher)**
    - 그래프 토폴로지(이웃 연결 관계)를 이용해 pseudo-label 생성
    - "구조적으로 명확한" 노드, 즉 GNN이 확신을 가지고 예측하는 노드에 대해 supervision 신호를 제공
2. **LLM (의미/텍스트 기반 teacher)**
    - GNN이 충분히 확신하지 못하는(즉 구조 정보만으로는 애매한) 노드에 대해서만 보완적으로 pseudo-label 제공
    - 즉, LLM은 "GNN이 자신 없는" 부분에만 선택적으로 투입되는 서브 역할

### 4.2 신뢰도 기반 선택 (개념적 정리)


녹취록에서 언급된 확신도 기준 선택 아이디어를 일반적인 표기로 정리하면 다음과 같습니다 (실제 논문의 정확한 기호는 아닐 수 있음에 유의):


$$
\text{teacher}(v) =
\begin{cases}
\text{GNN} & \text{if } \text{conf}_{\text{GNN}}(v) \geq \tau \
\text{LLM} & \text{if } \text{conf}_{\text{GNN}}(v) < \tau
\end{cases}
$$


여기서:

- $v$: 그래프의 한 노드
- $\text{conf}_{\text{GNN}}(v)$: GNN이 노드 $v$의 예측에 대해 가지는 확신도(예: softmax 확률의 최댓값)
- $\tau$: 확신도 임계값 (threshold)

### 4.3 학습 손실 (개념적 정리)


발표에서 언급된 "GNN 분포 + LLM 분포를 함께 distillation" 아이디어를 일반적인 knowledge distillation 형태로 정리하면:


$$
\mathcal{L} = \mathcal{L}{\text{CE}}(\hat{y}, y) + \lambda_1 \cdot \mathcal{L}{\text{KD}}(\hat{y}, p_{\text{GNN}}) + \lambda_2 \cdot \mathcal{L}{\text{KD}}(\hat{y}, p{\text{LLM}}) 
$$

- $\mathcal{L}_{\text{CE}}$ : 실제 라벨이 있는 소수 노드에 대한 classification loss (cross-entropy)
- $\mathcal{L}{\text{KD}}$ _: 각 teacher의 soft-label 분포 $p_{\text{GNN}}, p_{\text{LLM}}$을 student가 따라가도록 하는 distillation loss
- $\lambda_1, \lambda_2$ : 두 teacher의 기여도를 조절하는 가중치 (노드별 confidence에 따라 달라질 수 있음)

## 5. 실험 설정 

- **데이터셋**: 인용 네트워크 계열로 추정되는 4개 데이터셋 사용
- **Few-shot 설정**: 클래스당 라벨 수를 3-shot / 5-shot / 10-shot 등 여러 조건으로 평가 (녹취록 음질 문제로 정확한 shot 수는 불확실)
- **비교 대상 (baseline)**: 순수 GNN 기반 방법, 순수 LLM 기반 방법, 그리고 LLM을 annotator로 쓰는 기존 방법들

## 6. 주요 실험 질문 및 결과 요약


발표에서 다룬 것으로 보이는 핵심 질문들:

1. **Teacher 선택이 실제로 유효한가?** → GNN 확신도가 높은 구간에서 GNN 기반 pseudo-label의 실제 정확도가 높게 나타나, "확신도 기반 teacher 배정"이 타당하다는 근거로 제시됨
2. **두 teacher를 함께 쓰는 것이 하나만 쓰는 것보다 좋은가?** → dual-teacher 조합이 단일 teacher(GNN만 또는 LLM만) 대비 더 나은 성능을 보임
3. **기존 방법 대비 우위** → 제안 방법이 기존 LLM-as-annotator 계열 방법들보다 더 좋은 성능
4. **효율성 관점** → "모든 노드에 LLM을 쓰는 것이 능사가 아니라, 필요한 노드에만 선택적으로 쓰는 것이 중요하다"는 메시지 — 즉 LLM 호출량 대비 효율이 좋다는 주장
5. **임계값** $\tau$ **(threshold) 민감도** → 임계값을 너무 낮게/높게 잡으면 각각 다른 문제(불확실한 라벨 혼입 vs. 커버리지 저하)가 발생하며, 적절한 중간 지점이 존재한다는 분석

---


