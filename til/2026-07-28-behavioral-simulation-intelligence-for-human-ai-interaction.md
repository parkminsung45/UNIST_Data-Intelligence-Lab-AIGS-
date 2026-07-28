---
title: "Behavioral Simulation intelligence for human-AI interaction"
date: 2026-07-28
tags: ["워크샵"]
notion_url: https://app.notion.com/p/Behavioral-Simulation-intelligence-for-human-AI-interaction-3abb3408c4c580a0904ec8fdd377e62e
last_edited_time: 2026-07-28T13:21:00.000Z
---

### 연구실 소개 (차이렉, CHAI Lab)

- 사람을 하나의 에이전트로 보고, 사람을 어떻게 시뮬레이션할 수 있는가를 연구하는 랩
- 타 연구실의 하이레벨 시뮬레이션(하루~한 달 단위의 사회적 행동)과 달리, **로우레벨 시뮬레이션** (1초, 100ms, 50ms 단위의 신체 행동)에 집중
- 사람과 AI의 상호작용 상황에서 사람의 행동을 계산적·기계적 모델로 이해하는 것이 목표

### 연구 배경 및 동기

- GPT 등장으로 사람-AI 접점이 확대됨 → 최근에는 Physical Intelligence로 발전 (로봇 팔 어시스턴스, 엑소스켈레톤 등)
- AI가 텍스트 기반 소통을 넘어 **사람의 즉각적인 행동까지 이해**하는 방향으로 진화 예정

### 한계 및 필요성

- **세 가지 주요 챌린지:**
    - 행동 데이터 수집의 높은 비용 (High cost of behavioral data collection)
    - 사람의 행동은 단순 데이터 수집만으로 설명되지 않는 복잡한 요인이 존재
    - 사용자 페르소나에 따른 높은 행동 다양성 (variability)
- → **Cost-Effective하고 Explainable한 사람 행동 모델 방법론이 필요**
- 해결책으로 **Behavioral Simulation Intelligence** 도입 제안: Simulated Users, Traditional UIs, VR/AR, Robots 등에 적용

### 핵심 개념: Forward & Inverse Behavior Modeling

- **Forward Behavior Modeling:** 특정 상황(context)이 주어졌을 때, 사용자의 행동이 어떻게 나올지 예측
    - Counterfactual Power: 조건(그리드, 팔 길이, 자세 등)을 달리했을 때 행동 변화를 시뮬레이션
- **Inverse Behavior Modeling:** 관측된 행동으로부터 사용자의 동기·능력 등 **latent state**를 추론
    - 예: 모바일 타이핑 속도만으로 눈 움직임 정확도, 타이핑 정확도 등을 예측
- AI가 사람의 행동을 사람처럼 이해하려면 이 **양방향 모델링**이 모두 필요

### 방법론의 역사적 흐름

- **1980~90년대:** GOMS 등 인지과학 기반 모듈형 아키텍처 (메모리 청크, 눈·손가락의 물리적 한계 등을 수동으로 룰 정의) → 생리학적으로 타당하나 **Scalability 한계**
- **데이터 기반 방식:** Neural Network로 state-action 매핑 → Generalizable하나, 데이터 비용 및 Explainability 부족
- **2020년 이후 새로운 방향:** 이론(사람의 인지/운동 제약) + 시뮬레이션을 결합한 **Computational Rationality** 기반 모델링

### Computational Rationality + 강화학습(RL) 방법론

- 사람을 일정 제약(boundary) 안에서 합리적으로 행동하는 **Bounded Rational Agent**로 간주
- 기존에 연구된 사람의 생리·인지 모듈(메모리 청크, 감각 한계, 근육 제약 등)을 그대로 활용
- **RL(강화학습)**을 통해 그 제약 내에서 최적 행동을 학습하는 에이전트를 훈련 → Scalability와 Explainability 동시 확보

### 연구 사례

- **VR 타겟 선택 예측 (2024년 발표):**
    - 사용자의 사전 모션 데이터로부터 타겟을 예측하는 Inverse 모델 구현
    - 실제 데이터 대신 Synthetic User(시뮬레이션 에이전트)로 생성한 데이터를 활용
    - Forward 모델 → Synthetic 데이터 생성 → Inverse 모델 학습의 파이프라인
    - 실제 사용자 데이터를 완전히 대체하지는 못했으나, 시뮬레이션 데이터 혼용 시 **속도 및 정확도 향상**, 실제 AR 시스템에 배포 가능 수준 달성
- **엑소스켈레톤 시스템:** 사람이 걷는 방식을 바이오메카닉스로 재현하여 외골격 최적화 (2024 Nature 관련 연구)
- **읽기 행동 시뮬레이션:** 사람이 글을 읽는 방식을 시뮬레이션 → **올해 Nature 저널 게재**

### 향후 비전 및 남은 과제

- 최종 목표: 지각(Perception), 기억(Memory), 운동제어(Motor Control) 모듈을 모두 갖춘 **완전한 Synthetic User(Digital Twin)** 구현
    - 어떤 태스크나 환경에서도 재사용 가능한 시뮬레이션 기반 마련
- 현재 태스크별로 특화 모듈을 매번 새로 구현하는 구조 → **새로운 태스크 확장에 한계**
- 남은 주요 챌린지: Reward 엔지니어링, 복잡한 태스크로의 스케일 확장, 스킬 전이(Transfer) 검증

