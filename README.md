---
title: Tristan Backend
emoji: ⚖️
colorFrom: gray
colorTo: slate
sdk: docker
pinned: false
---

# Tristan

![Python](https://img.shields.io/badge/Python_3.11-14354C?style=for-the-badge&logo=python&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Qdrant](https://img.shields.io/badge/Qdrant_Vector_DB-14354C?style=for-the-badge)
![Gemini](https://img.shields.io/badge/Google_Gemini-000000?style=for-the-badge&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-14354C?style=for-the-badge)

Tristan is an automated, high-throughput document auditing pipeline designed to ingest complex enterprise agreements (SLAs, NDAs, Master Service Agreements) and execute zero-shot regulatory risk screening using a hybrid Retrieval-Augmented Generation (RAG) architecture.

## System Architecture

The pipeline is engineered to eliminate the "lost-in-the-middle" context degradation typical of standard RAG applications when processing dense legal text.

* **Hierarchical Parent-Child Chunking:** Documents are parsed into a relational tree structure. Dense semantic embeddings (via `text-embedding-004`) are generated exclusively for micro-chunks (individual sentences/clauses) to ensure hyper-precise vector retrieval.
* **Contextual Rehydration:** Upon vector match in the Qdrant database, the system traverses the graph to retrieve the associated macro-chunk (the parent paragraph or page), feeding the inference node the exact localized legal context without token bloat.
* **Few-Shot Sentiment Evaluation:** The evaluation node (`gemini-1.5-flash-latest`) bypasses standard keyword triggering (which causes false positives) via strict, few-shot prompt engineering that forces algorithmic differentiation between protective clauses (e.g., standard liability caps) and predatory vulnerabilities.

## Core Capabilities

* **Zero-Shot Profiling:** Dynamic auditing against isolated frameworks (GDPR, SOC2, Financial SLA).
* **Risk Radar Telemetry:** Multi-axis vulnerability scoring distributed across Data Protection, Indemnification, Termination, Compliance, and Governance.
* **Automated Remediation:** Generates legally sanitized, enterprise-safe alternative clauses for flagged nodes in real-time.

## Local Deployment

The environment is strictly containerized. Ensure Docker is running before initiating the build sequence.

```bash
# 1. Clone the repository
git clone [[https://github.com/your-username/tristan.git]](https://github.com/Qt-puppy/Tristan.git)
cd tristan

# 2. Configure environment
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and QDRANT details

# 3. Initialize the backend deployment
docker build -t tristan-backend .
docker run -p 7860:7860 --env-file .env tristan-backend

# 4. Initialize the frontend workspace
cd frontend
npm install
npm run dev
