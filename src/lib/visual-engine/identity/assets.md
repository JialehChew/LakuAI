# LakuAI: Reusable Visual Asset System

This document outlines the architecture for increasing production efficiency over time by reusing core assets.

## 1. Core Asset Types
- **Hero Master**: The highest-quality clean product cutout from the initial generation.
- **Environment Plates**: Backgrounds generated during "Lifestyle" steps that can be reused for other products in the same brand.
- **Composition Templates**: Successful VSO mappings for specific product shapes (e.g., "tall bottle formula").

## 2. Efficiency Workflow
1. **Upload**: New product is analyzed.
2. **Identity Match**: System checks if a similar product (Brand + Shape) exists.
3. **Template Apply**: Reuses the successful VSO and SPIO from the master record.
4. **Scene Swap**: Optionally swaps the product into a previously generated "Best-Result" background plate.

## 3. Operational Goals
- **Retention**: Multi-product brands can generate suites 40% faster.
- **Consistency**: All products in a collection share identical lighting and environment plates.
