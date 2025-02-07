import { beforeEach, describe, expect, vi, test } from "vitest";

import { render, screen } from "@testing-library/react";

import { createAdmins } from "@seeds/admin";

const mockedAdminData = createAdmins();

import FormExample from "@components/FormExample/FormExample";

describe("FormExample test", async () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("FormExample empty admins", async () => {
    const { unmount } = render(<FormExample adminsIds={[]} />);

    expect(await screen.findByText("Admins list is empty")).toBeDefined();

    unmount();
  });

  test("FormExample with admins", async () => {
    const { unmount } = render(<FormExample adminsIds={mockedAdminData} />);
    const select = screen.getByRole("combobox", { name: "Choose admin id" });

    expect(await screen.findByText("Choose admin id")).toBeDefined();
    expect(select).toBeDefined();

    expect(
      screen.getAllByRole("option", {
        name: mockedAdminData[0].id.toString(),
        value: mockedAdminData[0].id.toString(),
      })
    ).toBeDefined();

    unmount();
  });

  // test('FormExample fill inputs', async () => {
  //   const select = screen.getByRole('combobox', { name: 'Choose admin id' });

  // const emailInput = screen.getByPlaceholderText('New email'),
  //   passwordInput = screen.getByPlaceholderText('New password');

  // const submitButton = screen.getByRole('button', { name: 'Submit' });

  //   const firstAdmin = mockedAdminData[0];

  //   const typedAdmin = {
  //     email: faker.internet.email(),
  //     password: faker.internet.password(),
  //   };

  //   await userEvent.selectOptions(select, firstAdmin.id.toString());
  //   await userEvent.type(emailInput, typedAdmin.email);
  //   await userEvent.type(passwordInput, typedAdmin.password);

  //   await act(async () => {
  //     submitButton.click();
  //   });

  //   // expect(updateForm).toHaveBeenCalledTimes(1);

  //   // await waitFor(() => {
  //   //   expect(updateForm).toHaveBeenCalledWith(expect.any(FormData));
  //   // });
  //   // await userEvent.selectOptions(select, mockedAdminData[1].id);
  // });
});
