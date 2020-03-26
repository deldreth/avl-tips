import { newSpecPage } from "@stencil/core/testing";
import { Tips } from "./tips";
import mockAxios from "jest-mock-axios";

describe("avl-tips", () => {
  afterEach(() => {
    mockAxios.reset();
  });

  it("matches snapshot", async () => {
    const page = await newSpecPage({
      components: [Tips],
      html: "<avl-tips></avl-tips>"
    });

    expect(page.root).toMatchSnapshot();
  });

  it("componentWillLoad sets state", () => {
    const tips = new Tips();
    const mockEmployee = {
      name: "Test Name",
      venmo: "Venmo",
      cash: "Cash",
      paypal: "Paypal",
      employer: "Employer"
    };

    tips.componentWillLoad();
    mockAxios.mockResponse({
      data: mockEmployee
    });

    expect(tips.employee).toEqual(mockEmployee);
  });
});
