import { updateForm } from '@actions/admin';
import { useActionState } from 'react';

/** @type {import('react').FC<{ adminsIds: number[] }>} */
export default function FormExample({ adminsIds = [] }) {
  const [state, formAction] = useActionState(async (_, formData) => {
    return await updateForm(formData);
  }, {});

  return (
    <form
      action={formAction}
      className="flex flex-col gap-2 border border-gray-500 p-2 rounded-xl"
    >
      {adminsIds.length > 0 ? (
        <>
          <label htmlFor="id">Choose admin id</label>
          <select
            required
            itemType="number"
            className="border border-gray-300 rounded-lg"
            name="id"
            id="id"
          >
            {adminsIds.map((admin, i) => {
              return (
                <option key={i} value={admin.id}>
                  {admin.id}
                </option>
              );
            })}
          </select>
        </>
      ) : (
        <>Admins list is empty</>
      )}

      <input
        type="text"
        required
        name="email"
        placeholder="New email"
        className="border border-gray-300 rounded-lg placeholder:px-3 p-1"
      />
      <input
        type="password"
        required
        name="password"
        placeholder="New password"
        className="border border-gray-300 rounded-lg placeholder:px-3 p-1"
      />

      {state?.error && <p className="text-red-500">{state.error}</p>}
      {!!state?.success && <p className="text-emerald-500">Success update!</p>}

      <button
        type="submit"
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-9 px-4 sm:px-5 sm:min-w-32"
      >
        Submit
      </button>
    </form>
  );
}
