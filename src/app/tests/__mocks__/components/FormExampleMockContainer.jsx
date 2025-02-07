import { createAdmins } from "@seeds/admin";

import FormExample from "@components/FormExample/FormExample";

export default function FormExampleContainer() {
  const adminsIds = createAdmins();

  return <FormExample adminsIds={adminsIds} />;
}
