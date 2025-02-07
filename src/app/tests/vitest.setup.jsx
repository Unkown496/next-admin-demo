import { vi } from "vitest";

import FormExample from "@mocks/components/FormExampleMock";
import FormExampleContainer from "@mocks/components/FormExampleMockContainer";

// vi.mock("@actions/admins", () => {
//   return {
//     updateForm: vi.fn(async _ => {
//       return { success: true };
//     }),
//   };
// });

vi.mock("@components/FormExample/FormExample", () => ({
  default: props => <FormExample {...props} />,
}));
vi.mock("@components/FormExample/FormExampleContainer", () => ({
  default: () => <FormExampleContainer />,
}));
