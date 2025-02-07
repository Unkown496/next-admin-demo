import { describe, expect, vi, test } from "vitest";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import HelloButton from "@components/HelloButton/HelloButton";

describe("HelloButton test", () => {
  // once render button component in suite
  render(<HelloButton />);

  // after run a tests
  test("HelloButton Click", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const helloButton = screen.getByRole("button");

    await userEvent.click(helloButton);

    expect(logSpy).toHaveBeenCalledWith("Hello!");

    logSpy.mockRestore();
  });

  test("HelloButton Definition", async () => {
    expect(screen.getByRole("button", { name: "Next App" })).toBeDefined();
  });
});
