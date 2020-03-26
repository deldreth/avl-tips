import { newSpecPage } from "@stencil/core/testing";
import { Card } from "./card";

describe("avl-tips-card", () => {
  describe("with venmo", () => {
    it("matches snapshot", async () => {
      const page = await newSpecPage({
        components: [Card],
        html:
          "<avl-tips-card name='Test Name' venmo='Venmo' employer='Employer'></avl-tips-card>"
      });

      expect(page.root).toMatchSnapshot();
    });
  });

  describe("with cash", () => {
    it("matches snapshot", async () => {
      const page = await newSpecPage({
        components: [Card],
        html:
          "<avl-tips-card name='Test Name' cash='Cash' employer='Employer'></avl-tips-card>"
      });

      expect(page.root).toMatchSnapshot();
    });
  });

  describe("with paypal", () => {
    it("matches snapshot", async () => {
      const page = await newSpecPage({
        components: [Card],
        html:
          "<avl-tips-card name='Test Name' paypal='Paypal' employer='Employer'></avl-tips-card>"
      });

      expect(page.root).toMatchSnapshot();
    });
  });

  describe("with all payment options", () => {
    it("matches snapshot", async () => {
      const page = await newSpecPage({
        components: [Card],
        html:
          "<avl-tips-card name='Test Name' venmo='Venmo' cash='Cash' paypal='Paypal' employer='Employer'></avl-tips-card>"
      });

      expect(page.root).toMatchSnapshot();
    });
  });
});
