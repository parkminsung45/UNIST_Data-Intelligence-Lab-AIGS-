<p align="center">
  <img src="assets/banner.svg" alt="DIL Lab Undergraduate RA" width="100%">
</p>

<p align="center">
  <img alt="UNIST" src="https://img.shields.io/badge/UNIST-003a70?style=flat-square">
  <img alt="Lab" src="https://img.shields.io/badge/Data%20Intelligence%20Lab-1fc8c8?style=flat-square">
  <img alt="Role" src="https://img.shields.io/badge/Undergraduate%20RA-555?style=flat-square">
  <img alt="Meetings" src="https://img.shields.io/badge/lab%20meetings-1-blue?style=flat-square">
  <img alt="TIL" src="https://img.shields.io/badge/TIL%20notes-11-success?style=flat-square">
</p>

## About

UNIST Data Intelligence Lab 학부연구생(RA)으로 활동하며 읽고 발표한 논문, 배운 내용을 기록하는 저장소입니다.
회차별 상세 내용(요약, 배운 점, 발표 자료)은 각 브랜치에 정리합니다.

**관심 분야**: 추천 시스템 · LLM · 그래프 학습

## 랩미팅 기록

| 회차 | 논문 | 키워드 | 상세 |
|:---:|---|---|:---:|
| 1 | *EchoTrace: Diagnosing Risks in LLM-Powered Recommender System*<br>Park et al., [arXiv:2602.07442](https://arxiv.org/abs/2602.07442) | `LLM4RS` `Bias` `Hallucination` `Feedback Loop` | [meeting-01](../../tree/meeting-01) |

<details>
<summary><b>1회차 한 줄 요약</b></summary>

<br>

LLM이 만든 편향과 환각이 추천 → 소비 → 재학습 루프를 돌며 누적·증폭되어 임베딩 공간의 양극화까지 일으킨다는 것을 통제된 시뮬레이션으로 보인 논문. 단기 정확도를 넘어서는 피드백 인식 평가가 필요하다는 결론.

</details>

## TIL

| 날짜 | 노트 |
|:---:|---|
| 2026-07-28 | [A Simulation-Based Evaluation Framework for AI Agents Using Synthetic User-Agent Interactions](TIL/2026-07-28-a-simulation-based-evaluation-framework-for-ai-agents-using-synthetic-user-agent-interactions.md) |
| 2026-07-28 | [Behavioral Simulation intelligence for human-AI interaction](TIL/2026-07-28-behavioral-simulation-intelligence-for-human-ai-interaction.md) |
| 2026-07-28 | [Embedding-aware Polarization Management Framework in Signed Networks](TIL/2026-07-28-embedding-aware-polarization-management-framework-in-signed-networks.md) |
| 2026-07-28 | [Evaluating the Value of Understanding and Externalizing Hidden User Intentions in Conversational Shopping Agents](TIL/2026-07-28-evaluating-the-value-of-understanding-and-externalizing-hidden-user-intentions-in-conversational-shopping-agents.md) |
| 2026-07-28 | [Generalized Rank-based Evaluation for Knowledge Graph Completion: Perspectives, Framework, and Analyses](TIL/2026-07-28-generalized-rank-based-evaluation-for-knowledge-graph-completion-perspectives-framework-and-analyses.md) |
| 2026-07-28 | [Heterophily-Aware Adaptive Knowledge Distillation for Hypergraph Neural Networks](TIL/2026-07-28-heterophily-aware-adaptive-knowledge-distillation-for-hypergraph-neural-networks.md) |
| 2026-07-28 | [HyperGC: Learning Hypergraph Representations via Full Hyperedge Reconstruction and Contrastive Learning](TIL/2026-07-28-hypergc-learning-hypergraph-representations-via-full-hyperedge-reconstruction-and-contrastive-learning.md) |
| 2026-07-28 | [Learning Temporal, Relational, and Global Patterns in Multivariate Time Series for Accurate Anomaly Detection](TIL/2026-07-28-learning-temporal-relational-and-global-patterns-in-multivariate-time-series-for-accurate-anomaly-detection.md) |
| 2026-07-28 | [Multi-TAP: Multi-criteria Target Adaptive Persona Modeling for Cross-Domain Recommendation](TIL/2026-07-28-multi-tap-multi-criteria-target-adaptive-persona-modeling-for-cross-domain-recommendation.md) |
| 2026-07-28 | [Supporting Designers' Vagueness by Connecting Natural Language Prompts with Real-World Design References through Knowledge Graphs](TIL/2026-07-28-supporting-designers-vagueness-by-connecting-natural-language-prompts-with-real-world-design-references-through-knowledge-graphs.md) |
| 2026-07-28 | [Who Should Teach? Confidence-Aware Dual-Teacher Learning for Few-Shot Node Classification on Text-Attributed Graphs](TIL/2026-07-28-who-should-teach-confidence-aware-dual-teacher-learning-for-few-shot-node-classification-on-text-attributed-graphs.md) |

## 구성

```
.
├── assets/   # README 배너 등 이미지
├── TIL/      # TIL 노트
└── (meeting-XX 브랜치)  # 회차별 상세 기록
```
