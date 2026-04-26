# LakuAI: Visual Intelligence Dataset

A curated repository of generation results used to train our systems and our prompt engineers on what constitutes commercial success.

## Dataset Segments
- `best-results/`: Gold standard images that passed all rubric criteria.
- `failed-results/`: Generations with significant artifacts or quality issues.
- `high-conversion/`: Outputs that specifically excel in mobile readability and Shopee-style "clickability".
- `preservation-failures/`: Cases where the product identity drifted significantly from the input.

## Data Schema (Proposed)
For every entry:
- `input.png`: The original upload.
- `output.png`: The generated result.
- `metadata.json`: Contains VSO, SPIO, final prompt, and full evaluation scores.
