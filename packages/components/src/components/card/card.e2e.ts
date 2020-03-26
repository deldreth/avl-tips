import { newE2EPage } from "@stencil/core/testing";

describe("avl-tips-card", () => {
  it("renders", async () => {
    const page = await newE2EPage();

    await page.setContent("<avl-tips-card></avl-tips-card>");
    const element = await page.find("avl-tips-card");
    expect(element).toHaveClass("hydrated");
  });
});
