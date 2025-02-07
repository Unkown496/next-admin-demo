import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";

import Page from "@/app/page";

describe("Test Index Page", () => {
  test("Have elements", () => {
    render(<Page />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Next-Admin app" })
    ).toBeDefined();

    expect(
      screen.getByRole("heading", { level: 2, name: "Example server actions" })
    ).toBeDefined();

    expect(screen.getByText("Admin update form")).toBeDefined();

    expect(screen.getByRole("button", { name: "Next App" })).toBeDefined();
  });
});
