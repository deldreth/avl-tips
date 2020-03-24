import Config from "../../src/Config";

context("Footer", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Image attribution link", () => {
    let attributionLink;
    beforeEach(() => {
      attributionLink = cy.get("[data-cy=link-image-attribution]");
    });

    it("routes to config image url", () => {
      attributionLink
        .should("have.attr", "href")
        .and("equal", Config.image.attr.url);
    });

    it("has the artist name", () => {
      attributionLink.should("have.text", `Image: ${Config.image.attr.name}`);
    });
  });

  describe("Developers and Third Parties link", () => {
    it("routes to /dev", () => {
      cy.get("[data-cy=link-developers]").click();

      cy.url().should("equal", "http://localhost:3000/dev");
    });
  });

  describe("Contact link", () => {
    it("routes to config contact email", () => {
      cy.get("[data-cy=link-contact")
        .should("have.attr", "href")
        .and("equal", `mailto:${Config.mailto}`);
    });
  });
});
