<p align="center">
  <img src="../../assets/banner.svg" alt="DIL Lab Undergraduate RA" width="100%">
</p>

# 4회차 랩미팅 · GNN & GCN

> [← 전체 목록으로](../../README.md)

| | |
|---|---|
| **주제** | *Graph Neural Networks & Graph Convolutional Networks* |
| **참고 자료** | AI Toolkits (AI503 · CSE613 · EE638) 강의 "Graph Neural Networks", "Graph Convolutional Networks: Hands-on Practice" (Yeon-Chang Lee, 2026 Spring) · 원출처 Stanford CS224W (Jure Leskovec) |
| **발표** | 박민성 (2026-11-20) |
| **자료** | [발표 PDF](GNN_GCN_labmeeting_04.pdf) |
| **키워드** | `Node Embedding` `Permutation Invariance/Equivariance` `Neighborhood Aggregation` `GCN` `Inductive Learning` |

## 한눈에 보기

| 문제 | 방법 | 핵심 |
|---|---|---|
| 그래프에는 고정된 노드 순서와 격자가 없어서, 인접 행렬 A와 특징 행렬 X를 그대로 MLP에 넣으면 크기·순서에 따라 결과가 달라진다 | 노드마다 이웃 임베딩을 모아(aggregate) 신경망을 거쳐 갱신하는 층을 K번 쌓는다 (GCN) | 합·평균 집계는 순서와 무관하므로 permutation equivariance를 만족하고, 가중치를 모든 노드가 공유해 처음 보는 노드에도 임베딩을 만들 수 있다 |

## 무엇을 공부했나

**1. 동기: Node Embedding**
- 노드를 저차원 벡터로 옮겨, 그래프에서 비슷한 노드끼리 임베딩 공간에서도 가깝게 만든다.
- 활용 예: 추천 시스템(함께 자주 조회된 상품, PinSage, KDD 2018), 바이오·의약(효능이 비슷한 약물, 기능이 관련된 유전자), 국제 무역(UN Comtrade), 언어(HistWords의 시대별 의미 변화).

**2. 표기와 입력**
- G: 그래프, V: 노드 집합, N(v): 노드 v의 이웃 집합.
- A ∈ {0,1}<sup>|V|×|V|</sup>: 인접 행렬 (구조), X ∈ ℝ<sup>|V|×m</sup>: 노드 특징 행렬 (한 행 = 한 노드의 m차원 특징).
- 노드 특징이 없으면 one-hot 벡터, 상수 벡터 [1, …, 1], 랜덤 초기화 벡터를 쓴다.
- 대부분의 GNN은 A와 X를 입력으로 받아, 0층 임베딩 h<sub>v</sub><sup>(0)</sup> = x<sub>v</sub>에서 출발해 층마다 A가 가리키는 이웃 정보를 섞는다.

**3. MLP 접근의 한계**
- [A, X]를 이어 붙여 MLP에 넣으면 ① 파라미터 수가 O(|V|)라 비효율적이고 과적합 위험이 크며, ② 입력 차원이 고정돼 크기가 다른 그래프에 적용할 수 없고, ③ 노드 번호만 바꿔도 출력이 달라진다.
- 같은 그래프라도 노드 순서를 바꾸면 (A, X)는 (PAPᵀ, PX)로 보인다. P는 단위행렬의 행 순서를 섞은 순열 행렬이다.
- **A는 양쪽, X는 왼쪽에만 곱하는 이유**: A는 행과 열이 모두 노드이고, X는 행만 노드이고 열은 특징 종류다. PA만 하면 행은 바뀌고 열 머리글은 그대로라 어긋나므로, 같은 순열을 열에 적용하려고 오른쪽에 Pᵀ를 곱한다.

**4. Permutation Invariance & Equivariance**

| Task | 출력 | 필요한 성질 |
|---|---|---|
| Graph-level (그래프 분류) | 벡터 하나 | Invariant: 순서를 바꿔도 출력이 같다, f(A, X) = f(PAPᵀ, PX) |
| Node-level (노드 분류) | 노드별 임베딩 | Equivariant: 순서를 바꾸면 출력도 똑같이 바뀐다 |

- MLP는 둘 다 만족하지 않는다. GNN은 invariant / equivariant 함수를 쌓아 만든 모델이다.

**5. 핵심 아이디어: 이웃 집계와 층 쌓기**
- 노드마다 자기 계산 그래프(computation graph)를 갖고, 이웃 임베딩을 모으고(collect) → 평균 등으로 합치고(aggregate) → 신경망(W, σ)을 적용해 → 임베딩을 갱신(update)한다. 같은 층의 신경망은 가중치를 공유한다.
- 합·평균은 입력 순서와 무관한 연산이라 노드 번호를 바꿔도 결과가 같다 (permutation equivariance).
- 층 수 K는 하이퍼파라미터다. k번째 층 임베딩은 k-hop까지의 정보를 담고, K층이면 K-hop 이내 전체가 수용 영역(receptive field)이 된다.

**6. GCN 수식**
- 초기화: h<sub>v</sub><sup>(0)</sup> = x<sub>v</sub>
- 갱신 (k = 0, …, K−1): h<sub>v</sub><sup>(k+1)</sup> = σ( W<sub>k</sub> Σ<sub>u∈N(v)</sub> h<sub>u</sub><sup>(k)</sup> / |N(v)| + B<sub>k</sub> h<sub>v</sub><sup>(k)</sup> )
- 출력: z<sub>v</sub> = h<sub>v</sub><sup>(K)</sup>
- σ는 ReLU 같은 비선형 함수로, 없으면 층을 여러 개 쌓아도 선형 변환 하나와 같다. W<sub>k</sub>는 이웃 정보 변환, B<sub>k</sub>는 자기 자신 변환 가중치이며, 학습 대상은 {W<sub>0</sub>, B<sub>0</sub>, …, W<sub>K−1</sub>, B<sub>K−1</sub>}뿐이고 모든 노드가 공유한다.

**7. 행렬 형태**
- 임베딩을 행렬로 쌓으면 H<sup>(k)</sup> = [h<sub>1</sub><sup>(k)</sup>, …, h<sub>|V|</sub><sup>(k)</sup>]ᵀ (한 행 = 한 노드).
- 이웃 합은 Σ<sub>u∈N(v)</sub> h<sub>u</sub><sup>(k)</sup> = A<sub>v,:</sub>H<sup>(k)</sup>, 차수 행렬 D(대각 원소 D<sub>v,v</sub> = |N(v)|)의 역행렬을 곱하면 평균이 된다.
- 한 층 전체를 한 번에 계산: **H<sup>(k+1)</sup> = σ( D<sup>−1</sup>AH<sup>(k)</sup>W<sub>k</sub>ᵀ + H<sup>(k)</sup>B<sub>k</sub>ᵀ )**
- **Wᵀ가 오른쪽에 붙는 이유**: 노드 수준 식의 h는 세로 벡터라 Wh로 왼쪽에서 곱하지만, H의 각 행은 가로로 누운 임베딩이라 오른쪽에서 곱해야 한다. (Wh)ᵀ = hᵀWᵀ.

**8. 학습**
- 지도 학습은 사람이 붙인 외부 레이블, 비지도 학습은 레이블 없이 그래프 구조 자체를 신호로 쓴다.
- 작업에 따라 이진 교차 엔트로피(BCE), 소프트맥스 손실 등을 고르고, 경사 하강법과 역전파로 가중치를 학습한다.
- 예: 약물-약물 상호작용 네트워크에서의 노드 분류. 최종 임베딩 z<sub>v</sub>에 분류 가중치를 곱해 레이블을 예측하고 BCE로 학습한다.

**9. GNN 설계 4단계**
1. 이웃 집계 함수를 정의한다.
2. 임베딩에 대한 손실 함수를 정의한다 (노드 분류 → Cross-Entropy, 링크 예측 → 이진 분류 손실).
3. 노드 집합(이웃 배치)으로 학습한다 (예: GraphSAGE).
4. 필요한 노드의 임베딩을 생성한다. 가중치를 공유하므로 **학습에 쓰지 않은 노드에도** 임베딩을 만들 수 있다 (inductive).

## 무엇을 배웠나

- **설계 조건에서 모델이 나온다**: "노드 번호를 어떻게 매겨도 결과가 일관돼야 한다"는 조건 하나에서 순서와 무관한 집계(합·평균)와 이웃 기반 갱신이라는 GNN의 구조가 자연스럽게 따라 나온다.
- **수식의 모양까지 이해하기**: PAPᵀ와 PX, 노드 수준의 Wh와 행렬 수준의 HWᵀ처럼, 곱하는 위치와 전치는 "각 축이 무엇을 나타내는가"로 설명된다. 행렬 식으로 쓰면 한 층 전체를 한 번에 계산할 수 있다.
- **깊이 = 수용 영역**: 층을 하나 쌓을 때마다 한 hop씩 더 먼 정보가 들어온다. K는 성능과 계산량을 함께 결정하는 하이퍼파라미터다.
- **가중치 공유가 일반화를 만든다**: 학습 대상이 노드별 벡터가 아니라 층별 W, B뿐이라 파라미터 수가 그래프 크기와 무관하고, 새 노드나 새 그래프에도 그대로 적용된다. 이는 3회차 MARIO처럼 상품 그래프에 GCN을 써서 임베딩을 보강하는 추천 모델을 이해하는 기반이 된다.
