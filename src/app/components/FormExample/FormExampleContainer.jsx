"use server";

import { get } from "@actions/admin";

import FormExample from "./FormExample";

export default async function FormExampleContainer() {
  const adminsIds = await get();

  return <FormExample adminsIds={adminsIds} />;
}
