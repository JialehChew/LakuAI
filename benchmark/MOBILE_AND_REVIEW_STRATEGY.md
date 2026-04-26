# LakuAI: Mobile Conversion & Human Review Strategy

## 1. Mobile Preview Workflow
To ensure our "Digital Artisan" outputs convert on Malaysian marketplaces, we must evaluate them at mobile scale.

### Automation Strategy
- **Auto-Thumbnailing**: During the benchmark generation, a 200x200 "Mobile View" thumbnail should be generated.
- **Visual Stress Test**: The evaluator must view the result at 25% zoom to simulate a small phone screen.
- **Readability Check**: Can the product category be identified in <1 second at this size?

## 2. Human Review Process
Benchmarking is a 3-step cycle:

### Step A: Technical Validation
- **Engine Comparison**: Run the same product through Legacy vs. Visual Engine.
- **Rubric Scoring**: Apply the 5-point JSON scoring system.

### Step B: Failure Tagging
- If a score is < 80/100, mandatory tagging from `failure-types.json` is required.
- **Preservation vs. Aesthetic**: Is it a technical failure (broken logo) or a taste failure (bad background)?

### Step C: Dataset Curation
- Move exceptional results into `visual-intelligence/best-results/`.
- Record the **"Why it worked"** factor (e.g., "The soft morning light perfectly preserved the pearl texture").

## 3. Measurable Outcomes
- **P0 Target**: 90%+ Logo Consistency across Cosmetics and Food categories.
- **P1 Target**: 80%+ subject visibility score at Shopee-thumbnail size.
