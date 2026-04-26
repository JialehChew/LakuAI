# LakuAI: Visual Auditor Dashboard Architecture

This document outlines the proposed architecture for the internal Visual Auditor tool.

## Purpose
- Side-by-side comparison of Legacy vs. Visual Engine outputs.
- Scoring and evaluating generation quality based on the Evaluation Rubric.
- Managing benchmark datasets and tracking performance over time.

## Component Tree
- `VisualAuditor/ `
  - `BenchmarkGrid/`: Displays input image alongside results from both engines.
  - `EvaluationPanel/`: Interactive sliders and checkboxes for scoring the 5 Rubric categories.
  - `LogViewer/`: Displays the VSO, SPIO, and Final Prompt for the selected generation.
  - `MetricSummary/`: Visualizes weighted scores and total performance trends.

## Data Integration
- Consumes the JSON output from `src/lib/visual-engine/utils/logger.ts`.
- Future integration: Read/Write to `benchmark/evaluations/scores.json`.

## Commercial Workflow
1. Select Category (e.g., Jewelry).
2. Upload Test Product.
3. Trigger "Compare All Engines".
4. Reviewer scores results.
5. Save result to dataset for regression testing.
