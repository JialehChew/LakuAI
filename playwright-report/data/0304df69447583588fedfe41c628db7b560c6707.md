# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: v3-ui.spec.ts >> verify V3 UI elements
- Location: e2e/v3-ui.spec.ts:3:5

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('h2')
Expected substring: "Live Orchestration"
Received string:    "1Select Style"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('h2')
    9 × locator resolved to <h2 class="text-xl font-bold font-lexend mb-4 flex items-center gap-2">…</h2>
      - unexpected value "1Select Style"

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - complementary [ref=e3]:
    - link "LakuAI" [ref=e5] [cursor=pointer]:
      - /url: /
    - navigation [ref=e6]:
      - link "Generate" [ref=e7] [cursor=pointer]:
        - /url: /generate
        - img [ref=e8]
        - text: Generate
      - link "Library" [ref=e12] [cursor=pointer]:
        - /url: /library
        - img [ref=e13]
        - text: Library
    - generic [ref=e15]:
      - generic [ref=e17]:
        - img [ref=e18]
        - combobox [ref=e21]:
          - option "English" [selected]
          - option "Bahasa Melayu"
          - option "中文"
      - button "Sign Out" [ref=e22]:
        - img [ref=e23]
        - text: Sign Out
  - main [ref=e26]:
    - generic [ref=e27]:
      - link "LakuAI" [ref=e28] [cursor=pointer]:
        - /url: /
      - generic [ref=e29]:
        - img [ref=e30]
        - combobox [ref=e33]:
          - option "English" [selected]
          - option "Bahasa Melayu"
          - option "中文"
    - generic [ref=e35]:
      - generic [ref=e38]:
        - heading "Untilted Project" [level=1] [ref=e39]
        - img [ref=e40]
      - generic [ref=e42]:
        - generic [ref=e43]:
          - generic [ref=e45]:
            - img [ref=e47]
            - heading "Upload Product Photo" [level=3] [ref=e50]
            - paragraph [ref=e51]: Drag and drop or click to upload
            - button "Upload Product Photo Drag and drop or click to upload" [ref=e52]
          - button "Generate Image" [disabled] [ref=e54]:
            - img [ref=e55]
            - text: Generate Image
        - generic [ref=e58]:
          - generic [ref=e59]:
            - heading "1Select Style" [level=2] [ref=e60]
            - generic [ref=e61]:
              - button "minimalist Minimalist" [ref=e62]:
                - img "minimalist" [ref=e63]
                - generic [ref=e64]: Minimalist
              - button "studio Studio (Pro)" [ref=e65]:
                - img "studio" [ref=e66]
                - generic [ref=e67]: Studio (Pro)
              - button "tropical Tropical" [ref=e68]:
                - img "tropical" [ref=e69]
                - generic [ref=e70]: Tropical
              - button "festive Festive (Raya/CNY)" [ref=e71]:
                - img "festive" [ref=e72]
                - generic [ref=e73]: Festive (Raya/CNY)
              - button "cozy Cozy Home" [ref=e74]:
                - img "cozy" [ref=e75]
                - generic [ref=e76]: Cozy Home
          - generic [ref=e77]:
            - heading "Pro Tip 💡" [level=3] [ref=e78]
            - paragraph [ref=e79]: For best results, use a product photo with good lighting and a clear background. Our AI works best when the product is the main focus!
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  |
  3  | test('verify V3 UI elements', async ({ page }) => {
  4  |   await page.goto('/generate');
  5  |
  6  |   // Wait for the workspace to load
> 7  |   await expect(page.locator('h2')).toContainText('Live Orchestration');
     |                                    ^ Error: expect(locator).toContainText(expected) failed
  8  |
  9  |   // Check for the Taste Critic badge
  10 |   await expect(page.locator('span')).toContainText('Taste Critic');
  11 |
  12 |   // Check for the Workflow Blueprint items
  13 |   await expect(page.locator('span')).toContainText('V3 Taste Evaluation');
  14 |
  15 |   // Screenshot for verification
  16 |   await page.screenshot({ path: 'v3-ui-verification.png' });
  17 | });
  18 |
```